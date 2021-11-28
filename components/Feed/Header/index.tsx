
//components
import Box from '@/design-system/primitives/Box'
import Heading from '@/design-system/primitives/Heading'
import Root from '@/design-system/Feed/Header/Root'

import ViewControls from '@/design-system/Feed/Header/ViewControls'
import TopCurators from '@/design-system/Feed/Header/TopCurators'

export {
  Root,
  ViewControls,
  TopCurators,
}


// const Header  = () => {
//     return(
//        <Root controls={<ViewControls/>}>
//            <Box layout='flexBoxColumn' css={{width:'100%'}}>
//                <Box layout='flexBoxRow'>
//                     <Heading 
//                     size={'h1'}
//                     color={"foregroundText"}>
//                         Explore&nbsp;
//                     </Heading>
//                     <Heading 
//                     size={'h1'}
//                     color={"highlight"}>
//                         Top in 7 days
//                     </Heading>
//                 </Box>
//                 <TopCurators/>
//             </Box>
//         </Root>
//     )
// }

// export default Header