// Colour schemes available for isomer

export type IsomerBaseColorScheme = "purple"

// We are not using all the shades of the base colour scheme,
// but this is placed here if we need them in the future.
export const baseColourMapping: {
  [k in IsomerBaseColorScheme]: NestedRecord
} = {
  purple: {
    50: "#FBF8FF",
    100: "#EFE7FF",
    200: "#C9B3FF",
    300: "#AA90FA",
    400: "#8C73DB",
    500: "#6D58BB",
    600: "#5543A4",
    700: "#493897",
    800: "#3B2E8A",
    900: "#271E78",
  },
}

// There aren't any more because it should default to design system's
export type IsomerColorScheme =
  | "primary"
  | "secondary"
  | "text"
  | "icon"
  | "background"
  | "border"
  | "base"
  | "interaction"

type BaseRecord = Record<string, string> | NestedRecord | string

interface NestedRecord {
  [x: string]: BaseRecord
}

export const colours: { [k in IsomerColorScheme]: NestedRecord } = {
  primary: {
    50: "#F8FAFE",
    100: "#E6EFFE",
    200: "#ADC9FA",
    300: "#7CA9F7",
    400: "#4A89F4",
    500: "#2164DA",
    600: "#1552BC",
    700: "#1248A4",
    800: "#103E8F",
    900: "#0C2E6A",
  },
  secondary: {
    50: "#FBF8FF",
    100: "#EFE7FF",
    200: "#C9B3FF",
    300: "#AA90FA",
    400: "#8C73DB",
    500: "#6D58BB",
    600: "#5543A4",
    700: "#493897",
    800: "#3B2E8A",
    900: "#271E78",
  },
  text: {
    body: "#3D3D3D",
    inverse: "#FFFFFF",
    label: "#2E2E2E",
    helper: "#848484",
    placeholder: "#A0A0A0",
    description: "#474747",
    danger: "#C03434",
    success: "#00774E",
    title: {
      brand: "#2164DA",
      brandSecondary: "#3C4764",
      alt: "#2E2E2E",
    },
    link: {
      disabled: "#A0A0A0",
      default: "#2164DA",
      hover: "#0D4FCA",
      dark: "#3D3D3D",
    },
  },
  base: {
    canvas: {
      brandLight: "#F8FAFE",
      purpleSubtle: baseColourMapping.purple[50],
    },
    content: {
      default: "#3C4764",
      dark: "#272D41",
      light: "#848484",
    },
    divider: {
      medium: "#E9E9E9",
    },
  },
  icon: {
    warning: "#E2B73E",
    default: "#276EF1",
    alt: "#686868",
    danger: "#C03434",
  },
  background: {
    action: {
      default: "#2164DA",
      success: "#00774E",
      defaultInverse: "#FFFFFF",
      warningInverse: "#FFFAE1",
      alt: "#5D6785",
      altInverse: "#F8F9FA",
      infoInverse: "#F7F9FE",
      warning: "#FFEA78",
    },
  },
  border: {
    input: {
      default: "#BFBFBF",
    },
    action: {
      default: "#276EF1",
      light: "#E9E9E9",
    },
    divider: {
      alt: "#E9E9E9",
      active: "#276EF1",
      disabled: "#BFBFBF",
    },
  },
  interaction: {
    mainLight: {
      default: "#F8FAFE",
    },
    support: {
      disabled: "#A0A0A0",
    },
  },
}
