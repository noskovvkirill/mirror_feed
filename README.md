# An alternative reading client for the Mirror.xyz

I'm slowly building the project for myself (I say it to justify the slow speed:-). Probably Mirror team is already working on their feed implementation, but I think it's important to highlight the power of decentralization and build an alternative to the existing client app. Fat protocols and thin layers, huh?

Their team built a huge number of in-built components and tools for crowdfunding/voting, etc. I feel like it's quite problematic because all of their opinionated modules are part of the Arweave document stored on-chain. I need to think about how to take care of it. I see that Mirror.xyz is moving towards a channel of communication for the different projects rather than a simply text-focused publishing platform. The advantage of my app could be in its simplicity that removes all the clutter from the service and focuses on text&ideas. I need to think how to filter all unwanted articles.

## Goals and principles

✦ Highly customizable
✦ Reading as a shared experience, conversation and exploration  
✦ Mirror as a protocol to build upon, not the
parent project to look at
✦ Spatial interface, focus on animation, interaction design. Design with Z axis in mind.
✦ Speed

## Design exploration

https://www.figma.com/file/yJ8Ram0xgkGsufTkF8VTil/MirrorPubSub?node-id=0%3A1

## Roadmap

- [x] Fetch the list of publications from ENS
- [x] Fetch the list of entries from Arweave and Mirror
- [] Infinite scroll
- [] Basic layout design, all the basic components for correct Markdown rendering
- [] Settings, toolbar, personal styling, typaface selection, multiple columns
  — [] Authentication
- [] Favourites list, subscribtion and notification support
- [] Curated List
- [] Search
- [] Custom CSS support
- [] Inline comments
- [] Commandline
- [] Infinite scroll
