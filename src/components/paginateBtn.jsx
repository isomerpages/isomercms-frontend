import { Text, HStack } from "@chakra-ui/react"
import {
  IconButton,
  BxChevronLeft,
  BxChevronRight,
} from "@opengovsg/design-system-react"

import { typography } from "theme/foundations/typography"

export default function PaginateBtn({ currentPage, totalPage, onPageChange }) {
  return (
    <HStack>
      <Text textStyle="caption-1" fontFamily={typography.fontFamilies.inter}>
        Page {currentPage} out of {totalPage}{" "}
      </Text>
      <IconButton
        size="sm"
        aria-label="Previous Page"
        icon={<BxChevronLeft />}
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
        marginLeft="20px"
        marginRight="12px"
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
