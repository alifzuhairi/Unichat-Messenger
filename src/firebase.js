import firebase from "firebase/app"
import "firebase/auth"

//auth for firebase, copy from firebase
export const auth = firebase.initializeApp({
    apiKey: "apiKey",
    authDomain: "authDomain",
    projectId: "projectId",
    storageBucket: "storageBucket",
    messagingSenderId: "essagingSenderId",
    appId: "appId"
}).auth()