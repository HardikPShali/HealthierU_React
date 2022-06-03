import React, { useEffect, useState, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
// import Loadable from "react-loadable";
import Cookies from "universal-cookie";
// import firebase from "firebase";
//import useAxios from "../../util/axiosService";

import Header from "./Header";
import Footer from "./Footer";
import { firestoreService, chatAndVideoService } from "../../util";
import {
  getDoctorByUserId,
  // getModulesDetailsByIds
} from "../../service/frontendapiservices";
import Loader from '../Loader/Loader'
import MyDoctor from "../Patient Module/Mydoctor";

const Homepage = React.lazy(() => import("./Homepage"));
const Profile = React.lazy(() => import("./Profile"));
const Logout = React.lazy(() => import("../Logout"));
const Appointment = React.lazy(() => import("./Appointment"));
const Mypatient = React.lazy(() => import("./Mypatient"));
const Healthassessment = React.lazy(() => import("./Healthassessment"));
const HealthAssestmentReport = React.lazy(() => import("./HealthAssestmentReport/HealthAssestmentReport"));
const MedicalRecord = React.lazy(() => import("./file-upload/DoctorDocument"));
const SetNextAppointment = React.lazy(() => import("../Patient Module/Mydoctor"));
const MyRecord = React.lazy(() => import("./file-upload/DoctorDocument"));
const ConsulatationHistory = React.lazy(() => import("./ConsulatationHistory/ConsulatationHistory"));
const AddPrescription = React.lazy(() => import("./Prescription-Lab/AddPrescription"));
const DoctorChatNew = React.lazy(() => import("../Doctor Module/DoctorChatNew"));

const DoctorShop = React.lazy(() => import("./doctorshop"));

const AboutUs = React.lazy(() => import("../Login-Module/about-us"));

const DoctorArticle = React.lazy(() => import("./articles"));

const ChangeAccountPassword = React.lazy(() => import("./changepassword"));

const PrivacyPolicyPage = React.lazy(() => import("../CommonModule/PrivacyPolicy"));

const TermsAndConditionsPage = React.lazy(() => import("../CommonModule/TermsAndConditions"));

const HelpAndSupportPage = React.lazy(() => import("../CommonModule/HelpAndSupport"));

const LicensesPage = React.lazy(() => import("../CommonModule/Licenses"));

const PartnersPage = React.lazy(() => import("../CommonModule/Partners"));


const DoctorRoute = () => {
  const [currentDoctor, setCurrentDoctor] = useState({});
  const [chatGroupList, setChatGroupList] = useState({});
  const [updateChatGroupListTrigger, setUpdateChatGroupListTrigger] = useState(0);
  const [addedNewChatGroupListTrigger, setAddedNewUpdateChatGroupListTrigger] = useState(0);
  const [unReadMessageList, setUnReadMessageList] = useState({});
  const [patientDetailsList, setPatientDetailsList] = useState({});
  const [trigger, setTrigger] = useState(0);
  const [headerFooterLoad, setHeaderFooterLoad] = useState(false);
  const [restartFirebaseLogin, setRestartFirebaseLogin] = useState(0);

  const cookies = new Cookies();
  const currentLoggedInUser = cookies.get("currentUser");
  const loggedInUserId = currentLoggedInUser && currentLoggedInUser.id;


  useEffect(() => {
    getCurrentDoctor();
  }, []);

  const getCurrentDoctor = async () => {
    // const res = await getDoctorByUserId(loggedInUserId);
    // //axios(payload).then(res => {
    // if (res && res.data) {
    //   res.data.doctors.map((value, index) => setCurrentDoctor(value));
    // }
    const currentDoctor = cookies.get('profileDetails');
    setCurrentDoctor(currentDoctor);
  };

  useEffect(() => {
    const { email, firebasePwd } = currentDoctor;
    if (email) {
      firestoreService
        .signIn(email, firebasePwd)
        .then((userCredential) => {
          firestoreService.makeChatGroupList("doctorEmailId", email, setChatGroupList, setUpdateChatGroupListTrigger, setAddedNewUpdateChatGroupListTrigger);
        })
        .catch((err) => {
          let {
            code,
            // message
          } = err;
          if (code === "auth/user-not-found") { //replaced '==' with '==='
            firestoreService
              .createNewUser(email, firebasePwd)
              .then((userRecord) => {
                setRestartFirebaseLogin((prevStat) => prevStat + 1);
              })
              .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log("user Created failed", errorCode, errorMessage);
              });
          }
          else console.log("error in firestore signIn", err);
        });
      setTimeout(() => setHeaderFooterLoad(true), 1000);
    }
  }, [currentDoctor, restartFirebaseLogin]);

  useEffect(() => {
    if (Object.keys(chatGroupList).length > 0) {
      chatAndVideoService.getAllModuleDetails(chatGroupList, "patients", currentDoctor.id, setPatientDetailsList);
      firestoreService.makeUnReadMessageList(chatGroupList, currentDoctor.email, setUnReadMessageList, setTrigger);
    }
  }, [addedNewChatGroupListTrigger]);

  return (
    <Suspense fallback={<Loader />}>
      {headerFooterLoad && currentLoggedInUser?.profileCompleted === true && <Header unReadMessageList={unReadMessageList} patientDetailsList={patientDetailsList} trigger={trigger} currentDoctor={currentDoctor} />}
      <Switch>
        <Route exact path="/doctor" component={Homepage} />
        <Route exact path="/doctor/appointment" render={(props) => <Appointment timeZone={currentDoctor.doctorTimeZone} currentDoctor={currentDoctor} {...props} />} />
        <Route exact path="/doctor/mypatient" render={(props) => <Mypatient timeZone={currentDoctor.doctorTimeZone} currentDoctor={currentDoctor} {...props} />} />
        <Route exact path="/doctor/medicalrecord/:id" component={Healthassessment} />
        <Route exact path="/doctor/setNextAppointment" component={SetNextAppointment} />
        <Route exact path="/doctor/healthassesment-report/:id" component={HealthAssestmentReport} />
        <Route exact path="/doctor/medicalrecord" component={MedicalRecord} />
        <Route exact path="/doctor/consulatationhistory" component={ConsulatationHistory} />
        {/*/render={(props) => <Healthassessment patient={patient} {...props} />} />*/}
        <Route exact path="/doctor/profile" render={(props) => <Profile currentDoctor={currentDoctor} {...props} />} />
        <Route exact path="/doctor/logout" component={Logout} />
        <Route exact path="/doctor/myrecord" component={MyRecord} />
        <Route exact path="/doctor/shop" component={DoctorShop} />
        <Route exact path="/doctor/article" component={DoctorArticle} />
        <Route exact path="/doctor/changepassword" component={ChangeAccountPassword} />
        <Route exact path="/doctor/addPrescription/:id" component={AddPrescription} />
        <Route exact path="/doctor/about-us" render={(props) => <AboutUs currentuserInfo={currentLoggedInUser} {...props} />} />
        <Route exact path="/doctor/privacy-policy" render={(props) => <PrivacyPolicyPage currentuserInfo={currentLoggedInUser} {...props} />} />
        <Route exact path="/doctor/terms-and-conditions" render={(props) => <TermsAndConditionsPage currentuserInfo={currentLoggedInUser} {...props} />} />
        <Route exact path="/doctor/help-and-support" render={(props) => <HelpAndSupportPage currentuserInfo={currentLoggedInUser} {...props} />} />
        <Route exact path="/doctor/licenses" render={(props) => <LicensesPage currentuserInfo={currentLoggedInUser} {...props} />} />
        <Route exact path="/doctor/partners" render={(props) => <PartnersPage currentuserInfo={currentLoggedInUser} {...props} />} />
        <Route
          exact
          path="/doctor/chat"
          render={(props) => (
            <DoctorChatNew
              unReadMessageList={unReadMessageList}
              currentDoctor={currentDoctor}
              trigger={trigger}
              patientDetailsList={patientDetailsList}
              chatGroupList={chatGroupList}
              updateChatGroupListTrigger={updateChatGroupListTrigger}
              addedNewChatGroupListTrigger={addedNewChatGroupListTrigger}
              {...props}
            />
          )}
        />
        {/* <Route
          exact
          path="/doctor/videocall"
          render={(props) => (
            <Meeting
              unReadMessageList={unReadMessageList}
              currentDoctor={currentDoctor}
              trigger={trigger}
              patientDetailsList={patientDetailsList}
              {...props}
            />
          )}
        /> */}
        {/* <Redirect from='/' to='/doctor' /> */}
      </Switch>
      <Footer />
    </Suspense>
  );
};

export default DoctorRoute;
