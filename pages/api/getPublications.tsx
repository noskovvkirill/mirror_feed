import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcmqmkigakxeiuratohw.supabase.co'
const supabaseKey = process.env.SERVICE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const { from, to } = req.query as { from: string, to: string };
    if (!from || !to) { return res.status(500).json({ error: 'from or to is not defined' }); }
    if (parseInt(to) - parseInt(from) > 20) { return res.status(500).json({ error: 'too many items' }); }

    const { data, error } = await supabase
        .from('mirrorpublications')
        .select('*')
        // .order('id', {ascending: false})
        .range(parseInt(from), parseInt(to))


    if (error) return res.status(500).json({ error: error.message.toString() })


    return res.status(200).json({ data });
}