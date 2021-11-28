import React, { useContext, createContext, useState, useMemo, useCallback, useEffect} from 'react'
import type {Dispatch} from 'react'
import type {providers} from 'ethers'
// import type {TransactionResponse} from '@ethersproject/abstract-provider'

import WalletConnectProvider from "@walletconnect/web3-provider";
import {getBalance, getAllowance} from 'src/utils'
import { ethers } from 'ethers'
import {queryContributor} from 'src/queries'
import {request} from 'graphql-request'
 
declare let window: any;

export type UserTypeProfile = Pick<UserType, 'avatarURL' | 'displayName' | 'address'>

export type UserType = {
    address?:string,
    balance?:number,
    allowance?:{
        gov:number;
        space:number;
    },
    isConnected:boolean,
    network?:providers.Network,
    displayName?:string,
    avatarURL?:string,
    provider?: providers.Web3Provider | providers.WebSocketProvider,
}



type Providers = 'wc' | 'metamask'

type UserContext = {
    user:UserType | null;
    isLoading:boolean;
    changeUser:Dispatch<React.SetStateAction<null | UserType>>,
    UpdateBalance:()=>Promise<void>,
    UpdateAllowance:()=>Promise<void>,
    Disconnect:()=>void;
    Connect:(type:Providers)=>Promise<void>;
}
const User = createContext<UserContext | null>(null)


