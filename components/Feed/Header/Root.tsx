import { styled } from 'stitches.config'
import React from 'react'
import type { CSS } from '@stitches/react'

const StyledContainer = styled('div', {
    marginTop: 'calc($4 * 4)',
    marginBottom: 'calc($4 * 1.5)',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    gap: 'calc($4 + $0)',
    '@bp1': {
        maxWidth: '100%',
        boxSizing: 'border-box',
        padding: '0 $2',
        marginTop: 'calc($4 * 2)',
        // overflow: 'hidden'
    },
    variants: {
        isFullScreen: {
            false: {
                maxWidth: '$body',
            },
            true: {
                width: '100%'
            }
        }
    },
    defaultVariants: {
        isFullScreen: false
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
    isFullScreen?: boolean,
    // rest?: React.ReactPropTypes,
    css?: CSS
}

const Root = ({ children, controls, css, ...props }: IRoot) => {
    return (
        <StyledContainer css={css}  {...props}>
            <StyledPocket>
                {controls}
            </StyledPocket>
            {children}
        </StyledContainer>
    )
}

export default Root