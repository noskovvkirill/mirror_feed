import { gql } from 'graphql-request';


//contributor 
export const queryContributor = gql`
query Contributor($address: String!) {
  userProfile(address: $address) {
                address
                avatarURL
                displayName
        }
    }
`


// Publication contributors
export const queryPublicationContributors = gql`
query Publication($ensLabel: String!) {
  publication(ensLabel: $ensLabel) {
            contributors{
                address
                avatarURL
                displayName
                publications {
                  id
                  ensLabel
              }
            }
        }
    }
`

//all publication from the list of Authors on arweave
export const queryMultiple = gql`
query Transaction($contributors:[String!]!, $after:String!){
		transactions(first:20, after:$after, tags: [
      { name: "App-Name", values: ["MirrorXYZ"] },
      { name: "Contributor", values: $contributors}
    ]) {
			edges {
				node {
					id
					tags {
						name
						value
					}
				}
        cursor
			}
		}
	}`

//all publication from the Author on arweave
export const queryPersonal = gql`
query Transaction($contributor:String!){
		transactions(first:20, tags: [
      { name: "App-Name", values: ["MirrorXYZ"] },
      { name: "Contributor", values: [$contributor]}
    ]) {
			edges {
				node {
					id
					tags {
						name
						value
					}
				}
        cursor
			}
		}
	}`

  // Publication Info
export const queryPublicationInfo = gql`
query Publication($ensLabel: String!) {
  publication(ensLabel: $ensLabel) {
      avatarURL
      ensLabel
      contributors{
          address
          avatarURL
          displayName
      }
    }
}`


// Publication Entries
export const queryPublication = gql`
query Publication($ensLabel: String!) {
  publication(ensLabel: $ensLabel) {
      avatarURL
       entries{
         id
         digest
       }
    }
}`

//single Entry
export const queryEntry = gql`
query Entry($digest: String!) {
  entry(digest: $digest) {
       id
        body
        digest
        timestamp
        title
        author{
          address
          displayName
        }
        publication{
          ensLabel
        }
    }
}`

//proposal:cid embed

export const queryProposal = gql`
query GetProposal($cid: String) {
  proposal(cid: $cid) {
      cid
    description
    endDate
    erc20Address
    highlightedWinners
    prompt
    startDate
    status
    title
    tokenName
    tokenSymbol
    tokenThreshold
    erc721Address
    tokenIds
    operator {
      publications {
        publicationSettings {
          settings
        }
      }
    }
    resultsCid
    snapshot {
      cid
    }
  }
}`


//editions:cid embed

export const queryEditions = gql`
query Edition($editionId: Int!, $editionContractAddress: String!) {
  edition(editionId: $editionId, editionContractAddress: $editionContractAddress) {
    id
    title   
    quantity
    price
    allocation
    fundingRecipient
    version
    mediaURL
    editionContractAddress
    events {
      event
      transactionHash
      avatarURL
      twitterUsername
      serialNumber
      collectorAddress
      tokenId
    }
    publication{
         id
        avatarURL
        displayName
        ensLabel
    }
     primaryMedia {
       mimetype
       sizes{
           og {
             src
            height
            width
            }
            lg {
              src
              height
               width
            }
            md {
                src
                height
                width
            }
            sm {
             src
             height
             width
         }
       }
    }
  }
}
`






