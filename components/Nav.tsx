import Box from "@/design-system/primitives/Box"
import Button from "@/design-system/primitives/Button"
import { styled } from "stitches.config"
import NotificationsIcon from '@/design-system/icons/Notifications'
import {useRouter} from 'next/router'
import { useRecoilValueAfterMount } from "hooks/useRecoilValueAfterMount"
import {readLaterList, ReadingListItem} from 'contexts'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const StyledNav= styled(Box, {
    zIndex:'1000',
    backdropFilter:'opacity(30%)',
    display:'flex',
    flexDirection:'row',
    gap:'$1',
    position:'fixed', top:'calc($4 + $2)', right:'$4'
})

const StyledContent = styled(DropdownMenu.Content,{
    marginTop:'$1',
    padding:'$2',
    borderRadius:'$2',
    maxHeight:'calc($4 * 12)',
    overflow:'hidden',
    backgroundColor:'$highlightBronze',
    mixBlendMode:'multiply',
    width:'calc($4 * 6)',
    display:'flex',
    flexDirection:'column',
    gap:'$1',
    listStyle:'none'
})


const StyledItem = styled(DropdownMenu.Item, {
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
    //expand the reach of the text 
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

const User = () =>{
    const router = useRouter();
    const readingList = useRecoilValueAfterMount(readLaterList, [])

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
                <StyledContent >
             
                    {readingList.map((item:ReadingListItem)=>{
                        return(
                            <StyledItem 
                            onClick={()=>{
                                router.push(`/article/${item.entryDigest}`)
                            }}
                            key={'read-later-list'+item.entryDigest}>✦&#8201;{item.title}</StyledItem>
                        )
                    })}
      
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
                </StyledContent>
            </DropdownMenu.Root>
        </StyledNav> 
    )
}

export default User