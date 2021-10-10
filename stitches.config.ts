import { createStitches } from "@stitches/react";
import { sand } from '@radix-ui/colors'
import { bronze } from '@radix-ui/colors'

export const { styled, css, globalCss, getCssText, keyframes } = createStitches({
    theme: {
        colors: {
            ...sand,
            white: 'rgba(255,255,255,1)',
            black: 'rgba(0,0,0,1)',
            background: sand.sand1,
            tinted:sand.sand2,
            backgroundBronze: bronze.bronze1,
            foreground: sand.sand7,
            foregroundBorder: sand.sand8,
            foregroundBronze: bronze.bronze7,
            highlight: sand.sand3,
            highlightBronze:bronze.bronze3,
            foregroundText: sand.sand9,
            foregroundTextBronze: bronze.bronze9,
            text: sand.sand12,
            textBronze: bronze.bronze12

        },
        space: {
            0: "4px",
            1: "8px",
            2: "16px",
            3: "24px",
            4: "32px",
            5: "48px",
        },
        fontSizes: {
            6: "0.8rem",
            5: "1.25rem",
            4: "1.563rem",
            3: "1.953rem",
            2: "2.441rem",
            1: "3.052rem",
            p: "1rem",
        },
        fonts: {
            default: "Satoshi-Variable",
        },
        fontWeights: {
            min:300,
            max:900,
        },
        lineHeights: {
            1: "125%",
            2: "120%",
            3: "96%",
            4: "102%",
            5: "102%",
            6: "98%",
            p: "156%;",
        },
        letterSpacings: {},
        sizes: {
            0: "4px",
            1: "8px",
            2: "16px",
            3: "24px",
            4: "32px",
            5: "48px",
            6: "96px",
            7: "124px",
        },
        borderWidths: {},
        borderStyles: {},
        radii: {
            1: "4px",
            2: "8px",
            round: "9999px",
        },
        shadows: {
            normal: `0px 2px 4px rgba(224,206,199, 0.5)`,
        },
        zIndices: {},
        transitions: {
            fontWeight:'.45s ease-out',
            all: "all 0.8s ease-out",
            color: "color 0.8s ease-out",
            background: "background 0.8s ease-out, color 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        },
    },
    media: {
        bp1: "(max-width: 544)",
        bp2: "(max-width: 544), (min-width: 768px)",
        bp3: "(min-width: 1024px)",
    },
});

export const fontWeightAnimation = keyframes({
    '0%': { fontWeight: '$min' },
    '100%': { fontWeight: '$max' },
});


//font weights are from 300—900 
export const globalStyles = globalCss({
    "*": {
        margin: 0,
        padding: 0,
        fontSize: "16px",
        fontWeight:'300',
        fontFamily: "Inter, Helvetica, sans-serif",
        '::selection':{
            background:'$foregroundBronze',
        }
    },
    "body, html, #__next": { minHeight: "100%", height: "100%" },
    h1: { fontSize: "$1",  letterSpacing:'-1px', fontKerning:'normal', fontStretch:'semi-condensed', fontOpticalSizing:'auto', WebkitFontSmoothing:'antialiased', lineHeight: "$6", fontWeight: "700",  margin:'calc($4 * 1) 0 $3 0', fontFamily:'Satoshi-Variable, Inter, Helvetica, sans-serif' },
    h2: { fontSize: "$2", lineHeight: "$5", fontWeight: "500", margin:'calc($4 * 1.5) 0 $2 0',fontFamily:'Satoshi-Variable, Inter, Helvetica, sans-serif', '&:first-child':{margin:'calc($2 * 1.5) 0 $2 0'} },
    h3: { fontSize: "$3", lineHeight: "$4", margin:'$4 0 $2 0', fontWeight: "700",fontFamily:'Satoshi-Variable, Inter, Helvetica, sans-serif', '&:first-child':{margin:'$2 0 $2 0'} },
    h4: { fontSize: "$4", lineHeight: "$3",   margin:'$4 0 $2 0', fontWeight: "700",fontFamily:'Satoshi-Variable, Inter, Helvetica, sans-serif', '&:first-child':{margin:'$2 0 $2 0'}},
    h5: { fontSize: "$5", lineHeight: "$2",  margin:'$4 0 $2 0', fontWeight: "700",fontFamily:'Satoshi-Variable, Inter, Helvetica, sans-serif', '&:first-child':{margin:'$2 0 $2 0'} },
    p: { fontSize: "$p", lineHeight: "$p",  margin:'$2 0', fontWeight: "300" },
    span: { fontSize: "$p", lineHeight: "$p", fontWeight: "300" },
    b: {
        fontWeight: "500",
    },
    strong: {
        fontWeight: "500",
    },
    hr: {
        border: 0,
        height: "1px",
        margin: "0",
        padding: "0",
    },
   '@font-face': [{
    fontFamily: 'Satoshi-Variable',
    src: 
    "url('/fonts/fonts/Satoshi-Variable.woff2') format('woff2'),"+
    "url('/fonts/fonts/Satoshi-Variable.woff') format('woff')," +
    "url('/fonts/fonts/Satoshi-Variable.ttf') format('truetype')",
    fontWeight: '300 900',
    fontDisplay: 'swap',
    fontStyle: 'normal'
    },
    {
    fontFamily: 'Inter',
    src: 
    "url('/fonts/fonts/Inter-Regular.woff2') format('woff2'),"+
    "url('/fonts/fonts/Inter-Regular.woff') format('woff')," +
    "url('/fonts/fonts/Inter-Regular.ttf') format('truetype')",
    fontWeight: '300',
    fontDisplay: 'swap',
    fontStyle: 'normal'
    },
],
    // "@font-face": [
    //     {
    //         fontFamily: "Graphik",
    //         fontWeight: "100",
    //         src: 'local("Graphik-Regular.woff"), url("/fonts/Graphik-Regular.woff")',
    //     },
    //     {
    //         fontFamily: "Graphik",
    //         fontWeight: "300",
    //         src: 'local("Graphik-Semibold.woff"), url("/fonts/Graphik-Semibold.woff")',
    //     },
    // ],
});