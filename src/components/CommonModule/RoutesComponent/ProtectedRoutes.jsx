import { Redirect, Route } from "react-router";
import React from 'react';


const ProtectedRoutes = ({ component: Component, ...restOfProps}) => {
    const cookies = new Cookies();
    const currentUser = cookies.get('currentUser');

    return <Route {...restOfProps} render={
        (props) => currentUser ? <Component {...props} /> : <Redirect to="/signin" />
    } />
}


export default ProtectedRoutes;