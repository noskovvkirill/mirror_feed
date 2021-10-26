import Body from '@/design-system/Article/Body'
import Box from '@/design-system/primitives/Box'
import React from 'react'
import type {BodyInternal} from '@/design-system/Article/Body'

const BodyCuration = (props:BodyInternal) => <Box as='section' css={{marginRight:'calc($4 * 1.5)'}}><Body {...props}/></Box>


export default BodyCuration