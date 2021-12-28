//components
import Layout from '@/design-system/Layout'
import Box from '@/design-system/primitives/Box'
import Article from '@/design-system/Article';
import Loader from '@/design-system/primitives/Loader'
import * as Header from '@/design-system/Feed/Header'
import Heading from '@/design-system/primitives/Heading'
import Profile from '@/design-system/primitives/Profile'
import Link from 'next/link'
import Button from '@/design-system/primitives/Button'
import Label from '@/design-system/primitives/Label'
import SubscribeSettings from '@/design-system/Feed/Header/SubscribeSettings'

//types
import type { EntryType } from '@/design-system/Entry'
import type { GetStaticProps } from 'next'

//state
import { request } from 'graphql-request';
import { Current, subscribedSpaces } from 'contexts'
import { useSetRecoilState } from 'recoil';
import { useEffect } from 'react';
import { queryEntry, queryPublication, queryPublications } from 'src/queries';
import { useAuth } from 'contexts/user'
import { useRecoilValueLoadable, useRecoilRefresher_UNSTABLE as useRecoilRefresher } from 'recoil';
//utils
import { supabase } from 'src/client'

const mirrorendpoint = process.env.NEXT_PUBLIC_MIRROR_API;

export async function getStaticPaths() {
  if (process.env.NODE_ENV === 'development') {
    const paths: Array<string | { params: { [key: string]: string } }> = []
    return ({ paths, fallback: 'blocking' })
  }
  const { publications } = await request(mirrorendpoint || '', queryPublications);
  const items: Array<string | { params: { [key: string]: string } }> = []
  const length = publications.slice(0, 10).length
  for (let i = 0; i <= length; i++) {
    const publication = publications[i]
    const entries = await request('https://mirror-api.com/graphql', queryPublication, {
      ensLabel: publication.ensLabel
    }).then((data) => data.publication.entries).catch(() => undefined)

    const entriesFiltered = entries.filter((entry: any) => entry.ensLabel)

    const path: Array<string | { params: { [key: string]: string } }> = entriesFiltered.map((entry: EntryType) => {
      const key = publication.ensLabel
      const keyNew = entry.digest
      return ({ params: { publication: key, article: keyNew } })
    })
    items.push(...path)
  }
  const paths = items.flat()
  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { article } = ctx.params as { article: string };
  if (!article) return ({ notFound: true })
  const entry = await request('https://mirror-api.com/graphql', queryEntry, {
    digest: article
  }).then((data) => data.entry)
    .catch((_) => {
      return { notFound: true }
    })

  return {
    props: { entry: entry },
    revalidate: 10
  }
};

type Props = {
  entry: EntryType;
}


const Data = ({ entry }: Props) => {
  const setCurrentArticle = useSetRecoilState(Current)
  const { user } = useAuth()
  const subscribed = useRecoilValueLoadable(subscribedSpaces(user?.id))
  const refreshSubscribed = useRecoilRefresher(subscribedSpaces(user?.id))

  const Subscribe = async (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      if (!user || !user.id) { reject('no user'); return }
      const { error } = await supabase.from('user_subscriptions')
        .insert([{ type: 'PUBLICATION', publication: entry.publication.ensLabel, owner: user.id }])
      if (error) {
        reject(error?.message)
        return;
      }
      refreshSubscribed()
      resolve()
    })
  }

  const Unsubscribe = async (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      if (!user || !user.id) { reject('no user'); return }
      if (!user || !user.id) { return }
      const { error } = await supabase.from('user_subscriptions')
        .delete()
        .eq('type', 'PUBLICATION')
        .eq('owner', user.id)
        .eq('publication', entry.publication.ensLabel)
      if (error) {
        reject(error?.message)
        return;
      }
      refreshSubscribed()
      resolve()
    })
  }

  useEffect(() => {
    if (entry) {
      setCurrentArticle({
        publication: {
          type: entry.publication?.ensLabel ? 'ens' : 'personal',
          ensLabel: entry.publication?.ensLabel || entry.author.displayName
        },
        author: entry.author.address,
        title: entry.title,
        digest: entry.digest
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry])

  if (entry) {
    return (
      <Layout title={`${entry.title} by ${entry.author?.displayName} | MirrorFeed`}>
        <Box layout='flexBoxColumn'>
          <Header.Root css={{ marginBottom: 'calc($4 * 1)' }} isFullScreen={true}>
            <Box layout='flexBoxRow' css={{
              width: '100%', gap: '$1', justifyContent: 'flex-start',
              '@bp1': {
                justifyContent: 'space-between'
              }
            }}>

              <Box layout='flexBoxRow'>
                <Profile
                  size={'md'}
                  profile={{ avatarURL: entry.publication?.avatarURL, displayName: entry.publication.ensLabel, ensLabel: entry.publication.ensLabel }} />
                &nbsp;&nbsp;
                <Link passHref={true} href={`/${entry.publication.ensLabel}`}>
                  <Box>
                    <Heading
                      css={{ cursor: 'pointer', transition: '$color', '&:hover': { color: '$foregroundTextBronze' } }}
                      size={'h3'}
                      color={"foregroundText"}>{entry.publication.ensLabel}&nbsp;</Heading>
                  </Box>
                </Link>
                <Heading
                  css={{
                    '@bp1': {
                      display: 'none!important'
                    }
                  }}
                  size={'h3'}
                  color={"highlight"}>
                  {entry.author?.displayName}
                  {/* Space #{space.tokenId} */}
                </Heading>
              </Box>

              <Box css={{
                padding: '0 $2', alignItems: 'center', color: '$foreground', gap: '$2',
                '@bp1': { padding: '0' }
              }} layout='flexBoxRow'>
                {/* <Label>Coming Soon</Label>
                <Button disabled>Subscribe</Button> */}

                <SubscribeSettings
                  size='small'
                  disabled={!user?.isConnected || !user.id || subscribed.state === 'loading' || subscribed.state === 'hasError'}
                  Subscribe={Subscribe}
                  Unsubscribe={Unsubscribe}
                  isSubscribed={subscribed.state === 'hasValue' && subscribed.contents?.find((item: any) => item.ensLabel === entry.publication.ensLabel)}
                />

              </Box>

            </Box>

          </Header.Root>
          <Article key={entry.digest} entry={entry} isPreview={false} />
        </Box>
      </Layout>
    )
  } else {
    return (
      <Layout>
        <Box layout='flexBoxColumn'>
          <Loader size='default'>Patience</Loader>
        </Box>
      </Layout>)
  }
}

export default Data