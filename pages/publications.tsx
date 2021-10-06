import type { GetServerSideProps } from 'next'
import Layout from '@/design-system/Layout'
import Box from '@/design-system/primitives/Box'
import { request, gql } from 'graphql-request';
import ExternalIcon from '@/design-system/icons/External'

const query = gql`
 {
  domain(id:"0x1aaf79d9b3323ad0212f6a2f34f8c627d8d45e45a55c774d080e3077334bfad9") {
    id
    name
    subdomains {
      name
      labelName
    }
  }
}
`;

export const getServerSideProps: GetServerSideProps = async () => {
    const data = await request('https://api.thegraph.com/subgraphs/name/ensdomains/ens', query).then(({ domain }) =>{
      return domain.subdomains
        .filter((i:any) => i.labelName !== null)
  });
   
    return { props: { data } }
};

type Props = {
    data: any;
    items: any;
}

const Home = ({ data }: Props) => {
    

    return (
        <Layout>
            <Box layout='flexBoxColumn' >
        

                <Box layout='flexBoxRow' css={{ flexWrap: 'wrap', gap: '$2' }}>
                    {data.map((item:any, i:any) => (
                        <Box
                            layout='flexBoxColumn'
                            css={{
                                gap: '$1',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '256px',
                                height: '256px',
                                boxSizing: 'border-box',
                                padding: '16px',
                                borderRadius: '16px',
                                border: '1px solid lightgray'
                            }}
                            key={i}>
                            <p>{item.name}</p>
                            {/* <User ens={item.ensDomain} /> */}
                        </Box>
                    ))}


                </Box>
            </Box>
        </Layout>
    )
}

export default Home
