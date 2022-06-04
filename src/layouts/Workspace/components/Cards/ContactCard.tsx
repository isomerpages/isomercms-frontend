import { LinkOverlay, LinkBox, Text, Icon } from "@chakra-ui/react"
import { Card, CardBody } from "components/Card"
import { BiPhone } from "react-icons/bi"
import { Link as RouterLink } from "react-router-dom"

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
            <Text textStyle="subhead-1" color="text.label">
              Contact us
            </Text>
          </CardBody>
        </Card>
      </LinkOverlay>
    </LinkBox>
  )
}
