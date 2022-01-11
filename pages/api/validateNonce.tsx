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
const supabaseKey = process.env.SERVICE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await cors(req, res);
  try {
    const { nonce, walletAddress, signature } = req.body
    const address = walletAddress as string;
    const addr = ethers.utils.verifyMessage(nonce, signature)

    if (addr !== address) {
      throw "invalid user"
    }

    let { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('address', address)
      .eq('nonce', nonce)
      .single()

    if (!user || error) {
      throw "database error"
    }
    const selectedUser = user as { id: string, address: string }
    const expires = Number(new Date()) + 604800000
    console.log({
      "aud": "authenticated",
      "exp": expires,
      "sub": selectedUser.id,
      "role": "authenticated",
      "user_metadata": {
        "id": selectedUser.id,
      },
    })
    const token = jwt.sign({
      "aud": "authenticated",
      "exp": expires,
      "sub": selectedUser.id,
      "role": "authenticated",
      "user_metadata": {
        "id": selectedUser.id,
      },
    }, process.env.SUPABASE_JWT_SECRET || '')
    const cookies = new Cookies(req, res)
    try {
      cookies.set('token', token, {
        httpOnly: false,
        sameSite: 'strict',
        expires: new Date(expires)
      })
    } catch (e: unknown) {
      if (typeof e === "string") {
        return res.status(500).json({ error: e?.toString() })
      } else if (e instanceof Error) {
        return res.status(500).json({ error: e?.message.toString() })
      }
    }
    const id = selectedUser.id
    return res.status(200).json({ token, id });
  } catch (e: unknown) {
    if (typeof e === "string") {
      return res.status(500).json({ error: e?.toString() })
    } else if (e instanceof Error) {
      return res.status(500).json({ error: e?.message.toString() })
    }
  }
}