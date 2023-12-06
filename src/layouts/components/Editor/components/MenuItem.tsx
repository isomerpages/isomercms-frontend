import { Icon, Tooltip } from "@chakra-ui/react"
import { IconButton } from "@opengovsg/design-system-react"
import { MouseEventHandler } from "react"
import { IconType } from "react-icons/lib"

interface MenuItemProps {
  icon?: IconType
  title?: string
  action?: MouseEventHandler<HTMLButtonElement>
  isActive?: null | (() => boolean)
  isRound?: boolean
}

export const MenuItem = ({
  icon,
  title,
  action,
  isRound,
  isActive = null,
}: MenuItemProps) => (
  // NOTE: Delay opening by 500ms
  <Tooltip label={title || "divider"} hasArrow openDelay={500}>
    <IconButton
      _hover={{ bg: "gray.100" }}
      _active={{ bg: "gray.200" }}
      onClick={action}
      bgColor={isActive && isActive() ? "gray.200" : "transparent"}
      border="none"
      h="1.75rem"
      w="1.75rem"
      minH="1.75rem"
      minW="1.75rem"
      p="0.25rem"
      aria-label={title || "divider"}
      isRound={isRound}
    >
      <Icon as={icon} fontSize="1.25rem" color="base.content.medium" />
    </IconButton>
  </Tooltip>
)
