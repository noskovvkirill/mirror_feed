import { styled } from 'stitches.config'
//components
import Box from '@/design-system/primitives/Box'
import Tag from '@/design-system/primitives/Tag'
import SyncIcon from '@/design-system/icons/Sync'
import ButtonControl from '@/design-system/primitives/ButtonControl'
import Pinned from '@/design-system/Pinned'
import Placeholder from '@/design-system/Curation/Placeholder'
import Loader from '@/design-system/primitives/Loader'
import Label from '@/design-system/primitives/Label'
//hooks
import { useDroppable } from '@dnd-kit/core'
//types
import type { CuratedSpaceNotSync, CuratedSpaceItem, PinnedItem } from 'contexts'


const StyledContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  width: '$body',
  maxWidth: '$body',
  borderRadius: '$2',
  overflow: 'hidden',
  position: 'relative',
})

const Droppable = ({ id, children }: { id: string, children: React.ReactElement[] | React.ReactElement }) => {
  const { isOver, setNodeRef } = useDroppable({ id: id });
  return (
    <Box ref={setNodeRef} css={{
      position: 'relative',
      boxShadow: '$normal',
      padding: '', borderRadius: '8px', minHeight: '60vh',
      backgroundColor: isOver ? "$foregroundBronze" : '$tint',
      opacity: isOver ? '0.5' : '1',
    }}>
      {children}
    </Box>
  )
}

interface IDropZone {
  notSync: CuratedSpaceNotSync;
  RemoveItem: (item: PinnedItem) => void;
  syncState: "default" | "loading" | "error"
}

const Dropzone = ({ notSync, RemoveItem, syncState }: IDropZone) => {
  return (
    <Droppable id={'curated'}>
      <>
        {syncState === 'loading' && (
          <Box
            layout='flexBoxRow'
            css={{
              position: 'absolute',
              alignItems: 'center',
              zIndex: '100000',
              justifyContent: 'center',
              width: '100%',
              minWidth: '$body',
              borderRadius: '$2',
              opacity: 0.8,
              height: '100%',
              boxSizing: 'border-box',
              padding: '$2',
              backgroundColor: '$tint',
              left: 0, top: 0
            }}>
            <Loader size='default' />
          </Box>
        )}

        {notSync?.items.length > 0 ?
          <StyledContainer
          >
            {syncState === 'error' && (
              <Label color='error'>Something went wrong syncing your items</Label>
            )}
            {/* <Box 
                    layout='flexBoxColumn'
                    css={{padding:'$4'}}>
                        <ButtonControl label='new' isHighlighted={false}>
                            Re
                        </ButtonControl>
                           <ButtonControl label='new' isHighlighted={false}>
                            Inf
                        </ButtonControl>
                    </Box> */}
            {/* Body */}
            <Box layout='flexBoxColumn' css={{ gap: '$4', padding: 'calc($4 + $0) $4' }}>
              <Box layout='flexBoxRow'>
                <Tag>Not synced list</Tag>
                <Tag>{notSync.items.length}</Tag>
              </Box>
              <Box layout={'flexBoxRow'} css={{ flexWrap: 'wrap' }}>
                {notSync.items.map((item: CuratedSpaceItem) => {
                  return (
                    <Pinned.Root
                      isActive={false}
                      key={'my_space_item_notsynced' + item.item.id}
                      item={item}
                    >
                      <Pinned.ControlsSync
                        Remove={RemoveItem}
                        item={item}
                      />
                    </Pinned.Root>
                  )
                })}
              </Box>
            </Box>
          </StyledContainer>
          : <StyledContainer css={{ gap: "$2", justifyContent: 'flex-start', flexWrap: 'wrap', display: 'flex', padding: 'calc($4 + $0) $4', boxSizing: 'border-box', width: '100%', background: 'transparent' }}>
            <Box css={{ width: '100%', padding: '0', boxSizing: 'border-box', alignItems: 'flex-start', height: 'fit-content', marginBottom: '$2' }}>
              <Tag>Place your items from pinned list here</Tag>
            </Box>
            <Box css={{
              borderRadius: '$2',
              width: '256px',
              height: '128px',
              opacity: 0.5,
              backgroundColor: '$highlight'
            }} />
            <Box css={{
              borderRadius: '$2',
              width: '256px',
              height: '128px',
              opacity: 0.5,
              backgroundColor: '$highlight'
            }} />
            <Box css={{
              borderRadius: '$2',
              width: '256px',
              height: '128px',
              opacity: 0.5,
              backgroundColor: '$highlight'
            }} />
            <Box css={{
              borderRadius: '$2',
              width: '256px',
              height: '128px',
              opacity: 0.5,
              backgroundColor: '$highlight'
            }} />
            <Box css={{
              borderRadius: '$2',
              width: '256px',
              height: '128px',
              opacity: 0.5,
              backgroundColor: '$highlight'
            }} />
            <Box css={{
              borderRadius: '$2',
              width: '256px',
              opacity: 0.5,
              height: '128px',
              backgroundColor: '$highlight'
            }} />
            <Box css={{
              borderRadius: '$2',
              width: '256px',
              height: '128px',
              opacity: 0.5,
              backgroundColor: '$highlight'
            }} />
            <Box css={{
              borderRadius: '$2',
              width: '256px',
              height: '128px',
              opacity: 0.5,
              backgroundColor: '$highlight'
            }} />
            <Box css={{
              borderRadius: '$2',
              width: '256px',
              height: '128px',
              opacity: 0.5,
              backgroundColor: '$highlight'
            }} />
            <Box css={{
              borderRadius: '$2',
              width: '256px',
              height: '128px',
              opacity: 0.5,
              backgroundColor: '$highlight'
            }} />
            <Box css={{
              borderRadius: '$2',
              width: '256px',
              height: '128px',
              opacity: 0.5,
              backgroundColor: '$highlight'
            }} />
            <Box css={{
              borderRadius: '$2',
              width: '256px',
              height: '128px',
              opacity: 0.5,
              backgroundColor: '$highlight'
            }} />



          </StyledContainer>
        }
      </>
    </Droppable>
  )
}

export default Dropzone