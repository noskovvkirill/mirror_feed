import {styled} from 'stitches.config'
import * as Dialog from '@radix-ui/react-dialog';
import React, { useEffect, forwardRef, useState} from 'react';
import Button from '@/design-system/primitives/Button'
import Input from '@/design-system/primitives/Input'
import Box from '@/design-system/primitives/Box'
import {m} from 'framer-motion'
import Loader from '@/design-system/primitives/Loader'

const StyledContent = styled('div', {
    padding:'0',
    display:'flex',
    flexDirection:'column',
    border:'1px solid $foregroundBorder',
    // borderRadius:'$2',
    transformOrigin:'center',
    background:'$background',
    color:'$foregroundTextBronze',
    width:'556px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    // transform: 'translate(-50%, -50%)',
    '&:focus': { outline: 'none' },
    'p':{}
})

const StyledContentComponent = forwardRef(function Component (props:any, ref:any) { return(
    <StyledContent {...props} ref={ref} />)
});


const StyledContentMotion = m(StyledContentComponent)


const StyledTitle = styled('h2', {
    marginTop:'0',
    fontSize:'$2',
    fontWeight:'500',
    lineHeight:'$2',
    color:'$foregroundTextBronze'
})

const StyledCover = styled('div', {
    display:'flex',
    justifyContent:'center',
    userSelect:'none',
    pointerEvents:'none',
    alignItems:'center',
    width:'100%',
    height:'256px'
})

const StyledDescription = styled('section', {

})


interface IOnAddCurated {
    setIsOpen:(newState:boolean) => void;
    NewSpace:(name:string) => Promise<any>;
    balance:number;
}

const variants = {
    start: {
      borderRadius: "8px 8px 8px 8px",
      transform:'translate(-50%, -50%) scale(1)'
    },
    finish: {
      borderRadius: "50% 50% 0% 0%",
      transform:'translate(-50%, -50%) scale(0.5)',
      backgroundColor:'white',
      filter:'brightness(20)',
      transition:{delay:1, duration:5}
    }
  };


const CreateMySpace = ({setIsOpen, NewSpace, balance}:IOnAddCurated) => {

    const [animate, setAnimate] = useState('start')
    const [state, setState] = useState<'default' | 'loading' | 'success' | 'error'>("default")
    const Create = async (e:React.FormEvent) => {
       e.preventDefault()
       setState('loading')
       try{
            const tx =  await NewSpace('My New Space')
            console.log('tx create space', tx)
            setState('success')
            setAnimate('finish')
       } catch(e) {
            setState('error')
       }
    }
    
    return(
            <StyledContentMotion
            layout
            key="createnewspace"
            initial={{transform:'scale(1)'}}
            variants={variants}
            animate={animate}
            transition={{duration:2}}
            >
            {state !== 'success' && (
                <StyledCover>
                    <img 
                    alt='cover'
                    style={{width:'128px'}}
                    src={"/myspace/welcome.png"}
                    />
                </StyledCover>
            )}
                <Box css={{margin:'$2', padding:'$0 $2', borderRadius:'$2', backgroundColor:'$highlightBronze'}}>
                    <StyledTitle>Your curation space. <br/>Right here & on-chain.</StyledTitle> 
                    <StyledDescription>
                        <p>Collect the best content from Mirror protocol — to share with others or for yourself.</p>
                        <p>Get rewarded for your taste — split the amount with the authors.</p> 
                        <p>Stake your tokens in the contract and acquire voting points in return.</p>     
                </StyledDescription>
                </Box>
                <br/>
                {state === 'default' && ( 
                    <Box layout='flexBoxColumn'  css={{padding:'$2 $2 $4 $2',gap:'$2', color:'$foregroundText'}}>
                        <Box layout='flexBoxRow' css={{gap:'$2'}}>
                            <span>Minting cost <Box as='span' css={{color:'$foregroundTextBronze'}}>50&thinsp;●</Box> $FEED</span>
                            <span>Your balance <Box as='span' css={{color:'$foregroundTextBronze'}}>{balance}&thinsp;●</Box> $FEED</span>
                        </Box>
                        <Box onSubmit={Create} layout='flexBoxRow' as='form' css={{width:'100%'}}>
                            <Input placeholder="Deposit" type='number' step={1} css={{width:'100%'}}/>
                            <Input placeholder="Name" css={{width:'100%'}}/>
                            <Button 
                            disabled={balance < 50 ? true : false}
                            type='submit'>Create</Button>
                        </Box>
                        <Box as='span' css={{fontSize:'$6'}}>
                            You can deposit a handful of tokens to start curating right away. <br/>
                            Those tokens are returnable and aren&apos;t included in the minting price.
                        </Box>
                    </Box>
                )}
                {state === 'loading' && (
                    <Box layout='flexBoxRow' css={{width:'100%', padding:'$2', height:'auto', alignItems:'center', justifyContent:'center'}}>
                        <Loader size='default'/>
                    </Box>
                 )}
                {state === 'error' && (
                    <Box layout='flexBoxRow' css={{width:'100%', padding:'$2', height:'auto', alignItems:'center', justifyContent:'center'}}>
                       Something went wrong creating your space. Please, reach out to me on Twitter @noskovvkirill
                    </Box>
                 )}
             
            </StyledContentMotion>
       
    )
}

export default CreateMySpace