import { HStack, Icon, MenuItemProps, Text } from "@chakra-ui/react"
import { Menu, MenuButtonProps } from "@opengovsg/design-system-react"
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

AddSectionButton.Option = AddSectionButtonOption
AddSectionButton.List = Menu.List
