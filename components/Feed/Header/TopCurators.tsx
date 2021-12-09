import Profile from "@/design-system/primitives/Profile"
import Box from "@/design-system/primitives/Box"
import Tag from "@/design-system/primitives/Tag"
import {TopType} from 'pages/explore'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const TopCurators = ({top}:{top:TopType}) => {
    return(
      <Box 
      layout='flexBoxRow'
      css={{
         width:'100%',
         maxWidth:'$body',
         justifyContent:'space-between',
         alignItems:'center',
         padding:'0',
         gap:'$2',
      }}>
          <Box 
            layout='flexBoxRow'
            css={{
               gap:'$2',
               alignItems:'center',
               padding:'$2 0', 
               width:'100%'}}>
                  {top.topCurators.map((curator)=>{
                     return(
                        <Profile key={curator.tokenId + 'top_curator'} 
                        size={'lg'}
                        profile={curator}
                        />
                     )
                  })}
               </Box>
               {top.totalStaked && top.synced_at && (
                  <Box layout='flexBoxRow' css={{padding:'0 calc($4 * 2) 0 0'}}>
                     <Tag css={{borderRadius:'$2'}}>Total Staked {top.totalStaked} ●</Tag>
                     <Tag css={{borderRadius:'$2'}}>Synced {dayjs(top.synced_at).fromNow()}</Tag>
                  </Box>
               )}
      </Box>
    )
}

export default TopCurators