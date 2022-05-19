import React, { useState } from "react"
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
import { useForm, Controller } from "react-hook-form"

import { useHttpClient } from "../../../../shared/hooks/http-hook"
import spinner from "../../../../assets/images/spinner.gif"
import "../RightBox.css"

const AddAnnouncementModal = (props) => {
  const [successMessage, setSuccessMessage] = useState()
  const [failMessage, setFailMessage] = useState()
  const [lengthError, setLengthError] = useState()
  const [startPicker, setStartPicker] = useState(new Date())
  const [eventTime, onChange] = useState("10:00")
  const [category, setCategory] = useState()
  const [expiresOn, setExpiresOn] = useState(new Date())

  const { isLoading, sendRequest } = useHttpClient()
  const userData = useSelector((state) => state.auth)
  const userId = userData?.userData.id
  const today = new Date()
  const date = today.getDate()
  const month = today.toLocaleString("default", { month: "long" })
  const year = today.getFullYear()
  const presentDay = `${date} ${month}, ${year}`

  const {
    handleAddEventSidebar,
    addSidebarOpen,
    handleNotifyMembers,
    notifyMembersOpen,
    pageReload
  } = props

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

  const CloseBtn = (
    <X
      className="cursor-pointer"
      size={15}
      onClick={handleAddEventSidebar}
      style={{ cursor: "pointer" }}
    />
  )

  const onAddFormSubmit = (data) => {
    if (data.subject && data.description && data.notify && category) {
      const addAnnouncement = async () => {
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
            pageReload()
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
      addAnnouncement()
    } else {
      setLengthError("please enter data in all the fields")
      setTimeout(() => {
        setLengthError("")
      }, 2000)
    }
  }

  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}

export default AddAnnouncementModal
