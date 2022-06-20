import React, { useEffect } from "react";
import { useHistory } from "react-router";
import Cookies from 'universal-cookie';
import { deleteTokenHandler } from "../util";
import Loader from './Loader/Loader'

const Logout = () => {
  const cookies = new Cookies();
  const history = useHistory();
  useEffect(() => {
    cookies.remove("refresh_token", { path: '/' });
    cookies.remove("currentUser", { path: '/' });
    cookies.remove("access_token", { path: '/' });
    cookies.remove("GOOGLE_ACCESS_TOKEN", { path: '/' });
    cookies.remove("GOOGLE_PROFILE_DATA", { path: '/' });
    cookies.remove("authorities", { path: '/' });
    cookies.remove("userProfileCompleted", { path: '/' });
    cookies.remove("profileDetails", { path: '/' });
    deleteTokenHandler().then(() => {
      localStorage.clear();
      history.push("/");
      history.go(0);
    });
    //userProfileCompleted
    //setTimeout(()=>{window.location.reload()},500);
    //window.location.reload();
    // history.push('/');
    // history.go(0);
  }, [cookies]);
  return (
    <><Loader /></>
  );
}
export default Logout;
