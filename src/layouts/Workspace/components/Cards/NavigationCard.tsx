import { LinkOverlay, LinkBox, Text, Icon } from "@chakra-ui/react"
import { Card, CardBody } from "components/Card"
import { BiWorld } from "react-icons/bi"
import { Link as RouterLink } from "react-router-dom"

interface NavigationCardProps {
  siteName: string
}

export const NavigationCard = ({
  siteName,
}: NavigationCardProps): JSX.Element => {
  const generatedLink = `/sites/${siteName}/navbar`

  return (
    <LinkBox>
      <LinkOverlay as={RouterLink} to={generatedLink}>
        <Card variant="single">
          <CardBody>
            <Icon as={BiWorld} fontSize="1.5rem" fill="secondary.400" />
            <Text textStyle="subhead-1" color="text.label" noOfLines={1}>
              Navigation Bar
            </Text>
          </CardBody>
        </Card>
      </LinkOverlay>
    </LinkBox>
  )
}
