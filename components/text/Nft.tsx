import { NFTE } from '@nfte/react';


const NFT = ({contract, tokenId}:{contract:string, tokenId:string}) => {
    return(
        <NFTE contract={contract} tokenId={tokenId}/>
    )
}
export default NFT