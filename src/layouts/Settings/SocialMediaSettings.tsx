import { VStack, FormControl } from "@chakra-ui/react"
import {
  FormErrorMessage,
  FormLabel,
  Input,
} from "@opengovsg/design-system-react"
import { upperFirst } from "lodash"
import { useFormContext, useFormState } from "react-hook-form"
import type { StringKeyOf } from "type-fest"

import { Section, SectionHeader } from "layouts/components"

import {
  URL_REGEX_PREFIX,
  URL_REGEX_SUFFIX,
  TIKTOK_REGEX,
  TELEGRAM_REGEX,
} from "utils/validators"

import { SiteSettings } from "types/settings"

interface SocialMediaField {
  label: StringKeyOf<SiteSettings["socialMediaContent"]>
  placeholder: string
}

const SOCIAL_MEDIA_LABELS: SocialMediaField[] = [
  { label: "facebook", placeholder: "https://www.facebook.com/" },
  { label: "twitter", placeholder: "https://www.twitter.com/" },
  { label: "youtube", placeholder: "https://www.youtube.com/" },
  { label: "instagram", placeholder: "https://www.instagram.com/" },
  { label: "linkedin", placeholder: "https://sg.linkedin.com/" },
  { label: "telegram", placeholder: "https://t.me/" },
  { label: "tiktok", placeholder: "https://www.tiktok.com/" },
]

interface SocialMediaSettingsProp {
  isError: boolean
}

export const SocialMediaSettings = ({
  isError,
}: SocialMediaSettingsProp): JSX.Element => {
  return (
    <Section id="social-media-fields">
      <SectionHeader label="Social Media" />
      <VStack spacing="1.5rem" align="flex-start" w="50%">
        {SOCIAL_MEDIA_LABELS.map(({ label, placeholder }) => (
          <ValidatedFormInput
            label={label}
            isError={isError}
            placeholder={placeholder}
          />
        ))}
      </VStack>
    </Section>
  )
}
interface ValidatedFormInputProps extends SocialMediaField {
  isError: boolean
}

// Helper component for social media as this is the only validated input
const ValidatedFormInput = ({
  label,
  placeholder,
  isError,
}: ValidatedFormInputProps) => {
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
        placeholder={placeholder}
        {...register(`socialMediaContent.${label}`, {
          pattern: getRegExp(label),
        })}
      />
      <FormErrorMessage>
        {`The URL you have entered is not a valid ${displayedLabel} URL`}
      </FormErrorMessage>
    </FormControl>
  )
}

const getRegExp = (
  label: StringKeyOf<SiteSettings["socialMediaContent"]>
): RegExp => {
  switch (label) {
    case "telegram":
      return RegExp(`${URL_REGEX_PREFIX}${TELEGRAM_REGEX}`)
    case "tiktok":
      return RegExp(`${URL_REGEX_PREFIX}${label}${TIKTOK_REGEX}`)
    default:
      return RegExp(`${URL_REGEX_PREFIX}${label}${URL_REGEX_SUFFIX}`)
  }
}
