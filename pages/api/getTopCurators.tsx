import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js'
import type {TopType} from 'pages/explore'

const supabaseUrl = 'https://tcmqmkigakxeiuratohw.supabase.co'
const supabaseKey = process.env.SERVICE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
   const { data, error } = await supabase
    .from('topSync')
    .select('*')
    .order('synced_at', {ascending: false})
    .limit(1)
    .single()
    const topCurators = data.topCurators as Pick<TopType, 'topCurators'>
    if(error){
        return res.status(500).json({error: error.message.toString()})
    }

    return res.status(200).json({topCurators});
}