import Layout from '@/design-system/Layout'
import Box from '@/design-system/primitives/Box'
import { request } from 'graphql-request';
import type { GetStaticProps } from 'next'
import Article from '@/design-system/Article';
import type { EntryType } from '@/design-system/Entry'
// import type {CurrentArticle} from 'contexts'
import { Current } from 'contexts'
import { useSetRecoilState } from 'recoil';
import { useEffect } from 'react';
import { queryEntry, queryPublication, queryPublications } from 'src/queries';
import Loader from '@/design-system/primitives/Loader'
import * as Header from '@/design-system/Feed/Header'
import Heading from '@/design-system/primitives/Heading'
import Profile from '@/design-system/primitives/Profile'
import Link from 'next/link'
const mirrorendpoint = process.env.NEXT_PUBLIC_MIRROR_API;

// const entries = await request('https://mirror-api.com/graphql', queryPublication, {
//         ensLabel: publication
//     }).then((data) =>data.publication.entries).catch(()=>{return})
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
    .catch((e) => {
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
      <Layout>
        <Box layout='flexBoxColumn'>
          <Header.Root css={{ marginBottom: 'calc($4 * 1)' }}>
            <Box layout='flexBoxRow' css={{ gap: '$4' }}>
              <Box layout='flexBoxColumn'>
                <Box layout='flexBoxRow'>
                  <Profile
                    size={'md'}
                    profile={{ avatarURL: entry.publication.avatarURL, name: entry.publication.ensLabel }} />
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
                    size={'h3'}
                    color={"highlight"}>
                    {entry.author?.displayName}
                    {/* Space #{space.tokenId} */}
                  </Heading>


                </Box>

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