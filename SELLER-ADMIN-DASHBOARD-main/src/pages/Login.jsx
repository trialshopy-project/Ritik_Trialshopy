import React,{ useEffect, useState } from 'react'
import { NavLink, useNavigate} from 'react-router-dom';
import CopmanyLogo from '../images/Logo.jpg'
import { GoogleAuthProvider, signInWithPopup, FacebookAuthProvider, onAuthStateChanged } from 'firebase/auth';
// import { auth } from '../pages/FirebaseOtp/firebaseConfig';
import PhoneOtp from '../pages/PhoneOtp';
// import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../pages/Firebase/firebaseConfig'
const fbprovider = new FacebookAuthProvider();

const Login = () => {
  let navigate  = useNavigate()
  // const history = useHistory();
  const [userData, setUserData] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
 
  useEffect(() => {
  document.body.style.backgroundColor = "#0F172A";
  return () => {
    document.body.style.backgroundColor = "";
  };
}, []);

useEffect(() => {
 // Get the Firebase auth instance

  // Set up an authentication state listener
  const unsubscribe = onAuthStateChanged(auth, (authUser) => {
    if (authUser) {
      // User is logged in
      setUser(authUser);
      navigate("/dashboard");
      console.log("welcome to dashboard")
    } else {
      // User is not logged in
      setUser(null);
      navigate('/')
    }
  });

  // Clean up the listener when the component unmounts
  return () => unsubscribe();
}, []);


const handleFacebookLogin = async () => {
  try {
    const fbAuth = await signInWithPopup(auth, fbprovider);
    const user = fbAuth.user;

    // Save user data in localStorage
    localStorage.setItem("user", JSON.stringify(user));

    // After a successful login, navigate to the homepage
   
  } catch (error) {
    console.error("Facebook login error:", error);
  }
}






async function FaceBookLoginButtonClicked(){
  const user = await FaceBookLogin();
  console.log("facebook user:", user);
}

// function getUserDataFromLocalStorage() {
//   const storedUserData = localStorage.getItem("user");
//   if (storedUserData) {
//     const parsedUserData = JSON.parse(storedUserData);
//     setUserData(parsedUserData);
//   }
// }



const handlegoogle = async (e) => {
  const provider = await new GoogleAuthProvider();
  console.log("login successfull")
  return signInWithPopup(auth, provider)
} 




  return (
<>
    {/* div containing login-form and image */}
    <div className="h-screen flex items-center justify-center">
<div className="shadow-lg rounded-md bg-white w-4/5 lg:w-1/3 md:w-2/3 mx-auto ">
  <div className="sm:flex flex-col justify-center md:space-y-0 md:items-center p-4">
    {/* form */}
<div className="w-full p-2 max-w-sm ">
  <div className='flex flex-col items-center justify-center'>
  <img src={CopmanyLogo} alt="My Image" style={{ width: '100px', height: 'auto' }} />
  {/* <h3 className="text-xl font-bold">
    TRIALSHOPPY
  </h3> */}
  <h3 className="py-3 font-bold">
    Welcome to Trialshopy Dashboard
  </h3>
  <p className='text-gray-400 font-semibold text-sm pb-4'>Continue to your Shop</p>

  </div>


   {/* <PhoneOtp /> */}
  <input
      type="email"
      className="block py-2 px-2 w-full rounded-md text-sm bg-transparent border border-gray-400 border-dark"
      placeholder="Enter Email "
    />
  <input
      type="password"
      className="mt-2 block py-2 px-2 w-full rounded-md text-sm bg-transparent border border-gray-400"
      placeholder="Enter Password"
    />
  <div className="mt-3 flex justify-end font-semibold text-sm">
  <label className="flex text-slate-600 items-center hover:text-black cursor-pointer">
    <input className="mr-2 rounded-full text-black" type="checkbox" />
    <span>Remember Me</span>
  </label>
</div>
  <NavLink to={"/"}>
  <div className="text-center items-center">
    <button
      className="mt-3 bg-customPurple rounded-md w-full font-semibold py-2 text-white text-sm tracking-wider"
      type="submit"
    >
      LOG IN
    </button>
  </div>
  </NavLink>
  <NavLink to={"/phoneotp"}>
  <div className="text-center items-center">
    <button
      className="mt-3 bg-customPurple rounded-md w-full font-semibold py-2 text-white text-sm tracking-wider"
      type="submit"
    >
      LOG IN with PhoneNo
    </button>
  </div>
  </NavLink>
  <svg className='my-5 w-full' width="448" height="22" viewBox="0 0 448 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<line y1="11.5943" x2="198.673" y2="11.5943" stroke="#7C7C7C"/>
<line x1="248.341" y1="11.5943" x2="447.013" y2="11.5943" stroke="#7C7C7C"/>
<path d="M220.977 15.7898C220.258 15.7898 219.605 15.6265 219.017 15.2998C218.438 14.9731 217.981 14.5111 217.645 13.9138C217.318 13.3071 217.155 12.6071 217.155 11.8138C217.155 11.0298 217.323 10.3391 217.659 9.74179C218.004 9.13512 218.471 8.67312 219.059 8.35579C219.647 8.02912 220.305 7.86579 221.033 7.86579C221.761 7.86579 222.419 8.02912 223.007 8.35579C223.595 8.67312 224.057 9.13045 224.393 9.72779C224.738 10.3251 224.911 11.0205 224.911 11.8138C224.911 12.6071 224.734 13.3071 224.379 13.9138C224.034 14.5111 223.562 14.9731 222.965 15.2998C222.368 15.6265 221.705 15.7898 220.977 15.7898ZM220.977 14.6698C221.434 14.6698 221.864 14.5625 222.265 14.3478C222.666 14.1331 222.988 13.8111 223.231 13.3818C223.483 12.9525 223.609 12.4298 223.609 11.8138C223.609 11.1978 223.488 10.6751 223.245 10.2458C223.002 9.81645 222.685 9.49912 222.293 9.29379C221.901 9.07912 221.476 8.97179 221.019 8.97179C220.552 8.97179 220.123 9.07912 219.731 9.29379C219.348 9.49912 219.04 9.81645 218.807 10.2458C218.574 10.6751 218.457 11.1978 218.457 11.8138C218.457 12.4391 218.569 12.9665 218.793 13.3958C219.026 13.8251 219.334 14.1471 219.717 14.3618C220.1 14.5671 220.52 14.6698 220.977 14.6698ZM227.86 9.23779C228.084 8.79912 228.402 8.45845 228.812 8.21579C229.232 7.97312 229.741 7.85179 230.338 7.85179V9.16779H230.002C228.574 9.16779 227.86 9.94245 227.86 11.4918V15.6638H226.586V7.99179H227.86V9.23779Z" fill="#7C7C7C"/>
</svg>
  </div>

  <div className="w-full max-w-sm items-center">
  <div className="border mb-4 border-gray-400 rounded-md cursor-pointer flex items-center justify-center">
   
   <svg width="24" height="24" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_417_11700)">
<path d="M23.9885 13.2642C23.9885 12.2579 23.9069 11.5235 23.7301 10.762H12.239V15.304H18.984C18.8481 16.4327 18.1138 18.1326 16.4819 19.2749L16.459 19.4269L20.0923 22.2416L20.344 22.2667C22.6558 20.1316 23.9885 16.9903 23.9885 13.2642Z" fill="#4285F4"/>
<path d="M12.239 25.2313C15.5435 25.2313 18.3177 24.1433 20.344 22.2667L16.4819 19.2749C15.4484 19.9956 14.0612 20.4988 12.239 20.4988C9.00248 20.4988 6.25551 18.3638 5.27629 15.4128L5.13276 15.425L1.35483 18.3488L1.30542 18.4862C3.31804 22.4842 7.45214 25.2313 12.239 25.2313Z" fill="#34A853"/>
<path d="M5.27634 15.4128C5.01797 14.6513 4.86844 13.8353 4.86844 12.9922C4.86844 12.149 5.01797 11.3331 5.26275 10.5716L5.25591 10.4094L1.43062 7.43863L1.30547 7.49816C0.475969 9.15725 0 11.0203 0 12.9922C0 14.964 0.475969 16.827 1.30547 18.4861L5.27634 15.4128Z" fill="#FBBC05"/>
<path d="M12.239 5.48555C14.5372 5.48555 16.0875 6.47827 16.9714 7.30786L20.4255 3.9353C18.3042 1.96346 15.5435 0.753143 12.239 0.753143C7.45214 0.753143 3.31804 3.50011 1.30542 7.49817L5.2627 10.5716C6.25551 7.62061 9.00248 5.48555 12.239 5.48555Z" fill="#EB4335"/>
</g>
<defs>
<clipPath id="clip0_417_11700">
<rect width="24" height="24.5625" fill="white" transform="translate(0 0.753143)"/>
</clipPath>
</defs>
</svg>
    <button onClick={handlegoogle} className="ml-4 bg-white font-semibold py-2 text-sm tracking-wider" type="submit">
    Continue with Google
  </button>
  </div>
  <div className="border mb-4 border-gray-400 rounded-md  cursor-pointer text-center flex items-center justify-center">
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.05 20.5956C16.07 21.5456 15 21.3956 13.97 20.9456C12.88 20.4856 11.88 20.4656 10.73 20.9456C9.29004 21.5656 8.53004 21.3856 7.67004 20.5956C2.79004 15.5656 3.51004 7.90564 9.05004 7.62564C10.4 7.69564 11.34 8.36564 12.13 8.42564C13.31 8.18564 14.44 7.49564 15.7 7.58564C17.21 7.70564 18.35 8.30564 19.1 9.38564C15.98 11.2556 16.72 15.3656 19.58 16.5156C19.01 18.0156 18.27 19.5056 17.04 20.6056L17.05 20.5956ZM12.03 7.56564C11.88 5.33564 13.69 3.49564 15.77 3.31564C16.06 5.89564 13.43 7.81564 12.03 7.56564Z" fill="black"/>
</svg>
    <button
      className="ml-4 bg-white font-semibold py-2 text-sm tracking-wider"
      type="submit"
    >
      Continue with Apple
    </button>
  </div>

  <div className="border mb-4 border-gray-400 rounded-md  cursor-pointer text-center flex items-center justify-center
  ">
<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_417_11708)">
<path d="M24 12.3156C24 5.68827 18.6274 0.315643 12 0.315643C5.37262 0.315643 0 5.68817 0 12.3156C0 18.3051 4.38825 23.2697 10.125 24.1699V15.7844H7.07812V12.3156H10.125V9.67189C10.125 6.66439 11.9166 5.00314 14.6575 5.00314C15.9705 5.00314 17.3438 5.23752 17.3438 5.23752V8.19064H15.8306C14.3398 8.19064 13.875 9.11567 13.875 10.0647V12.3156H17.2031L16.6711 15.7844H13.875V24.1699C19.6117 23.2697 24 18.3052 24 12.3156Z" fill="#1877F2"/>
<path d="M16.6711 15.7844L17.2031 12.3156H13.875V10.0647C13.875 9.11558 14.3399 8.19064 15.8306 8.19064H17.3438V5.23752C17.3438 5.23752 15.9705 5.00314 14.6575 5.00314C11.9166 5.00314 10.125 6.66439 10.125 9.67189V12.3156H7.07812V15.7844H10.125V24.1699C10.7453 24.2671 11.3722 24.3158 12 24.3156C12.6278 24.3158 13.2547 24.2671 13.875 24.1699V15.7844H16.6711Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_417_11708">
<rect width="24" height="24" fill="white" transform="translate(0 0.315643)"/>
</clipPath>
</defs>
</svg>

    <button
    onClick={handleFacebookLogin}
      className="ml-4 bg-white font-semibold py-2 text-sm tracking-wider"
      type="submit"
    >
      Continue with Facebook
    </button>
  </div>

  <div className='flex gap-3 text-gray-400 font-semibold pb-2 text-sm justify-end'>
    <p className='cursor-pointer'>Help</p>
    <p className='cursor-pointer'>Privacy</p>
    <p className='cursor-pointer'>Terms</p>
  </div>
    </div> 
</div>
</div>
</div>
</>
  )
}

export default Login