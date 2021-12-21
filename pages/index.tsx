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
    const host = req?.headers?.host?.split(".")[0];

    // res.setHeader(
    //     'Cache-Control',
    //     'public, s-maxage=1, stale-while-revalidate=59'
    // );

    const supabaseUrl = 'https://tcmqmkigakxeiuratohw.supabase.co'
    const supabaseKey = process.env.SERVICE_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    //home page
    if (!host || host === "www" ||
        (process.env.NODE_ENV === "development" && host.split(':')[0] === "localhost")) {
        console.log('home page', host)
        const { data, error } = await supabase
            .from('mirroritems_test')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(19)
        if (error || data === null) {
            return ({ notFound: true })
        }
        const newdata = data.map((item) => ({ entry: item }))
        return { props: { entries: newdata } }
    }

    const domain = req?.headers?.host?.split('.').slice(1, req?.headers?.host?.split('.').length)[0]
    return {
        redirect: {
            destination: process.env.NODE_ENV === "development" ? `http://${domain}/${host}` : `https://${domain}/${host}`,
            permanent: true,
        },
    }
};


type Props = {
    entries: { entry: EntryType }[]
}

const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) return null // reached the end
    const key = `/api/getMirrorItems?from=${20 * pageIndex}&to=${20 * pageIndex + 19}`
    return key
}

const fetcher = async (url: string) => {
    try {
        const data = await fetch(url).then(res => res.json()).then(({ data }) => data)
        const newdata = data.map((item: Pick<EntryType, "body" | "title" | "timestamp" | "author" | "digest" | "featuredImage">) => ({ entry: item }))
        return newdata
    } catch (e) {
        throw e
    }
}




const RenderList = ({ defaultState, ignoredList, pinnedList }: { defaultState: { entry: EntryType }[], ignoredList: IgnoredPublication[], pinnedList: PinnedItem[] }) => {
    const { data, error, isValidating, setSize } = useSWRInfinite(getKey, fetcher, { fallbackData: [defaultState] }) // tslint:disable-line

    const ref = useRef<HTMLDivElement | null>(null)
    const entry = useOnScreen(ref, {
        threshold: 0,
        rootMargin: '100%'
    })
    const isVisible = !!entry?.isIntersecting
    useEffect(() => {
        if (isVisible) {
            setSize((s) => s += 1)
        }
    }, [isVisible, setSize])
    if (!data) return <Loader size='default'>Patience...</Loader>
    if (error) return <Box>Something went wrong...Refresh the page  {JSON.stringify(error)}</Box>
    return (
        <Box css={{
            display: 'flex',
            flexDirection: 'column',
            width: '$body',
            overflow: 'visible',
            '@bp1': {
                width: '100%',
                maxWidth: '100%'
            },
        }}>
            {data?.map((page: any, indexPage: number) => {
                return page?.map(({ entry, index }: any) => {
                    if (ignoredList?.findIndex((item: IgnoredPublication) => entry.publication?.ensLabel === item.ensLabel || entry.author.address === item.ensLabel) === -1) {
                        if (pinnedList?.findIndex((item: PinnedItem) => item.type === 'entry' && item.item.digest === entry.digest) !== -1) {
                            return <></>;
                        } else {
                            return (
                                <Article
                                    view={'list'}
                                    key={entry.digest + 'list' + index * indexPage} entry={entry} />
                            )
                        }
                    } else {
                        return;
                    }
                })
            })}
            <Box css={{ padding: '$2 calc($4 * 4 + $1)', boxSizing: 'border-box', height: '48px', transition: '$all', color: '$foregroundText' }}>
                {isValidating &&
                    (<Loader size='default' />)
                }
            </Box>
            <div
                style={{ backgroundColor: 'red', opacity: 0, bottom: 0, height: '256px' }}
                ref={ref}>
                &nbsp;
            </div>
        </Box>
    )
}


