import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js'
import { queryVerifiedAccounts } from 'src/queries'
import { request } from 'graphql-request'
// import { EntryType } from "@/design-system/Entry";
import jwt from 'jsonwebtoken'

const supabaseUrl = 'https://tcmqmkigakxeiuratohw.supabase.co'
const supabaseKey = process.env.SERVICE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export const config = {
    api: {
        bodyParser: false,
    },
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const mirrorendpoint = process.env.NEXT_PUBLIC_MIRROR_API;
    const secret = req.headers.authorization
    const signature = process.env.JWT_SECRET

    if (!mirrorendpoint || !secret || !signature) return res.status(500).json({ error: 'gov contract address is not defined' });


    jwt.verify(secret, signature, async (err, decoded) => {
        if (err) {
            res.status(403).json({
                success: false,
                error: `could not verify jwt signature.`,
            });
            return;
        }
        const { name } = decoded as { name: string }
        if (name !== 'Mirror Feed') {
            res.status(403).json({
                success: false,
                error: `could not verify jwt signature.`,
            });
            return;
        }
    })

    // In progress

    // const { verifiedAccounts }: { verifiedAccounts: Account[] } = await request(mirrorendpoint, queryVerifiedAccounts);

    // type Account = {
    //     username: string,
    //     account: string,
    //     signature:string
    // }



    // const { error } = await supabase
    //     .from('mirrorauthors')
    //     .upsert(verifiedAccounts)
    // if (error) return res.status(500).json({ error: error.message.toString() })
    return res.status(200).json({ message: "OK" });
}