/* eslint-disable arrow-body-style */
import PropTypes from "prop-types"
import { useEffect, useState } from "react"

import { generateLeftNav } from "utils/leftnavGeneration"
import "styles/isomer-template.scss"

const LeftNav = ({ leftNavPages, fileName }) => {
  const [leftNavData, setLeftNavData] = useState()
  useEffect(() => {
    setLeftNavData(generateLeftNav(leftNavPages, fileName))
  }, [])
  return (
    <div className="col is-2 is-position-relative has-side-nav is-hidden-touch">
      <div id="sidenav" className="sidenav">
        <aside className="bp-menu is-gt sidebar__inner">
          <ul className="bp-menu-list">{leftNavData}</ul>
          <div dir="ltr" className="resize resize-sensor">
            <div className="resize resize-sensor-expand">
              <div
                style={{
                  position: "absolute",
                  left: "0px",
                  top: "0px",
                  transition: "all 0s ease 0s",
                  width: "174px",
                  height: "126px",
                }}
              />
            </div>
            <div className="resize resize-sensor-shrink">
              <div
                style={{
                  position: "absolute",
                  left: "0px",
                  top: "0px",
                  transition: "0s",
                  width: "200%",
                  height: "200%",
                }}
              />
            </div>
          </div>
        </aside>
      </div>
      <div dir="ltr" className="resize resize-sensor">
        <div className="resize resize-sensor-expand">
          <div
            style={{
              position: "absolute",
              left: "0px",
              top: "0px",
              transition: "all 0s ease 0s",
              width: "198px",
              height: "306px",
            }}
          />
        </div>
        <div className="resize resize-sensor-shrink">
          <div
            style={{
              position: "absolute",
              left: "0px",
              top: "0px",
              transition: "0s",
              width: "200%",
              height: "200%",
            }}
          />
        </div>
      </div>
    </div>
  )
}

LeftNav.propTypes = {
  leftNavPages: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      fileName: PropTypes.string,
    })
  ).isRequired,
  fileName: PropTypes.string.isRequired,
}

export default LeftNav
