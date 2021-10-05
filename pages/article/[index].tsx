import Layout from '@/design-system/Layout'
import Box from '@/design-system/primitives/Box'
import { request, gql } from 'graphql-request';
import type { GetServerSideProps, GetStaticProps } from 'next'
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
        }
        publication{
          ensLabel
        }
    }
}`


export const getServerSideProps: GetServerSideProps = async (ctx) => {

const { index} = ctx.query;

const entry = await request('https://mirror-api.com/graphql', queryEntry, {
       digest: index
    }).then((data) =>data.entry).catch(()=>{return { notFound:true}})
  return {
    props:{entry:entry},
  }
};
type Props = {
    entry:any;
}




const Data = ({entry}:Props) =>{
    return(
    <Layout>
        <Box layout='flexBoxColumn'>
            <Article key={entry.digest} entry={entry} isPreview={false}/>
        </Box>
    </Layout>
    )
}

export default Data