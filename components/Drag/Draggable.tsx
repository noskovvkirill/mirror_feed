import {useDraggable} from '@dnd-kit/core'
import PinnedComponent  from '@/design-system/PinnedItem' 
import Handler from '@/design-system/Drag/Handler';

function Draggable(props:any) {  
    const Element = props.element || 'div';  
    const {attributes, listeners, setNodeRef} = useDraggable({    id: props.id.toString()  });    
    return (
        <Element 
        ref={setNodeRef}>
              <PinnedComponent  
                isActive={props.isActive}
                item={props.item}>
                <Handler  {...listeners} {...attributes}/>
            </PinnedComponent>
        </Element>  
    );
}

export default Draggable