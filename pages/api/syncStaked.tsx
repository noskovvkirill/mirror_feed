import { NextApiRequest, NextApiResponse } from "next";
import {GovAbi} from 'contracts/Gov'
import {ethers, BigNumber} from 'ethers'
import { createClient } from '@supabase/supabase-js'
import {entriesSpaces} from 'src/queriesFEED'
import {request} from 'graphql-request'

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
    if(!govAddress || !endpoint) return res.status(500).json({error: 'gov contract address is not defined'});
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
    console.log('events raw T', eventsRawT)

    const events = eventsRaw.map((item:any)=>{
        return({
            id:`${item.args?.cid}_${item.args?.author.toLowerCase()}`,
            cid:item.args?.cid,
            author:item.args?.author,
            amount:item.args?.amount?.toString(),
        })
    })

    //we don't consider unstaked, but we should to prevent manipulation 
    // i.e movement back and forth :)

    const combined = events.reduce((a, b) =>
    a.set(b.id, (a.get(b.id) || 0) + Number(b.amount)), new Map);
    let obj = []
    let i = 0;
    for (let [key, value] of combined.entries()) {
        obj.push(
            {
            id:i,
            key:key,
            cid:key.split('_')[0],
            author:key.split('_')[1],
            totalStaked:ethers.utils.formatEther(value.toString())
        })
        i++;
    }

   
    const objExtended = await Promise.all(obj.map(async (item)=>{
        try{
        const {entry} = await request(endpoint, entriesSpaces, {id:`${item.cid}-${item.author}`})
        const spaces = entry.spaces.map(({space}:any)=>space).filter((space:any)=>space)
        return({
            ...item,
            spaces:spaces
        })} catch(e){
            console.log('error fetch', e)
            return {item}
        }
    }))

    const { data:dataDelete, error:errorDelete } = await supabase.from('top').delete()

    if(errorDelete){
        return res.status(500).json({error: errorDelete.toString()})
    }

    const { data, error } = await supabase
    .from('top')
    .insert(objExtended)
    
    if(error){
        return res.status(500).json({error: error.toString()})
    }

    return res.status(200).json({data});
}