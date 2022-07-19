import React, { useEffect, useState, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
// import Loadable from "react-loadable";
import momentTz from "moment-timezone";

import LocalStorageService from "./../../util/LocalStorageService";
import { getCurrentPatientInfo } from "../../service/AccountService";
//import { checkAccessToken } from '../../service/RefreshTokenService';
//import Cookies from 'universal-cookie';
import Header from "./Header";
import Footer from "./Footer";
import { firestoreService, chatAndVideoService, getFirebaseToken, getPermissions, onMessageListener } from "../../util";
import Loader from '../Loader/Loader'
import {
  getFcmTokenApi,
  updatePatientTimeZone,
  // getModulesDetailsByIds
} from "../../service/frontendapiservices";
import Cookies from "universal-cookie";
import moment from "moment";


const Mydoctor = React.lazy(() => import("./Mydoctor"));
const RescheduleAppointment = React.lazy(() => import("./RescheduleAppointment"));
const Homepage = React.lazy(() => import("./Homepage"));
const Profile = React.lazy(() => import("./Profile"));
const Logout = React.lazy(() => import("../Logout"));
const Myappointment = React.lazy(() => import("./Myappointment"));

const QuestionnaireView = React.lazy(() => import("./questionnaire/QuestionnaireView"));

const QuestionnaireEdit = React.lazy(() => import("./questionnaire/QuestionnaireEdit"));

const PatientChatNew = React.lazy(() => import("../Patient Module/PatientChatNew"));

const PatientDocument = React.lazy(() => import("../Patient Module/fille-upload/PatientDocument"));

// const Meeting = React.lazy(() => import("./../video-call/pages/meeting"));
const Nutrition = React.lazy(() => import("./nutrition"));
const PatientShop = React.lazy(() => import("../Patient Module/patientshop"));
const Workout = React.lazy(() => import("../Patient Module/workout"));
// const GlobalSearch = React.lazy(() => import("../Patient Module/globalsearch"));
const AboutUs = React.lazy(() => import("../Login-Module/about-us"));
const PatientArticle = React.lazy(() => import("./articles"));
const ChangeAccountPassword = React.lazy(() => import("./changepassword"));
const PrivacyPolicyPage = React.lazy(() => import("../CommonModule/PrivacyPolicy"));
const TermsAndConditionsPage = React.lazy(() => import("../CommonModule/TermsAndConditions"));
const HelpAndSupportPage = React.lazy(() => import("../CommonModule/HelpAndSupport"));
const LicensesPage = React.lazy(() => import("../CommonModule/Licenses"));
const PartnersPage = React.lazy(() => import("../CommonModule/Partners"));

const RescheduleFromPatient = React.lazy(() => import("../Patient Module/RescheduleFromPatient/RescheduleFromPatient"));

const Questionnaire = React.lazy(() => import("./QuestionnaireNew/Questionnaire"));
const HealthAssessmentReportPatient = React.lazy(() => import("./HealthAssessmentReport/HealthAssessmentReportPatient"));

// const Explore = Loadable({
//   loader: () => import("./explore"),
//   loading: () => <div></div>,
// });

const PatientRoute = () => {
  const currentuserInfo = LocalStorageService.getCurrentUser();
  console.log("currentuserInfo", currentuserInfo);
  const [currentPatient, setCurrentPatient] = useState({});
  const [chatGroupList, setChatGroupList] = useState({});
  const [updateChatGroupListTrigger, setUpdateChatGroupListTrigger] = useState(0);
  const [addedNewChatGroupListTrigger, setAddedNewUpdateChatGroupListTrigger] = useState(0);
  const [doctorDetailsList, setDoctorDetailsList] = useState({});
  const [unReadMessageList, setUnReadMessageList] = useState({});
  const [trigger, setTrigger] = useState(0);
  const [restartFirebaseLogin, setRestartFirebaseLogin] = useState(0);
  const systemTimeZone = momentTz.tz.guess();

  const [tokenFound, setTokenFound] = useState(false);

  const cookie = new Cookies();

  useEffect(() => {

    {
      currentuserInfo.profileCompleted == true &&
        getCurrentPatient();
    }

    if (currentuserInfo.profileCompleted == true) {
      fcmTokenGenerationHandler();
    }

  }, []);


  const getCurrentPatient = async () => {
    // const currentPatient = await getCurrentPatientInfo(currentuserInfo.id, currentuserInfo.login);
    const currentPatient = cookie.get('profileDetails');
    console.log('Current patient', currentPatient);
    setCurrentPatient(currentPatient);
    if (currentPatient?.patientTimeZone !== systemTimeZone) {
      handleSubmit(currentPatient.id, systemTimeZone);
    }
  };

  const handleSubmit = async (id, timezone) => {
    const payload = {
      id: id,
      patientTimeZone: timezone,
    };
    await updatePatientTimeZone(payload);
  };


  const fcmTokenGenerationHandler = async () => {
    let tokenToBeGenerated;
    const tokenFunction = async () => {
      tokenToBeGenerated = await getFirebaseToken(setTokenFound);
      onMessageListener();

      if (tokenToBeGenerated) {
        console.log({ tokenToBeGenerated });
      }
      return tokenToBeGenerated;
    };

    const getPermission = async () => {
      const permission = await getPermissions();
      if (permission === 'granted') {
        tokenFunction();
      }
    };
    getPermission();
    // alert('token generated')
  }

  // const [displayCaller, setDisplayCaller] = useState(true);

  // const onCallerClose = () => {
  //   setDisplayCaller(false);
  // }

  return (
    <Suspense fallback={<Loader />}>
      {currentuserInfo?.profileCompleted === true && <Header doctorDetailsList={doctorDetailsList} unReadMessageList={unReadMessageList} trigger={trigger} currentPatient={currentPatient} />}
      <Switch>
        <Route exact path="/patient" render={(props) => <Homepage currentuserInfo={currentuserInfo} {...props} />} />
        <Route exact path="/patient/mydoctor" render={(props) => <Mydoctor currentPatient={currentPatient} chatGroupList={chatGroupList} {...props} />} />
        <Route exact path="/patient/rescheduleappointment/:id/:type/:unifiedAppt" render={(props) => <RescheduleAppointment currentPatient={currentPatient} chatGroupList={chatGroupList} {...props} />} />
        <Route exact path="/patient/profile" component={Profile} />
        <Route exact path="/patient/myappointment" render={(props) => <Myappointment currentPatient={currentPatient} doctorDetailsList={doctorDetailsList} {...props} />} />
        <Route exact path="/patient/questionnaire/:new" component={Questionnaire} />
        <Route exact path="/patient/health-assessment" component={HealthAssessmentReportPatient} />
        <Route exact path="/patient/reschedule-appointment/:id/:type/:unifiedAppt" render={(props) => <RescheduleFromPatient currentPatient={currentPatient} chatGroupList={chatGroupList} {...props} />} />
        {/* <Route exact path="/patient/questionnaire/edit" component={QuestionnaireEdit} /> */}
        {/* <Route exact path="/patient/explore" component={Explore} /> */}
        <Route
          exact
          path="/patient/chat"
          render={(props) => (
            <PatientChatNew
              unReadMessageList={unReadMessageList}
              trigger={trigger}
              currentPatient={currentPatient}
              doctorDetailsList={doctorDetailsList}
              chatGroupList={chatGroupList}
              updateChatGroupListTrigger={updateChatGroupListTrigger}
              addedNewChatGroupListTrigger={addedNewChatGroupListTrigger}
              {...props}
            />
          )}
        />
        {/* <Route
          exact
          path="/patient/videocall"
          render={(props) => (
            <Meeting
              unReadMessageList={unReadMessageList}
              trigger={trigger}
              currentPatient={currentPatient}
              doctorDetailsList={doctorDetailsList}
              {...props}
            />
          )}
        /> */}
        <Route exact path="/patient/document" component={PatientDocument} />
        {/* <Route exact path="/patient/videocall" component={Meeting} /> */}
        <Route exact path="/patient/nutrition" component={Nutrition} />
        <Route exact path="/patient/shop" component={PatientShop} />
        {/* <Route exact path="/patient/search" component={GlobalSearch} /> */}
        <Route exact path="/patient/workout" component={Workout} />
        <Route exact path="/patient/article" component={PatientArticle} />
        <Route exact path="/patient/changepassword" component={ChangeAccountPassword} />
        <Route exact path="/patient/about-us" render={(props) => <AboutUs currentuserInfo={currentuserInfo} {...props} />} />
        <Route exact path="/patient/privacy-policy" render={(props) => <PrivacyPolicyPage currentuserInfo={currentuserInfo} {...props} />} />
        <Route exact path="/patient/terms-and-conditions" render={(props) => <TermsAndConditionsPage currentuserInfo={currentuserInfo} {...props} />} />
        <Route exact path="/patient/help-and-support" render={(props) => <HelpAndSupportPage currentuserInfo={currentuserInfo} {...props} />} />
        <Route exact path="/patient/licenses" render={(props) => <LicensesPage currentuserInfo={currentuserInfo} {...props} />} />
        <Route exact path="/patient/partners" render={(props) => <PartnersPage currentuserInfo={currentuserInfo} {...props} />} />
        <Route exact path="/patient/logout" component={Logout} />
      </Switch>
      <Footer />
    </Suspense>
  );
};

export default PatientRoute;
