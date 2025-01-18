import React, { useState } from 'react'

const ViewerContext = createContext()

const Info = () => {
    const [currInfo, setCurrInfo] = useState({})
    const [currFiltered, setCurrFiltered] = useState({})
    const [currTags, setCurrTags] = useState([])

    return (
        <ViewerContext.Provider
            value={{
                currInfo,
                setCurrInfo,
                currFiltered,
                setCurrFiltered,
                currTags,
                setCurrTags
            }}
        >
        </ViewerContext.Provider>
    )
}

export default Info