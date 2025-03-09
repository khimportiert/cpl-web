import React, { createContext, useState } from 'react'

const FacilityInfoContext = createContext({})

export const FacilityInfoProvider = ({children}) => {
    const [facilityGroup, setFacilityGroup] = useState()
    const [facility, setFacility] = useState()
    const [station, setStation] = useState()

    return (
        <FacilityInfoContext.Provider value={{ facilityGroup, setFacilityGroup, facility, setFacility, station, setStation }}>
            {children}
        </FacilityInfoContext.Provider>
    )
}

export default FacilityInfoContext