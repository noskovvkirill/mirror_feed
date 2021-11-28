import Profile from '@/design-system/primitives/Profile'
import type {ProfileTypes} from '@/design-system/primitives/Profile'

import Box from '@/design-system/primitives/Box'
interface IProfileList {
    profiles: ProfileTypes[],
    size?:'og' | 'lg' | 'md'| 'sm',
    key:string
}
const ProfileList = ({ profiles, size, key }:IProfileList) => {
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
        </Box>
    )
}

export default ProfileList