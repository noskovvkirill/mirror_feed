import Box from '@/design-system/primitives/Box'
import Layout from '@/design-system/Layout'

import { useDroppable} from '@dnd-kit/core'
import {useState} from 'react'



const Droppable = ({id}:{id:string}) => {
    const {isOver, setNodeRef} = useDroppable({id: id});
       return(
         <div ref={setNodeRef} style={{padding:'24px', background:'gray', color:!isOver ? 'white' : 'blue'}}>
                Hey, how are you!
                {JSON.stringify(isOver)}
         </div>
     )
}



const MySpace = () => {
    const [active, setActive] = useState(false)

    return(
        <Layout>
           
            <Droppable id={'21'}/>
            <Box css={{height:'120px', background:'red'}}>
                RED ZONE
            </Box>
            <Droppable id={'22'}/>

       


    
        </Layout>
    )
}

export default MySpace