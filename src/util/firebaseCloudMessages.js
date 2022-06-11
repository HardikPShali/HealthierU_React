import { getMessaging } from "firebase/app";
import { initializeApp } from 'firebase/app';

const firebaseConfigForCloudMessage = {
    apiKey: "AIzaSyD36XRPXJiZ0Kmx5xQXx5kSncUak5m02lU",
    authDomain: "healthyu-app.firebaseapp.com",
    databaseURL: "https://healthyu-app.firebaseio.com",
    projectId: "healthyu-app",
    storageBucket: "healthyu-app.appspot.com",
    messagingSenderId: "497531508979",
    appId: "1:497531508979:web:0364ed9baeb95a54173f86",
    measurementId: "G-9TC3WY9D1B"
}

const app = initializeApp(firebaseConfigForCloudMessage);

const messaging = getMessaging(app);


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

export const messageHandle = messaging.getToken({
    vapidKey: "BMDkjCarQVzdebqtAcVnfW84-WK7QWHsxGfhmPhFHuGvnG8d--zSwRGj9xzx03fE9CTgwYfoq52CmtUo-biyFxM"
}).then(currentToken => {
    if (currentToken) {
        console.log({ currentToken });
    } else {
        requestPermission();
    }
}).catch(err => console.log({ err }))