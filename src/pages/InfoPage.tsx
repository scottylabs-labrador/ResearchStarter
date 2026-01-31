    import React, { useState, useEffect } from 'react'
    import { useParams, useNavigate } from 'react-router-dom'
    import ArrowBackIcon from '@mui/icons-material/ArrowBack'
    import { ResearchType } from '../DataTypes'
    import RelatedOpportunities from '../components/RelatedOpportunities'
    import ResumeUploadPopup from '../components/infopage/ResumeUploadPopup'
    import InfoPageHeader from '../components/infopage/InfoPageHeader'
    import ContactsSection from '../components/infopage/ContactsSection'
    import RelatedOpportunitiesSection from '../components/infopage/RelatedOpportunitiesSection'

    // IMPORT YOUR JSON DATA HERE
    // Ensure the path matches where you saved research.json
    import researchData from '../research.json' 

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

            // Simulating a data fetch with local JSON
            const loadLocalData = () => {
                try {
                    // We cast to 'any' here so TypeScript stops complaining that 
                    // 'lastName' doesn't exist on ResearchType.
                    const allData: any[] = researchData.research;

                    // We map over the raw data and combine First + Last name
                    // into the single 'name' property that ResearchType expects.
                    const normalizedData = allData.map((item) => ({
                        ...item,
                        id: item.id.toString(),
                        // COMBINE NAME HERE:
                        name: item.lastName ? `${item.name} ${item.lastName}` : item.name,
                        // Ensure description has a fallback
                        description: item.description || "No description provided."
                    })) as ResearchType[];

                    const foundResearch = normalizedData.find((item) => item.id === id);

                    if (foundResearch) {
                        setInfo(foundResearch);
                        setAllResearch(normalizedData);
                    } else {
                        setError(`Research with ID ${id} not found`);
                    }

                } catch (err) {
                    console.error("Error loading local data", err);
                    setError("Failed to load research data");
                } finally {
                    setLoading(false);
                }
            };

            loadLocalData();
        }, [id])

        const handleSave = async (research: ResearchType) => {
            try {
                setSavedStates(prev => ({ ...prev, [research.id]: true }))
                console.log('Research saved (Local State):', research.id)
            } catch (error) {
                console.error('Error saving research:', error)
                setSavedStates(prev => ({ ...prev, [research.id]: false }))
            }
        }

        const handleUnsave = async (research: ResearchType) => {
            try {
                setSavedStates(prev => ({ ...prev, [research.id]: false }))
                console.log('Research unsaved (Local State):', research.id)
            } catch (error) {
                console.error('Error unsaving research:', error)
                setSavedStates(prev => ({ ...prev, [research.id]: true }))
            }
        }

        const handleBookmarkToggle = () => {
            if (!info) return
            
            if (savedStates[info.id]) {
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
                
                {/* Note: Based on the JSON, 'info.name' is the First Name. 
                You might want to change this to `${info.name} ${info.lastName}` 
                if your types allow it, otherwise 'info.name' works.
                */}
                <InfoPageHeader
                    title={`${info.name}`} 
                    professorOrLabName={info.labs?.join(', ')}
                    department={info.department || []}
                    college={info.colleges || []}
                    tags={[...(info.keywords || []), ...(info.colleges || []), ...(info.department || [])]}
                    isBookmarked={savedStates[info.id] || false}
                    onBookmarkToggle={handleBookmarkToggle}
                    onApplyClick={handleApply}
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Contact Info Card */}
                            <div className="bg-gray-100 rounded-lg p-6 border border-gray-200">
                                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                                <div className="space-y-2">
                                    {info.email && (
                                        <p>
                                            <span className="font-medium">Email:</span>{" "}
                                            <a
                                                href={`mailto:${info.email}`}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                {info.email}
                                            </a>
                                        </p>
                                    )}
                                    {info.officeHours && (
                                        <p>
                                            <span className="font-medium">Office Hours:</span>{" "}
                                            {info.officeHours}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Website Card */}
                            {info.website && (
                                <div className="bg-gray-100 rounded-lg p-6 border border-gray-200">
                                    <h2 className="text-xl font-semibold mb-4">Website</h2>
                                    <a
                                        href={info.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 break-words"
                                    >
                                        {info.website}
                                    </a>
                                </div>
                            )}

                            {/* Requirements Overview Card */}
                            {(info.requestedYear || info.requestedExp || info.timeAvail) && (
                                <div className="bg-gray-100 rounded-lg p-6 border border-gray-200">
                                    <h2 className="text-xl font-semibold mb-4">Requirements Overview</h2>
                                    <div className="space-y-4">
                                        {info.requestedYear && (
                                            <div>
                                                <p className="font-medium">Year Level:</p>
                                                <p>{info.requestedYear}</p>
                                            </div>
                                        )}
                                        {info.requestedExp && (
                                            <div>
                                                <p className="font-medium">Experience:</p>
                                                <p>{info.requestedExp}</p>
                                            </div>
                                        )}
                                        {info.timeAvail && (
                                            <div>
                                                <p className="font-medium">Time Commitment:</p>
                                                <p>{info.timeAvail}</p>
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
                {/* Contacts Section - Hardcoded as per original file */}
                <ContactsSection contacts={[
                    {
                        headshotUrl: "https://randomuser.me/api/portraits/men/1.jpg",
                        title: "Dr. John Doe",
                        department: "Computer Science",
                        officeLocation: "SCI 201",
                        email: "john.doe@example.com",
                    },
                    {
                        headshotUrl: "https://randomuser.me/api/portraits/women/2.jpg",
                        title: "Dr. Jane Smith",
                        department: "Electrical Engineering",
                        officeLocation: "ENG 305",
                        email: "jane.smith@example.com",
                    },
                    {
                        headshotUrl: "https://randomuser.me/api/portraits/men/3.jpg",
                        title: "Dr. Peter Jones",
                        department: "Physics",
                        officeLocation: "PHY 110",
                        email: "peter.jones@example.com",
                    },
                    {
                        headshotUrl: "https://randomuser.me/api/portraits/women/4.jpg",
                        title: "Dr. Sarah Lee",
                        department: "Mathematics",
                        officeLocation: "MATH 400",
                        email: "sarah.lee@example.com",
                    },
                ]} />
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