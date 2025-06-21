// import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import {app} from '../firebase.js'
import {useDispatch} from 'react-redux'
import {signInSuccess} from '../redux/user/userSlice.js'
import { useNavigate } from 'react-router-dom'


function OAuth() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleGoogleClick = async() => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)

            const result = await signInWithPopup(auth,provider)

            // console.log(result)

            // Update the fetch call to use VITE_API_BASE_URL
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/google`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                credential: result.user.accessToken // Send Google access token instead
              }),
              credentials: 'include' // For cookies
            });
            const data = await res.json();

            dispatch(signInSuccess(data));
            navigate('/');
        } catch (error) {
            console.log("could not sign in with google",error)
        }
    }
  return (
    <button onClick={handleGoogleClick} type='button' className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95">Continue with google</button>
  )
}

export default OAuth
