import { styled } from 'stitches.config'
import Box from '@/design-system/primitives/Box'
import Tag from '@/design-system/primitives/Tag'
import { useEffect, useState } from 'react'
import { AddressPrettyPrint } from 'src/utils'
export const StyledContainer = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    color: '$foregroundTextBronze',
    background: '$highlightBronze',
    padding: '$1 $2',
    gap: '$1',
    borderRadius: '0'
})
const StakeItem = ({ item, onChange, index, priceBatch }: any) => {
    const [value, setValue] = useState(priceBatch)
    useEffect(() => {
        setValue(priceBatch)
        onChange(index, value)
    }, [priceBatch])
    return (
        <StyledContainer>
            <Box layout='flexBoxRow'>
                <Tag isHighlighted={true}>
                    {item.item.publication
                        ? item.item.publication.ensLabel
                        : item.item.author.displayName ? item.item.author.displayName : AddressPrettyPrint(item.item.author.address)
                    }
                </Tag>
                <Tag isHighlighted={true}>
                    {item.item.digest.slice(0, 5)}...
                </Tag>
            </Box>
            <Box layout='flexBoxColumn'>
                <Box layout='flexBoxRow' css={{ alignItems: 'center', gap: '$2', justifyContent: 'space-between' }}>
                    <Box as='p' css={{ padding: '0', margin: '0', width: '100%' }}>
                        {item.item.title}
                    </Box>
                    <Box
                        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            const code = e.key
                            if (Number.isNaN(Number(code))) e.preventDefault();
                        }}
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = parseInt(e.target.innerHTML)
                            if (isNaN(value)) { onChange(index, 0); return }
                            onChange(index, value)
                        }}
                        suppressContentEditableWarning={true}
                        contentEditable={true}
                        css={{
                            fontSize: '$3',
                            margin: 0,
                            outline: 'none',
                            color: '$foregroundBronze',
                            border: 0,
                            width: 'fit-content',
                            padding: '0'
                        }}>
                        {value}
                    </Box>
                </Box>
            </Box>
        </StyledContainer>
    )
}

export default StakeItem


//   {isExpanded && (
//                         <>
//                         {(allowanceGov && allowanceGov >= 0 )
//                         ?   <Box layout='flexBoxRow' as='form' onSubmit={(e:React.FormEvent)=>{
//                             e.preventDefault();
//                             const target = e.target as HTMLFormElement & {
//                                 amount:{
//                                     value:string
//                                 }
//                             }
//                             Stake(item.item.author.address, item.item.digest, parseInt(target.amount.value))
//                         }}>
//                         </Box>
//                         :   <Button onClick={ApproveSpend}>
//                                 {isApproved === 'loading' ? <Loader size='small'/> : <>Approve</>}
//                             </Button>

//                         }     
//                         </>
//                     )}