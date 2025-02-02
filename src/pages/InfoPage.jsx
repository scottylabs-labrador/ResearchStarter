import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react';

// next goal: finish routing, add fuse.js to filter + set up info page
const InfoPage = () => {
    const { id } = useParams();
    const [info, setInfo] = useState([])

    useEffect(() => {
        const fetchResearch = async () => {
            try {
                const res = await fetch("http://localhost:8000/research");
                const data = await res.json();
                setInfo(data[id]);
            } catch (e) {
                console.log("Error Fetching Data", e);
            }
        };
        fetchResearch();
    }, [id]);

    return (
        <>{info &&
            <div className='p-10'>
                <h1 className='text-5xl pb-5 text-xl'>{`${info.name} ${info.lastName}`}</h1>
                <h2 className=''>Professor or Lab | Department | College</h2>
            </div>
        }
        </>
    )
}

export default InfoPage