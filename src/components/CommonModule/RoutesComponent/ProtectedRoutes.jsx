import { Redirect, Route } from "react-router";
import React from 'react';
import Cookies from "universal-cookie";


const ProtectedRoutes = ({  component: Component, role,  ...restOfProps}) => {
    const roleURLMapping = {
        'ROLE_ADMIN': '/admin',
        'ROLE_PATIENT': '/patient',
        'ROLE_DOCTOR': '/doctor'
    }
    const cookies = new Cookies();
    const currentUser = cookies.get('currentUser');
    const { authorities = []} = currentUser || [];

    const loggedInRolePageRedirection = (props) => {
        let customRoute = authorities.some((user) => user === role) ? (
            <Component {...props} />
          ) : <Redirect to={roleURLMapping[authorities[0]]} />
        return customRoute
    }

    return  <Route {...restOfProps} render={
        (props) => {
            if(!currentUser) {
                return <Redirect to="/signin" />
            } 

            return loggedInRolePageRedirection(props);
        } 
     } />
}


export default ProtectedRoutes;