import {request} from 'graphql-request'
import {queryPublicationInfo, queryContributor} from 'src/queries'
import { SubscribedPublication } from 'contexts'
import {User} from '@/design-system/primitives/Profile'

export const Search = async (name:string) => {
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

        const publication:SubscribedPublication = Object.assign({}, publicationsContributors);
        publication.type = 'ens'    
        
        //molding type User into SubscribedPublication
        const contributors:SubscribedPublication & {address?:string, displayName?:string} = Object.assign({}, {
            type:'personal' as 'personal' | 'ens',
            ensLabel:contributorsProfiles && contributorsProfiles?.displayName || contributorsProfiles?.address
        }, contributorsProfiles);
        delete contributors.address
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