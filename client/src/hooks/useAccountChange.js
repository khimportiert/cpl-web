import React from 'react'
import useAuth from './useAuth'
import useAxiosPrivate from './useAxiosPrivate'
import useRefreshToken from './useRefreshToken'

const useAccountChange = () => {
    const { auth, setAuth } = useAuth()
    const axiosPrivate = useAxiosPrivate()
    const USER_URL = '/api/users'
    const refresh = useRefreshToken()

    const setUsername = async (username) => {
        const id = auth.id
        const data = {
            username
        }
        try {
            const res = await axiosPrivate.put(`${USER_URL}/${id}`, data)
        } catch (err) {
            console.log(err)
            // TODO: Handle error
        }
    }

    const setAccount = (station) => {
        setUsername(station.username)
        refresh()
        refresh() //TODO: Es muss doch eine bessere Lösung geben

        // setAuth(prev => {
        //     return {
        //         ...prev,
        //         username: station.username
        //     }
        // })
    }

    return setAccount
}

export default useAccountChange