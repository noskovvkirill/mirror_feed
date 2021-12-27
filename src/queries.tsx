import { gql } from 'graphql-request';


//publications from Mirror.xyz that are registered through ENS 
export const queryPublicationsEns = gql`
 query PublicationsEns($skip: Int!) {
  domain(id:"0x1aaf79d9b3323ad0212f6a2f34f8c627d8d45e45a55c774d080e3077334bfad9") {
    id
    name
    subdomains(first:10, skip: $skip, orderBy:labelName) {
      name
      labelName
    }
  }
}
`;


//ensAddress 
export const queryEnsAddress = gql`
query Contributor($name: String!) {
     domains(where: {name:$name}) {
      id
      name
      labelName
      labelhash
      owner{
        id
      }
    }
  }
`

//profile  
export const queryContributor = gql`
query Contributor($address: String!) {
  userProfile(address: $address) {
                address
                avatarURL
                displayName
        }
    }
`

//contributor 
export const queryPublicationContributor = gql`
query PublicationContributor($address: String!) {
    contributor(address: $address) {
        address
        id
        displayName
        avatarURL
        publications {
          id
          ensLabel
          displayName
          avatarURL
        }
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
		transactions(first:5, after:$after, tags: [
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

export const queryAll = gql`
{
		transactions(first:10, tags: [{ name: "App-Name", values: ["MirrorXYZ"] }]) {
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
         timestamp
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
        featuredImage {
          mimetype
          sizes {
            og {
                src
                height
                width
            }
          }
        }
        author{
          address
          displayName
        }
        publication{
          ensLabel
          avatarURL
        }
    }
}`


//single Entry
export const queryEntryPreview = gql`
query Entry($digest: String!) {
  entry(digest: $digest) {
        id
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
    thumbnailMedia{
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

export const queryVerifiedAccounts = gql`
  query VerifiedAccounts {
    verifiedAccounts {
      username
      account
      signature
    }
  }
`

export const queryPublications = gql`
query Publications {
  publications{
      ensLabel
  }
}
`

export const queryPublications_wAvatars = gql`
query Publications {
  publications{
      ensLabel
      avatarURL
      displayName
  }
}
`


export const queryUnverifiedProfiles = gql`
query UnverifiedTwitterProfiles {
  unverifiedTwitterProfiles {
    address
    twitterProfile {
      username
      avatarURL
      __typename
    }
    __typename
  }
}
`