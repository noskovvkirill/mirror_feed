import React, { useContext, createContext, useMemo, useCallback} from 'react'
import {ethers} from 'ethers'

import { SpacesAbi } from 'contracts/Spaces'
import { ERC20Abi } from 'contracts/ERC20';
import { GovAbi } from 'contracts/Gov';
import type {UserType} from 'contexts/user'
import type {TransactionResponse} from '@ethersproject/abstract-provider'

const spacesAddress = process.env.NEXT_PUBLIC_SPACES_CONTRACT;
const ERC20address = process.env.NEXT_PUBLIC_FEED_CONTRACT;
const govAddress = process.env.NEXT_PUBLIC_GOV_CONTRACT;
declare let window: any;

export type SpaceTop = SpaceType & {staked:number, owner:string} //per week top staking

export type SpaceType = {
    owner:string
    createdAtTimestamp:string
    totalStaked:number
    avatarURL:string
    tokenId:string
    name:string
}
export type SpaceTypeProfile = Pick<SpaceType,'avatarURL' | 'tokenId' | 'name'>



type SpaceMethodsContext = {
    GrabTestBalance:()=>Promise<TransactionResponse>,
    CreateSpace:(name:string, avatarURL:string) => Promise<TransactionResponse>,
    CheckMyStake:(address:string) => Promise<string>,
    Approve: (contract:'spaces' | 'gov') => Promise<TransactionResponse>,
    UpdateFEEDContract_INTERNAL:() => Promise<TransactionResponse>,
    BatchSyncToSpace:(spaceId:number, amount:number | Array<number>, items:{cid:string, author:string}[]) => Promise<TransactionResponse>,
    BatchUnSyncFromSpace:(spaceId:number, items:{cid:string, author:string}[]) => Promise<TransactionResponse>,
    SyncToSpace:(spaceId:number, amount:number, cid:string, author:string) => Promise<TransactionResponse>,
    UnsyncFromSpace:(spaceId:number, cid:string, author:string) => Promise<TransactionResponse>,
}
const SpacesMethods = createContext<SpaceMethodsContext | null>(null)


