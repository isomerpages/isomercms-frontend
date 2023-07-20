import {
  VStack,
  FormControl,
  Box,
  Input,
  Flex,
  InputGroup,
  Icon,
  InputRightElement,
  useClipboard,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Text,
} from "@chakra-ui/react"
import {
  FormErrorMessage,
  FormLabel,
  IconButton,
} from "@opengovsg/design-system-react"
import { FormTitle } from "components/Form"
import { useEffect, useState } from "react"
import { useFormContext, useFormState } from "react-hook-form"
import { BiCopy } from "react-icons/bi"

import { Section, SectionHeader } from "layouts/components"

import { generatePassword } from "utils/password"
import { PASSWORD_REGEX } from "utils/validators"

import { SitePasswordSettings } from "types/settings"

import { FormToggle } from "./components/FormToggle"

interface PrivacySettingsProp {
  isError: boolean
}

export const PrivacySettings = ({
  isError,
}: PrivacySettingsProp): JSX.Element => {
  const { register, trigger, watch, setValue, getValues } = useFormContext()
  const { errors } = useFormState<SitePasswordSettings>()
  const { onCopy, hasCopied } = useClipboard(watch("password"))
  const [isBuffering, setIsBuffering] = useState(false)

  const isPrivatised = watch("isStagingPrivatised")

  const generateAcceptablePassword = () => {
    const regex = new RegExp(PASSWORD_REGEX)
    let password = ""
    while (!regex.test(password)) {
      password = generatePassword()
    }
    return password
  }

  useEffect(() => {
    // Generate a default password on toggle if no password exists
    if (!getValues("password")) {
      const newPassword = generateAcceptablePassword()
      setValue("password", newPassword)
      trigger("password")
    }
  }, [isPrivatised])

  return (
    <Section id="privacy-fields">
      <SectionHeader label="Privacy Settings" />
      <VStack spacing="1.5rem" align="flex-start" w="50%">
        <FormControl isDisabled={isError}>
          <Flex justifyContent="space-between" w="100%">
            <Box>
              <FormTitle>Privatise staging site</FormTitle>
              <FormLabel.Description color="text.description">
                Password protect access to your staging site without affecting
                your live site.
              </FormLabel.Description>
            </Box>

            {/* TODO: Swap out component with Checkbox, along with other toggle components */}
            <FormToggle name="isStagingPrivatised" />
          </Flex>
        </FormControl>
        {watch("isStagingPrivatised") && (
          <VStack spacing="0.75rem" align="flex-start" w="100%">
            <Box>
              <FormTitle>Username</FormTitle>
              <FormLabel.Description color="text.description">
                This cannot be changed.
              </FormLabel.Description>
            </Box>
            <Input isDisabled placeholder="user" />
            <Box>
              <FormTitle>Password</FormTitle>
              <FormLabel.Description color="text.description">
                You should change this every 90 days.
              </FormLabel.Description>
            </Box>
            <FormControl isDisabled={isError} isInvalid={!!errors.password}>
              <InputGroup>
                <Input
                  {...register("password", {
                    required: true,
                    pattern: RegExp(PASSWORD_REGEX),
                    onChange: () => {
                      // Stagger check for password
                      if (!isBuffering) {
                        setIsBuffering(true)
                        setTimeout(() => {
                          setIsBuffering(false)
                          trigger("password")
                        }, 200)
                      }
                    },
                  })}
                />
                <InputRightElement
                  onClick={() => {
                    navigator.clipboard.writeText(getValues("password"))
                  }}
                  _hover={{
                    cursor: "pointer",
                  }}
                >
                  <Popover returnFocusOnClose={false} isOpen={hasCopied}>
                    <PopoverTrigger>
                      <IconButton
                        aria-label="copy password"
                        onClick={onCopy}
                        _focus={{
                          background: "none",
                        }}
                        _hover={{
                          background: "none",
                        }}
                        _active={{
                          background: "none",
                        }}
                        variant="clear"
                      >
                        <Icon
                          as={BiCopy}
                          fontSize="1.25rem"
                          fill="base.content.strong"
                        />
                      </IconButton>
                    </PopoverTrigger>
                    <PopoverContent
                      bg="background.action.alt"
                      _focus={{
                        boxShadow: "none",
                      }}
                      w="fit-content"
                      border="none"
                    >
                      <PopoverArrow bg="background.action.alt" />
                      <PopoverBody>
                        <Text textStyle="body-2" color="text.inverse">
                          Copied!
                        </Text>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>
                {errors.password?.type === "required" &&
                  "Password cannot be left empty"}
                {errors.password?.type === "pattern" &&
                  "Password must be at least 12 characters long, and contain upper and lower case letters, numbers, and special characters"}
              </FormErrorMessage>
            </FormControl>
          </VStack>
        )}
      </VStack>
    </Section>
  )
}
