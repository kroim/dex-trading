import { transparentize } from 'polished'
import React, { useMemo } from 'react'
import styled, {
  ThemeProvider as StyledComponentsThemeProvider,
  createGlobalStyle,
  css,
  DefaultTheme
} from 'styled-components'
import { useIsDarkMode } from '../state/user/hooks'
import { Text, TextProps } from 'rebass'
import { Colors } from './styled'

export * from './components'

const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 600,
  upToMedium: 960,
  upToLarge: 1280
}

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    ; (accumulator as any)[size] = (a: any, b: any, c: any) => css`
      @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
        ${css(a, b, c)}
      }
    `
    return accumulator
  },
  {}
) as any

const white = '#FFFFFF'
const black = '#000000'

export function colors(darkMode: boolean): Colors {
  return {
    // base
    white,
    black,
    // kroim update
    textColor: '#FFFFFF',
    backgroundColor: darkMode ? '#2b2b2b' : white,
    modalBackground: darkMode ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)',
    inputBackground: darkMode ? '#171717' : white,
    placeholderGray: darkMode ? '#5F5F5F' : '#E1E1E1',
    shadowColor: darkMode ? '#000' : '#2F80ED',
    concreteGray: darkMode ? '#222222' : '#FAFAFA',
    mercuryGray: darkMode ? '#333333' : '#E1E1E1',
    silverGray: darkMode ? '#737373' : '#C4C4C4',
    chaliceGray: darkMode ? '#7B7B7B' : '#AEAEAE',
    doveGray: darkMode ? '#C4C4C4' : '#737373',
    mineshaftGray: darkMode ? '#E1E1E1' : '#2B2B2B',
    buttonOutlineGrey: darkMode ? '#FAFAFA' : '#F2F2F2',
    tokenRowHover: darkMode ? '#404040' : '#F2F2F2',
    charcoalBlack: darkMode ? '#F2F2F2' : '#404040',
    zumthorBlue: darkMode ? '#262626' : '#eeffeb',
    malibuGreen: darkMode ? '#8c0a0a' : '#01796f',
    royalGreen: darkMode ? '#8c0a0a' : '#01796f',
    loadingBlue: darkMode ? '#e4f0ff' : '#e4f0ff',
    wisteriaPurple: darkMode ? '#8c0a0a' : '#01796f',
    salmonRed: '#FF6871',
    pizazzOrange: '#FF8F05',
    warningYellow: '#FFE270',
    uniswapPink: darkMode ? '#8c0a0a' : '#01796f',
    // connectedGreen: '#27AE60',
    // text
    text1: darkMode ? '#FFFFFF' : '#000000',
    text2: darkMode ? '#C3C5CB' : '#565A69',
    text3: darkMode ? '#6C7284' : '#888D9B',
    text4: darkMode ? '#565A69' : '#C3C5CB',
    text5: darkMode ? '#2C2F36' : '#EDEEF2',

    // backgrounds / greys
    bg1: darkMode ? '#1e2841' : '#FFFFFF',
    // bg1: darkMode ? '#212429' : '#FFFFFF',
    //bg2: darkMode ? '#2C2F36' : '#F7F8FA',
    bg2: darkMode ? 'rgba(115,127,146, 90)' : '#F7F8FA',
    bg3: darkMode ? '#40444F' : '#EDEEF2',
    bg4: darkMode ? '#565A69' : '#CED0D9',
    bg5: darkMode ? '#565A69' : '#888D9B',

    //specialty colors
    modalBG: darkMode ? 'rgba(0,0,0,42.5)' : 'rgba(0,0,0,0.3)',
    advancedBG: darkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.6)',

    //primary colors
    // primary1: darkMode ? '#2172E5' : '#FFBB00',
    // primary2: darkMode ? '#3680E7' : '#FFE08C',
    // primary3: darkMode ? '#4D8FEA' : '#F2CB61',
    // primary4: darkMode ? '#376bad70' : '#FFE08C',
    // primary5: darkMode ? '#153d6f70' : '#FAECC5',
    primary1: darkMode ? '#2172E5' : '#A2030E',
    primary2: darkMode ? '#3680E7' : '#e39fa3',
    primary3: darkMode ? '#4D8FEA' : '#c43b44',
    primary4: darkMode ? '#376bad70' : '#e39fa3',
    primary5: darkMode ? '#153d6f70' : '#f2e4e5',

    // color text
    primaryText1: darkMode ? '#6da8ff' : '#A2030E',

    // secondary colors
    secondary1: darkMode ? '#2172E5' : '#A2030E',
    secondary2: darkMode ? '#17000b26' : '#e39fa3',
    secondary3: darkMode ? '#17000b26' : '#f2e4e5',

    // other
    red1: '#FF6871',
    red2: '#F82D3A',
    green1: '#27AE60',
    yellow1: '#FFE270',
    yellow2: '#F3841E'

    // dont wanna forget these blue yet
    // blue4: darkMode ? '#153d6f70' : '#C4D9F8',
    // blue5: darkMode ? '#153d6f70' : '#EBF4FF',
  }
}

export function theme(darkMode: boolean): DefaultTheme {
  return {
    ...colors(darkMode),

    grids: {
      sm: 8,
      md: 12,
      lg: 24
    },

    //shadows
    shadow1: darkMode ? '#000' : '#2F80ED',

    // media queries
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useIsDarkMode()

  const themeObject = useMemo(() => theme(darkMode), [darkMode])

  return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>
}

const TextWrapper = styled(Text) <{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`

export const TYPE = {
  main(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text2'} {...props} />
  },
  link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  black(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />
  },
  body(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} color={'text1'} {...props} />
  },
  largeHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} {...props} />
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={20} {...props} />
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} {...props} />
  },
  blue(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  yellow(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'yellow1'} {...props} />
  },
  darkGray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text3'} {...props} />
  },
  gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'bg3'} {...props} />
  },
  italic(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={12} fontStyle={'italic'} color={'text2'} {...props} />
  },
  error({ error, ...props }: { error: boolean } & TextProps) {
    return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props} />
  }
}

export const FixedGlobalStyle = createGlobalStyle`
html, input, textarea, button {
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.018em;
  font-display: fallback;
}
@supports (font-variation-settings: normal) {
  html, input, textarea, button {
    font-family: 'Inter var', sans-serif;
  }
}

html,
body {
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}

button {
  user-select: none;
}

html {
  font-size: 16px;
  font-variant: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
`

export const ThemedGlobalStyle = createGlobalStyle`
html {
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg2};
}

body {
  min-height: 100vh;
  background-position: 0 -30vh;
  background-repeat: no-repeat;
  background-image: ${({ theme }) =>
    `radial-gradient(50% 50% at 50% 50%, ${transparentize(0.9, theme.primary1)} 0%, ${transparentize(
      1,
      theme.bg1
    )} 100%)`};
}
`
// kroim update
export const BorderlessInput = styled.input`
  color: ${({ theme }) => theme.white};
  font-size: 1rem;
  outline: none;
  border: none;
  flex: 1 1 auto;
  width: 0;
  background-color: '#2b2b2b';

  [type='number'] {
    -moz-appearance: textfield;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.green1};
  }
`
