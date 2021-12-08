import Layout from '@/design-system/Layout'
import Box from '@/design-system/primitives/Box'
import Label from '@/design-system/primitives/Label'
import Tag from '@/design-system/primitives/Tag'
import Heading from '@/design-system/primitives/Heading'
import { styled } from 'stitches.config'

import type { GetServerSideProps } from 'next'
import { NFTE } from '@nfte/react';
import { createClient } from '@supabase/supabase-js'
import { request } from 'graphql-request'
import { useEffect, useState } from 'react'
import { queryEditions } from 'src/queries'
import useSWR from 'swr'

export const getServerSideProps: GetServerSideProps = async () => {
    const supabaseUrl = 'https://tcmqmkigakxeiuratohw.supabase.co'
    const supabaseKey = process.env.SERVICE_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data: editions, error } = await supabase
        .from('mirroreditions')
        .select('*')
        .order('id', { ascending: false })

    // .order('timestamp', { ascending: false })
    // .limit(50)

    return { props: { editions } }
};

const fetcher = async (editionId: string) => {
    if (!process.env.NEXT_PUBLIC_MIRROR_API) { return undefined }
    const { edition } = await request(process.env.NEXT_PUBLIC_MIRROR_API, queryEditions, { editionId: parseInt(editionId), editionContractAddress: "0x3725CA6034bcDBc3c9aDa649d49Df68527661175" })
    return edition
}

const NFT = ({ contract, editionId }: { contract: string, editionId: string }) => {
    const { data, error, isValidating } = useSWR(editionId, fetcher)
    if (error) {
        return (
            <Box></Box>
        )
    }
    return (
        <Box layout='flexBoxColumn' css={{ padding: '$2', background: '$highlight', width: '$body', overflow: 'hidden', borderRadius: '$2' }}>
            <Heading>{data?.title}</Heading>
            <Box layout='flexBoxRow' css={{ gap: '$0' }}>
                <Tag>{data?.quantity}</Tag>
                <Tag>{data?.price} ETH</Tag>
                <Tag>{data?.fundingRecipient}</Tag>
            </Box>
            {data?.primaryMedia?.mimetype === 'video/mp4' && (
                <Box>
                    <Box as='picture' css={{ width: 'auto', height: '100%' }}>
                        {/* {data?.primaryMedia?.sm && Object.keys(data?.primaryMedia?.sizes).map((item, index) => {
                            if (data?.primaryMedia?.sizes[item])
                                return ( */}
                        {/* {data?.primaryMedia && data?.primaryMedia[Object.keys(data?.primaryMedia.sizes).filter(item => data?.primaryMedia.sizes[item] !== null).reverse()[0]]?.toString()} */}
                        {/* <video
                            width="auto"
                            height="100%"
                            controls
                            autoPlay
                            muted
                            src={data?.primaryMedia && data?.primaryMedia[Object.keys(data?.primaryMedia.sizes).filter(item => data?.primaryMedia.sizes[item] !== null).reverse()[0].toString()]?.src} key={'image+' + data?.primaryMedia?.sm?.src} alt="" /> */}

                    </Box>
                </Box>
            )}

            {data?.primaryMedia?.mimetype === 'image/jpeg' || data?.primaryMedia?.mimetype === 'image/png' && (
                <Box css={{ marginRight: '$4', borderRadius: '$2', overflow: 'hidden', width: '100%', height: '320px' }}>
                    <Box as='picture' css={{ width: 'auto', height: '100%' }}>
                        {data?.thumbnailMedia?.sizes && Object.keys(data?.thumbnailMedia?.sizes).map((item, index) => {
                            if (data?.thumbnailMedia?.sizes[item])
                                return (
                                    <img
                                        width="auto"
                                        height="100%"
                                        src={data?.thumbnailMedia?.sizes[item].src} key={index + 'image'} alt="" />
                                )
                        })}
                    </Box>
                </Box>
            )}

        </Box >
        // <NFTE contract={contract} tokenId={tokenId} />
    )
}

const Editions = ({ editions }: any) => {
    return (
        <Layout>
            {console.table('editions', editions)}
            {editions.map((edition: any) => (
                <NFT
                    key={edition.editionId * edition.quantity}
                    contract={edition.address} editionId={(edition.editionId).toString()} />
            ))}
        </Layout>
    )
}

export default Editions