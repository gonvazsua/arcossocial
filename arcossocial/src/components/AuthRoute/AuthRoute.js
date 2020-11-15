import React from 'react';
import './AuthRoute.css';
import { Redirect, Route } from "react-router";
const environment = require('../../Environment');

const AuthRoute = (props) => {
  const token = localStorage.getItem(environment.tokenKey);
  const userCode = localStorage.getItem(environment.userCodeKey);
  console.log("AuthRoute: " + token);
  if (token && userCode) { 
    return <Route {...props} />;
  } else {
    return <Redirect to="/" />;
  } 

};

AuthRoute.propTypes = {};

AuthRoute.defaultProps = {};

export default AuthRoute;
