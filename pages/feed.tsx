import Layout from '@/design-system/Layout'
import Box from '@/design-system/primitives/Box'
import Article from '@/design-system/Article/ArticleShort'
import Heading from '@/design-system/primitives/Heading'
import * as Header from '@/design-system/Feed/Header'
import type { GetServerSideProps } from 'next'
import useSWRInfinite from 'swr/infinite'
import { useRef, useEffect, useState } from 'react'
import useOnScreen from 'hooks/useOnScreen'
import Loader from '@/design-system/primitives/Loader'
//global state
import { ignoredPublication, pinnedItems, PinnedItem, IgnoredPublication, settings, Current } from 'contexts'
import { useRecoilValueAfterMount } from 'hooks/useRecoilValueAfterMount'
import { useRecoilValue, useSetRecoilState } from 'recoil'
//utils
import { createClient } from '@supabase/supabase-js'
//type
import type { EntryType } from '@/design-system/Entry'


export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {


    const supabaseUrl = 'https://tcmqmkigakxeiuratohw.supabase.co'
    const supabaseKey = process.env.SERVICE_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    //home page

    const { data: dataPublications, error: errorPublications } = await supabase.from('user_subscriptions')
        .select('publication')
        .eq('owner', '75a4cda7-6215-40a8-b540-4921822748f0')

    // const query = dataPublications?.reduce((prev, current) => [...prev, `"${current.publication}"`], []).join(',')
    const list = dataPublications?.reduce((prev, current) => [...prev, current.publication], [])

    // console.log('data', query)

    const { data, error } = await supabase
        .from('mirroritems_test')
        .select('*')
        .order('timestamp', { ascending: false })
        .eq('isPublished', true)
        .in('publicationName', list)
        // .filter('publicationName', 'in', `(${query})`)
        .limit(19)


    if (error || data === null) {
        return { props: { entries: [] } }
    }

    return ({
        props: {
            data: data
        }
    })
}

const Feed = ({ data }) => {
    return (
        <Layout>
            {data.map((item) => {
                return (
                    <Box>
                        {item.publicationName}
                    </Box>
                )
            })}
        </Layout>
    )
}

export default Feed