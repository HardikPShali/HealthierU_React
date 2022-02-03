import React from "react"; //Suspense
//import Navbar from "./components/AdminModule/layout/Navbar";
//import LocalStorageService from "./util/LocalStorageService";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Loadable from 'react-loadable';
//import { getCurrentUserInfo } from "../src/service/AccountService";
//import Axios from "axios";
import Cookies from 'universal-cookie';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminRoutes = Loadable({
  loader: () => import('./components/AdminModule'),
  loading: () => <div></div>
});
const MainRoute = Loadable({
  loader: () => import('./Routing'),
  loading: () => <div></div>
});
const PatientRoute = Loadable({
  loader: () => import('./components/Patient Module'),
  loading: () => <div></div>
});
const DoctorRoute = Loadable({
  loader: () => import('./components/Doctor Module'),
  loading: () => <div></div>
});
const Logout = Loadable({
  loader: () => import('./components/Logout'),
  loading: () => <div></div>
});

const Routes = () => {
  const cookies = new Cookies();
  //const [currentUser, setUser] = useState({});

  // useEffect(() => {
  //   addState();
  // }, []);
  // const addState = async () => {

  //   if (LocalStorageService.getAccessToken()) {
  //     setUser(await getCurrentUserInfo());
  //   }

  // }

  const currentUser = cookies.get("currentUser");
  const { authorities = [] } = currentUser || {}
  //console.log("currentUser ::::::::::",currentUser);
  return (
    <Router>
      <div>
        <Switch>
          {!currentUser && (
            <Route component={MainRoute} />
          )}
          {authorities.some((user) => user === "ROLE_ADMIN" || user === "ROLE_USER") && (<>
            <Route path="/admin" component={AdminRoutes} />
            <Route exact path="(/|/signin)" component={Logout} />
          </>)}
          {authorities.some((user) => user === "ROLE_PATIENT") && (<>
            <Route path="/patient" component={PatientRoute} />
            <Route exact path="(/|/signin)" component={Logout} />
          </>)}
          {authorities.some((user) => user === "ROLE_DOCTOR") && (<>
            <Route path="/doctor" component={DoctorRoute} />
            <Route exact path="(/|/signin)" component={Logout} />
          </>)}
        </Switch>
        <ToastContainer />
      </div>
    </Router>
  )
}
export default Routes;