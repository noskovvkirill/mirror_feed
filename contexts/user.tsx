import React, { useContext, createContext, useState, useMemo, useCallback, useEffect} from 'react'
import type {Dispatch} from 'react'
import type {providers} from 'ethers'
import WalletConnectProvider from "@walletconnect/web3-provider";
import {getBalance} from 'src/utils'
import { ethers } from 'ethers'



declare let window: any;


export type UserType = {
    address?:string,
    balance?:number,
    isConnected:boolean,
    network?:providers.Network,
    provider?: providers.Web3Provider | providers.WebSocketProvider,
}

type Providers = 'wc' | 'metamask'

type UserContext = {
    user:UserType | null;
    changeUser:Dispatch<React.SetStateAction<null | UserType>>,
    Disconnect:()=>void;
    Connect:(type:Providers)=>Promise<void>;
}
const User = createContext<UserContext | null>(null)


export const UserProvider = ({children}:{children:React.ReactNode[] | React.ReactNode}) => {

    const [user, changeUser] = useState<UserType | null>(null)

     const getUserBalance = async (address: string, provider: any) => {
        const balance = await getBalance({ provider: provider, address: address })
        return ethers.utils.formatEther(balance)
    }   



    const Connect = useCallback(async (type:Providers='metamask') => {
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

                if(web3Provider && address && signer){
                    try{
                    const balance = await getUserBalance(address, web3Provider)
                    localStorage.setItem('mirror-feed-last-provider', 'wc')
                    changeUser((user)=>{
                        const newUser = Object.assign({}, user)
                        delete newUser.provider
                        newUser.address = address
                        newUser.isConnected = true; 
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

     
        if(web3Provider && address && signer){
            try{
                const balance = await getUserBalance(address, web3Provider)
                localStorage.setItem('mirror-feed-last-provider', 'metamask')
                changeUser((user)=>{
                    const newUser = Object.assign({}, user)
                    delete newUser.provider
                    newUser.address = address
                    newUser.isConnected = true; 
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
                    newUser.network = network;
                    newUser.balance = 0;
                    newUser.provider = web3Provider;
                    return newUser
                })
            }
        }
    }, [])

    const Disconnect = useCallback(async () => {
        if(user && user.provider){
         try{
             changeUser({isConnected:false})
         } catch(e){
             console.log('failed attempt to disconnect', e)
         }
        } else {
            console.log('nothing to disconnect')
        }
    }, [user])

    const value = useMemo(() => ({
        user,
        changeUser,
        Disconnect,
        Connect
    }), [user, Disconnect, changeUser, Connect])


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



