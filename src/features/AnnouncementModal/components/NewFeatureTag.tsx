import { Icon } from "@chakra-ui/react"
import { Badge } from "@opengovsg/design-system-react"

import { BxsRocket } from "assets"

export const NewFeatureTag = (): JSX.Element => {
  return (
    <Badge
      variant="subtle"
      colorScheme="brand.secondary"
      display="inline-flex"
      columnGap="0.5rem"
      alignItems="center"
    >
      <Icon as={BxsRocket} />
      New feature
    </Badge>
  )
}
