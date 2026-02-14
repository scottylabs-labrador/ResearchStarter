    import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MailIcon from '@mui/icons-material/Mail'
import LinkIcon from '@mui/icons-material/Link'
import InfoIcon from '@mui/icons-material/Info'
import { ResearchType } from '../DataTypes'
import RelatedOpportunities from '../components/RelatedOpportunities'
import ResumeUploadPopup from '../components/infopage/ResumeUploadPopup'
import InfoPageHeader from '../components/infopage/InfoPageHeader'
import ContactsSection from '../components/infopage/ContactsSection'
import RelatedOpportunitiesSection from '../components/infopage/RelatedOpportunitiesSection'

const InfoPage: React.FC = () => {
        const { id } = useParams<{ id: string }>()
        const [info, setInfo] = useState<ResearchType | null>(null)
        const [allResearch, setAllResearch] = useState<ResearchType[]>([])
        const [savedStates, setSavedStates] = useState<{ [key: string]: boolean }>({})
        const [loading, setLoading] = useState(true)
        const [error, setError] = useState<string | null>(null)
        const [showResumePopup, setShowResumePopup] = useState(false)

        useEffect(() => {
            if (!id) {
                setError('No research ID provided')
                setLoading(false)
                return
            }

            const fetchData = async () => {
                try {
                    const res = await fetch("http://localhost:5050/opportunities/");
                    if (!res.ok) {
                        throw new Error(`An error occurred: ${res.statusText}`);
                    }
                    const data: any[] = await res.json();

                    const normalizedData = data.map((item) => ({
                        _id: item._id,
                        projectTitle: item["Project Title"],
                        contact: item.Contact ?? {},
                        department: item.Department ?? [],
                        description: item.Description || "No description provided.",
                        desiredSkillLevel: item["Desired Skill Level"],
                        paidUnpaid: item["Paid/Unpaid"],
                        position: item.Position,
                        prereqs: item.Prereqs,
                        relevantLinks: item["Relevant Links"] ?? [],
                        source: item.Source,
                        timeAdded: item["Time Added"],
                        timeCommitment: item["Time Commitment"],
                        anticipatedEndDate: item["Anticipated End Date"],
                        keywords: item.Keywords,
                        college: item.College ?? [],
                        pfp: item.pfp,
                    })) as ResearchType[];

                    const foundResearch = normalizedData.find((item) => item._id === id);

                    if (foundResearch) {
                        setInfo(foundResearch);
                        setAllResearch(normalizedData);
                    } else {
                        setError(`Research with ID ${id} not found`);
                    }

                } catch (err) {
                    console.error("Error fetching data", err);
                    setError("Failed to load research data");
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }, [id])

        const handleSave = async (research: ResearchType) => {
            try {
                setSavedStates(prev => ({ ...prev, [research._id]: true }))
                console.log('Research saved (Local State):', research._id)
            } catch (error) {
                console.error('Error saving research:', error)
                setSavedStates(prev => ({ ...prev, [research._id]: false }))
            }
        }

        const handleUnsave = async (research: ResearchType) => {
            try {
                setSavedStates(prev => ({ ...prev, [research._id]: false }))
                console.log('Research unsaved (Local State):', research._id)
            } catch (error) {
                console.error('Error unsaving research:', error)
                setSavedStates(prev => ({ ...prev, [research._id]: true }))
            }
        }

        const handleBookmarkToggle = () => {
            if (!info) return

            if (savedStates[info._id]) {
                handleUnsave(info)
            } else {
                handleSave(info)
            }
        }

        const handleApply = () => {
        setShowResumePopup(true);
        };

        const handleClosePopup = () => {
        setShowResumePopup(false);
        };

        const handleResumeSubmit = (file: File | null) => {
        if (file) {
            console.log("Resume submitted:", file.name);
            alert(`Resume ${file.name} uploaded successfully!`);
        } else {
            console.log("No resume selected.");
        }
        handleClosePopup();
        };

        const navigate = useNavigate();

        const handleBackClick = () => {
            navigate(-1); 
        };

        // Loading state
        if (loading) {
            return (
                <main className="min-h-screen max-w-7xl mx-auto">
                    <div className="px-6 sm:px-6 lg:px-8 py-8">
                        <button
                            onClick={handleBackClick}
                            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                            aria-label="Go back"
                        >
                            <ArrowBackIcon className="text-gray-600 text-3xl" />
                        </button>
                    </div>
                    <div className="flex items-center justify-center min-h-[50vh]">
                        <div className="text-center">
                            <div className="text-xl text-gray-600 mb-4">Loading research information...</div>
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                    </div>
                </main>
            )
        }

        // Error state
        if (error || !info) {
            return (
                <main className="min-h-screen max-w-7xl mx-auto">
                    <div className="px-6 sm:px-6 lg:px-8 py-8">
                        <button
                            onClick={handleBackClick}
                            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                            aria-label="Go back"
                        >
                            <ArrowBackIcon className="text-gray-600 text-3xl" />
                        </button>
                    </div>
                    <div className="flex items-center justify-center min-h-[50vh]">
                        <div className="text-center">
                            <div className="text-xl text-red-600 mb-4">
                                {error || 'Research not found'}
                            </div>
                            <button
                                onClick={handleBackClick}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </main>
            )
        }

        return (
            <main className="min-h-screen max-w-7xl mx-auto">
                <div className="px-6 sm:px-6 lg:px-8 py-8">
                    <button
                        onClick={handleBackClick}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowBackIcon className="text-gray-600 text-3xl" />
                    </button>
                </div>
                
                <InfoPageHeader
                    title={info.projectTitle}
                    professorOrLabName={Object.keys(info.contact).join(', ')}
                    department={info.department || []}
                    college={info.college || []}
                    tags={[...(info.keywords || []), ...(info.college || []), ...(info.department || [])]}
                    isBookmarked={savedStates[info._id] || false}
                    onBookmarkToggle={handleBookmarkToggle}
                    onApplyClick={handleApply}
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Contact Info Card */}
                            <div className="bg-light-color rounded-lg p-6 border border-gray-200">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <MailIcon className="text-gray-500" />
                                    Contact Information
                                </h2>
                                <div className="space-y-2">
                                    {Object.entries(info.contact).map(([name, andrewId]) => (
                                        <p key={andrewId}>
                                            <span className="font-medium">{name}</span>{" — "}
                                            <a
                                                href={`mailto:${andrewId}@andrew.cmu.edu`}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                {andrewId}@andrew.cmu.edu
                                            </a>
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* Relevant Links Card */}
                            {info.relevantLinks && info.relevantLinks.length > 0 && (
                                <div className="bg-light-color rounded-lg p-6 border border-gray-200">
                                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                        <LinkIcon className="text-gray-500" />
                                        Relevant Links
                                    </h2>
                                    <div className="space-y-2">
                                        {info.relevantLinks.map((link, i) => (
                                            <a
                                                key={i}
                                                href={link.startsWith('http') ? link : `https://${link}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 break-words block"
                                            >
                                                {link}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Details Card */}
                            {(info.position || info.paidUnpaid || info.timeCommitment || info.anticipatedEndDate || info.desiredSkillLevel || info.prereqs) && (
                                <div className="bg-light-color rounded-lg p-6 border border-gray-200">
                                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                        <InfoIcon className="text-gray-500" />
                                        Details
                                    </h2>
                                    <div className="space-y-4">
                                        {info.position && (
                                            <div>
                                                <p className="font-medium">Position:</p>
                                                <p>{info.position}</p>
                                            </div>
                                        )}
                                        {info.paidUnpaid && (
                                            <div>
                                                <p className="font-medium">Compensation:</p>
                                                <p>{info.paidUnpaid}</p>
                                            </div>
                                        )}
                                        {info.desiredSkillLevel && (
                                            <div>
                                                <p className="font-medium">Desired Skill Level:</p>
                                                <p>{info.desiredSkillLevel}</p>
                                            </div>
                                        )}
                                        {info.timeCommitment && (
                                            <div>
                                                <p className="font-medium">Time Commitment:</p>
                                                <p>{info.timeCommitment}</p>
                                            </div>
                                        )}
                                        {info.anticipatedEndDate && (
                                            <div>
                                                <p className="font-medium">Anticipated End Date:</p>
                                                <p>{info.anticipatedEndDate}</p>
                                            </div>
                                        )}
                                        {info.prereqs && (
                                            <div>
                                                <p className="font-medium">Prerequisites:</p>
                                                <p>{info.prereqs}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Main Content */}
                            <div className="prose max-w-none">
                                <h2 className="text-3xl font-semibold mb-4">About the Research</h2>
                                {info.description ? (
                                    <p className="text-700 whitespace-pre-line break-words">{info.description}</p>
                                ) : (
                                    <p className="text-gray-500 italic">No description available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Contacts Section */}
                <ContactsSection contacts={Object.entries(info.contact).map(([name, andrewId]) => ({
                    headshotUrl: info.pfp || "",
                    title: name,
                    department: info.department.join(', '),
                    officeLocation: "",
                    email: `${andrewId}@andrew.cmu.edu`,
                }))} />
                {/* Related Opportunities Section (Static Data) */}
                <RelatedOpportunitiesSection opportunities={[
                    {
                        opportunityName: "Advanced AI Research",
                        isBookmarked: false,
                        professorName: "Dr. Alice Wonderland",
                        department: "Computer Science",
                        date: "2026-03-15",
                        semester: "Spring 2026",
                        tags: ["AI", "Machine Learning", "Robotics", "Neural Networks"],
                    },
                    {
                        opportunityName: "Quantum Physics Study",
                        isBookmarked: true,
                        professorName: "Dr. Bob Quantum",
                        department: "Physics",
                        date: "2026-04-01",
                        semester: "Spring 2026",
                        tags: ["Quantum Mechanics", "Theoretical Physics", "Astrophysics", "Cosmology"],
                    },
                    {
                        opportunityName: "Bioinformatics Project",
                        isBookmarked: false,
                        professorName: "Dr. Carol Genetics",
                        department: "Biology",
                        date: "2026-03-20",
                        semester: "Summer 2026",
                        tags: ["Bioinformatics", "Genetics", "Data Science", "Biology"],
                    },
                ]} />
                <ResumeUploadPopup
                    isOpen={showResumePopup}
                    onClose={handleClosePopup}
                    onSubmit={handleResumeSubmit}
                />
            </main>
        )
    }

    export default InfoPage