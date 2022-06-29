import { LinkOverlay, LinkBox, Text, Icon } from "@chakra-ui/react"
import { Card, CardBody } from "components/Card"
import { BiHomeAlt } from "react-icons/bi"
import { Link as RouterLink } from "react-router-dom"

interface HomepageCardProps {
  siteName: string
}

export const HomepageCard = ({ siteName }: HomepageCardProps): JSX.Element => {
  const generatedLink = `/sites/${siteName}/homepage`

  return (
    <LinkBox>
      <LinkOverlay as={RouterLink} to={generatedLink}>
        <Card variant="single">
          <CardBody>
            <Icon as={BiHomeAlt} fontSize="1.5rem" fill="secondary.400" />
            <Text textStyle="subhead-1" color="text.label">
              Homepage
            </Text>
          </CardBody>
        </Card>
      </LinkOverlay>
    </LinkBox>
  )
}
