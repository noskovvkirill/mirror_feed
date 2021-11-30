
//components
import Box from '@/design-system/primitives/Box'
import Input from '@/design-system/primitives/Input'
import Button from '@/design-system/primitives/Button'
import Loader from '@/design-system/primitives/Loader'
import Label from '@/design-system/primitives/Label'
import Image from 'next/image'
import Bg from '@/design-system/CreateSpace/Bg'
//context & state
import { useSetRecoilState } from 'recoil'
import {NotificationList} from 'contexts'
import { useState, useRef } from 'react'
import {create} from 'ipfs-http-client'
//types
import type {TransactionResponse} from '@ethersproject/abstract-provider'

interface IMint {
    newSpaceCallback: (tx:TransactionResponse) => void;
    NewSpace:(name:string, avatarURL:string) => Promise<TransactionResponse>;
    Approve:() => Promise<TransactionResponse>;
    balance:number;
    UpdateBalance:() => Promise<void>;
    GrabTestBalance:()=>Promise<TransactionResponse>;
    allowance:{
        gov:number | undefined,
        space:number | undefined
    }
}

 const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    })


const Mint = ({GrabTestBalance, newSpaceCallback, Approve, NewSpace, UpdateBalance, balance, allowance }:IMint) => {

    const [state, setState] = useState<'default' | 'loading' | 'success' | 'error'>("default")
    const [isApproved, setApproved] = useState< "false" | "true" | 'loading'>("false")
    const [isImageLoading, setIsImageLoading] = useState(false)
    const addNotification = useSetRecoilState(NotificationList)
    const [fileUrl, updateFileUrl] = useState<null | string>(null)

    //file load  
    const ref = useRef<HTMLDivElement>(null)
    const fileInput = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)



    const Create = async (e:React.FormEvent) => {
       e.preventDefault()
       const target = e.target as HTMLFormElement & {
           name:{
               value:string
           }
       }
       const name = target['name'].value 
       console.log('name',target)
       if(!fileUrl) throw "upload the avatar"
       if(!name) throw "name is empty"
       setState('loading')
       try{
            const tx =  await NewSpace(name, `https://ipfs.infura.io:5001/api/v0/cat?arg=${fileUrl}`)
            addNotification((prev)=>[...prev, {tx:tx,label:'making space'}]);
            newSpaceCallback(tx)
            console.log('tx create space', tx)
            setState('success')
            // setTimeout(()=>{
            // },2000)
       } catch(e) {
            setState('error')
       }
    }

    const handleDrag = (e:React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }
    const handleDragIn = (e:React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.dataTransfer?.items && e.dataTransfer?.items.length > 0) {
            setIsDragging(true)
        }
    }
    const handleDragOut = (e:React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
        }
    const handleDrop = (e:React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                UploadFile(e.dataTransfer.files)
                e.dataTransfer.clearData()
        }
    }

    const UpdateNewImage = async (event: React.FormEvent<HTMLInputElement>) => {
        event.preventDefault();
        const target = event.target as typeof event.target & {
        files: FileList;
        };
        const files = target.files;
        UploadFile(files)
    }
    

    const UploadFile = async (fileList:FileList) => {
        if(isImageLoading) return
        if(!fileList || fileList.length === 0) return;
        try{
    
            setIsImageLoading(true)
            const file = fileList[0];
            const {cid} = await client.add(file)
            const {data, error} = await fetch(
            `/api/uploadAvatar?cid=${cid.toString()}`
            ).then((r) => r.json());
            if(data && !error){
                updateFileUrl(cid.toString())
                setIsImageLoading(false)
            }
            if(error){
                throw "something went wrong"
            }
        } catch(e){
            console.log('error', e)
        }   
    }

    return(
          <Box layout='flexBoxColumn'  as='form' onSubmit={Create} css={{padding:'$2 0 $4 0',gap:'$1', color:'$foregroundText'}}>
                        <Box css={{width:'100%', backgroundColor:'$highlightBronze', overflow:'hidden',
                        borderRadius:'$2', padding:'$2', boxSizing:'border-box',
                        position:'relative', color:'$foregroundBronze'
                        }}>Space settings
                        <Box css={{position:'absolute', color:'$foreground',width:'auto',height:'100%', opacity:1, mixBlendMode:'multiply', right:0, top:0}}>
                            <Bg/>
                        </Box>
                        </Box>
                        <Box layout='flexBoxRow' css={{gap:'$2', 
                        borderRadius:'$2',
                        padding:'$2',
                        alignItems:'center', backgroundColor:'$highlightBronze'}}>
                              <Box 
                                onClick={()=>{
                                    if(!isImageLoading){
                                        fileInput.current?.click()
                                    }
                                }}
                                onDragEnter={handleDragIn}
                                onDragLeave={handleDragOut}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                ref={ref} 
                                layout='flexBoxColumn'
                                css={{
                                    '&:hover':{
                                        border:'1px solid $text',
                                        color:'$text'
                                    },
                                    cursor:'pointer',
                                    textAlign:'center',
                                    position:'relative',
                                    overflow:'hidden',
                                    border:`1px solid ${!isDragging ? '$foregroundBronze' : '$text'}`, fontSize:'$6', alignItems:'center', justifyContent:'center',  color:'$foregroundTextBronze', borderRadius:'$round', minWidth:'64px', width:'64px', height:'64px'}}>
                                    {(!isDragging && !isImageLoading) && (
                                        <Label>Avatar</Label>
                                    )}
                                    {(isDragging && !isImageLoading) && (
                                        <Label>Drop <br/>here</Label>
                                    )}
                                    {isImageLoading && (
                                        <Loader size='small'>Loading</Loader>
                                    )}
                                    {(fileUrl && !isImageLoading )&& (
                                        <Box css={{position:'absolute', width:'100%', height:'100%', left:0,top:0, zIndex:10}}>
                                            <Image 
                                            width="75px"
                                            height="75px"
                                            layout='responsive'
                                            objectFit='cover'
                                            objectPosition='center'
                                            src={`https://ipfs.infura.io:5001/api/v0/cat?arg=${fileUrl}`} alt="space avatar"/>
                                        </Box>
                                    )}
                            </Box>

                             <Input
                            multiple={false}
                            ref={fileInput}
                            type="file"
                            accept="image/x-png,image/jpeg"
                            css={{ display: "none" }}
                            onChange={UpdateNewImage}
                            />     

                             {/* <Box onSubmit={Create} layout='flexBoxRow' as='form' css={{width:'100%'}}> */}
                                {/* <Input placeholder="Deposit" type='number' step={1} css={{width:'100%'}}/> */}
                                    <Input placeholder="Name" name={'name'} css={{width:'100%', color:'$foregroundTextBronze', borderColor:'$foregroundTextBronze'}}/>
                                  
                                {/* </Box>  */}
                        </Box>

                        
                        <Box layout='flexBoxRow' css={{justifyContent:'space-between', marginTop:'$1'}}>
                             {(isApproved === "true" || (allowance?.space && allowance?.space >= 20))
                            ? <Button 
                            disabled={balance < 20 ? true : false}
                            type='submit'>Create</Button>
                            : <Button onClick={async(e)=>{
                                e.preventDefault()
                                setApproved("loading")
                                const tx = await Approve()
                                await tx.wait()
                                setApproved("true")
                            }}> 
                                {isApproved === 'loading' ? <Loader size='small'/> : 'Approve'}
                            </Button>
                        }
                            <Box layout='flexBoxRow'>
                                <Label size='normal'>Minting cost <Box as='span' css={{color:'$foregroundTextBronze'}}>20&thinsp;●&nbsp;</Box></Label>
                                <Label size='normal'>Your balance <Box as='span' css={{color:'$foregroundTextBronze'}}>{balance}&thinsp;●</Box></Label>
                            </Box>
                        </Box>
                       
                        <Box as='span' css={{fontSize:'$6'}}>
                            You will need $FEED tokens for staking.<br/>
                            {balance >=0 && (
                                 <Box as='span'
                                onClick={async ()=>{
                                const tx = await GrabTestBalance()
                                console.log('tx on click', tx)
                                addNotification((prev)=>[...prev, {tx:tx, label:'grabbing test balance'}]);
                                await tx.wait()
                                UpdateBalance()
                            }}
                                css={{fontSize:'$6', textDecoration:'underline', cursor:'pointer'}}>Grab the test balance.</Box>
                            )}
                           
                        </Box>
                    </Box>
    )
}

export default Mint