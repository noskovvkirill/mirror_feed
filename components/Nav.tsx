import Box from "@/design-system/primitives/Box"
import Button from "@/design-system/primitives/Button"
import { styled } from "stitches.config"
// import NotificationsIcon from '@/design-system/icons/Notifications'
import {useRouter} from 'next/router'
import { useSetRecoilState } from "recoil"
import { useRecoilValueAfterMount } from "hooks/useRecoilValueAfterMount"
import {readLaterList, ReadingListItem} from 'contexts'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const StyledNav= styled(Box, {
    zIndex:'1000',
    backdropFilter:'opacity(30%)',
    display:'flex',
    flexDirection:'row',
    gap:'$1',
    position:'fixed', top:'calc($4 + $2)', right:'calc($4 + $4)'
})

const StyledContent = styled(DropdownMenu.Content,{
    marginTop:'$1',
    padding:'$2',
    borderRadius:'$2',
    maxHeight:'calc($4 * 12)',
    overflow:'hidden',
    backgroundColor:'$highlightBronze',
    mixBlendMode:'multiply',
    width:'calc($4 * 8)',
    display:'flex',
    flexDirection:'column',
    gap:'$1',
    listStyle:'none',
    boxShadow:'$normal'
})


const StyledItem = styled(DropdownMenu.Item, {
    display:'flex',
    width:'100%',
    gap:'$2',
    fontSize:'$6',
    maxWidth:'100%',
    color:'$foregroundTextBronze',
    marginBottom:'$1',
    cursor:'pointer',
    transition:'$color',
    position:'relative',
    '&:hover':{
          color:'$textBronze',
    },
    // expand the reach of the text 
    '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    minWidth: 44,
    minHeight: 44,
  },
})

const StyledDelete = styled('button', {
      display:'flex',
      alignItems:'center',
      justifyContent:'flex-end',
      color:'$foregroundTextBronze',
      background:'transparent',
      cursor:'pointer',
      width:'calc($4 * 2)',
      height:'100%',
      border:'0',
     '&:hover':{
          color:'$textBronze',
    },
 
})

const Nav = () =>{
    const router = useRouter();
    const readingList = useRecoilValueAfterMount(readLaterList, [])
    const setReadLater = useSetRecoilState(readLaterList) 

    return(
        <StyledNav>
         
            {/* <Button 
            css={{padding:'$1 calc($1 * 1.5)', marginRight:'$2'}}><NotificationsIcon/></Button> */}
            <Button
            disabled={router.pathname === '/' ? true : false}
            onClick={()=>{
                router.push('/')
            }}
            >Feed</Button>
            <DropdownMenu.Root>
                <Button
                as={DropdownMenu.Trigger}
                css={{gap:'$1', 
                '&[data-state="open"]': {
                    color:'$foregroundTextBronze',
                    border:'1px solid $highlightBronze',
           
                    backgroundColor:'$highlightBronze'
                }
                }}
                onClick={()=>router.push('/list')}
                disabled={router.pathname === '/list' ? true : false}
                >Reading List {readingList.length > 0 && (
                <> ▾&#8201;{readingList.length}</>
                )}</Button>
                <StyledContent align='end'>
                    {readingList.length === 0 && (
                        <Box as='p' css={{fontSize:'$6', color:'$foregroundTextBronze', margin:'0', textAlign:'center'}}>Nothing here yet&nbsp; 🔭</Box>
                    )}
                    {readingList.map((item:ReadingListItem)=>{
                        return(
                            <Box layout='flexBoxRow'
                            css={{justifyContent:'space-between', position:'relative', gap:'$2'}}
                              key={'read-later-list'+item.entryDigest}>
                                <StyledItem 
                                onClick={()=>{
                                  router.push(`/${item.ensLabel}/${item.entryDigest}`)
                                }}
                               >
                                    <>✦&#8201;{item.title}</>                            
                                </StyledItem>

                                <StyledDelete
                                onClick={()=>{
                                    setReadLater((prevState:ReadingListItem[])=>{
                                    const indexUnPin = prevState.findIndex((itemPrev:ReadingListItem)=>itemPrev.entryDigest=== item.entryDigest)
                                    const newArray =[...prevState.slice(0, indexUnPin), ...prevState.slice(indexUnPin + 1)];
                                    return newArray
                                })}}
                                >
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.877075 7.49988C0.877075 3.84219 3.84222 0.877045 7.49991 0.877045C11.1576 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1575 0.877075 7.49988ZM7.49991 1.82704C4.36689 1.82704 1.82708 4.36686 1.82708 7.49988C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49988C13.1727 4.36686 10.6329 1.82704 7.49991 1.82704ZM9.85358 5.14644C10.0488 5.3417 10.0488 5.65829 9.85358 5.85355L8.20713 7.49999L9.85358 9.14644C10.0488 9.3417 10.0488 9.65829 9.85358 9.85355C9.65832 10.0488 9.34173 10.0488 9.14647 9.85355L7.50002 8.2071L5.85358 9.85355C5.65832 10.0488 5.34173 10.0488 5.14647 9.85355C4.95121 9.65829 4.95121 9.3417 5.14647 9.14644L6.79292 7.49999L5.14647 5.85355C4.95121 5.65829 4.95121 5.3417 5.14647 5.14644C5.34173 4.95118 5.65832 4.95118 5.85358 5.14644L7.50002 6.79289L9.14647 5.14644C9.34173 4.95118 9.65832 4.95118 9.85358 5.14644Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                </StyledDelete>

                            </Box>
                        )
                    })}

                                {/* <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.877075 7.49988C0.877075 3.84219 3.84222 0.877045 7.49991 0.877045C11.1576 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1575 0.877075 7.49988ZM7.49991 1.82704C4.36689 1.82704 1.82708 4.36686 1.82708 7.49988C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49988C13.1727 4.36686 10.6329 1.82704 7.49991 1.82704ZM9.85358 5.14644C10.0488 5.3417 10.0488 5.65829 9.85358 5.85355L8.20713 7.49999L9.85358 9.14644C10.0488 9.3417 10.0488 9.65829 9.85358 9.85355C9.65832 10.0488 9.34173 10.0488 9.14647 9.85355L7.50002 8.2071L5.85358 9.85355C5.65832 10.0488 5.34173 10.0488 5.14647 9.85355C4.95121 9.65829 4.95121 9.3417 5.14647 9.14644L6.79292 7.49999L5.14647 5.85355C4.95121 5.65829 4.95121 5.3417 5.14647 5.14644C5.34173 4.95118 5.65832 4.95118 5.85358 5.14644L7.50002 6.79289L9.14647 5.14644C9.34173 4.95118 9.65832 4.95118 9.85358 5.14644Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg> */}

                    {readingList.length > 0 && (
                         <Button 
                        onClick={(e)=>{
                            e.preventDefault()
                            router.push('/list')
                        }}
                        css={{marginTop:'$1', 
                        border:'0',
                        borderTop:'1px dashed $foregroundTextBronze',borderRadius:'0',
                        width:'100%', justifyContent:'center',
                        transition:'$all',
                        '&:hover':{
                            borderRadius:'$2'
                        }
                    }}>
                    
                        See All
                    </Button>
                    )}
      
                   
                </StyledContent>
            </DropdownMenu.Root>
        </StyledNav> 
    )
}

export default Nav