import Layout from '@/design-system/Layout'
import type { GetServerSideProps } from 'next'
import { NFTE } from '@nfte/react';
import { createClient } from '@supabase/supabase-js'

export const getServerSideProps: GetServerSideProps = async () => {
    const supabaseUrl = 'https://tcmqmkigakxeiuratohw.supabase.co'
    const supabaseKey = process.env.SERVICE_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data: editions, error } = await supabase
        .from('mirroreditions')
        .select('*')

    // .order('timestamp', { ascending: false })
    // .limit(50)

    return { props: { editions } }
};

const NFT = ({ contract, tokenId }: { contract: string, tokenId: string }) => {
    return (
        <NFTE contract={contract} tokenId={tokenId} />
    )
}

const Editions = ({ editions }: any) => {
    return (
        <Layout>
            {console.table('editions', editions)}
            {editions.map((edition: any) => (
                <NFT
                    key={edition.editionId * edition.quantity}
                    contract={edition.address} tokenId={(edition.editionId * edition.quantity).toString()} />
            ))}
        </Layout>
    )
}

export default Editions