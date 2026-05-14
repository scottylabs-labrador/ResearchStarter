    import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { ResearchType } from '../DataTypes'
import { parseContact, toArray } from '../utils'
import ResumeUploadPopup from '../components/infopage/ResumeUploadPopup'
import InfoPageHeader from '../components/infopage/InfoPageHeader'
import InfoSidebar from '../components/infopage/InfoSidebar'
import ContactsSection from '../components/infopage/ContactsSection'
import RelatedOpportunitiesSection from '../components/infopage/RelatedOpportunitiesSection'
import { useSession } from "../lib/authClient"
import DEV_MOCK_RESEARCHES from "../data/devMockResearches"

const InfoPage: React.FC = () => {
        const { id } = useParams<{ id: string }>()
        const [info, setInfo] = useState<ResearchType | null>(null)
        const [allResearch, setAllResearch] = useState<ResearchType[]>([])
        const [savedStates, setSavedStates] = useState<{ [key: string]: boolean }>({})
        const [loading, setLoading] = useState(true)
        const [error, setError] = useState<string | null>(null)
        const [showResumePopup, setShowResumePopup] = useState(false)

        const { data: session } = useSession();
        const userId = session?.user?.id ?? undefined;

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

                    const normalizedData = data
                        .filter((item) => item["Project Title"])
                        .map((item) => ({
                            _id: item._id,
                            projectTitle: item["Project Title"],
                            contact: parseContact(item.Contact),
                            department: toArray(item.Department),
                            description: item.Description || "No description provided.",
                            desiredSkillLevel: item["Desired Skill Level"],
                            paidUnpaid: item["Paid/Unpaid"],
                            position: item.Position,
                            prereqs: toArray(item.Prereqs),
                            relevantLinks: toArray(item["Relevant Links"]),
                            source: item.Source,
                            timeAdded: item["Time Added"],
                            timeCommitment: item["Time Commitment"],
                            anticipatedEndDate: item["Anticipated End Date"],
                            keywords: toArray(item.Keywords),
                            college: toArray(item.College),
                            profilePicture: item["Profile Picture"],
                        })) as ResearchType[];

                    const foundResearch = normalizedData.find((item) => item._id === id);
                    console.log(foundResearch);

                    if (foundResearch) {
                        setInfo(foundResearch);
                        setAllResearch(normalizedData);
                    } else {
                        setError(`Research with ID ${id} not found`);
                    }

                } catch (err) {
                    console.error("Error fetching data", err);
                    // Dev-only fallback when the backend is unreachable.
                    if (
                        import.meta.env.DEV &&
                        import.meta.env.VITE_DEV_BYPASS_AUTH === "true"
                    ) {
                        const found = DEV_MOCK_RESEARCHES.find((item) => item._id === id);
                        if (found) {
                            setInfo(found);
                            setAllResearch(DEV_MOCK_RESEARCHES);
                        } else {
                            setError(`Research with ID ${id} not found`);
                        }
                    } else {
                        setError("Failed to load research data");
                    }
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }, [id])

        useEffect(() => {
            async function fetchBookmark() {
                if (!info) return;
                // Skip in dev bypass mode — no backend available
                if (import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === "true") return;
                const response = await fetch(`/api/users/${userId}`);
                if (!response.ok) {
                    const message = `An error occurred: ${response.statusText}`;
                    console.error(message);
                    return;
                }
                const userData = await response.json();
                if (userData.saved.includes(id)) {
                    handleSave(info);
                } else {
                    handleUnsave(info);
                }
            }

            fetchBookmark();
        }, [info])


        async function saveUserBookmark(bookmark: boolean, userId: string) {
            const response = await fetch(`/api/users/saved/${userId}`,
            {
                method: "POST",
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                opportunityId: id,
                action: bookmark ? 'add' : 'remove'
                })
            }
            );
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                console.error(message);
                return;
            } 
            console.log(response);
            console.log(bookmark ? 'add' : 'remove');
        }

        const handleSave = async (research: ResearchType) => {
            try {
                setSavedStates(prev => ({ ...prev, [research._id]: true }))
                if (userId != undefined) {
                    saveUserBookmark(true, userId);
                }
                console.log('Research saved (Local State):', research._id)
            } catch (error) {
                console.error('Error saving research:', error)
                setSavedStates(prev => ({ ...prev, [research._id]: false }))
            }
        }

        const handleUnsave = async (research: ResearchType) => {
            try {
                setSavedStates(prev => ({ ...prev, [research._id]: false }))
                if (userId != undefined) {
                    saveUserBookmark(false, userId);
                }
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
                    <div className="px-6 lg:px-8 py-6">
                        <button
                            onClick={handleBackClick}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
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
                    <div className="px-6 lg:px-8 py-6">
                        <button
                            onClick={handleBackClick}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
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
                <div className="px-6 lg:px-8 py-6">
                    <button
                        onClick={handleBackClick}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
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
                    position={info.position}
                    compensation={info.paidUnpaid}
                    timeCommitment={info.timeCommitment}
                />
                <div className="px-6 lg:px-8 pb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Description */}
                        <div className="lg:col-span-2">
                            <section>
                                <p className="text-sm font-semibold text-gray-900 mb-3">
                                    About this opportunity
                                </p>
                                {info.description ? (
                                    <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line break-words max-w-prose">
                                        {info.description}
                                    </p>
                                ) : (
                                    <p className="text-base text-gray-400 italic">
                                        No description available.
                                    </p>
                                )}
                            </section>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <InfoSidebar info={info} />
                        </div>
                    </div>
                </div>
                {/* Contacts Section */}
                <ContactsSection contacts={Object.entries(info.contact).map(([name, andrewId]) => ({
                    headshotUrl: info.profilePicture || "",
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