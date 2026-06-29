import React from 'react'
import { FacebookAuthProvider } from "firebase/auth";
import { auth } from '../pages/FirebaseOtp/firebaseConfig';
import {signInWithPopup, FacebookAuthProvider } from "firebase/auth";
const fbprovider = new FacebookAuthProvider();

const FaceBookLogin = async() => {

    const fbAuth = signInWithPopup(auth, fbprovider);
 
  return fbAuth;
}

export default FaceBookLogin