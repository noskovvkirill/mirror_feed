import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcmqmkigakxeiuratohw.supabase.co'
const supabaseKey = process.env.SERVICE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const { data: owners, error: errorOwners } = await supabase.from('user_subscriptions')
        .select('owner')
        .eq('type', 'PUBLICATION')
        .eq('publication', 'pwn')

    console.log(owners)
    const ownersList = owners.reduce((acc, item) => [item.owner, ...acc], [])
    console.log('list', ownersList)
    const { data: emails, error } = await supabase
        .from('users')
        .select('email')
        .in('id', ownersList)
        .neq('email', null)
        .eq('areNotificationsEnabled', true)

    const json = {
        body:
            '{"type": "INSERT", "table": "mirroritems_test", "record": {"id": 44455, "body": "We have tools to communicate with billions of people but our tools to coordinate with people haven’t kept up with this. It has been over twelve years since Satoshi published the Bitcoin whitepaper. Since then, we’ve had several successful experiments in human coordination. It is clear to me that crypto will re-orient society. It will affect how people think, feel, and live.\\n\\nIt was [easy](https://quoteinvestigator.com/2019/10/23/traffic/) to predict the automobile in 1880; it was difficult to predict the traffic jam. For a technology to affect the way we live, society needs to be re-oriented around it. For the automobile to affect the way people lived, we needed to build roads, highways, traffic signals, parking garages, drive thru restaurants, seatbelts, traffic laws, and toll stations. Over the next few decades, we will build the infrastructure needed for crypto to affect the way people live.\\n\\nThis blog will focus on crypto and society. I will dive into crypto projects and protocols, Etherscan transactions, Discord and Telegram chats, governance proposals, and smart contract exploits. I will cover pseudonymous reputation and justice, DeFi, DAOs, social tokens, NFTs, decentralized governance, encryption, digital nation states, and more. I will write about how crypto will re-orient society.\\n\\nDM me on Twitter at [@HelloShreyas](https://twitter.com/HelloShreyas) if you have any thoughts or questions.", "title": "Hello world test", "author": {"address": "0x10D6d2e343281D388291A3e02f3293AaEdA67178", "displayName": "helloshreyas"}, "digest": "6573b67b491d423c8b6eb3ad89aae63048aa85a5ce81c2cf54205dc515defefc", "timestamp": "1609793515", "publication": {"ensLabel": "helloshreyas"}, "featuredImage": null}, "schema": "public", "old_record": null}',
    }



    if (error) return res.status(500).json({ error: error.message.toString() })


    return res.status(200).json({ emails });
}