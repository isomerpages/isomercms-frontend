import { IconButton } from "@opengovsg/design-system-react"
import { MouseEventHandler } from "react"
import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg"

interface MenuItemProps {
  icon?: string
  title?: string
  action?: MouseEventHandler<HTMLButtonElement>
  isActive?: null | (() => boolean)
  isRound?: boolean
}

export default ({
  icon,
  title,
  action,
  isRound,
  isActive = null,
}: MenuItemProps) => (
  <IconButton
    _hover={{ bg: "gray.100" }}
    _active={{ bg: "gray.200" }}
    onClick={action}
    title={title}
    bgColor={isActive && isActive() ? "gray.200" : "transparent"}
    border="none"
    h="1.75rem"
    w="1.75rem"
    p="0.25rem"
    aria-label={title || "divider"}
    isRound={isRound}
  >
    <svg className="remix" height="1.25rem" width="1.25rem">
      <use xlinkHref={`${remixiconUrl}#ri-${icon}`} />
    </svg>
  </IconButton>
)