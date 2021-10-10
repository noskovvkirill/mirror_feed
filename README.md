# An alternative reading client for the Mirror.xyz

I'm slowly building the project for myself (I say it to justify the slow speed:-). Probably Mirror team is already working on their feed implementation, but I think it's important to highlight the power of decentralization and build an alternative to the existing client app. Fat protocols and thin layers, huh?

Their team built a huge number of in-built components and tools for crowdfunding/voting, etc. I feel like it's quite problematic because all of their opinionated modules are part of the Arweave document stored on-chain. I need to think about how to take care of it. I see that Mirror.xyz is moving towards a channel of communication for the different projects rather than a simply text-focused publishing platform. The advantage of my app could be in its simplicity that removes all the clutter from the service and focuses on text&ideas (simple doesn't mean a plain text and lack of features, but strong focus). I need to think how to filter all unwanted articles.

## Goals and principles

✦ Reading as a shared experience, conversation and exploration  
✦ Mirror as a protocol to build upon, not the
parent project to look at
✦ Highly customizable
✦ Spatial interface, focus on animation, interaction design. Design with Z axis in mind.
✦ Speed

## Design exploration

https://www.figma.com/file/yJ8Ram0xgkGsufTkF8VTil/MirrorPubSub?node-id=0%3A1

## Roadmap

### MVP

#### Good reading experience, viable Mirror alternative

- [x] Fetch the list of publications from ENS
- [x] Fetch the list of entries from Arweave and Mirror
- [x] Infinite scroll
- [IN PROGRESS] Basic layout design, all the basic components for correct Markdown rendering
- [x] Publications pages
- [IN PROGRESS] Embeds such us Twitter, Transistor.fm and etc. Special NFT Auction Embeds from Mirror
- [IN PROGRESS] Settings, toolbar, reading list, personal styling, typeface selection, multiple columns //save all the settings locally at the moment
- [] Estimated reading time in Exploration mode
- [x] Reading List delete option
- [] Image Full Screen
- [] Link previews
- [] Local curation spaces
- [] Highlighting (add into existing context menu? is it possible to augment it without an extension? Seems like it is https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Context_menu_items). Highlights list.

#### TODO

— [X] Fix useSWR types error and pages rendering
— [X] Merge Article and Article Preview component into one to later perform a correct layout animation
— [X] Refactor Article &/or Article Preview components to follow Model-View paradigm.
— [X] Fix router to have a /publicationId/entryID for the correct Navigation
— [X] Change Nav component to display publications details when inside entryId
— [X] Reading list deletes
— [X] Individual publication pages
— [X] Distinction between user pages and ensLabel pages
— [X] Global state for selected article (to display pretty names and not the hashes :)
— [IN PROGRESS] Start designing link embeds
— [] Fix the rotation of labels
— [] Stitched Themes (Dark Mode, Black&White, Default)
— [] Image full screen
— [] Rename the Spaces
— [X] Event Listener for Portalled Control Buttons (remove on scroll or scroll lock(?) // solved with proper positioning
— [] Patience loader text gradient :-)
— [IN PROGRESS] Basic local curation lists
— [IN PROGRESS] Search for the Curation Lists
— [] "Delete" button in the Reading List is weird and doesn't follow the Fitts law
— [] Publication pages are too similar to the main feed, wrong sense of place for the user
— [X] Pinned items don't work when inside the publication pages (no filtering)
— [] Decide where to place the logo to give a better identity to the website?
— [] Click on avatar to remove from the Space
— [] Add Verifiend accounts to the Search to check the accounts names

### First version

#### Social experience, curation, tripple E strategy (embrance, extend, extinguish: lol sort of)

- [] Authentication
- [] Static Rendering for the articles. Parse text server-side. Include oembeds
- [] Optimize CSS, Add frequentyle used snippets to Stitches, remove inline styling
- [] Actions History (Ctrl+Z, Cmd+Z), Keyboard navigation and Article previews on spacebar
- [] Replace Recoil with Zustand for simplicity
- [] Keyboard navigation (spacebar preview, enter to open, cmd+x to close (?))
- [] Public curated Lists (not sure where to store.. Textille? I like the way Ceramic works though, but authentication is a real mess)
- [] Full version of Embeded crypto blocks (Editions and etc.). Optimize parsing (prbbly move server side)
- [] Speech Synthesis Native Browser API for the audio. Simple Audio player (?)
- [] Move the app from Vercel to Sleek (?) compare the speed and experience first)
- [] Subscribtions & notifications //centralized, using supabase for indexing together with CRON jobs. Hopefully, once the-graph provides an Arweave support the app can use it instead (?)
- [] Proper handle of multiple columns to create a book like text handling (native css columns are useless, because they can be really tall and unreadable) (not sure it's needed at this stage since most of the posts aren't that long)
- [] Search through articles (when thegraph + arweave is available?)
- [] Screen split on drag (the cards on main page are draggable into open space to create the columns(?)
- [] Custom CSS support (?) [how to implement it :D?, prbbly I have to have a really clean global stylesheet and minimize inline styling]
- [] Inline comments [medium like discussions]
- [] Commandline (?)
