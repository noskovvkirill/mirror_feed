//primitives
import Tag from '@/design-system/primitives/Tag'
//icons
import LinkIcon from '@/design-system/icons/Link'
//utils
import { styled } from 'stitches.config'
import * as dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
//types
import type { EntryType } from '@/design-system/Entry'


const StyledMetadata = styled('div', {
    display: 'flex',
    position: 'relative',
    width: '100%',
    top: 'calc($1 / 2)',
    gap: '$0',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: "$1"
})


export interface IMetadata {
    isPreview?: boolean;
    isHover: boolean,
    isFocused: boolean;
    entry: EntryType
}

const Metadata = ({ isHover, isFocused, isPreview, entry }: IMetadata) => {
    return (
        <StyledMetadata>
            <Tag isHighlighted={(isHover || isFocused || !isPreview || (typeof window !== "undefined" && window?.innerWidth < 720)) ? true : false}>{entry.author?.displayName ? entry.author.displayName : entry.author?.address?.slice(0, 8)}</Tag>
            <Tag isHighlighted={(isHover || isFocused || !isPreview || (typeof window !== "undefined" && window?.innerWidth < 720)) ? true : false}>{dayjs.unix(entry.timestamp).fromNow()}</Tag>
            {entry.publication?.ensLabel && (
                <Tag isHighlighted={(isHover || isFocused || (typeof window !== "undefined" && window?.innerWidth < 720)) ? true : false} css={{ backgroundColor: 'transparent', padding: '0 $1', cursor: 'pointer' }} as='a' rel="noreferrer" href={`https://${entry.publication?.ensLabel}.mirror.xyz/${entry.digest}`} target='_blank'><LinkIcon /></Tag>
            )}
            {!entry.publication?.ensLabel && (
                <Tag isHighlighted={(isHover || isFocused || (typeof window !== "undefined" && window?.innerWidth < 720)) ? true : false} css={{ backgroundColor: 'transparent', padding: '0 $1', cursor: 'pointer' }} as='a' rel="noreferrer" href={`https://mirror.xyz/${entry.author.address}/${entry.digest}`} target='_blank'><LinkIcon /></Tag>
            )}
        </StyledMetadata>
    )
}

export default Metadata;