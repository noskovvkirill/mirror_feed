import {styled} from 'stitches.config'
//types
import {Entry} from '@/design-system/Article'
import { ReadingListItem, PinnedItem, IgnoredPublication, ReadSettings } from 'contexts';
//icons
import SuccessMarkIcon from '@/design-system/icons/Success'
import AddIcon from '@/design-system/icons/Add'
import OpenIcon from '@/design-system/icons/Open'
import PinIcon from '@/design-system/icons/Pin'
import RemoveIcon from '@/design-system/icons/Remove'
import BackIcon from '@/design-system/icons/Back'
//components
import ButtonControl from '@/design-system/primitives/ButtonControl'
import Box from '@/design-system/primitives/Box'
import { AddressPrettyPrint } from 'src/utils';
import React from 'react'

export interface ControlsExternal {}

export interface ControlsInternal extends ControlsExternal  {
    entry:Entry,
    isPreview?:boolean;
    isHover:boolean;
    isFocused:boolean;
    isReadingList:boolean;
    setIsHover:(isHover:boolean)=>void;
    setReadLater:(fn:(prevState:ReadingListItem[]) => ReadingListItem[]) => void;
    setPinnedItem:(fn:(prevState:PinnedItem[]) => PinnedItem[]) => void;
    setIgnoredList:(fn:(prevState:IgnoredPublication[]) => IgnoredPublication[]) => void;
    setSettings:(fn:(prevState:ReadSettings) => ReadSettings) => void;
    Open:(digest:string) => void;
    Close:() => void;
}

const StyledHeader = styled('div',{
      display:'flex',
      flexDirection:'column',
      justifyContent:'center',
      gap:'$1',
      height:'100%',
      maxHeight:'640px',
      borderRadius:'$round',
      padding:'0',
      margin:'$2 $2 $2 0',
      width:'32px',
      color:'$foregroundBronze',
      transition:'$background',
      cursor:'pointer',
      'h5':{
          transition:'$color',
          userSelect:'none',
          whiteSpace:'nowrap',
          fontWeight:'400',
          width:'100%',
          transform:'rotate(180deg) translateX(-10%)',
          writingMode: 'vertical-rl',
      },
       variants:{
        isHighlighted:{
            true:{
                '&:hover':{
                    backgroundColor:'$foregroundTintBronze',
                    color:'$foregroundTextBronze',
                },
            },
            false:{
                '&:hover':{
                    backgroundColor:'$highlight',
                    color:'$foregroundText'
                },
            }
        }
    },
     defaultVariants:{
        isHighlighted:false
    }
})

const StyledControls = styled('div',{
    display:'flex',
    gap:'$1',
    padding:'0 $2 $1 $2',
    //it's getting squezed in some cases currently, figure out why and remove the hardcoded value
    width:'80px',
    boxSizing:'border-box',
    // overflow:'hidden',
    flexDirection:'column',
    marginRight:'calc($4 + $1)',
    transition:'$all',
    '@bp1':{
        flexDirection:'row',
    },
    '@bp2':{
        flexDirection:'row',
        marginRight:'$2',
    },
     '@bp3':{
        flexDirection:'column',
         marginRight:'calc($4 + $1)',
    },
    variants:{
        isVisible:{
            true:{
                opacity:'1'
            },
            false:{
                opacity:'0'
            }
        },
        isPreview:{
            true:{},
            false:{}
        }
    },
    defaultVariants:{
        isVisible:false,
        isPreview:true
    }
})

