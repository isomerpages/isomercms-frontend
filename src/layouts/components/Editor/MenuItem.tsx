import "./MenuItem.scss"

import { MouseEventHandler } from "react"
import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg"

interface MenuItemProps {
  icon?: string
  title?: string
  action?: MouseEventHandler<HTMLButtonElement>
  isActive?: null | (() => boolean)
}

export default ({ icon, title, action, isActive = null }: MenuItemProps) => (
  <button
    type="button"
    className={`menu-item${isActive && isActive() ? " is-active" : ""}`}
    onClick={action}
    title={title}
  >
    <svg className="remix">
      <use xlinkHref={`${remixiconUrl}#ri-${icon}`} />
    </svg>
  </button>
)
