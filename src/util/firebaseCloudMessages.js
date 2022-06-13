import "firebase/messaging";
import { initializeApp } from 'firebase/app';
import firebase from 'firebase';

// const firebaseConfigForCloudMessage = {
//     apiKey: "AIzaSyAqFn4kqi4cPxYOBwDT5CqRMiPPCqV60u8",
//     authDomain: "healthyu-app.firebaseapp.com",
//     // databaseURL: "https://healthyu-app.firebaseio.com",
//     projectId: "healthyu-app",
//     // storageBucket: "healthyu-app.appspot.com",
//     messagingSenderId: "497531508979",
//     appId: "1:497531508979:web:0364ed9baeb95a54173f86",
//     measurementId: "G-9TC3WY9D1B"
// }


// const app = initializeApp(firebaseConfigForCloudMessage);

const messaging = firebase.getMessaging();


const requestPermission = () => {
    console.log('Requesting permission...')
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            messaging.getToken().then(token => {
                console.log({ token });
            }).catch(err => {
                console.log({ err });
            })
        }
    })
}

// export const messageHandle = messaging.getToken({
//     vapidKey: "BMDkjCarQVzdebqtAcVnfW84-WK7QWHsxGfhmPhFHuGvnG8d--zSwRGj9xzx03fE9CTgwYfoq52CmtUo-biyFxM"
// }).then(currentToken => {
//     if (currentToken) {
//         console.log({ currentToken });
//     } else {
//         requestPermission();
//     }
// }).catch(err => console.log({ err }))

export const getFirebaseToken = async (setTokenFound) => {
    let currentToken = '';

    try {
        currentToken = await messaging.getToken({
            vapidKey: "BMDkjCarQVzdebqtAcVnfW84-WK7QWHsxGfhmPhFHuGvnG8d--zSwRGj9xzx03fE9CTgwYfoq52CmtUo-biyFxM"
        });
        if (currentToken) {
            setTokenFound(true);

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
    new Promise(resolve => {
        messaging.onMessage(payload => {
            console.log({ payload });
            resolve(payload);
        })
    })
}