const ControlsComponent = ({entry, isPreview=true, isHover, isFocused, isReadingList, setReadLater, setPinnedItem, setIgnoredList, setSettings, Open, Close}:ControlsInternal) =>{

    if(!isPreview) return(
        <Box layout='flexBoxColumn'>
            <StyledControls isPreview={false} isVisible={true}>
                        <ButtonControl
                                isHighlighted={true}
                                label='back'
                                onClick={Close}>
                                    <BackIcon/>
                            </ButtonControl>

                            {!isReadingList
                ? <ButtonControl
                        selected={false}
                        key={'reading control'}
                        label='to reading list'
                        isHighlighted={true}
                        onClick={()=>{
                            setReadLater((prevState:ReadingListItem[])=>{
                                //check for dublicates just in case 
                                if(prevState.findIndex((item:ReadingListItem)=>item.entryDigest === entry.digest) !== -1) return prevState
                            return [...prevState, {entryDigest:entry.digest, title:entry.title, ensLabel: entry.publication?.ensLabel ? entry.publication.ensLabel : entry.author.address}]})
                        }}>
                        <AddIcon/>
                    </ButtonControl>
                :<ButtonControl
                        selected={true}
                        label='remove from the reading list'
                        isHighlighted={true}
                        onClick={()=>{
                        setReadLater((prevState:ReadingListItem[])=>{
                        const indexUnPin = prevState.findIndex((item:ReadingListItem)=>item.entryDigest=== entry.digest)
                        const newArray =[...prevState.slice(0, indexUnPin), ...prevState.slice(indexUnPin + 1)];
                        return newArray
                    })}}>
                    <SuccessMarkIcon/>
                </ButtonControl>
            }
            </StyledControls>
            
            <Box id='article-toc' css={{  
                                height:'100%',
                                '@bp1':{
                                display:'none'
                                },
                                '@bp2':{
                                    width:'128px',
                                    maxWidth:'128px',
                                },
                                '@bp3':{
                                    width:'256px',
                                    maxWidth:'256px',
                                },
            }}/>        
         </Box>
    )

   return (
        <StyledControls isPreview={true} isVisible={(isHover || isFocused) ? true : false}>
            <ButtonControl
                isHighlighted={(isHover || isFocused) ? true : false}
                label='open'
                onClick={()=>{
                    entry.publication?.ensLabel 
                    ?  Open(`/${entry.publication?.ensLabel ? entry.publication?.ensLabel : entry.author.address}/${entry.digest}`)
                    :  Open(`/${entry.author.address}/${entry.digest}`)
                    }}>
                    <OpenIcon/>
            </ButtonControl>
            {!isReadingList
                ? <ButtonControl
                        selected={false}
                        key={'reading control'}
                        label='to reading list'
                        isHighlighted={(isHover || isFocused) ? true : false}
                        onClick={()=>{
                            setReadLater((prevState:ReadingListItem[])=>{
                                //check for dublicates just in case 
                                if(prevState.findIndex((item:ReadingListItem)=>item.entryDigest === entry.digest) !== -1) return prevState
                            return [...prevState, {entryDigest:entry.digest, title:entry.title, ensLabel: entry.publication?.ensLabel ? entry.publication.ensLabel : entry.author.address}]})
                        }}>
                        <AddIcon/>
                    </ButtonControl>
                :<ButtonControl
                        selected={true}
                        label='remove from the reading list'
                        isHighlighted={true}
                        onClick={()=>{
                        setReadLater((prevState:ReadingListItem[])=>{
                        const indexUnPin = prevState.findIndex((item:ReadingListItem)=>item.entryDigest=== entry.digest)
                        const newArray =[...prevState.slice(0, indexUnPin), ...prevState.slice(indexUnPin + 1)];
                        return newArray
                    })}}>
                    <SuccessMarkIcon/>
                </ButtonControl>
            }
                <br style={{userSelect:'none'}}/>
                <ButtonControl
                    label='pin on top'
                    isHighlighted={(isHover || isFocused) ? true : false}
                    onClick={()=>
                    setPinnedItem((prevState:PinnedItem[])=>[...prevState, {id:prevState.length > 0 ? prevState[prevState.length-1].id + 1 : 0,type:'entry', item:entry}])
                    }>
                        <PinIcon/>
                </ButtonControl>
                <ButtonControl
                    label='ignore this publication'
                    isHighlighted={(isHover || isFocused) ? true : false}
                    onClick={()=>
                    setIgnoredList((prevState:IgnoredPublication[])=>[...prevState, {ensLabel:entry.publication?.ensLabel ?  entry.publication?.ensLabel : entry.author.address}])
                    }>
                        <RemoveIcon/>
                </ButtonControl>
                {entry.publication?.ensLabel 
                ? <StyledHeader
                onClick={()=>Open(`/${entry.publication.ensLabel}`)}
                isHighlighted={(isHover || isFocused) ? true : false}>
                        <h5>{entry.publication.ensLabel}</h5>
                </StyledHeader>
                : <StyledHeader 
                onClick={()=>Open(`/${entry.author.address}?type=personal`)}
                isHighlighted={(isHover || isFocused) ? true : false}>
                    <h5>
                        {entry.author.displayName ? entry.author.displayName : <>{AddressPrettyPrint(entry.author.address, 6)}</>}
                    </h5> 
                 </StyledHeader>
                }
              
              
        </StyledControls>
    )
}

//because fullSize Controls ignore the isFocus, isHover and isPreview state, we should not re-render
//component on those changes as well 
const areEqual = (prevProps:any, nextProps:any) => {
   if(prevProps.isPreview === false 
    && nextProps.isPreview === false
    && prevProps.entry.id === nextProps.entry.id
    && prevProps.isReadingList === nextProps.isReadingList
    ){
       return true 
   } 

   if( 
    prevProps.entry.id === nextProps.entry.id
    && prevProps.isPreview === nextProps.isPreview
    && prevProps.isFocused === nextProps.isFocused
    && prevProps.isHover === nextProps.isHover 
    && prevProps.isReadingList === nextProps.isReadingList
    ) {
        //  console.log('same!')
        return true
    }
    // console.log('not same!')
    return false
}

export default React.memo(ControlsComponent, areEqual)