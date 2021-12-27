//opens up the link and adds user email
// redirects user to the home page with email confiramtion flag set to true
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcmqmkigakxeiuratohw.supabase.co'
const supabaseKey = process.env.SERVICE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { nonce, owner } = req.query;

    if (!nonce || !owner) {
        return res.redirect(400, '/')
    }

    const { data, error } = await supabase
        .from('users_email_confirmation')
        .select('nonce, email, expires_at')
        .eq('owner', owner)
        .single()


    if (error) {
        return res.redirect(400, '/')
    }

    if (data.nonce === nonce) {
        if (data.expires_at >= Number(new Date())) {
            const { error: errorUpdate } = await supabase.from('users')
                .update({ email: data.email, areNotificationsEnabled: true })
                .eq('id', owner)
            if (errorUpdate) {
                return res.redirect(400, '/')
            }
            const { error: errorConfirmations } = await supabase
                .from('users_email_confirmation')
                .delete()
                .eq('owner', owner)

            if (errorConfirmations) {
                return res.redirect(400, '/')
            }

            return res.redirect('/')
        }
    }
    return res.redirect(400, '/')
}

