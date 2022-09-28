import { useEffect, useState } from "react"

export const useTimer = (
  seconds: number
): { timer: number; setTimer: (value: number) => void } => {
  const [timer, setTimer] = useState(seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) setTimer(timer - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [timer])
  return { timer, setTimer }
}
