import {request} from 'graphql-request'
import {queryPublicationInfo, queryContributor, queryEnsAddress, queryPublicationContributor} from 'src/queries'
import { SubscribedPublication } from 'contexts'
import {User} from '@/design-system/primitives/Profile'




export const Search = async (name:string) => {
    //checking the type of the domain
    //Mirror.xyz subdomain, ENS Subdomain (EnsExternal) or Address 
    if(name === '' || name === undefined || name === null) return 
    const regexEthAddress = new RegExp('0x[a-fA-F0-9]{40}', 'g')
    const regexENS = ".*\.(xyz|eth)$"
    let type = 'ens'
    const url = name.match(regexENS)
    const address = regexEthAddress.test(name)
    if(url){
        type='ensExternal'
    }
    if(address){
        type='address'
    }


    console.log('type', type)

    if(type === 'address'){
        try{
            const contributorsProfiles:User = await request('https://mirror-api.com/graphql', queryContributor, {
                        address: name,
                    }).then(({userProfile}) =>{
                            return userProfile
                        })
                        .catch(() => {
                            return 
            })

            console.log('adress profiles', contributorsProfiles)

            

            const contributors:SubscribedPublication & {address?:string, displayName?:string} = Object.assign({}, {
                type:'personal' as 'personal' | 'ens',
                ensLabel:contributorsProfiles && contributorsProfiles?.displayName || contributorsProfiles?.address
            }, contributorsProfiles);
            // delete contributors.address
            delete contributors.displayName

            const data = [contributors].filter(function( element:any ) {
                return element !== undefined && element.ensLabel !== null
            });

            return data
        } catch(e){
            console.log(e)
            return;
        }
    }



    if(type === 'ensExternal'){
        try{
            const ens = await request('https://api.thegraph.com/subgraphs/name/ensdomains/ens', queryEnsAddress, {
                name:name
            })
            const address = ens.domains[0].owner.id
            const contributorPublications = await request('https://mirror-api.com/graphql', queryPublicationContributor, {
                    address: address,
            })
            .then(({contributor})=>contributor.publications)
            .catch(()=>{return})

            // const publication:SubscribedPublication[] = Object.assign({}, contributorPublications);
            const publication = contributorPublications.map((item:SubscribedPublication)=>{ const newItem = Object.assign({}, item); newItem.type='ens'; return newItem})

            // console.log('contributor publications', contributorPublications)

             const contributorsProfiles:User = await request('https://mirror-api.com/graphql', queryContributor, {
                        address: address,
                    }).then(({userProfile}) =>{
                            return userProfile
                        })
                        .catch(() => {
                            return 
            })

            const contributors:SubscribedPublication & {address?:string, displayName?:string} = Object.assign({}, {
                type:'personal' as 'personal' | 'ens',
                ensLabel:contributorsProfiles && contributorsProfiles?.displayName || contributorsProfiles?.address
            }, contributorsProfiles);
            // delete contributors.address
            delete contributors.displayName

            const data = [contributors, ...publication]
            .filter(function( element:any ) {
                return element !== undefined && element.hasOwnProperty('avatarURL');
            });

            console.log('ens external data', data)

            return data

         } catch(e){
            console.log('ens external', e)
        }
    }

    
    try{
        const publicationsContributors = await request('https://mirror-api.com/graphql', queryPublicationInfo, {
                    ensLabel: name,
                }).then(({publication}) =>{
                        return publication
                    })
                    .catch(() => {
                        return 
        })

        const contributorsProfiles:User = await request('https://mirror-api.com/graphql', queryContributor, {
                    address: name,
                }).then(({userProfile}) =>{
                        return userProfile
                    })
                    .catch(() => {
                        return 
        })


        console.log('search', name, publicationsContributors, contributorsProfiles)

        const publication:SubscribedPublication = Object.assign({}, publicationsContributors);
        publication.type = 'ens'    
        
        //molding type User into SubscribedPublication
        const contributors:SubscribedPublication & {address?:string, displayName?:string} = Object.assign({}, {
            type:'personal' as 'personal' | 'ens',
            ensLabel:contributorsProfiles && contributorsProfiles?.displayName || contributorsProfiles?.address
        }, contributorsProfiles);
        // delete contributors.address
        delete contributors.displayName

        const data = [publication, contributors].filter(function( element:any ) {
            return element !== undefined && element.hasOwnProperty('avatarURL');
        });

        // console.log('data', data)

        return data
    } catch (e) {
        console.log(e)
        return;
    }

}