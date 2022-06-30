// Colour schemes available for isomer
// There aren't any more because it should default to design system's
export type IsomerColorScheme =
  | "primary"
  | "secondary"
  | "text"
  | "icon"
  | "background"
  | "border"

type BaseRecord = Record<string, string> | NestedRecord | string

interface NestedRecord {
  [x: string]: BaseRecord
}

export const colours: { [k in IsomerColorScheme]: NestedRecord } = {
  primary: {
    50: "#FDFEFF",
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
    label: "#2E2E2E",
    helper: "#848484",
    description: "#474747",
    title: {
      brandSecondary: "#3C4764",
    },
    link: {
      disabled: "#A0A0A0",
      default: "#2164DA",
      hover: "#0D4FCA",
    },
  },
  icon: {
    default: "#276EF1",
    alt: "#686868",
  },
  background: {
    action: {
      defaultInverse: "#FFFFFF",
      altInverse: "#F8F9FA",
      infoInverse: "#F7F9FE",
    },
  },
  border: {
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
}
