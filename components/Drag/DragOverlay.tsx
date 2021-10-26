import {DragOverlay} from '@dnd-kit/core'
import PinnedComponent  from '@/design-system/PinnedItem' 
import { forwardRef} from 'react'
import Handler from '@/design-system/Drag/Handler'

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
                <PinnedComponent 
                isActive={"dragged"}
                item={item}>
                    <Handler isActive={true}/>
                </PinnedComponent>
              </Item>
            : null}
        </DragOverlay>
    )}

export default Overlay