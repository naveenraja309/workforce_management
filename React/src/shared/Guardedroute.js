import React from "react"
import { Route, Redirect } from "react-router-dom"

const GuardedRoute = ({ component: Component, token, ...rest }) => (
  <Route
    {...rest}
    render={() => (token ? <Component /> : <Redirect to="/" />)}
  />
)

export default GuardedRoute
