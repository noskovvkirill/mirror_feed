import { gql } from 'graphql-request';


export const queryCrowdfunds = gql`
    query Crowdfunds {  
        crowdfunds {
            id
            name
            closed
            editionsContract {
            editions{
                id
                editionId
                crowdfund{
                id
                }
            }
            }
        }
    }
`

export const queryEditions = gql`
    query Editions{
         editions(first:1000){
                id
                quantity
                price
                sold 
                editionId
                address {
                    id
                }
            }
    }
`