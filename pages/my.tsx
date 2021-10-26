//components
import Box from '@/design-system/primitives/Box'
import Layout from '@/design-system/Layout'
import OnAddCurated from '@/design-system/OnAddCurated'
import Curation from '@/design-system/Curation'

//state
import {useRecoilStateLoadable} from 'recoil'
import { CuratedSpace, curatedSpace } from 'contexts'
import React, { useEffect, useState} from 'react'
import {useRouter} from 'next/router'


const MySpace = () => {

    const [curated, setCurated] = useRecoilStateLoadable(curatedSpace)
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    useEffect(()=>{
        console.log('curated was updated', curated)
        if(curated && curated.contents?.type==='entry' && curated.contents?.items?.length>0){
            // setIsOpen(true)
        }
    },[curated])

     const Sync = (id:number) => {
        if(curated.state === 'hasValue'){
            setCurated((curated:CuratedSpace)=>{
                const arr = curated.items 
                const itemIndex = arr.findIndex((item)=>item.type === 'entry' && item.item.id.toString() === id.toString());
                if(itemIndex === -1){
                    alert('item was not found..')
                    console.log('item was not found', itemIndex ,arr)
                    return curated;
                }
                const newObject = Object.assign({}, curated.items[itemIndex])
                newObject.isSync = true;
                const newArr = [...arr.slice(0, itemIndex), newObject, ...arr.slice(itemIndex + 1)];
                return {items:newArr, title:curated.title}
            })
        }
    }

    const Flip = (id:number) => {
        if(curated.state === 'hasValue'){
            setCurated((curated:CuratedSpace)=>{
                const arr = curated.items 
                const itemIndex = arr.findIndex((item)=>item.id === id);
                if(itemIndex === -1){
                    alert('item was not found..')
                    console.log('item was not found', itemIndex)
                    return curated;
                }
                console.log('item index', itemIndex)
                const copyArr = [...arr];
                [copyArr[itemIndex], copyArr[copyArr.length-1]] = [copyArr[copyArr.length-1], copyArr[itemIndex]];
                return {items:copyArr, title:curated.title}
            })
        }
    }

    const SyncAll = () => {
        console.log('sync')
        // [arr[0], arr[1]] = [arr[1], arr[0]];

        setIsOpen(true)
    }

    return(
        <Layout>
            <OnAddCurated isOpen={isOpen} setIsOpen={setIsOpen}/>
                {curated.state === 'hasValue' && (
                    <Curation 
                        Flip={Flip}
                        Open={(digest:string)=>router.push(digest)} 
                        Sync={Sync} 
                        curated={curated.contents} 
                        setCurated={setCurated}
                    />
                )}
        </Layout>
    )
}

export default MySpace