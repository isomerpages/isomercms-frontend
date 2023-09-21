import {
  Box,
  HStack,
  Icon,
  MenuItemProps,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverProps,
  PopoverTrigger,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Menu, MenuButtonProps } from "@opengovsg/design-system-react"
import { PropsWithChildren } from "react"
import { BiPlus } from "react-icons/bi"

type AddSectionButtonProps = MenuButtonProps & {
  buttonText?: string
}

export const AddSectionButton = ({
  buttonText,
  children,
  ...rest
}: AddSectionButtonProps) => {
  return (
    <Menu isStretch>
      {({ isOpen }) => (
        <>
          <Menu.Button
            variant="outline"
            isStretch
            isOpen={isOpen}
            rightIcon={undefined}
            size="lg"
            {...rest}
          >
            <HStack spacing="0.5rem" justify="center">
              <Icon as={BiPlus} fontSize="1.5rem" />
              <Text>{buttonText || "Add section"}</Text>
            </HStack>
          </Menu.Button>
          {children}
        </>
      )}
    </Menu>
  )
}

export interface AddSectionButtonOptionProps extends MenuItemProps {
  title: string
  subtitle: string
}
const AddSectionButtonOption = ({
  title,
  subtitle,
  ...rest
}: AddSectionButtonOptionProps) => {
  return (
    <Menu.Item flexDir="column" alignItems="flex-start" {...rest}>
      <Text textStyle="body-1">{title}</Text>
      <Text textColor="base.content.medium" textStyle="body-2">
        {subtitle}
      </Text>
    </Menu.Item>
  )
}

export interface HelpOverlayProps
  extends Omit<PopoverProps, "children">,
    PropsWithChildren {
  title: string
  description: string
  image?: JSX.Element
}
const HelpOverlay = ({
  title,
  description,
  image,
  children,
  ...rest
}: HelpOverlayProps) => {
  return (
    <Popover
      placement="end"
      trigger="hover"
      arrowSize={16}
      offset={[0, 11]}
      {...rest}
    >
      <PopoverTrigger>
        <Box>{children}</Box>
      </PopoverTrigger>
      {/* Portal is needed to avoid PopoverArrow from jumping around */}
      <Portal>
        <PopoverContent p="0.75rem">
          <PopoverArrow />
          <PopoverBody>
            <VStack align="left">
              {image && <Box pb="1.5rem">{image}</Box>}
              <Text textStyle="subhead-1">{title}</Text>
              <Text textStyle="body-1">{description}</Text>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

AddSectionButton.Option = AddSectionButtonOption
AddSectionButton.List = Menu.List
AddSectionButton.HelpOverlay = HelpOverlay
