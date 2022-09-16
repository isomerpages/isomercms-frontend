import { ComponentMultiStyleConfig } from "@chakra-ui/react"

export const Tabs: Pick<ComponentMultiStyleConfig, "variants"> = {
  variants: {
    "line-vertical": (props) => {
      const { orientation } = props
      const borderProp =
        orientation === "vertical" ? "borderStart" : "borderBottom"

      return {
        tablist: {
          // NOTE: The original chakra implementation does a vertical line indicator
          // through having a border of 2px on the tablist.
          // The tabs then have a negative margin of 2px, overlapping this border.
          // On select, the tabs would then activate and have their border colour set.
          // However, this does not seem to work when replicated here (tab borders don't display over tablist).
          // Hence, border colour has been set on tabs rather than tablist
          border: "0px",
        },
        tab: {
          boxSizing: "border-box",
          borderRadius: 0,
          [borderProp]: "2px solid",
          borderColor: "border.divider.disabled",
          textColor: "text.link.disabled",
          py: "1rem",
          _focus: {
            boxShadow: `0 0 0 2px var(--chakra-colors-border-action-default)`,
          },
          _hover: {
            textColor: "text.link.hover",
          },
          _selected: {
            color: "text.link.default",
            borderColor: "border.divider.active",
          },
          _active: {
            bg: "background.action.infoInverse",
          },
          _disabled: {
            _active: { bg: "none" },
          },
        },
      }
    },
  },
}
