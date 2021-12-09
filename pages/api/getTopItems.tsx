import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcmqmkigakxeiuratohw.supabase.co'
const supabaseKey = process.env.SERVICE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
   
    //TODO: Auth JWT 
    const { data, error } = await supabase
    .from('top')
    .select()
    .order('totalStaked', {ascending: true})

    if(error){
        return res.status(500).json({error: error.toString()})
    }

    return res.status(200).json({data});
}