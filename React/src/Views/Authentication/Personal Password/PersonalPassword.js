import React, {useState} from "react"
import { useHistory, useParams } from "react-router-dom"

import { Label, Input, FormFeedback, Form, Button } from "reactstrap"

import { useForm, Controller } from "react-hook-form"

import "./PersonalPassword.css"
import mail from "../../../assets/images/EnterEmail/Shape.png"
import bitMap from "../../../assets/images/verifyOtp/Bitmap.png"
import spinner from "../../../assets/images/spinner.gif"


import { useHttpClient } from "../../../shared/hooks/http-hook"

const PersonalPassword = () => {
  const { sendRequest,isLoading } = useHttpClient()
  const [successMessage, setSuccessMessage] = useState()
  const [failMessage, setFailMessage] = useState()
  const [lengthError, setLengthError] = useState()

  const history = useHistory()
  var paramsId = useParams().id

  const defaultValues = {
    firstName: "",
    lastName: "",
    password: ""
  }

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const onSubmit = (data) => {
    if (Object.values(data).every((field) => field.length > 0)) {
      const setupApplication = async () => {
        try {
          const responseData = await sendRequest(
            "/personal-Password",
            "POST",
            JSON.stringify({
              firstName: data.firstName,
              lastName: data.lastName,
              password: data.password,
              id: paramsId
            }),
            {
              "Content-Type": "application/json"
            }
          )
          const apiSuccess = responseData.success === true
          if (apiSuccess) {
            setSuccessMessage(responseData.message)
            setTimeout(() => {
              setSuccessMessage("")
              history.push(`/login`)
            }, 2000)
          }
        } catch (err) {
          setFailMessage("Something went wrong again, please try again later")
          setTimeout(() => {
            setFailMessage("")
          }, 3000)
        }
      }
      setupApplication()
    } else {
      setLengthError("please enter data in all the fields")
      setTimeout(() => {
        setLengthError("")
      }, 2000)
    }
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
      <section id="pp-content">
        <div className="container-fluid">
          <div className="row m-0">
            <div className="col-xl-6 col-lg-6 col-md-12 col-12">
              <img src={bitMap} alt="img" />
            </div>
            <div className="col-xl-6 col-lg-6 col-md-12 col-12 content-box">
              <div className="content">
                <div className="title">Create Personal Password</div>
                <div className="promo-text">
                  To make a workspace from scratch, please confirm your email
                  address.
                </div>
                <div className="form">
                  <Form action="/" onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                      <div className="col-xl-6 col-lg-6 col-md-12 col-12">
                        {" "}
                        <div class="form-group">
                          <Label className="form-label" for="firstName">
                            First Name
                          </Label>
                          <Controller
                            id="firstName"
                            name="firstName"
                            control={control}
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder="John"
                                invalid={errors.firstName && true}
                                {...field}
                              />
                            )}
                          />
                          {errors.firstName ? (
                            <FormFeedback>
                              {errors.firstName.message}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-12 col-12">
                        {" "}
                        <div class="form-group">
                          <Label className="form-label" for="lastName">
                            Last Name
                          </Label>
                          <Controller
                            id="lastName"
                            name="lastName"
                            control={control}
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder="Smith"
                                invalid={errors.lastName && true}
                                {...field}
                              />
                            )}
                          />
                          {errors.lastName ? (
                            <FormFeedback>
                              {errors.lastName.message}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div class="form-group pt-3">
                      <Label className="form-label" for="password">
                        Password
                      </Label>

                      <Controller
                        id="password"
                        name="password"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder="Enter your password"
                            invalid={errors.password && true}
                            {...field}
                          />
                        )}
                      />
                      {errors.password ? (
                        <FormFeedback>{errors.password.message}</FormFeedback>
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
                    {lengthError && (
                      <p className="text-center text-danger pb-2 pt-4">
                        {lengthError}
                      </p>
                    )}
                    <Button type="submit">Complete</Button>
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

export default PersonalPassword
