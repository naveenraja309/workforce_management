import React, {useState} from "react"
import { useHistory, useParams } from "react-router-dom"

import { Label, Input, FormFeedback, Form, Button } from "reactstrap"

import { useForm, Controller } from "react-hook-form"

import "./SetupApplication.css"
import mail from "../../../assets/images/EnterEmail/Shape.png"
import bitMap from "../../../assets/images/verifyOtp/Bitmap.png"
import spinner from "../../../assets/images/spinner.gif"


import { useHttpClient } from "../../../shared/hooks/http-hook"

const SetupApplication = () => {
  const { isLoading,sendRequest } = useHttpClient()
  const [successMessage, setSuccessMessage] = useState()
  const [failMessage, setFailMessage] = useState()
  const [lengthError, setLengthError] = useState()

  const history = useHistory()
  var paramsId = useParams().id

  const defaultValues = {
    companyName: "",
    Location: "",
    Employees: "",
    Domain: ""
  }

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const onSubmit = (data) => {
    if (Object.values(data).every((field) => field.length > 0)) {
      const setupApplication = async () => {
        const domain = `${data.Domain}@intranet.com`
        try {
          const responseData = await sendRequest(
            "/setup-application",
            "POST",
            JSON.stringify({
              companyName: data.companyName,
              Location: data.Location,
              Employees: data.Employees,
              Domain: domain,
              id:paramsId
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
              history.push(`/personalPassword/${paramsId}`)
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
      <section id="sa-content">
        <div className="container-fluid">
          <div className="row m-0">
            <div className="col-xl-6 col-lg-6 col-md-12 col-12">
              <img src={bitMap} alt="img" />
            </div>
            <div className="col-xl-6 col-lg-6 col-md-12 col-12 content-box">
              <div className="content">
                <div className="title">Setup Your Application</div>
                <div className="promo-text">
                  To make a workspace from scratch, please confirm your email
                  address.
                </div>
                <div className="form">
                  <Form action="/" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                      <Label className="form-label" for="companyName">
                        Company Name
                      </Label>
                      <Controller
                        id="companyName"
                        name="companyName"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder="Enter your company name"
                            invalid={errors.companyName && true}
                            {...field}
                          />
                        )}
                      />
                      {errors.companyName ? (
                        <FormFeedback>
                          {errors.companyName.message}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="row">
                      <div className="col-xl-6 col-lg-6 col-md-12 col-12 pt-3">
                        {" "}
                        <div className="form-group">
                          <Label className="form-label" for="Location">
                            Location
                          </Label>
                          <Controller
                            id="Location"
                            name="Location"
                            control={control}
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder="coimbatore"
                                invalid={errors.Location && true}
                                {...field}
                              />
                            )}
                          />
                          {errors.Location ? (
                            <FormFeedback>
                              {errors.Location.message}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-12 col-12 pt-3">
                        {" "}
                        <div className="form-group">
                          <Label className="form-label" for="Location">
                            No. of Employees
                          </Label>
                          <Controller
                            id="Employees"
                            name="Employees"
                            control={control}
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder="123"
                                invalid={errors.Employees && true}
                                {...field}
                              />
                            )}
                          />
                          {errors.Employees ? (
                            <FormFeedback>
                              {errors.Employees.message}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="form-group pt-3">
                      <Label className="form-label" for="Domain">
                        Domain Name
                      </Label>
                      <div className="row m-0 fullDomain">
                        <div className="col-xl-10 col-lg-9 col-md-8 col-8 email">
                          {" "}
                          <Controller
                            id="Domain"
                            name="Domain"
                            control={control}
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder="Customize your domain name"
                                invalid={errors.Domain && true}
                                {...field}
                              />
                            )}
                          />
                          {errors.Domain ? (
                            <FormFeedback>{errors.Domain.message}</FormFeedback>
                          ) : null}
                        </div>
                        <div className="col-xl-2 col-lg-3 col-md-4 col-4 domain">
                          <div className="domain-end">
                            <span>@intranet.com</span>
                          </div>
                        </div>
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
                    <Button type="submit">Next</Button>
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

export default SetupApplication
