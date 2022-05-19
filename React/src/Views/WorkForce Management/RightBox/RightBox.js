import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"

import searchIcon from "../../../assets/images/icons/search.png"
import chatIcon from "../../../assets/images/icons/chat.png"
import calenderIcon from "../../../assets/images/icons/calender.png"
import mappinIcon from "../../../assets/images/icons/mappin.png"

import { useHttpClient } from "../../../shared/hooks/http-hook"
import AddAnnouncementModal from "./AddAnnouncementModal/AddAnnouncement"
import CommentModal from "./CommentModal/CommentModal"
import "./RightBox.css"


const RightBox = () => {
  const [pageContent, setPageContent] = useState()
  const [reloadOnSuccess, setReloadOnSuccess] = useState(false)
  const [currentlyOpenedAnnouncement, setCurrentlyOpenedAnnouncement] =
    useState({})
  const [commentContent, setCommentContent] = useState("")
  const [currentlyOpenedCommentId, setCurrentlyOpenedCommentId] = useState()
  const [addSidebarOpen, setAddSidebarOpen] = useState(false)
  const [commentsSidebarOpen, setCommentsSidebarOpen] = useState(false)
  const [notifyMembersOpen, setNotifyMembersOpen] = useState(false)

  const { sendRequest } = useHttpClient()
  const userData = useSelector((state) => state.auth)
  const userId = userData?.userData.id
  const userName = userData?.userData.user_name

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await sendRequest(
          "/getAnnouncements",
          "POST",
          JSON.stringify({
            userId: userId
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userData?.userData.token
          }
        )
        const pageContent = responseData
          ? responseData.data.announcementList
          : []

        if (pageContent) {
          setPageContent(pageContent)
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [sendRequest, userId, reloadOnSuccess, userData])

  const handleAddEventSidebar = () => {
    setAddSidebarOpen(!addSidebarOpen)
    setNotifyMembersOpen(false)
  }

  const pageReload = () => {
    setReloadOnSuccess(true)
  }

  const handleNotifyMembers = () => setNotifyMembersOpen(true)

  const handleCommentsSidebar = () => {
    setCommentsSidebarOpen(!commentsSidebarOpen)
    if (commentsSidebarOpen) {
      setCurrentlyOpenedAnnouncement("")
    }
  }

  const convertdate = (event_date) => {
    const today = event_date.split("T")[0].split("-")
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ]
    const month = Number(today[1].split("")[1])
    const convertedDay = `${today[2]} ${monthNames[month - 1]}, ${today[0]}`
    return convertedDay
  }

  const openCommentsHandler = (announcement) => {
    setCurrentlyOpenedCommentId(announcement?.id)
    const fetchData = async () => {
      try {
        const responseData = await sendRequest(
          "/getComments",
          "POST",
          JSON.stringify({
            announcementId: announcement?.id
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userData?.userData.token
          }
        )
        const commentContent = responseData
          ? responseData.data.commentsList
          : []

        if (commentContent) {
          setCurrentlyOpenedAnnouncement(announcement)
          setCommentContent(commentContent)
          handleCommentsSidebar()
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }

  return (
    <React.Fragment>
      <div className="right-box">
        <div className="section-title">
          <h3>Announcement</h3>
        </div>
        <div className="buttons-section">
          <div className="buttons-box">
            <div className="search">
              <img src={searchIcon} alt="icon" />
              <input type="text" placeholder="search" />
            </div>
            <div className="add-new">
              <button
                className="btn btn-success"
                onClick={handleAddEventSidebar}
              >
                + Add Announcement
              </button>
            </div>
          </div>
        </div>
        <div className="Announcements">
          {pageContent &&
            pageContent.map((m) => {
              return (
                <div className="announcenmentBox" key={m.id}>
                  <div className="row">
                    <div className="col-xl-1 col-lg-1 col-md-1 col-2">
                      <div className="firstCharCircle">
                        <p>{m.userName.charAt(0)}</p>
                      </div>
                    </div>
                    <div className="col-xl-11 col-lg-11 col-md-11 col-10">
                      <div className="row">
                        <div className="col-xl-10 col-lg-9 col-md-6 col-6">
                          <div className="announcement-title">{m.subject}</div>
                        </div>
                        <div className="col-xl-2 col-lg-3 col-md-6 col-6">
                          <div className="date-box">
                            <div className="chat-icon">
                              <img
                                src={chatIcon}
                                alt="icon"
                                onClick={() => openCommentsHandler(m)}
                              />
                            </div>
                            <div className="date">
                              {m.announcement_add_date}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="announcement-text">{m.description}</div>
                      {m.category === "Event" && (
                        <div className="announcement-loc">
                          <div className="al-box">
                            <div className="date d-flex align-items-center">
                              <img
                                className="pr-3"
                                src={calenderIcon}
                                alt="icon"
                              />
                              {convertdate(m.event_date)} / {m.event_time}
                            </div>
                            <div className="location">
                              <img
                                className="pr-3"
                                src={mappinIcon}
                                alt="icon"
                              />
                              {m.location}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      <AddAnnouncementModal
        handleAddEventSidebar={handleAddEventSidebar}
        addSidebarOpen={addSidebarOpen}
        handleNotifyMembers={handleNotifyMembers}
        notifyMembersOpen={notifyMembersOpen}
        pageReload={pageReload}
      />
      <CommentModal
        commentContent={commentContent}
        currentlyOpenedAnnouncement={currentlyOpenedAnnouncement}
        currentlyOpenedCommentId={currentlyOpenedCommentId}
        userName={userName}
        handleCommentsSidebar={handleCommentsSidebar}
        userData={userData}
        commentsSidebarOpen={commentsSidebarOpen}
      />
    </React.Fragment>
  )
}

export default RightBox
