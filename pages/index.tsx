import Layout from '@/design-system/Layout'
import Box from '@/design-system/primitives/Box'
import { request, gql } from 'graphql-request';
import type { GetServerSideProps } from 'next'
import Button from '@/design-system/primitives/Button'

import * as dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import Markdown from 'markdown-to-jsx';

const queryEntry = gql`
query Entry($digest: String!) {
  entry(digest: $digest) {
       id
        body
        digest
        timestamp
        title
        author{
          displayName
          id
        }
    }
 __typename
}`

const query = gql`
{
		transactions(first:20, tags: [{ name: "App-Name", values: ["MirrorXYZ"] }]) {
			edges {
				node {
					id
					tags {
						name
						value
					}
				}
			}
		}
	}`
export const getServerSideProps: GetServerSideProps = async () => {
  const data = await request('https://arweave.net/graphql', query).then(({ transactions }) =>{
      return transactions.edges
  });

  const content = data.map(({node:{tags}}:{node:{tags:any}})=>{
     return tags.find((c:any)=>c.name === 'Original-Content-Digest').value
  })


const entries = await Promise.all([...new Set(content)].map(async (item:any) => {
    return(await request('https://mirror-api.com/graphql', queryEntry, {
       digest: item
    }).then((data) =>
      data.entry
    ).catch(()=>{return})
    )
  }))

  const entrieFiltered = entries.filter(function( element:any ) {
   return element !== undefined;
});

  return {props:{entries:entrieFiltered}}
 
};
type Props = {
    entries:any[]
}

type PropsParagraph = {
  children: any;
  props:any
}
type PropsImg = {
  children: any;
  props: any
}

const MyParagraph = ({ children, ...props }:PropsParagraph) => (
  <h5 {...props}>{children}</h5>
);

const MyImg = ({ children, ...props }: PropsImg) => (
  <img style={{maxWidth:'320px'}} {...props}>{children}</img>
);


const Data = ({entries}:Props) =>{
    return(
    <Layout>
        <Box layout='flexBoxColumn'>
        {entries.map((entry:any)=>{
            return(
                 <Box layout='flexBoxColumn'  key={entry.id}>
              <Box layout='flexBoxRow' css={{
                alignItems:'center',
                justifyContent:'space-between',
                padding:'$2', gap:'$1', borderRadius:'$2', border:'1px solid $foreground'}}
             >
                <Box layout='flexBoxRow'>
                  <Box css={{backgroundColor:'lightgreen', whiteSpace:'nowrap',  height:'fit-content', padding:'0 $1'}}>
                    {dayjs.unix(entry.timestamp).fromNow() }
                    </Box>
                    {entry.title}
                  </Box>
                    <Box layout='flexBoxRow' css={{gap:'$1', alignItems:'center'}}>
                      {entry.author.displayName}
                      <Button css={{border:'1px solid white', padding:'$1',
                      '&:hover':{
                        border:'1px solid $foreground'
                      }
                      }}>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                      </Button>
                    </Box>
                </Box>
                <Box css={{width:'720px', padding:'$2 0', maxHeight:'320px', overflow:'hidden'}}>
                  <Markdown
                  options={{
                    overrides: {
                      h1: {
                        component: MyParagraph,
                      },
                      h2: {
                        component: MyParagraph,
                      },
                      img:{
                        component:MyImg
                      }
                    },
                  }}
                  >{entry.body}</Markdown>
                </Box>
               </Box>
            )
        })}
        </Box>
    </Layout>
    )
}

export default Data