import React, { createContext, useState } from 'react'

const NotificationCountContext = createContext()

export const NotificationCountProvider = ({ children }) => {
    const [notificationCount, setNotificationCount] = useState('');

    return (
        <NotificationCountContext.Provider value={{ notificationCount, setNotificationCount }}>
            {children}
        </NotificationCountContext.Provider>
    )
}

export default NotificationCountContext