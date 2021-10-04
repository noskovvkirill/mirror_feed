
import {StyledImage, StyledLabel, StyledH1, StyledH2, StyledH3, StyledH4, StyledH5, StyledLink} from '@/design-system/text/TextParsing'

import BackIcon from '@/design-system/icons/Back'
import ColumnsIcon from '@/design-system/icons/Columns'
// @ts-ignore

import {useRouter} from 'next/router'
import ButtonControl from '@/design-system/primitives/ButtonControl'
import Box from '@/design-system/primitives/Box'
import Button from '@/design-system/primitives/Button'
import ButtonPopover from '@/design-system/primitives/ButtonPopover'
//global state
//global state
import {ignoredPublication, pinnedItems, readLaterList, PinnedItem, IgnoredPublication, 
    readSettings,
    ReadSettings,
    ReadingListItem} from 'contexts'
import { useRecoilValue, useSetRecoilState} from 'recoil'
import {useRecoilValueAfterMount} from 'hooks/useRecoilValueAfterMount'

import {styled} from 'stitches.config'
import LinkIcon from '@/design-system/icons/Link'
import * as dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
// @ts-ignore
import rehypeTruncate from "rehype-truncate";
import remarkGfm from 'remark-gfm'
import {unified} from 'unified' 
import rehypeReact from 'rehype-react'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import slug from 'rehype-slug'
import toc from "@jsdevtools/rehype-toc"
import React, {useState, ReactPropTypes, useEffect,} from 'react'
import ReactDOM from 'react-dom'



interface Props {
    entry: Entry;
}
type Entry = {
  id:string,
  digest:string,
  timestamp:number,
  author:{
      displayName:string;
  },
  publication:{
      ensLabel:string;
  }
  title:string,
  body:any
}



