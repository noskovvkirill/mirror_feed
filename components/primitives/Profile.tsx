import * as Avatar from '@radix-ui/react-avatar';
import * as Tooltip from '@radix-ui/react-tooltip';
import {styled} from 'stitches.config'
import type {SubscribedPublication} from 'contexts'
import {AddressPrettyPrint} from 'src/utils'
export type User = {
    avatarURL:string | undefined,
    displayName: string | undefined,
    address:string 
}


interface IProfile {
    profile:User | SubscribedPublication,
    size?:'og' | 'lg' | 'md'| 'sm'
}

const StyledAvatar = styled(Avatar.Root, {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  verticalAlign: 'middle',
  overflow: 'hidden',
  userSelect: 'none',
  borderRadius: '100%',
  backgroundColor:'$backgroundText',
  variants:{
      size:{
           og:{
                width: 'calc($4 * 3)',
                height: 'calc($4 * 3)',
                '&:hover':{
                    outline:'4px solid $foreground',
                },
           },
            lg:{
                outline:'3px solid $foreground',
                width: 'calc($4 * 1.5)',
                height: 'calc($4 * 1.5)',
                '&:hover':{
                    outline:'4px solid $foreground',
                },
            },
             md:{
                outline:'3px solid $foreground',
                width: '$4',
                height: '$4',
                '&:hover':{
                    outline:'4px solid $foreground',
                },
             },
             sm:{
                outline:'3px solid $foreground',
                width: 'calc($4 * 0.8)',
                height: 'calc($4 * 0.8)',
                '&:hover':{
                    outline:'4px solid $foreground',
                },
             }
      }
  },
  defaultVariants:{
      size:'md'
  }
});

const StyledImage = styled(Avatar.Image, {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: 'inherit',
});

const StyledFallback = styled(Avatar.Fallback, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$highlightBronze',
  color:'$foregroundTextBronze',
  fontSize: '$6',
  lineHeight: 1,
  fontWeight: 500,
   variants:{
      size:{
           og:{
                width: 'calc($4 * 3)',
                height: 'calc($4 * 3)',
                '&:hover':{
                    outline:'4px solid $foreground',
                },
           },
            lg:{
                outline:'3px solid $foreground',
                width: 'calc($4 * 1.5)',
                height: 'calc($4 * 1.5)',
                '&:hover':{
                    outline:'4px solid $foreground',
                },
            },
             md:{
                outline:'3px solid $foreground',
                width: '$4',
                height: '$4',
                '&:hover':{
                    outline:'4px solid $foreground',
                },
             },
             sm:{
                outline:'3px solid $foreground',
                width: 'calc($4 * 0.8)',
                height: 'calc($4 * 0.8)',
                '&:hover':{
                    outline:'4px solid $foreground',
                },
             }
      }
  },
  defaultVariants:{
      size:'md'
  }
});

const StyledContentTooltip = styled(Tooltip.Content, {
    backgroundColor:'$highlight',
    border:'1px solid $foregroundBorder',
    color:'$foregroundText',
    fontSize:'$6',
    borderRadius:'$2',
    padding:'$1 $2',
    position:'relative',
    bottom:'$0',
})

const StyledTrigger = styled(Tooltip.Trigger, {
    cursor:'pointer',
    background:'transparent',
    border:'0px'
})

export const isUser = (x: any): x is User => x && x.address;
export const isPublication = (x: any): x is SubscribedPublication => x && x.ensLabel;


const Profile = ({profile, size='md'}:IProfile) => {
    return(
        <Tooltip.Root>
            <StyledTrigger>
                <StyledAvatar size={size}>
                   
                          
                            <StyledImage 
                            src={profile?.avatarURL && profile.avatarURL}
                            alt={'user avatar'}
                            />
                           
                    <StyledFallback size={size} delayMs={600}>
                        {profile && isUser(profile) && (
                            <>
                            {profile.displayName 
                            ? <>{profile?.displayName.match(/(\b\S)?/g)?.join("")?.match(/(^\S|\S$)?/g)?.join("").toUpperCase()} </>
                            : <>{AddressPrettyPrint(profile.address)}</>
                            }
                            </>
                        )}

                        {profile && isPublication(profile) && (
                            <>
                            {profile?.ensLabel.match(/(\b\S)?/g)?.join("")?.match(/(^\S|\S$)?/g)?.join("").toUpperCase()} 
                            </>
                        )}
                    
                    
                    </StyledFallback>
                </StyledAvatar>
            </StyledTrigger>

            <StyledContentTooltip side="top">
               {isUser(profile) && profile.displayName}
               {isPublication(profile) && profile.ensLabel}
            </StyledContentTooltip>
        </Tooltip.Root>
    )
}

export default Profile