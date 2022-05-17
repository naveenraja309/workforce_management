import React, { useState } from "react"
import { useHistory } from "react-router-dom"

import { Label, Input, FormFeedback, Form, Button } from "reactstrap"

import { useForm, Controller } from "react-hook-form"

import "./EnterEmail.css"
import mail from "../../../assets/images/EnterEmail/Shape.png"
import bitMap from "../../../assets/images/EnterEmail/Bitmap.png"
import spinner from "../../../assets/images/spinner.gif"
//** Custom Hooks
import { useHttpClient } from "../../../shared/hooks/http-hook"

const EnterEmail = () => {
  const { isLoading, sendRequest } = useHttpClient()
  const [successMessage, setSuccessMessage] = useState()
  const [failMessage, setFailMessage] = useState()
  const history = useHistory()

  const defaultValues = {
    email: ""
  }

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const onSubmit = async (data) => {
    try {
      const responseData = await sendRequest(
        "/email-verification",
        "POST",
        JSON.stringify({
          email: data.email
        }),
        {
          "Content-Type": "application/json"
        }
      )
      const apiSuccess = responseData.success === true
      if (apiSuccess) {
        var id = responseData.data[0]?.insertId
        setSuccessMessage(responseData.message)
        setTimeout(() => {
          setSuccessMessage("")
          history.push(`/verifyOtp/${id}`)
        }, 2000)
      } else {
        setFailMessage(responseData.message)
        setTimeout(() => {
          setFailMessage("")
        }, 3000)
      }
    } catch (err) {
      setFailMessage("Something went wrong again, please try again later")
      setTimeout(() => {
        setFailMessage("")
      }, 3000)
    }
  }

  const goLoginPage = () => {
    history.push("/login")
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
              <div className="home-login-box">
                <div
                  className="login"
                  style={{ cursor: "pointer" }}
                  onClick={goLoginPage}
                >
                  Login
                </div>
                <div className="contact">
                  <img src={mail} alt="mail" />
                  support@squashapps.com
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="ee-content">
        <div className="container-fluid">
          <div className="row m-0">
            <div className="col-xl-6 col-lg-6 col-md-12 col-12">
              <img src={bitMap} alt="img" />
            </div>
            <div className="col-xl-6 col-lg-6 col-md-12 col-12 content-box">
              <div className="content">
                <div className="title">Make Your Life Easy with Intranet!</div>
                <div className="promo-text">
                  To make a workspace from scratch, please confirm your email
                  address.
                </div>
                <div className="email-form">
                  <Form action="/" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                      <Label className="form-label" for="email">
                        Email Address
                      </Label>
                      <Controller
                        id="email"
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="email"
                            placeholder="name@email.com"
                            invalid={errors.email && true}
                            {...field}
                          />
                        )}
                      />
                      {errors.email ? (
                        <FormFeedback>{errors.email.message}</FormFeedback>
                      ) : null}
                    </div>
                    {isLoading && (
                      <img className="form-spinner" src={spinner} alt="" />
                    )}
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
                    <Button type="submit">Confirm Email</Button>
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

export default EnterEmail
