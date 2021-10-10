import {styled} from 'stitches.config'
import Box from '@/design-system/primitives/Box'
import Input from '@/design-system/primitives/Input'
import AddIcon from '@/design-system/icons/Add'
import DeleteIcon from '@/design-system/icons/Delete'
import Loader from '@/design-system/primitives/Loader'
import React from 'react'
import {  SubscribedPublication} from 'contexts'
import { Search } from 'src/search'
import User  from '@/design-system/primitives/Profile'
import {AddressPrettyPrint} from 'src/utils'


const StyledSearchResult = styled('div', {
    display:'flex',
    flexDirection:'row',
    padding:'$0 $1',
    fontSize:'$6',
    justifyContent:'space-between',
    alignItems:'center',
    // margin:'$0 0',
    variants:{
        type:{
            default:{
                borderTop:'1px solid $highlight',
                borderBottom:'1px solid $highlight',
            },
            list:{
                borderRadius:'$1',
                color:'$foregroundTextBronze',
                background:'$highlightBronze',
                // borderTop:'1px solid $foregroundBorder',
                // borderBottom:'1px solid $foregroundBorder',
            }
        }
    },
    defaultVariants:{
        type:'default'
    }
})

const StyledButton = styled('button', {
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    background:'none',
    borderRadius:'$round',
    border:'1px solid $foreground',
    color:'$foregroundText',
    transition:'$background',
    padding:'$1', 
    cursor:'pointer',
    '&:hover':{
        color:'$background',
        backgroundColor:'$foreground'
    },
    variants:{
        isHighlighted:{
            true:{
                 border:'1px solid $foregroundBronze', 
                 color:'$foregroundTextBronze', 
                '&:hover':{
                    background:'$foregroundBronze',
                    color:'$backgroundBronze'
                },
                "&:disabled": {
                    background:'$foregroundBronze',
                    color:'$backgroundBronze'
                },

            },
            false:{
                  border:'1px solid $foreground', 
                  color:'$foregroundText', 
                  '&:hover':{
                    background:'$foreground',
                    color:'$background'
                },
            }
        },
    },
    defaultVariants:{
        isHighlighted:false
    }
})

const StyledLabel = styled('p', {
    margin:'0',
    marginBottom:'$1',
    fontSize:'$6'
})

const StyledSection = styled('section', {
    width:'100%',
    marginBottom:'$1',
    padding:'0',
    boxSizing:'border-box',
    display:'flex',
    flexDirection:'column'
})

interface ISearch {
    searchState: 'default' | 'loading' | 'not found' | 'error',
    setSearchResult: (result:SubscribedPublication[]) => void;
    setSearchState : (state:'default' | 'loading' | 'not found' | 'error') => void;
    searchResult: SubscribedPublication[];
    list:  SubscribedPublication[];
    current: SubscribedPublication[];
    setList: (fn:(prevState:SubscribedPublication[]) => SubscribedPublication[]) => void;
}


const SearchBox = ({searchState, setSearchState, setSearchResult, searchResult, current, list, setList}: ISearch) => {
    return(
        <Box layout='flexBoxColumn'>
            <Input type='search' 
                    onChange={async (e)=>{
                        setSearchState('loading')
                        const target = e.target as {
                            value:string;
                        }
                        const result = await Search(target.value).catch(()=>setSearchState('error'))
                        if(!result){
                            console.log('no rs', result)
                            setSearchState('error')
                            return
                        }
                        if(result.length<=0) {
                            setSearchState('not found')
                            return
                        }
                        setSearchResult(result)
                        setSearchState('default')
                    }}
                    placeholder='Search user address or publication'/>
                <StyledSection>
                    {searchResult?.map((item:SubscribedPublication, index:number)=>{
                        return(
                           <StyledSearchResult
                           key={'search result'+index}>
                            
                            <Box layout='flexBoxRow' css={{alignItems:'center', fontSize:'$6'}}>
                                <User size='sm' profile={item}/>
                                <>{AddressPrettyPrint(item.ensLabel)}</>         
                           </Box>
                            {((list.findIndex((itemS:SubscribedPublication)=>itemS.ensLabel === item.ensLabel) === -1) &&
                             (current.findIndex((itemS:SubscribedPublication)=>itemS.ensLabel === item.ensLabel) === -1)
                            ) 
                            ? <StyledButton 
                            onClick={(e:React.SyntheticEvent)=>{
                                e.preventDefault()
                                setList((prevState:SubscribedPublication[])=>{
                                    const newItem:SubscribedPublication = {
                                        avatarURL: item.avatarURL,
                                        type: item.type,
                                        ensLabel: item.ensLabel 
                                    }
                                    return [...prevState, newItem]
                                })
                            }}
                            css={{transform:'scale(0.8)'}}>
                                    <AddIcon/>
                            </StyledButton>
                            : <Box css={{padding:'$1 0',  lineHeight:'140%', fontSize:'$6'}}>In a list</Box>
                            }
                           </StyledSearchResult>
                        )
                    })}
                </StyledSection>

                {list.length >0 && (
                    <StyledSection css={{gap:'$0'}}>
                        <StyledLabel>Added items</StyledLabel>
                        {list.map((item:any, index:number)=>{
                            return(
                            <StyledSearchResult
                            type='list'
                            key={'list items'+index}>
                                
                                <Box layout='flexBoxRow' css={{alignItems:'center', fontSize:'$6'}}>
                                    <User size='sm' profile={item}/>
                                    <>{AddressPrettyPrint(item.ensLabel)}</>   
                                    
                            </Box>
                            <StyledButton isHighlighted={true} css={{transform:'scale(0.8)'}}
                            onClick={(e:React.SyntheticEvent)=>{
                                 e.preventDefault()
                                 setList((prevState:SubscribedPublication[])=>{
                                    const indexUnPin = prevState.findIndex((itemS:SubscribedPublication)=>item.ensLabel=== itemS.ensLabel)
                                    const newArray =[...prevState.slice(0, indexUnPin), ...prevState.slice(indexUnPin + 1)];
                                    return newArray
                                })
                            }}
                            >
                                    <DeleteIcon/>
                            </StyledButton>
                            </StyledSearchResult>
                            )
                        })}
                    </StyledSection>    
                )}

                    {searchState === 'loading' && (
                        <Loader size='small'/>
                    )}
                    {searchState === 'error' && (
                        <>Something went wrong...</>
                    )}
      </Box>
    )
}

export default SearchBox