// import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {signInStart,signInSuccess,signInFailure} from '../redux/user/userSlice.js'
import OAuth from '../components/OAuth.jsx'
 
function SignIn() {

  const [userData,setuserData] = useState({})
  const {loading ,error} = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleInput = (e) => {
    setuserData({
      ...userData,
      [e.target.id]: e.target.value
    })
  }
  
  const handleSubmit = async(e) => {
    // console.log("ok")
    e.preventDefault()
      dispatch(signInStart())
      await fetch('/api/auth/signin',{
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      .then(res => res.json())
      .then(res => {
        
        if(res.success === false){
          dispatch(signInFailure(res.message))
          return ;
        }
        
        dispatch(signInSuccess(res))
        navigate('/')
      })
      .catch ((error) => {
        dispatch(signInFailure(error.message))
    })
    
  }

  // console.log(userData)

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleInput}
          required
        />
        <input
          type='password'
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleInput}
          required
        />

        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? "Loading......" :"Sign in"}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont an account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700 hover:underline'>Sign Up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
      
    </div>
  )
}

export default SignIn