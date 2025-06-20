/* eslint-disable react/prop-types */
// import React from 'react'

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function Contact({listing}){
    const [Landlord,setlandLord] = useState(null)
    const [message, setMessage] = useState('')

    useEffect(() => {
        const fetchLandLord = async() => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`)

                const data = await res.json();

                if(data.success === false){
                    console.log(data.message)
                    return ;
                }

                // console.log(data)
                setlandLord(data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchLandLord()
    },[listing.userRef])

    return (
        <>
        {Landlord && (<div className="flex flex-col gap-2">
            <p>
                Contact <span className="font-medium">{Landlord.username}</span> for <span className="font-medium">{listing.name}</span>
            </p>
            <textarea 
            name="message" 
            id="message" 
            rows='2'
            className="w-full border rounded-lg p-3"
            placeholder="Enter your message..."
            onChange={(e) => setMessage(e.target.value) }
            value={message}
            >
            </textarea>

            <Link to={`mailto:${Landlord.email}?subject=Regarding ${listing.name}&body=${message}`} 
            className='bg-slate-700 text-white p-3 text-center rounded-lg uppercase hover:opacity-95'>
                send message</Link>
        </div>)
        }
        </>
    )
}

export default Contact