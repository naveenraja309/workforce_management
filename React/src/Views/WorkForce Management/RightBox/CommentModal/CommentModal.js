import React, { useState} from "react"

import { Modal, ModalHeader, ModalBody, Form, Input } from "reactstrap"
import { X } from "react-feather"

import sendIcon from "../../../../assets/images/icons/Shape.png"
import { useHttpClient } from "../../../../shared/hooks/http-hook"

const CommentModal = (props) => {
  const [commentEntered, setCommentEntered] = useState()
  const { sendRequest } = useHttpClient()

  const {
    commentContent,
    currentlyOpenedAnnouncement,
    currentlyOpenedCommentId,
    userName,
    handleCommentsSidebar,
    userData,
    commentsSidebarOpen
  } = props
  const today = new Date()
  const date = today.getDate()
  const month = today.toLocaleString("default", { month: "long" })
  const year = today.getFullYear()
  const presentDay = `${date} ${month}, ${year}`

  const CloseBtnForComments = (
    <X
      className="cursor-pointer"
      size={15}
      onClick={handleCommentsSidebar}
      style={{ cursor: "pointer" }}
    />
  )

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

  return (
    <React.Fragment>
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

export default CommentModal
