import { Text, HStack } from "@chakra-ui/react"
import {
  IconButton,
  BxChevronLeft,
  BxChevronRight,
} from "@opengovsg/design-system-react"

import { typography } from "theme/foundations/typography"

export default function PaginateButton({
  currentPage,
  totalPage,
  onPageChange,
}: {
  currentPage: number
  totalPage: number
  onPageChange: (arg: number) => void
}) {
  return (
    <HStack>
      <Text textStyle="caption-1">
        Page {currentPage} out of {totalPage}{" "}
      </Text>
      <IconButton
        size="sm"
        aria-label="Previous Page"
        icon={<BxChevronLeft />}
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage <= 1}
        marginLeft="1.25rem"
        marginRight="0.75rem"
      />
      <IconButton
        size="sm"
        aria-label="Next Page"
        icon={<BxChevronRight />}
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPage}
      />
    </HStack>
  )
}
