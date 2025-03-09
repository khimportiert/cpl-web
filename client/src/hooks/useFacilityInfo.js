import React, { useContext, useEffect, useState } from 'react'
import useAxiosPrivate from './useAxiosPrivate'
import { useLocation, useNavigate } from 'react-router-dom'
import { getFacilityFromGroup, getStationFromGroup } from '../utils/getFacilityFromGroup'
import useAuth from './useAuth'
import FacilityInfoContext from '../context/FacilityInfoProvider'

const useFacilityInfo = (username, refresh) => {

    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()
    const location = useLocation()
    const FACILITY_URL = '/api/facilities'

    const [facilityGroup, setFacilityGroup] = useState()
    const [facility, setFacility] = useState()
    const [station, setStation] = useState()

    // API Request
    const getFacilityGroup = (_username) => {
        if(!_username) {
            return
        }

        let isMounted = true;
        const controller = new AbortController();

        const request = async () => {
            try {
                const response = await axiosPrivate.get(`${FACILITY_URL}/${_username}`, {
                    signal: controller.signal
                });
                isMounted && setFacilityGroup(response.data)
            } catch (err) {
                if(err?.name !== 'CanceledError')
                    console.error(err);
                // 'cause StrictMode
                if(!controller.signal.aborted)
                    navigate('/login', { state: { from: location }, replace: true });
            }
        }
        request()
        return () => {
            isMounted = false;
            controller.abort();
        }
    }

    useEffect(() => {
        getFacilityGroup(username)
    }, [username, refresh])

    useEffect(() => {
        if(facilityGroup) {
            setFacility(getFacilityFromGroup(facilityGroup, username))
            setStation(getStationFromGroup(facilityGroup, username))
        }
    }, [facilityGroup])


    return {facilityGroup, facility, station}
}

export default useFacilityInfo