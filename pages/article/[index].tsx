import Layout from '@/design-system/Layout'
import Box from '@/design-system/primitives/Box'
import { request, gql } from 'graphql-request';
import type { GetServerSideProps } from 'next'
import Article from '@/design-system/Article';


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
        publication{
          ensLabel
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
export const getServerSideProps: GetServerSideProps = async (ctx) => {

const { index} = ctx.query;

const entry =await request('https://mirror-api.com/graphql', queryEntry, {
       digest: index
    }).then((data) =>data.entry).catch(()=>{return})
  return {props:{entry:entry}}
};
type Props = {
    entry:any;
}


// revalidate: 10 * 60, 


const Data = ({entry}:Props) =>{
    return(
    <Layout>
        <Box layout='flexBoxColumn'>
            <Article  key={entry.digest} entry={entry}/>
        </Box>
    </Layout>
    )
}

export default Data