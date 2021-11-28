# An alternative reading client for the Mirror.xyz

~~Probably Mirror team is already working on their feed implementation, but I think it's important to highlight the power of decentralization and build an alternative to the existing client app. Fat protocols and thin layers?~~

~~I see that Mirror.xyz is moving towards a channel of communication for the different projects rather than a simply text-focused publishing platform. The advantage of my app could be in its simplicity that focuses on text&ideas~~ <- NOT RELEVANT ANYMORE

After the initial release of the project, I've realized that the real pain point is a curation. There is a huge amount of great content available on Mirror, but it's hard to find it unless someone shares it directly. Probably the easiest direction to take is to have a content indexation, tagging and have a search. Or to curate stuff though likes/upvotes on a server. I want to explore crypto native interactions and token stacking seems to be one of the most interesting direction to explore. But I'm not sure that it provides a right experience for the curator (signing everything, waiting for a transaction to be approved and etc.). I welcome all the ideas! :-)

## Goals and principles

✦✦✦ Curation
✦ Reading as a shared experience, conversation and exploration  
✦ Mirror as a protocol to build upon, not the
parent project to look at
✦ Highly customizable

## Design exploration

https://www.figma.com/file/yJ8Ram0xgkGsufTkF8VTil/MirrorPubSub?node-id=0%3A1

## Roadmap

### MVP

#### Good reading experience, viable Mirror alternative

- [x] Fetch the list of publications from ENS
- [x] Fetch the list of entries from Arweave and Mirror
- [x] Infinite scroll
- [x] Basic layout design, all the basic components for correct Markdown rendering
- [x] Publications pages
- [x] Settings, toolbar, reading list, styling //save all the settings locally at the moment
- [x] Reading List delete option
- [x] Local curation spaces

#### TODO

- [x] Fix useSWR types error and pages rendering
- [x] Merge Article and Article Preview component into one to later perform a correct layout animation
- [x] Refactor Article &/or Article Preview components to follow Model-View paradigm.
- [x] Fix router to have a /publicationId/entryID for the correct Navigation
- [x] Change Nav component to display publications details when inside entryId
- [x] Reading list deletes
- [x] Individual publication pages
- [x] Distinction between user pages and ensLabel pages
- [x] Global state for selected article (to display pretty names and not the hashes :)
- [x] Feed is replicating itself on curation spaces. Investigate and fix

#### TODO Post MVP

I've shifted my priority from a high level of customization to the discovery, curation and feed.
I aim to build as little as possible and use existing blocks in a clever way.

I want everyone to be able to create and share curated spaces. But I don't want to store them on a server.

- [x] Spaces are slow — I query the contributor list multiple times. Need to fix and fetch one then reuse for the article queries. Or even save the list locally as the part of the space :-)
- [x] Fix the rotation of labels
- [x] Links push to the top of the page (Next reading list item)
- [x] Safari custom focus outline for the Reading List
- [x] Contributors list in the publication
- [x] Stitched Themes (Dark Mode, Black&White, Default)
- [x] Image full screen
- [x] Event Listener for Portalled Control Buttons (remove on scroll or scroll lock(?) // solved with proper positioning
- [x] Patience loader text gradient :-)
- [x] Basic local curation lists
- [ ] Estimated reading time in Exploration mode
- [ ] Auction & Editions Airdrop Embeds
- [ ] Design link embeds (Twitter ✓)
- [ ] Publication pages are too similar to the main feed, wrong sense of place for the user
- [x] Pinned items don't work when inside the publication pages (no filtering)
- [x] Decide where to place the logo to give a better identity to the website?
- [ ] Click on avatar to remove from the Space
- [ ] Add publication to the space from the PopUp
- [x] Add Verifiend accounts to the Search to check the accounts names
- [x] Improved search + ENS
- [ ] Optimize Images

### First version

#### Social experience, moldable & fluid interface

- [x] Authentication
- [ ] Link previews
- [x] Multiple Themes
- [ ] Custom theming
- [x] Image Full Screen
- [ ] Highlighting (add into existing context menu? is it possible to augment it without an extension? Seems like it is https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Context_menu_items). Highlights list.
- [ ] Static Rendering for the publications.
- [x] Available publications browse
- [ ] Display to which spaces the publication belongs to
- [ ] Optimize CSS, Add frequentyle used snippets to Stitches, remove inline styling
- [ ] Actions History (Ctrl+Z, Cmd+Z), Keyboard navigation and Article previews on spacebar
- [ ] Replace Recoil with Zustand for simplicity (maybe not :)
- [ ] Keyboard navigation (spacebar preview, enter to open, cmd+x to close (?))
- [ ] Full version of Embeded crypto blocks (Editions and etc.).- [ ] Move the app from Vercel to Sleek (?) (compare the speed and experience first)
- [ ] Subscribtions & notifications //centralized, using supabase for indexing together with CRON jobs. Hopefully, once the-graph provides an Arweave support the app can use it instead (?)
- [ ] Search through articles (when thegraph + arweave is available?)
- [ ] Screen split on drag (the cards on main page are draggable into open space to create the columns(?)
- [ ] Inline comments [medium like discussions]

### Curation

- [x] In Progress Separate page for the personal/group curation. Similar to the ownership of publication on Mirror.
- [x] Drag and drop functionality from Pinned Items to that space
- [x] Authenticatio-
- [x] ERC-20 token, governance // https://docs.openzeppelin.com/contracts/4.x/api/governance
- [x] Test contract interaction. Can stacking be a smooth experience?
- [x] How do we fetch and see the articles based on stacking? Do we sort by day/by week/both?
      Immediate actions:
      — [ ] Pinned Items sort on drag
      — [ ] Remove curated items not sync produces null values
      — [ ] Add the article card size configuration on a left bar
      — [ ] Body freezes after the portal interaction (?)
      — [ ] Bottom Right side for the toasts/contract interactions/notifications
- [ ] .. Rest of the mechanics/design should follow.
