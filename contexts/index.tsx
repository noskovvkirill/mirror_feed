import {atom, AtomEffect} from 'recoil'
import {history} from '@/design-system/Layout'
import {Entry} from '@/design-system/Article'


export type CurrentArticle = {
    publication:{
        ensLabel:string
    },
    title:string | null | undefined,
    digest:string | null | undefined
}

export type IgnoredPublication = {
    ensLabel:string
}

export type CurationList = {
   title:string,
   avatar?:string,
   publications:SubscribedPublication[]
}

export type SubscribedPublication = {
    ensLabel:string,
    avatar?:string
}

export type PinnedItem = {
    entry:Entry
}

export type ReadingListItem = {
    title:string,
    entryDigest:string,
    ensLabel:string
}

export type ReadSettings = {
    columns:number,
    fontSize:number | "default",
    fontColor: string | "default",
    backgroundColor: string | "default"
}


export const Current = atom({
    key:'currentArticle',
    default:null as CurrentArticle | null,
})



const ignoredPublicationEffect = ():AtomEffect<IgnoredPublication[]> => ({setSelf, onSet, trigger}) => {
    const loadPersisted = () => {
        if(trigger === 'get' && typeof localStorage !== 'undefined'){
            const ignoredList = localStorage.getItem('mirror-ignored-publication')
            if(ignoredList){
                setSelf(JSON.parse(ignoredList))
            }
        }   
    }   

    loadPersisted();
  
    onSet((newValue:IgnoredPublication[], oldValue:any) => {
        if(newValue instanceof Array){
            localStorage.setItem('mirror-ignored-publication', JSON.stringify(newValue))
            history.push({
                label: `${JSON.stringify(oldValue)} -> ${JSON.stringify(newValue)}`,
                undo: () => {
                    setSelf(oldValue);
                },
            });
        }
   
    })   
}

export const ignoredPublication = atom({
    key:'ignoredList',
    default:[] as IgnoredPublication[],
    effects_UNSTABLE: [ignoredPublicationEffect()]
})


const pinnedItemsEffect = ():AtomEffect<PinnedItem[]> => ({setSelf, onSet, trigger}) => {
    const loadPersisted = () => {
        if(trigger === 'get' && typeof localStorage !== 'undefined'){
            const sessionList = sessionStorage.getItem('mirror-pinned-items')
            if(sessionList){
                setSelf(JSON.parse(sessionList))
            }
        }   
    }   

    loadPersisted();
  
    onSet((newValue:PinnedItem[], oldValue:any) => {
        if(newValue instanceof Array){
            sessionStorage.setItem('mirror-pinned-items', JSON.stringify(newValue))
            history.push({
                label: `${JSON.stringify(oldValue)} -> ${JSON.stringify(newValue)}`,
                undo: () => {
                    setSelf(oldValue);
                },
            });
        }
    })   
}

export const pinnedItems = atom({
    key:'pinnedItemsList',
    default:[] as PinnedItem[],
    effects_UNSTABLE: [pinnedItemsEffect()]
})


const readLaterEffect = ():AtomEffect<ReadingListItem[]> => ({setSelf, onSet, trigger}) => {
    const loadPersisted = () => {
        if(trigger === 'get' && typeof localStorage !== 'undefined'){
            const ignoredList = localStorage.getItem('mirror-read-later-items')
            if(ignoredList){
                setSelf(JSON.parse(ignoredList))
            }
        }   
    }   

    loadPersisted();
  
    onSet((newValue:ReadingListItem[], oldValue:any) => {
        if(newValue instanceof Array){
            localStorage.setItem('mirror-read-later-items', JSON.stringify(newValue))
            history.push({
                label: `${JSON.stringify(oldValue)} -> ${JSON.stringify(newValue)}`,
                undo: () => {
                    setSelf(oldValue);
                },
            });
        }
    })   
}

export const readLaterList = atom({
    key:'readLaterList',
    default:[] as ReadingListItem[],
    effects_UNSTABLE: [readLaterEffect()]
})



const CurrationEffect = ():AtomEffect<CurationList[]> => ({setSelf, onSet, trigger}) => {
    const loadPersisted = () => {
        if(trigger === 'get' && typeof localStorage !== 'undefined'){
            const ignoredList = localStorage.getItem('mirror-curated-publication-items')
            if(ignoredList){
                setSelf(JSON.parse(ignoredList))
            }
        }   
    }   
    loadPersisted();
    onSet((newValue:CurationList[], oldValue:any) => {
        if(newValue instanceof Array){
            localStorage.setItem('mirror-curated-publication-items', JSON.stringify(newValue))
            history.push({
                label: `${JSON.stringify(oldValue)} -> ${JSON.stringify(newValue)}`,
                undo: () => {
                    setSelf(oldValue);
                },
            });
        }
    })   
}

export const curationItems = atom({
    key:'curationList',
    default:[] as CurationList[],
    effects_UNSTABLE: [CurrationEffect()]
})



export const readSettings = atom({
    key:'readSettings',
    default:{
        columns:1,
        fontSize:"default",
        fontColor:"default",
        backgroundColor:"default",
    } as ReadSettings,
})