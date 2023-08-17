import {
  FormControl,
  Flex,
  Icon,
  Text,
  Box,
  Divider,
  HStack,
} from "@chakra-ui/react"
import {
  FormErrorMessage,
  FormLabel,
  Input,
  Radio,
} from "@opengovsg/design-system-react"
import { useState } from "react"
import { BiInfoCircle } from "react-icons/bi"

import { FormContext, FormError, FormTitle } from "components/Form"
import FormFieldMedia from "components/FormFieldMedia"

import { Editable } from "layouts/components/Editable"

import {
  EditorHeroDropdownSection,
  EditorHomepageState,
  HeroFrontmatterSection,
  HighlightOption,
} from "types/homepage"

import {
  HeroDropdownFormFields,
  HeroDropdownSection,
} from "./HeroDropdownSection"
import { HeroHighlightSection } from "./HeroHighlightSection"

type HeroHighlightSectionFormFields = HighlightOption

export interface HeroBodyFormFields {
  title: string
  subtitle: string
  background: string
  dropdown: HeroDropdownFormFields
}

interface HeroBodyProps extends HeroBodyFormFields {
  index: number
  onChange: () => void
  createHandler: (event: Record<string, unknown>) => void
  deleteHandler: (
    event: {
      target: {
        id: string
      }
    },
    type: "Dropdown Element" | "Highlight"
  ) => void
  errors: {
    dropdownElems: HeroDropdownFormFields[]
    highlights: HeroHighlightSectionFormFields[]
    dropdown: string
    button: string
    url: string
  } & HeroBodyFormFields
  handleHighlightDropdownToggle: (event: Record<string, unknown>) => void
  notification: string
  highlights: Partial<HeroHighlightSectionFormFields>[]
  dropdownElems: EditorHeroDropdownSection
  button: string
  url: string
}

export const HeroBody = ({
  title,
  subtitle,
  dropdown,
  highlights,
  background,
  index,
  button,
  url,
  onChange,
  createHandler,
  deleteHandler,
  errors,
  handleHighlightDropdownToggle,
  notification,
  dropdownElems,
}: HeroBodyProps) => {
  const [heroSectionType, setHeroSectionType] = useState("highlights")
  return (
    <>
      <Editable.Section spacing="1.25rem">
        <FormControl>
          <FormLabel>Notification Banner</FormLabel>
          <Input
            // TODO: Remove the `id/onChange`
            // and change to react hook forms
            id="site-notification"
            onChange={onChange}
            value={notification}
            placeholder="This is a notification banner"
          />
          <Flex flexDir="row" mt="0.75rem" alignItems="center">
            <Icon
              as={BiInfoCircle}
              fill="base.content.brand"
              mr="0.5rem"
              fontSize="1rem"
            />
            <Text textStyle="caption-2">
              Leave this blank if you don&apos;t want the banner to appear
            </Text>
          </Flex>
        </FormControl>
        <FormControl isRequired isInvalid={!!errors.title}>
          <FormLabel>Hero title</FormLabel>
          <Input
            placeholder="Hero title"
            id={`section-${index}-hero-title`}
            value={title}
            onChange={onChange}
          />
          <FormErrorMessage>{errors.title}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={!!errors.subtitle}>
          <FormLabel>Hero subtitle</FormLabel>
          <Input
            placeholder="Hero subtitle"
            id={`section-${index}-hero-subtitle`}
            value={subtitle}
            onChange={onChange}
          />
          <FormErrorMessage>{errors.subtitle}</FormErrorMessage>
        </FormControl>
        <Box>
          {/* TODO: migrate this to design system components */}
          <FormContext
            hasError={!!errors.background}
            onFieldChange={onChange}
            isRequired
          >
            <Box mb="0.5rem">
              <FormTitle>Hero background image</FormTitle>
            </Box>
            <FormFieldMedia
              value={background}
              id={`section-${index}-hero-background`}
              inlineButtonText="Select"
            />
            <FormError>{errors.background}</FormError>
          </FormContext>
        </Box>
      </Editable.Section>
      <Divider my="1.5rem" />
      <Editable.Section spacing="0.75rem">
        <Box>
          <Text textStyle="h5" mb="1rem">
            Customise Layout
          </Text>
          <Radio.RadioGroup
            onChange={(nextSectionType) => {
              setHeroSectionType(nextSectionType)
              handleHighlightDropdownToggle({
                target: {
                  value: nextSectionType,
                },
              })
            }}
            as={HStack}
            defaultValue="highlights"
          >
            <Radio
              value="highlights"
              size="xs"
              w="fit-content"
              allowDeselect={false}
            >
              Button + Highlights
            </Radio>
            <Radio
              value="dropdown"
              size="xs"
              w="fit-content"
              allowDeselect={false}
            >
              Dropdown
            </Radio>
          </Radio.RadioGroup>
        </Box>

        {heroSectionType === "dropdown" ? (
          <HeroDropdownSection
            title={dropdown.title}
            state={dropdownElems}
            errors={errors}
            onCreate={() => createHandler({ target: { id: "dropdownelem" } })}
            onChange={onChange}
            onClick={(event) => deleteHandler(event, "Dropdown Element")}
          />
        ) : (
          <HeroHighlightSection
            onChange={onChange}
            onCreate={() => createHandler({ target: { id: "highlight" } })}
            onClick={(event) => deleteHandler(event, "Highlight")}
            errors={errors}
            button={button}
            url={url}
            highlights={highlights}
          />
        )}
      </Editable.Section>
    </>
  )
}
