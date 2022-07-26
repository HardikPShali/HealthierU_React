import React, { useEffect, useState } from "react"; //Suspense
//import Navbar from "./components/AdminModule/layout/Navbar";
//import LocalStorageService from "./util/LocalStorageService";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Loadable from 'react-loadable';
//import { getCurrentUserInfo } from "../src/service/AccountService";
//import Axios from "axios";
import Cookies from 'universal-cookie';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UnprotectedRoutes from "./components/CommonModule/RoutesComponent/UnprotectedRoutes";
import ProtectedRoutes from "./components/CommonModule/RoutesComponent/ProtectedRoutes";
import Loader from "./components/Loader/Loader";


const ForgetPassword = Loadable({
  loader: () => import('./components/Login-Module/ForgetPassword'),
  loading: () => <Loader />
});
const CreatePassword = Loadable({
  loader: () => import('./components/Login-Module/CreatePassword'),
  loading: () => <Loader />
});
const Signup = Loadable({
  loader: () => import('./components/Signup Module/Signup'),
  loading: () => <Loader />
});
const Healthbehaviour = Loadable({
  loader: () => import('./components/Signup Module/Healthbehaviour'),
  loading: () => <Loader />
});
const Signupform = Loadable({
  loader: () => import('./components/Signup Module/Signupform'),
  loading: () => <Loader />
});
const AboutUs = Loadable({
  loader: () => import('./components/Login-Module/about-us'),
  loading: () => <Loader />
});

const ViewArticle = Loadable({
  loader: () => import('./components/Login-Module/ViewArticle'),
  loading: () => <Loader />
});

const PrivacyPolicyPage = Loadable({
  loader: () => import('./components/CommonModule/PrivacyPolicy'),
  loading: () => <Loader />
});

const TermsAndConditionsPage = Loadable({
  loader: () => import('./components/CommonModule/TermsAndConditions'),
  loading: () => <Loader />
});

const HelpAndSupportPage = Loadable({
  loader: () => import('./components/CommonModule/HelpAndSupport'),
  loading: () => <Loader />
});

const LicensesPage = Loadable({
  loader: () => import('./components/CommonModule/Licenses'),
  loading: () => <Loader />
});

const PartnersPage = Loadable({
  loader: () => import('./components/CommonModule/Partners'),
  loading: () => <Loader />
});
const SelectRolePage = Loadable({
  loader: () => import('./components/Signup Module/components/selectRole'),
  loading: () => <Loader />
});

const PaypalMob = Loadable({
  loader: () => import('./components/Patient Module/MobilePayment/PaypalMobile'),
  loading: () => <Loader />
});

const AdminRoutes = Loadable({
  loader: () => import('./components/AdminModule'),
  loading: () => <Loader />
});
const MainRoute = Loadable({
  loader: () => import('./Routing'),
  loading: () => <Loader />
});
const PatientRoute = Loadable({
  loader: () => import('./components/Patient Module'),
  loading: () => <Loader />
});
const DoctorRoute = Loadable({
  loader: () => import('./components/Doctor Module'),
  loading: () => <Loader />
});
// const Logout = Loadable({
//   loader: () => import('./components/Logout'),
//   loading: () => <div></div>
// });

const Signin = Loadable({
  loader: () => import('./components/Login-Module/Signin'),
  loading: () => <Loader />
});

const Homepage = Loadable({
  loader: () => import('./components/Login-Module/Homepage'),
  loading: () => <Loader />
});

const AboutUsMobile = Loadable({
  loader: () => import('./components/CommonModule/MobilePages/AboutUsMobile'),
  loading: () => <Loader />
});

const HelpUsMobile = Loadable({
  loader: () => import('./components/CommonModule/MobilePages/HelpAndSupportMobile'),
  loading: () => <Loader />
});

const PrivacySecurityMobile = Loadable({
  loader: () => import('./components/CommonModule/MobilePages/PrivacyAndSecurityMobile'),
  loading: () => <Loader />
})

const TermsAndConditionsMobile = Loadable({
  loader: () => import('./components/CommonModule/MobilePages/TermsAndConditionsMobile'),
  loading: () => <Loader />
});

