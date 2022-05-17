import React, { useState, useEffect } from "react"

import { useForm, Controller } from "react-hook-form"
import { useSelector } from "react-redux"

import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Label,
  Input,
  FormFeedback
} from "reactstrap"
import { X } from "react-feather"
import Flatpickr from "react-flatpickr"
import TimePicker from "react-time-picker"

import "./RightBox.css"
import searchIcon from "../../../assets/images/icons/search.png"
import chatIcon from "../../../assets/images/icons/chat.png"
import sendIcon from "../../../assets/images/icons/Shape.png"
import calenderIcon from "../../../assets/images/icons/calender.png"
import mappinIcon from "../../../assets/images/icons/mappin.png"
import spinner from "../../../assets/images/spinner.gif"


import { useHttpClient } from "../../../shared/hooks/http-hook"

const RightBox = () => {
  const { isLoading,sendRequest } = useHttpClient()
  const [successMessage, setSuccessMessage] = useState()
  const [failMessage, setFailMessage] = useState()
  const [lengthError, setLengthError] = useState()

  const userData = useSelector((state) => state.auth)
  const userId = userData?.userData.id
  const userName = userData?.userData.user_name
  const today = new Date()
  const date = today.getDate()
  const month = today.toLocaleString("default", { month: "long" })
  const year = today.getFullYear()
  const presentDay = `${date} ${month}, ${year}`

  const defaultValues = {
    subject: "",
    description: "",
    notify: "",
    location: ""
  }
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ defaultValues })

  const [pageContent, setPageContent] = useState()
  const [currentlyOpenedAnnouncement, setCurrentlyOpenedAnnouncement] =
    useState({})

  const [commentContent, setCommentContent] = useState("")
  const [currentlyOpenedCommentId, setCurrentlyOpenedCommentId] = useState()
  const [commentEntered, setCommentEntered] = useState()
  const [addSidebarOpen, setAddSidebarOpen] = useState(false)
  const [commentsSidebarOpen, setCommentsSidebarOpen] = useState(false)
  const [notifyMembersOpen, setNotifyMembersOpen] = useState(false)
  const [startPicker, setStartPicker] = useState(new Date())
  const [eventTime, onChange] = useState("10:00")
  const [category, setCategory] = useState()
  const [expiresOn, setExpiresOn] = useState(new Date())

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
  }, [sendRequest, userId, successMessage, userData])

  const handleAddEventSidebar = () => {
    setAddSidebarOpen(!addSidebarOpen)
    setNotifyMembersOpen(false)
  }

  const handleCommentsSidebar = () => {
    setCommentsSidebarOpen(!commentsSidebarOpen)
    if (commentsSidebarOpen) {
      setCurrentlyOpenedAnnouncement("")
    }
  }

  const handleNotifyMembers = () => setNotifyMembersOpen(true)

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

  const CloseBtn = (
    <X
      className="cursor-pointer"
      size={15}
      onClick={handleAddEventSidebar}
      style={{ cursor: "pointer" }}
    />
  )

  const CloseBtnForComments = (
    <X
      className="cursor-pointer"
      size={15}
      onClick={handleCommentsSidebar}
      style={{ cursor: "pointer" }}
    />
  )

  const onAddFormSubmit = (data) => {
    if (data.subject && data.description && data.notify && category) {
      const login = async () => {
        try {
          const responseData = await sendRequest(
            "/announcement-add",
            "POST",
            JSON.stringify({
              userId: userId,
              subject: data.subject,
              category: category,
              eventDate: startPicker,
              eventTime: eventTime,
              location: data.location,
              description: data.description,
              notify: data.notify,
              reminder: expiresOn,
              today: presentDay
            }),
            {
              "Content-Type": "application/json",
              Authorization: "Bearer " + userData?.userData.token
            }
          )
          const apiSuccess = responseData.success === true
          if (apiSuccess) {
            reset(defaultValues)
            setStartPicker("")
            onChange("")
            setCategory("")
            setExpiresOn("")
            setSuccessMessage(responseData.message)
            setTimeout(() => {
              setSuccessMessage("")
              handleAddEventSidebar()
            }, 2000)
          }
        } catch (err) {
          setFailMessage("Something went wrong please try again later")
          setTimeout(() => {
            setFailMessage("")
          }, 3000)
        }
      }
      login()
    } else {
      setLengthError("please enter data in all the fields")
      setTimeout(() => {
        setLengthError("")
      }, 2000)
    }
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

  const onCommentFormSubmit = (event) => {
    event.preventDefault()
    const commentSubmit = async () => {
      try {
        const responseData = await sendRequest(
          "/commentsAdd",
          "POST",
          JSON.stringify({
            comment: commentEntered,
            eventId: currentlyOpenedCommentId,
            userName: userName,
            today: presentDay
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userData?.userData.token
          }
        )
        const apiSuccess = responseData.success === true
        if (apiSuccess) {
          setCommentEntered("")
          handleCommentsSidebar()
        }
      } catch (err) {
        console.log(err)
      }
    }
    commentSubmit()
  }

  console.log(pageContent)
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

      <Modal
        isOpen={addSidebarOpen}
        toggle={handleAddEventSidebar}
        contentClassName="p-0 overflow-hidden"
        modalClassName="modal-slide-in event-sidebar"
      >
        <ModalHeader
          className="mb-1"
          toggle={handleAddEventSidebar}
          close={CloseBtn}
          tag="div"
        >
          <h5 className="modal-title">Add New Announcement</h5>
        </ModalHeader>
        <ModalBody>
          <div className="modal-contents">
            <Form className="add-form" onSubmit={handleSubmit(onAddFormSubmit)}>
              <div className="form-group">
                <Label className="form-label" htmlFor="subject">
                  Subject
                </Label>
                <Controller
                  id="subject"
                  name="subject"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      invalid={errors.subject && true}
                      {...field}
                    />
                  )}
                />
                {errors.subject ? (
                  <FormFeedback>{errors.subject.message}</FormFeedback>
                ) : null}
              </div>

              <div className="form-group">
                <Label className="form-label" htmlFor="Subject">
                  Select Category
                </Label>
                <div className="category-radio">
                  <div className="radio-box">
                    <input
                      type="radio"
                      id="Announcement"
                      name="Announcement"
                      value="Announcement"
                      onChange={(e) => setCategory(e.target.value)}
                    />
                    <label htmlFor="Announcement">Announcement</label>
                  </div>
                  <div className="radio-box">
                    <input
                      type="radio"
                      id="Event"
                      name="Announcement"
                      value="Event"
                      onChange={(e) => setCategory(e.target.value)}
                    />
                    <label htmlFor="Event">Event</label>
                  </div>
                  <div className="radio-box">
                    <input
                      type="radio"
                      id="Reminder"
                      name="Announcement"
                      value="Reminder"
                      onChange={(e) => setCategory(e.target.value)}
                    />
                    <label htmlFor="Reminder">Reminder</label>
                  </div>
                </div>
              </div>

              {category && category === "Event" && (
                <div>
                  {" "}
                  <div className="date-time-picker">
                    <div className="date-picker">
                      <Label className="form-label" htmlFor="startDate">
                        Date
                      </Label>
                      <Flatpickr
                        required
                        style={{ height: "30px" }}
                        id="startDate"
                        name="startDate"
                        className="form-control"
                        onChange={(date) => setStartPicker(date[0])}
                        value={startPicker}
                        options={{
                          dateFormat: "d-m-y"
                        }}
                      />
                    </div>

                    <div className="time-picker">
                      <Label className="form-label" htmlFor="startDate">
                        Time
                      </Label>
                      <TimePicker
                        onChange={onChange}
                        value={eventTime}
                        clearIcon={null}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <Label className="form-label" htmlFor="location">
                      Location
                    </Label>
                    <Controller
                      id="location"
                      name="location"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="text"
                          invalid={errors.location && true}
                          {...field}
                        />
                      )}
                    />
                    {errors.location ? (
                      <FormFeedback>{errors.location.message}</FormFeedback>
                    ) : null}
                  </div>
                </div>
              )}

              {category && category === "Reminder" && (
                <div className="form-group">
                  <Label className="form-label" htmlFor="startDate">
                    Expires On
                  </Label>
                  <Flatpickr
                    required
                    id="Expires"
                    name="Expires"
                    className="form-control"
                    onChange={(date) => setExpiresOn(date[0])}
                    value={expiresOn}
                    options={{
                      dateFormat: "d-m-y"
                    }}
                  />
                </div>
              )}

              <div className="form-group">
                <Label className="form-label" htmlFor="description">
                  Description
                </Label>
                <Controller
                  id="description"
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="textarea"
                      invalid={errors.description && true}
                      {...field}
                    />
                  )}
                />
                {errors.description ? (
                  <FormFeedback>{errors.description.message}</FormFeedback>
                ) : null}
              </div>

              <div className="form-group">
                <Label className="form-label" htmlFor="notify">
                  Notify To
                </Label>
                {!notifyMembersOpen && (
                  <div className="notify-checkbox">
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        id="All"
                        name="Notify"
                        value="All"
                        onClick={handleNotifyMembers}
                      />
                      <label htmlFor="All">To All Members</label>
                    </div>
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        id="ChoosePersons"
                        name="Notify"
                        value="ChoosePersons"
                        onClick={handleNotifyMembers}
                      />
                      <label htmlFor="ChoosePersons">Choose Persons</label>
                    </div>

                    <div className="checkbox">
                      <input
                        type="checkbox"
                        id="departments"
                        name="Notify"
                        value="departments"
                        onClick={handleNotifyMembers}
                      />
                      <label htmlFor="departments">
                        Choose Departments/Role
                      </label>
                    </div>
                  </div>
                )}
                {notifyMembersOpen && (
                  <Controller
                    id="notify"
                    name="notify"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="textarea"
                        invalid={errors.notify && true}
                        {...field}
                      />
                    )}
                  />
                )}
                {errors.notify ? (
                  <FormFeedback>{errors.notify.message}</FormFeedback>
                ) : null}
              </div>
              {successMessage && (
                <p className="text-center text-success pb-2 pt-4">
                  {successMessage}
                </p>
              )}
              {failMessage && (
                <p className="text-center text-danger pb-2 pt-4">
                  {failMessage}
                </p>
              )}
              {lengthError && (
                <p className="text-center text-danger pb-2 pt-4">
                  {lengthError}
                </p>
              )}
              {isLoading && (
                <img className="form-spinner" src={spinner} alt="" />
              )}
              <div className="submit-buttons-row">
                <div className="submit-buttons">
                  <div className="discard">
                    <button onClick={handleAddEventSidebar}>Discard</button>
                  </div>
                  <div className="send">
                    <button type="submi">Send</button>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={commentsSidebarOpen}
        toggle={handleCommentsSidebar}
        contentClassName="p-0 overflow-hidden"
        modalClassName="modal-slide-in event-sidebar"
      >
        <ModalHeader
          className="mb-1"
          toggle={handleCommentsSidebar}
          close={CloseBtnForComments}
          tag="div"
        >
          <div className="comment-modal-header">
            <div className="firstCharCircle">
              <p>
                {currentlyOpenedAnnouncement &&
                  currentlyOpenedAnnouncement.userName?.charAt(0)}
              </p>
            </div>
            <div className="modal-title">
              <h5>
                {currentlyOpenedAnnouncement &&
                  currentlyOpenedAnnouncement?.subject}
              </h5>
            </div>
            <div className="date">
              {currentlyOpenedAnnouncement &&
                currentlyOpenedAnnouncement.announcement_add_date}
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="modal-contents">
            <div className="cs-announcement">
              {currentlyOpenedAnnouncement &&
                currentlyOpenedAnnouncement.description}
            </div>
            <div className="comments">
              <div className="cm-title">Comments</div>
              <div className="cm-replies">{commentContent.length} replies</div>
            </div>
            {commentContent &&
              commentContent.map((m) => {
                return (
                  <div className="comment-box" key={m.id}>
                    <div className="header">
                      <div className="firstCharCircle">
                        <p>{m.event_user_name.charAt(0)}</p>
                      </div>
                      <div className="modal-title">
                        <h5>{m.event_user_name}</h5>
                      </div>
                      <div className="date">{m.time}</div>
                    </div>
                    <div className="comment">{m.comment}</div>
                  </div>
                )
              })}
          </div>
          <div className="add-comment-form">
            <Form className="add-form" onSubmit={onCommentFormSubmit}>
              <div className="comment-input">
                <Input
                  id="comment"
                  name="comment"
                  type="text"
                  value={commentEntered}
                  onChange={(e) => setCommentEntered(e.target.value)}
                  placeholder="Be a first comment"
                />
                <div className="send-shape">
                  <button type="submit">
                    {" "}
                    <img src={sendIcon} alt="icon" />
                  </button>
                </div>
              </div>
            </Form>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  )
}

export default RightBox
