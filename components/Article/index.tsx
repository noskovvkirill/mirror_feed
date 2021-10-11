//state
import {styled} from 'stitches.config'
import React from 'react'
import * as ReactDOM from 'react-dom'
import { useSetRecoilState} from 'recoil'
import {useRecoilValueAfterMount} from 'hooks/useRecoilValueAfterMount'
import {useRouter} from 'next/router'
import useOnScreen from 'hooks/useOnScreen'
import {useRef, useState, useEffect, ReactPropTypes} from 'react'

// @ts-ignore
import rehypeTruncate from "rehype-truncate";
import remarkGfm from 'remark-gfm'
import {unified} from 'unified' 
import rehypeReact from 'rehype-react'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import slug from 'rehype-slug'
import toc from "@jsdevtools/rehype-toc"

//types
import {ignoredPublication, pinnedItems, readLaterList, readSettings, ReadingListItem} from 'contexts'

//components
import Container from '@/design-system/Article/Container'
import Controls from '@/design-system/Article/Controls'
import Body from '@/design-system/Article/Body'
import {StyledImage, StyledH1, StyledH2, StyledH3, StyledH4, StyledH5, StyledLink, Embeds, StyledToc, StyledList} from '@/design-system/text/TextParsing'



interface Props {
    entry: Entry;
    isPreview?:boolean;
}
export type Entry = {
  id:string,
  digest:string,
  timestamp:number,
  author:{
      address:string;
      displayName:string;
  },
  publication:{
      ensLabel:string;
  }
  title:string,
  body:any
}



const StyledImageHidden = styled(StyledImage,{
    display:'none'
})

const StyledImageFull = (props:ReactPropTypes) => (<StyledImage {...props} inline={false}/>)



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


const processorShort = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeTruncate, { maxChars: 1000, ignoreTags: ["h1"]  })
  .use(rehypeReact, {createElement: React.createElement, Fragment:React.Fragment, components:{
      img: StyledImageHidden,
      h1: StyledH1,
      h2: StyledH2,
      h3: StyledH3,
      h4: StyledH4,
      h5:StyledH5,
      ul: StyledList,
      ol: StyledList,
      a:Embeds
  }})

const processorFull = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(slug)
  .use(toc)
  .use(rehypeReact, {options:{passNode:true}, createElement: React.createElement, Fragment:React.Fragment, components:{
      img: StyledImageFull,
      h1: StyledH1,
      h2: StyledH2,
      h3: StyledH3,
      h4: StyledH4,
      h5:StyledH5,
      ul: StyledList,
      ol: StyledList,
      a:Embeds,
      nav:TocPortalled
  }})


function shorten(str:string, maxLen:number, separator = ' ') {
  if (str.length <= maxLen) return str;
  return str.substr(0, str.lastIndexOf(separator, maxLen));
} //that is a weird way to shorten the text, because I do that to markdown and may touch the styling symbols


const Article= ({entry, isPreview=true}:Props) => {
    const router = useRouter()
    const ref = useRef<HTMLDivElement | null>(null)
    const el = useOnScreen(ref, {threshold:1})
    const isFocused = !!el?.isIntersecting
    const setIgnoredList = useSetRecoilState(ignoredPublication)
    const setPinnedItem = useSetRecoilState(pinnedItems)
    const setReadLater = useSetRecoilState(readLaterList)
    const readingList = useRecoilValueAfterMount(readLaterList, [])
    const setSettings = useSetRecoilState(readSettings)
    const [isHover, setIsHover] = useState(false)
    
    return(
        <Container
            ref={ref}
            entry={entry}
            isPreview={isPreview}
            isHover={isHover}
            isFocused={isFocused}
            isReadingList={readingList.findIndex((item:ReadingListItem)=>item.entryDigest === entry.digest) === -1 ? false : true }
            setIsHover={(isHover:boolean)=>{
                setIsHover(isHover)
        }}> 
             <Controls 
                isPreview={isPreview}
                isFocused={isFocused}
                isHover={isHover}
                isReadingList={readingList.findIndex((item:ReadingListItem)=>item.entryDigest === entry.digest) === -1 ? false : true }
                entry={entry}
                Open={(digest:string)=>{
                    router.push(digest)
                }}
                Close={()=>{
                router.back()
                }}
                setSettings={setSettings}
                setIgnoredList={setIgnoredList}
                setPinnedItem={setPinnedItem}
                setReadLater={setReadLater}
                setIsHover={setIsHover}
            />
             <Body
                readingList={readingList}
                setReadLater={setReadLater}
                isPreview={isPreview}
                entry={entry}
                body={isPreview ? processorShort.processSync(shorten(entry.body,1200)).result : processorFull.processSync(entry.body).result}
                Open={(digest:string)=>{
                    router.push(digest, undefined, {scroll:true})
                }}
                isHover={isHover}
                isFocused={isFocused}
            />
        </Container>  
    )
}

export default Article