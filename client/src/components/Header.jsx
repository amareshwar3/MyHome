// import React from 'react'
import { Link, useNavigate } from "react-router-dom"
import {FaSearch} from "react-icons/fa"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"

function Header() {
  const {currentUser} = useSelector((state) => state.user)
  const [searchTerm,setSearchTerm] = useState('')
  const naviagte = useNavigate()
  // if(currentUser) console.log(currentUser.avatar)

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('searchTerm',searchTerm)
    const url = urlParams.toString()
    naviagte(`/search?${url}`)
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const serchTermFromUrl = urlParams.get('searchTerm')
    if(serchTermFromUrl){
      setSearchTerm(serchTermFromUrl)
    }
  },[window.location.search])

  return (
    <header className='bg-slate-200 shadow-md'>
    <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
      <Link to='/'>
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
          <span className='text-slate-500'>True</span>
          <span className='text-slate-700'>Homes</span>
        </h1>
      </Link>

      <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'>
        <input
          type='text'
          placeholder='Search...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='bg-transparent focus:outline-none w-24 sm:w-64'
        />
        <button>
          <FaSearch className='text-slate-600' />
        </button>
      </form>

      <ul className='flex gap-4'>
        <Link to='/'>
          <li className='hidden sm:inline text-slate-700 hover:underline'>
            Home
          </li>
        </Link>
        <Link to='/about'>
          <li className='hidden sm:inline text-slate-700 hover:underline'>
            About
          </li>
        </Link>
        {
          currentUser ? (<Link to='/profile'>
            <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt="profile" />
            </Link>):
          (
            <Link to='/sign-in'>
            <li className=' text-slate-700 hover:underline'> Sign in</li>
        </Link>)
        }
      </ul>
    </div>
  </header>

  )
}

export default Header