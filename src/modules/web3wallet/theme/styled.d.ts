import { FlattenSimpleInterpolation, ThemedCssFunction } from 'styled-components'

export type Color = string
export interface Colors {
  // base
  white: Color
  black: Color

  // kroim update
  textColor: Color,
  backgroundColor: Color,
  modalBackground: Color,
  inputBackground: Color,
  placeholderGray: Color,
  shadowColor: Color,
  concreteGray: Color,
  mercuryGray: Color,
  silverGray: Color,
  chaliceGray: Color,
  doveGray: Color,
  mineshaftGray: Color,
  buttonOutlineGrey: Color,
  tokenRowHover: Color,
  charcoalBlack: Color,
  zumthorBlue: Color,
  malibuGreen: Color,
  royalGreen: Color,
  loadingBlue: Color,
  wisteriaPurple: Color,
  salmonRed: Color,
  pizazzOrange: Color,
  warningYellow: Color,
  uniswapPink: Color,

  // text
  text1: Color
  text2: Color
  text3: Color
  text4: Color
  text5: Color

  // backgrounds / greys
  bg1: Color
  bg2: Color
  bg3: Color
  bg4: Color
  bg5: Color

  modalBG: Color
  advancedBG: Color

  //blues
  primary1: Color
  primary2: Color
  primary3: Color
  primary4: Color
  primary5: Color

  primaryText1: Color

  // pinks
  secondary1: Color
  secondary2: Color
  secondary3: Color

  // other
  red1: Color
  red2: Color
  green1: Color
  yellow1: Color
  yellow2: Color
}

export interface Grids {
  sm: number
  md: number
  lg: number
}

declare module 'styled-components' {
  export interface DefaultTheme extends Colors {
    grids: Grids

    // shadows
    shadow1: string

    // media queries
    mediaWidth: {
      upToExtraSmall: ThemedCssFunction<DefaultTheme>
      upToSmall: ThemedCssFunction<DefaultTheme>
      upToMedium: ThemedCssFunction<DefaultTheme>
      upToLarge: ThemedCssFunction<DefaultTheme>
    }

    // css snippets
    flexColumnNoWrap: FlattenSimpleInterpolation
    flexRowNoWrap: FlattenSimpleInterpolation
  }
}
