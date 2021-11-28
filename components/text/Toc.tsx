import {useState, useEffect} from 'react';
import { createPortal } from 'react-dom';
import {StyledToc} from '@/design-system/text/TextParsing'
//types
import type {ReactPropTypes} from 'react';

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
    return createPortal(
     <StyledToc css={{height:height}} {...props}/>,
    container
  );} else return(<></>)
}

export default TocPortalled;