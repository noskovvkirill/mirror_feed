import * as SliderPrimitive from '@radix-ui/react-slider';
import {styled} from 'stitches.config'

const StyledSlider = styled(SliderPrimitive.Root, {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  userSelect: 'none',
  touchAction: 'none',
  '&[data-disabled]':{
    opacity: 0.25,
    pointerEvents: 'none',
  },
  '&[data-orientation="horizontal"]': {
    height: 16,
  },

  '&[data-orientation="vertical"]': {
    flexDirection: 'column',
    width: 16,
    minHeight: 'calc($4 * 2)',
    height:'100%',
  },
});

const StyledTrack = styled(SliderPrimitive.Track, {
  variants:{
      color:{
          default:{
            backgroundColor:'$foreground',
          },
          highlight:{
            backgroundColor:'$foregroundBronze',
          },
      }
  },
  position: 'relative',
  flexGrow: 1,
  borderRadius: '$round',
  '&[data-orientation="horizontal"]': { height: 3 },
  '&[data-orientation="vertical"]': { width: 3 },
  defaultVariants:{
      color:'default'
  }
});

const StyledRange = styled(SliderPrimitive.Range, {
  position: 'absolute',
  backgroundColor: '$text',
  borderRadius: '$round',
//   height: '100%',
  width:'100%'  
});

const StyledThumb = styled(SliderPrimitive.Thumb, {
  all: 'unset',
  display: 'block',
  width: '$3',
  height: '$3',
  backgroundColor: 'white',
  boxShadow: '$normal',
  borderRadius: '$round',
  '&:hover': { cursor:'pointer', backgroundColor: '$foreground' },
  '&:focus': { boxShadow: '$large' },
});

interface ISlider {
    min?:number,
    max?:number,
    label:string,
    name?:string,
    color?:'default' | 'highlight',
    defaultValue?:number,
    disabled?:boolean
    onChange:(value:number)=>void;
}

const Slider = ({min=0, max, 
    onChange,
    name,defaultValue = 50, 
    color='default',
    label='price', disabled=false}:ISlider) => {
    return(
        <StyledSlider
        disabled={disabled} 
        name={name}
        orientation="vertical"
        onValueChange={(e)=>{onChange(e[0])}}
        defaultValue={[defaultValue]}
        min={min}
        max={max} step={1} aria-label={label}>
        <StyledTrack color={color}>
            <StyledRange />
        </StyledTrack>
        <StyledThumb />
        </StyledSlider>
    )
}

export default Slider