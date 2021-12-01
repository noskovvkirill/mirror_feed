import { NextApiRequest, NextApiResponse } from "next";
import {GovAbi} from 'contracts/Gov'
import {ethers} from 'ethers'
import { createClient } from '@supabase/supabase-js'
import {entriesSpaces, spaceInfo} from 'src/queriesFEED'
import {request} from 'graphql-request'
import jwt from 'jsonwebtoken'

const supabaseUrl = 'https://tcmqmkigakxeiuratohw.supabase.co'
const supabaseKey = process.env.SERVICE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    //need to add endpoint auth 

    const govAddress = process.env.NEXT_PUBLIC_GOV_CONTRACT;
    const endpoint = process.env.NEXT_PUBLIC_GRAPH_ENDPOINT;
    const secret = req.headers.authorization
    const signature = process.env.JWT_SECRET
    if(!govAddress || !endpoint || !secret || !signature) return res.status(500).json({error: 'gov contract address is not defined'});

    jwt.verify(secret, signature, async (err, decoded) => {
        if(err){
            res.status(403).json({
                success: false,
                error: `could not verify jwt signature.`,
            });
            return;
        }
        const {name} = decoded as {name: string}
        if(name !== 'Mirror Feed'){
            res.status(403).json({
                success: false,
                error: `could not verify jwt signature.`,
            });
            return;
        }
    })


    const provider = new ethers.providers.InfuraProvider("rinkeby", '87ff3775011f44d1ad3ae2c38d63d950')
    const govContract = await new ethers.Contract(govAddress, GovAbi, provider);
    const oneBlock = 13.39 //time in seconds 
    const oneWeek = 7*24*60*60/oneBlock 
    const currentBlock = await provider.getBlockNumber()
    const weekAgoBlock = (currentBlock-oneWeek).toFixed(0)
    const filter = govContract.filters.Staked(null, null, null, null, null);
    const eventsRaw = await govContract.queryFilter(filter, parseInt(weekAgoBlock), currentBlock)

    const filterT = govContract.filters.Unstaked(null, null, null, null);
    const eventsRawT = await govContract.queryFilter(filterT, parseInt(weekAgoBlock), currentBlock)
    //unstaked don't work atm 


    const events = eventsRaw.map((item:any)=>{
        return({
            id:`${item.args?.cid} ${item.args?.author.toLowerCase()}`,
            cid:item.args?.cid,
            author:item.args?.author,
            amount:item.args?.amount?.toString(),
            spaceid:item.args?.spaceid?.toString(),
        })
    })

    //we don't consider unstaked, but we should to prevent manipulation 
    // i.e movement back and forth :)

    // Entry -> Tokens staked  
    const combined = events.reduce((a, b) =>
    a.set(b.id, (a.get(b.id) || 0) + Number(b.amount)), new Map);

    //Space -> Tokens staked
    const spacesCombined =  events.reduce((a,b) => {
        return a.set(b.spaceid.toString(), (a.get(b.spaceid) || 0) + Number(b.amount))
    }, new Map)

    let spaces:{tokenId:number, staked:number}[] = []
    for (let [key, value] of spacesCombined.entries()) {
        spaces.push({
            tokenId:parseInt(key),
            staked:parseInt(ethers.utils.formatEther(value.toString()))
        })
    }
    
     const spacesExtended = await Promise.all(spaces.map(async (item)=>{
        const {space} = await request(endpoint, spaceInfo, {spaceId:`${item.tokenId}`})
        return({
            ...item,
            avatarURL:space.avatarURL,
            totalStaked:parseInt(ethers.utils.formatEther(space.totalStaked.toString())),
            owner:space.owner,
            name:space.name,
            createdAtTimestamp:space.createdAtTimestamp,
        })
     }))

    let obj = []
    for (let [key, value] of combined.entries()) {
        obj.push(
            {
            key:key,
            cid:key.split(' ')[0],
            author:key.split(' ')[1],
            totalStaked:ethers.utils.formatEther(value.toString())
        })
    }

    const totalStaked = obj.reduce((a,b)=>({totalStaked:a.totalStaked + Number(b.totalStaked)}), {totalStaked:0})

    
    const { data:sync, error:errorsync } = await supabase
    .from('topSync')
    .insert({synced_at:new Date().toISOString(), totalStaked:totalStaked.totalStaked, topCurators:spacesExtended})

    const objExtended = await Promise.all(obj.map(async (item)=>{
        try{
        const {entry} = await request(endpoint, entriesSpaces, {id:`${item.cid}-${item.author}`})
        const spaces = entry?.spaces.map((space:any)=>Object.assign({staked:space.totalStaked},space.space)).filter((space:any)=>space)
        //need to extend spaces with the amount of stake
        return({
            ...item,
            spaces:spaces ? spaces : [],
            syncId:sync && sync[0]?.id || 0
        })} catch(e){
            console.log('error fetch', e)
            return {item}
        }
    }))

    // console.log('objExtended', objExtended)

    // const { data:dataDelete, error:errorDelete } = await supabase.from('top').delete()

    // if(errorDelete){
    //     return res.status(500).json({error: errorDelete.toString()})
    // }

    const { data, error } = await supabase
    .from('top')
    .upsert(objExtended)
    
    if(error || errorsync){
        return res.status(500).json({message: error ? error.message.toString() : errorsync?.message.toString()})
    }

    return res.status(200).json({message:"OK"});
}