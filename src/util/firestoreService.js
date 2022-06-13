// import firebase, { firebaseApp } from '../firebaseUtils';
import {
  LOCALFIRESTORECONFIG,
  PRODFIRESTORECONFIG,
} from '../util/configurations';

// import { getMessaging } from "firebase/messaging";

import firebase from "firebase/compat/app";
import "firebase/compat/messaging";
import { sendFcmTokenToServer } from '../service/firebaseservice';
import Cookies from 'universal-cookie';

// import '@firebase/messaging';

export const firestoreService = {}


const initializeFirestore = () => {
  if (!firebase.apps.length) {
    console.log('NODE_ENV', process.env, process.env.NODE_ENV);
    console.log(
      'window.location',
      window.location.hostname.includes('localhost') ||
      window.location.hostname.includes('dev')
    );
    let configSetting =
      window.location.hostname.includes('localhost') ||
        window.location.hostname.includes('dev')
        ? LOCALFIRESTORECONFIG
        : PRODFIRESTORECONFIG;
    firebase.initializeApp(configSetting);
  }
}

export const getPermissions = async () => {
  console.log('Requesting permission...');
  return Notification.requestPermission()
}

const fcmTokenApiHandler = async (token) => {
  const cookie = new Cookies();
  const user = cookie.get('currentUser');

  const userId = user.id

  const data = {
    token: token,
    platform: 'web',
    userId: userId
  }

  const response = await sendFcmTokenToServer(data)
  console.log({ response });
}

export const getFirebaseToken = async (setTokenFound) => {
  initializeFirestore();
  // console.log(firebase.apps);
  // console.log(firebaseApp);


  const messaging = firebase.messaging();

  let currentToken = '';

  try {
    currentToken = await messaging.getToken({
      vapidKey: "BMDkjCarQVzdebqtAcVnfW84-WK7QWHsxGfhmPhFHuGvnG8d--zSwRGj9xzx03fE9CTgwYfoq52CmtUo-biyFxM"
    });
    if (currentToken) {
      setTokenFound(true);
      localStorage.setItem('firebaseToken', currentToken);
      fcmTokenApiHandler(currentToken);
    }
    else {
      setTokenFound(false);
    }
  }
  catch (err) {
    console.log({ err });
  }
  return currentToken;
}

export const onMessageListener = () => {
  initializeFirestore();
  const messaging = firebase.messaging();

  new Promise(resolve => {
    messaging.onMessage(payload => {
      console.log({ payload });
      resolve(payload);
    })
  })
}
