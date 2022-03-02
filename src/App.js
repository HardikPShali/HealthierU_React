import React from "react"; //useEffect
import ErrorBoundary from "./error-boundary/MyErrorBoundary";
import Routes from "./routes";
import "bootstrap/dist/css/bootstrap.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
// import firebase from "firebase";
// import {
//   LOCALFIRESTORECONFIG,
//   PRODFIRESTORECONFIG,
// } from "./util/configurations";
//import Cookies from 'universal-cookie';
import "./interceptor";
// import * as firebase from "firebase";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
// import "firebase/analytics";

// These imports load individual services into the firebase namespace.
//import 'firebase/auth';
//  import 'firebase/database';

const App = () => {
  //const cookies = new Cookies();
  // useEffect(() => {
  //   if (!firebase.apps.length) {
  //     console.log(process)
  //     const {NODE_ENV, REACT_APP_URL_BASE, SKIP_PREFLIGHT_CHECK, REACT_APP_ENV }=process.env;
  //     console.log('compare with production',process.env.NODE_ENV === "production")
  //     console.log('compare with development',process.env.NODE_ENV === "development")
  //     console.log('compare with end',REACT_APP_URL_BASE)
  //     console.log('compare with env',SKIP_PREFLIGHT_CHECK)
  //     console.log('compare with env',process.env.REACT_APP_ENV )

  //     let environment = process.env.NODE_ENV === "development";
  //     const CONFIGURATIONS = environment
  //       ? PRODFIRESTORECONFIG
  //       : LOCALFIRESTORECONFIG;
  //     console.log('environmen is',environment);
  //     console.log('configuration is ',CONFIGURATIONS);
  //     console.log('local is 478300887103 , and prod is 497531508979')
  //     firebase.initializeApp(LOCALFIRESTORECONFIG);
  //   }
  // }, []);
  return (
    <ErrorBoundary>
      <Routes />
    </ErrorBoundary>
  );
};

export default App;
