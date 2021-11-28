import {useDraggable} from '@dnd-kit/core'
import Handler from '@/design-system/Drag/Handler';
import Pinned from '@/design-system/Pinned'

function Draggable(props:any) {  
    const Element = props.element || 'div';  
    const {attributes, listeners, setNodeRef} = useDraggable({    id: props.id.toString()  });    
    return (
        <Element 
        ref={setNodeRef}>
              <Pinned.Root  
                item={props.item}
                isActive={props.isActive}
                >
                <Pinned.ControlsNotSync>
                    <Handler  {...listeners} {...attributes}/>
                </Pinned.ControlsNotSync>
            </Pinned.Root>
        </Element>  
    );
}

export default Draggable