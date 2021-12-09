import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";
const ipfsClient = require('ipfs-http-client')

export const config = {
  api:{
    bodyParser: false,
    sizeLimit: '2mb'
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




export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    await cors(req, res);
    const {cid} = req.query as {cid: string};
    if(!process.env.INFURA_SECRET || !cid){
        return res.status(400).json({error:'not uploaded'})
    }
  try{
    const auth =
    'Basic ' + Buffer.from(process.env.INFURA_SECRET).toString('base64')
    const client = ipfsClient.create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth
        }
    })
    const data = await client.pin.add(cid)
    res.status(200).json({data})
  } catch(e){
    res.status(400).json({error:JSON.stringify(e)})
  }
   
}
