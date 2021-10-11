


export const AddressPrettyPrint = (address:string, maxLength=10) =>{
    if(!address || typeof address !== 'string' || address === undefined) return ''
    if(address.length <= maxLength) return address
    if(maxLength <=4) return address.slice(0,maxLength)
    const newAddress = address.slice(0,maxLength/2) + '...' + address.slice(-maxLength/2, address.length)
    return newAddress
}

