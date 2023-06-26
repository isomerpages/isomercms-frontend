import {
  VStack,
  FormControl,
  Box,
  Input,
  Flex,
  InputGroup,
  Icon,
  InputRightElement,
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
  const [hasCopied, setHasCopied] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)

  const isPrivatised = watch("privatiseStaging")

  useEffect(() => {
    // Generate a default password on toggle if no password exists
    if (!getValues("password")) {
      const newPassword = generatePassword()
      setValue("password", newPassword)
      trigger("password")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPrivatised])

  return (
    <Section id="privacy-fields">
      <SectionHeader label="Privacy Settings" />
      <VStack spacing="1.5rem" align="flex-start" w="50%">
        <FormControl isDisabled={isError}>
          <Flex justifyContent="space-between" w="100%">
            <FormLabel isRequired>Privatise staging site</FormLabel>
            {/* NOTE: This should be toggle from design system
                but the component is broken and doesn't display a slider */}
            <FormToggle name="privatiseStaging" />
          </Flex>
          <FormLabel.Description color="text.description">
            Password protect access to your staging site without affecting your
            live site.
          </FormLabel.Description>
        </FormControl>
        {watch("privatiseStaging") && (
          <VStack spacing="0.75rem" align="flex-start" w="100%">
            <Box>
              <FormLabel isRequired>Username</FormLabel>
              <FormLabel.Description color="text.description">
                This cannot be changed.
              </FormLabel.Description>
            </Box>
            <Input isDisabled placeholder="user" />
            <Box>
              <FormLabel isRequired>Password</FormLabel>
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
                      setHasCopied(false)
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
                        onClick={() => {
                          navigator.clipboard.writeText(getValues("password"))
                          setHasCopied(true)
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
                          Link copied!
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
