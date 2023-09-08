import {
  FormControl,
  Flex,
  Icon,
  Text,
  Box,
  Divider,
  VStack,
  HStack,
  Spacer,
} from "@chakra-ui/react"
import {
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  Radio,
  SingleSelect,
} from "@opengovsg/design-system-react"
import _ from "lodash"
import { useState } from "react"
import { BiInfoCircle } from "react-icons/bi"

import { FormContext, FormError, FormTitle } from "components/Form"
import FormFieldMedia from "components/FormFieldMedia"

import { useEditableContext } from "contexts/EditableContext"

import { Editable } from "layouts/components/Editable"

import { HighlightOption } from "types/homepage"

import { HeroDropdownFormFields } from "./HeroDropdownSection"

type HeroHighlightSectionFormFields = HighlightOption

type HeroSectionType = "highlights" | "dropdown"

export interface HeroBodyFormFields {
  title: string
  subtitle: string
  background: string
}

const HERO_LAYOUTS = {
  CENTERED: {
    value: "center",
    label: "Centre-aligned text",
  },
  IMAGE_ONLY: {
    value: "image",
    label: "Image only",
  },
  SIDE_SECTION: {
    value: "side",
    label: "Side section",
  },
} as const

interface HeroCenteredLayoutProps extends HeroBodyFormFields {
  index: number
  errors: {
    title: string
    subtitle: string
    background: string
  } & HeroBodyFormFields
}

const HeroCenteredLayout = ({
  title,
  subtitle,
  background,
  index,
  errors,
}: HeroCenteredLayoutProps) => {
  const { onChange } = useEditableContext()
  return (
    <>
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
      <Box w="100%">
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
    </>
  )
}

const HeroImageOnlyLayout = ({
  errors,
  background,
  index,
}: Omit<HeroCenteredLayoutProps, "subtitle" | "title">) => {
  const { onChange } = useEditableContext()
  return (
    <Box w="100%">
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
  )
}

type SectionSize = "half" | "one-third"

type SectionAlignment = "left" | "right"

type SectionBackgroundColor = "black" | "white" | "translucent gray"

interface HeroSideSectionProps extends HeroCenteredLayoutProps {
  background: string
  index: number
  errors: {
    title: string
    subtitle: string
    background: string
  } & HeroBodyFormFields
  size: SectionSize
  alignment: SectionAlignment
  backgroundColor: SectionBackgroundColor
}

const HeroSideSectionLayout = ({
  background,
  index,
  errors,
  title,
  subtitle,
  size = "half",
  alignment = "left",
  backgroundColor = "black",
}: HeroSideSectionProps) => {
  const [, setSectionSize] = useState(size)
  const [, setSectionAlignment] = useState(alignment)
  const [, setSectionBackgroundColor] = useState(backgroundColor)

  return (
    <>
      <HeroCenteredLayout
        index={index}
        background={background}
        errors={errors}
        title={title}
        subtitle={subtitle}
      />
      <Box>
        <Text textStyle="subhead-1">Section size</Text>
        <Radio.RadioGroup
          onChange={(nextSectionSize) => {
            setSectionSize(nextSectionSize as SectionSize)
          }}
          defaultValue="half"
        >
          <HStack spacing="0.5rem">
            <Radio value="half" size="xs" w="50%" allowDeselect={false}>
              Half (1/2) of banner
            </Radio>
            <Spacer />
            <Radio value="one-third" size="xs" w="50%" allowDeselect={false}>
              Third (1/3) of banner
            </Radio>
          </HStack>
        </Radio.RadioGroup>
      </Box>
      <Box w="100%">
        <Text textStyle="subhead-1">Alignment</Text>
        <Radio.RadioGroup
          onChange={(nextSectionAlignment) => {
            setSectionAlignment(nextSectionAlignment as SectionAlignment)
          }}
          defaultValue="left"
        >
          <HStack spacing="0.5rem">
            <Radio value="left" size="xs" w="50%" allowDeselect={false}>
              Left
            </Radio>
            <Spacer />
            <Radio value="right" size="xs" w="50%" allowDeselect={false}>
              Right
            </Radio>
          </HStack>
        </Radio.RadioGroup>
      </Box>
      <Box w="100%">
        <Text textStyle="subhead-1">Section background colour</Text>
        <HStack spacing="0.75rem" alignItems="flex-start">
          <IconButton
            aria-label="black background"
            border="1px solid"
            borderColor="border.input.default"
            bg="black"
            colorScheme="black"
            isRound
            size="sm"
            onClick={() => setSectionBackgroundColor("black")}
            _focus={{
              boxShadow: "0 0 0 2px var(--chakra-colors-border-action-default)",
            }}
          >
            <Icon as={BiInfoCircle} fill="black" fontSize="1rem" />
          </IconButton>
          <IconButton
            border="1px solid"
            borderColor="border.input.default"
            bg="white"
            colorScheme="white"
            isRound
            size="sm"
            aria-label="white background"
            _focus={{
              boxShadow: "0 0 0 2px var(--chakra-colors-border-action-default)",
            }}
            onClick={() => setSectionBackgroundColor("white")}
          >
            <Icon as={BiInfoCircle} fill="white" fontSize="1rem" />
          </IconButton>
          <IconButton
            border="1px solid"
            borderColor="border.input.default"
            aria-label="gray background"
            bg="gray"
            colorScheme="grey"
            isRound
            size="sm"
            _focus={{
              boxShadow: "0 0 0 2px var(--chakra-colors-border-action-default)",
            }}
            onClick={() => setSectionBackgroundColor("translucent gray")}
          />
        </HStack>
      </Box>
    </>
  )
}

