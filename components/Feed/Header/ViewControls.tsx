import Box from '@/design-system/primitives/Box'
import ButtonControl from '@/design-system/primitives/ButtonControl'
//icons
import SquaresIcon from '@/design-system/icons/Squares'
import ListIcon from '@/design-system/icons/ListIcon'
//state
import { settings } from 'contexts'
import { useSetRecoilState } from 'recoil'
import { useRecoilValueAfterMount } from 'hooks/useRecoilValueAfterMount'

const ViewControls = ({ }) => {
  const setSettings = useSetRecoilState(settings)
  const appSettings = useRecoilValueAfterMount(settings, { view: 'card' })
  return (
    <Box layout='flexBoxColumn' css={{ padding: '0 calc($4 * 1)', }}>
      <ButtonControl
        onClick={() => {
          setSettings({ ...appSettings, view: 'card' })
        }}
        label='&thinsp;cards view'
        selected={appSettings.view === 'card'}
        isHighlighted={false}><SquaresIcon /></ButtonControl>
      <ButtonControl
        onClick={() => {
          setSettings({ ...appSettings, view: 'list' })
        }}
        label='&thinsp; list view'
        selected={appSettings.view === 'list'}
        isHighlighted={false}>
        <ListIcon />
      </ButtonControl>
    </Box>
  )
}

export default ViewControls