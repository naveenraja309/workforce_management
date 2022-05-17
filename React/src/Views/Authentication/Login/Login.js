import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { useDispatch } from "react-redux"

import { handleLogin } from "../../../redux/authentication"

import { Label, Input, FormFeedback, Form, Button } from "reactstrap"

import { useForm, Controller } from "react-hook-form"

import "./Login.css"
import bitMap from "../../../assets/images/verifyOtp/Bitmap.png"
import spinner from "../../../assets/images/spinner.gif"


import { useHttpClient } from "../../../shared/hooks/http-hook"

const Login = () => {
  const { isLoading,sendRequest } = useHttpClient()
  const [successMessage, setSuccessMessage] = useState()
  const [failMessage, setFailMessage] = useState()
  const [lengthError, setLengthError] = useState()
  const dispatch = useDispatch()

  const history = useHistory()

  const defaultValues = {
    userName: "",
    password: ""
  }

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const onSubmit = (data) => {
    if (Object.values(data).every((field) => field.length > 0)) {
      const login = async () => {
        try {
          const responseData = await sendRequest(
            "/login",
            "POST",
            JSON.stringify({
              userName: data.userName,
              password: data.password
            }),
            {
              "Content-Type": "application/json"
            }
          )
          const apiSuccess = responseData.success === true
          if (apiSuccess) {
            dispatch(handleLogin(responseData.data))
            setSuccessMessage(responseData.message)
            setTimeout(() => {
              setSuccessMessage("")
              history.push(`/WorkforceManagement`)
            }, 2000)
          }
        } catch (err) {
          setFailMessage("Invaild credentials")
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

  const goEnterEmail = () => {
    history.push("/")
  }

  return (
    <React.Fragment>
      <section id="header">
        <div className="container-fluid">
          <div className="row m-0">
            <div className="col-xl-9 col-lg-8 col-md-6 col-12">
              <div className="company">SA-INTRANET</div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-12">
              <div className="login-box">
                <div className="contact">
                  <Button onClick={goEnterEmail}>Get Started</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="li-content">
        <div className="container-fluid">
          <div className="row m-0">
            <div className="col-xl-6 col-lg-6 col-md-12 col-12">
              <img src={bitMap} alt="img" />
            </div>
            <div className="col-xl-6 col-lg-6 col-md-12 col-12 content-box">
              <div className="content">
                <div className="title">Login to your app</div>
                <div className="promo-text">
                  To make a workspace from scratch, please confirm your email
                  address.
                </div>
                <div className="form">
                  <Form action="/" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                      <Label className="form-label" htmlFor="userName">
                        User Name
                      </Label>
                      <Controller
                        id="userName"
                        name="userName"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="email"
                            placeholder="Enter your email id"
                            invalid={errors.userName && true}
                            {...field}
                          />
                        )}
                      />
                      {errors.userName ? (
                        <FormFeedback>{errors.userName.message}</FormFeedback>
                      ) : null}
                    </div>
                    <div className="form-group pt-3">
                      <Label className="form-label" htmlFor="password">
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
                    <div className="row m-0 remember pt-2">
                      <div className="col-6 p-0">
                        <div className="form-check d-flex pt-2">
                          <Input type="checkbox" id="remember-me" />
                          <Label className="form-check-label" for="remember-me">
                            Remind Me
                          </Label>
                        </div>
                      </div>
                      <div className="col-6 p-0">
                        <p className="pt-2">Forgot Password?</p>
                      </div>
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
                    <Button type="submit">Sign In</Button>
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

export default Login
