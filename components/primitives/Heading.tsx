import { styled } from 'stitches.config'
import React from 'react'
import { CSS } from '@stitches/react/types/css-util'

interface IStyledHeading {
    size?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'huge',
    children: React.ReactNode,
    color?: 'foregroundText' | 'foregroundTextBronze' | 'text' | 'textBronze' | 'highlight',
    css?: CSS
}
const Heading = styled('h1', {
    margin: '0!important',
    padding: 0,
    fontWeight: '$max',
    variants: {
        size: {
            'huge': {
                fontSize: "3.852rem",
                '@bp1': {
                    fontSize: '$2'
                }
            },
            h1: {
                fontSize: '$1',
                '@bp1': {
                    fontSize: '$3'
                }
            },
            h2: {
                fontSize: '$2',
                '@bp1': {
                    fontSize: '$3'
                }
            },
            h3: {
                fontSize: '$3'
            },
            h4: {
                fontSize: '$4'
            },
            h5: {
                fontSize: '$5'
            }
        },
        color: {
            text: {
                color: '$text'
            },
            textBronze: {
                color: '$textBronze'
            },
            foregroundText: {
                color: '$foregroundText'
            },
            foregroundTextBronze: {
                color: '$foregroundTextBronze'
            },
            highlight: {
                color: '$highlight'
            },
        }
    },
    defaultVariants: {
        size: 'h5',
    }
})

const StyledHeading = ({ size, children, color, css }: IStyledHeading) => {
    return (
        <Heading
            as={size}
            color={color}
            size={size}
            css={{ ...css }}
        >{children}</Heading>
    )
}

export default StyledHeading