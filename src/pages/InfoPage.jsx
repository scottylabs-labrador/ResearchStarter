import React from 'react'
import NavBar from '../components/NavBar'
import { ViewerContext } from "../Info"


// next goal: finish routing, add fuse.js to filter + set up info page
const InfoPage = (data) => {
    return (
        <>
            <NavBar />
            <div className='p-10'>
                <h1 className='text-5xl pb-5 text-xl'>Opportunitiy Name</h1>
                <h2 className=''>Professor or Lab | Department | College</h2>
            </div>
        </>
    )
}

export default InfoPage