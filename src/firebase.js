import React from 'react';
import firebase from 'firebase';
import { FIREBASECONFIG } from './util/configurations';


if (!firebase.apps.length) {
    firebase.initializeApp(FIREBASECONFIG);
}


// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export default firebase;