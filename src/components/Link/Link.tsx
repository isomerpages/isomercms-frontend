import { ReactNode, HTMLAttributes } from "react"

import elementStyles from "./Link.module.scss"

export interface LinkProps extends HTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
}

export const Link = (props: LinkProps): JSX.Element => {
  return <a className={elementStyles.link} {...props} />
}
