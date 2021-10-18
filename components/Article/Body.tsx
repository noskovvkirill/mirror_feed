import React from 'react'
import {styled} from 'stitches.config'
//types
import {Entry} from '@/design-system/Article'
import {ReadingListItem} from 'contexts'
//primitives
import {StyledLabel} from '@/design-system/text/TextParsing'
import Box from '@/design-system/primitives/Box'
import Button from '@/design-system/primitives/Button'
//icons
import LinkIcon from '@/design-system/icons/Link'
//dayjs
import * as dayjs from 'dayjs'
import Link from 'next/link'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import Image from 'next/image'

export interface BodyExternal {}
export interface BodyInternal extends BodyExternal {
    entry:Entry,
    body:React.ReactElement<unknown, string | React.JSXElementConstructor<any>>,
    readingList:ReadingListItem[],
    isPreview?:boolean;
    isHover:boolean,
    isFocused:boolean;
    Open:(digest:string) => void;
    setReadLater:(fn:(prevState:ReadingListItem[]) => ReadingListItem[]) => void;
}


const StyledMetadata = styled('div', {
    display:'flex',
    position:'relative',
    top:'calc($1 / 2)',
    gap:'$0', 
    alignItems:'center',
    justifyContent:'flex-start',
    marginBottom:"$1"
})


const StyledTitle = styled('div', {
    display:'flex',
    gap:'$1',
    alignItems:'center',
    width:'100%',
    maxWidth:'720px',
    whiteSpace:'break-spaces',
    'h1':{
        fontSize:"$1",
    },
     variants:{
        isHighlighted:{
            true:{
                color:'$textBronze',
            },
            false:{
                  color:'$text',
            }
        }
    },
     defaultVariants:{
        isHighlighted:false
    }
})

const StyledBody = styled('div', {
    display:'flex',
    width:'100%',
    variants:{
        isPreview:{
            true:{
                justifyContent:'flex-start',
            },
            false:{
                justifyContent:'center',
            }
        }
    },
    defaultVariants:{
        isPreview:true
    }
})


const StyledContents = styled('article',{
    overflow:'hidden',
    marginRight:'calc($4 * 1.5)',
    '@bp1':{
         width:'480px',
    },
    '@bp2':{
         width:'640px',
    },
    '@bp3':{
        width:'700px',
    },
     variants:{
        isHighlighted:{
            true:{
                '*':{
                //    color:'$textBronze', 
                }
            },
            false:{
                  '*':{
                //    color:'$textBronze', 
                }
            }
        }
    },
     defaultVariants:{
        isHighlighted:false
    }
})

//probably some cleaver way to render images is needed :-/

const RenderImage = ({featuredImage}:{featuredImage:Entry["featuredImage"]}) => {
    if(!featuredImage){
        return(<></>)
    }

    if(featuredImage.sizes.md){          
        <Box css={{borderRadius:'$2',position:'relative', objectFit:'scale-down', maxWidth:'100%', overflow:'hidden', marginBottom:'calc($4 + $1)'}}>
            <Image         layout='responsive'
                                objectFit={'cover'}
                                alt='cover'
                                src={featuredImage.sizes.md.src}
                                width={featuredImage.sizes.md.width}
                                height={featuredImage.sizes.md.height}
                                />
        </Box>
    }
    if(featuredImage.sizes.lg){
        <Box css={{borderRadius:'$2', position:'relative', maxWidth:'100%', overflow:'hidden', marginBottom:'calc($4 + $1)'}}>
          <Image         objectFit={'cover'}
                        layout='responsive'
                        placeholder="blur"
                        alt='cover'
                        src={featuredImage.sizes.lg.src}
                        width={featuredImage.sizes.lg.width}
                        height={featuredImage.sizes.lg.height}/>
        </Box>
    }
    if(featuredImage.sizes.og){
        return(
          <Box css={{borderRadius:'$2', position:'relative', maxWidth:'100%',  overflow:'hidden', marginBottom:'calc($4 + $1)'}}>
            <Image      objectFit={'cover'} layout='responsive'
                        alt='cover'
                        src={featuredImage.sizes.og.src}
                        width={featuredImage.sizes.og.width}
                        height={featuredImage.sizes.og.height}/>
          </Box>
        )
    }
    if(featuredImage.sizes.sm){
        <Box css={{borderRadius:'$2', position:'relative', maxWidth:'100%', overflow:'hidden', marginBottom:'calc($4 + $1)'}}>
          <Image         objectFit={'cover'} layout='responsive'
                        alt='cover'
                        src={featuredImage.sizes.sm.src}
                        width={featuredImage.sizes.sm.width}
                        height={featuredImage.sizes.sm.height}/>
        </Box>
    }
    return(<></>)
}


