import Root from '@/design-system/Entry/Root'
import Body from '@/design-system/Entry/Body'
import ControlsPreview from '@/design-system/Entry/Controls/Preview'
import ControlsEntryFull from '@/design-system/Entry/Controls/EntryFull'

export type EntryType = {
  id:string,
  digest:string,
  timestamp:number,
  author:{
      address:string;
      displayName:string;
  },
  publication:{
      ensLabel:string;
  },
  featuredImage?:{
      sizes:{
          og?:{
            src:string,
            width:number,
            height:number
          },
          lg?:{
            src:string,
            width:number,
            height:number
          }, 
          md?:{
            src:string,
            width:number,
            height:number
          },
          sm?:{
            src:string,
            width:number,
            height:number
          }
      }
  }
  title:string,
  body:any
}

export {
  Root,
  Body,
  ControlsEntryFull,
  ControlsPreview
}
