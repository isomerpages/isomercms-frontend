import { Box, Icon, ListItem, Text, UnorderedList } from "@chakra-ui/react"
import { Button, Checkbox } from "@opengovsg/design-system-react"
import { useForm } from "react-hook-form"
import { BiRightArrowAlt } from "react-icons/bi"

import { typography } from "theme/foundations/typography"
import { SITE_LAUNCH_PAGES } from "types/siteLaunch"

import { SiteLaunchPadBody } from "./SiteLaunchPadBody"
import { SiteLaunchPadTitle } from "./SiteLaunchPadTitle"

export const SiteLaunchDisclaimerTitle = (): JSX.Element => {
  const title = "Before you launch your site"
  const subTitle = "Please review the information on this page carefully"
  return <SiteLaunchPadTitle title={title} subTitle={subTitle} />
}

interface SiteLaunchDisclaimerBodyProps {
  setPageNumber: (number: number) => void
}

export const SiteLaunchDisclaimerBody = ({
  setPageNumber,
}: SiteLaunchDisclaimerBodyProps): JSX.Element => {
  const { register, handleSubmit, watch } = useForm({})
  const isRequirementUnderstood = watch("isRequirementUnderstood")
  return (
    <SiteLaunchPadBody>
      <Text as="h5" textStyle="h5">
        What is site launch?
      </Text>
      <Text textStyle="body-2" mb="2rem">
        <Text as="b" fontWeight={typography.fontWeights.bold}>
          Site launch is the process of connecting your Isomer site to a domain
        </Text>{" "}
        and making it publicly available on the internet. You will need to do
        this using your service provider for your name server, which is separate
        from Isomer. Typically, this would be the IT Service Management (ITSM).
      </Text>
      <Text textStyle="body-2" mb="2rem">
        Isomer provides the credentials you need to add or change in your name
        server (typically ITSM),{" "}
        <Text as="b" fontWeight={typography.fontWeights.bold}>
          but cannot update them on your behalf.{" "}
        </Text>
        However, you can come back here after updating the credentials, to check
        if your website is launched and publicly accessible.
      </Text>

      <Text
        fontSize={typography.fontSize.sm}
        fontWeight={typography.fontWeights.bold}
      >
        You should only launch your site when:
      </Text>

      <Text textStyle="body-2" mb="2rem">
        1. Your site is ready to be launched
        <br />
        2. You already have a domain to connect to
      </Text>

      <Text as="h5" textStyle="h5">
        Important
      </Text>
      <UnorderedList>
        <ListItem>
          <Text textStyle="body-2">
            Site launch is a time-sensitive process and often requires
            coordination between multiple parties (e.g. IT administrator, CWP
            contact, the agency&apos;s launch approver). We recommend scheduling
            a launch date when all these individuals are available.
          </Text>
        </ListItem>
        <ListItem>
          <Text textStyle="body-2">
            The Isomer team is available to assist with launch only between
            10:30 am and 4:30 pm (Monday to Friday), so we recommend planning
            your launch during these hours. Any launch issues outside these
            hours will be attended to during working hours.
          </Text>
        </ListItem>
        <ListItem>
          <Text textStyle="body-2">
            Expect at least 1 hour of downtime for your site during launch. If
            not coordinated properly, your site could be down for as long as 48
            hours.
          </Text>
        </ListItem>
        <ListItem>
          <Text textStyle="body-2">
            If you are unfamiliar with site launches,{" "}
            <Text as="b">
              we recommend getting someone from your IT team to help you launch
              your site.
            </Text>
          </Text>
        </ListItem>
      </UnorderedList>
      <Checkbox mt="3rem" {...register("isRequirementUnderstood")}>
        <Text textColor="base.content.default" textStyle="body-1">
          I have read and understood the requirements to launch my site
        </Text>
      </Checkbox>
      <Box display="flex" justifyContent="flex-end" mt="1.5rem">
        <Button
          isDisabled={!isRequirementUnderstood}
          rightIcon={<Icon as={BiRightArrowAlt} fontSize="1.25rem" />}
          iconSpacing="1rem"
          ml="auto"
          onClick={handleSubmit(() => {
            // going to the next page
            setPageNumber(SITE_LAUNCH_PAGES.INFO_GATHERING)
          })}
        >
          Continue
        </Button>
      </Box>
    </SiteLaunchPadBody>
  )
}
