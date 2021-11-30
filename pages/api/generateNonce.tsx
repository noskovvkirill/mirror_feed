import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";
import {v4 as uuidv4} from 'uuid';

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
    
    const {walletAddress} = req.body
    const nonce = uuidv4()

    const address = walletAddress as string;
    //TODO: Auth JWT 
    const { data, error } = await supabase
    .from('top')
    .select()
    .order('totalStaked', {ascending: true})

    if(error){
        return res.status(500).json({error: error.toString()})
    }

    return res.status(200).json({data});
}