import { Box, Icon, ListItem, Text, UnorderedList } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { BiRightArrowAlt } from "react-icons/bi"

import { SITE_LAUNCH_PAGES } from "types/siteLaunch"

import { SiteLaunchPadBody } from "./SiteLaunchPadBody"
import { SiteLaunchPadTitle } from "./SiteLaunchPadTitle"

export const SiteLaunchDisclaimerTitle = (): JSX.Element => {
  const title = "Welcome to the launchpad"
  const subTitle = "Track and manage your site launch here"
  return <SiteLaunchPadTitle title={title} subTitle={subTitle} />
}

interface SiteLaunchDisclaimerBodyProps {
  setPageNumber: (number: number) => void
}

export const SiteLaunchDisclaimerBody = ({
  setPageNumber,
}: SiteLaunchDisclaimerBodyProps): JSX.Element => {
  return (
    <SiteLaunchPadBody>
      <Text as="h5" textStyle="h5">
        What is site launch?
      </Text>
      <Text textStyle="body-2" mb="2rem">
        It&apos;s the process to connect a domain to your Isomer site and make
        it available to the public through the internet. Public officers would
        need to do this outside of Isomer through a separate service called IT
        Service Management (ITSM).
      </Text>
      <Text textStyle="body-2" mb="2rem">
        Isomer will provide you the necessary credentials you need to add or
        change in ITSM, but Isomer as a product does not actually launch your
        site for you. However you can come here to check the status of your site
        launch.
      </Text>
      <Text as="h5" textStyle="h5">
        You should only launch your site when:
      </Text>

      <Text textStyle="body-2" mb="2rem">
        1. Your site is ready to be launched
        <br />
        2. You already have a domain to connect to
      </Text>

      <Text as="h5" textStyle="h5">
        Things to note
      </Text>
      <UnorderedList mb="2rem">
        <ListItem>
          <Text textStyle="body-2">
            Site launch is a time-sensitive process and could require the
            coordination of actions from multiple parties. It is recommended
            that you internally set a date with the involved parties and not do
            it immediately.
          </Text>
        </ListItem>
        <ListItem>
          <Text textStyle="body-2">
            Expect downtime of your site for at least 1 hour during site launch.
            If site launch does not go smoothly, downtime could exponentially
            increase up to 48 hours.
          </Text>
        </ListItem>
        <ListItem>
          <Text textStyle="body-2">
            If you do not have the technical knowledge, we recommend getting
            someone from your IT team to launch your site for you. You can add
            them as a collaborator to your site and remove them after launching
            your site.
          </Text>
        </ListItem>
      </UnorderedList>

      <Box display="flex" justifyContent="flex-end">
        <Button
          rightIcon={<Icon as={BiRightArrowAlt} fontSize="1.25rem" />}
          iconSpacing="1rem"
          ml="auto"
          onClick={() => setPageNumber(SITE_LAUNCH_PAGES.INFO_GATHERING)} // going to the next page}
        >
          I understand
        </Button>
      </Box>
    </SiteLaunchPadBody>
  )
}
