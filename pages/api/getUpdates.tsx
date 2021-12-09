import { NextApiRequest, NextApiResponse } from "next";
import {GovAbi} from 'contracts/Gov'
import {ethers, BigNumber} from 'ethers'
import request from "graphql-request";
import { queryEntryPreview } from "src/queries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    try{
        const { spaceId, fromBlock} = req.query;
        const provider = new ethers.providers.InfuraProvider("rinkeby", '87ff3775011f44d1ad3ae2c38d63d950')
        const govAddress = process.env.NEXT_PUBLIC_GOV_CONTRACT
        if(!govAddress) {return res.status(500).json({error:"gov address was not found"})}
        const govContract = await new ethers.Contract(govAddress, GovAbi, provider);
        const filter = govContract.filters.Staked(null, BigNumber.from(spaceId), null, null, null);
        const events = await govContract.queryFilter(filter, fromBlock === 'latest' ? 'latest' : parseInt(fromBlock.toString()), 'latest') 
        const updates = events.map((ev:any)=>{
            return ev.args.cid;
        }) 
        const contentFilter = [...new Set(updates)];

        const entries = await Promise.all(contentFilter.map(async (item:any) => {
        return(await request('https://mirror-api.com/graphql', queryEntryPreview, {
        digest: item
        }).then((data) =>
            { return ({entry:data.entry, stacked:item.stacked})}
        ).catch((e:any)=>{throw e})
        )
        }))

        const entriesFiltered = entries.filter(function( element:any ) {
            return element !== undefined;
        });

        return res.status(200).json({updates:entriesFiltered});
    } catch(e:any) {
        console.log(e);
        return res.status(500).json({error: e.toString()})
    }
}