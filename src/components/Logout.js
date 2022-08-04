import React, { useEffect } from "react";
// import { useHistory } from "react-router";
import Cookies from 'universal-cookie';
import { deleteTokenHandler } from "../util";
import Loader from './Loader/loaderLogout'

const Logout = () => {
  const cookies = new Cookies();
  // const history = useHistory();
  useEffect(() => {

    // cookies.getAll().map((cookie) => {
    //   debugger;
    //   cookies.remove(cookie.name);
    // });

    const allCookies = cookies.getAll()

    for (let key in allCookies) {
      cookies.remove(key)

    }

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
      // history.push("/");
      // history.go(0);
      window.location.href = "/";
    }).catch(err => {
      localStorage.clear();
      // history.push("/");
      // history.go(0);
      window.location.href = "/";
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