const BodyComponent = (
    {
        entry,
        body,
        readingList,
        Open,
        isPreview=true,
        isHover,
        setReadLater,
        isFocused
    }:BodyInternal
) => (
    <StyledBody 
    //replace on double click only for the background (once you implement it), not the whole container. this way
    //your prevent the  select from showing up 
    onDoubleClick={()=>{
           entry.publication?.ensLabel 
            ?  Open(`/${entry.publication?.ensLabel ? entry.publication?.ensLabel : entry.author.address}/${entry.digest}`)
            :  Open(`/${entry.author.address}/${entry.digest}`)
    }}
    isPreview={isPreview}>
        {/* {console.log(entry.featuredImage.sizes.og.src)} */}
        {/* {console.log('entry', entry)} */}
        <StyledContents isHighlighted={(isHover || isFocused) ? true : false}>

             {!isPreview && (<RenderImage featuredImage={entry.featuredImage}/>)}
        
            <StyledMetadata>
                <StyledLabel isHighlighted={(isHover || isFocused || !isPreview) ? true : false}>{entry.author?.displayName ? entry.author.displayName : entry.author?.address?.slice(0,8)}</StyledLabel>
                <StyledLabel isHighlighted={(isHover || isFocused || !isPreview) ? true : false}>{dayjs.unix(entry.timestamp).fromNow() }</StyledLabel>
                {entry.publication?.ensLabel && (
                     <StyledLabel isHighlighted={(isHover || isFocused) ? true : false} css={{backgroundColor:'transparent', padding:'0 $1', cursor:'pointer'}} as='a' rel="noreferrer" href={`https://${entry.publication?.ensLabel}.mirror.xyz/${entry.digest}`} target='_blank'><LinkIcon/></StyledLabel>
                )}
                {!entry.publication?.ensLabel && (
                     <StyledLabel isHighlighted={(isHover || isFocused) ? true : false} css={{backgroundColor:'transparent', padding:'0 $1', cursor:'pointer'}} as='a' rel="noreferrer" href={`https://mirror.xyz/${entry.author.address}/${entry.digest}`} target='_blank'><LinkIcon/></StyledLabel>
                )}
            </StyledMetadata>
            <StyledTitle isHighlighted={(isHover || isFocused) ? true : false}>
                <Link 
                passHref
                href={
                    entry.publication?.ensLabel 
                    ?  `/${entry.publication?.ensLabel ? encodeURIComponent(entry.publication?.ensLabel) : encodeURIComponent(entry.author.address)}/${encodeURIComponent(entry.digest)}`
                    :  `/${encodeURIComponent(entry.author.address)}/${encodeURIComponent(entry.digest)}`
                }><Box as='a' css={{cursor:isPreview ? 'pointer' : 'auto', fontSize:'$1', fontWeight: "700",  margin:'calc($4 * 1) 0 $3 0', fontFamily:'$default', textDecoration:'none', color:'inherit'}}>{entry.title}</Box></Link>
            </StyledTitle>
           {body}
            
            {!isPreview && (
                  <Box layout='flexBoxRow' css={{padding:'$4 0', 
                  gap:'$1', flexWrap:'wrap',
                  marginTop:'$4',}}>
                      {(readingList?.findIndex((item)=>item.entryDigest === entry.digest) !== -1) && (
                          <Button 
                                onClick={()=>{
                                    setReadLater((prevState:ReadingListItem[])=>{
                                    const indexUnPin = prevState.findIndex((itemPrev:ReadingListItem)=>itemPrev.entryDigest=== entry.digest)
                                    const newArray =[...prevState.slice(0, indexUnPin), ...prevState.slice(indexUnPin + 1)];
                                    return newArray
                                })}}
                                >Remove from the reading list
                          </Button>
                      )}
                
                        {readingList.filter(item=>item.entryDigest !== entry.digest).length > 0 
                        ? <Button
                            onClick={()=>{
                                Open(`/${readingList.filter(item=>item.entryDigest !== entry.digest)[0].ensLabel + '/' + readingList.filter(item=>item.entryDigest !== entry.digest)[0].entryDigest }`)
                            }}
                        >Next: {readingList.filter(item=>item.entryDigest !== entry.digest)[0]?.title.slice(0,48)+'...'}</Button>
                        : <Box as='span' layout='flexBoxRow' css={{color:'$foregroundText', alignItems:'center', fontSize:'$6'}}>Your reading list is empty ✨</Box>
                        }
                  </Box>
            )}
        </StyledContents>
    </StyledBody>
)


//because fullSize Body ignores the isFocus, isHover and isPreview state, we should not re-render
//component on those changes as well 
const areEqual = (prevProps:any, nextProps:any) => {
   if(prevProps.isPreview === false 
    && nextProps.isPreview === false
    && prevProps.body.length === nextProps.body.length
    && prevProps.entry.id === nextProps.entry.id
    && prevProps.readingList.length === nextProps.readingList.length
    ){
        // console.log('same!')
       return true 
   } 

   if( prevProps.body.length === nextProps.body.length
    && prevProps.entry.id === nextProps.entry.id
    && prevProps.isPreview === nextProps.isPreview
    && prevProps.isFocused === nextProps.isFocused
    && prevProps.isHover === nextProps.isHover 
     && prevProps.readingList.length === nextProps.readingList.length
    ) {
        //  console.log('same!')
        return true
    }
    // console.log('not same!')
    return false

}
export default React.memo(BodyComponent, areEqual)