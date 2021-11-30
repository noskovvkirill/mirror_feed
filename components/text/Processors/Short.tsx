import React from 'react'
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
import remarkUnwrapImages from 'remark-unwrap-images'
//text
import {StyledQuote, StyledH1, StyledH2, StyledH3, StyledH4, StyledH5, StyledList} from '@/design-system/text/TextParsing'
import TocPortal from '@/design-system/text/Toc'
import ImageFull from '@/design-system/text/Image'

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
      nav:TocPortal,
      blockquote:StyledQuote,
  }
}
)


 export function shorten(str:string, maxLen:number, separator = ' ') {
  return str.substr(0, str.lastIndexOf(separator, maxLen));
} //

export default processorFull