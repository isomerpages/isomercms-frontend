import { Text, VStack } from "@chakra-ui/react"

import type { CollaboratorsStats } from "types/sitedashboard"

export const CollaboratorsStatistics = ({
  statistics,
}: {
  statistics: CollaboratorsStats
}): JSX.Element => {
  return (
    <VStack spacing="0px" alignItems="flex-left">
      <Text>
        <Text as="b">{statistics.total}</Text> total
      </Text>
      {statistics.inactive > 0 && (
        <Text color="text.danger">
          <Text as="b">{statistics.inactive}</Text> last logged in &gt;60 days
          ago
        </Text>
      )}
    </VStack>
  )
}
