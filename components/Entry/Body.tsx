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

// import Profile from '@/design-system/primitives/Profile'
// import Heading from '@/design-system/primitives/Heading'
// import { isPresent } from 'framer-motion/types/components/AnimatePresence/use-presence'
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
    // marginTop: '0',
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
                // alignItems: 'center',
                justifyContent: 'center',
            }
        }
    },
    defaultVariants: {
        isPreview: true
    }
})

const StyledContentBody = styled('div', {
    variants: {
        isPreview: {
            true: {

            },
            false: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
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
                alignItems: 'center',
                '@bp3': {
                    width: '100%',
                    maxWidth: '1080px'
                },
                'ul': {
                    paddingLeft: '$2',
                }
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
    color: 'inherit',
    variants: {
        type: {
            card: {
                width: '100%',
                'h1, h2': {
                    fontSize: "$4!important", lineHeight: "$3", margin: '$4 0 $2 0',
                },
                'h1:first-of-type': {
                    fontSize: "$3", lineHeight: "inherit", margin: '$4 0 $2 0',
                },
            },
            list: {
                'h1, h2': {
                    fontSize: '$3!important',
                    margin: '$4 0 $2 0',
                    lineHeight: '$3',
                },
                'h1:first-of-type': {
                    fontSize: "$1",
                    margin: 'calc($4 * 1) 0 $3 0',
                    lineHeight: 'inherit',
                },
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
        },
        isHighlighted: {
            true: {
                color: '$textBronze'
            },
            false: {
                color: '$text'
            }
        },
        // isHighlighted: {
        // }
    },
    defaultVariants: {
        type: 'list',
        isHighlighted: false
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

const ContainerImage = styled('div', {
    borderRadius: '$2',
    justifySelf: 'center',
    position: 'relative',
    objectFit: 'scale-down',
    width: '100%',
    overflow: 'hidden',
    marginBottom: 'calc($4 + $1)',
    backgroundColor: '$foregroundTintBronze'
})


const RenderImage = ({ featuredImage }: { featuredImage: EntryType["featuredImage"] }) => {
    if (!featuredImage) {
        return (<></>)
    }

    if (featuredImage.sizes.md) {
        <ContainerImage>
            <Image layout='responsive'
                objectFit={'cover'}
                alt='cover'
                src={featuredImage.sizes.md.src}
                width={featuredImage.sizes.md.width}
                height={featuredImage.sizes.md.height}
            />
        </ContainerImage>
    }
    if (featuredImage.sizes.lg) {
        <ContainerImage
        >
            <Image objectFit={'cover'}
                layout='responsive'
                alt='cover'
                src={featuredImage.sizes.lg.src}
                width={featuredImage.sizes.lg.width}
                height={featuredImage.sizes.lg.height} />
        </ContainerImage>
    }
    if (featuredImage.sizes.og) {
        return (
            <ContainerImage
            >
                <Image objectFit={'cover'}
                    layout='responsive'
                    alt='cover'
                    src={featuredImage.sizes.og.src}
                    width={featuredImage.sizes.og.width}
                    height={featuredImage.sizes.og.height} />
            </ContainerImage>
        )
    }
    if (featuredImage.sizes.sm) {
        <ContainerImage
        >
            <Image objectFit={'cover'} layout='responsive'
                alt='cover'
                src={featuredImage.sizes.sm.src}
                width={featuredImage.sizes.sm.width}
                height={featuredImage.sizes.sm.height} />
        </ContainerImage>
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
                <StyledContentBody isPreview={isPreview}>
                    {metadata}
                    <StyledText isHighlighted={(isHover || isFocused || !isPreview) ? true : false} type={view}>
                        <StyledTitle type={view} isHighlighted={(isHover || isFocused || !isPreview) ? true : false}>
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
                                        fontWeight: '$max',
                                        fontFamily: '$default',
                                        textDecoration: 'none',
                                        color: 'inherit'
                                    }}>{entry.title}</Box>
                            </Link>
                        </StyledTitle>
                        {children}
                    </StyledText>
                </StyledContentBody>
            </StyledArticle>
            {/* </Box> */}
        </StyledContents>
    </StyledBody>
)



export default React.memo(BodyComponent)