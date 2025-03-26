import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import RelatedOpportunities from '../components/RelatedOpportunities'

const InfoPage = () => {
    const { id } = useParams();
    const [info, setInfo] = useState([])
    const [allResearch, setAllResearch] = useState([])
    const idReal = +id - 1;

    useEffect(() => {
        const fetchResearch = async () => {
            try {
                const res = await fetch("http://localhost:8000/research");
                const data = await res.json();
                setInfo(data[idReal]);
                setAllResearch(data);
            } catch (e) {
                console.log("Error Fetching Data", e);
            }
        };
        fetchResearch();
    }, [idReal]);

    const allTags = [
        ...(info.colleges ?? []),
        ...(info.department ?? []),
        ...(info.keywords ?? []),
      ];

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

                <div className="flex flex-wrap gap-3 ml-10 -mt-5">
                    {allTags.map((tag, index) => (
                    <span
                        key={index}
                        className="inline-block bg-gray-300 px-4 py-2 rounded-lg text-sm font-medium">
                        {tag}
                    </span>
                    ))}
                </div>

                <div className="p-10 grid grid-cols-2 gap-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="border bg-gray-100 p-4 rounded">
                            <h3 className="text-[15px] font-bold mb-2">Contact Information</h3>
                            <p>{`${info.name} ${info.lastName}`}
                            <br/>{info.email}
                            <br/><br/></p>
                            <p className="font-bold">Office Hours</p>
                            <p>{info.officeHours || "Not publicly available"}</p>
                        </div>

                        <div className="border bg-gray-100 p-4 rounded">
                            <h3 className="text-[15px] font-bold mb-2">Website</h3>
                            <p>{info.website || "Not found or non-existent."}</p>
                        </div>

                        {(info.requestedYear || info.requestedExp || info.timeAvail) && (
                            <div className="border bg-gray-100 p-4 rounded col-span-2">
                                <h3 className="text-[15px] font-bold mb-2">Requirements Overview</h3>
                                {info.requestedYear && (
                                    <div className="mb-2">
                                        <p className="font-semibold">Year Level</p>
                                        <p>{info.requestedYear}</p>
                                    </div>
                                )}
                                {info.requestedExp && (
                                    <div className="mb-2">
                                        <p className="font-semibold">Experience</p>
                                        <p>{info.requestedExp}</p>
                                    </div>
                                )}
                                {info.timeAvail && (
                                    <div>
                                        <p className="font-semibold">Time Commitment</p>
                                        <p>{info.timeAvail}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="text-3xl mb-2">About the Research</h3>
                        <p  className="h-80 overflow-hidden flex flex-col justify-start items-start">
                            {info.description || "No description found. Team is working on it :)"}
                        </p>
                    </div>
                </div>

                {info.pastPapers && info.pastPapers.length > 0 && (
                    <div className="my-8">
                        <h2 className="text-3xl font-bold mb-4 ml-10">Prior research</h2>
                        <div className="grid grid-cols-6 gap-6 ml-10">
                            {info.pastPapers?.map((paper, index) => (
                            <div key={index} className="relative border border-gray-900 p-4 w-50 h-[150px] overflow-visible">
                                <div className="absolute -top-[2px] -right-[2px] w-0 h-0
                                border-l-[15px] border-l-black
                                border-b-[15px] border-b-black
                                border-t-[15px] border-t-white
                                border-r-[15px] border-r-white
                                border-solid"/>
                                <div className="absolute top-[1px] right-[1px] w-0 h-0
                                border-l-[13px] border-l-white
                                border-b-[13px] border-b-white
                                border-t-[13px] border-t-transparent
                                border-r-[13px] border-r-transparent
                                border-solid"/>
                                <h3 className="text font-bold leading-tigh mr-6">
                                {paper}
                                </h3>
                            </div>
                            ))}
                        </div>
                    </div>
                )}

                <RelatedOpportunities 
                    currentResearch={info}
                    allResearch={allResearch}
                />
            </div>
        }
        </>
    )
}

export default InfoPage
