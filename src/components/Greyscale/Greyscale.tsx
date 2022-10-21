import { Box } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

interface GreyscaleProps {
  isActive?: boolean
}

// Yes, this is a GoT reference.
export const Greyscale = ({
  isActive,
  children,
}: PropsWithChildren<GreyscaleProps>): JSX.Element => {
  return isActive ? (
    // NOTE: This is done so that the cursor has the disabled icon
    // while not permitting any `onClick` events.
    // Combining them into the same element leads to
    // the cursor icon being active.
    <Box cursor="not-allowed">
      <Box pointerEvents="none" filter="grayscale(100%)">
        {children}
      </Box>
    </Box>
  ) : (
    <>{children}</>
  )
}
