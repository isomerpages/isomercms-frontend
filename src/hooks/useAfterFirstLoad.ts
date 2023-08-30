import { useState } from "react"

/**
 * This custom hook is used as a helper for effects which should only take place on the second time onwards,
 * e.g. if data is not fully populated at the time of mounting.
 * It wraps a method in a conditional to check that it has been executed once before.
 */
export const useAfterFirstLoad = (
  wrappedMethod: (...args: unknown[]) => void
) => {
  const [isFirstLoadComplete, setIsFirstLoadComplete] = useState(false)

  const executeAfterFirstLoad = (...args: unknown[]) => {
    if (isFirstLoadComplete) {
      wrappedMethod(...args)
    } else {
      setIsFirstLoadComplete(true)
    }
  }

  return executeAfterFirstLoad
}
