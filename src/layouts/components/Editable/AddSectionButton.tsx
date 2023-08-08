import {
  Flex,
  HStack,
  Icon,
  MenuItemProps,
  Text,
  VStack,
} from "@chakra-ui/react"
import {
  ButtonProps,
  Button,
  Menu,
  MenuButtonProps,
} from "@opengovsg/design-system-react"
import { BiPlus } from "react-icons/bi"

export const AddSectionButton = ({ children, ...rest }: MenuButtonProps) => {
  return (
    <Menu isStretch>
      {({ isOpen }) => (
        <>
          <Menu.Button
            variant="outline"
            isStretch
            isOpen={isOpen}
            rightIcon={undefined}
            // NOTE: Need `sx` here as there is styling set on the exported `Menu.Button` component
            // that overrides the `textAlign` prop
            sx={{
              textAlign: "center",
            }}
            {...rest}
          >
            <HStack spacing="0.5rem" justify="center">
              <Icon as={BiPlus} fontSize="1.5rem" />
              <Text>Add section</Text>
            </HStack>
          </Menu.Button>
          <Menu.List>{children}</Menu.List>
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

AddSectionButton.Option = AddSectionButtonOption
AddSectionButton.List = Menu.List
