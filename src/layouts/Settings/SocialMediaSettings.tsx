import { VStack, FormControl } from "@chakra-ui/react"
import {
  FormErrorMessage,
  FormLabel,
  Input,
} from "@opengovsg/design-system-react"
import { upperFirst } from "lodash"
import { useFormContext, useFormState } from "react-hook-form"

import { Section, SectionHeader } from "layouts/components"

import { URL_REGEX_PREFIX, URL_REGEX_SUFFIX } from "utils/validators"

interface SocialMediaSettingsProp {
  isError: boolean
}

export const SocialMediaSettings = ({
  isError,
}: SocialMediaSettingsProp): JSX.Element => {
  return (
    <Section id="general-fields">
      <SectionHeader label="Social Media" />
      <VStack spacing="1.5rem" align="flex-start" w="50%">
        {[
          "facebook",
          "twitter",
          "youtube",
          "instagram",
          "linkedin",
          "telegram",
          "tiktok",
        ].map((label) => (
          <ValidatedFormInput label={label} isError={isError} />
        ))}
      </VStack>
    </Section>
  )
}
interface ValidatedFormInputProps {
  label: string
  isError: boolean
}

// Helper component for social media as this is the only validated input
const ValidatedFormInput = ({ label, isError }: ValidatedFormInputProps) => {
  const displayedLabel = upperFirst(label)
  const { register } = useFormContext()
  const { errors } = useFormState()
  const isInvalid =
    errors.socialMediaContent && !!errors.socialMediaContent[label]

  return (
    <FormControl isDisabled={isError} isInvalid={isInvalid}>
      <FormLabel>{displayedLabel}</FormLabel>
      <Input
        w="100%"
        id="title"
        {...register(`socialMediaContent.${label}`, {
          pattern: RegExp(`${URL_REGEX_PREFIX}${label}${URL_REGEX_SUFFIX}`),
        })}
      />
      <FormErrorMessage>
        {`The URL you have entered is not a valid ${displayedLabel} URL`}
      </FormErrorMessage>
    </FormControl>
  )
}
