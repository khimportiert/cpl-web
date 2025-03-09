import { Badge, Box, Button, Menu, MenuItem, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import State from './States';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import styled from '@emotion/styled';
import { ROLES } from '../../config/roles';
import StateNotification from './StateNotifications';
import { MessageNotification } from './MessageNotification';
import NotificationCountContext from '../../context/NotificationCountProvider';


const Notification = () => {
    
    const { auth } = useAuth()

    const NOTIFICATION_URL = '/api/notifications'
    const TRANSPORT_LIST_URL = auth?.roles?.includes(ROLES.KL) ? '/transports' : '/kt/transports'
    const REFRESH_TIMER = 10000
    const [notifications, setNotifications] = useState([])
    const axiosPrivate = useAxiosPrivate()

    const navigate = useNavigate()
    const location = useLocation()

    const {notificationCount, setNotificationCount} = useContext(NotificationCountContext)

    // Context Menu
    const menuWidth = 500
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget)
      setNotificationCount(0)
      update()
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // API Request to update Notifications
    const update = () => {
        let isMounted = true;
        const controller = new AbortController();

        const updateNotifications = async () => {
            try {
                await axiosPrivate.put(NOTIFICATION_URL, {
                    is_new: false,
                    signal: controller.signal
                });
            } catch (err) {
                if(err?.name !== 'CanceledError')
                    console.error(err);
                // 'cause StrictMode
                if(!controller.signal.aborted)
                    navigate('/login', { state: { from: location }, replace: true });
            }
        }

        updateNotifications()

        return () => {
            isMounted = false;
            controller.abort();
        }
    }

    // API Request for Notifications
    const refresh = () => {
        let isMounted = true;
        const controller = new AbortController();

        const getNotifications = async () => {
            try {
                const response = await axiosPrivate.get(NOTIFICATION_URL, {
                    signal: controller.signal
                });
                isMounted && setNotifications(response.data);
                const unread = response.data.filter((d) => d.is_new)
                setNotificationCount(unread.length)
            } catch (err) {
                if(err?.name !== 'CanceledError')
                    console.error(err);
                // 'cause StrictMode
                if(!controller.signal.aborted)
                    navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getNotifications()

        return () => {
            isMounted = false;
            controller.abort();
        }
    }

    useEffect(() => {
        refresh()
        const interval = setInterval(() => {
            refresh()
        }, REFRESH_TIMER);
            return () => clearInterval(interval);
    }, [auth])

    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            right: 2,
            top: 13,
            minWidth: 25,
            minHeight: 25,
            borderRadius: '20px',
            fontSize: 15,
            // border: `2px solid ${theme.palette.nav.text}`,
            padding: '0 4px',
        },
    }));

    return (
        <Box>
            <Box position={'fixed'} zIndex={1200} top={0} right={20}>
                <Button onClick={handleClick}>
                    <StyledBadge badgeContent={notificationCount} color='secondary'>
                        <NotificationsOutlinedIcon sx={{ color: 'nav.text', width: 35, height: 35 }} />
                    </StyledBadge>
                </Button>
            </Box>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <Box width={{xs: '100vw', sm: 500}} height={{xs: '50vh', sm: 500}} sx={{overflowX: 'clip',overflowY: 'auto'}}>
                    {notifications.map((notification, key) => {
                        if(notification.transport_state)
                            return (
                                // Status Notification
                                <MenuItem component={Link} to={`${TRANSPORT_LIST_URL}?id=${notification.transport_id}`} target='_blank' key={key}>
                                    <Box ml={2} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                        <StateNotification 
                                            width={{xs: '100vw', sm: 500}}
                                            state={notification.transport_state} 
                                            patient_firstname={notification.transport_patient_firstname} 
                                            patient_lastname={notification.transport_patient_lastname}
                                            createdAt={Date.parse(notification.createdAt)} // date to timestamp
                                        />
                                    </Box>
                                </MenuItem>)
                                
                        if(notification.message)
                            return (
                                // Message Notofication, ÄNDERN ZU POPUP UND DANN LINK
                                <MenuItem component={Link} to={`${TRANSPORT_LIST_URL}?id=${notification.transport_id}`} target='_blank' key={key}>
                                    <Box ml={2} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                        <MessageNotification
                                            width={{xs: '100vw', sm: 500}}
                                            message={notification.message} 
                                            patient_firstname={notification.transport_patient_firstname} 
                                            patient_lastname={notification.transport_patient_lastname}
                                            createdAt={Date.parse(notification.createdAt)} // date to timestamp
                                        />
                                    </Box>
                                </MenuItem>)
                    })}
                </Box>
                
            </Menu>
            
        </Box>
    )
}

export default Notification