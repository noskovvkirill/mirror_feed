import Profile from '@/design-system/primitives/Profile'
import Box from '@/design-system/primitives/Box'
// import type {SubscribedPublication, Publication} from 'contexts'
// import type {User} from '@/design-system/primitives/Profile'

const Contributors = ({Open, data}:{Open:(route:string)=>void; data:any[]}) =>{
    if(!data) {
        return(
             <Box layout='flexBoxColumn' css={{flexWrap:'wrap'}}>
                <Profile key={'contributor placeholder'} profile={{displayName:'', address:'', avatarURL:undefined}}/>
             </Box>
        )
    }
    return(
        <Box layout='flexBoxColumn' css={{flexWrap:'wrap'}}> 
            {data?.map((contributor:any, index)=>{
                return(
                <Box 
              onClick={()=>{
                    contributor.publications[0] 
                    ?   Open(`/${encodeURIComponent(contributor.publications[0].ensLabel)}`)
                    :   Open(`/${encodeURIComponent(contributor.address)}`)
                    }}
                key={'contributor'+index + contributor.displayName} ><Profile profile={contributor}/></Box>
                )
            })}
        </Box>
    )
}

export default Contributors