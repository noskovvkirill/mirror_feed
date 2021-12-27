import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken'

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



import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcmqmkigakxeiuratohw.supabase.co'
const supabaseKey = process.env.SERVICE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

const ParseCookie = (cookies: string) => {
    const cookie = cookies
        .split(';')
        .reduce((res, c) => {
            const [key, val] = c.trim().split('=').map(decodeURIComponent)
            try {
                return Object.assign(res, { [key]: JSON.parse(val) })
            } catch (e) {
                return Object.assign(res, { [key]: val })
            }
        }, {}) as { token: string }
    return cookie.token
}

const ValidateCookie = (token: string) => {
    const payload = jwt.decode(token) as { exp: number, sub: string }
    if (!payload) return { exp: false, sub: undefined }
    const timeNow = Number(new Date())
    const expiration = timeNow - payload.exp
    if (expiration > 0) return { exp: false, sub: payload.sub }
    else return { exp: true, sub: payload.sub }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await cors(req, res);

    const { emailAddress } = req.body
    const nonce = uuidv4()
    const email = emailAddress.replace(/\\n/g, '').trim() as string;

    if (!email || !req.headers.cookie) {
        return res.status(500).json({ error: "email address was not found" })
    }

    const { exp: isValidCookie, sub } = ValidateCookie(ParseCookie(req.headers.cookie))

    if (!isValidCookie) {
        console.log('e0', 'not valid cookie')
        return res.status(500).json({ error: "invalid credentials" })
    }

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .match({ email: email })

    if (data && data.length > 0) {
        return res.status(409).json({ error: "someone else was already signed with this email" })
    }

    if (error) {
        console.log('e1', error)
        return res.status(500).json({ error: error.toString() })
    }

    //if user retries with different email, we invalidate the old request first
    const { error: errorConfirmations } = await supabase
        .from('users_email_confirmation')
        .delete()
        .eq('owner', sub)

    if (errorConfirmations) {
        console.log('e2', errorConfirmations)
        return res.status(500).json({ error: errorConfirmations.toString() })
    }

    const owner = sub;
    const expires_at = Number(new Date()) + 1800000
    const { error: nonceerror } = await supabase
        .from('users_email_confirmation')
        .insert({ nonce, email, owner, expires_at })

    if (nonceerror) {
        return res.status(500).json({ error: nonceerror.toString() })
    }
    return res.status(200).json({ message: "Confirmation was sent" });

}