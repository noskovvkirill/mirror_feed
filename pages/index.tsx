import type { GetServerSideProps } from 'next'
import Layout from '@/design-system/Layout'
import Box from '@/design-system/primitives/Box'
import useSWR from 'swr'
import ProtocolTile, {Protocol} from '@/design-system/ProtocolTile'

const fetcher = (url:string) => fetch(url).then(res => res.json())

export const getServerSideProps: GetServerSideProps = async () => {
  const initialData = await fetcher('https://api.boardroom.info/v1/protocols?limit=5')
  return { props: { initialData } }
};

interface Props {
  initialData: Protocol[]
}



const Home = ({initialData}:Props) => {
  const { data, error } = useSWR('https://api.boardroom.info/v1/protocols', fetcher, { initialData: initialData })

  if(error){
    return(<Box>Service is currently not available</Box>)
  }

  return (
    <Layout>
      <Box layout='flexBoxColumn' >
        <Box layout='flexBoxRow' css={{flexWrap:'wrap'}}>
          {data.data.map((item:Protocol) => {
            return (
            <ProtocolTile 
            icons={item.icons}
            name={item.name}
            totalProposals={item.totalProposals}
            totalVotes={item.totalVotes}
            uniqueVoters={item.uniqueVoters}
            key={item.name}/>
            );
          })}
        </Box>
      </Box>
    </Layout>
  )
}

export default Home
