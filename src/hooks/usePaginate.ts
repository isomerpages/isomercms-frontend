import { useState } from "react"

export const usePaginate = (
  initialPage = 0
): [number, (page: number) => void] => {
  const [curPage, setCurPage] = useState(initialPage)

  return [
    curPage + 1,
    (page: number) => {
      setCurPage(page - 1)
    },
  ]
}
