import React from "react"

import LeftBox from "./LeftBox/LeftBox"
import RightBox from "./RightBox/RightBox"
import "./WorkforceManagement.css"

const WorkforceManagement = () => {
  return (
    <React.Fragment>
      <section id="workforce-panel">
          <LeftBox />
          <RightBox />
      </section>
    </React.Fragment>
  )
}

export default WorkforceManagement
