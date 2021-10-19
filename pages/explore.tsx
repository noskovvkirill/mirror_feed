import type { GetStaticProps } from 'next'
import Layout from '@/design-system/Layout'
import Box from '@/design-system/primitives/Box'
import { request, gql } from 'graphql-request';
import ExternalIcon from '@/design-system/icons/External'
import { getContributorsAvatar } from 'src/publication-contents';
import Profile from '@/design-system/primitives/Profile'
import {useRouter} from 'next/router'

//I can use skip for the infintie swr
const query = gql`
 {
  domain(id:"0x1aaf79d9b3323ad0212f6a2f34f8c627d8d45e45a55c774d080e3077334bfad9") {
    id
    name
    subdomains(first:20) {
      name
      labelName
    }
  }
}
`;

type EnsDomain = {
    name:string,
    labelName:string
}

export const getStaticProps: GetStaticProps = async () => {
  let data:EnsDomain[] = await request('https://api.thegraph.com/subgraphs/name/ensdomains/ens', query).then(({ domain }) =>{
      return domain.subdomains
        .filter((i:any) => i.labelName !== null)
  });

  const contributors = await Promise.all(data.map(async (item:EnsDomain, i:number)=>{
      return await getContributorsAvatar({
        type:'ens',
        ensLabel:item.labelName
      }).then((item)=>item).catch(()=>{
        data = [...data.slice(0, i), ...data.slice(i + 1)];
        return null
      })
  }))

    const contributorsExists = contributors.filter((item)=>item)
    return { props: { data, contributors:contributorsExists } }
};

type Props = {
    data: any;
    contributors: any;
}



const Home = ({ data, contributors }: Props) => {
    const router = useRouter()
    return (
        <Layout>
            <Box layout='flexBoxColumn' >
                <Box layout='flexBoxRow' css={{ flexWrap: 'wrap', gap: '$2' }}>
                    {data.map((item:any, i:any) => (
                        <Box
                            layout='flexBoxColumn'
                            css={{
                                backgroundColor:'$highlightBronze',
                                color:'$foregroundTextBronze',
                                gap: '$1',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '256px',
                                boxSizing: 'border-box',
                                padding: '16px',
                                borderRadius: '$2',
                                // border: '1px solid lightgray'
                            }}
                            key={i}>
                            <h5 onClick={()=>{
                                router.push(`${item.labelName}?type=ens`)
                            }}>{item.name}</h5>
                            <Box layout='flexBoxRow' css={{flexWrap:'wrap'}}>
                            {contributors[i].map((contributor)=>{
                                return(
                                    <Profile 
                                    profile={contributor}
                                    key={contributor.address+'contributors'}/>
                              
                                )
                            })}
                            </Box>
           
                        </Box>
                    ))}


                </Box>
            </Box>
        </Layout>
    )
}

export default Home
