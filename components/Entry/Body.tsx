import React from 'react'
import { styled } from 'stitches.config'
//types
import { EntryType } from '@/design-system/Entry'
import { ReadingListItem } from 'contexts'
import type { ReactElement } from 'react'
//components
import Link from 'next/link'
import Image from 'next/image'
import Box from '@/design-system/primitives/Box'
import Profile from '@/design-system/primitives/Profile'
import Heading from '@/design-system/primitives/Heading'
export interface BodyInternal {
    entry: EntryType,
    view?: 'card' | 'list',
    metadata: ReactElement<any>,
    children: React.ReactElement<unknown, string | React.JSXElementConstructor<any>>,
    readingList: ReadingListItem[],
    isPreview?: boolean;
    isHover: boolean,
    isFocused: boolean;
    Open: (digest: string) => void;
    setReadLater: (fn: (prevState: ReadingListItem[]) => ReadingListItem[]) => void;
}


const StyledTitle = styled('h1', {
    display: 'flex',
    gap: '$1',
    marginTop: '0',
    alignItems: 'center',
    width: '100%',
    whiteSpace: 'break-spaces',
    variants: {
        isHighlighted: {
            true: {
                color: '$textBronze',
            },
            false: {
                color: '$text',
            }
        },
        type: {
            card: {
                maxWidth: '100%',
                'h1': {
                    fontSize: "$1",
                },
            },
            list: {
                maxWidth: '720px',
                'h1': {
                    fontSize: "$1",
                },
                '@bp1': {
                    maxWidth: '100%',
                }
            }
        }
    },
    defaultVariants: {
        isHighlighted: false,
        type: 'list'
    }
})

const StyledBody = styled('div', {
    display: 'flex',
    width: '100%',
    boxSizing: 'border-box',
    maxHeight: '100%',
    // overflow:'hidden',
    variants: {
        isPreview: {
            true: {
                justifyContent: 'flex-start',
            },
            false: {
                // maxWidth:'700px',
                // alignItems:'center',
                justifyContent: 'center',
            }
        }
    },
    defaultVariants: {
        isPreview: true
    }
})

