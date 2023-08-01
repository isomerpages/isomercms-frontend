import { VStack, FormControl, Box, Text } from "@chakra-ui/react"
import { FormLabel, Link } from "@opengovsg/design-system-react"

import { FormTitle } from "components/Form"

import { Section, SectionHeader } from "layouts/components"

import { SettingsFormFieldMedia } from "./components/SettingsFormFieldMedia"

interface LogoSettingsProp {
  isError: boolean
}

export const LogoSettings = ({ isError }: LogoSettingsProp): JSX.Element => {
  return (
    <Section id="logo-fields">
      <SectionHeader label="Logos" />
      <VStack spacing="1.5rem" align="flex-start" w="50%">
        <FormControl isDisabled={isError} isRequired>
          <VStack spacing="0.75rem" align="flex-start" w="100%">
            <Box>
              <FormTitle>Agency logo</FormTitle>
              <FormLabel.Description color="text.description">
                {/* NOTE: See here: https://github.com/opengovsg/design-system/issues/440
                 * for why this is required
                 */}
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                <Text>
                  Logo that displays on your navigation bar. Clicking on the
                  logo will also bring the user to the homepage by default.{" "}
                  <Link
                    isExternal
                    href="https://guide.isomer.gov.sg/guide/settings"
                  >
                    Learn more
                  </Link>
                </Text>
              </FormLabel.Description>
            </Box>
            <SettingsFormFieldMedia name="agencyLogo" isDisabled={isError} />
          </VStack>
        </FormControl>
        <FormControl isDisabled={isError} isRequired>
          <VStack spacing="0.75rem" align="flex-start" w="100%">
            <Box>
              <FormTitle>Favicon</FormTitle>
              <FormLabel.Description color="text.description">
                {/* NOTE: See here: https://github.com/opengovsg/design-system/issues/440
                 * for why this is required
                 */}
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                <Text>
                  This is the tiny icon that appears on browser tabs.{" "}
                  <Link
                    isExternal
                    href="https://guide.isomer.gov.sg/guide/settings"
                  >
                    Learn more
                  </Link>
                </Text>
              </FormLabel.Description>
            </Box>
            <SettingsFormFieldMedia name="favicon" isDisabled={isError} />
          </VStack>
        </FormControl>
      </VStack>
    </Section>
  )
}
