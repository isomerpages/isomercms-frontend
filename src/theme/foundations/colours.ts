// Colour schemes available for isomer
// There aren't any more because it should default to design system's
export type IsomerColorScheme = "primary" | "secondary" | "text" | "icon"

export const colours: { [k in IsomerColorScheme]: Record<string, string> } = {
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
  },
  icon: {
    alt: "#686868",
  },
}
