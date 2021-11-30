import {styled} from 'stitches.config'
import Box from '@/design-system/primitives/Box'
import Tag from '@/design-system/primitives/Tag'
import {NotificationList} from 'contexts'
import type {Notification} from 'contexts'
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom'
import type {TransactionResponse} from '@ethersproject/abstract-provider'

const Toast = ({updateList, item}:{updateList:(fn:(oldState:Notification[])=>Notification[])=>void,item:Notification}) => {
    const [currentState, setCurrentState] = useState<string>("pending");
    const WaitForTx = async(tx:TransactionResponse)=>{
        try{
            const result = await tx.wait()
            console.log('result toast tx', result)
            setCurrentState('done')
            setTimeout(()=>{
                updateList((list:Notification[])=>{
                    return list.filter((notification:Notification)=>{
                        return notification.tx !== item.tx
                    })
                })
            }, 4500)
        } catch(e){ 
            console.log('error toast tx', e)
        }
    }
    useEffect(() => {
        WaitForTx(item.tx)
    })
    return(
        <Box css={{background:'$background', borderRadius:'$2'}}>
              <Box layout='flexBoxRow' css={{padding:'$2', gap:'$1', alignItems:'center'}}>
                    {currentState === 'pending' 
                    ?   <Tag>{item?.label}</Tag>
                    :   <Tag>Finished</Tag>
                    } 
                    <Box css={{width:'36px', height:'36px', borderRadius:'$round', 

                    mixBlendMode:'overlay', overflow:'hidden'}}>
                        <video 
                        height='100%'
                        onEnded={()=>{
                            // setTimeout(()=>{
                            //     if(video.current) video.current.play()
                            // },2000)
                        }}
                        src='/loader.mp4' loop autoPlay muted/>
                    </Box>
                </Box>
                  
        </Box>
    )
}
 
const Notifications = () => {
    const list = useRecoilState(NotificationList)
    const updateList = useSetRecoilState(NotificationList)
    if(typeof document !== "undefined"){
        return createPortal(
                <Box 
                layout='flexBoxColumn'
                css={{
                gap:'$2',
                alignItems:'flex-end',
                position:'fixed', 
                width:'256px',
                height:'fit-content',
                color:'$text',
                right:'calc($4 + $4)', bottom:'$2'}}>
                    {list[0].map((item:Notification, index)=>{
                    return(
                            <Toast 
                            updateList={updateList}
                            key={'toast'+item.tx.hash}
                            item={item}/>
                    ) 
                    })}
                </Box>
            , document.body, 'notifications')
    } else {
        return <></>
    }
}

export default Notifications