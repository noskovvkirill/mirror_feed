import Layout from '@/design-system/Layout'
import Box from '@/design-system/primitives/Box'
import Heading from '@/design-system/primitives/Heading'

const About = () => {

    return (
        <Layout>
            <Box layout='flexBoxColumn' css={{ gap: '$4', color: '$foregroundText', padding: '$4' }}>
                <Box>
                    <Heading color='foregroundText' size='h1'>
                        MirrorFeed is a reader for decentralized <br /> publishing platform Mirror.xyz
                    </Heading>
                    <p> The platform increases the value of the network and leverages
                        the composability of the web3.
                    </p>
                </Box>
                <Box>
                    <Heading color='foregroundText' size='h1'>
                        Short term goal&thinsp;—&thinsp;notifications and subscription feed.<br />
                        Long term&thinsp;—&thinsp;tools for the curation and discovery
                    </Heading>
                    <p> Mirror feed started with a purpose&thinsp;—&thinsp;to aggregate the contents from Mirror ecosystem in one place.<br />
                        Short term we focus on the urgent utility&thinsp;—&thinsp;being able to follow the authors and publications, <br /> explore the content: entries, auctions, polls & editions and more.<br />
                        Long term our aim  is to build the set of web3 native tools for curation and discovery that works for
                        Mirror community.
                    </p>
                </Box>
                <Box>
                    <Heading color='foregroundText' size='h1'>
                        Send your help to noskovvkirill.eth :-)
                    </Heading>
                    {/* <p> Mirror feed started with a purpose&thinsp;—&thinsp;to aggregate the contents from Mirror ecosystem in one place.<br />
                        Short term we focus on the urgent utility&thinsp;—&thinsp;being able to follow the authors and publications, <br /> explore the content: entries, auctions, polls & editions and more.<br />
                        Long term our aim  isto build the set of web3 native tools for curation and discovery that works for
                        Mirror community.
                    </p> */}
                </Box>
            </Box>
        </Layout>
    )
}

export default About