const StyledArticle = styled('section', {
    display: 'flex',
    flexDirection: 'column',
    '@bp1': {
        width: '100%',
    },
    '@bp2': {
        width: '640px',
    },
    variants: {
        isPreview: {
            true: {
                '@bp3': {
                    width: '100%',
                },
            },
            false: {
                '@bp3': {
                    width: '100%',
                    maxWidth: '1080px'
                },
            }
        },
        type: {
            card: {
                WebkitLineClamp: '4',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
            },
            list: {
                '@bp1': {
                    WebkitLineClamp: '2',
                    // display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                }
            }
        }
    },
    defaultVariants: {
        isPreview: true,
        type: 'list'
    }
})

const StyledText = styled('article', {
    maxHeight: '100%',
    variants: {
        type: {
            card: {
                width: '100%'
            },
            list: {
                // display: 'flex',
                // flexDirection: 'column',
                // alignItems: 'center',
                '@bp1': {
                    width: '100%',
                },
                '@bp2': {
                    width: '640px',
                },
                '@bp3': {
                    width: '700px',
                },
            }
        }
    },
    defaultVariants: {
        type: 'list'
    }
})

const StyledContents = styled('div', {
    overflow: 'hidden',
    boxSizing: 'border-box',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    // justifyContent:'center',
    marginRight: 'calc($4 * 1.5)',
    '@bp1': {
        marginRight: 0
    },
    variants: {
        isPreview: {
            true: {
                alignItems: 'space-between',
            },
            false: {
                alignItems: 'flex-start',
                gap: '$2',
                justifyContent: 'center'
            }
        },
        type: {
            card: {
                marginRight: '0'
            },
            list: {}
        }
    },
    defaultVariants: {
        isPreview: true,
        type: 'list'
    }
})


const RenderImage = ({ featuredImage }: { featuredImage: EntryType["featuredImage"] }) => {
    if (!featuredImage) {
        return (<></>)
    }

    if (featuredImage.sizes.md) {
        <Box css={{ borderRadius: '$2', position: 'relative', objectFit: 'scale-down', maxWidth: '100%', overflow: 'hidden', marginBottom: 'calc($4 + $1)' }}>
            <Image layout='responsive'
                objectFit={'cover'}
                alt='cover'
                src={featuredImage.sizes.md.src}
                width={featuredImage.sizes.md.width}
                height={featuredImage.sizes.md.height}
            />
        </Box>
    }
    if (featuredImage.sizes.lg) {
        <Box css={{ borderRadius: '$2', position: 'relative', maxWidth: '100%', overflow: 'hidden', marginBottom: 'calc($4 + $1)' }}>
            <Image objectFit={'cover'}
                layout='responsive'
                placeholder="blur"
                alt='cover'
                src={featuredImage.sizes.lg.src}
                width={featuredImage.sizes.lg.width}
                height={featuredImage.sizes.lg.height} />
        </Box>
    }
    if (featuredImage.sizes.og) {
        return (
            <Box css={{ borderRadius: '$2', position: 'relative', maxWidth: '100%', overflow: 'hidden', marginBottom: 'calc($4 + $1)' }}>
                <Image objectFit={'cover'} layout='responsive'
                    alt='cover'
                    src={featuredImage.sizes.og.src}
                    width={featuredImage.sizes.og.width}
                    height={featuredImage.sizes.og.height} />
            </Box>
        )
    }
    if (featuredImage.sizes.sm) {
        <Box css={{ borderRadius: '$2', position: 'relative', maxWidth: '100%', overflow: 'hidden', marginBottom: 'calc($4 + $1)' }}>
            <Image objectFit={'cover'} layout='responsive'
                alt='cover'
                src={featuredImage.sizes.sm.src}
                width={featuredImage.sizes.sm.width}
                height={featuredImage.sizes.sm.height} />
        </Box>
    }
    return (<></>)
}


const BodyComponent = (
    {
        entry,
        view = 'list',
        metadata,
        children,
        Open,
        isPreview = true,
        isHover,
        isFocused
    }: BodyInternal
) => (
    <StyledBody
        isPreview={isPreview}>
        <StyledContents isPreview={isPreview} type={view}>
            <StyledArticle type={view} isPreview={isPreview}>
                {!isPreview && (<RenderImage featuredImage={entry.featuredImage} />)}
                {metadata}
                <StyledText type={view}>
                    <Box>
                        <StyledTitle type={view} isHighlighted={(isHover || isFocused) ? true : false}>
                            <Link
                                passHref
                                href={
                                    entry.publication?.ensLabel
                                        ? `/${entry.publication?.ensLabel ? encodeURIComponent(entry.publication?.ensLabel) : encodeURIComponent(entry.author.address)}/${encodeURIComponent(entry.digest)}`
                                        : `/${encodeURIComponent(entry.author.address)}/${encodeURIComponent(entry.digest)}`
                                }>
                                <Box as='a'
                                    css={{
                                        cursor: isPreview ? 'pointer' : 'auto',
                                        fontSize: view === 'list' ? '$1' : '$3',
                                        '@bp1': {
                                            fontSize: '$3'
                                        },
                                        whiteSpace: 'wrap',
                                        wordBreak: 'break-word',
                                        hyphens: 'auto',
                                        fontWeight: "700",
                                        margin: 'calc($4 * 1) 0 $3 0',
                                        fontFamily: '$default',
                                        textDecoration: 'none',
                                        color: 'inherit'
                                    }}>{entry.title}</Box>
                            </Link>
                        </StyledTitle>
                        {children}
                    </Box>
                </StyledText>
            </StyledArticle>
            {/* </Box> */}
        </StyledContents>
    </StyledBody>
)



export default React.memo(BodyComponent)