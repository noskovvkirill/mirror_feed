//state
import {styled} from 'stitches.config'
// import Box from '@/design-system/primitives/Box'
// import Button from '@/design-system/primitives/Button'
import React, {useEffect, useMemo} from 'react'
import * as ReactDOM from 'react-dom'
import { useSetRecoilState} from 'recoil'
import {useRecoilValueAfterMount} from 'hooks/useRecoilValueAfterMount'
import {useRouter} from 'next/router'
import useOnScreen from 'hooks/useOnScreen'
import {useRef, useState, ReactPropTypes} from 'react'
// import remarkOembed from 'remark-oembed'
// @ts-ignore
import rehypeTruncate from "rehype-truncate";
import remarkGfm from 'remark-gfm'
import {unified} from 'unified' 
import rehypeReact from 'rehype-react'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import slug from 'rehype-slug'
import toc from "@jsdevtools/rehype-toc"
import unwrapLinks from 'src/unwrapLinks'
//types
import {ignoredPublication, pinnedItems, readLaterList, readSettings, ReadingListItem} from 'contexts'
import remarkUnwrapImages from 'remark-unwrap-images'
import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs'


//components
import Container from '@/design-system/Article/Container'
import Controls from '@/design-system/Article/Controls'
import Body from '@/design-system/Article/Body'

import dynamic from 'next/dynamic'
const DynamicEmbed = dynamic(() =>
  import('@/design-system/text/Embeds'), { 
      loading: () => <p style={{width:'100%', height:'256px'}}></p>,
    }
)
// import Embeds from '@/design-system/text/Embeds'

import {StyledImage, StyledQuote, StyledH1, StyledH2, StyledH3, StyledH4, StyledH5,  StyledToc, StyledList} from '@/design-system/text/TextParsing'
import ImageFull from '@/design-system/text/Image'


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
  },
  featuredImage?:{
      sizes:{
          og?:{
            src:string,
            width:number,
            height:number
          },
          lg?:{
            src:string,
            width:number,
            height:number
          }, 
          md?:{
            src:string,
            width:number,
            height:number
          },
          sm?:{
            src:string,
            width:number,
            height:number
          }
      }
  }
  title:string,
  body:any
}



const StyledImageHidden = styled(StyledImage,{
    display:'none'
})



// TODO: Add window height resize event listener to change the height of TOC 
 
//this is really ugly solution, but works for now 
const TocPortalled = (props:ReactPropTypes) => {
    const [container, setContainer] = useState<Element | null>(null)
    const [height, setHeight] = useState<'fit-content' | number>(0)
    useEffect(()=>{
        if(document){
            const element = document.querySelector('#article-toc')
            console.log('rect', element?.getBoundingClientRect())
            const top = element?.getBoundingClientRect().top
            if(element){
             setContainer(element)
            }
            if(!top || top === undefined){
                setHeight('fit-content');
                return
            }
            const heightWindow = window.innerHeight 
            const elementHeight = heightWindow-top;
            setHeight(elementHeight)
        }
    },[])

    if(container){
    return ReactDOM.createPortal(
     <StyledToc css={{height:height}} {...props}/>,
    container
  );} else return(<></>)
}

//the func is taken from https://m1guelpf.blog/ 
export const truncateText = (text:string) => {
	const paragraph = text.split('\n\n').slice(0, 6)
	if (paragraph[paragraph.length - 1].startsWith('#')) paragraph.pop()
	return paragraph.join('\n\n')
}

export const processorShort = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(remarkUnwrapImages)
  .use(remarkSqueezeParagraphs)
//   .use(rehypeTruncate, { maxChars: 1000, ignoreTags: ["h1"]  })
  .use(rehypeReact, {createElement: React.createElement, Fragment:React.Fragment, components:{
      img: StyledImageHidden,
      h1: StyledH1,
      h2: StyledH2,
      h3: StyledH3,
      h4: StyledH4,
      h5:StyledH5,
      ul: StyledList,
      ol: StyledList,
      a:DynamicEmbed,
      blockquote:StyledQuote,
  }})






const processorFull = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkUnwrapImages)
  .use(unwrapLinks)
  .use(remarkRehype)
  .use(slug)
  .use(toc)
  .use(rehypeReact, 
    {options:{passNode:false}, createElement: React.createElement, Fragment:React.Fragment, 
    components:{
      img: ImageFull,
      h1: StyledH1,
      h2: StyledH2,
      h3: StyledH3,
      h4: StyledH4,
      h5:StyledH5,
      ul: StyledList,
      ol: StyledList,
      a:DynamicEmbed,
      nav:TocPortalled,
      blockquote:StyledQuote,
  }
}
)


// function shorten(str:string, maxLen:number, separator = ' ') {
//   if (str.length <= maxLen) return str;
//   return str.substr(0, str.lastIndexOf(separator, maxLen));
// } //that is a weird way to shorten the text, because I do that to markdown and may touch the styling symbols


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


    //  we precompute the  body and memoize it on initial render. 
    // This way, when we open a large article, animation is not glitchy :-) 
    // const bodyTextShort =  useMemo(() => processorShort.processSync(truncateText(entry.body)).result, [entry.body])
    const bodyText =  useMemo(() =>  processorFull.processSync(entry.body).result, [entry.body])
    
    // MOVE FULL BODY TO render asynch. 
    
    // const [fullText, setFullText] = useState<any>() 
    // useEffect(()=>{
    //     bodyTextAsync()
    // },[entry.body])

    // const bodyTextAsync =  async() => {
    //   const data = await processorFull.process(entry.body).then((result)=>(result.result))
    //   setFullText(data)
    // }
    

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
                router.beforePopState((state) => {
                    state.options.scroll = false;
                    return true;
                }); //avoids the scroll to jump to the top @https://github.com/vercel/next.js/issues/20951
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
                body={isPreview ? bodyText.props.children.slice(0,5) : bodyText}
                Open={(digest:string)=>{
                    router.push(digest, undefined, {scroll:true})
                }}
                isHover={isHover}
                isFocused={isFocused}
            />
        </Container>  
    )
}

//do not Memo, it blocks the animation
export default Article