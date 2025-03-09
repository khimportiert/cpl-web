import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useLogout from '../../hooks/useLogout'

const Logout = () => {
    const navigate = useNavigate()
    const logout = useLogout()

    const signOut = async () => {
        await logout()
        navigate('/login')
    }

    useEffect(() => {
        signOut()
    }, [])

    return (
        <div>
            <button onClick={signOut}>Sign Out</button>
        </div>
    )
}

export default Logout