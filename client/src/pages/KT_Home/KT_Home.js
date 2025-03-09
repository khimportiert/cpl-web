import React, { useContext, useEffect } from 'react'
import NotificationCountContext from '../../context/NotificationCountProvider'
import CaptionContext from '../../context/CaptionProvider'

const KT_Home = () => {

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
      <div>KT_Home</div>
    )
}

export default KT_Home