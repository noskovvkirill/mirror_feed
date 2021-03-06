import { createStitches } from "@stitches/react";
import { sand, indigo, indigoDark, bronze, sandDark, red, tomatoDark } from '@radix-ui/colors'



export const { styled, css, globalCss, getCssText, keyframes, createTheme } = createStitches({
    theme: {
        colors: {
            background: sandDark.sand1,
            foreground: sandDark.sand9,
            foregroundBorder: sandDark.sand8,
            highlight: sandDark.sand3,
            tint: sandDark.sand2,
            foregroundText: sandDark.sand10,
            text: sandDark.sand12,
            //bronze
            backgroundBronze: sandDark.sand1,
            foregroundBronze: sandDark.sand9,
            foregroundTintBronze: sandDark.sand5,
            highlightBronze: sandDark.sand3,
            foregroundTextBronze: sandDark.sand10,
            textBronze: sandDark.sand12,
            error: red.red10
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
            default: "Inter, Helvetica, sans-serif",
            heading: "Satoshi-Variable, Inter, Helvetica, sans-serif",
        },
        fontWeights: {
            min: 300,
            max: 500,
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
            'body': '1152px'
        },
        borderWidths: {},
        borderStyles: {},
        radii: {
            1: "4px",
            2: "8px",
            round: "9999px",
        },
        shadows: {
            small: `0px 2px 4px 2px rgba(0,0,0, 0.1)`,
            normal: `0px 2px 8px 4px rgba(0,0,0, 0.15)`,
            large: `0px 4px 8px 4px rgba(0,0,0, 0.15)`,
            outline: `0 0 0 1px ${sandDark.sand9}`,
            outlineLarge: `0 0 0 3px ${sandDark.sand9}`,
            outlineSelected: `0 0 0 1px ${indigoDark.indigo9}`, //==foreground
            outlineLargeSelected: `0 0 0 3px ${indigoDark.indigo9}`,
        },
        zIndices: {},
        transitions: {
            fontWeight: '.45s ease-out',
            all: "all 0.8s ease-out",
            color: "color 0.8s ease-out",
            background: "background 0.8s ease-out, color 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        },
    },
    utils: {

    },
    media: {
        dark: "(prefers-color-scheme: dark)",
        bp1: "(width < 720px)",
        bp2: "(720px <= width < 1024px)",
        bp3: "(1024px <= width)",
    },
});


export const lightTheme = createTheme('light-cream', {
    colors: {
        // ...sand,
        background: sand.sand1,
        foreground: sand.sand8,
        foregroundBorder: sand.sand8,
        highlight: sand.sand5,
        tint: sand.sand2,
        foregroundText: sand.sand9,
        text: sand.sand12,
        //bronze
        backgroundBronze: bronze.bronze1,
        foregroundBronze: bronze.bronze7,
        foregroundTintBronze: bronze.bronze5,
        highlightBronze: bronze.bronze4,
        tintBronze: bronze.bronze2,
        foregroundTextBronze: bronze.bronze9,
        textBronze: bronze.bronze12,
        error: red.red10
    },
    shadows: {
        small: `0px 2px 4px 2px  ${sand.sand7}`,
        normal: `0px 2px 8px 2px ${sand.sand6}`,
        large: `0px 1px 8px ${sand.sand6}`,
        outline: `0 0 1px ${sand.sand8}`,
        outlineLarge: `0 0 3px ${sand.sand8}`,
        outlineSelected: `0 0 0 1px ${bronze.bronze7}`, //==foreground
        outlineLargeSelected: `0 0 0 3px ${bronze.bronze7}`,
    },
});



export const darkTheme = createTheme('dark-blue', {
    colors: {
        // ...sand,
        background: sandDark.sand1,
        foreground: sandDark.sand9,
        foregroundBorder: sandDark.sand9,
        highlight: sandDark.sand3,
        tint: sandDark.sand2,
        foregroundText: sandDark.sand11,
        text: sandDark.sand12,
        //bronze
        backgroundBronze: indigoDark.indigo1,
        foregroundTintBronze: indigoDark.indigo5,
        foregroundBronze: indigoDark.indigo9,
        highlightBronze: indigoDark.indigo3,
        foregroundTextBronze: indigoDark.indigo9,
        textBronze: indigoDark.indigo12,
        error: red.red10
    },
    shadows: {
        small: `0px 2px 4px 2px rgba(0,0,0, 0.1)`,
        normal: `0px 2px 8px 4px rgba(0,0,0, 0.15)`,
        large: `0px 4px 8px 4px rgba(0,0,0, 0.15)`,
        outline: `0 0 0 1px ${sandDark.sand9}`,
        outlineLarge: `0 0 0 3px ${sandDark.sand9}`,
        outlineSelected: `0 0 0 1px ${indigoDark.indigo9}`, //==foreground
        outlineLargeSelected: `0 0 0 3px ${indigoDark.indigo9}`,
    },
});

// export const lightThemePlain = createTheme('light-plain', {
//     colors: {
//         // ...sand,
//         background: sand.sand1,
//         foreground: sand.sand9,
//         foregroundBorder: sand.sand8,
//         highlight: sand.sand4,
//         tint: sand.sand2,
//         foregroundText: sand.sand9,
//         text: sand.sand12,
//         //bronze
//         backgroundBronze: sand.sand1,
//         foregroundBronze: sand.sand9,
//         foregroundTintBronze: sand.sand5,
//         highlightBronze: sand.sand3,
//         foregroundTextBronze: sand.sand9,
//         textBronze: sand.sand12,
//         error: red.red10
//     },
//     shadows: {
//         normal: `0px 2px 4px rgba(0,0,0, 0.5)`,
//         large: `0px 1px 8px ${sand.sand6}`,
//         outline: `0 0 0 1px ${sand.sand9}`, //==foreground
//         outlineLarge: `0 0 0 3px ${sand.sand9}`,
//         outlineSelected: `0 0 0 1px ${sand.sand11}`, //==foreground
//         outlineLargeSelected: `0 0 0 3px ${sand.sand11}`,
//     },
// });



export const lightThemeBlue = createTheme('light-blue', {
    colors: {
        // ...sand,
        background: sand.sand1,
        foreground: sand.sand9,
        foregroundBorder: sand.sand8,
        highlight: sand.sand4,
        tint: sand.sand2,
        foregroundText: sand.sand9,
        text: sand.sand12,
        //bronze
        backgroundBronze: indigo.indigo1,
        foregroundBronze: indigo.indigo9,
        foregroundTintBronze: indigo.indigo5,
        highlightBronze: indigo.indigo3,
        foregroundTextBronze: indigo.indigo9,
        textBronze: indigo.indigo12,
        error: red.red10
    },
    shadows: {
        small: `0px 2px 4px 2px rgba(0,0,0, 0.1)`,
        normal: `0px 2px 4px rgba(0,0,0, 0.5)`,
        large: `0px 1px 8px ${sand.sand6}`,
        outline: `0 0 0 1px ${sand.sand9}`,
        outlineLarge: `0 0 0 3px ${sand.sand9}`,
        outlineSelected: `0 0 0 1px ${indigo.indigo9}`, //==foreground
        outlineLargeSelected: `0 0 0 3px ${indigo.indigo9}`,
    },
});



export const darkThemePlain = createTheme('dark-plain', {
    colors: {
        // ...sand,
        background: sandDark.sand1,
        foreground: sandDark.sand9,
        foregroundBorder: sandDark.sand8,
        highlight: sandDark.sand3,
        tint: sandDark.sand2,
        foregroundText: sandDark.sand10,
        text: sandDark.sand12,
        //bronze
        backgroundBronze: sandDark.sand1,
        foregroundBronze: sandDark.sand9,
        foregroundTintBronze: sandDark.sand5,
        highlightBronze: sandDark.sand3,
        foregroundTextBronze: sandDark.sand10,
        textBronze: sandDark.sand12,
        error: red.red10
    },
    shadows: {
        normal: `0px 2px 4px rgba(0,0,0, 0.5)`,
        large: `0px 4px 8px rgba(0,0,0, 0.15)`,
        outline: `0 0 0 1px ${sandDark.sand9}`,
        outlineLarge: `0 0 0 3px ${sandDark.sand9}`,
        outlineSelected: `0 0 0 1px ${sandDark.sand7}`, //==foreground
        outlineLargeSelected: `0 0 0 3px ${sandDark.sand7}`,
    },
});



// export const redTheme = createTheme('dark-red', {
//        colors: {
//             // ...sand,
//             background: sandDark.sand1,
//             foreground: tomatoDark.tomato8,
//             foregroundBorder: sandDark.sand8,
//             highlight: tomatoDark.tomato3,
//             tint:tomatoDark.tomato2,
//             foregroundText: tomatoDark.tomato9,
//             text:tomatoDark.tomato8,
//             //bronze
//             backgroundBronze: tomatoDark.tomato1,
//             foregroundTintBronze: tomatoDark.tomato5,
//             foregroundBronze: tomatoDark.tomato8,
//             highlightBronze:tomatoDark.tomato3,
//             foregroundTextBronze: tomatoDark.tomato9,
//             textBronze: tomatoDark.tomato11,
//             error:red.red10
//         },
//         shadows: {
//             normal: `0px 2px 4px rgba(0,0,0, 0.5)`,
//             large: `0px 4px 8px ${tomatoDark.tomato1}`,
//         },
// });


//font weights are from 300???900 
export const globalStyles = globalCss({
    '*, *::before, *::after': {
        boxSizing: 'border-box'
    },
    "*": {
        margin: 0,
        padding: 0,
        fontSize: "16px",
        fontWeight: '300',
        fontFamily: "Inter, Helvetica, sans-serif",
        '::selection': {
            background: '$foregroundBronze',
        }
    },
    'img, picture, video, canvas': {
        display: 'block',
        maxWidth: '100%'
    },
    'p, h1, h2, h3, h4, h5, h6, strong, b, i': {
        overflowWrap: 'break-word',
        fontKerning: 'normal',
        fontFeatureSettings: `"kern" 1,"liga" 1,"calt" 0,"kern"`,
        fontStretch: 'semi-condensed',
        fontOpticalSizing: 'auto',
        WebkitFontSmoothing: 'antialiased',
    },
    "body": { background: '$background' },
    "body, html, #__next": { minHeight: "100%", height: "100%" },
    h1: { fontSize: "$1", letterSpacing: '-1px', fontFamily: 'Inter, Helvetica, sans-serif', lineHeight: "$6", fontWeight: "$max", margin: 'calc($4 * 1) 0 $3 0' },
    h2: { fontSize: "$2", lineHeight: "$5", fontWeight: "$max", margin: 'calc($4 * 1.5) 0 $2 0', fontFamily: 'Inter, Helvetica, sans-serif' },
    h3: { fontSize: "$3", lineHeight: "$4", margin: '$4 0 $2 0', fontWeight: "$max", fontFamily: 'Inter, Helvetica, sans-serif' },
    h4: { fontSize: "$4", lineHeight: "$3", margin: '$4 0 $2 0', fontWeight: "$max", fontFamily: 'Inter, Helvetica, sans-serif' },
    h5: { fontSize: "$5", lineHeight: "$2", margin: '$4 0 $2 0', fontWeight: "$max", fontFamily: 'Inter, Helvetica, sans-serif' },
    p: { fontSize: "$p", lineHeight: "$p", margin: '$2 0', fontWeight: "300" },
    span: { fontSize: "$p", lineHeight: "$p", fontWeight: "300" },
    b: {
        fontWeight: "$max",
        fontSize: 'inherit'
    },
    i: {
        fontSize: 'inherit'
    },
    strong: {
        fontWeight: "$max",
        fontSize: 'inherit'
    },
    hr: {
        border: 0,
        height: "1px",
        margin: "0",
        padding: "0",
    },
    a: {
        color: '$text'
    },
    '@font-face': [
        //     {
        //     fontFamily: 'Satoshi-Variable',
        //     src:
        //         "url('/fonts/fonts/Satoshi-Variable.woff2') format('woff2')," +
        //         "url('/fonts/fonts/Satoshi-Variable.woff') format('woff')," +
        //         "url('/fonts/fonts/Satoshi-Variable.ttf') format('truetype')",
        //     fontWeight: '300 900',
        //     fontDisplay: 'swap',
        //     fontStyle: 'normal'
        // },
        {
            fontFamily: 'Inter',
            src:
                "url('/fonts/fonts/Inter-Regular.woff2') format('woff2')," +
                "url('/fonts/fonts/Inter-Regular.woff') format('woff')," +
                "url('/fonts/fonts/Inter-Regular.ttf') format('truetype')",
            fontWeight: '300',
            fontDisplay: 'swap',
            fontStyle: 'normal'
        },
    ],
});


export const dialogShow = keyframes({
    '0%': { opacity: 0, transform: 'translate(-50%, -50%) scale(1.1)' },
    '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)', }
})

export const overlayShow = keyframes({
    '0%': { opacity: 0 },
    '100%': { opacity: 0.65 },
});

export const searchShow = keyframes({
    '0%': { opacity: 0, transform: 'translate(-50%, 0%) scale(1.1)' },
    '100%': { opacity: 1, transform: 'translate(-50%, 0%) scale(1)', }
})

export const contentShow = keyframes({
    '0%': { opacity: 0, transform: `translate(0%, -100%)` },
    '100%': { opacity: 1, transform: `translate(0%, 0%)` }
})