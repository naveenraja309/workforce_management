import React from "react"
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom"

import GuardedRoute from "./shared/Guardedroute"
import { useSelector } from "react-redux"

import Login from "./Views/Authentication/Login/Login"
import EnterEmail from "./Views/Authentication/Email Verification/EnterEmail"
import VerifyOtp from "./Views/Authentication/Email Verification/VerifyOtp"
import SetupApplication from "./Views/Authentication/SetupApplication/SetupApplication"
import PersonalPassword from "./Views/Authentication/Personal Password/PersonalPassword"
import WorkforceManagement from "./Views/WorkForce Management"

import "./App.css"

function App() {
  let routes
  const userData = useSelector((state) => state.auth)
  const token = userData?.userData.token

  routes = (
    <Switch>
      <Route path="/" exact>
        <EnterEmail />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/verifyOtp/:id">
        <VerifyOtp />
      </Route>
      <Route path="/setupApplication/:id">
        <SetupApplication />
      </Route>
      <Route path="/personalPassword/:id">
        <PersonalPassword />
      </Route>
      <GuardedRoute
        path="/WorkforceManagement"
        component={WorkforceManagement}
        token={token}
      />

      <Redirect to="/" />
    </Switch>
  )

  return (
    <Router>
      <main>{routes}</main>
    </Router>
  )
}

export default App
