import { VStack, FormControl, Flex, Switch } from "@chakra-ui/react"
import { FormLabel, Input } from "@opengovsg/design-system-react"
import { upperFirst } from "lodash"
import { useFormContext } from "react-hook-form"

import { Section, SectionHeader } from "layouts/components"

interface FooterSettingsProp {
  isError: boolean
}

export const FooterSettings = ({
  isError,
}: FooterSettingsProp): JSX.Element => {
  const { register } = useFormContext()
  return (
    <Section id="general-fields">
      <SectionHeader label="Footer" />
      <VStack spacing="1.5rem" align="flex-start" w="50%">
        {["contact", "feedback", "faq"].map((label) => {
          return (
            <FormControl isDisabled={isError}>
              <FormLabel>{upperFirst(label)}</FormLabel>
              <Input
                w="100%"
                id="title"
                placeholder="https://"
                {...register(label)}
              />
            </FormControl>
          )
        })}
        <FormControl isDisabled={isError}>
          <Flex justifyContent="space-between" w="100%">
            <FormLabel>Show REACH</FormLabel>
            {/* NOTE: This should be toggle from design system but the component is 
                broken and doesn't display a slider */}
            <Switch colorScheme="primary" {...register("showReach")} />
          </Flex>
        </FormControl>
      </VStack>
    </Section>
  )
}
