import Profile from '@/design-system/primitives/Profile'
import type {User as MirrorUser} from '@/design-system/primitives/Profile'

interface IMirrorProfile {
    address:string  
}

const MirrorProfile = ({address}:IMirrorProfile) => {
    const profile:MirrorUser = {
        address:address,
        avatarURL:undefined,
        displayName:undefined
    }
    return(
        <Profile profile={profile}/>
    )
}

export default MirrorProfile
