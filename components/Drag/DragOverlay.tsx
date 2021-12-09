import {DragOverlay} from '@dnd-kit/core'
// import PinnedComponent  from '@/design-system/PinnedItem' 
import { forwardRef} from 'react'
import Handler from '@/design-system/Drag/Handler'
import Pinned from '@/design-system/Pinned'

interface Props {
  dragOverlay?: boolean;
  dragging?: boolean;
  handle?: boolean;
  label?: string;
  children:any;
}

const Item = forwardRef<HTMLDivElement, Props>(({children, ...props}, ref) => {  
 return (<div {...props} ref={ref}>{children}</div>)
});

Item.displayName ='Item'
interface IOverlay {
    activeId:string | null;
    item:any;
}

const Overlay = ({activeId, item}:IOverlay) => {
    return(
        <DragOverlay >
            {(activeId && item)
            ? <Item>
                <Pinned.Root 
                isDragged={true}
                item={item}>
                    <Pinned.ControlsNotSync isHighlighted={true}>
                        <Handler isActive={true}/>
                    </Pinned.ControlsNotSync>
                </Pinned.Root>
              </Item>
            : null}
        </DragOverlay>
    )}

export default Overlay