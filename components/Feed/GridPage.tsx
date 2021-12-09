import { useRecoilValue } from 'recoil'
import { useRef, useEffect } from 'react'
import useOnScreen from 'hooks/useOnScreen'
//state
import { settings } from 'contexts'
//components
import Box from '@/design-system/primitives/Box'
import Loader from '@/design-system/primitives/Loader'
import Article from '@/design-system/Article/ArticleShort';

//types
import type { EntryType } from '@/design-system/Entry'

interface IGrid {
    data: EntryType[],
    setSize?: any;
    error?: any;
    isValidating?: boolean;
}

const Grid = ({ data, error, isValidating, setSize }: IGrid) => {
    const appSettings = useRecoilValue(settings)
    const ref = useRef<HTMLDivElement | null>(null)
    const entry = useOnScreen(ref, {
        threshold: 0,
        rootMargin: '100%'
    })

    const isVisible = !!entry?.isIntersecting
    useEffect(() => {
        if (isVisible) {
            setSize((s: number) => s += 1)
        }
    }, [isVisible, setSize])


    // if (!data) return <Loader size='default'>Patience...</Loader>
    if (error) return <Box>Something went wrong...Refresh the page  {JSON.stringify(error)}</Box>


    if (appSettings.view === 'card') {
        return (
            <Box css={{
                display: 'grid',
                gridColumnGap: '32px',
                height: 'fit-content',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gridTemplateRows: "repeat(auto, minmax(0, 1fr))",
                width: '$body',
                '@bp1': {
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    maxWidth: '100%'
                },
                overflow: 'visible',
            }}>

                {data.map((entry: EntryType) => {
                    return (
                        <Article key={entry.digest} view={appSettings.view} entry={entry} />

                    )
                })}


                <Box css={{ padding: '$2 calc($4 * 4 + $1)', boxSizing: 'border-box', height: '48px', transition: '$all', color: '$foregroundText' }}>
                    {isValidating &&
                        (<Loader size='default' />)
                    }
                </Box>

                {setSize && (
                    <div
                        style={{ backgroundColor: 'red', opacity: 0, bottom: 0, height: '256px' }}
                        ref={ref}>
                        &nbsp;
                    </div>
                )}

            </Box>
        )
    }
    return (
        <Box css={{
            display: 'flex',
            flexDirection: 'column',
            width: '$body',
            overflow: 'visible',
            '@bp1': {
                width: '100%',
                maxWidth: '100%'
            },
        }}>

            {data.map((entry: EntryType) => {
                return (
                    <Article key={entry.digest + 'list'} view={appSettings.view} entry={entry} />
                )
            })}



            <Box css={{ padding: '$2 calc($4 * 4 + $1)', boxSizing: 'border-box', height: '48px', transition: '$all', color: '$foregroundText' }}>
                {isValidating &&
                    (<Loader size='default' />)
                }
            </Box>

            {setSize && (
                <div
                    style={{ backgroundColor: 'red', opacity: 0, bottom: 0, height: '256px' }}
                    ref={ref}>
                    &nbsp;
                </div>
            )}

        </Box>
    )
}

export default Grid