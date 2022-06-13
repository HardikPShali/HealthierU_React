// import React from 'react';
import firebase from 'firebase/compat/app';
import {
    LOCALFIRESTORECONFIG,
    PRODFIRESTORECONFIG,
} from './util/configurations';

let app;

if (!firebase.apps.length) {

    app = firebase.initializeApp(LOCALFIRESTORECONFIG);
}


// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export default firebase;
export const firebaseApp = app;