type HeroBannerLayouts = typeof HERO_LAYOUTS[keyof typeof HERO_LAYOUTS]["value"]

interface HeroLayoutFormProps {
  children: (props: {
    currentSelectedOption: HeroBannerLayouts
  }) => React.ReactNode
}

const HeroLayoutForm = ({ children }: HeroLayoutFormProps): JSX.Element => {
  const [currentLayout, setCurrentLayout] = useState<HeroBannerLayouts>(
    HERO_LAYOUTS.CENTERED.value
  )

  return (
    <>
      <FormControl isRequired>
        <FormLabel textStyle="subhead-1">Layout</FormLabel>
        <SingleSelect
          isClearable={false}
          name="hero layout options"
          value={currentLayout}
          items={_.values(HERO_LAYOUTS)}
          // NOTE: Safe cast - the possible values are given by `HERO_LAYOUTS`
          onChange={(val) => setCurrentLayout(val as HeroBannerLayouts)}
        />
      </FormControl>
      <VStack spacing="1rem" w="100%">
        {children({ currentSelectedOption: currentLayout })}
      </VStack>
    </>
  )
}

interface HeroBodyProps extends HeroBodyFormFields {
  index: number
  errors: {
    dropdownElems: HeroDropdownFormFields[]
    highlights: HeroHighlightSectionFormFields[]
    dropdown: string
    button: string
    url: string
  } & HeroBodyFormFields
  handleHighlightDropdownToggle: (event: Record<string, unknown>) => void
  notification: string
  children: (props: {
    currentSelectedOption: HeroSectionType
  }) => React.ReactNode
  initialSectionType: HeroSectionType
}

export const HeroBody = ({
  handleHighlightDropdownToggle,
  notification,
  children,
  initialSectionType,
  ...rest
}: HeroBodyProps) => {
  const [heroSectionType, setHeroSectionType] = useState<HeroSectionType>(
    initialSectionType
  )
  const { onChange } = useEditableContext()

  return (
    <>
      <Editable.Section spacing="1.25rem">
        <FormControl isRequired>
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
        <Divider my="0.25rem" />
        <HeroLayoutForm>
          {({ currentSelectedOption }) => {
            if (currentSelectedOption === HERO_LAYOUTS.CENTERED.value) {
              return <HeroCenteredLayout {...rest} />
            }

            if (currentSelectedOption === HERO_LAYOUTS.IMAGE_ONLY.value) {
              return <HeroImageOnlyLayout {...rest} />
            }

            if (currentSelectedOption === HERO_LAYOUTS.SIDE_SECTION.value) {
              return (
                <HeroSideSectionLayout
                  {...rest}
                  size="half"
                  alignment="left"
                  backgroundColor="black"
                />
              )
            }

            const unmatchedOption: never = currentSelectedOption
            throw new Error(`Unmatched option for layout: ${unmatchedOption}`)
          }}
        </HeroLayoutForm>
      </Editable.Section>
      <Divider my="1.5rem" />
      <Editable.Section spacing="0.75rem">
        <Box w="100%">
          <Text textStyle="h5" mb="1rem">
            Customise Layout
          </Text>
          <Radio.RadioGroup
            onChange={(nextSectionType: HeroSectionType) => {
              setHeroSectionType(nextSectionType)
              handleHighlightDropdownToggle({
                target: {
                  value: nextSectionType,
                },
              })
            }}
            defaultValue={initialSectionType}
          >
            <HStack spacing="1rem" w="100%">
              <Radio value="highlights" size="xs" w="50%" allowDeselect={false}>
                Button + Highlights
              </Radio>
              <Radio value="dropdown" size="xs" w="50%" allowDeselect={false}>
                Dropdown
              </Radio>
            </HStack>
          </Radio.RadioGroup>
        </Box>

        {children({ currentSelectedOption: heroSectionType })}
      </Editable.Section>
    </>
  )
}
