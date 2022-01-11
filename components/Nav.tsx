import Box from "@/design-system/primitives/Box"
import { styled } from "stitches.config"
import { useTheme } from 'next-themes'
import Settings from '@/design-system/Settings'
import React from 'react'
// import ArrowDownIcon from '@/design-system/icons/ArrowDown'
// import ButtonControl from "@/design-system/primitives/ButtonControl"
import Updates from "@/design-system/Updates"
import { useAuth } from "contexts/user"

const StyledNav = styled(Box, {
    zIndex: '1000000',
    padding: '$0 $4 $0 0',
    height: 'fit-content',
    overflow: 'visible',
    display: 'flex',
    flexDirection: 'row',
    gap: '$1',
    '@bp1': {
        padding: '$0 $3 $0 0'
    }
})


interface INav {
    isPinnedList: boolean;
    setIsPinnedList: (newState: boolean) => void;
    pinnedListLength: number;
}


const Nav = ({ isPinnedList, setIsPinnedList, pinnedListLength }: INav) => {
    // const router = useRouter();
    // const readingList = useRecoilValueAfterMount(readLaterList, [])
    // const setReadLater = useSetRecoilState(readLaterList) 
    const { themes, theme, setTheme } = useTheme()
    const { user } = useAuth()

    return (
        <StyledNav>
            {/* <Box layout='flexBoxRow'> */}
            {/* {!isPinnedList && (
                    <Box layout='flexBoxRow' css={{ userSelect: 'none', fontSize: '$6', color: '$foregroundText', alignItems: 'center', justifyContent: 'center' }}>{pinnedListLength}</Box>
                )}
                <ButtonControl
                    isHighlighted={false}
                    direction='left'
                    label={isPinnedList ? 'hide pinned' : 'show pinned'}
                    onClick={() => setIsPinnedList(!isPinnedList)}
                    css={{
                        '@bp1': {
                            display: 'none'
                        }
                    }}
                >
                    <Box css={{
                        pointerEvents: 'none',
                        transform: isPinnedList ? 'rotate(180deg)' : '',
                    }}>
                        <ArrowDownIcon />
                    </Box>
                </ButtonControl> */}

            {/* </Box> */}
            {user?.isConnected && (
                <Updates />
            )}
            <Settings
                themes={themes}
                theme={theme}
                UpdateTheme={setTheme} />

        </StyledNav>
    )
}

export default React.memo(Nav)


// const StyledContent = styled(DropdownMenu.Content,{
//     marginTop:'$1',
//     padding:'0',
//     borderRadius:'$2',
//     maxHeight:'calc($4 * 12)',
//     overflow:'scroll', 
//     border:'1px solid $foregroundBorder',
//     backgroundColor:'$background',
//     // backgroundColor:'$highlightBronze',
//     mixBlendMode:'multiply',
//     width:'calc($4 * 9)',
//     display:'flex',
//     flexDirection:'column',
//     gap:'$1',
//     listStyle:'none',
// })


// const StyledItem = styled(DropdownMenu.Item, {
//     display:'flex',
//     width:'100%',
//     gap:'$2',
//     fontSize:'$6',
//     maxWidth:'100%',
//     color:'$foregroundText',
//     padding:'$0 $0',
//     marginBottom:'$1',
//     cursor:'pointer',
//     transition:'$color',
//     position:'relative',
//     '&:hover':{
//           color:'$textBronze',
//     },
//     '&:focus': {
//     outline:' 3px solid $highlight',
//     borderRadius:'$2',
//     },
//     // expand the reach of the text 
//     '&::before': {
//     content: '""',
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: '100%',
//     height: '100%',
//     minWidth: 44,
//     minHeight: 44,
//   },
// })

// const StyledDelete = styled('button', {
//       display:'flex',
//       alignItems:'center',
//       justifyContent:'flex-end',
//       color:'$foregroundText',
//       background:'transparent',
//       cursor:'pointer',
//       width:'calc($4 * 2)',
//       height:'100%',
//       border:'0',
//      '&:hover':{
//           color:'$textBronze',
//     },

// })


// export interface Color {
//     readonly hex: string;
//     readonly rgb: ColorRGB;
//     readonly hsv: ColorHSV;
// }
// interface ColorRGB {
//     readonly r: number;
//     readonly g: number;
//     readonly b: number;
//     readonly a?: number;
// }
// interface ColorHSV {
//     readonly h: number;
//     readonly s: number;
//     readonly v: number;
//     readonly a?: number;
// }

// const reducer = (state:ThemeTokens, action:{color:string, value:Color}) => {
//       return { ...state, [action.color]: action.value }
// }

// type ThemeTokens = {
//         background: Color,
//         tinted:Color,
//         foreground: Color,
//         foregroundBorder: Color,
//         highlight: Color,
//         foregroundText: Color,
//         text: Color,
//         backgroundBronze:Color,
//         foregroundBronze:Color,
//         highlightBronze:Color,
//         foregroundTextBronze:Color,
//         textBronze: Color,
//         [U: string]: Color
// }

//COMMENTED CODE IS FOR THE CUSTOM THEMING FUNCTIONALITY. 
// NOT AVAILABLE AT THIS MOMENT



// useEffect(()=>{
//     let custom = localStorage.getItem('custom-theme') 
//     if(custom){
//         const data  = JSON.parse(custom)
//         const newColors:{[U: string]: string} = {}
//             for (const key in colors) {
//                 if (colors.hasOwnProperty(key)) {
//                     newColors[key] = data[key].hex
//                 }
//         }
//         const newName = 'custom'+Math.floor(Math.random()*1000).toString()
//         const themeN = createTheme(newName, {
//             colors: newColors
//          });
//         changeTheme({theme:themeN, name:newName})
//         setTheme(newName)
//         Object.keys(data).map((key)=>dispatch({color:key, value:data[key]}))
//     }
// // eslint-disable-next-line react-hooks/exhaustive-deps
// },[setTheme, changeTheme])

