import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Loader from '../../Loader/Loader';
import LocalStorageService from '../../../util/LocalStorageService';
import Navbar from '../layout/Navbar';
import 'mdbreact/dist/css/mdb.css';
//import Cookies from 'universal-cookie';
import moment from 'moment';


const User = () => {

  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [user, setUser] = useState({});
  //const cookies = new Cookies();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
    getCurrentUser();
  }, []);
  //const currentUserAuthorities = cookies.get("authorities");
  // const apiName = currentUserAuthorities === "ROLE_DOCTOR" ? 'doctors'
  //   : currentUserAuthorities === "ROLE_PATIENT" ? 'patients' : '';

    const getCurrentUser = () => {
    var payload = {
      method: 'get',
      mode: 'no-cors',
      url: `/api/users/` + id,
      headers: {
        'Authorization': 'Bearer ' + LocalStorageService.getAccessToken(),
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
    axios(payload).then(res => {
      if (res && res.data) {
        
        setUser(res.data);
      }
    })
    // .catch(error => {
    //   if (error.response && error.response.status === 401) {
    //     checkAccessToken();
    //   }
    // })
  }
  return (
    <div>
      {loading && (
        <Loader />
      )}
      <Navbar />
      <div className="container py-4">
        <Link className="btn btn-primary" to="/admin">
          back to Home
      </Link>
        <h1 className="display-4">{user && user.firstName} {user && user.lastName}</h1>
        <hr />
        <table className="table table-bordered">
          <tbody>
            <tr><th>First Name:</th><td>{user && user.firstName}</td></tr>
            <tr><th>Last Name:</th><td>{user && user.lastName}</td></tr>
            <tr><th>Email:</th><td>{user && user.email}</td></tr>
            <tr><th>UserName:</th><td>{user && user.login}</td></tr>
            <tr><th>Role:</th><td>{user && user.authorities && user.authorities.some(role => role === "ROLE_DOCTOR") ? 'Doctor'
              : user && user.authorities && user.authorities.some(role => role === "ROLE_PATIENT")
                ? 'Patient' : user && user.authorities && user.authorities.some(role => role === "ROLE_ADMIN")
                  ? 'Administrator' : ''}</td></tr>
            <tr><th>Sign Up Date:</th><td>{moment(user && user.createdDate).format("DD MMM, YYYY hh:mm A")}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;