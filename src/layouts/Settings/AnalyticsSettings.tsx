import { VStack, FormControl, Link } from "@chakra-ui/react"
import {
  FormLabel,
  FormErrorMessage,
  Input,
} from "@opengovsg/design-system-react"
import { useFormContext, useFormState } from "react-hook-form"
import { BiInfoCircle } from "react-icons/bi"

import { ANALYTICS_SETUP_LINK, GA_DEPRECATION_LINK } from "constants/config"

import { Section, SectionHeader, SectionCaption } from "layouts/components"

interface AnalyticsSettingsProp {
  isError: boolean
}

export const AnalyticsSettings = ({
  isError,
}: AnalyticsSettingsProp): JSX.Element => {
  const { register } = useFormContext()
  const { errors } = useFormState()
  const isInvalid = (field: string) => !!errors[field]
  return (
    <Section id="analytics-fields">
      <VStack align="flex-start" spacing="0.5rem">
        <SectionHeader label="Analytics" />
        <SectionCaption icon={BiInfoCircle}>
          For Analytics set up, refer to our guide{" "}
          <Link href={ANALYTICS_SETUP_LINK} isExternal>
            here
          </Link>
        </SectionCaption>
      </VStack>
      <VStack spacing="1.5rem" align="flex-start" w="50%">
        <FormControl isDisabled={isError} isInvalid={isInvalid("pixel")}>
          <FormLabel>Facebook Pixel</FormLabel>
          <Input
            w="100%"
            {...register("pixel", {
              minLength: {
                value: 15,
                message: "Your Facebook Pixel id should be a 15 digit number.",
              },
              maxLength: {
                value: 15,
                message: "Your Facebook Pixel id should be a 15 digit number.",
              },
            })}
          />
          <FormErrorMessage>
            {errors.pixel && errors.pixel.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isDisabled={isError}>
          <FormLabel>Google Analytics (UA)</FormLabel>
          <SectionCaption icon={BiInfoCircle}>
            This field will be removed following the deprecation of Universal
            Analytics on 1 July 2023.{" "}
            <Link href={GA_DEPRECATION_LINK} isExternal>
              Read more
            </Link>
          </SectionCaption>
          <Input isDisabled w="100%" {...register("ga")} />
        </FormControl>

        <FormControl isDisabled={isError}>
          <FormLabel>Google Analytics (GA4)</FormLabel>
          <Input w="100%" {...register("ga4")} />
        </FormControl>

        <FormControl isDisabled={isError}>
          <FormLabel>LinkedIn Insights</FormLabel>
          <Input w="100%" {...register("insights")} />
        </FormControl>
      </VStack>
    </Section>
  )
}
