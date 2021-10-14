import {atom, AtomEffect} from 'recoil'
import {history} from '@/design-system/Layout'
import {Entry} from '@/design-system/Article'


export type Publication = {
     type: 'personal' | 'ens',
     ensLabel:string
}
export type CurrentArticle =  {
    publication: Publication,
    title:string | null | undefined,
    digest:string | null | undefined,
    author: string 
}

export type IgnoredPublication = {
    ensLabel:string
}

export type CurationList = {
   title:string,
   avatar?:string,
   publications:SubscribedPublication[]
}

export type SubscribedPublication  =  Publication & {
    avatarURL?:string
}


export type Attachment = {
    mimeType:string
    url:string
}

type PinnedItemEntry = {
    id:number
    type:'entry'
    item:Entry
}

type PinnedItemPublication = {
    id:number
    type:'publication'
    item:Publication
}

type PinnedItemAttachment = {
    id:number
    type:'attachment'
    item: Attachment
}

export type PinnedItem = PinnedItemEntry | PinnedItemAttachment | PinnedItemPublication 


export type ReadingListItem = {
    title:string,
    entryDigest:string,
    ensLabel:string
}

export type ReadSettings = {
    columns:number,
    fontSize:number | "default",
    fontColor: string | "default",
    backgroundColor: string | "default",
    isEditions:boolean,
    isCrowdfund:boolean,
    isProposal:boolean,
    isAuction:boolean,
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
            } else {
                const listDefaultTokenomics:CurationList = {
                    title:'Tokenomics',
                    publications:[{
                    avatarURL:'https://images.mirror-media.xyz/publication-images/2e2bc5d9-281c-4301-8c1a-f49dc1654976.jpeg?height=572&width=574',
                    ensLabel:'p',
                    type:'ens'
                    }, 
                    {
                    avatarURL: "",
                    ensLabel: "sariazout",
                    type: "ens"
                    },
                    {
                        avatarURL: "https://images.mirror-media.xyz/publication-images/a29969cc-d425-4c07-947e-624f2787fbea.png?height=200&width=200",
                        ensLabel: "ff",
                        type: "ens"
                    }, {
                        ensLabel:'notboring',
                        avatarURL: 'https://images.mirror-media.xyz/publication-images/448239a6-f0fc-4283-a434-b7703975d23b.png?height=282&width=282',
                        type:'ens'
                    },  
                    {
                        avatarURL: "https://images.mirror-media.xyz/publication-images/e9eca86a-47e6-4bee-9c26-5ce0ac13158e.png?height=91&width=94",
                        ensLabel: "cdixon",
                        type: "ens"
                    }              
                    ]
                }
                const listDefaultIRL:CurationList = {
                    title:'IRL Crypto', 
                    publications:[{
                        ensLabel:'neuroswish',
                        avatarURL: "https://images.mirror-media.xyz/publication-images/d9826cd6-f5c2-4b2f-89c0-b58442e20ac8.png?height=400&width=400",
                        type: "ens",
                    }, {
                        avatarURL: "https://images.mirror-media.xyz/publication-images/8bd1be9c-00b0-47a1-8a0b-7ac974279222.png?height=400&width=400",
                        ensLabel: "m",
                        type: "ens"
                    }, {
                        avatarURL: "https://images.mirror-media.xyz/publication-images/c0bf3504-7152-4eff-aaa1-3da7ba766352.png?height=897&width=897",
                        ensLabel: "creators",
                        type: "ens"
                    }, {
                        avatarURL: "https://images.mirror-media.xyz/publication-images/bd2d9447-5541-4116-840c-89d3141341fa.jpg?height=360&width=360",
                        ensLabel: "avc",
                        type: "ens"
                    }, {
                        avatarURL: "https://images.mirror-media.xyz/publication-images/f44b9fc6-c75e-4854-ac5e-25126bff59a1.png?height=764&width=770",
                        ensLabel: "city",
                        type: "ens"
                    }]
                }
                setSelf([listDefaultTokenomics, listDefaultIRL])
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





const SettingsEffect = ():AtomEffect<ReadSettings> => ({setSelf, onSet, trigger}) => {
    const loadPersisted = () => {
        if(trigger === 'get' && typeof localStorage !== 'undefined'){
            const ignoredList = localStorage.getItem('mirror-read-settings')
            if(ignoredList){
                setSelf(JSON.parse(ignoredList))
            }
        }   
    }   
    loadPersisted();
    onSet((newValue:ReadSettings, oldValue:any) => {
            localStorage.setItem('mirror-read-settings', JSON.stringify(newValue))
            history.push({
                label: `${JSON.stringify(oldValue)} -> ${JSON.stringify(newValue)}`,
                undo: () => {
                    setSelf(oldValue);
                },
            });
    })   
}

export const readSettingsDefault: ReadSettings= {
        columns:1,
        fontSize:"default",
        fontColor:"default",
        backgroundColor:"default",
        isEditions:true,
        isProposal:true,
        isCrowdfund:true,
        isAuction:true
}

export const readSettings = atom({
    key:'readSettings',
    default:readSettingsDefault as ReadSettings,
    effects_UNSTABLE: [SettingsEffect()]
})