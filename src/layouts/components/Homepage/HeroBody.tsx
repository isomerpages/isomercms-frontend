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
import { useFeatureIsOn } from "@growthbook/growthbook-react"
import {
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  Radio,
  SingleSelect,
  Tooltip,
} from "@opengovsg/design-system-react"
import _ from "lodash"
import { useState } from "react"
import { BiInfoCircle } from "react-icons/bi"

import { Editable } from "components/Editable"
import { FormContext, FormError, FormTitle } from "components/Form"
import FormFieldMedia from "components/FormFieldMedia"

import { FEATURE_FLAGS } from "constants/featureFlags"
import { HERO_LAYOUTS } from "constants/homepage"

import { useEditableContext } from "contexts/EditableContext"

import { BxGrayTranslucent } from "assets"
import {
  SectionSize,
  SectionAlignment,
  SectionBackgroundColor,
} from "types/hero"
import { HeroBannerLayouts, HighlightOption } from "types/homepage"

import { HeroDropdownFormFields } from "./HeroDropdownSection"

type HeroHighlightSectionFormFields = HighlightOption

type HeroSectionType = "highlights" | "dropdown"

export interface HeroBodyFormFields {
  title: string
  subtitle: string
  background: string
}

const getIconButtonProps = (color: SectionBackgroundColor) => {
  return {
    "aria-label": `${color} background`,
    border: "1px solid",
    borderColor: "border.input.default",
    bg: color === "gray" ? "base.divider.strong" : color,
    colorScheme: color,
    size: "sm",
    isRound: true,
    _focus: {
      boxShadow: "0 0 0 2px var(--chakra-colors-border-action-default)",
    },
    ...(color === "gray" && {
      _hover: {
        bg: "base.divider.strong",
      },
    }),
  }
}

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
          id="section-0-hero-background"
          inlineButtonText="Select"
        />
        <FormError>{errors.background}</FormError>
      </FormContext>
    </Box>
  )
}

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
}

const HeroSideSectionLayout = ({
  background,
  index,
  errors,
  title,
  subtitle,
  size = "50%",
  alignment = "left",
}: HeroSideSectionProps) => {
  const { onChange } = useEditableContext()
  const onIconButtonClick = (value: SectionBackgroundColor) =>
    onChange({
      target: {
        id: "section-0-hero-backgroundColor",
        value,
      },
    })

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
            onChange({
              target: {
                id: "section-0-hero-size",
                value: nextSectionSize,
              },
            })
          }}
          defaultValue={size}
        >
          <HStack spacing="0.5rem">
            <Radio value="50%" size="xs" w="50%" allowDeselect={false}>
              Half (1/2) of banner
            </Radio>
            <Spacer />
            <Radio value="33%" size="xs" w="50%" allowDeselect={false}>
              Third (1/3) of banner
            </Radio>
          </HStack>
        </Radio.RadioGroup>
      </Box>
      <Box w="100%">
        <Text textStyle="subhead-1">Alignment</Text>
        <Radio.RadioGroup
          onChange={(nextSectionAlignment) => {
            onChange({
              target: {
                id: "section-0-hero-alignment",
                value: nextSectionAlignment,
              },
            })
          }}
          defaultValue={alignment}
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
          <Tooltip label="black" hasArrow>
            <IconButton
              {...getIconButtonProps("black")}
              onClick={() => onIconButtonClick("black")}
            >
              <Icon as={BiInfoCircle} fill="black" fontSize="1rem" />
            </IconButton>
          </Tooltip>
          <Tooltip label="white" hasArrow>
            <IconButton
              {...getIconButtonProps("white")}
              onClick={() => onIconButtonClick("white")}
            >
              <Icon as={BiInfoCircle} fill="white" fontSize="1rem" />
            </IconButton>
          </Tooltip>
          <Tooltip label="translucent gray" hasArrow>
            <IconButton
              {...getIconButtonProps("gray")}
              onClick={() => onIconButtonClick("gray")}
              icon={<BxGrayTranslucent />}
            />
          </Tooltip>
        </HStack>
      </Box>
    </>
  )
}

interface HeroLayoutFormProps {
  variant: HeroBannerLayouts
  children: (props: {
    currentSelectedOption: HeroBannerLayouts
  }) => React.ReactNode
}

const HeroLayoutForm = ({
  variant,
  children,
}: HeroLayoutFormProps): JSX.Element => {
  const { onChange } = useEditableContext()
  const showNewLayouts = useFeatureIsOn(FEATURE_FLAGS.HOMEPAGE_TEMPLATES)

  return (
    <VStack spacing="1rem" align="flex-start" w="100%">
      <Text textStyle="h5">{`Customise ${
        showNewLayouts ? "Layout" : "Hero"
      }`}</Text>
      {showNewLayouts && (
        <FormControl isRequired>
          <FormLabel textStyle="subhead-1">Layout</FormLabel>
          <SingleSelect
            isClearable={false}
            name="hero layout options"
            value={variant}
            items={_.values(HERO_LAYOUTS)}
            // NOTE: Safe cast - the possible values are given by `HERO_LAYOUTS`
            onChange={(val) => {
              onChange({
                target: {
                  // NOTE: Format is field type, index, section type, field
                  id: "section-0-hero-variant",
                  value: val as HeroBannerLayouts,
                },
              })
            }}
          />
        </FormControl>
      )}
      <VStack spacing="1rem" w="100%">
        {children({ currentSelectedOption: variant })}
      </VStack>
    </VStack>
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
  variant: HeroBannerLayouts
  size: SectionSize
  alignment: SectionAlignment
}

export const HeroBody = ({
  variant = "center",
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
  const showNewLayouts = useFeatureIsOn(FEATURE_FLAGS.HOMEPAGE_TEMPLATES)

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
        <HeroLayoutForm variant={variant}>
          {({ currentSelectedOption }) => {
            // NOTE: If the flag is turned off, we always show the centered layout
            // as it is the current existing layout.
            if (!showNewLayouts) {
              return <HeroCenteredLayout {...rest} />
            }

            if (currentSelectedOption === HERO_LAYOUTS.CENTERED.value) {
              return <HeroCenteredLayout {...rest} />
            }

            if (currentSelectedOption === HERO_LAYOUTS.IMAGE_ONLY.value) {
              return <HeroImageOnlyLayout {...rest} />
            }

            if (currentSelectedOption === HERO_LAYOUTS.SIDE_SECTION.value) {
              return <HeroSideSectionLayout {...rest} />
            }

            if (currentSelectedOption === HERO_LAYOUTS.FLOATING_SECTION.value) {
              return <HeroSideSectionLayout {...rest} />
            }

            const unmatchedOption: never = currentSelectedOption
            throw new Error(`Unmatched option for layout: ${unmatchedOption}`)
          }}
        </HeroLayoutForm>
      </Editable.Section>
      <Divider my="1.5rem" />
      <Editable.Section spacing="0.75rem">
        <Box w="100%">
          <Text textStyle="h5" mb="0.75rem">
            Hero Interactions
          </Text>
          <Text textStyle="subhead-2" mb="0.25rem">
            Content type
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
