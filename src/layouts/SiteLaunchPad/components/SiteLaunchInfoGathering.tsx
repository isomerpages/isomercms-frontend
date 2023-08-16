import {
  Box,
  Button,
  Icon,
  Text,
  RadioGroup,
  InputGroup,
  InputLeftAddon,
  HStack,
  FormControl,
} from "@chakra-ui/react"
import {
  Badge,
  FormErrorMessage,
  Input,
  Radio,
} from "@opengovsg/design-system-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { BiRightArrowAlt } from "react-icons/bi"

import { useSiteLaunchContext } from "contexts/SiteLaunchContext"

import { recommendWwwValue } from "utils/site-launch/domain-nature"

import { SiteLaunchPadBody } from "./SiteLaunchPadBody"
import { SiteLaunchPadTitle } from "./SiteLaunchPadTitle"

export const SiteLaunchInfoCollectorTitle = (): JSX.Element => {
  const title = "Tell us more about your domain"
  const subTitle = "This will inform the steps you have to take for launch"
  return <SiteLaunchPadTitle title={title} subTitle={subTitle} />
}

const SiteNature = {
  New: "new",
  Live: "live",
} as const

interface SiteLaunchFormData {
  domain: string
  nature: typeof SiteNature[keyof typeof SiteNature]
  // NOTE: this cannot be set to boolean since
  // radio values cannot be set to boolean
  useWww: "true" | "false"
}

export const SiteLaunchInfoCollectorBody = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SiteLaunchFormData>()

  const {
    siteLaunchStatusProps,
    setSiteLaunchStatusProps,
    increasePageNumber,
    decreasePageNumber,
  } = useSiteLaunchContext()

  const onSubmit = (data: SiteLaunchFormData) => {
    if (!siteLaunchStatusProps) return
    setSiteLaunchStatusProps({
      ...siteLaunchStatusProps,
      siteUrl: data.domain,
      isNewDomain: data.nature === SiteNature.New,
      useWwwSubdomain: data.useWww === "true",
    })
    increasePageNumber()
  }
  const [selectedDomainNature, setSelectedDomainNature] = useState("")
  const [wwwSetting, setWwwSetting] = useState("")
  const [displayWwwQn, setDisplayWwwQn] = useState(false)
  const [isWwwRecommended, setIsWwwRecommended] = useState(true)

  const handleDomainNatureQn = (response: string) => {
    if (response === "") {
      // keep the state as is, disallow unselecting
      return
    }
    setSelectedDomainNature(response)
    setDisplayWwwQn(true)
  }

  const handleWwwQn = (response: string) => {
    if (response === "") {
      // disallow unselecting
      return
    }
    setWwwSetting(response)
  }

  const inputDomain = watch("domain")
  useEffect(() => {
    if (displayWwwQn) setIsWwwRecommended(recommendWwwValue(inputDomain))
  }, [displayWwwQn, inputDomain])

  const RecommendedBadge = () => (
    <Badge colorScheme="success" variant="subtle">
      <Text textColor="utility.feedback.success">Recommended</Text>
    </Badge>
  )

  return (
    <SiteLaunchPadBody>
      <FormControl isInvalid={!!errors.domain}>
        <Text textStyle="subhead-1">What domain are you launching with?</Text>
        <InputGroup mt="4" mb="1">
          <InputLeftAddon>https://</InputLeftAddon>
          <Input
            placeholder="isomer.gov.sg"
            {...register("domain", {
              required: "Domain is required",
              validate: (value) => {
                if (
                  value.startsWith("www.") ||
                  value.startsWith("http://") ||
                  value.startsWith("https://")
                ) {
                  return "Your domain cannot begin with 'http://', 'https://' or 'www.'"
                }

                const invalidTld =
                  !value.endsWith(".com") && !value.endsWith(".sg")
                if (value.endsWith("/") || invalidTld) {
                  return `Your domain must end with '.com' or '.sg'\nCheck that your domain doesn't end with '/'`
                }

                if (value.startsWith(".")) {
                  return "Check that your domain is valid and try again"
                }
                return true
              },
            })}
          />
        </InputGroup>
        <FormErrorMessage>
          <Box>
            {errors.domain?.message?.split("\n").map((msg) => {
              return (
                <Text
                  textStyle="subhead-2"
                  textColor="utility.feedback.critical"
                >
                  {msg}
                </Text>
              )
            })}
          </Box>
        </FormErrorMessage>

        <Text textStyle="subhead-1" mt="1.5rem">
          What is the nature of the domain you are launching with?
        </Text>
        <RadioGroup
          {...register("nature")}
          onChange={handleDomainNatureQn}
          mt="0.25rem"
          value={selectedDomainNature}
        >
          <Radio value={SiteNature.New} mb="0.25rem">
            <Text textStyle="body-1" color="black">
              It is a brand new domain
            </Text>
          </Radio>
          <Radio value={SiteNature.Live}>
            <Text textStyle="body-1" color="black">
              This domain is currently live or was previously live
            </Text>
          </Radio>
        </RadioGroup>

        {displayWwwQn && (
          <>
            <Text textStyle="subhead-1" mt="1.5rem">
              Do you want to host the both the www and non-www version of your
              domain?
            </Text>
            <RadioGroup
              {...register("useWww")}
              onChange={handleWwwQn}
              mt="0.25rem"
              value={wwwSetting}
            >
              <Radio value="true" mb="0.25rem">
                <HStack>
                  <Text textStyle="body-1" color="black">
                    Yes, host both www and non-www version
                  </Text>
                  {isWwwRecommended && <RecommendedBadge />}
                </HStack>
              </Radio>
              <Radio value="false">
                <HStack>
                  <Text textStyle="body-1" color="black">
                    No, host only the non-www version
                  </Text>
                  {!isWwwRecommended && <RecommendedBadge />}
                </HStack>
              </Radio>
            </RadioGroup>
          </>
        )}
        <Box display="flex" justifyContent="flex-end" mt="2rem">
          <Button
            variant="link"
            mr={4}
            onClick={() => decreasePageNumber()}
            height="2.75rem"
          >
            <Text textColor="base.content.strong">Cancel</Text>
          </Button>
          <Button
            rightIcon={<Icon as={BiRightArrowAlt} fontSize="1.25rem" />}
            type="submit"
            onClick={handleSubmit(onSubmit)}
            isDisabled={
              !!errors.domain ||
              !selectedDomainNature ||
              !watch("domain") ||
              !wwwSetting
            }
            height="2.75rem"
          >
            Next
          </Button>
        </Box>
      </FormControl>
    </SiteLaunchPadBody>
  )
}
