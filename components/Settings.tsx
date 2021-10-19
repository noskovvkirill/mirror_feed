import Box from "@/design-system/primitives/Box"
import Button from "@/design-system/primitives/Button"
import { styled } from "stitches.config"
import ButtonPopover from "@/design-system/primitives/ButtonPopover"
import * as Tabs from '@radix-ui/react-tabs';
import AdjustIcon from '@/design-system/icons/Adjust'
import ColorPicker from '@/design-system/primitives/ColorPicker'
import React from 'react'
import {Color} from '@/design-system/Nav'
import {StyledTabsList, StyledTabsTrigger, StyledTabsContent} from '@/design-system/Spaces/SpacesSelector'
import Image from 'next/image'

interface ISettings {
    UpdateTheme:any,
    themes?:string[],
    theme?:string
}



const Settings = ({UpdateTheme, themes, theme}:ISettings) => {
    return(
        <ButtonPopover icon={<AdjustIcon/>} label='change' isHighlighted={true}>
          <Tabs.Root defaultValue='settings'>
              <Box layout='flexBoxRow' css={{alignItems:'center', boxSizing:'border-box', padding:'$2 $2', justifyContent:'space-between'}}>
                <StyledTabsList css={{boxSizing:'border-box', color:'$foregroundText'}}>
                    <StyledTabsTrigger value='login'>Sign In</StyledTabsTrigger>
                    <StyledTabsTrigger value='settings'>Settings</StyledTabsTrigger>
                </StyledTabsList>
                <Box css={{
                    minWidth:33,
                    height:33,
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    boxSizing:'border-box',
                    padding:'$1', 
                    lineHeight:'$6',
                    borderRadius:'$round', color:'$background', background:'$foreground'}}>
                    <AdjustIcon/>
                </Box>
             </Box>
                <StyledTabsContent value='login' css={{overflow:'hidden'}}>
                    <Box css={{transform:'scale(1.08)', userSelect:'none'}}>
                        <img alt='coming soon' src='/comingsoon.jpg' width="100%" height="100%"/>
                    </Box>
                </StyledTabsContent>
                <StyledTabsContent value='settings' css={{boxSizing:'border-box'}}>
                    <Box layout='flexBoxRow' css={{alignItems:'flex-start', padding:'$2', color:'$text', gap:'$2', 'span':{fontSize:'$6', color:'$foregroundText'}}}>
                        <p style={{whiteSpace:'nowrap', lineHeight:'100%', color:'inherit', userSelect:'none'}}>Select theme</p>
                        <span>Custom theming is coming soon ✨</span>
                    </Box>
                    <Box layout='flexBoxRow' css={{flexWrap:'wrap', padding:'$1 $2 $4 $2'}}>
                    {themes?.map((item:string)=>(
                        <Box 
                        layout='flexBoxColumn'
                        css={{color:'$foreground', width:'33px', fontSize:'$6', whiteSpace:'break-spaces', wordBreak:'break-all'}}
                        key={'theme'+item}>
                            <Box 
                            onClick={()=>{
                                UpdateTheme(item)
                            }}
                            css={{
                                cursor:'pointer',
                                width:'33px',
                                height:'33px',
                                background: item === 'light-cream' ? 
                                `linear-gradient(0deg, #E0CEC7 50%, rgba(255, 255, 255, 1) 50%)` 
                                : item === 'dark-plain' 
                                ? `linear-gradient(0deg, #1B1B18 50%, #2E2E2B 50%)`
                                : item === 'light-blue' 
                                ? `linear-gradient(0deg, #3E63DD 50%, rgba(255, 255, 255, 1) 50%)`
                                : item === 'dark-blue' 
                                ? `linear-gradient(0deg, #273E89 50%, #2E2E2B 50%)` 
                                : `linear-gradient(145deg, #1B1B18 50%, rgba(255, 255, 255, 1) 50%)`, //system
                                borderRadius:'$round',
                                outline:item !== theme ? '1px solid $foreground' : '3px solid $foreground',
                                '&:hover':{
                                    outline:'3px solid $foreground'
                                }
                            }}>
                           

                            </Box>
                            {item}
                        </Box>
                    ))}
                    </Box>
                    {/* <p>Theme settings</p> */}
                    {/* <Box css={{width:'100%', overflow:'hidden'}}>
                        {colors && (
                            <>
                            {Object.keys(colors).map((key:string)=>{
                                return(
                                    <Box layout='flexBoxRow' key={'theme_color'+key} css={{padding:'0 $2', justifyContent:'space-between', fontSize:'$6'}}>
                                        {key} {colors[key].hex}
                                        <ColorPicker color={colors[key]} setColor={(newValue:Color)=>{dispatch({color:key, value:newValue})}}/>
                                    </Box>
                                )
                            })}
                            </>
                        )}
                    </Box> */}
                    {/* <Button onClick={UpdateTheme}>Update theme 1 </Button> */}
                </StyledTabsContent>
            </Tabs.Root>
        </ButtonPopover>

    )
}

export default Settings