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
import ColumnsIcon from '@/design-system/icons/Columns'
//components
import ButtonControl from '@/design-system/primitives/ButtonControl'
import ButtonPopover from '@/design-system/primitives/ButtonPopover'
import Box from '@/design-system/primitives/Box'

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
      color:'$foreground',
      mixBlendMode:'multiply',
      transition:'$all',
      cursor:'pointer',
      'h5':{
          userSelect:'none',
          whiteSpace:'nowrap',
          fontWeight:'400',
          transform:'rotate(-90deg) translateX(-25%)'
      },
       variants:{
        isHighlighted:{
            true:{
                '&:hover':{
                    backgroundColor:'$highlightBronze',
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
    flexDirection:'column',
    gap:'$1',
    padding:'0 $2 $1 $2',
    marginRight:'calc($4 + $1)',
    width:'fit-content',
    boxSizing:'border-box',
    // overflow:'hidden',
    transition:'$all',
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
            true:{

            },
            false:{

            }
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

                            {/* <ButtonPopover icon={<ColumnsIcon/>}>
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
                            </ButtonPopover>  */}
            </StyledControls>
            
            <Box id='article-toc' css={{  
                                height:'100%',
                                width:'256px',
                                maxWidth:'256px',
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
                    setPinnedItem((prevState:PinnedItem[])=>[...prevState, {entry:entry}])
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
                {entry.publication?.ensLabel  && (
                      <StyledHeader isHighlighted={isFocused}>
                        <h5>{entry.publication.ensLabel}</h5>
                    </StyledHeader>
                )}
              
        </StyledControls>
    )

}

export default ControlsComponent