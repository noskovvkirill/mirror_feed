import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js'
import type { SubscribedPublication } from 'contexts'

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
        .select('*, publication(ensLabel, avatarURL, displayName)')
        .eq('owner', owner_id)

    if (error || !data) return res.status(500).json({ error: error?.message.toString() })

    const subscribed: SubscribedPublication[] = data.map((item: {
        publication: {
            ensLabel: string,
            avatarURL: string,
            displayName: string
        }
    }) => {
        return ({
            ensLabel: item.publication.ensLabel,
            displayName: item.publication.displayName,
            type: 'ens',
            avatarURL: item.publication.avatarURL
        })
    })


    return res.status(200).json({ data: subscribed });
}