import { Redirect, Route } from "react-router";
import React from 'react';
import Cookies from "universal-cookie";


const UnprotectedRoutes = ({ component: Component, ...restOfProps}) => {
    const cookies = new Cookies();
    const currentUser = cookies.get('currentUser');
    const { authorities = []} = currentUser || [];

    const redirectBasedOnRole = () => {
        let redirectUrl;
        {authorities.some((user) => user === "ROLE_ADMIN" || user === "ROLE_USER") && (
          redirectUrl = <Redirect to="/admin" />
          )}
        {authorities.some((user) => user === "ROLE_PATIENT") && (
          redirectUrl = <Redirect to="/patient" />
          )}
        {authorities.some((user) => user === "ROLE_DOCTOR") && (
          redirectUrl = <Redirect to="/doctor" />
          )}
    
          return redirectUrl
      }


    return <Route {...restOfProps} render={
        (props) => !currentUser ? <Component {...props} /> : redirectBasedOnRole()
    } />
}


export default UnprotectedRoutes;