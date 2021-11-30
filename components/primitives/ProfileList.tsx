import Profile from '@/design-system/primitives/Profile'
import type {ProfileTypes} from '@/design-system/primitives/Profile'
import Label from '@/design-system/primitives/Label'

import Box from '@/design-system/primitives/Box'
interface IProfileList {
    profiles: ProfileTypes[],
    size?:'og' | 'lg' | 'md'| 'sm',
    key:string,
    total?:number
}
const ProfileList = ({ profiles, size, key, total }:IProfileList) => {
    return(
        <Box 
        layout='flexBoxRow'
        css={{
            display: 'flex',
            gap:'0',
            padding:'0 $1'
        }}>
            {profiles.map((profile, index) => (
                <Profile 
                size={size}
                profile={profile} key={'profile_avatar_stack'+key+index} />
            ))}

            {/* TODO: Adjust variants for diff sizes */}
            {total && (
                <Box 
                layout='flexBoxRow'
                css={{width:'calc($4 * 0.8)', outline:'3px solid $foreground', height:'calc($4 * 0.8)', alignItems:'center', justifyContent:'center', overflow:'hidden', backgroundColor:'$highlight', color:'$foregroundText', borderRadius:'$round'}}>
                    <Label>+{total}</Label>
                </Box>
            )}
        </Box>
    )
}

export default ProfileList