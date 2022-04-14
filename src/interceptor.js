import React from 'react';
import * as axios from 'axios';
import { checkAccessToken } from './../src/service/RefreshTokenService';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import './App.css';
import Cookies from 'universal-cookie';

// axios.defaults.baseURL = 'https://api-healthieru.devtomaster.com/';

const errorHandler = (error) => {
    const cookies = new Cookies();
    const currentLoggedInUser = cookies.get("currentUser");
    let homeUrl;
    const { authorities = [] } = currentLoggedInUser || {}

      if (!currentLoggedInUser) {
        homeUrl = '/';
      }
      if (authorities.some((user) => user === "ROLE_ADMIN" || user === "ROLE_USER")) {
        homeUrl =  '/admin';
      }
      if (authorities.some((user) => user === "ROLE_PATIENT")) {
        homeUrl = '/patient';
      }
      if (authorities.some((user) => user === "ROLE_DOCTOR")) {
        homeUrl = '/doctor';
      }

    if (error.response && (error.response.status === 401)) {
        var index = error.response.headers['www-authenticate'] && error.response.headers['www-authenticate'].search("was not activated");
        if (index === -1) {
            checkAccessToken();
        }
    }
    //console.log("status ::: in error", error.response.status);
    if (error.response && (error.response.status === 504 || error.response.status === 500)) {
        confirmAlert({
            closeOnClickOutside: false,
            closeOnEscape: false,
            customUI: () => {
              return (
                <div className="custom-ui">
                  <h1>Oops !</h1>
                  <p>
                    Something went wrong. Unexpected error{" "}
                    <b style={{ color: "red" }}>:(</b>
                  </p>
                  <button
                    onClick={() => {
                      window.location.assign(homeUrl);
                    }}
                  >
                    Go to Homepage
                  </button>
                </div>
              );
            }
          });
    }
    return Promise.reject({ ...error })
}

axios.interceptors.response.use(
    response => {
        //console.log("Response :::", response.status);
        return response;
    },
    error => errorHandler(error)
)