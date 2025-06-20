// import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { useState } from 'react'
import OAuth from '../components/OAuth.jsx'

function SignUp() {

  const [userData,setuserData] = useState({})
  const [error,seterror] = useState(null)
  const [loading,setloading] = useState(false)
  const navigate = useNavigate()

  const handleInput = (e) => {
    setuserData({
      ...userData,
      [e.target.id]: e.target.value
    })
  }
  
  const handleSubmit = async(e) => {
    // console.log("ok")
    e.preventDefault()
    
      setloading(true)
      await fetch('/api/auth/signup',{
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      .then(res => res.json())
      .then(res => {
        setloading(false)
        if(res.success === false) {
          console.log(res)
          seterror(res.message)
          return ;
        }
  
        seterror(null)
        navigate('/sign-in')
      })
      .catch ((error) => {
        setloading(false)
        seterror(error.message)
    })
    
  }

  // console.log(userData)

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='username'
          className='border p-3 rounded-lg'
          id='username'
          onChange={handleInput}
        />
        <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleInput}
        />
        <input
          type='password'
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleInput}
        />

        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? "Loading......" :"Sign up"}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700 hover:underline'>Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
      
    </div>
  )
}

export default SignUp