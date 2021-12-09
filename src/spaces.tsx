import { SpacesAbi } from 'contracts/Spaces'
import { ERC20Abi } from 'contracts/ERC20';
import { ethers } from 'ethers'

const spacesAddress = process.env.NEXT_PUBLIC_SPACES_CONTRACT;
const ERC20address = process.env.NEXT_PUBLIC_FEED_CONTRACT;


//TODO Rewrite the code to have init function with provider, keep the contract data and reuse it 

export const CheckSpace = async(provider:ethers.providers.Web3Provider | ethers.providers.WebSocketProvider, address:string) => {
     if(!spacesAddress || !ERC20address) throw "Spaces:contract address is not found";
    const myContractSpace = new ethers.Contract(spacesAddress, SpacesAbi, provider);
    const myspace = await myContractSpace.Spaces(address)
    // console.log('space id!', myContractSpace, myspace.toString())
    const id = parseInt(myspace.toString());
    const myspaceName = await myContractSpace.SpacesNames(id)
    const name = myspaceName.toString()
    const stake = await CheckMyStake(provider, address)
    const space:SpaceType = {
        id:id,
        title:name,
        totalStacked:parseInt(stake),
        owner:address,
        timelock:Date.now()
    }
    return space
}

export const CheckMyStake = async(provider:ethers.providers.Web3Provider | ethers.providers.WebSocketProvider, address:string) => {
      if(!spacesAddress || !ERC20address) throw "Spaces:contract address is not found";
    const myContractSpace = new ethers.Contract(spacesAddress, SpacesAbi, provider);
    const stake = await myContractSpace.userStakes(address)
    const myStake = stake.toString()
    console.log('my stake', myStake)
    return myStake
}

export const CreateSpace = async (provider:ethers.providers.Web3Provider | ethers.providers.WebSocketProvider, name:string) => { 
    if(!spacesAddress || !ERC20address) throw "Spaces:contract address is not found";
    const signer = provider.getSigner();
    const myContractSpace = new ethers.Contract(spacesAddress, SpacesAbi, signer);
    const contractERC20 = new ethers.Contract(ERC20address, ERC20Abi, signer);
    // const contractWithSigner = myContract.connect(signer);
    const txApprove = await contractERC20.approve(spacesAddress, ethers.constants.MaxInt256)
    console.log('approve spend', txApprove)
    return myContractSpace.createSpace(name)
}

export const StakeToSpace = async (provider:ethers.providers.Web3Provider | ethers.providers.WebSocketProvider, amount:number,  address:string) => { 
    if(!spacesAddress || !ERC20address) throw "Spaces:contract address is not found";
    const signer = provider.getSigner();
    const myContractSpace = new ethers.Contract(spacesAddress, SpacesAbi, signer);
    const contractERC20 = new ethers.Contract(ERC20address, ERC20Abi, signer);
    const allowance = await contractERC20.allowance(address, spacesAddress)
    const allowanceAmount = parseFloat(allowance.toString())
    if(allowanceAmount<=amount) throw "not allowed to spend"
    const tx = await myContractSpace.stake(amount)
    return tx
}

export const UnStakeToSpace = async (provider:ethers.providers.Web3Provider | ethers.providers.WebSocketProvider) => { 
    if(!spacesAddress || !ERC20address) throw "Spaces:contract address is not found";
    const signer = provider.getSigner();
    const myContractSpace = new ethers.Contract(spacesAddress, SpacesAbi, signer);
    const tx = await myContractSpace.unstake()
    console.log('unstaking from space', myContractSpace, tx)
}