import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcmqmkigakxeiuratohw.supabase.co'
const supabaseKey = process.env.SERVICE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const { owner_id } = req.query as { owner_id: string };
    if (!owner_id) { return res.status(500).json({ error: 'owner_id is not defined' }); }

    const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('owner', owner_id)



    if (error) return res.status(500).json({ error: error.message.toString() })


    return res.status(200).json({ data });
}