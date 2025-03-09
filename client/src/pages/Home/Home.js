import { Box, Button, Typography } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import CaptionContext from '../../context/CaptionProvider'
import NotificationCountContext from '../../context/NotificationCountProvider'
import useAccountChange from '../../hooks/useAccountChange'
import useAuth from '../../hooks/useAuth'

const Home = () => {

    const { setCaption, setHref } = useContext(CaptionContext)
    const { notificationCount } = useContext(NotificationCountContext)
    useEffect(() => {
        setCaption('Dashboard')
        setHref('/')
        let title_notification = notificationCount && notificationCount !== 0 ? `(${notificationCount})` : ''
        let title = `${title_notification} Dashboard - Compulance Web`
        document.title = title;
    }, [notificationCount])

    

    return (
        <Box minHeight={'100vh'}>
            <Typography pt={30} textAlign={'center'} variant='h2'>
                Willkommen.
            </Typography>
        </Box>
    )
}

export default Home