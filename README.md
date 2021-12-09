# An alternative reading client for the Mirror.xyz
## Goals and principles

✦✦✦ Curation
✦ Reading as a shared experience, conversation and exploration  
✦ Come for the tool.. stay for the ...
✦ Mirror as a protocol to build upon, not the
parent project to look at
✦ Highly customizable

I tried to verify mirror signatures onchain but realized that a simple legitimacy through staking may work. 
I desensitize cybil attacks – the access to curation spaces is limited. Rewards are based on the N of people who staked for a specific item.  
Rewards should be small ~0 if a small number of curators have staked the tokens. WIP 
## Design exploration
Random explorations when thinking in code doesnt work 
https://www.figma.com/file/yJ8Ram0xgkGsufTkF8VTil/MirrorPubSub?node-id=0%3A1

## Roadmap

Work is divided into four parts: design, frontend, backend, contracts

Backend & Frontend
— [ ] Full text search, better indexing
— [ ] Improve sync infrastrcture
— [ ] Support/indexing for non-members publication + frontend work 
- [ ] Notifications & Subscribtions
- [ ] Auction & Editions Airdrop Embeds
— [ ] Favourites only feed, members only feed, spaces feed and etc. Should provide a complete overview of Mirror.xyz
- [ ] Separate feed for all different blocks within mirror 
- [ ] Quadratic voting for the best entries in Explore tab  

Contract & Web3
- [ ] NFT Derivatives (possibility to create highlights & extract pieces of content with the attribution to initial creator)
- [ ] Arweave test (split document into blocks with their own CID)
— [ ] GraphAPI add support for transfers
— [ ] Think on how royalties may work to support work of curators (?) https://github.com/manifoldxyz/royalty-registry-solidity
— [ ] Test multisig ownership of the publication 
— [ ] How do we reward authors? Right now the func is quite random and generic. Looking into other staking contracts 
— [ ] Support for best NFT practices for the spaces. Right now it's a generic OpZeppelin ERC721
— [ ] Every space is NFT, minting right now is open for everyone, but I want it to be a point of onboarding for curators. If you have NFT, you can mint two more for others or give permissions to someone else? What is a good way to ensure q. of Curators?

Design 
— [ ] How would 2 step process for groups/publications with review would work? Can we recreate traditional publishing experience?  
— [ ] Change copy  
