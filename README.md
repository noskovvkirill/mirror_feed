# An alternative reading client for the Mirror.xyz

## Contacts
Made by @noskovvkirill
Find me on Twitter or noskovvkirill@gmail.com

Contributions are welcomed :-) 
## Goals and principles

✦✦✦ Curation
✦ Reading as a shared experience and exploration  
✦ Mirror as a protocol to build on, not the platform 
✦ Highly customizable
 
## Design exploration
Random explorations when thinking in code doesnt work 
https://www.figma.com/file/yJ8Ram0xgkGsufTkF8VTil/MirrorPubSub?node-id=0%3A1

## Roadmap

Work is divided into four parts: design, frontend, backend, contracts

Backend & Frontend
— [X] Text search, better indexing
— [X] Improve sync infrastrcture
— [ ] Support/indexing for non-members publication + frontend work 
- [X] Notifications & Subscribtions
- [ ] Auction & Editions Airdrop Embeds
— [ ] Favourites only feed, members only feed, spaces feed and etc. Should provide a complete overview of Mirror.xyz
- [ ] Separate feed for all different blocks within mirror 
- [ ] Quadratic voting for the best entries in Explore tab  

Contract & Web3
- [ ] NFT Derivatives (possibility to create highlights & extract pieces of content with the attribution to initial creator). Glass hyperlink protocol. Maybe it's simpler than staking (?) or keep both (remint/remix or stake)
- [ ] Staking economy doesn't work — it simply generated the extra coins for the authors. I need someones help to make it work sustainably — it has to be a combination from space creationg (NFT minting), bonding curve pricing, protocol owned liquidity. I'm not competent enough for that yet.
- [ ] Arweave test (split document into blocks with their own CID). It may be the key for the atomic content curation in the future 
- [ ] Design the NFT game for the spaces (it has to be exciting to mint, it should be scarce and crypto native [no IPFS]) to enable growth
— [ ] GraphAPI add support for transfers (spaces NFT improvement)
— [ ] Royalties to support work of curators (?) https://github.com/manifoldxyz/royalty-registry-solidity 
— [ ] Test multisig ownership of the publication 
— [ ] How do we reward authors? Right now the func is quite random and generic. Looking into other staking contracts 

Design 
— [ ] How would 2 step process for groups/publications with review would work? Can we recreate traditional publishing experience with a combination of Mirror (creation) and MirrorFeed (curation & exploration)?   
— [ ] Change copy  

