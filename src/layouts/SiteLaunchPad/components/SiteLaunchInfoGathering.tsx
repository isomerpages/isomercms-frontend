import { Box, Button, Icon, Text, RadioGroup } from "@chakra-ui/react"
import { Input, Radio } from "@opengovsg/design-system-react"
import { useState } from "react"
import { BiArrowBack } from "react-icons/bi"

import { SITE_LAUNCH_PAGES } from "types/siteLaunch"

import { SiteLaunchPadBody } from "./SiteLaunchPadBody"
import { SiteLaunchPadTitle } from "./SiteLaunchPadTitle"

export const SiteLaunchInfoGatheringTitle = (): JSX.Element => {
  const title = "Tell us more about your domain"
  const subTitle = "This will inform the steps you have to take for launch"
  return <SiteLaunchPadTitle title={title} subTitle={subTitle} />
}

interface SiteLaunchInfoGatheringBodyProps {
  setPageNumber: (number: number) => void
}

export const SiteLaunchInfoGatheringBody = ({
  setPageNumber,
}: SiteLaunchInfoGatheringBodyProps): JSX.Element => {
  const [inputValue, setInputValue] = useState<string>("")
  const [selectedRadio, setSelectedRadio] = useState<string>("")
  const handleRadioChange = (value: string) => {
    setSelectedRadio(value === selectedRadio ? "" : value)
  }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const isNextButtonDisabled = !inputValue || !selectedRadio

  return (
    <SiteLaunchPadBody>
      <Text textStyle="subhead-1">What domain are you launching with?</Text>
      <Input
        mt="4"
        placeholder="eg: www.isomer.gov.sg"
        value={inputValue}
        onChange={handleInputChange}
      />
      <br />
      <br />
      <Text textStyle="subhead-1">
        What is the nature of the domain you are launching with?
      </Text>
      <RadioGroup value={selectedRadio} onChange={handleRadioChange}>
        <Radio value="new">
          <Text textStyle="body-1" color="black">
            It is a brand new domain
          </Text>
        </Radio>
        <Radio value="live">
          <Text textStyle="body-1" color="black">
            This domain is currently live or was previously live
          </Text>
        </Radio>
      </RadioGroup>
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="link"
          mr={4}
          onClick={() => setPageNumber(SITE_LAUNCH_PAGES.DISCLAIMER)}
        >
          Cancel
        </Button>
        <Button
          rightIcon={
            <Icon
              as={BiArrowBack}
              fontSize="1.25rem"
              transform="rotate(180deg)"
            />
          }
          onClick={() => setPageNumber(SITE_LAUNCH_PAGES.RISK_ACCEPTANCE)}
          disabled={isNextButtonDisabled}
        >
          Next
        </Button>
      </Box>
    </SiteLaunchPadBody>
  )
}
