import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import LocalStorageService from "../../../util/LocalStorageService";



const UserList = ({ user, getUserList }) => {
    const approveDoctor = async (selectedUser) => {
        selectedUser.approved = true;
        var payload = {
            method: 'post',
            mode: 'no-cors',
            data: selectedUser,
            url: `/api/account/approve`,
            headers: {
                'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };
        axios(payload).then(response => {
            if (response.status === 200 || response.status === 201) {
                getUserList();
            }
        })
    }
    return (

        <tr>
            {/* <th scope="row" key="id">{index + 1}</th> */}
            <td key="name">{user.firstName}</td>
            <td key="username">{user.lastName}</td>
            <td key="email">{user.email}</td>
            <td key="email">{user.authorities.some((user) => user === "ROLE_DOCTOR") && (
                  <span>Doctor</span>
                )}
                {user.authorities.some((user) => user === "ROLE_PATIENT") && (
                  <span>Patient</span>
                )}</td>
            <td>
                <Link className="btn btn-primary mr-2" to={{
                    pathname: `/admin/user-management/users/${user.id}`,
                    user
                }}>
                    View
                  </Link>
                {user.authorities == "ROLE_DOCTOR" && !user.approved && (
                    <React.Fragment>
                        <button className="btn btn-success mr-2" onClick={() => approveDoctor(user)}>Accept</button>
                        {/* <button className="btn btn-danger">Decline</button> */}
                    </React.Fragment>
                )}
            </td>
        </tr>
    );
};

export default UserList;
