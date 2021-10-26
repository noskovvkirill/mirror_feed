import { Contract } from "ethers";
import { ERC20Abi } from "contracts/ERC20";


export const AddressPrettyPrint = (address:string, maxLength=10) =>{
    if(!address || typeof address !== 'string' || address === undefined) return ''
    if(address.length <= maxLength) return address
    if(maxLength <=4) return address.slice(0,maxLength)
    const newAddress = address.slice(0,maxLength/2) + '...' + address.slice(-maxLength/2, address.length)
    return newAddress
}



const tokenAddress = process.env.NEXT_PUBLIC_FEED_CONTRACT;

interface IGetBalance {
    provider: any;
    address: string;
}

export const getBalance = async ({ provider, address }: IGetBalance) => {
    if (!tokenAddress) return;
    const contract = new Contract(tokenAddress, ERC20Abi, provider);
    const balance = await contract.balanceOf(address);
    return balance.toString();
};