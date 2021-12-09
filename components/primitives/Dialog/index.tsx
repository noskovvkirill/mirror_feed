
import * as Dialog from '@radix-ui/react-dialog';
import { styled, keyframes, dialogShow } from 'stitches.config'

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 0.65 },
});


export const Root = Dialog.Root
export const Trigger = Dialog.Trigger
export const StyledContent = styled(Dialog.Content, {
  padding: '$4',
  border: '1px solid $foregroundBorder',
  borderRadius: '$2',
  background: '$background',
  color: '$foregroundText',
  width: '512px',
  maxHeight: '80vh',
  overflow: 'scroll',
  position: 'fixed',
  top: '50%',
  left: '50%',
  boxShadow: '$normal',
  transform: 'translate(-50%, -50%)',
  '&:focus': { outline: 'none' },
  'p': {},
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${dialogShow} 550ms cubic-bezier(0.16, 1, 0.3, 1)`,
    animationFillMode: 'forwards'
  },
})

export const StyledOverlay = styled(Dialog.Overlay, {
  backgroundColor: '$background',
  opacity: 0.65,
  position: 'fixed',
  inset: 0,
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
    animationFillMode: 'forwards'
  },
})

export const StyledTitle = styled(Dialog.Title, {
  fontSize: '$4',
  margin: 0,
  lineHeight: '$4',
})

export const StyledDescription = styled(Dialog.Description, {
  fontSize: '$p'
})
