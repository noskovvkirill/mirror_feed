import Box from '@/design-system/primitives/Box'
import RemoveIcon from '@/design-system/icons/Remove'
import ButtonControl from '@/design-system/primitives/ButtonControl'
import ExternalIcon from '@/design-system/icons/External'
import {styled} from 'stitches.config'
import {request} from 'graphql-request'
import useSWR from 'swr'
import { queryEditions } from 'src/queries'
import LinkIcon from '@/design-system/icons/Link'
//dayjs
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import { Current, readSettings, readSettingsDefault, ReadSettings} from 'contexts'
import {useRecoilValue, useSetRecoilState} from 'recoil'
import { useRecoilValueAfterMount } from 'hooks/useRecoilValueAfterMount'

const StyledSection = styled('section',{
    display:'flex-inline',
    flexDirection:'row',
    alignItems:'flex-start',
    margin:'$4 0',
    gap:'$2'
})

const StyledProposal = styled('div', {
    width:'100%',
    maxWidth:'640px',
    height:'fit-content',
    // minHeight:'248px',
    background:'$background',
    borderRadius:'$2',
    padding:'$2 $4',
    boxSizing:'border-box',
    hyphens:'auto',
    overflow:'hidden',
    'h3':{
        margin:'$2 0',
    },
    'h5':{
        margin:'$2 0',
    },
    'p':{
        maxWidth:'95%',
        fontSize:'$6'
    },
    boxShadow:'$normal',
    variants:{
        displayed:{
            true:{
                mixBlendMode:'normal'
            },
            false:{
                mixBlendMode:'multiply'
            }
        }
    },
    defaultVariants:{
        displayed:false
    }
    // mixBlendMode:'multiply'
    // wordBreak:'break-all'
})

const StyledLabel = styled('p',{
    width:'fit-content',
    fontSize:'$6',
    borderRadius:'$round',
    padding:'$0 $2',
    backgroundColor:'$highlight',
    color:'$foregroundText',
})

type EditionsProps = {
    editionId:number,
    editionContractAddress:string
}

const getEditions =  async (editionId:number, editionContractAddress:string) => {
    return await request('https://mirror-api.com/graphql', queryEditions, {editionId:editionId, editionContractAddress:editionContractAddress})
    .then((data)=>data.edition)

}   


const Editions = ({editionId, editionContractAddress}:{editionId:number, editionContractAddress:string}) => {
    const setSettings = useSetRecoilState(readSettings)
    const settings = useRecoilValueAfterMount(readSettings, readSettingsDefault)
    const {data, error} = useSWR([editionId, editionContractAddress],getEditions, {
        onErrorRetry: (error, _, __, ___, { retryCount }) => {
            if (error.status === 404) return
             if (retryCount >= 2) return
        }
    })

    const currentArticle = useRecoilValue(Current)
   

    if(!data){
       return(
            <StyledProposal displayed={false}>
                Loading...
            </StyledProposal>
        )
      } 

    if(error){
       return(
            <StyledProposal displayed={true}>
                Something went wrong loading Editions...
            </StyledProposal>
        )
    } 


    return(
        <StyledSection>
            {settings.isEditions && (
                <StyledProposal  displayed={true}>
                    <Box layout='flexBoxRow' css={{alignItems:'center', justifyContent:'space-between'}}>
                        <h3>{data.title}</h3>
                        <Box layout='flexBoxRow' css={{alignItems:'center'}}>
                            <StyledLabel css={{backgroundColor:'transparent', display:'flex', alignItems:'center', justifyContent:'center', padding:'0 $1', cursor:'pointer'}} as='a' rel="noreferrer" href={`https://${currentArticle?.publication.ensLabel}.mirror.xyz/${currentArticle?.digest}`} target='_blank'><LinkIcon/></StyledLabel>

                            <StyledLabel>{data.price} ETH</StyledLabel>
                        </Box>
                    </Box>
                    <Box css={{width:'100%', padding:'$4', boxSizing:'border-box', overflow:'hidden', borderTop:'1px solid $foreground', borderBottom:'1px solid $foreground'}}>
                    {data.primaryMedia.mimetype === 'video/mp4' && (
                    <Box as='video' 
                    width={"100%"} 
                    css={{objectFit:'cover', borderRadius:'$2', boxShadow:'$normal'}}
                    height={"100%"} autoPlay muted loop>
                            <source src={data.primaryMedia.sizes.md.src} type="video/mp4"/>
                            Your browser does not support the video tag.
                        </Box>
                    )}
                    {data.primaryMedia.mimetype !== 'video/mp4' && (
                        <Box as='img'
                        css={{objectFit:'cover', borderRadius:'$2', boxShadow:'$normal'}}
                        src={data.primaryMedia.sizes.md.src}/>
                    )}
                    </Box>
                    
                    <Box layout='flexBoxRow' css={{justifyContent:'space-between', width:'100%', boxSizing:'border-box'}}>
                        <Box layout='flexBoxColumn' css={{gap:'$1', padding:'$2 0', boxSizing:'border-box', fontSize:'$6'}}>
                            NFTs Sold
                        <Box layout='flexBoxRow' css={{fontSize:'$3'}}>{data.events.length-1}/{data.quantity}</Box>
                        </Box>

                        <Box css={{display:'flex', alignItems:'center'}}>
                            {/* {data.publication.ensLabel} */}
                            <Box css={{width:'$4', height:'$4', borderRadius:'$round', overflow:'hidden'}}>
                                <img src={data.publication.avatarURL} width='100%' height='100%' style={{objectFit:'cover'}}/>
                            </Box>
                        </Box>
                    </Box>
            </StyledProposal>
            )}

            {!settings.isEditions && (
                <StyledProposal displayed={false}>
                     <h5>EDITIONS: {data.title}</h5>
                </StyledProposal>
            )}
            
            <Box css={{color:"$foregroundBronze"}}>
                <ButtonControl 
                onClick={()=>{
                    setSettings((settings:ReadSettings)=>{
                        const newSettings = Object.assign({}, settings);
                        newSettings.isEditions=!newSettings.isEditions
                        return newSettings
                    })
                }}
                isHighlighted={true} selected={!settings.isEditions  ? true : false} label={settings.isEditions  ? 'Hide Editions' : 'Show Editions'}><RemoveIcon/></ButtonControl>
            </Box>
        </StyledSection>
    )
}

export default Editions