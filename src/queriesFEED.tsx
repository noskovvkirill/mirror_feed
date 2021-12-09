import {gql} from 'graphql-request'

export const spaceInfo = gql`
    query spaceInfo($spaceId: ID!) {
        space(id: $spaceId) {
            id
            name
            avatarURL
            owner
            totalStaked
            createdAtTimestamp
        }
    }
`

export const allSpaces = gql`
    query allSpaces {
        spaces{
            tokenId
        }
    }
`
export const userSpaces = gql`
    query UserSpaces($owner: String!) {
        spaces(where: {owner: $owner}) {
            owner
            avatarURL
            createdAtTimestamp
            totalStaked
            tokenId
            name
        }
    }
`

export const entriesSpaces = gql`
    query Entry($id: String!) {
        entry(id: $id) {
            id
            spaces{
                id
                totalStaked
                space{
                    name
                    tokenId
                    avatarURL
                }
            }
        }
    }
`

export const spaceEntries = gql`
    query SpaceEntries($id: String!, $skip:Int, $limit:Int) {
        space(id:$id){
            id
            name
            avatarURL
            owner
            totalStaked
            createdAtTimestamp
            items(orderBy:lastStakeTimestamp, skip:$skip, first:$limit, orderDirection:desc){
                lastStakeTimestamp
                totalStaked
                entry{
                    cid 
                    totalStaked
                }
            }
        }
    }
`