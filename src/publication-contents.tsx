import {request} from 'graphql-request'
import {queryMultiple, queryEntry, queryPublicationContributors, queryContributor} from 'src/queries'
import {SubscribedPublication} from 'contexts'

type IList = SubscribedPublication;


export const getContributorsAvatar = async(publication:IList) => {
    if(publication.type === 'ens'){
        return await request('https://mirror-api.com/graphql', queryPublicationContributors, {
             ensLabel: publication.ensLabel,
         }).then(({publication}) =>{
                return publication.contributors
            })
            .catch((e) => {
                console.log('error', e)
                return e
            })
        } else {
            return await request('https://mirror-api.com/graphql', queryContributor, {address:publication.ensLabel})
            .then(({userProfile})=>userProfile)
    }
}

export const getContributorsListAvatars = async(list:IList[]) => {
    // console.log('list avatars', list)
    const items = list.map(async (publication:IList)=>{
        return await getContributorsAvatar(publication)
    })
    const addresses = await Promise.all(items)
        // console.log('list avatars itmems',addresses)

    return addresses.flat()
}



export const getContributors = async(publication:IList) => {
    if(publication.type === 'ens'){
        return await request('https://mirror-api.com/graphql', queryPublicationContributors, {
             ensLabel: publication.ensLabel,
         }).then(({publication}) =>{
                return publication.contributors.map((contributor:any)=>contributor.address)
            })
            .catch((e) => {
                console.log('error', e)
                return e
            })
        } else {
            return [publication.ensLabel]
    }
}

export const getContributorsList = async(list:IList[]) => {
    // console.log('list', list)
    const items = list.map(async (publication:IList)=>{
        return await getContributors(publication)
    })
    const addresses = await Promise.all(items)
    return addresses.flat()
}

export const getMergedPublication = async (list:IList[], cursor?:string) => {
    const addresses = await getContributorsList(list)

   const data = await request('https://arweave.net/graphql', queryMultiple, {
        contributors:addresses,
        after:cursor ? cursor : ""
    }).then((data)=>data.transactions.edges)

    let lastCursor 

    const content = data.map(({node:{tags}, cursor}:{node:{tags:any},cursor:string})=>{
        lastCursor = cursor;
     return tags.find((c:any)=>c.name === 'Original-Content-Digest').value
  })

  const entries = await Promise.all([...new Set(content)].map(async (item:any) => {
    return(await request('https://mirror-api.com/graphql', queryEntry, {
       digest: item
    }).then((data) =>
      data.entry
    ).catch(()=>{return})
    )
  }))

  const entriesFiltered = entries.filter(function( element:any ) {
   return element !== undefined;
});


 return [entriesFiltered, lastCursor]

}