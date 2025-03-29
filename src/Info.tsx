// import React, { createContext, useState } from 'react'
// import { useUser } from '@clerk/clerk-react'

// const ViewerContext = createContext();

// function Info({ props }) {
//     const { user } = useUser();
//     const [userInfo, setUserInfo] = useState({});

//     useEffect(() => {
//         const fetchResearches = async () => {
//             try {
//                 const res = await fetch("http://localhost:8000/users");
//                 const data = await res.json();
//                 if (data.research.hasOwnProperty(user.id)) {
//                     setUserInfo(data.research[user.id]);
//                 } else {
//                     const new_profile = {
//                         "saved": [],
//                     }
//                     setUserInfo(new_profile)
//                 }
//             } catch {
//                 console.log("Error Fetching Data", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchResearches();
//     }, []);

//     return (
//         <ViewerContext.Provider
//             value={{
//                 userInfo,
//                 setUserInfo,
//                 user
//             }}></ViewerContext.Provider>
//     )
// }

// export default Info
// export { ViewerContext }
