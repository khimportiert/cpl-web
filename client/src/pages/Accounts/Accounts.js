import React, { useContext, useEffect, useState } from 'react'
import CaptionContext from '../../context/CaptionProvider'
import NotificationCountContext from '../../context/NotificationCountProvider'
import useAuth from '../../hooks/useAuth'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useFacilityInfo from '../../hooks/useFacilityInfo'
import BoxContainer from '../../components/ui/BoxContainer'
import { Box, Button, Card, CardActionArea, CardContent, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Drawer, FormControlLabel, FormGroup, Grid, IconButton, Link, Menu, MenuItem, Snackbar, TextField, Typography } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useLocation, useNavigate } from 'react-router-dom'

const Accounts = () => {

    const { setCaption, setHref } = useContext(CaptionContext)
    const { notificationCount } = useContext(NotificationCountContext)
    useEffect(() => {
        setCaption('Benutzer')
        setHref('/accounts')
        let title_notification = notificationCount && notificationCount !== 0 ? `(${notificationCount})` : ''
        let title = `${title_notification} Benutzer - Compulance Web`
        document.title = title;
    }, [notificationCount])

    const { auth } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const axiosPrivate = useAxiosPrivate()
    const USER_URL = '/api/users/'

    const [errMsg, setErrMsg] = useState('')
    const [vorname, setVorname] = useState('')
    const [nachname, setNachname] = useState('')
    const [benutzername, setBenutzername] = useState('')
    const [passwort, setPasswort] = useState('')
    const [passwort_wdh, setPasswort_wdh] = useState('')

    const [allChecked, setAllChecked] = useState(false)
    const [checkboxesVisible, setCheckboxesVisible] = useState(true)
    const [checkedStations, setCheckedStations] = useState([])

    const [registerSnackbar, setRegisterSnackbar] = useState(false)

    const facilityInfo = useFacilityInfo(auth.username)
    const [facilityUsers, setFacilityUsers] = useState()


    const [deleteOpen, setDeleteOpen] = useState(false)
    const [clickedUser, setClickedUser] = useState()
    const [deleteSnackbar, setDeleteSnackbar] = useState(false)

    // Context Menu
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleContextMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleContextMenuClose = () => {
        setAnchorEl(null);
    };
    

    // API alle benutzer Request
    const getUsers = () => {
        let isMounted = true;
        const controller = new AbortController();

        const request = async () => {
            try {
                const response = await axiosPrivate.get(`${USER_URL}`, {
                    signal: controller.signal
                });
                if(isMounted) {
                    setFacilityUsers(response.data.filter((user) => user.login_name !== auth.login_name))
                }
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
        getUsers()
    }, [registerSnackbar, deleteSnackbar])

    // Alle Stationen auswählen
    useEffect(() => {
        const ok = facilityInfo?.facility?.stations
        if(ok && allChecked) {
            setCheckedStations(facilityInfo.facility.stations)
        } else {
            if(ok?.length === checkedStations.length)
            setCheckedStations([])
        }
    }, [allChecked])

    // Handle station select
    const handleStationSelect = (e, station) => {
        if(e.target.checked) {
            setCheckedStations((prev) => {
                return [...prev, station]
            })
        } else {
            setAllChecked(false)
            setCheckedStations((prev) => {
                return prev.filter((e) => {return e !== station})
            })
        }
    }

    // Handle registration
    const handleRegistration = () => {
        // alle felder ausgefüllt?
        if(![vorname, nachname, benutzername, passwort, passwort_wdh].includes('')) {
            // stationen ausgewählt?
            if(!(checkedStations.length < 1)) {
                // stimmen die passwärter überein?
                if(handlePasswort(passwort, passwort_wdh)) {
                    // Post Request senden
                    register()
                }
            } else {
                setErrMsg('Mindestens eine Station muss ausgewählt sein')
                window.scrollTo(0, 0);
            }
        } else {
            setErrMsg('Alle Felder müssen ausgefüllt sein')
            window.scrollTo(0, 0);
        }
    }

    const handlePasswort = (pwd1, pwd2) => {
        if(!pwd1 || !pwd2)
            return false

        if(pwd1 !== pwd2) {
            setErrMsg('Passwörter stimmen nicht überein.')
            return false
        } else {
            setErrMsg('')
            return true
        }
    }

    // Handle User Delete
    const handleUserDelete = async (id) => {
        if(!id || id === '') {
            return
        } else {
            
            //API Request
            try {
                const response = await axiosPrivate.delete(`${USER_URL}/${id}`)
                console.log(response)
                if(response.data.ok) {
                    setDeleteSnackbar(true)
                    setClickedUser(false)
                    setDeleteOpen(false)
                }
            } catch (err) {
                // TODO handle error
                console.error(err)
            }
        }
    }

    // API register Request
    const register = async () => {
        try {
            const response = await axiosPrivate.post(`${USER_URL}`, {
                login_name: benutzername,
                firstname: vorname,
                lastname: nachname,
                username: checkedStations.map((station) => station.username)[0],
                allowed_stations: checkedStations.map((station) => station.username),
                password: passwort
            });
            if(response?.data?.ok) {
                setRegisterSnackbar(true)
                setVorname('')
                setNachname('')
                setBenutzername('')
                setPasswort('')
                setPasswort_wdh('')
                setAllChecked(false)
                setCheckedStations([])
            }
        } catch (err) {
            if(err?.name !== 'CanceledError') {
                if(err?.response?.data?.message) {
                    setErrMsg(err.response.data.message)
                }
                console.error(err);
            }
        }
    }

    return (
    <BoxContainer>
        <Grid container>
            <Grid item xs={12} lg={6} px={4} borderRight={{xs: '', lg: '1px solid #d9d9d9'}}>
                <Box>
                    <Typography variant='h3'>
                        Neuer Benutzer
                    </Typography>
                </Box>
                <Box>
                    <Typography color={'error'}>
                        {errMsg}
                    </Typography>
                </Box>
                <Box mt={3}>
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                        {/* Vorname */}
                        <TextField error={!!errMsg && vorname===''}
                            required value={vorname} onChange={(e) => setVorname(e.target.value)}
                            label="Vorname" variant='outlined' color='text' sx={{width: '47%'}}
                        />
                        
                        {/* Nachname */}
                        <TextField error={!!errMsg && nachname===''}
                            required value={nachname} onChange={(e) => setNachname(e.target.value)}
                            label="Nachname" variant='outlined' color='text' sx={{width: '47%'}}/>    
                    </Box>
                
                    {/* Benutzername */}
                    <TextField error={!!errMsg && benutzername===''}
                        type='text' required value={benutzername} onChange={(e) => setBenutzername(e.target.value)}
                        label="Benutzername" variant='outlined' color='text' fullWidth
                        sx={{mt: 2}} />
                    
                    {/* Passwort */}
                    <TextField error={(!!errMsg && passwort === '') || errMsg==='Passwörter stimmen nicht überein.'}
                        type='password' required value={passwort} onChange={(e) => {setPasswort(e.target.value);handlePasswort(e.target.value, passwort_wdh)}}
                        label="Passwort" variant='outlined' color='text' fullWidth
                        sx={{mt: 2}} />
                    
                    {/* Passwort wiederholen */}
                    <TextField error={(!!errMsg && passwort_wdh === '') || errMsg==='Passwörter stimmen nicht überein.'}
                        type='password' required value={passwort_wdh} onChange={(e) => {setPasswort_wdh(e.target.value)}} onBlur={(e) => handlePasswort(e.target.value, passwort)}
                        label="Passwort wiederholen" variant='outlined' color='text' fullWidth
                        sx={{mt: 2}} />
                </Box>

                <Box mt={5}>
                    <Typography variant='h3'>
                        Befugte Stationen
                    </Typography>
                </Box>

                {/* Alle auswählen */}
                <Box mt={2}>
                    <FormControlLabel control={<Checkbox size='small' checked={allChecked} onChange={(e) => setAllChecked(e.target.checked)}/>} 
                        label={ <Box display={'flex'} gap={3}>
                                    <Typography>
                                        Alle auswählen
                                    </Typography>
                                    <Link href='#0' color={'text.secondary'} onClick={(e) => {e.preventDefault();setCheckboxesVisible((prev) => !prev)}}>
                                        {checkboxesVisible ? 'einklappen' : 'ausklappen'}
                                    </Link>
                                </Box> } 
                    />
                </Box>

                {/* Stationen Checkboxen */}
                {checkboxesVisible && 
                <Box mt={1}>
                    <FormGroup>
                        {facilityInfo?.facility?.stations && facilityInfo.facility.stations.map((station) => {
                            return <FormControlLabel
                                        key={station.username}
                                        checked={checkedStations.includes(station)}
                                        control={<Checkbox size='small' onChange={(e) => handleStationSelect(e, station)} />}
                                        label={`${station.name}`} 
                                    />
                        })}
                    </FormGroup>
                </Box>
                }

                {/* Button */}
                <Box mt={2} mb={4} display={'flex'} flexDirection={'row-reverse'}>
                    <Button variant='contained' onClick={handleRegistration}>
                        Hinzufügen
                    </Button>
                </Box>

                <Snackbar
                    open={registerSnackbar}
                    onClose={() => setRegisterSnackbar(false)}
                    autoHideDuration={4000}
                    message="Benutzer hinzugefügt!"
                />

                <Box display={{lg: 'none'}}>
                    <Divider />
                </Box>
            </Grid>

            <Grid item xs={12} lg={6} px={4} mt={{xs:4, lg: 0}}>

                <Box>
                    <Typography variant='h3'>
                        Benutzerübersicht
                    </Typography>
                </Box>

                <Box mt={2.5} maxWidth={512} height={'85vh'} overflow={'auto'}>
                    <Grid container gap={2}>
                    {facilityUsers ? facilityUsers.map((user) => {
                        return (
                        <Grid item key={user.login_name} width={'100%'}>
                            <Card>
                                <CardActionArea sx={{px: 2, py: 2}} onClick={() => setClickedUser(user)}>
                                    <Box display={'grid'} gridTemplateColumns={'5fr 6fr 1fr'} alignItems={'center'}>
                                        <Typography noWrap pr={2}>
                                            {`${user.firstname} ${user.lastname}`}
                                        </Typography>
                                        <Typography>
                                            {user.login_name}
                                        </Typography>
                                        <Box>
                                            <MoreVertIcon />
                                        </Box>
                                    </Box>
                                </CardActionArea>
                            </Card>
                        </Grid>)
                    }) : (
                        <Box>
                            lade..
                        </Box>
                    )}
                    </Grid>
                </Box>
            </Grid>
        </Grid>

        <Box>
                <Drawer open={!!clickedUser} anchor='right' onClose={() => {setClickedUser(false)}} BackdropProps={{ style: {opacity: 0.6} }}>
                    
                    <Box px={2} pt={2} width={{xs: '80vw', sm: 500}} height={'100vh'}  overflow={'auto'}>
                        
                        {/* Kopf */}
                        <Box display={{xs:'flex', xl:'block'}} justifyContent={'center'} flexDirection={'column'}>
                            {/* Buttons */}
                            <Box display={'flex'} justifyContent={'end'}>
                                <Box>
                                    {/* Löschen */}
                                    <IconButton variant='outlined' color='grey' onClick={handleContextMenuClick}><MoreVertIcon sx={{width: 30, height: 30}} /></IconButton>
                                    <Menu
                                        sx={{mt: 1}}
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleContextMenuClose}
                                    >
                                        <MenuItem sx={{px: 7,py: 1, color: 'error.main'}} onClick={() => {handleContextMenuClose();setDeleteOpen(true)}}>Benutzer Löschen</MenuItem>
                                    </Menu>

                                    <Dialog
                                        open={deleteOpen}
                                        onClose={() => setDeleteOpen(false)}
                                    >
                                        <DialogTitle>
                                            {`Benutzer "${clickedUser?.username}" wirklich löschen?`}
                                        </DialogTitle>
                                        <DialogContent>
                                        <DialogContentText>
                                            {`Der Account wird entgültig gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.`}
                                        </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                        <Button variant='outlined'  onClick={() => setDeleteOpen(false)}>Abbrechen</Button>
                                        <Button variant='contained' onClick={() => handleUserDelete(clickedUser?.id)} autoFocus>Löschen</Button>
                                        </DialogActions>
                                    </Dialog>
                                </Box>
                            </Box>
                        </Box>

                        {/* Body */}
                        <Box>
                            <Box>
                                <Typography variant='h3'>Accountdetails</Typography>
                            </Box>

                            <Box mt={3} display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                                {/* Vorname */}
                                <TextField
                                    defaultValue={clickedUser?.firstname} InputProps={{ readOnly: true }}
                                    label="Vorname" variant='filled' color='text' sx={{width: '47%'}} />
                                
                                {/* Nachname */}
                                <TextField
                                    defaultValue={clickedUser?.lastname} InputProps={{ readOnly: true }}
                                    label="Nachname" variant='filled' color='text' sx={{width: '47%'}}/>    
                            </Box>
                        
                            {/* Benutzername */}
                            <TextField
                                defaultValue={clickedUser?.login_name} InputProps={{ readOnly: true }}
                                label="Benutzername" variant='filled' color='text' fullWidth
                                sx={{mt: 2}} />

                            {/* Stationen */}
                            <Box>
                                <Typography mt={4} variant='h3'>Befugte Stationen</Typography>
                                <Box mt={2}>
                                    {clickedUser?.allowed_stations?.length > 0 && clickedUser.allowed_stations.map((station) => {
                                        const {name, number} = facilityInfo.facility.stations.find((elem) => {
                                            if(elem.username === station)
                                                return {name: elem.name, number: elem.number}
                                        })
                                        return (
                                            <Typography mt={1} key={station}>{name} {number}</Typography>
                                        )
                                    })}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Drawer>

                <Snackbar
                    open={deleteSnackbar}
                    onClose={() => setDeleteSnackbar(false)}
                    autoHideDuration={4000}
                    message="Benutzer gelöscht!"
                />
            </Box>
    </BoxContainer>
    )
}

export default Accounts