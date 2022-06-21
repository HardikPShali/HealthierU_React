import React, { useEffect, useState, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import Cookies from "universal-cookie";
import Availability from "./Availability"
import Header from "./Header";
import Footer from "./Footer";
import {
  getDoctorByUserId,
  // getModulesDetailsByIds
} from "../../service/frontendapiservices";
import Loader from '../Loader/Loader'
import MyDoctor from "../Patient Module/Mydoctor";
import CustomCallNotification from "../CommonModule/CustomToastMessage/CustomCallNotification";

const Homepage = React.lazy(() => import("./Homepage"));
const Profile = React.lazy(() => import("./Profile"));
const Logout = React.lazy(() => import("../Logout"));
const Appointment = React.lazy(() => import("./Appointment"));
const MyAppointments = React.lazy(() => import("./MyAppointments"));
const Healthassessment = React.lazy(() => import("./Healthassessment"));
const HealthAssestmentReport = React.lazy(() => import("./HealthAssestmentReport/HealthAssestmentReport"));
const MedicalRecord = React.lazy(() => import("./file-upload/DoctorDocument"));
const SetNextAppointment = React.lazy(() => import("../Patient Module/Mydoctor"));
const MyRecord = React.lazy(() => import("./file-upload/DoctorDocument"));
const ConsultationHistory = React.lazy(() => import("./ConsultationHistory/ConsultationHistory"));
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

const MyPatients = React.lazy(() => import("./MyPatientsSection/MyPatients"));


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

  const [displayCaller, setDisplayCaller] = useState(false);

  const onCallerClose = () => {
    setDisplayCaller(false);
  }


  return (
    <Suspense fallback={<Loader />}>
      {
        displayCaller && <CustomCallNotification onClose={onCallerClose} />
      }

      {currentLoggedInUser?.profileCompleted === true && <Header unReadMessageList={unReadMessageList} patientDetailsList={patientDetailsList} trigger={trigger} currentDoctor={currentDoctor} />}

      <Switch>
        <Route exact path="/doctor" component={Homepage} />
        <Route exact path="/doctor/appointment" render={(props) => <Appointment timeZone={currentDoctor.doctorTimeZone} currentDoctor={currentDoctor} {...props} />} />
        <Route exact path="/doctor/my-appointments" render={(props) => <MyAppointments timeZone={currentDoctor.doctorTimeZone} currentDoctor={currentDoctor} {...props} />} />
        <Route exact path="/doctor/my-patients" render={(props) => <MyPatients timeZone={currentDoctor.doctorTimeZone} currentDoctor={currentDoctor} {...props} />} />
        <Route exact path="/doctor/medicalrecord/:patientID/:apid" component={Healthassessment} />
        <Route exact path="/doctor/setNextAppointment" component={SetNextAppointment} />
        <Route exact path="/doctor/healthassesment-report/:id" component={HealthAssestmentReport} />
        <Route exact path="/doctor/medicalrecord" component={MedicalRecord} />
        <Route exact path="/doctor/consultationhistory/:id" component={ConsultationHistory} />
        {/*/render={(props) => <Healthassessment patient={patient} {...props} />} />*/}
        <Route exact path="/doctor/profile" render={(props) => <Profile currentDoctor={currentDoctor} {...props} />} />
        <Route exact path="/doctor/logout" component={Logout} />
        <Route exact path="/doctor/myrecord" component={MyRecord} />
        <Route exact path="/doctor/shop" component={DoctorShop} />
        <Route exact path="/doctor/article" component={DoctorArticle} />
        <Route exact path="/doctor/changepassword" component={ChangeAccountPassword} />
        <Route exact path="/doctor/addPrescription/:patientID/:apid" component={AddPrescription} />
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
