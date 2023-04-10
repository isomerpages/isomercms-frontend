import { VStack, FormControl, Link } from "@chakra-ui/react"
import { FormLabel, Input } from "@opengovsg/design-system-react"
import { useFormContext } from "react-hook-form"
import { BiInfoCircle } from "react-icons/bi"

import { Section, SectionHeader, SectionCaption } from "layouts/components"

interface AnalyticsSettingsProp {
  isError: boolean
}

export const AnalyticsSettings = ({
  isError,
}: AnalyticsSettingsProp): JSX.Element => {
  const { register } = useFormContext()
  return (
    <Section id="analytics-fields">
      <VStack align="flex-start" spacing="0.5rem">
        <SectionHeader label="Analytics" />
        <SectionCaption label="" icon={BiInfoCircle}>
          For Analytics set up, refer to our guide{" "}
          <Link
            href="https://guide.isomer.gov.sg/analytics-and-tracking/google-analytics"
            isExternal
          >
            here
          </Link>
        </SectionCaption>
      </VStack>
      <VStack spacing="1.5rem" align="flex-start" w="50%">
        <FormControl isDisabled={isError}>
          <FormLabel>Facebook Pixel</FormLabel>
          <Input w="100%" {...register("pixel")} />
        </FormControl>

        <FormControl isDisabled={isError}>
          <FormLabel>Google Analytics (UA)</FormLabel>
          <SectionCaption label="" icon={BiInfoCircle}>
            This field will be removed following the deprecation of Universal
            Analytics on 1 July 2023.{" "}
            <Link
              href="https://support.google.com/analytics/answer/11583528?hl=en"
              isExternal
            >
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
