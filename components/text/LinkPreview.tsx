import Box from '@/design-system/primitives/Box'
// import useSWR from 'swr'
//work in progress
// const fetcher = (url:string) => fetch(url).then(data=>data.json())

const LinkPreview = ({href}:{href:string}) =>{
    // const {data, error, isValidating} = useSWR('/api/fetchURL', fetcher)
    return(
        <Box as='section' css={{display:'inline-flex'}}>
            {href}
        </Box>
    )
}

export default LinkPreview