const RenderCard = ({ defaultState, ignoredList, pinnedList }: { defaultState: { entry: EntryType }[], ignoredList: IgnoredPublication[], pinnedList: PinnedItem[] }) => {
    const { data, error, isValidating, setSize } = useSWRInfinite(getKey, fetcher, { fallbackData: [defaultState] }) // tslint:disable-line
    const ref = useRef<HTMLDivElement | null>(null)
    const entry = useOnScreen(ref, {
        threshold: 0,
        rootMargin: '100%'
    })
    const isVisible = !!entry?.isIntersecting
    useEffect(() => {
        if (isVisible) {
            setSize((s) => s += 1)
        }
    }, [isVisible, setSize])
    if (!data) return <Loader size='default'>Patience...</Loader>
    if (error) return <Box>Something went wrong...Refresh the page  {JSON.stringify(error)}</Box>

    return (
        <Box css={{
            display: 'grid',
            gridColumnGap: '32px',
            height: 'fit-content',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gridTemplateRows: "repeat(auto, minmax(0, 1fr))",
            width: '$body',
            '@bp1': {
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: '100%'
            },
            overflow: 'visible',
        }}>

            {data?.map((page: any, indexPage: number) => {
                return page?.map(({ entry, index }: any) => {
                    if (ignoredList?.findIndex((item: IgnoredPublication) => entry.publication?.ensLabel === item.ensLabel || entry.author.address === item.ensLabel) === -1) {
                        if (pinnedList?.findIndex((item: PinnedItem) => item.type === 'entry' && item.item.digest === entry.digest) !== -1) {
                            return <></>;
                        } else {
                            return (
                                <Article
                                    view={'card'}
                                    key={entry.digest + 'card' + index * indexPage} entry={entry} />
                            )
                        }
                    } else {
                        return;
                    }
                })
            })}

            <Box css={{ padding: '$2 calc($4 * 4 + $1)', boxSizing: 'border-box', height: '48px', transition: '$all', color: '$foregroundText' }}>
                {isValidating &&
                    (<Loader size='default' />)
                }
            </Box>
            <div
                style={{ backgroundColor: 'red', opacity: 0, bottom: 0, height: '256px' }}
                ref={ref}>
                &nbsp;
            </div>
        </Box>
    )
}

const Controls = Header.ViewControls



const Data = ({ entries }: Props) => {

    const ignoredList = useRecoilValueAfterMount(ignoredPublication, null) //we set the items to null to prevent initial rendering with empty values and waiting for the list to load
    const pinnedList = useRecoilValueAfterMount(pinnedItems, null) //we set the items to null to prevent initial rendering with empty values and waiting for the list to load
    const appSettings = useRecoilValue(settings)
    const [fetchOption, setFetchOption] = useState<string>('publications')
    const setCurrentArticle = useSetRecoilState(Current)

    useEffect(() => {
        setCurrentArticle({
            publication: null,
            author: null,
            title: null,
            digest: null
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entries])


    return (
        <Layout>
            <Box layout='flexBoxRow' css={{ width: '100%', justifyContent: 'space-between' }}>
                <Box layout='flexBoxColumn' css={{ width: '100%' }}>
                    <Header.Root controls={<Controls />}>
                        <Box layout='flexBoxColumn' css={{ width: '100%' }}>
                            <Box layout='flexBoxRow' css={{ position: 'relative', top: '-$1' }}>
                                <Heading
                                    size={'h1'}
                                    color={"foregroundText"}>
                                    Latest
                                </Heading>
                                <Heading
                                    size={'h1'}
                                    color={"highlight"}>
                                    &nbsp;Entries
                                </Heading>

                            </Box>
                        </Box>
                    </Header.Root>
                    {ignoredList !== null && pinnedList !== null && (
                        <>
                            {appSettings.view === 'card' && <RenderCard defaultState={entries} ignoredList={ignoredList} pinnedList={pinnedList} />}
                            {appSettings.view === 'list' && <RenderList defaultState={entries} ignoredList={ignoredList} pinnedList={pinnedList} />}
                        </>
                    )}
                </Box>
            </Box>
        </Layout>
    )
}



export default Data