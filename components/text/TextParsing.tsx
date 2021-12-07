import { styled } from 'stitches.config'

export const StyledList = styled('ul', {
    listStyle: 'none',
    color: '$foregroundBronzeText',
    margin: '$4 0',
    // paddingLeft: '$2',
    li: {
        color: '$foregroundBronzeText',
        marginBottom: '$2',
        '&:before': {
            content: "\u2022",
            color: '$foregroundBronzeText',
            opacity: 0.3,
            display: 'inline-block',
            width: '1em',
        }
    },
    strong: {
        fontWeight: '$max'
    },
    b: {
        fontWeight: '$max'
    }
})


export const StyledQuote = styled('blockquote', {
    padding: '$0 $2',
    borderLeft: '1px solid $foregroundBronze',
    margin: '$2 0'
})

export const StyledImage = styled('img', {
    maxWidth: '100%',
    margin: '$2 0',
    borderRadius: '$2',
    variants: {
        inline: {
            true: {
                maxHeight: '480px',
            },
            false: {
                maxHeight: '70vh',
            }
        }
    },
    defaultVariants: {
        inline: true
    }
})

export const StyledLabel = styled('span', {
    display: 'inline-block',
    padding: '$0 $2',
    borderRadius: '$round',
    fontSize: '$6',
    userSelect: 'none',
    color: 'inherit',
    transition: '$all',

})

export const StyledLink = styled('a', {
    fontSize: '$p',
    color: 'inherit',
    cursor: 'pointer',
    transition: '$color',
    whiteSpace: 'break-spaces',
    hyphens: 'auto',
    '&:hover': {
        textShadow: '$normal',
        color: '$foregroundText'
    },
})

export const StyledH1 = styled('h1', {
    fontSize: '$1',
    lineHeight: '$1',
    fontWeight: '$max',
    maxWidth: '720px',
    whiteSpace: 'break-spaces',
    hyphens: 'auto',
    '&:target': {
        backgroundColor: '$foregroundBronze'
    },
    color: 'inherit',
})
export const StyledH2 = styled('h2', {
    fontSize: '$3',
    lineHeight: '$3',
    margin: '$4 0 $2 0',
    fontWeight: '$max',
    maxWidth: '720px',
    whiteSpace: 'break-spaces',
    hyphens: 'auto',
    '&:target': {
        backgroundColor: '$foregroundBronze'
    },
    color: 'inherit',
})
export const StyledH3 = styled('h3', {
    fontSize: '$5',
    lineHeight: '$5',
    margin: '$4 0 $2 0',
    fontWeight: '$max',
    maxWidth: '720px',
    whiteSpace: 'break-spaces',
    hyphens: 'auto',
    '&:target': {
        backgroundColor: '$foregroundBronze'
    },
    color: 'inherit',
})
export const StyledH4 = styled('h4', {
    fontSize: '$5',
    lineHeight: '$5',
    fontWeight: '$max',
    margin: '$4 0 $2 0',
    maxWidth: '720px',
    whiteSpace: 'break-spaces',
    hyphens: 'auto',
    '&:target': {
        backgroundColor: '$foregroundBronze'
    },
    color: 'inherit',
    defaultVariants: {
        isHighlighted: false
    }
})
export const StyledH5 = styled('h5', {
    fontSize: '$5',
    lineHeight: '$5',
    fontWeight: '$max',
    maxWidth: '720px',
    whiteSpace: 'break-spaces',
    hyphens: 'auto',
    '&:target': {
        backgroundColor: '$foregroundBronze'
    },
    color: 'inherit',
})





export const StyledToc = styled('nav', {
    color: '$foregroundBronze',
    padding: '$2',
    paddingLeft: 'calc($3 + 4px)',
    top: '256px',
    overflow: 'scroll',
    position: 'sticky',
    listStyle: 'inside',
    'a': {
        userSelect: 'none',
        opacity: 0.5,
        color: '$foregroundBronze',
        fontSize: '$6',
        marginBottom: '$2',
        marginLeft: '-$1',
        '&:active': {
            backgroundColor: '$foregroundBronze'
        },
    },
    'ul': {
        listStyle: 'none'
    },
    'ol': {
        listStyle: 'none'
    },
    'li': {
        paddingLeft: '1px',
        marginBottom: '$2'
    }
})