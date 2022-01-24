import firebase from 'firebase';
import { sendFcmTokenToServer } from '../../service/firebaseservice';

export const  getFirebaseToken = (userId) => {
    let messaging = null;
    //console.log("firebase.messaging.isSupported() :::::::::::", firebase.messaging.isSupported());
    if (firebase.messaging.isSupported()) {
      messaging = firebase.messaging();
      // const messaging = firebase.messaging()
      messaging.requestPermission().then(() => {
        return messaging.getToken()
      }).then(async token => {
        // //console.log('Token : ',token)
        const tokenObj = {
          userId: userId,
          token: token,
          platform: "web"
        }
        // const result = await sendFcmTokenToServer(tokenObj);
        await sendFcmTokenToServer(tokenObj);

      }).catch((err) => {
        //console.log(err);

      })
    }
  }
  