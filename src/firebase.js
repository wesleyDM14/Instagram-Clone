import firebase from 'firebase';

const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyDrfUGlY1blFhFXc7hUAlbxMkcEX-xV1xw",
    authDomain: "instagram-project-ccfd0.firebaseapp.com",
    projectId: "instagram-project-ccfd0",
    storageBucket: "instagram-project-ccfd0.appspot.com",
    messagingSenderId: "764511230544",
    appId: "1:764511230544:web:f4f292fdd8c2b52566cf55",
    measurementId: "G-K1Y3011QZE"
});

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const functions = firebase.functions();

export{db, auth, storage, functions};
