import Profile from '@/design-system/primitives/Profile'
import Box from '@/design-system/primitives/Box'
// import type {SubscribedPublication, Publication} from 'contexts'
// import type {User} from '@/design-system/primitives/Profile'

const Contributors = ({Open, data}:{Open:(route:string)=>void; data:any[] | undefined}) =>{
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
                    if(!contributor.publications){
                     Open(`/${encodeURIComponent(contributor.ensLabel)}/?type=${contributor.type}`)
                    }
                    else if(contributor.publications.length>0){ Open(`/${encodeURIComponent(contributor.publications[0].ensLabel)}/?type=ens`)
                    } else {Open(`/${encodeURIComponent(contributor.address)}/?type=personal`)}
                    }}
                key={'contributor'+index + contributor.displayName} ><Profile profile={contributor}/></Box>
                )
            })}
        </Box>
    )
}

export default Contributors