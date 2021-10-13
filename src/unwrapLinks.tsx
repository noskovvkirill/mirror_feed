//Plugin to unwrap links from the paragraphs 


/* eslint-disable import/no-anonymous-default-export */
import { visit, SKIP } from 'unist-util-visit'
import {whitespace} from 'hast-util-whitespace'
import type {Plugin} from 'unified'

  function applicable(node:any) {
        let link=false;
      const childrenLength = node.children.length
      if(childrenLength>1){
          return
      }
      for(let i=0; i< childrenLength; i++){
          const child = node.children[i]
            if (whitespace(child)) {
            }
            else if (child.type === 'link') {
            link = true
        }
      }

      return link
  }

  /**
 * Plugin to unwrap the links
 *
 * @type {import('unified').Plugin<[Options?]|void[], Root>}
 */
const unwrapLinks:Plugin<any[]> = () => {
   return (tree:any) => {
    visit(tree, 'paragraph', (node, index, parent) => {
        if(parent && typeof index === 'number' &&  applicable(node)){
            parent.children.splice(index, 1, ...node.children)
            return [SKIP, index]
        } else return 
    })
   }
 }
 export default unwrapLinks