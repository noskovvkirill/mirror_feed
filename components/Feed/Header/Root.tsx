import Box from "@/design-system/primitives/Box"
import {styled} from 'stitches.config'
import React from 'react'

const StyledContainer = styled('div', {
    marginTop:'calc($4 + $4)',
    marginBottom:'calc($4 * 2)',
    display: 'flex',
    flexDirection: 'row',
    width:'100%',
    maxWidth:'$body',
    gap:'calc($4 + $0)'
})

const StyledPocket = styled('div', {
    display: 'flex',
    flexDirection: 'column',
})

interface IRoot {
    children:React.ReactNode | React.ReactNode[]
    controls:React.ReactNode | React.ReactNode[]
}

const Root = ({children, controls}:IRoot) => {
    return(
        <StyledContainer>
            <StyledPocket>
                {controls}
            </StyledPocket>
            {children}
        </StyledContainer>
    )
}

export default Root