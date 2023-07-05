/* eslint-disable react/jsx-props-no-spreading */
import { Box, Button, Icon, Text, RadioGroup } from "@chakra-ui/react"
import { Input, Radio } from "@opengovsg/design-system-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { BiRightArrowAlt } from "react-icons/bi"

import { useSiteLaunchContext } from "contexts/SiteLaunchContext"

import { SITE_LAUNCH_PAGES } from "types/siteLaunch"

import { SiteLaunchPadBody } from "./SiteLaunchPadBody"
import { SiteLaunchPadTitle } from "./SiteLaunchPadTitle"

export const SiteLaunchInfoCollectorTitle = (): JSX.Element => {
  const title = "Tell us more about your domain"
  const subTitle = "This will inform the steps you have to take for launch"
  return <SiteLaunchPadTitle title={title} subTitle={subTitle} />
}

interface SiteLaunchInfoGatheringBodyProps {
  setPageNumber: (number: number) => void
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

export const SiteLaunchInfoCollectorBody = ({
  setPageNumber,
}: SiteLaunchInfoGatheringBodyProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SiteLaunchFormData>()

  const {
    siteLaunchStatusProps,
    setSiteLaunchStatusProps,
  } = useSiteLaunchContext()

  const onSubmit = (data: SiteLaunchFormData) => {
    if (!siteLaunchStatusProps) return
    setSiteLaunchStatusProps({
      ...siteLaunchStatusProps,
      siteUrl: data.domain,
      isNewDomain: data.nature === SiteNature.New,
      useWwwSubdomain: data.useWww === "true",
    })
    setPageNumber(SITE_LAUNCH_PAGES.RISK_ACCEPTANCE)
  }
  const [selectedRadio, setSelectedRadio] = useState("")

  return (
    <SiteLaunchPadBody>
      <Text textStyle="subhead-1">What domain are you launching with?</Text>
      <Input
        mt="4"
        mb="1"
        placeholder="eg: www.isomer.gov.sg"
        {...register("domain", { required: true })}
      />
      {errors.domain && <Text textStyle="subhead-2">Domain is required</Text>}

      <Text textStyle="subhead-1" mt="1.5rem">
        Do you want to host the both the www and non-www version of your domain?
      </Text>
      <Text textStyle="subhead-2">
        Select &quot;Yes&quot; if you are not sure
      </Text>
      <RadioGroup
        {...register("useWww")}
        onChange={setSelectedRadio}
        mt="0.25rem"
      >
        <Radio value="true">
          <Text textStyle="body-1" color="black">
            Yes, host both www and non-www version
          </Text>
        </Radio>
        <Radio value="false">
          <Text textStyle="body-1" color="black">
            No, host only the non-www version
          </Text>
        </Radio>
      </RadioGroup>
      <Text textStyle="subhead-1" mt="1.5rem">
        What is the nature of the domain you are launching with?
      </Text>
      <RadioGroup
        {...register("nature")}
        onChange={setSelectedRadio}
        mt="0.25rem"
      >
        <Radio value={SiteNature.New}>
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
      <Box display="flex" justifyContent="flex-end" mt="2rem">
        <Button
          variant="link"
          mr={4}
          onClick={() => setPageNumber(SITE_LAUNCH_PAGES.DISCLAIMER)}
        >
          Cancel
        </Button>
        <Button
          rightIcon={<Icon as={BiRightArrowAlt} fontSize="1.25rem" />}
          onClick={handleSubmit(onSubmit)}
          disabled={!selectedRadio || !watch("domain")}
        >
          Next
        </Button>
      </Box>
    </SiteLaunchPadBody>
  )
}