export const SpaceMethodsProvider = ({children, user}:{children:React.ReactNode[] | React.ReactNode, user:UserType}) => {
  

  
    const getContractSigner = useCallback(async (name:'space' | 'gov' | 'token', signer:ethers.providers.JsonRpcSigner)=>{
        if(name === 'space' && spacesAddress) return new ethers.Contract(spacesAddress, SpacesAbi, signer);
        if(name === 'token' && ERC20address) return new ethers.Contract(ERC20address, ERC20Abi, signer);
        if(name === 'gov' && govAddress) return new ethers.Contract(govAddress, GovAbi, signer);
    },[user])

    
   const Approve = useCallback(async (contract:'spaces' | 'gov' = 'spaces') => {  
        console.log('approving FEED spending')
        if(!spacesAddress || !ERC20address || !govAddress) throw "Contract twas not found";
         if(!user.provider) throw "user was not found"
        const signer = user.provider.getSigner();
        const contractERC20 = await getContractSigner('token', signer)
        if(!contractERC20) throw "contract erc20 was not found"
        if(contract === 'spaces'){
            return await contractERC20.approve(spacesAddress, ethers.constants.MaxInt256)
        }
        if(contract === 'gov'){
            return await contractERC20.approve(govAddress, ethers.constants.MaxInt256)
        }
   },[user])


   const UpdateFEEDContract_INTERNAL = useCallback(async () => {
        if(!spacesAddress || !ERC20address) throw "Spaces:contract address is not found";
        if(!user.provider) throw "user was not found"
        const signer = user.provider.getSigner();
        const tokenContract = new ethers.Contract(ERC20address, ERC20Abi, signer);
        return await tokenContract.updateGovContract(govAddress)
   },[])

  
   const CreateSpace = useCallback(async (name:string, avatarURL:string) => { 
        console.log('minting new space', name)
        if(!spacesAddress || !ERC20address) throw "Spaces:contract address is not found";
         if(!user.provider) throw "user was not found"
        const signer = user.provider.getSigner();
        const myContractSpace = await getContractSigner('space', signer)
        const contractERC20 = await getContractSigner('token', signer)
        console.log('minting', myContractSpace, name,avatarURL)
        if(!myContractSpace || !contractERC20) throw "contract was not found"
        return await myContractSpace.safeMint(name, avatarURL)
    },[user])
   
    const CheckMyStake = useCallback(
        async(address:string) => {
        console.log('checking user stake', address)
        if(!spacesAddress || !ERC20address) throw "Spaces:contract address is not found";
        const spaceContract = await new ethers.Contract(spacesAddress, SpacesAbi, user.provider);
        const stake = await spaceContract.userStakes(address)
        const myStake = stake.toString()
        return myStake
    },[user])

    const GrabTestBalance = useCallback(async()=>{
        console.log('grabbing test balance')
        if(!spacesAddress || !ERC20address) throw "Spaces:contract address is not found";
        if(!user.provider) throw "user was not found"
        const signer = user.provider.getSigner();
        const tokenContract = await new ethers.Contract(ERC20address, ERC20Abi, signer);
        return await tokenContract.grabFunds()
    },[user])

  
    // const GetOwnerItems = useCallback(async (spaceId:number)=>{
    //     if(!govAddress || !ERC20address) throw "Spaces:contract address is not found";
    //     if(!user.provider) throw "user was not found"
    //     const govContract = await new ethers.Contract(govAddress, GovAbi, user.provider);
    //     const spaceid_ =  BigNumber.from(spaceId);
    //     const filter = govContract.filters.Staked(user.address, null, null, null);
    //     const events = await govContract.queryFilter(filter)
    //     const content = events.map((ev:any)=>{
    //         return ev.args.cid;
    //     })
    //     const entries = await Promise.all([...new Set(content)].map(async (item:any) => {
    //         return(await request('https://mirror-api.com/graphql', queryEntry, {
    //         digest: item
    //         }).then((data) =>
    //         data.entry
    //         ).catch(()=>{return})
    //         )
    //     }))

    //     const entriesFiltered = entries.filter(function( element:any ) {
    //     return element !== undefined;
    //     });

    //     return entriesFiltered
    // },[])   

    const UnsyncFromSpace = useCallback(async (spaceId:number, cid:string, author:string)=>{
        if(!govAddress || !ERC20address) throw "Spaces:contract address is not found";
        if(!user.provider) throw "user was not found"
        const signer = user.provider.getSigner();
        const govContract = await new ethers.Contract(govAddress, GovAbi, signer);
        if(!govContract) throw "gov contract was not found"
        return govContract.unstake(spaceId, cid, author)
    },[])


    const BatchUnSyncFromSpace = useCallback(async (spaceId:number, items:{cid:string, author:string}[])=>{
        console.log('batch unstake to space', spaceId, items)
        if(!govAddress || !ERC20address) throw "Spaces:contract address is not found";
        if(!user.provider) throw "user was not found"
        const signer = user.provider.getSigner();
        const govContract = await new ethers.Contract(govAddress, GovAbi, signer);   
        console.log('gov contract', govContract)
        let unstake = govContract.interface.getFunction('unstake')
        let stakeFunction = new ethers.utils.Interface([unstake])
        stakeFunction.encodeDeploy()
        // const txs = items.map((item:any)=>{
        //         console.log('txs', stakeFunction, spaceId, item.cid, item.author)
        //         return stakeFunction.encodeFunctionData("unstake", [spaceId, item.cid, item.author])
        // })  
        // // console.log('tx tx', txs)
        // return govContract.multicall(txs)
        return govContract.unstake(spaceId, items[0].cid, items[0].author)
    },[])

    const BatchSyncToSpace =  useCallback(async (spaceId:number, amount:number | Array<number>, items:{cid:string, author:string}[])=>{
        console.log('batch sync to space', spaceId, amount, items)
        if(!govAddress || !ERC20address) throw "Spaces:contract address is not found";
        if(!user.provider) throw "user was not found"
        const signer = user.provider.getSigner();
        const govContract = await new ethers.Contract(govAddress, GovAbi, signer); 
        if(!govContract) throw "gov contract was not found"
        // return govContract.stake(spaceId, items[0].cid, items[0].author)
        let stake = govContract.interface.getFunction('stake')
        let stakeFunction = new ethers.utils.Interface([stake])
        stakeFunction.encodeDeploy()
        if(amount instanceof Array){
            const txs = items.map((item:any, index:number)=>{
                if(Number(amount[index]) === 0) return;
                return stakeFunction.encodeFunctionData("stake", [spaceId, ethers.utils.parseUnits(amount[index].toString(), 18), item.cid, item.author])
            }).filter(item=>item) 
            return govContract.multicall(txs)
        } else {
            const txs = items.map((item:any)=>{
                return stakeFunction.encodeFunctionData("stake", [spaceId, ethers.utils.parseUnits(amount.toString(), 18), item.cid, item.author])
            })  
            return govContract.multicall(txs)
        }
    },[])
 
    const SyncToSpace = useCallback(async (spaceId:number, amount:number, cid:string, author:string)=>{
        console.log('syncing the item to space', spaceId, 'amount', ethers.utils.parseUnits(amount.toString(), 18).toString(), 'content id', cid, 'author', author)
        if(!govAddress || !ERC20address) throw "Spaces:contract address is not found";
        if(!user.provider) throw "user was not found"
        const signer = user.provider.getSigner();
        const govContract = await new ethers.Contract(govAddress, GovAbi, signer);
        if(!govContract) throw "gov contract was not found"
        return govContract.stake(spaceId, ethers.utils.parseUnits(amount.toString(), 18), cid, author)
    },[])


    const value = useMemo(() => ({
        GrabTestBalance,
        CreateSpace,
        CheckMyStake,
        Approve,
        UpdateFEEDContract_INTERNAL,
        BatchSyncToSpace,
        BatchUnSyncFromSpace,
        SyncToSpace,
        UnsyncFromSpace,
    }), [CreateSpace, UpdateFEEDContract_INTERNAL, GrabTestBalance, CheckMyStake, Approve, CreateSpace, BatchSyncToSpace, BatchUnSyncFromSpace, SyncToSpace, UnsyncFromSpace])

 

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
