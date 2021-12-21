import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken'
import Cookies from 'cookies'
import { createClient } from '@supabase/supabase-js'

import { ethers } from 'ethers'
export const config = {
    api: {
        bodyParser: true,
    },
}

function initMiddleware(middleware: any) {
    return (req: NextApiRequest, res: NextApiResponse) =>
        new Promise((resolve, reject) => {
            middleware(req, res, (result: any) => {
                if (result instanceof Error) {
                    return reject(result);
                }
                return resolve(result);
            });
        });
}
const cors = initMiddleware(
    Cors({
        methods: ["POST"],
    })
);

const supabaseUrl = 'https://tcmqmkigakxeiuratohw.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SECRET || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await cors(req, res);
    try {
        const { publication, owner } = req.body
        console.log(publication, owner)
        const cookies = new Cookies(req, res)
        const token = cookies.get('token')
        console.log(token)
        if (!token) {
            return res.status(500).json({ error: "not authorized" })
        }
        supabase.auth.setAuth(token)
        const { data, error } = await supabase.from('subscription')
            .upsert({ type: 'publication', publication: publication, owner: owner })
        console.log(data)
        if (error) {
            console.log(error)
            return res.status(500).json({ error: error?.message.toString() })
        }
        return res.status(200).json({ message: "subscribed" })

    } catch (e: unknown) {
        if (typeof e === "string") {
            return res.status(500).json({ error: e?.toString() })
        } else if (e instanceof Error) {
            return res.status(500).json({ error: e?.message.toString() })
        }
    }


}