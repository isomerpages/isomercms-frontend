import { Button, ButtonProps } from "@opengovsg/design-system-react"
import { useState, useEffect } from "react"

// NOTE: This interface is required because the onClick function passed to this button
// does not accept an event and is run purely for side-effects
interface LoadingButtonProps extends Omit<ButtonProps, "onClick"> {
  onClick: () => void
}

// eslint-disable-next-line import/prefer-default-export
export const LoadingButton = ({
  onClick,
  isLoading,
  isDisabled,
  ...rest
}: LoadingButtonProps): JSX.Element => {
  // track whether button is loading or not
  const [isOnClickLoading, setIsOnClickLoading] = useState(false)

  useEffect(() => {
    let _isMounted = true

    const runCallback = async () => {
      try {
        await onClick()
      } catch (err) {
        if (_isMounted) setIsOnClickLoading(false)
        throw err
      }
      if (_isMounted) setIsOnClickLoading(false)
    }

    if (isOnClickLoading) {
      runCallback()
    }

    return () => {
      _isMounted = false
    }
  }, [isOnClickLoading, onClick])

  return (
    <Button
      isLoading={isLoading || isOnClickLoading}
      onClick={() => setIsOnClickLoading(true)}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    />
  )
}
