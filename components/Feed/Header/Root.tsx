import { styled } from 'stitches.config'
import React from 'react'
import type { CSS } from '@stitches/react'

const StyledContainer = styled('div', {
    marginTop: 'calc($4 * 2)',
    marginBottom: 'calc($4 * 2)',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    maxWidth: '$body',
    gap: 'calc($4 + $0)',
    '@bp1': {
        maxWidth: '100%',
        overflow: 'hidden'
    }
})

const StyledPocket = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    '@bp1': {
        display: 'none'
    }
})

interface IRoot {
    children: React.ReactNode | React.ReactNode[]
    controls?: React.ReactNode | React.ReactNode[],
    props?: React.ReactPropTypes,
    css?: CSS
}

const Root = ({ children, controls, css, ...props }: IRoot) => {
    return (
        <StyledContainer css={css} {...props}>
            <StyledPocket>
                {controls}
            </StyledPocket>
            {children}
        </StyledContainer>
    )
}

export default Root