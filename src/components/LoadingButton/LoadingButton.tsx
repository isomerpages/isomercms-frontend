import { Button, ButtonProps } from "@opengovsg/design-system-react"
import { useState, useEffect, useMemo, useCallback } from "react"

// eslint-disable-next-line import/prefer-default-export
export const LoadingButton = ({
  onClick,
  isLoading,
  ...rest
}: ButtonProps): JSX.Element => {
  // track whether button is loading or not
  const [isOnClickLoading, setIsOnClickLoading] = useState(false)

  return (
    <Button
      isLoading={isLoading || isOnClickLoading}
      onClick={async (event) => {
        setIsOnClickLoading(true)
        if (onClick) {
          await onClick(event)
        }
        setIsOnClickLoading(false)
      }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    />
  )
}
