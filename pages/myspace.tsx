import Box from '@/design-system/primitives/Box'
import Layout from '@/design-system/Layout'
// import {useDroppable} from '@dnd-kit/core';
import {useDraggable, useDroppable} from '@dnd-kit/core'
import {DndContext,closestCorners} from '@dnd-kit/core';

function Draggable(props:any) {  
    const Element = props.element || 'div';  
    const {attributes, listeners, setNodeRef, transform} = useDraggable({    id: props.id,  });   
    const style = transform ? {    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,  } : undefined; 
    return (    
    <Element style={style} ref={setNodeRef} {...listeners} {...attributes}>      
    {props.children}    
    </Element>  
    );
}

const MySpace = () => {
     const {isOver, setNodeRef} = useDroppable({    id: 'droppable_myspace',  });

    return(
        <Layout>
            <DndContext 
             collisionDetection={closestCorners}
            onDragStart={()=>console.log('start')}>
            <div ref={setNodeRef} style={{padding:'24px',color:'white'}}>
                Hey, how are you!
                {JSON.stringify(isOver)}
            </div>
            <div style={{width:'500px', height:'500px'}}>
                 <Draggable id="draggable_ITEMSKI" >
                    <div 
                    draggable
                    style={{padding:'16px', position:'relative', background:'gray', width:'120px'}}
                    // css={{padding:'$2', backgroundColor:'$foreground'}}
                    >DRAG ME</div>
                </Draggable>
            </div>
            </DndContext>
        </Layout>
    )
}

export default MySpace