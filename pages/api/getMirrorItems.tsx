import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js'
import {queryPublications, queryPublication} from 'src/queries'
import {request} from 'graphql-request'
import { EntryType } from "@/design-system/Entry";

const supabaseUrl = 'https://tcmqmkigakxeiuratohw.supabase.co'
const supabaseKey = process.env.SERVICE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    //need to add endpoint auth 
    const mirrorendpoint = process.env.NEXT_PUBLIC_MIRROR_API;
    if(!mirrorendpoint) {return res.status(500).json({error: 'gov contract address is not defined'});}
    const {from, to} = req.query as {from: string, to:string};
    if(!from || !to) {return res.status(500).json({error: 'from or to is not defined'});}
    if(parseInt(to)-parseInt(from) >20) {return res.status(500).json({error: 'too many items'});}

    const { data, error } = await supabase
    .from('mirroritems')
    .select('*')
    .order('id', {ascending: false})
    .range(parseInt(from), parseInt(to))
  
    
     if(error) return res.status(500).json({message: error.message.toString()})
    

    return res.status(200).json({message:"OK"});
}