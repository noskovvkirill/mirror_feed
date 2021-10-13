
import { NextApiRequest, NextApiResponse } from "next";
import remarkGfm from 'remark-gfm'
import {unified} from 'unified' 
// import rehypeReact from 'rehype-react'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import slug from 'rehype-slug'
import toc from "@jsdevtools/rehype-toc"

const processorFull = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(slug)
  .use(toc)

  
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const { body } = req.query;
    if(!body || typeof body !== "string"){
        res.status(500).json({});
    }
    const data = processorFull.processSync(body.toString()).result
    return res.status(200).json({data});
}