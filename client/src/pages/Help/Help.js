import { Box, Link, Typography } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import CaptionContext from '../../context/CaptionProvider'
import NotificationCountContext from '../../context/NotificationCountProvider'

const Help = () => {

    const { setCaption, setHref } = useContext(CaptionContext)
    const { notificationCount } = useContext(NotificationCountContext)
    useEffect(() => {
        setCaption('Hilfe')
        setHref('/help')
        let title_notification = notificationCount && notificationCount !== 0 ? `(${notificationCount})` : ''
        let title = `${title_notification} Hilfe - Compulance Web`
        document.title = title;
    }, [notificationCount])


    return (
        <Box sx={{ bgcolor: ['background.default'] }} height={'100%'} minHeight={'100vh'} paddingTop={10} paddingX={[2, 2, 20]} maxWidth={[800,1300]} marginX={'auto'}>
            <Typography variant='p' lineHeight={3}>
                Telefonische Auftragsannahme unter&nbsp;
                <Link href="tel:(030) 4933003" color="inherit">
                    (030) 4933003
                </Link>
                <br />
                Bei technischen Problemen bitte&nbsp;
                <Link href="mailto:help@lybos.de" color="inherit">
                    help@lybos.de
                </Link>
                &nbsp;kontaktieren
            </Typography>
        </Box>
    )
}

export default Help