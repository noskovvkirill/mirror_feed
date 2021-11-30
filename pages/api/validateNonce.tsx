import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";

import {ethers} from 'ethers'
export const config = {
  api:{
    bodyParser: false,
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    await cors(req, res);
    try{
        const {nonce, walletAddress, signature} = req.body
        const address = walletAddress as string;
        const addr=ethers.utils.verifyMessage(nonce, signature)

        if(addr !== address) {
            throw "invalid user"
        }
           
    // const token = jwt.sign({
    //     "aud":"authenticated",
    //     "exp": Math.floor(Date.now() / 1000) + (60 * 60),
    //     "sub":"authenticated",
    //     "role":"authenticated"
    // }, process.env.SUPABASE_JWT_SECRET || '')
    
        const { data, error } = await supabase
        .from('top')
        .select()
        .order('totalStaked', {ascending: true})
        if(error){
            throw "invalid user"
        }
        return res.status(200).json({data});
    } catch(e:unknown){
         if (typeof e === "string") {
            return res.status(500).json({error: e?.toString()})
        } else if (e instanceof Error) {
            return res.status(500).json({error: e?.message.toString()})
        }
    }
}