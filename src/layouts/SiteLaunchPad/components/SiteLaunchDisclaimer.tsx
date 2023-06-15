import {
  Box,
  Icon,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
} from "@chakra-ui/react"
import { Button, BxChevronRight } from "@opengovsg/design-system-react"

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
      <Text textStyle="h2">What is site launch?</Text>
      <Text>
        It&apos;s the process to connect a domain to your Isomer site and make
        it available to the public through the internet. Public officers would
        need to do this outside of Isomer through a separate service called IT
        Service Management (ITSM).
        <br />
        <br />
        Isomer will provide you the necessary credentials you need to add or
        change in ITSM, but Isomer as a product does not actually launch your
        site for you. However you can come here to check the status of your site
        launch.
        <br />
        <br />
      </Text>
      <Text textStyle="h2">You should only launch your site when:</Text>
      <OrderedList>
        <ListItem>
          You are ready to release your site content to the public
        </ListItem>
        <ListItem>You already have a domain to connect to</ListItem>
      </OrderedList>
      <br />
      <Text textStyle="h2">Things to note</Text>
      <UnorderedList>
        <ListItem>
          Site launch is a time-sensitive process and could require the
          coordination of actions from multiple parties. It is recommended that
          you internally set a date with the involved parties and not do it
          immediately.
        </ListItem>
        <ListItem>
          Expect downtime of your site for at least 1 hour during site launch.
          If site launch does not go smoothly, downtime could exponentially
          increase up to 48 hours.
        </ListItem>
        <ListItem>
          If you do not have the technical knowledge, we recommend getting
          someone from your IT team to launch your site for you. You can add
          them as a collaborator to your site and remove them after launching
          your site.
        </ListItem>
      </UnorderedList>
      <br />
      <Box display="flex" justifyContent="flex-end">
        <Button
          rightIcon={<Icon as={BxChevronRight} fontSize="1.25rem" />}
          iconSpacing="1rem"
          ml="auto"
          onClick={() => setPageNumber(SITE_LAUNCH_PAGES.INFO_GATHERING)} // going to the next page}
        >
          What do I have to do
        </Button>
      </Box>
    </SiteLaunchPadBody>
  )
}
