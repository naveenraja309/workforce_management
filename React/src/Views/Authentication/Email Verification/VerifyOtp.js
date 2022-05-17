import React, { useState } from "react"
import { useHistory, useParams } from "react-router-dom"

import { Input, Form, Label, Button } from "reactstrap"

import "./VerifyOtp.css"
import mail from "../../../assets/images/EnterEmail/Shape.png"
import bitMap from "../../../assets/images/verifyOtp/Bitmap.png"
import spinner from "../../../assets/images/spinner.gif"


import { useHttpClient } from "../../../shared/hooks/http-hook"

const VerifyOtp = () => {
  const { isLoading,sendRequest } = useHttpClient()
  const [successMessage, setSuccessMessage] = useState()
  const [failMessage, setFailMessage] = useState()
  const [otpLengthError, setOtpLengthError] = useState()
  const history = useHistory()
  var paramsId = useParams().id

  const focusHandler = (event) => {
    const form = event.target.form
    const index = [...form].indexOf(event.target)
    form.elements[index + 1].focus()
    event.preventDefault()
  }

  const handleReset = () => {
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    )
  }

  const verifyOtpHandler = (event) => {
    event.preventDefault()
    const otp = []
    if (event.target) {
      for (let i = 0; i < 6; i++) {
        otp.push(event.target[i].value)
      }
    }
    if (
      otp[0] !== "" &&
      otp[1] !== "" &&
      otp[2] !== "" &&
      otp[3] !== "" &&
      otp[4] !== "" &&
      otp[5] !== ""
    ) {
      const verifyOtp = async () => {
        const otpEntered = otp.join("")
        try {
          const responseData = await sendRequest(
            "/verify-otp",
            "POST",
            JSON.stringify({
              otp: otpEntered,
              id: paramsId
            }),
            {
              "Content-Type": "application/json"
            }
          )
          const apiSuccess = responseData.success === true
          if (apiSuccess) {
            handleReset()
            setFailMessage("")
            setSuccessMessage(responseData.message)
            setTimeout(() => {
              setSuccessMessage("")
              history.push(`/setupApplication/${paramsId}`)
            }, 2000)
          } else {
            setFailMessage("Please enter valid verification code")
            handleReset()
          }
        } catch (err) {
          setFailMessage("Please enter valid verification code")
          setTimeout(() => {
            handleReset()
            setFailMessage("")
          }, 3000)
        }
      }
      verifyOtp()
    } else {
      setOtpLengthError("please enter all 6 digits")
      setTimeout(() => {
        setOtpLengthError("")
      }, 2000)
    }
  }

  const resendOtpHandler = () => {
    const resendOtp = async () => {
      try {
        const responseData = await sendRequest(
          "/resend-otp",
          "POST",
          JSON.stringify({
            id: paramsId
          }),
          {
            "Content-Type": "application/json"
          }
        )
        const apiSuccess = responseData.success === true
        if (apiSuccess) {
          setFailMessage("")
          handleReset()
          setSuccessMessage(responseData.message)
          setTimeout(() => {
            setSuccessMessage("")
          }, 2000)
        } else {
          setFailMessage("ShowOtpFailed")
          setTimeout(() => {
            handleReset()
            setFailMessage("")
          }, 2000)
        }
      } catch (err) {
        setFailMessage("Something Went Wrong, Please try again later!")
        setTimeout(() => {
          handleReset()
          setFailMessage("")
        }, 2000)
      }
    }
    resendOtp()
  }

  return (
    <React.Fragment>
      <section id="header">
        <div className="container-fluid">
          <div className="row m-0">
            <div className="col-xl-8 col-lg-8 col-md-6 col-12">
              <div className="company">SA-INTRANET</div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-12">
              <div className="login-box">
                <div className="contact">
                  <img src={mail} alt="mail" />
                  support@squashapps.com
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="vo-content">
        <div className="container-fluid">
          <div className="row m-0">
            <div className="col-xl-6 col-lg-6 col-md-12 col-12">
              <img src={bitMap} alt="img" />
            </div>
            <div className="col-xl-6 col-lg-6 col-md-12 col-12 content-box">
              <div className="content">
                <div className="title">We’ve sent you a mail!</div>
                <div className="promo-text">
                  To make a workspace from scratch, please confirm your email
                  address.
                </div>
                <div className="form">
                  <Form action="/" onSubmit={verifyOtpHandler}>
                    <Label>Enter your verification code</Label>
                    <div className="auth-input-wrapper d-flex align-items-center justify-content-between">
                      <Input
                        type="number"
                        name="1"
                        id="1"
                        autoFocus
                        onChange={focusHandler}
                        maxLength="1"
                        className="numberInput"
                        onInput={(e) => {
                          e.target.value = e.target.value.slice(0, 1)
                        }}
                      />
                      <Input
                        onChange={focusHandler}
                        type="number"
                        name="2"
                        id="2"
                        className="numberInput"
                        maxLength="1"
                        onInput={(e) => {
                          e.target.value = e.target.value.slice(0, 1)
                        }}
                      />
                      <Input
                        onChange={focusHandler}
                        type="number"
                        name="3"
                        id="3"
                        className="numberInput"
                        maxLength="1"
                        onInput={(e) => {
                          e.target.value = e.target.value.slice(0, 1)
                        }}
                      />
                      <Input
                        onChange={focusHandler}
                        type="number"
                        name="4"
                        id="4"
                        className="numberInput"
                        maxLength="1"
                        onInput={(e) => {
                          e.target.value = e.target.value.slice(0, 1)
                        }}
                      />
                      <Input
                        onChange={focusHandler}
                        type="number"
                        name="5"
                        id="5"
                        className="numberInput"
                        maxLength="1"
                        onInput={(e) => {
                          e.target.value = e.target.value.slice(0, 1)
                        }}
                      />
                      <Input
                        type="number"
                        name="6"
                        id="6"
                        className="numberInput"
                        maxLength="1"
                        onInput={(e) => {
                          e.target.value = e.target.value.slice(0, 1)
                        }}
                      />
                    </div>
                    {successMessage && (
                      <p className="text-center text-success pb-2 pt-4">
                        {successMessage}
                      </p>
                    )}
                    {failMessage && (
                      <div className="d-flex pb-2 mt-4">
                        <p className="text-center text-danger">
                          Please enter valid verification code.
                        </p>{" "}
                        <p
                          onClick={resendOtpHandler}
                          className="text-center text-primary pl-3"
                          style={{ cursor: "pointer" }}
                        >
                          Resend Code
                        </p>
                      </div>
                    )}
                     {isLoading && (
                      <img className="form-spinner" src={spinner} alt="" />
                    )}
                    {otpLengthError && (
                      <p className="text-center text-danger pb-2 pt-4">
                        {otpLengthError}
                      </p>
                    )}
                    <Button type="submit">Confirm</Button>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  )
}

export default VerifyOtp