const Routes = () => {
  // const [currentUser, setCurrentUser] = useState(false);
  // const [authorities, setAuthorities] = useState([]);
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

  // useEffect(() => {
  //   setCurrentUser(cookies.get('currentUser'));
  // }, [])

  // useEffect(() => {
  //   setAuthorities(currentUser.authorities);
  // }, [currentUser])

  const currentUser = cookies.get('currentUser');
  const { authorities = [] } = currentUser || [];


  const redirectBasedOnRole = () => {
    let redirectUrl;
    {
      authorities.some((user) => user === "ROLE_ADMIN" || user === "ROLE_USER") && (
        redirectUrl = <Redirect to="/admin" />
      )
    }
    {
      authorities.some((user) => user === "ROLE_PATIENT") && (
        redirectUrl = <Redirect to="/patient" />
      )
    }
    {
      authorities.some((user) => user === "ROLE_DOCTOR") && (
        redirectUrl = <Redirect to="/doctor" />
      )
    }

    return redirectUrl
  }
  //console.log("currentUser ::::::::::",currentUser);
  return (
    <Router>
      <div>
        <Switch>

          {/* <Route component={MainRoute} /> */}
          <UnprotectedRoutes exact path="/" component={Homepage} />
          <UnprotectedRoutes exact path="/signup" component={Signup} />
          <UnprotectedRoutes exact path="/signupform" component={Signupform} />
          <UnprotectedRoutes exact path="/healthbehaviour" component={Healthbehaviour} />
          <UnprotectedRoutes exact path="/signin" component={Signin} />
          <UnprotectedRoutes exact path="/forgetpassword" component={ForgetPassword} />
          <UnprotectedRoutes exact path="/createpassword" component={CreatePassword} />
          <UnprotectedRoutes exact path="/about-us" component={AboutUs} />
          <UnprotectedRoutes exact path="/article/:id" component={ViewArticle} />
          <UnprotectedRoutes exact path="/privacy-policy" component={PrivacyPolicyPage} />
          <UnprotectedRoutes exact path="/terms-and-conditions" component={TermsAndConditionsPage} />
          <UnprotectedRoutes exact path="/help-and-support" component={HelpAndSupportPage} />
          <UnprotectedRoutes exact path="/licenses" component={LicensesPage} />
          <UnprotectedRoutes exact path="/partners" component={PartnersPage} />
          <UnprotectedRoutes exact path="/select-role" component={SelectRolePage} />
          <Route exact path='/mobile-payment' component={(props) => <PaypalMob {...props} />} />
          <UnprotectedRoutes exact path='/about-mobile' component={() => <AboutUsMobile />} />
          <UnprotectedRoutes exact path='/help-us-mobile' component={() => <HelpUsMobile />} />
          <UnprotectedRoutes exact path='/privacy-security-mobile' component={() => <PrivacySecurityMobile />} />
          <UnprotectedRoutes exact path='/terms-and-conditions-mobile' component={() => <TermsAndConditionsMobile />} />
          {/* {authorities.some((user) => user === "ROLE_ADMIN" || user === "ROLE_USER") && (<> */}
          <ProtectedRoutes path="/admin" role="ROLE_ADMIN" component={AdminRoutes} />
          {/* <Route exact path="(/|/signin)" component={Logout} /> */}
          {/* </>)} */}
          {/* {authorities.some((user) => user === "ROLE_PATIENT") && (<> */}
          <ProtectedRoutes path="/patient" role="ROLE_PATIENT" component={PatientRoute} />
          {/* <Route exact path="(/|/signin)" component={Logout} /> */}
          {/* </>)} */}
          {/* {authorities.some((user) => user === "ROLE_DOCTOR") && (<> */}
          <ProtectedRoutes path="/doctor" role="ROLE_DOCTOR" component={DoctorRoute} />
          {/* <Route exact path="(/|/signin)" component={Logout} /> */}
          {/* </>)} */}
          <Redirect to="/signin" />
        </Switch>
        <ToastContainer />
      </div>
    </Router>
  )
}
export default Routes;