import React, { useEffect } from "react";
import Cookies from 'universal-cookie';
import Loader from './Loader/Loader'

const Logout = () => {
    const cookies = new Cookies();
    useEffect(() => {
      cookies.remove("refresh_token",{ path: '/'});
      cookies.remove("currentUser",{ path: '/'});
      cookies.remove("access_token",{ path: '/'});
      cookies.remove("GOOGLE_ACCESS_TOKEN",{ path: '/'});
      cookies.remove("GOOGLE_PROFILE_DATA",{ path: '/'});
      cookies.remove("authorities",{ path: '/'});
      cookies.remove("userProfileCompleted",{ path: '/'});
      //userProfileCompleted
        //setTimeout(()=>{window.location.reload()},500);
        //window.location.reload();
        window.location.assign('/signin');
      }, [cookies]);
      return(
        <><Loader/></>
      );
}
export default Logout;
