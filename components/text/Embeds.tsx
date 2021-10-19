import { ReactPropTypes } from 'react'
import Box from '@/design-system/primitives/Box'
import Proposal from '@/design-system/text/Proposal'
import Editions from '@/design-system/text/Editions'
// import LinkPreview from '@/design-system/text/LinkPreview'
import Nft from '@/design-system/text/Nft'
import { StyledLink } from '@/design-system/text/TextParsing'
import TweetEmbed from 'react-tweet-embed'

 const Embeds = (props:ReactPropTypes & {href:string, children:React.ReactNode}) => {
    const myReg = `://`;

    try{
         new URL(props.href)
    }   catch(e){
        return <StyledLink {...props}/>

    }
  
    if(new URL(props.href).protocol === 'auction:'){
        return(
            <Box layout='flexBoxColumn' css={{padding:'$1 $2', opacity:0.5, borderRadius:'$2', backgroundColor:'$foreground'}}>
                <p>This is Mirror.xyz auction. They aren&apos;t support yet. Please, visit the source publication.</p>
            </Box>
        )
    }

     if(new URL(props?.href).protocol === 'proposal:'){
        return(<Proposal cid={props?.href.split(myReg)[1]}/>)
    }


      if(new URL(props?.href).protocol === 'edition:'){
        const editions = new URLSearchParams(props?.href.split(myReg)[1].split('?')[1]).get('editionId')
        const contract = props?.href.split(myReg)[1].split('?')[0]
        return(
           <Editions editionId={Number(editions)} editionContractAddress={contract}/>
        )
    }

    if(new URL(props?.href).protocol === 'ethereum:'){
        const links = props?.href.split(myReg)[1].split('/')
        return(
            <Nft contract={links[0]} tokenId={links[1]}/> 
        )
    }

    const regex = /https?:\/\/twitter\.com\/(?:\#!\/)?(\w+)\/status(es)?\/(\d+)/gm;
    const result = regex.exec(props.href)
    if(result && result.length>3) {  
    return(<TweetEmbed id={result[3]} options={{cards: 'hidden' }}/>)}

 
    return(
        <StyledLink {...props}/>
    )
}
export default Embeds