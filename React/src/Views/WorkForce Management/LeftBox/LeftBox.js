import React from "react"
import { useDispatch } from "react-redux"

import { AlignRight } from "react-feather"
import { NavLink } from "react-router-dom"

import "./LeftBox.css"
import AnnouncementIcon from "../../../assets/images/icons/announcement.svg"
import logoutIcon from "../../../assets/images/icons/logout.svg"

import { handleLogout } from "../../../redux/authentication"

const LeftBox = () => {
  const dispatch = useDispatch()

  const logoutHandler = () => {
    dispatch(handleLogout(true))
  }

  return (
    <React.Fragment>
      <div className="left-box">
        <div className="company">
          <div className="name">SA-INTRANET</div>
          <div className="icon">
            <AlignRight />
          </div>
        </div>
        <div className="menus">
          <ul>
            <li>
              <NavLink to="/WorkforceManagement" exact>
                {" "}
                <div className="menu-box">
                  <div className="icon">
                    <img src={AnnouncementIcon} alt="icon" />
                  </div>
                  <div className="name">Announcement</div>
                </div>{" "}
              </NavLink>
            </li>
            <li>
              <div className="menu-box">
                <div className="icon">
                  <img src={logoutIcon} alt="icon" />
                </div>
                <div className="name" onClick={logoutHandler}>
                  Log out
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </React.Fragment>
  )
}

export default LeftBox
