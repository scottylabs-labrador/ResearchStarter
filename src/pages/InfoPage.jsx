import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react';

const InfoPage = () => {
    const { id } = useParams();
    const [info, setInfo] = useState([])
    const idReal = +id - 1;

    useEffect(() => {
        const fetchResearch = async () => {
            try {
                const res = await fetch("http://localhost:8000/research");
                const data = await res.json();
                setInfo(data[idReal]);
            } catch (e) {
                console.log("Error Fetching Data", e);
            }
        };
        fetchResearch();
    }, [idReal]);

    return (
        <>{info &&
            <div>

                <header className="p-10">
                    <h1 className="text-5xl mb-10">{`${info.name} ${info.lastName}`}</h1>
                    <h2 className="text-xl">{`${info.labs?.join(", ")}`}
                        {` | `}
                        {`${info.department?.join(", ")}`}
                        {` | `}
                        {`${info.colleges?.join(", ")}`}</h2>
                </header>

                <div className="p-10 grid grid-cols-2 gap-8">
                    <div>
                        <div className="border bg-gray-100 p-4 mb-4 rounded">
                            <h3 className="text-[15px] font-bold mb-2">Contact Information</h3>
                            <p>{`${info.name} ${info.lastName}`}
                            <br/>{info.email}
                            <br/><br/></p>
                            <p className="font-bold">Office Hours</p>
                            <p>{info.officeHours || "Not publicly available"}</p>
                        </div>

                        <div className="border bg-gray-100 p-4 mb-4 rounded">
                            <h3 className="text-[15px] font-bold mb-2">Website</h3>
                            <p>{info.website || "Not found or non-existent."}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-3xl mb-2">About the Research</h3>
                        <p  className="h-60 overflow-hidden flex flex-col justify-start items-start">
                            {info.description || "No description found. Team is working on it :)"}
                        </p>
                    </div>
                </div>
            </div>
        }
        </>
    )
}

export default InfoPage
