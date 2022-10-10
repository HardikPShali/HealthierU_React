// import firebase, { firebaseApp } from '../firebaseUtils';
import {
  LOCALFIRESTORECONFIG,
  PRODFIRESTORECONFIG,
} from '../util/configurations';

// import { getMessaging } from "firebase/messaging";
import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/messaging';
import { sendFcmTokenToServer } from '../service/firebaseservice';
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';
import CustomToastMessage from '../components/CommonModule/CustomToastMessage/CustomToastMessage';
import { Howl } from 'howler';
import soundSrc from '../images/svg/notification-chime.wav';
import soundSrcCall from '../images/svg/call-notification-sound.wav';
import CustomCallNotification from '../components/CommonModule/CustomToastMessage/CustomCallNotification';
import CustomCallRejectNotification from '../components/CommonModule/CustomToastMessage/CustomCallRejectNotification';
import CustomPushNotifications from '../components/CommonModule/CustomToastMessage/CustomPushNotifications';
import LocalStorageService from './LocalStorageService';

// import '@firebase/messaging';

export const firestoreService = {};

let messageListener;
export let messaging;

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
};

export const getPermissions = async () => {
  console.log('Requesting permission...');
  return Notification.requestPermission();
};

const fcmTokenApiHandler = async (token) => {
  const cookie = new Cookies();
  const user = cookie.get('currentUser');

  const userId = user.id;

  const data = {
    token: token,
    platform: 'web',
    userId: userId,
    createdAt: new Date().toISOString(),
  };

  const response = await sendFcmTokenToServer(data);
  // console.log({ response });
};

export const getFirebaseToken = async (setTokenFound) => {
  initializeFirestore();
  // console.log(firebase.apps);
  // console.log(firebaseApp);

  messaging = firebase.messaging();

  let currentToken = '';

  try {
    currentToken = await messaging.getToken({
      vapidKey:
        'BMDkjCarQVzdebqtAcVnfW84-WK7QWHsxGfhmPhFHuGvnG8d--zSwRGj9xzx03fE9CTgwYfoq52CmtUo-biyFxM',
    });
    if (currentToken) {
      setTokenFound(true);
      localStorage.setItem('fcmToken', currentToken);
      fcmTokenApiHandler(currentToken);
      // const messageListener = await onMessageListener()
      // console.log({ messageListener });
      if (messageListener) {
        messageListener();
      }
    } else {
      setTokenFound(false);
    }
  } catch (err) {
    console.log({ err });
  }
  return currentToken;
};

export const onMessageListener = () => {
  // removeMessageListener();
  // messageListener = messaging.onMessage((payload) => {
  //   // console.log({ payload });
  //   // resolve(payload)
  //   console.log(window.location.pathname);

  //   toastMessage(payload);
  // });

  if (navigator.serviceWorker) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      toastMessage(event.data);
    });
  }
};

export const removeMessageListener = () => {
  if (messageListener) {
    messageListener();
  }
};

export const deleteTokenHandler = async () => {
  initializeFirestore();
  messaging = firebase.messaging();

  return messaging.deleteToken();
};

let sound = new Howl({
  src: soundSrc,
  html5: true,
});

let soundCall = new Howl({
  src: soundSrcCall,
  html5: true,
  loop: true,
});

const toastMessage = (payload) => {
  // return ({ payloadInToast: payload })
  const topicFromPayload = payload?.data?.topic;
  const loggedInUser = LocalStorageService.getCurrentUser();
  const roles = [loggedInUser.authorities];

  console.log({ roles })

  if (
    topicFromPayload === 'CHAT' &&
    window.location.pathname.indexOf('/chat') === -1
  ) {
    messageToast(payload);
  }

  if (topicFromPayload === 'CALL' && roles[0].includes("ROLE_PATIENT")) {
    callToast(payload);
  }

  if (topicFromPayload === 'REJECT') {
    callRejectToast(payload);
  }

  if (
    topicFromPayload === 'APPT_ACCEPTED' ||
    topicFromPayload === 'APPT_CANCELLED_BY_PATIENT' ||
    topicFromPayload === 'APPT_RESCHEDULE_BY_DOCTOR' ||
    topicFromPayload === 'APPT_RESCHEDULE_BY_PATIENT' ||
    topicFromPayload === 'SET_NEXT_APPOINTMENT_BY_DR' ||
    topicFromPayload === 'APPT_EXPIRED' ||
    topicFromPayload === 'PRESCRIPTION' ||
    topicFromPayload === 'RESULT'
  ) {
    customPushNotificationToast(payload);
  }
};

const messageToast = (payload) => {
  // const toastBody = payload.notification.body
  // const toastTitle = payload.notification.title

  sound.play();
  const customToast = <CustomToastMessage payload={payload} />;
  toast.info(customToast, {
    position: 'top-right',
    autoClose: 5000,
    className: 'caller-toast',
  });
};

const callToast = (payload) => {
  const onCallerClose = () => {
    toast.dismiss();
    soundCall.stop();
  };

  const onAcceptClickHandler = (history, url) => {
    soundCall.stop();
    history.push(url); // ?cId=1

    if (window.location.pathname.indexOf('/chat') > -1) {
      window.location.reload();
    }
  };

  soundCall.play();
  const customToast = (
    <CustomCallNotification
      onAccept={onAcceptClickHandler}
      onClose={onCallerClose}
      payload={payload}
    />
  );
  toast.info(customToast, {
    // position: "top-right",
    autoClose: false,
    className: 'caller-toast',
    toastId: 'caller-toast',
  });
};

const callRejectToast = (payload) => {
  // const toastBody = payload.notification.body
  // const toastTitle = payload.notification.title

  sound.play();
  const customToast = <CustomCallRejectNotification payload={payload} />;
  setTimeout(() => {
    const [fullUrl, queryParams] = window.location.href.split("?")
    let channelName = ""
    if (queryParams && queryParams !== "") {
      const queryParamsList = queryParams.split("&");
      channelName = queryParamsList.length ? queryParamsList[0] : "";
    }

    if (channelName !== "") {
      window.location = `${fullUrl}?${channelName}`
    } else {
      window.location = fullUrl
    }

  }, 1000);

  toast.info(customToast, {
    position: 'top-right',
    autoClose: 5000,
    className: 'caller-toast',
  });
};

const customPushNotificationToast = (payload) => {
  sound.play();
  const customToast = <CustomPushNotifications payload={payload} />;
  toast.info(customToast, {
    position: 'top-right',
    autoClose: 3000,
    className: 'caller-toast',
  });
};
