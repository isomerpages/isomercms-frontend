import { PropTypes } from "prop-types"
import React from "react"

import elementStyles from "./Spacing.module.scss"

/**
 * TODO [#790] Remove this component and replace calls with Chakra's Stack
 * This is a utility class to ensure that
 * the children components are all evenly spaced.
 *
 * This is a simplified version of the Chakra stack component with some assumptions made.
 * @returns Spacing
 */
const Spacing = ({ direction = "column", shouldWrap = true, children }) => {
  return (
    <div
      id="spacing"
      className={`${elementStyles.spacing} ${elementStyles[direction]}`}
    >
      {React.Children.map(children, (child) =>
        shouldWrap ? <div>{child}</div> : child
      )}
    </div>
  )
}

Spacing.propTypes = {
  direction: PropTypes.string,
  shouldWrap: PropTypes.bool,
  children: PropTypes.node,
}

export default Spacing
