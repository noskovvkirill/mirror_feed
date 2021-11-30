import Profile from "@/design-system/primitives/Profile"
import Box from "@/design-system/primitives/Box"
import Tag from "@/design-system/primitives/Tag"

const TopCurators = ({}) => {
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
               <Profile
               size={'lg'}
               profile={
                  { name: 'Kirill Noskov', tokenId:'1', avatarURL:'https://picsum.photos/200/200'}
               }/>
                  <Profile
               size={'lg'}
               profile={
                  { name: 'Kirill Noskov', tokenId:'1', avatarURL:'https://picsum.photos/220/220'}
               }/>
                  <Profile
               size={'lg'}
               profile={
                  { name: 'Kirill Noskov', tokenId:'1', avatarURL:'https://picsum.photos/230/230'}
               }/>
                  <Profile
               size={'lg'}
               profile={
                  { name: 'Kirill Noskov', tokenId:'1', avatarURL:'https://picsum.photos/240/240'}
               }/>
                  <Profile
               size={'lg'}
               profile={
                  { name: 'Kirill Noskov', tokenId:'1', avatarURL:'https://picsum.photos/250/200'}
               }/>
                  <Profile
               size={'lg'}
               profile={
                  { name: 'Kirill Noskov', tokenId:'1', avatarURL:'https://picsum.photos/260/200'}
               }/>
                  <Profile
               size={'lg'}
               profile={
                  { name: 'Kirill Noskov', tokenId:'1', avatarURL:'https://picsum.photos/280/200'}
               }/>
                  <Profile
               size={'lg'}
               profile={
                  { name: 'Kirill Noskov', tokenId:'1', avatarURL:'https://picsum.photos/290/200'}
               }/>
                  <Profile
               size={'lg'}
               profile={
                  { name: 'Kirill Noskov', tokenId:'1', avatarURL:'https://picsum.photos/300/200'}
               }/>
               </Box>

               <Box layout='flexBoxRow' css={{padding:'0 calc($4 * 2) 0 0'}}>
                  <Tag css={{borderRadius:'$2'}}>Total Staked 1200 ●</Tag>
               </Box>
      </Box>
    )
}

export default TopCurators