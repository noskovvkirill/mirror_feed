//utils
import {styled} from 'stitches.config'

//components
import Box from '@/design-system/primitives/Box'
import Loader from '@/design-system/primitives/Loader'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import AddIcon from '@/design-system/icons/Add'
//state
import {useRecoilValueLoadable, useSetRecoilState,useRecoilCallback} from 'recoil'
import { userSpaces , curatedSpaceNotSync} from 'contexts'
import {useAuth} from 'contexts/user'
//types
import type {SpaceType, CuratedSpaceNotSync} from 'contexts/spaces'
import type {UserType} from 'contexts/user'

interface IAddToSpace{
    // user:UserType,
    item:any
}

const StyledItem = styled(DropdownMenu.Item, {
    display: 'flex',
    flexDirection:'row',
    width:'100%',
    padding:'$1 $2',
    backgroundColor:'$highlight',
    borderRadius:'$2',
    color:'$foreground',
    boxSizing:'border-box',
    cursor:'pointer',
    transition:'$background',
    '&:hover':{
        color:'$foregroundTextBronze',
        background:'$highlightBronze'
    }
})

const StyledContainer = styled(DropdownMenu.Content, {
    display:'flex',
    flexDirection:'column',
    zIndex:'100',
    alignItems:'center',
    justifyContent:'center',
    boxShadow:'$large',
    gap:'$1',
    boxSizing:'border-box',
    padding:'$1',
    borderRadius:'$2', 
    width:'320px',
    position:'absolute',
    border:'1px solid $foregroundBorder',
    background:'$background',
    '@media (prefers-reduced-motion: no-preference)': {
        '&[data-state="open"]': {
            // animationName:`${AnimationContentDisplay}`,
            animationDuration: '400ms',
            animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            animationFillMode:'forwards',
            willChange: 'transform, opacity'
        }
    }
})

const StyledCurationButton = styled(DropdownMenu.Trigger, {
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    background:'none',
    borderRadius:'$round',
    border:'1px solid $foregroundBronze',
    color:'$foregroundTextBronze',
    padding:'$1', 
    transition:'$background',
    cursor:'pointer',
    '&:hover':{
        background:'$foregroundBronze',
         color:'$background',
    },
    variants: {
        isOpen:{
            true:{
                color:'$background',
                background:'$foregroundBronze',
            },
            false:{}
        }
    },
    defaultVariants:{
        isOpen:false
    }
})


const AddToSpace = ({item}:IAddToSpace)=>{
    const {user} = useAuth()
    const spaces = useRecoilValueLoadable<SpaceType[]>(userSpaces(user?.address))
    const setMyCurated = useSetRecoilState(curatedSpaceNotSync([spaces.contents[0]])) //personal curated items

    const UpdateSpace = useRecoilCallback(({snapshot, set})=>async (spaceIndex:number)=>{
            const itemsCurrently:CuratedSpaceNotSync = await snapshot.getPromise(curatedSpaceNotSync(spaceIndex));
            console.log('items currently', itemsCurrently)
            const newItem = {
                id: itemsCurrently[itemsCurrently.length-1].id += 1,
                type:'entry',
                item:item
            }
            console.log('new item', newItem)
    },[])

   
   if(spaces.state === 'hasValue' && user?.address){
       console.log('this works!')
     return (
         <DropdownMenu.Root>
            <StyledCurationButton>
                <AddIcon/>
            </StyledCurationButton>
              <StyledContainer>
                <span>Add to space</span>
            {spaces.contents.map((space:SpaceType, index:number)=>(
                <StyledItem 
                onSelect={()=>{UpdateSpace(index)}}
                key={'space-list-add'+space.tokenId.toString()}>
                    {space.name}
                </StyledItem>
        ))} </StyledContainer>
           
       
        </DropdownMenu.Root>
    )} else if(!user?.isConnected) {
        return(<Box>Connect U</Box>)
    }else {
        return(<Loader size='small'>Loading spaces..</Loader>)
    }

   
  
}

export default AddToSpace