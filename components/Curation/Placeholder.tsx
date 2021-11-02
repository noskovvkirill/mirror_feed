import Box from '@/design-system/primitives/Box'

const Placeholder = () => {
    return(
            <Box css={{color:'$foregroundText', width:'100%', padding:'$2 $4'}}>
                <p>Nothing here yet...</p>
                <p>Add your first item from the Pinned List</p>
                <br/>
                <img 
                    alt='cover'
                    style={{width:'128px'}}
                    src={"/myspace/welcome.png"}
                />
            </Box>
    )
}

export default Placeholder

