import React, { useContext, useEffect, useState } from 'react'
import CaptionContext from '../../context/CaptionProvider'
import NotificationCountContext from '../../context/NotificationCountProvider'
import { Box, Button, Card, Divider, Drawer, Grid, Link, Snackbar, TextField, Typography } from '@mui/material'
import useAuth from '../../hooks/useAuth'
import BoxContainer from '../../components/ui/BoxContainer'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import AdressGrid from '../../components/ui/AdressGrid'
import useFacilityInfo from '../../hooks/useFacilityInfo'

const StationInfo = () => {

    const { setCaption, setHref } = useContext(CaptionContext)
    const { notificationCount } = useContext(NotificationCountContext)
    useEffect(() => {
        setCaption('Stationsinfo')
        setHref('/station-info')
        let title_notification = notificationCount && notificationCount !== 0 ? `(${notificationCount})` : ''
        let title = `${title_notification} Stationsinfo - Compulance Web`
        document.title = title;
    }, [notificationCount])

    const { auth } = useAuth()
    const axiosPrivate = useAxiosPrivate()
    const FACILITY_URL = '/api/facilities'

    const [facilityGroup, setFacilityGroup] = useState()
    const [facility, setFacility] = useState()
    const [station, setStation] = useState()
    const [clickedStation, setClickedStation] = useState()
    const [clickedFacility, setClickedFacility] = useState()
    const [changes, setChanges] = useState(false)
    const [phoneInput, setPhoneInput] = useState()
    const [faxInput, setFaxInput] = useState()
    const [errMsg, setErrMsg] = useState()
    const [snackbar, setSnackbar] = useState(false)

    const checkChange = (prev, now) => {
        if(prev === now)
            return false
        else
            return true
    }

    const handlePhoneChange = (e) => {
        let value = e.target.value
        setPhoneInput(value)
        checkChange(station?.phone, value) ? setChanges(true) : setChanges(false)
    }
    
    const handleFaxChange = (e) => {
        let value = e.target.value
        setFaxInput(value)
        checkChange(station?.fax, value) ? setChanges(true) : setChanges(false)
    }

    const handleAbort = () => {
        if(station) {
            setPhoneInput(station.phone)
            setFaxInput(station.fax)
            setChanges(false)
        }
    }

    const handleChange = async () => {

        const facilityIndex = facilityGroup.facilities.indexOf(facility)
        const stationIndex = facilityGroup.facilities[facilityIndex].stations.indexOf(station)
        const phone_key = `facilities.${facilityIndex}.stations.${stationIndex}.phone`
        const fax_key = `facilities.${facilityIndex}.stations.${stationIndex}.fax`
        
        try {
            await axiosPrivate.put(`${FACILITY_URL}/${auth.username}`, {
                $set: {
                    [phone_key]: phoneInput,
                    [fax_key]: faxInput
                }
            })
            setChanges(false)
            setSnackbar(true)
        } catch (err) {
            setErrMsg('Änderungsversuch fehlgeschlagen.')
            console.log(err)
        }
    }

    // nicht anfassen, so funktionierts
    const facilityInfo = useFacilityInfo(auth.username, auth)
    useEffect(() => {
        setFacilityGroup(facilityInfo.facilityGroup)
        setFacility(facilityInfo.facility)
        setStation(facilityInfo.station)
    }, [facilityInfo, auth])

    useEffect(() => {
        if(station) {
            setPhoneInput(station.phone)
            setFaxInput(station.fax)
        }
    }, [station])

    return (
        <Box bgcolor={'background.paper'}>
            <BoxContainer>
                <Card sx={{bgcolor: 'background.default', p: 2, minHeight: '80vh'}}>
                    <Box  display={'flex'} justifyContent={'space-between'} alignItems={'baseline'} >
                        <Typography variant='h1' >
                            {auth.username}
                        </Typography>
                        <Box
                            component="img"
                            sx={{
                            width: 150,
                            }}
                            alt="clinic-logo"
                            src={require(`../../assets/img/${facilityInfo?.facilityGroup?.name || 'missing'}.png`)}
                        />
                    </Box>
                    <Divider />
                    <Grid container>
                        <Grid item xs={12} sm={6}>
                            <Box mr={5}>
                                <Typography mt={4} variant='h3'>
                                    Stationsdaten
                                </Typography>
                                <Box mt={2} display={'flex'} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'space-between'} gap={3}>
                                    <TextField label='Klinik' variant='filled' InputProps={{ readOnly: true }} value={facility ? facility.name : 'lade..'} fullWidth/>
                                    <TextField label='Station' variant='filled' InputProps={{ readOnly: true }} value={station ? station.name : 'lade..'} sx={{width: '45%'}}/>
                                    <TextField label='Kürzel' variant='filled' InputProps={{ readOnly: true }} value={station ? station.username : 'lade..'} sx={{width: '45%'}}/>
                                    <Box my={1} />
                                    <TextField label='Telefon' type='tel' variant='outlined' value={phoneInput ? phoneInput : 'lade..'} onChange={e => handlePhoneChange(e)} fullWidth/>
                                    <TextField label='Fax' type='tel' variant='outlined' value={faxInput ? faxInput : 'lade..'} onChange={e => handleFaxChange(e)} fullWidth/>
                                </Box>
                                
                                {changes && (
                                <Box mt={4} display={'flex'} justifyContent={'space-between'}>
                                    <Button variant='outlined' color='inherit' onClick={handleAbort}>Abbrechen</Button>
                                    <Button variant='contained' onClick={handleChange}>Speichern</Button>
                                </Box>
                                )}

                                {errMsg && (
                                <Typography mt={2} color={'error'}>
                                    {errMsg}
                                </Typography>
                                )}

                                <Snackbar
                                    open={snackbar}
                                    onClose={() => setSnackbar(false)}
                                    autoHideDuration={4000}
                                    message="Daten aktualisiert!"
                                />
                                
                            </Box>    
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Box ml={{sm:5}}>
                                <Typography mt={4} variant='h3'>
                                    Alle Stationen dieser Einrichtung
                                </Typography>
                                <Box display={'flex'} flexDirection={'row'} justifyContent={'start'} flexWrap={'wrap'}>
                                    {facility ? facility.stations.map((station) => {
                                        return (<Box mr={5} my={0.5} key={station.username}><Link href='#0' onClick={(e) => {e.preventDefault();setClickedStation(station)}} color={'inherit'}>{station.name}</Link></Box>)
                                    }) : ''}
                                </Box>
                                {facilityGroup?.facilities?.length > 1 &&
                                    <Box>
                                        <Typography mt={10} variant='h3'>Partnerkrankenhäuser</Typography>
                                            <Box display={'flex'} flexDirection={'column'} flexWrap={'wrap'}>
                                            {facilityGroup ? facilityGroup.facilities.map((facility) => {
                                                return (<Box my={0.5} key={facility.name}><Link href='#0' onClick={(e) => {e.preventDefault();setClickedFacility(facility)}} color={'inherit'}>{facility.name}</Link></Box>)
                                            }) : ''}
                                        </Box>
                                    </Box>
                                }
                            </Box>
                        </Grid>
                    </Grid>
                </Card>
                

                {/* Klinik Drawer */}
                <Drawer open={clickedFacility ? true : false} anchor='right' onClose={() => {setClickedFacility(false)}} BackdropProps={{ style: {opacity: 0.6} }}>
                    <Box
                        ml={'auto'}
                        p={2}
                        component="img"
                        sx={{
                        width: 150,
                        }}
                        alt="clinic-logo"
                        src={require(`../../assets/img/${facilityInfo?.facilityGroup?.name || 'missing'}.png`)}
                    />
                    <Box px={2} width={500} maxWidth={'75vw'} height={'100vh'}  overflow={'auto'}>
                        <Typography variant='h1'>
                            {clickedFacility?.name}
                        </Typography>
                        <Divider />
                        <Typography mt={3} variant='h3'>
                            Adresse
                        </Typography>
                        <AdressGrid adress={clickedFacility?.adress} />
                        <Box mt={3}>
                            <Divider />
                        </Box>
                        <Typography mt={3} variant='h3'>
                            Stationen
                        </Typography>
                        <Box display={'flex'} flexDirection={'column'}>
                            {clickedFacility ? clickedFacility.stations.map((station) => {
                                return (
                                    <Box key={station.username}>
                                        <Typography mt={3} variant='h4'>{station.name}</Typography>
                                        <Typography mt={1}>Tel: {station.phone}</Typography>
                                        <Typography >Fax: {station.fax}</Typography>
                                    </Box>)
                            }) : ''}
                        </Box>
                    </Box>
                </Drawer>

                {/* Station Drawer */}
                <Drawer open={clickedStation ? true : false} anchor='right' onClose={() => {setClickedStation(false)}} BackdropProps={{ style: {opacity: 0.6} }}>
                    <Box
                        ml={'auto'}
                        p={2}
                        component="img"
                        sx={{
                        width: 150,
                        }}
                        alt="clinic-logo"
                        src={require(`../../assets/img/${facilityInfo?.facilityGroup?.name || 'missing'}.png`)}
                    />
                    <Box px={2} width={500} maxWidth={'75vw'} height={'100vh'}  overflow={'auto'}>
                        <Typography variant='h1'>
                            {clickedStation?.username}
                        </Typography>
                        <Divider />
                        <Typography mt={3} variant='h3'>
                                Stationsdaten
                        </Typography>
                        <Box mt={2} display={'flex'} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'space-between'} gap={3}>
                            <TextField label='Klinik' variant='filled' InputProps={{ readOnly: true }} value={facility ? facility.name : 'lade..'} fullWidth/>
                            <TextField label='Station' variant='filled' InputProps={{ readOnly: true }} value={clickedStation ? clickedStation.name : 'lade..'} sx={{width: '45%'}}/>
                            <TextField label='Kürzel' variant='filled' InputProps={{ readOnly: true }} value={clickedStation ? clickedStation.username : 'lade..'} sx={{width: '45%'}}/>
                            <Box my={1} />
                            <TextField label='Telefon' type='tel' variant='filled' InputProps={{ readOnly: true }} value={clickedStation ? clickedStation.phone : 'lade..'} fullWidth/>
                            <TextField label='Fax' type='tel' variant='filled' InputProps={{ readOnly: true }} value={clickedStation ? clickedStation.fax : 'lade..'} fullWidth/>
                        </Box>
                    </Box>
                </Drawer>

            </BoxContainer>
                
        </Box>
    )
}

export default StationInfo