const StyledContainer = styled('div',{
    display:'flex',
    flexDirection:'row',
    alignItems:'flex-start',
    position:'relative',
    justifyContent:'flex-start',
    maxWidth:'100vw', 
    padding:'$4 $2',
    margin:'calc($4 * 1) 0',
    color:'$text',
    borderRadius:'$2',
    transition:'$background',
    variants:{
        isHighlighted:{
            true:{
                backgroundColor:'$highlightBronze',
            },
            false:{
                backgroundColor:'$background',
            }
        }
    },
    defaultVariants:{
        isHighlighted:false
    }
})


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
    maxWidth:'720px',
    whiteSpace:'break-spaces',
    'h1':{
        fontSize:"$1",
        marginBottom:'$4'
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

const StyledBody = styled('article',{
    overflow:'hidden',
    maxWidth:'768px', 
    width:'100%',
     variants:{
        isHighlighted:{
            true:{
                '*':{
                   color:'$textBronze', 
                }
            },
            false:{
                  '*':{
                   color:'$textBronze', 
                }
            }
        }
    },
     defaultVariants:{
        isHighlighted:false
    }
})

const StyledControls = styled('div',{
    display:'flex',
    flexDirection:'column',
    position:'sticky',
    top:'0',
    gap:'$1',
    padding:'0 $2 $1 $2',
    marginRight:'$2',
    width:'fit-content',
    boxSizing:'border-box',
    overflow:'hidden',
    transition:'$all',
    variants:{
        isVisible:{
            true:{
                opacity:'1'
            },
            false:{
                opacity:'0'
            }
        }
    },
    defaultVariants:{
        isVisible:false
    }
})



const StyledImageFull = (props:ReactPropTypes) => (<StyledImage {...props} inline={false}/>)

//need to portal it
const StyledToc = styled('nav', {
    color:'red',
    padding:'$2',
    position:'sticky',
    top:0,
    'a':{
        color:'$foregroundBronze',
        fontSize:'$6',
        marginBottom:'$2'
    },
    'ol':{
        listStyle:'none'
    },
    'li':{
        marginBottom:'$2'
    }
})


//this is really ugly solution, but works for now 
const TocPortalled = (props:ReactPropTypes) => {
    const [container, setContainer] = useState<Element | null>(null)
    useEffect(()=>{
        if(document){
            const element = document.querySelector('#article-toc')
            if(element){
             setContainer(element)
            }
        }
    },[])

    if(container){
    return ReactDOM.createPortal(
     <StyledToc {...props}/>,
    container
  );} else return(<></>)
}


//custom blocks

const ParseLink = (props:ReactPropTypes & {href:string, children:React.ReactNode}) => {
    const myReg = `://`;
    if(props?.href.split(myReg)[0] === 'auction'){
        return(
            <Box css={{padding:'$1 $1 $4 $1', opacity:0.5, borderRadius:'$2', backgroundColor:'LightBlue'}}>
                <h5>AUCTION</h5>
                {props.children}
            </Box>
        )
    }

    if(props?.href.split(myReg)[0] === 'ethereum'){
        return(
            <Box css={{padding:'$1 $1 $4 $1', opacity:0.5, borderRadius:'$2', backgroundColor:'LightBlue'}}>
                <h5>ETHEREUM</h5>
                {props.children}
            </Box>
        )
    }

    return(
        <StyledLink {...props}/>
    )
}


const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
//    .use(remarkDirective)
  .use(slug)
  .use(toc)
  .use(rehypeReact, {createElement: React.createElement, Fragment:React.Fragment, components:{
      img: StyledImageFull,
      h1: StyledH1,
      h2: StyledH2,
      h3: StyledH3,
      h4: StyledH4,
      h5:StyledH5,
      a:ParseLink,
      nav:TocPortalled
  }})


const Article = ({entry}:Props) => {
    const router = useRouter()
    const setIgnoredList = useSetRecoilState(ignoredPublication)
    const setPinnedItem = useSetRecoilState(pinnedItems)
    const setReadLater = useSetRecoilState(readLaterList)
    const setSettings = useSetRecoilState(readSettings)

    const readingList = useRecoilValueAfterMount(readLaterList, [])
    const settings = useRecoilValueAfterMount(readSettings, {
        columns:1,
        fontSize:"default",
        fontColor:"default",
        backgroundColor:"default", 
    })



    return(
            <StyledContainer 
            id={`preview-${entry.digest}`}
            isHighlighted={true}
            >   

            <Box>
                <StyledControls isVisible={true}>
                    <ButtonControl
                            isHighlighted={true}
                            label='back'
                            onClick={()=>router.push(`/`)}>
                                <BackIcon/>
                        </ButtonControl>

                        <ButtonPopover icon={<ColumnsIcon/>}>
                            <button onClick={()=>{
                                setSettings((settings:ReadSettings)=>{
                                    const newSettings = Object.assign({}, settings);
                                    newSettings.columns=1
                                    return newSettings
                                })
                            }}>1</button>
                            <button onClick={()=>{
                                setSettings((settings:ReadSettings)=>{
                                    const newSettings = Object.assign({}, settings);
                                    newSettings.columns=2
                                    return newSettings
                                })
                            }}>2</button>
                            <button onClick={()=>{
                                setSettings((settings:ReadSettings)=>{
                                    const newSettings = Object.assign({}, settings);
                                    newSettings.columns=3
                                    return newSettings
                                })
                            }}>3</button>
                        </ButtonPopover>
                        
                </StyledControls>
                   <Box id='article-toc' css={{
                        height:'100vh',
                        width:'200px',
                   }}/>  
            </Box>

                
                    
                   
                    <Box css={{width:'100%', display:'flex', justifyContent:'center' }}>
                    <StyledBody 
                    css={{columnCount:settings.columns}}
                    isHighlighted={true}>
                        <StyledMetadata>
                            <StyledLabel isHighlighted={true}>{entry.author.displayName}</StyledLabel>
                            <StyledLabel isHighlighted={true}>{dayjs.unix(entry.timestamp).fromNow() }</StyledLabel>
                            <StyledLabel isHighlighted={true} css={{backgroundColor:'transparent', padding:'0 $1', cursor:'pointer'}} as='a' rel="noreferrer" href={`https://${entry.publication.ensLabel}.mirror.xyz/${entry.digest}`} target='_blank'><LinkIcon/></StyledLabel>
                        </StyledMetadata>
                        <StyledTitle isHighlighted={true}>
                            <h1>{entry.title}</h1>
                        </StyledTitle>
                        {/* {entry.body} */}
                        {processor.processSync(entry.body).result}
                        {/* {processor.process(entry.body).result} */}
                      

                        <Box layout='flexBoxRow' css={{padding:'$2 0'}}>
                            <Button>remove from the reading list</Button>
                            <Button>Next: Bla-Bla</Button>
                        </Box>

                    </StyledBody>
                    </Box>
            </StyledContainer>
        // </div>
    )
}

export default Article