import React, { useContext, createContext, useState, useMemo, useCallback, useEffect} from 'react'
import {ethers} from 'ethers'

import { SpacesAbi } from 'contracts/Spaces'
import { ERC20Abi } from 'contracts/ERC20';
import type {UserType} from 'contexts/user'
const spacesAddress = process.env.NEXT_PUBLIC_SPACES_CONTRACT;
const ERC20address = process.env.NEXT_PUBLIC_FEED_CONTRACT;

declare let window: any;


export type SpaceType = {
    id:number;
    title:string;
    totalStacked:number;
    owner:string;
    timelock?:number;
}



type SpaceMethodsContext = {
    user:SpaceType | null;
}
const SpacesMethods = createContext<any | null>(null)


export const SpaceMethodsProvider = ({children, user}:{children:React.ReactNode[] | React.ReactNode, user:UserType}) => {
    const [space, changeSpace] = useState<SpaceType | null>(null)

    useEffect(()=>{
        if(user && user.provider){
            setSpace(user)
        }
    },[user])

    const setSpace = async (user:UserType) =>{
        if(user.address){
            const space = await CheckSpace(user.address)
            console.log('changins space', space)
            changeSpace(space)
        }
    }

    const StakeToSpace = useCallback(async (amount:number,  address:string) => { 
        if(!spacesAddress || !ERC20address) throw "Spaces:contract address is not found";
        if(!user.provider) throw "user was not found"
        const signer = user.provider.getSigner();
        const myContractSpace = new ethers.Contract(spacesAddress, SpacesAbi, signer);
        const contractERC20 = new ethers.Contract(ERC20address, ERC20Abi, signer);
        const allowance = await contractERC20.allowance(address, spacesAddress)
        const allowanceAmount = parseFloat(allowance.toString())
        if(allowanceAmount<=amount) throw "not allowed to spend"
        return myContractSpace.stake(amount)
    },[user])

    const UnStakeToSpace = useCallback(async () => { 
        if(!spacesAddress || !ERC20address) throw "Spaces:contract address is not found";
        if(!user.provider) throw "user was not found"
        const signer = user.provider.getSigner();
        const myContractSpace = new ethers.Contract(spacesAddress, SpacesAbi, signer);
        return myContractSpace.unstake()
    },[user])

   const CreateSpace = useCallback(async (name:string) => { 
        if(!spacesAddress || !ERC20address) throw "Spaces:contract address is not found";
         if(!user.provider) throw "user was not found"
        const signer = user.provider.getSigner();
        const myContractSpace = new ethers.Contract(spacesAddress, SpacesAbi, signer);
        const contractERC20 = new ethers.Contract(ERC20address, ERC20Abi, signer);
        await contractERC20.approve(spacesAddress, ethers.constants.MaxInt256)
        return myContractSpace.createSpace(name)
    },[user])
   
    const CheckMyStake = useCallback(
        async(address:string) => {
        if(!spacesAddress || !ERC20address) throw "Spaces:contract address is not found";
        const myContractSpace = new ethers.Contract(spacesAddress, SpacesAbi, user.provider);
        const stake = await myContractSpace.userStakes(address)
        const myStake = stake.toString()
        return myStake
    },[user])

    const CheckSpace = useCallback(
        async(address:string) => {
        if(!spacesAddress || !ERC20address) throw "Spaces:contract address is not found";
        const myContractSpace = new ethers.Contract(spacesAddress, SpacesAbi, user.provider);
        const myspace = await myContractSpace.Spaces(address)
        const id = parseInt(myspace.toString());
        const myspaceName = await myContractSpace.SpacesNames(id)
        const name = myspaceName.toString()
        const stake = await CheckMyStake(address)
        const space:SpaceType = {
            id:id,
            title:name,
            totalStacked:parseInt(stake),
            owner:address,
            timelock:Date.now()
        }
        return space
    },[])

    const SyncToSpace = useCallback((item:any)=>{
        console.log('syncing item!', item)
    },[])


    const value = useMemo(() => ({
        space,
        CreateSpace,
        CheckMyStake,
        CheckSpace,
        UnStakeToSpace,
        StakeToSpace,
        SyncToSpace
    }), [CreateSpace, CheckMyStake, CheckSpace, CreateSpace, UnStakeToSpace, StakeToSpace, SyncToSpace, space])

 

    return(
    <SpacesMethods.Provider value={value}>
        {children}
    </SpacesMethods.Provider>
    )
}




export const useSpace= () => {
  const context = useContext(SpacesMethods);
  if (!context) {
    throw new Error("context was not found useAuth");
  }
  return context;
};
