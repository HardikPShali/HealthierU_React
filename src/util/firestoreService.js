// import firebase, { firebaseApp } from '../firebaseUtils';
import {
  LOCALFIRESTORECONFIG,
  PRODFIRESTORECONFIG,
} from '../util/configurations';

// import { getMessaging } from "firebase/messaging";
import React, { useState } from 'react';
import firebase from "firebase/compat/app";
import "firebase/compat/messaging";
import { sendFcmTokenToServer } from '../service/firebaseservice';
import Cookies from 'universal-cookie';
import { toast } from "react-toastify";
import CustomToastMessage from '../components/CommonModule/CustomToastMessage/CustomToastMessage';
import { Howl } from 'howler';
import soundSrc from '../images/svg/notification-chime.wav'
import soundSrcCall from '../images/svg/call-notification-sound.wav'
import CustomCallNotification from '../components/CommonModule/CustomToastMessage/CustomCallNotification';

// import '@firebase/messaging';

export const firestoreService = {}

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
    userId: userId,
    createdAt: new Date().toISOString()
  }

  const response = await sendFcmTokenToServer(data)
  // console.log({ response });
}

export const getFirebaseToken = async (setTokenFound) => {
  initializeFirestore();
  // console.log(firebase.apps);
  // console.log(firebaseApp);


  messaging = firebase.messaging();


  let currentToken = '';

  try {
    currentToken = await messaging.getToken({
      vapidKey: "BMDkjCarQVzdebqtAcVnfW84-WK7QWHsxGfhmPhFHuGvnG8d--zSwRGj9xzx03fE9CTgwYfoq52CmtUo-biyFxM"
    });
    if (currentToken) {
      setTokenFound(true);
      localStorage.setItem('fcmToken', currentToken);
      fcmTokenApiHandler(currentToken);
      // const messageListener = await onMessageListener()
      // console.log({ messageListener });
      if (messageListener) {
        messageListener()
      }

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
  // removeMessageListener();
  messageListener = messaging.onMessage(payload => {
    // console.log({ payload });
    // resolve(payload)
    console.log(window.location.pathname)
   
      toastMessage(payload)
    
  })

}

export const removeMessageListener = () => {
  if (messageListener) {
    messageListener()
  }

}

export const deleteTokenHandler = async () => {
  initializeFirestore();
  messaging = firebase.messaging();

  return messaging.deleteToken()
}


let sound = new Howl({
  src: soundSrc,
  html5: true
});

let soundCall = new Howl({
  src: soundSrcCall,
  html5: true,
  loop: true
})

const toastMessage = (payload) => {
  console.log({ payloadInToast: payload });
  // return ({ payloadInToast: payload })
  const topicFromPayload = payload.data.topic;

  if (topicFromPayload === 'CHAT' &&  window.location.pathname.indexOf('/chat') === -1) {
    messageToast(payload);
  }


  if (topicFromPayload === 'CALL') {
    callToast(payload);
  }
}

const messageToast = (payload) => {
  const toastBody = payload.notification.body
  const toastTitle = payload.notification.title

  sound.play()
  const customToast = (
    <CustomToastMessage title={toastTitle} body={toastBody} payload={payload} />
  )
  toast.info(customToast, {
    position: "top-right",
    autoClose: 5000,
    className: 'caller-toast'
  })
}

const callToast = (payload) => {
  const onCallerClose = () => {

    toast.dismiss();
    soundCall.stop()
  }

  
  const onAcceptClickHandler = (history, url) => {
      soundCall.stop();
      history.push(url)   // ?cId=1

      if(window.location.pathname.indexOf('/chat') > -1) {
        window.location.reload()
      }
  }

  soundCall.play()
  const customToast = (
    <CustomCallNotification onAccept={onAcceptClickHandler} onClose={onCallerClose} payload={payload} />
  )
  toast.info(customToast, {
    // position: "top-right",
    autoClose: false,
    className: 'caller-toast'
  })
}

// //TODO:
// 1. Check url is not chat url
// 2. display the message as toast
// 3. On click should navigate to chat page