// const initialValue:ThemeTokens = {
//         background: toColor("hex", "#121212"),
//         tinted:toColor("hex", "#121212"),
//         foreground: toColor("hex", "#121212"),
//         foregroundBorder: toColor("hex", "#121212"),
//         highlight: toColor("hex", "#121212"),
//         foregroundText: toColor("hex", "#121212"),
//         text:toColor("hex", "#121212"),
//         backgroundBronze: toColor("hex", "#121212"),
//         foregroundBronze: toColor("hex", "#121212"),
//         highlightBronze:toColor("hex", "#121212"),
//         foregroundTextBronze: toColor("hex", "#121212"),
//         textBronze: toColor("hex", "#121212"),
// }
// const [colors, dispatch] = useReducer(reducer, initialValue)


// const UpdateTheme = async () => {
//    const newName = 'custom'+Math.floor(Math.random()*1000).toString()
//    const newColors:{[U: string]: string} = {}
//    for (const key in colors) {
//         if (colors.hasOwnProperty(key)) {
//             newColors[key] = colors[key].hex
//         }
//    }
//    const themeN = createTheme(newName, {
//         colors: newColors
//    });

//     changeTheme({theme:themeN, name:newName})
//     setTheme(newName)

//     localStorage.setItem('custom-theme', JSON.stringify(colors))
// }



{/* <DropdownMenu.Root>
                <Button
                as={DropdownMenu.Trigger}
                css={{gap:'$1', 
                '&[data-state="open"]': {
                    color:'$foregroundTextBronze',
                    border:'1px solid $highlightBronze',
                    backgroundColor:'$highlightBronze'
                }
                }}
                onClick={()=>router.push('/list')}
                disabled={router.pathname === '/list' ? true : false}
                >Reading List {readingList.length > 0 && (
                <> ▾&#8201;{readingList.length}</>
                )}</Button>
                <StyledContent align='end'>
                    <Box layout='flexBoxColumn' css={{padding:'$2', paddingBottom:'$0'}}>
                        {readingList.length === 0 && (
                            <Box as='p' css={{fontSize:'$6', color:'$foregroundTextBronze', margin:'0', textAlign:'center'}}>Nothing here yet&nbsp; 🔭</Box>
                        )}
                        {readingList.map((item:ReadingListItem)=>{
                            return(
                                <Box layout='flexBoxRow'
                                css={{justifyContent:'space-between', position:'relative', gap:'$2'}}
                                key={'read-later-list'+item.entryDigest}>
                                    <StyledItem 
                                    onClick={()=>{
                                    router.push(`/${item.ensLabel}/${item.entryDigest}`)
                                    }}
                                >
                                        <>{item.title}</>                            
                                    </StyledItem>

                                    <StyledDelete
                                    onClick={()=>{
                                        setReadLater((prevState:ReadingListItem[])=>{
                                        const indexUnPin = prevState.findIndex((itemPrev:ReadingListItem)=>itemPrev.entryDigest=== item.entryDigest)
                                        const newArray =[...prevState.slice(0, indexUnPin), ...prevState.slice(indexUnPin + 1)];
                                        return newArray
                                    })}}
                                    >
                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.877075 7.49988C0.877075 3.84219 3.84222 0.877045 7.49991 0.877045C11.1576 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1575 0.877075 7.49988ZM7.49991 1.82704C4.36689 1.82704 1.82708 4.36686 1.82708 7.49988C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49988C13.1727 4.36686 10.6329 1.82704 7.49991 1.82704ZM9.85358 5.14644C10.0488 5.3417 10.0488 5.65829 9.85358 5.85355L8.20713 7.49999L9.85358 9.14644C10.0488 9.3417 10.0488 9.65829 9.85358 9.85355C9.65832 10.0488 9.34173 10.0488 9.14647 9.85355L7.50002 8.2071L5.85358 9.85355C5.65832 10.0488 5.34173 10.0488 5.14647 9.85355C4.95121 9.65829 4.95121 9.3417 5.14647 9.14644L6.79292 7.49999L5.14647 5.85355C4.95121 5.65829 4.95121 5.3417 5.14647 5.14644C5.34173 4.95118 5.65832 4.95118 5.85358 5.14644L7.50002 6.79289L9.14647 5.14644C9.34173 4.95118 9.65832 4.95118 9.85358 5.14644Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                    </StyledDelete>

                                </Box>
                            )
                        })}
                    </Box>


                    {readingList.length > 0 && (
                        <Box css={{ backgroundColor:'$highlightBronze', 
                        mixBlendMode:'multiply', 
                        backdropFilter:'opacity(0.55) blur(1px)',  
                        marginTop:'$0', position:'sticky', bottom:'0', padding:'calc($1 * 1.5)', paddingTop:'$0', }}>
                            <Button 
                            onClick={(e)=>{
                                e.preventDefault()
                                router.push('/list')
                            }}
                            css={{
                            padding:'$0',
                            color:'$foregroundTextBronze',
                            backgroundColor:'$highlightBronze',
                            bottom:'0',
                            border:'1px solid transparent',
                            borderBottom:'1px solid transparent',
                            width:'100%', justifyContent:'center',
                            transition:'$all',
                            '&:hover':{
                                color:'$textBronze',
                                borderRadius:'$2'
                            }
                        }}>
                        
                            See All
                        </Button>
                    </Box>
                    )}
                </StyledContent>
            </DropdownMenu.Root> */}