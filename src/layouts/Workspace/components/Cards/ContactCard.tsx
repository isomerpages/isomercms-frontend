import { LinkOverlay, LinkBox, Text, Icon } from "@chakra-ui/react"
import { BiPhone } from "react-icons/bi"
import { Link as RouterLink } from "react-router-dom"

import { Card, CardBody } from "components/Card"

interface ContactCardProps {
  siteName: string
}

export const ContactCard = ({ siteName }: ContactCardProps): JSX.Element => {
  const generatedLink = `/sites/${siteName}/contact-us`

  return (
    <LinkBox>
      <LinkOverlay as={RouterLink} to={generatedLink}>
        <Card variant="single">
          <CardBody>
            <Icon as={BiPhone} fontSize="1.5rem" fill="secondary.400" />
            <Text textStyle="subhead-1" color="text.label" noOfLines={1}>
              Contact us
            </Text>
          </CardBody>
        </Card>
      </LinkOverlay>
    </LinkBox>
  )
}
