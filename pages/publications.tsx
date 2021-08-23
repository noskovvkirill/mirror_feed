import type { GetServerSideProps } from 'next'
import Layout from '@/design-system/Layout'
import Box from '@/design-system/primitives/Box'
import { request, gql } from 'graphql-request';

const query = gql`
  {
    leaderboard {
      profiles {
        account
        ensDomain
        __typename
      }
      __typename
    }
  }
`;


export const getServerSideProps: GetServerSideProps = async () => {
    const data = await request('https://mirror-api.com/graphql', query).then(({ leaderboard }) =>
        leaderboard
            .map((l: any) => l.profiles)
            .reduce((acc: any, i: any) => [...acc, ...i])
            .filter((i: any) => i.ensDomain !== null)
    );
   
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
                            <p>{item.ensDomain}</p>
                            {/* <User ens={item.ensDomain} /> */}
                        </Box>
                    ))}


                </Box>
            </Box>
        </Layout>
    )
}

export default Home