export const UserProvider = ({children}:{children:React.ReactNode[] | React.ReactNode}) => {

    const [user, changeUser] = useState<UserType | null>(null)
    const [isLoading, setIsLoading] = useState(false)

     const getUserBalance = async (address: string, provider: providers.Web3Provider | providers.WebSocketProvider) => {
        const balance = await getBalance({ provider: provider, address: address })
        return ethers.utils.formatEther(balance)
    }  
     

    const getGovAllowance = async(address:string,  provider:providers.Web3Provider | providers.WebSocketProvider)=>{
        const spender  = process.env.NEXT_PUBLIC_GOV_CONTRACT;
        if(!spender) throw "gov contract was not found";
        const allowance = await getAllowance({ provider: provider, address: address, addressSpender:spender})
        console.log('gov allowanc',allowance)
        return ethers.utils.formatEther(allowance)
    }
 
      const getSpacesAllowance = async(address:string,  provider:providers.Web3Provider | providers.WebSocketProvider)=>{
        const spender  = process.env.NEXT_PUBLIC_SPACES_CONTRACT;
        if(!spender) throw "gov contract was not found";
        const allowance = await getAllowance({ provider: provider, address: address, addressSpender:spender})
        return ethers.utils.formatEther(allowance)
    }


    // const UpdateUserSpaces = useCallback(async() => {
    //     const endpoint = process.env.NEXT_PUBLIC_GRAPH_ENDPOINT
    //     const address = user?.address
    //     console.group('update u spaces callback', address, endpoint)
    //     if(!address) return;
    //     if(!endpoint) throw "graphql endpoint was not found";

    //     try{
    //     const {spaces}:{spaces:SpaceType[]} = await request(endpoint, userSpaces, {owner:address})
    //     // return spaces
    //     // console.log('user spaces updates', spaces)
    //     if(spaces){
    //         console.log('setting spaces', spaces)
    //     localStorage.setItem(`mirror-feed-user-space-${address}`, JSON.stringify(spaces))   
    //     changeUser((prev)=>{
    //         if(!prev) return prev;
    //         return {...prev, spaces}
    //     })} else {
    //           console.log('setting zero spaces', spaces)
    //          changeUser((prev)=>{
    //         if(!prev) return prev;
    //         return {...prev, spaces:[]}
    //     })
    // }} catch(e){
    //     console.error('error in update user spaces', e)
    // }
        
    // },[user?.address])

    // const getUserSpaces = async(address:string) => {
    //     const endpoint = process.env.NEXT_PUBLIC_GRAPH_ENDPOINT
    //     if(!endpoint) throw "graphql endpoint was not found";
    //     const {spaces}:{spaces:SpaceType[]} = await request(endpoint, userSpaces, {owner:address})
    //     return spaces
    // }


    const UpdateBalance = useCallback(async ()=>{
        return new Promise<void>(async (resolve, reject) => {
            if(user && user.provider && user.address){
                return await getUserBalance(user.address, user.provider).then((balance:string)=>{
                    const formatedBalance =  parseFloat(balance)
                    changeUser({...user, balance:formatedBalance})
                    resolve()
                })
            } else reject('user doesnt exist')
    })
    },[user])

    const UpdateAllowance = useCallback(async ()=>{
          return new Promise<void>(async (resolve, reject) => {
            if(user && user.provider && user.address){
                const govAllowance = await getGovAllowance(user.address, user.provider)
                const spaceAllowance = await getSpacesAllowance(user.address, user.provider)
                changeUser({...user, allowance:{gov:parseFloat(govAllowance), space:parseFloat(spaceAllowance)}})
                resolve()
            } else reject('user doesnt exist')
        })
    },[user])

    const Connect = useCallback(async (type:Providers='metamask') => {
        setIsLoading(true)
        if(type === 'wc'){
            const provider = new WalletConnectProvider({
                infuraId: "87ff3775011f44d1ad3ae2c38d63d950",
                chainId:4
            });
            await provider.enable();
            try{
                const web3Provider = new ethers.providers.Web3Provider(provider, "any");
                const signer = web3Provider.getSigner();
                const address = await signer.getAddress()
                const network = await web3Provider.getNetwork()
                const mirrorUser = await request('https://mirror-api.com/graphql', queryContributor, {address:address})
                .then(({userProfile}) =>{
                     return userProfile
                    })
                    .catch((e) => {
                        console.log('errorgetting user', e)
                        return 
                    })
                    
                if(web3Provider && address && signer){
                    try{
                    const balance = await getUserBalance(address, web3Provider)
                    const govAllowance = await getGovAllowance(address, web3Provider)
                    const spaceAllowance = await getSpacesAllowance(address, web3Provider)
                    // const userSpaces = await getUserSpaces(address)
                    // const userSpaces = localStorage.getItem(`mirror-feed-user-space-${address}`)    
                    localStorage.setItem('mirror-feed-last-provider', 'wc')
                    changeUser((user)=>{
                        const newUser = Object.assign({}, user)
                        delete newUser.provider
                        newUser.address = address
                        newUser.isConnected = true; 
                        newUser.network = network;
                        // load them in separate context to speed up the signing in
                        newUser.displayName = mirrorUser?.displayName
                        newUser.avatarURL = mirrorUser?.avatarURL
                        newUser.allowance = {
                            gov: parseInt(govAllowance),
                            space: parseInt(spaceAllowance)
                        }
                        newUser.balance = parseFloat(balance)

                        newUser.provider = web3Provider;
                        return newUser
                    })} catch(e){
                          console.log(e)
                          changeUser((user)=>{
                            const newUser = Object.assign({}, user)
                            delete newUser.provider
                            newUser.address = address
                            newUser.isConnected = true; 
                            newUser.network = network;
                            newUser.balance = 0;
                            newUser.provider = web3Provider;
                            return newUser
                        })
                    }
                }
            } catch(e){
                console.log(e)
                alert('You have to connect to Rinkeby, not the MainNetwork')
            }
            setIsLoading(false)
            return 
        }
        //not suppported yet
        // const isUnlocked = await window.ethereum.isUnlocked()
        // if(!isUnlocked) {
        //     alert('unlock your metamask')
        // }

        const web3Provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        await web3Provider.send("eth_requestAccounts", []);
        const signer = web3Provider.getSigner();
        const address = await signer.getAddress()
        const network = await web3Provider.getNetwork()

        const mirrorUser = await request('https://mirror-api.com/graphql', queryContributor, {address:address})
       .then(({userProfile}) =>{
                            return userProfile
        })
        .catch((e) => {
            console.log('errorgetting user', e)
            return 
        })

        if(web3Provider && address && signer){
            try{
                const balance = await getUserBalance(address, web3Provider)
                const govAllowance = await getGovAllowance(address, web3Provider)
                const spaceAllowance = await getSpacesAllowance(address, web3Provider)
                // const userSpaces = await getUserSpaces(address)
                // const userSpaces = localStorage.getItem(`mirror-feed-user-space-${address}`)    

                localStorage.setItem('mirror-feed-last-provider', 'metamask')
                changeUser((user)=>{
                    const newUser = Object.assign({}, user)
                    delete newUser.provider
                    newUser.address = address
                    newUser.isConnected = true; 
                    //
                    newUser.displayName = mirrorUser?.displayName
                    newUser.avatarURL = mirrorUser?.avatarURL
                    newUser.allowance = {
                        gov: parseInt(govAllowance),
                        space: parseInt(spaceAllowance)
                    }
                    //
                    // newUser.spaces = userSpaces
                    newUser.network = network;
                    newUser.provider = web3Provider;
                    newUser.balance = parseFloat(balance)
                    return newUser
            })} catch(e){
                console.log(e)
                changeUser((user)=>{
                    const newUser = Object.assign({}, user)
                    delete newUser.provider
                    newUser.address = address
                    newUser.isConnected = true; 
                    //
                    newUser.displayName = mirrorUser?.displayName
                    newUser.avatarURL = mirrorUser?.avatarURL
                    //
                    newUser.network = network;
                    newUser.balance = 0;
                    newUser.provider = web3Provider;
                    return newUser
                })
            }
            setIsLoading(false)
        }

        // //
        // const govAllowance = await getGovAllowance(address, web3Provider)
        // const spaceAllowance = await getSpacesAllowance(address, web3Provider)
        // const userSpaces = await getUserSpaces(address)
     
    }, [])

    const Disconnect = useCallback(async () => {
        if(user && user.provider){
         try{
             changeUser({isConnected:false})
              localStorage.removeItem('mirror-feed-last-provider')
         } catch(e){
             console.log('failed attempt to disconnect', e)
         }
        } else {
            console.log('nothing to disconnect')
        }
    }, [user])

    const value = useMemo(() => ({
        user,
        isLoading,
        changeUser,
        UpdateBalance,
        Disconnect,
        UpdateAllowance,
        Connect
    }), [user, isLoading, UpdateBalance, Disconnect, changeUser, UpdateAllowance, Connect])


    useEffect(()=>{
        const lastProvider = localStorage.getItem('mirror-feed-last-provider')
        if(lastProvider && (lastProvider === 'wc' || lastProvider === 'metamask')){
            if(lastProvider === 'wc'){
                Connect('wc')
                return
            }
            Connect('metamask')
        }
    },[Connect])
  

    useEffect(()=>{
        if(user?.provider){
             user.provider.on('disconnect', ()=>{
                changeUser(()=>{
                        return {isConnected:false}
                    })
            })

            user.provider.on('network', (newNetwork)=>{
                changeUser((user)=>{
                        const newUser = Object.assign({}, user)
                        newUser.network = newNetwork; 
                        return newUser
                    })
            })

            user.provider.on('accountsChanged', (accounts:string[])=>{
                    changeUser((user)=>{
                        const newUser = Object.assign({}, user)
                        newUser.address = accounts[0]
                        newUser.isConnected = true; 
                        return newUser
                    })
            })
        }
    },[user])

    return(
    <User.Provider value={value}>
        {children}
    </User.Provider>)
}



// export const UserProvider = User.Provider

export const useAuth= () => {
  const context = useContext(User);
  if (!context) {
    throw new Error("context was not found useAuth");
  }
  return context;
};



