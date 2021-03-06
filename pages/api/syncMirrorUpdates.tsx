import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js'
import {queryPublications, queryPublication} from 'src/queries'
import {request} from 'graphql-request'
import { EntryType } from "@/design-system/Entry";
import jwt from 'jsonwebtoken'

const supabaseUrl = 'https://tcmqmkigakxeiuratohw.supabase.co'
const supabaseKey = process.env.SERVICE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export const config = {
  api:{
    bodyParser: false,
  },
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    //need to add endpoint auth 
    const govAddress = process.env.NEXT_PUBLIC_GOV_CONTRACT;
    const endpoint = process.env.NEXT_PUBLIC_GRAPH_ENDPOINT;
    const mirrorendpoint = process.env.NEXT_PUBLIC_MIRROR_API;
    const secret = req.headers.authorization
    const signature = process.env.JWT_SECRET

    if(!govAddress || !endpoint || !mirrorendpoint || !secret || !signature) return res.status(500).json({error: 'gov contract address is not defined'});
   

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


    const { data:dataLast, error:errorLast } = await supabase
    .from('mirroritems')
    .select('id')
    .order('id', {ascending: false})
    .limit(1) //last id 
     if(errorLast) return res.status(500).json({error: errorLast})
    
    const idLast = (dataLast && dataLast.length>0) ? dataLast[0]?.id : null
    const {publications} = await request(mirrorendpoint, queryPublications);

    type Publication = {
        ensLabel:string, timestamp:number, id:number,
        entries:EntryType[]
    }

    const entries:Publication[] = await Promise.all(publications.map(async (item:{ensLabel:string}) => {
        try{
            const {publication} = await request(mirrorendpoint, queryPublication, {ensLabel: item.ensLabel})
            return publication.entries
        } catch(e){
            console.log(e)
            return []
        }
    }))
    const sorted:Publication[] = entries.reduce((acc:any, publ:any)=>[...acc, ...publ], [])
    .sort((a:Publication,b:Publication)=>b.timestamp-a.timestamp)
    .filter((thing:Publication, index:number, self:Publication[]) =>
    index === self.findIndex((t:Publication) => (
        t.id === thing.id && t.id === thing.id
    )))

    if(idLast === sorted[0].id) return res.status(200).json({message: 'no updates'})
        
     const { data, error } = await supabase
    .from('mirroritems')
    .upsert(sorted)
    if(error) return res.status(500).json({error: error.message.toString()})
    return res.status(200).json({message:"OK"});
}