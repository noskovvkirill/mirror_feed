

import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js'
import { queryCrowdfunds } from 'src/queriesEditions'
import { request } from 'graphql-request'
import jwt from 'jsonwebtoken'
import { ethers } from 'ethers'
import EditionsABI from 'contracts/MirrorEditions'
const supabaseUrl = 'https://tcmqmkigakxeiuratohw.supabase.co'
const supabaseKey = process.env.SERVICE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)
const editionsContractMirror = "0x3725CA6034bcDBc3c9aDa649d49Df68527661175"


export const config = {
    api: {
        bodyParser: false,
    },
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const endpoint = process.env.NEXT_PUBLIC_MIRROR_CONTRACTS_GRAPH_ENDPOINT;
    const secret = req.headers.authorization
    const signature = process.env.JWT_SECRET

    if (!endpoint || !secret || !signature || !editionsContractMirror) return res.status(500).json({ error: 'env variables not defined' });


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

    const provider = new ethers.providers.InfuraProvider("mainnet", '87ff3775011f44d1ad3ae2c38d63d950')
    const editionsContract = new ethers.Contract(editionsContractMirror, EditionsABI, provider);
    const filter = editionsContract.filters.EditionCreated();
    // const filterBurn = editionsContract.filters.Transfer(null, "0x0000000000000000000000000000000000000000", null);
    // "0x3184FAf9C62c9E45A92553Cef9eb866B692a2e06"
    // "0x0000000000000000000000000000000000000000"
    const eventsRaw = await editionsContract.queryFilter(filter)
    // const eventsRawBurn = await editionsContract.queryFilter(filterBurn)

    const editions = eventsRaw.map((edition) => {
        return ({
            editionId: edition.args.editionId.toString(),
            address: editionsContractMirror,
            quantity: parseInt(edition.args.quantity.toString()),
        })
    })

    // console.log('editions!', eventsRawBurn)

    // blockNumber
    // const { crowdfunds } = await request(endpoint, queryCrowdfunds)

    // const editions = crowdfunds.reduce((acc: any, arg: any) => {
    //     return [...acc, ...arg.editionsContract.editions]
    // }, [])


    const { error } = await supabase
        .from('mirroreditions')
        .upsert(editions)
    if (error) return res.status(500).json({ error: error.message.toString() })
    return res.status(200).json({ message: "OK" });
}