import {styled} from 'stitches.config'
import Box from '@/design-system/primitives/Box'
import Button from '@/design-system/primitives/Button'
import React from 'react'
import {StyledImage, StyledH1, StyledH2, StyledH3, StyledH4, StyledH5} from '@/design-system/text/TextParsing'
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

import {useRouter} from 'next/router'


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
    flexDirection:'column',
    padding:'calc($4 * 2)',
    border:'1px solid $foreground',
    borderRadius:'$2',
})

const StyledHeader = styled('div',{
      display:'flex',
      flexDirection:'column',
      justifyContent:'space-between',
      gap:'$1',
      borderRadius:'$2',
})

const StyledMetadata = styled('div', {
    display:'flex',
    gap:'$1', 
    alignItems:'center',
    justifyContent:'space-between',
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
})

const StyledBody = styled('div',{
    maxWidth:'800px', padding:'$2 0',  overflow:'hidden'
})


const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeTruncate, { maxChars: 1000, ignoreTags: ["ul", "h5", "h3", "h2", "h1"]  })
  .use(rehypeReact, {createElement: React.createElement, Fragment:React.Fragment, components:{
      img: StyledImage,
      h1: StyledH1,
      h2: StyledH2,
      h3: StyledH3,
      h4: StyledH4,
      h5:StyledH5
  }})

const ArticlePreview = ({entry}:Props) => {
    const router = useRouter()
    return(
        <StyledContainer>
                <StyledHeader>
                    <StyledMetadata>
                        {entry.publication.ensLabel}
                        <span>{entry.author.displayName}</span>
                        <span>{dayjs.unix(entry.timestamp).fromNow() }</span>
                    </StyledMetadata>
                    <StyledTitle>
                         <a rel="noreferrer" href={`https://${entry.publication.ensLabel}.mirror.xyz/${entry.digest}`} target='_blank'><LinkIcon/></a><h1>{entry.title}</h1>
                    </StyledTitle>
                </StyledHeader>
                <StyledBody>
                    {processor.processSync(entry.body).result}
                </StyledBody>
                <Button onClick={()=>router.push(`/article/${entry.digest}`)}>Read Article</Button>
        </StyledContainer>
    )
}

export default ArticlePreview