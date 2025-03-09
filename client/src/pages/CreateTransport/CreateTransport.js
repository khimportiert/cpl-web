import React, { useContext, useEffect, useState } from 'react'
import HorizontalLinearStepper from '../../components/form/HorizontalLinearStepper';
import { Autocomplete, Box, Button, Card, Checkbox, CircularProgress, Divider, FormControlLabel, Grid, IconButton, InputAdornment, Link, Radio, RadioGroup, TextField, Tooltip, Typography } from '@mui/material';
import { DateTimePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import useAuth from '../../hooks/useAuth';
import IconQuestionCircle from '../../assets/icons/IconQuestionCircle';
import IconPersonWalking from '../../assets/icons/IconPersonWalking'
import IconSeatPassenger from '../../assets/icons/IconSeatPassenger'
import IconStretcher from '../../assets/icons/IconStretcher'
import IconVirus from '../../assets/icons/IconVirus'
import IconWeightHanging from '../../assets/icons/IconWeightHanging'
import formatDate from '../../utils/formatDate';
import formatDateBetween from '../../utils/formatDateBetween';
import formatBool from '../../utils/formatBool';
import formatOxygen from '../../utils/formatOxygen';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import IconCheckCircle from '../../assets/icons/IconCheckCircle';
import IconCircleXmark from '../../assets/icons/IconCircleXmark';
import TransportTable from '../../components/ui/TransportTable'
import CaptionContext from '../../context/CaptionProvider';
import formatTime from '../../utils/formatTime';
import { useNavigate } from 'react-router-dom';
import NotificationCountContext from '../../context/NotificationCountProvider';
import useFacilityInfo from '../../hooks/useFacilityInfo';
import AdressGrid from '../../components/ui/AdressGrid';
import AccountChangeButton from '../../components/form/AccountChangeButton';
import AddressAutocomplete from 'mui-address-autocomplete';

const CreateTransport = () => {
    const SUBMIT_URL = '/api/transports';
    const NOTIFICATION_URL = '/api/notifications'
    const [isLoading, setLoading] = useState(false)
    const [errMsg, setErrMsg] = useState()

    const { auth } = useAuth()
    const axiosPrivate = useAxiosPrivate()

    const tooltip01 = 'Wir benöigen diese Information, um eine reibungslose Beförderung zum Zielort sicherzustellen, da gegebenenfalls Beförderungshilfen eingeplant werden müssen.'
    const tooltip02 = 'Wählen Sie "nur Hinfahrt" bei einfacher Fahr. "Hin- und Rückfahrt" falls (z.B. nach Behandlungsterminen) eine Rückfahrt gewünscht ist. "Nur Rückfahr" fall... '

    const bordercolor = '#415F9D'
    
    const date = new Date()
    const default_arrival_time_from = new Date().setMinutes(date.getMinutes() + 30)
    const default_arrival_time_to = new Date().setMinutes(date.getMinutes() + 45)

    const [activeStep, setActiveStep] = useState(0)

    const facilityInfo = useFacilityInfo(auth.username)

    // const created = date.valueOf() // wird vom backend übernommen
    // const [user, setUser] = useState() // wird von auth ersetzt
    const station_phone = facilityInfo?.station?.phone || ''
    const station_fax = facilityInfo?.station?.fax || ''

    const [patient_firstname, setPatient_firstname] = useState()
    const [patient_lastname, setPatient_lastname] = useState()
    const [case_number, setCase_number] = useState()

    const [with_return, setWith_return] = useState('nur Hinfahrt')
    const [fastest_arrival, setfastest_arrival] = useState(false)
    const [arrival_time_from, setArrival_time_from] = useState(default_arrival_time_from)
    const [arrival_time_to, setArrival_time_to] = useState(default_arrival_time_to)
    const arrival_clinic = facilityInfo?.facility?.name
    const arrival_adress = facilityInfo?.facility?.adress
    const arrival_station = facilityInfo ? `${facilityInfo?.station?.name}` : null
    const [destination_name, setDestination_name] = useState('andere')
    const [destination_adress, setDestination_adress] = useState()
    const [destination_station, setDestination_station] = useState('')
    const [barrier_free, setBarrier_free] = useState('nein')
 
    const [treatment_appointment_time, setTreatment_appointment_time] = useState(null)

    const [patient_mobility, setPatient_mobility] = useState('gehfähig')
    const [medical_care, setMedical_care] = useState('nein')
    const [patient_oxygen, setPatient_oxygen] = useState('nein')
    const [patient_infection, setPatient_infection] = useState('nein')
    const [patient_overweight, setPatient_overweight] = useState('< 100kg')
    const [patient_companion, setPatient_companion] = useState('ohne')
    const [note, setNote] = useState('')

    const [selectedFacilityStations, setSelectedFacilityStations] = useState([])

    // const [arrival_time_predicted, setArrival_time_predicted] = useState() // TODO

    // Maps Auto Complete
    const [placeId, setPlaceId] = useState()
    const [mapsAutocompleteValue, setMapsAutocompleteValue] = useState({
        place_id: "",
        description: "",
        components: {},
        structured_formatting: {
            main_text: "",
            secondary_text: "",
            main_text_matched_substrings: []
        }
    });

    const [serverResponse, setServerResponse] = useState()
    const [showRequestError, setShowRequestError] = useState(false)

    const isRequired1 = [station_phone, patient_firstname, patient_lastname, with_return, destination_name, barrier_free]
    const isRequired2 = [patient_mobility, medical_care, patient_oxygen, patient_infection, patient_overweight, patient_companion]

    const validateInput = true
    const handleNext = () => {
        if(!validateInput)
            return setActiveStep((prev) => prev+1)
        switch(activeStep) {
            case 0: {
                // Vorwärts wenn alles ausgefüllt ist
                if(!isRequired1.includes(undefined) && !isRequired1.includes(null) && !isRequired1.includes('')) {
                    // Name und Station prüfen
                    if(!otherDestinactionName && (destination_station === '' || !destination_station) || destination_name === 'andere') {
                        setErrMsg('Bitte füllen Sie alle erforderlichen Felder aus.')
                    } else {
                        setActiveStep((prev) => prev+1)
                        setErrMsg('')
                    }
                } else {
                    setErrMsg('Bitte füllen Sie alle erforderlichen Felder aus.')
                }
                window.scrollTo(0, 0);
                break
            }
            case 1: {
                if(!isRequired2.includes(undefined) && !isRequired2.includes(null) && !isRequired2.includes('')) {
                    // Logische Fehler erkennen
                    let errors = ''
                    if(patient_infection !== 'nein' && patient_companion !== 'ohne')
                        errors += 'Infektiösche Fahrten erlauben keine Begleitpersonen. '
                    if(patient_oxygen !== 'nein' && medical_care !== 'ja')
                        errors += 'Bei Fahrten mit Sauerstoff wird medizinische Betreuung benötigt. '

                    if(errors === '') {
                        setActiveStep((prev) => prev+1)
                        setErrMsg('')
                    } else {
                        setErrMsg(errors)
                    }
                    
                } else {
                    setErrMsg('Bitte füllen Sie alle erforderlichen Felder aus.')
                }
                window.scrollTo(0, 0);
                break
            }
            case 2: {
                setActiveStep((prev) => prev+1)
                window.scrollTo(0, 0);
                break
            }
            default: {
                break
            }
            
        }
    }
    useEffect(() => {
        if(activeStep === 3)
            handleSubmit()
    }, [activeStep])

    // TODO: Die # benutzen um zum vorherigen formular zu kommen
    const handleBack = () => {
        setErrMsg()
        setActiveStep((prev) => prev-1)
    }

    const handleLastname = (e) => {
        e.target.value = e.target.value ? `${e.target.value.charAt(0)}.` : ''
        setPatient_lastname(e.target.value)
    }

    const [patient_oxygen_custom, setPatient_oxygen_custom] = useState('im Fahrzeug')
    useEffect(() => {
        if(patient_oxygen_custom !== 'im Fahrzeug') {
            setPatient_oxygen(patient_oxygen_custom)
        }
    }, [patient_oxygen_custom]
    )

    const [patient_infection_custom, setPatient_infection_custom] = useState('')
    useEffect(() => {
        if(patient_infection_custom !== 'nein') {
            if(patient_infection_custom !== '') {
                setPatient_infection(patient_infection_custom)
            } else {
                setPatient_infection('ja')
            }
        }
    }, [patient_infection_custom])
    useEffect(() => {
        setPatient_infection('nein')
    }, [])
    
    const handleSubmit = async () => {
        setLoading(true)
        try {
            const response = await axiosPrivate.post(SUBMIT_URL,
                JSON.stringify({ 
                    user: { 
                        id: auth.id,
                        firstname: auth.firstname,
                        lastname: auth.lastname,
                        username: auth.username,
                        login_name: auth.login_name,
                        roles: auth.roles,
                        allowed_stations: auth.allowed_stations,
                    },
                    station_phone,
                    station_fax,

                    patient_firstname,
                    patient_lastname,
                    case_number,

                    with_return,
                    fastest_arrival,
                    arrival_time_from,
                    arrival_time_to,
                    arrival_clinic,
                    arrival_adress,
                    arrival_station,
                    destination_name,
                    destination_adress,
                    destination_station,
                    barrier_free,

                    treatment_appointment_time: treatment_appointment_time?.valueOf() ? formatTime(treatment_appointment_time.valueOf()) : 'kein Termin',

                    patient_mobility,
                    medical_care,
                    patient_oxygen: formatOxygen(patient_oxygen),
                    patient_infection,
                    patient_overweight,
                    patient_companion,
                    note
                })
            );
            setServerResponse(response)
            setLoading(false)

            // Benachrichtigung senden
            try {
                await axiosPrivate.post(NOTIFICATION_URL, {
                    user_from: auth.username,
                    user_to: 'KT', // KT username
                    transport_id: response.data.transport._id,
                    transport_patient_firstname: patient_firstname,
                    transport_patient_lastname: patient_lastname,
                    message: 'Neuer Transport',
                })
            } catch (err) {
                console.error(err)
            }

        } catch (err) {
            if(err?.response?.data) {
                setServerResponse(err.response)
                setLoading(false)
            } else {
                setServerResponse({data: {message: 'Ein Fehler ist aufgetreten.', error: {message: 'no server response'}}})
                setLoading(false)
            }
        }
    }

    // change arrival_time_to and arrival_time_to when fastest_arrival is checked
    useEffect(() => {
        if(fastest_arrival === true) {
            setArrival_time_from(default_arrival_time_from)
            setArrival_time_to(default_arrival_time_to)
        }
    }, [fastest_arrival])

    // ask before navigate back
    window.onbeforeunload = () => {
        if (activeStep >= 1 && activeStep < 3) {
            return true;
        }
    }
    useEffect(() => {
        if (activeStep >= 1) {
        const listener = () => true
        window.addEventListener('beforeunload', listener)
        return () => window.removeEventListener('beforeunload', listener)
        }
    }, [activeStep])

    const current_arrival_timespan = () => {
        // TODO: schnellstmögliche Eintreffzeit ausgeben
    }

    // Verfügbare Stationen finden
    const getSelectedFacilityStations = () => {
        const group = facilityInfo?.facilityGroup

        const index = group ? group.facilities.findIndex(facility => {
            return facility.name === destination_name
        }) : -1

        if(group && index !== -1) {
            return group.facilities[index].stations.map(station => {
                return `${station?.name}`
            })
        } else {
            return []
        }
    }
    useEffect(() => {
        setDestination_station('') // Stationfeld leeren
        setSelectedFacilityStations(() => getSelectedFacilityStations())
    }, [destination_name])

    // Erkennen, ob eine der bekannten Partnerkliniken ausgewählt wurde
    const otherDestinactionName = !facilityInfo?.facilityGroup?.facilities?.find((facility) => facility.name === destination_name)

    // Barrierefrei / Fahrstuhl Haken setzen
    useEffect(() => {
        if(!otherDestinactionName) {
            setBarrier_free('ja')
        } else {
            setBarrier_free('nein')
        }
    }, [otherDestinactionName])

    // Med. Betreuung setzen
    useEffect(() => {
        if(otherDestinactionName) {
            setMedical_care('ja')
        } else {
            setMedical_care('nein')
        }
    }, [otherDestinactionName])

    // Adresse übertragen
    const getSelectedAdress = (mapsValue) => {
        if(!otherDestinactionName) {
            // return adress from selected facility
            return facilityInfo.facilityGroup.facilities.filter((facility) => facility.name === destination_name)[0].adress
        } else {
            try {
                const street = mapsValue.components.route[0].long_name
                const number = mapsValue?.components?.street_number ? mapsValue?.components?.street_number[0]?.long_name : '--'
                const plz = mapsValue.components.postal_code[0].long_name
                const city = mapsValue.components.locality[0].long_name
                const country = mapsValue.components.country[0].long_name

                const line1 = mapsValue.description
                if(line1) setDestination_name(line1)

                const place_id = mapsValue?.place_id
                if(place_id) setPlaceId(place_id)

                return {
                    street,
                    number,
                    plz,
                    city,
                    country
                }
            } catch (err) {
                return {
                    street: "--",
                    number: "--",
                    plz: "--",
                    city: "--",
                    country: "--"
                }
            }
        }
    }
    useEffect(() => {
        setDestination_adress(getSelectedAdress(mapsAutocompleteValue))
    }, [destination_name, mapsAutocompleteValue])

    // set Page Title and Caption
    const { setCaption, setHref } = useContext(CaptionContext);
    const { notificationCount } = useContext(NotificationCountContext)
    useEffect(() => {
        let title_notification = notificationCount && notificationCount !== 0 ? `(${notificationCount})` : ''
        let title = `${title_notification} Neuer Transport - Compulance Web`
        switch(activeStep) {
            case 0: {
                title = `${title_notification} Neuer Transport- Compulance Web`
                setCaption('Neuer Transport')
                setHref('/create-transport')
                break
            }
            case 1: {
                title = `${title_notification} Transportart- Compulance Web`
                setCaption('Transportart')
                setHref('/create-transport')
                break
            }
            case 2: {
                title = `${title_notification} Eingaben prüfen- Compulance Web`
                setCaption('Eingaben prüfen')
                setHref('/create-transport')
                break
            }
            case 3: {
                title = `${title_notification} Fertig - Compulance Web`
                setCaption('Fertig')
                setHref('/create-transport')
                break
            }
        }
        document.title = title;
    }, [activeStep, notificationCount]);

    return (
        <Box bgcolor={'background.paper'}>
            <Box height={'100%'} minHeight={'100vh'} paddingTop={7} paddingX={[2, 2, 20]} maxWidth={[800,1300]} marginX={'auto'}>
                <HorizontalLinearStepper activeStep={activeStep} setActiveStep={setActiveStep} steps={['','','']} button_labels={['Weiter zur Transportart', 'Weiter zur Bestellung', 'Jetzt Bestellen']}
                    onNext={handleNext} onBack={handleBack} facility_name={facilityInfo?.facilityGroup?.name || 'missing'} >
                    
                    <Typography my={3} variant='h4' color="error.main" >{errMsg}</Typography>

                    {activeStep === 0 && (<>
                    <Grid container rowSpacing={2} >

                        {/* Patienteninformationen */}
                        <Grid item xs={12} sm={6}>
                            <Box m={1}>
                                <Card sx={{bgcolor: 'background.default'}}>
                                    <Box bgcolor={bordercolor} pl={1}>
                                        <Typography variant='h3' color='primary.contrastText'>Patienteninformationen</Typography>
                                    </Box>
                                    <Box p={2} pb={3} >
                                        <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                                            {/* Nachname */}
                                            <TextField error={errMsg && !patient_lastname}
                                                required defaultValue={patient_lastname} onBlur={(e) => handleLastname(e)}
                                                label="Nachname" variant='standard' color='text' sx={{width: '20%'}} />
                                            
                                            {/* Vorname */}
                                            <TextField error={errMsg && !patient_firstname}
                                                required defaultValue={patient_firstname} onChange={(e) => setPatient_firstname(e.target.value)}
                                                label="Vorname" variant='standard' color='text' sx={{width: '75%'}}/>    
                                        </Box>
                                        
                                        {/* Hausinterne Fallnummer */}
                                        <TextField type='number' defaultValue={case_number} onChange={(e) => setCase_number(e.target.value)}
                                            label="Hausinterne Fallnummer (optional)" variant='standard' color='text' fullWidth
                                            sx={{mt: 2}} />
                                    </Box>
                                </Card>
                            </Box>
                        </Grid>
                        
                        {/* Abholort */}
                        <Grid item xs={12} sm={6}>
                            <Box m={1}>
                                <Card sx={{bgcolor: 'background.default'}}>
                                    <Box display={'flex'} bgcolor={bordercolor} pl={1} >
                                        <Typography mr={2} variant='h3' color={'primary.contrastText'}>Abholort:</Typography>
                                        <AccountChangeButton station_username={auth.username} station_name={facilityInfo?.station?.name}/>
                                    </Box>
                                    <Box p={1} pb={3} >
                                        {/* Station */}
                                        <TextField required value={arrival_station} InputProps={{ readOnly: true }}
                                            label="Station" variant="filled" color="text" fullWidth />

                                        {/* Rückrufnummer */}
                                        <TextField error={errMsg && !station_phone}
                                            onFocus={(e) => e.target.select()} 
                                            type='tel' required value={station_phone} InputProps={{ readOnly: true }}
                                            label="Nummer für Rückfrage" variant='filled' color='text' fullWidth
                                            sx={{mt: 1}} />
                                    </Box>
                                </Card>
                            </Box>
                        </Grid>
                        
                        {/* Zielort */}
                        <Grid item xs={12}>
                            <Box m={1}>
                                <Card sx={{bgcolor: 'background.default'}}>
                                    <Box bgcolor={bordercolor} pl={1} >
                                        <Typography variant='h3' color='primary.contrastText'>Zielort</Typography>
                                    </Box>
                                    <Box p={1} pb={3}>
                                        {/* Hin & Rückfahrt */}
                                        <RadioGroup row value={with_return} onChange={(e) => setWith_return(e.target.value)}>
                                            <Box mr={3}>
                                                <FormControlLabel value={'nur Hinfahrt'} control={<Radio size='small' />} label={<>nur Hinfahrt</>} />
                                            </Box>
                                            <Box mr={3}>
                                                <FormControlLabel value={'Hin- & Rückfahrt'} control={<Radio size='small' />} label={<>Hin- & Rückfahrt</>} />
                                            </Box>
                                            <Box mr={3}>
                                                <FormControlLabel value={'nur Rückfahrt'} control={<Radio size='small' />} label={<>nur Rückfahrt</>} />
                                                <Tooltip title={tooltip02} enterTouchDelay={300} disableFocusListener><IconButton><IconQuestionCircle /></IconButton></Tooltip>
                                            </Box>
                                        </RadioGroup>

                                        <Divider />
                                        
                                        {/* Kliniken Radiobuttons */}
                                        
                                            <Box>
                                                <RadioGroup value={destination_name} onChange={(e) => setDestination_name(e.target.value)}>
                                                    {facilityInfo?.facilityGroup?.facilities?.length > 1 &&
                                                        <Box my={2} sx={{display: 'grid', gridTemplateColumns: {xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)'}}}>
                                                            {facilityInfo.facilityGroup.facilities.map((facility) => {
                                                                return (<FormControlLabel key={facility.name} value={facility.name} control={<Radio size='small' />} label={facility.name} />)
                                                            })}
                                                            <Box mt={1}>
                                                                <FormControlLabel value={otherDestinactionName ? destination_name : 'andere'} control={<Radio size='small' />} label={<>andere</>} />
                                                            </Box>
                                                        </Box>
                                                    }
                                                </RadioGroup>
                                            </Box>
                                        

                                        {/* Anderer Zielort */}
                                        {otherDestinactionName &&
                                            <Box width={{xs: '100%', lg: '50%'}} pr={3}>
                                                {/* <TextField error={errMsg && (!destination_name || destination_name === 'andere')}
                                                required onChange={(e) => {setDestination_name(e.target.value)}}
                                                label="Klinik / Adresse" variant='standard' color='text' fullWidth /> */}

                                                <AddressAutocomplete
                                                    apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                                                    renderInput={(params) => <TextField
                                                                                {...params}
                                                                                error={errMsg && (!mapsAutocompleteValue || !mapsAutocompleteValue?.place_id)} // setErrMsg........
                                                                                label="Klinik / Adresse"
                                                                                required
                                                                                />}
                                                    fields={[]} // fields will always contain address_components and formatted_address, no need to repeat them
                                                    onChange={(e, value) => {
                                                        setMapsAutocompleteValue(value)
                                                        console.log(value)
                                                    }}
                                                    value={mapsAutocompleteValue}
                                                />
                                            </Box>
                                        }
                                        
                                        {/* Station */}
                                        <Box mt={2} display={'flex'} flexWrap={'wrap'} alignItems={'center'}>
                                            <Box width={{xs: '100%', lg: '50%'}} pr={3}>
                                                {otherDestinactionName ? (
                                                    <Box>
                                                        <TextField
                                                            inputProps={{autoComplete: 'new-password'}} value={destination_station} onChange={(e) => setDestination_station(e.target.value)}
                                                            label="Station / Etage / Adresszusatz" variant='outlined' color='text' fullWidth />
                                                    </Box>
                                                ) : (
                                                    <Autocomplete
                                                        freeSolo={true}
                                                        value={destination_station}
                                                        onInputChange={(e, newValue) => {
                                                            setDestination_station(newValue)
                                                        }}
                                                        options={selectedFacilityStations}
                                                        noOptionsText={'Keine Station gefunden'}
                                                        renderInput={(params) => 
                                                            <TextField {...params} error={errMsg && (destination_station === '' || !destination_station)} required label="Station" variant='outlined' color='text' fullWidth />
                                                        }
                                                    />
                                                )}

                                            </Box>
                                            {/* Barrierefrei/Fahrstuhl */}
                                            <Box mt={2}>
                                                <FormControlLabel control={<Checkbox size='small' checked={barrier_free === 'ja'} onChange={(e) => setBarrier_free(e.target.checked ? 'ja' : 'nein')}/>} label="Barrierefrei / Fahrstuhl" />
                                                <Tooltip title={tooltip01} enterTouchDelay={300} disableFocusListener><IconButton><IconQuestionCircle /></IconButton></Tooltip>
                                            </Box>
                                            
                                        </Box>

                                        {otherDestinactionName && destination_adress && (      
                                            <Box mt={4} >
                                                <Divider />

                                                <Grid container>

                                                    {/* Addresse */}
                                                    <Grid item xs={12} lg={6}>
                                                        <Box>
                                                            <Typography mt={3} variant='h3'>
                                                                Zieladresse:
                                                            </Typography>
                                                            <AdressGrid adress={destination_adress} />
                                                        </Box>    
                                                    </Grid>

                                                    {/* Karte */}
                                                    <Grid item xs={12} lg={6}>
                                                        <Box pt={3}>
                                                            {placeId ? (
                                                                <iframe
                                                                    width={'100%'}
                                                                    height={300}
                                                                    style={{border: 0}}
                                                                    loading="lazy" 
                                                                    allowFullScreen 
                                                                    src={`https://www.google.com/maps/embed/v1/place?q=place_id:${placeId}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}>
                                                                </iframe>
                                                            ) : (
                                                                <Box />
                                                            )}
                                                        </Box>    
                                                    </Grid>

                                                </Grid>
                                            </Box>
                                        )}

                                    </Box>
                                </Card>
                            </Box>                        
                        </Grid>


                        {/* Datum und Uhrzeit */}
                        <Grid item xs={12}>
                            <Box m={1}>
                                <Card sx={{bgcolor: 'background.default'}}>
                                    <Box bgcolor={bordercolor} pl={1} >
                                        <Typography variant='h3' color='primary.contrastText'>Datum und Zeitraum</Typography>
                                    </Box>
                                    <Box p={1} pb={3}>
                                        <Box>
                                            {/* Schnellstmöglich */}
                                            <Box mb={2}>
                                                <FormControlLabel control={<Checkbox checked={fastest_arrival} onChange={(e) => setfastest_arrival(e.target.checked ? true : false)}/>} label="schnellstmöglich" />
                                            </Box>
                                            {fastest_arrival ? (
                                                <Box height={72}>
                                                    <Typography variant='p'>geschätztes Eintreffen in 45 bis 60 Minuten</Typography>
                                                </Box>
                                            ) : (<Box>
                                                {/* Abhohlungszeit von */}
                                                <Box width={{xs: '100%', sm: '50%'}} sx={{display: 'inline-block', paddingInlineEnd: 2, mb: 2}}>
                                                    <DateTimePicker label="Abholung von" slotProps={{ textField: { fullWidth: true } }} defaultValue={dayjs(arrival_time_from)} disablePast format='DD.MM.YY  HH:mm' onChange={(value) => setArrival_time_from(value.valueOf())} />
                                                </Box>
                                                {/* Abhohlungszeit bis */}
                                                <Box width={{xs: '100%', sm: '50%'}} sx={{display: 'inline-block', paddingInlineEnd: 2, mb: 2}}>
                                                    <DateTimePicker label="bis" slotProps={{ textField: { fullWidth: true } }} defaultValue={dayjs(arrival_time_to)} disablePast format='DD.MM.YY  HH:mm' onChange={(value) => setArrival_time_to(value.valueOf())} />
                                                </Box>
                                            </Box>)}
                                        </Box>
                                        {/* Behandlungstermin */}
                                        <Box>
                                            <Box width={{xs: '100%', sm: '50%'}} sx={{display: 'inline-block', paddingInlineEnd: 2, mt: 2, mb: 1}}>
                                                <TimePicker
                                                    label="Behandlungstermin (optional)"
                                                    format='HH:mm'
                                                    slotProps={{ textField: { fullWidth: true } }}
                                                    value = {treatment_appointment_time}
                                                    onChange={(value) => setTreatment_appointment_time(value)}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                </Card>
                            </Box>
                        </Grid>
                    </Grid>
                    </>)}

                    {activeStep === 1 && (<>
                    <Grid container rowSpacing={2} >

                        {/* Mobilität */}
                        <Grid item xs={12} sm={6} lg={4}>
                            <Box m={1}>
                                <Card sx={{bgcolor: 'background.default'}}>
                                    <Box bgcolor={bordercolor} pl={1} >
                                        <Typography variant='h3' color='primary.contrastText'>Mobilität</Typography>
                                    </Box>
                                    <Box p={1} pb={3} height={160}>
                                        <RadioGroup value={patient_mobility} onChange={(e) => setPatient_mobility(e.target.value)}>
                                            <FormControlLabel value={'gehfähig'} control={<Radio size='small' />} label={<><IconPersonWalking /> gehfähig</>} />
                                            <FormControlLabel value={'sitzend'} control={<Radio size='small' />} label={<><IconSeatPassenger /> sitzend</>} />
                                            <FormControlLabel value={'liegend'} control={<Radio size='small' />} label={<><IconStretcher /> liegend</>} />
                                        </RadioGroup>
                                    </Box>
                                </Card>
                            </Box>
                        </Grid>

                        {/* Medizinische Betreuung */}
                        <Grid item xs={12} sm={6} lg={4}>
                            <Box m={1}>
                                <Card sx={{bgcolor: 'background.default'}}>
                                    <Box bgcolor={bordercolor} pl={1} >
                                        <Typography variant='h3' color='primary.contrastText'>Medizinische Betreuung</Typography>
                                    </Box>
                                    <Box p={1} pb={3} height={160}>
                                        <RadioGroup row value={medical_care} onChange={(e) => setMedical_care(e.target.value)}>
                                            <FormControlLabel value={'ja'} control={<Radio />} label={<>ja</>} 
                                                sx={{paddingRight: 7}}/>
                                            <FormControlLabel value={'nein'} control={<Radio />} label={<>nein</>}
                                                sx={{paddingRight: 3}} />
                                        </RadioGroup>   
                                    </Box>
                                </Card>
                            </Box>
                        </Grid>

                        {/* Sauerstoff */}
                        <Grid item xs={12} sm={6} lg={4}>
                            <Box m={1}>
                                <Card sx={{bgcolor: 'background.default'}}>
                                    <Box bgcolor={bordercolor} pl={1} >
                                        <Typography variant='h3' color='primary.contrastText'>Sauerstoff</Typography>
                                    </Box>
                                    <Box p={1} pb={3} height={160}>
                                        <RadioGroup row value={patient_oxygen} onChange={(e) => setPatient_oxygen(e.target.value)}>
                                            <FormControlLabel value={'ab Station'} control={<Radio />} label={<>ja</>} 
                                                sx={{paddingRight: 7}} />
                                            <FormControlLabel value={'nein'} defaultChecked control={<Radio />} label={<>nein</>}
                                                sx={{paddingRight: 3}} />
                                        </RadioGroup>
                                        {patient_oxygen !== 'nein' ? (
                                            <RadioGroup value={patient_oxygen} onChange={(e) => setPatient_oxygen(e.target.value)} >
                                                <FormControlLabel value={'ab Station'} control={<Radio />} label={'ab Station'} />
                                                <FormControlLabel value={ patient_oxygen_custom } control={<Radio />} label={<>im Fahrzeug 
                                                    <TextField type="number" value={patient_oxygen_custom} InputProps={{ inputProps: { min: 1 } }} 
                                                        onChange={(e) => setPatient_oxygen_custom((e.target?.value) ? e.target.value : 1 )}
                                                        variant='standard' color='text' sx={{mx: 1, width: 50}}>
                                                    </TextField> l/min </>} 
                                                />
                                            </RadioGroup>
                                        ) : ( <Box /> )}
                                    </Box>
                                </Card>
                            </Box>
                        </Grid>

                        {/* Infektion */}
                        <Grid item xs={12} sm={6} lg={4}>
                            <Box m={1}>
                                <Card sx={{bgcolor: 'background.default'}}>
                                    <Box bgcolor={bordercolor} pl={1} >
                                        <Typography variant='h3' color='primary.contrastText'>Infektion</Typography>
                                    </Box>
                                    <Box p={1} pb={3} height={160}>
                                        <RadioGroup row value={patient_infection} onChange={(e) => setPatient_infection(e.target.value)}>
                                            <FormControlLabel value={patient_infection_custom || 'ja'} control={<Radio />} label={<>ja</>} 
                                                sx={{paddingRight: 7}}/>
                                            <FormControlLabel value={'nein'} control={<Radio />} label={<>nein</>}
                                                sx={{paddingRight: 3}} />
                                        </RadioGroup>
                                        {patient_infection !== 'nein' ? (
                                            <TextField inputProps={{autoComplete: 'new-password'}} value={patient_infection_custom} 
                                                onChange={(e) => setPatient_infection_custom(e.target.value)}
                                                variant='standard' label='Besiedlung/Keim' color='text' sx={{mx: 2, width: 200}}>
                                            </TextField>
                                        ) : ( <Box /> )}
                                    </Box>
                                </Card>
                            </Box>
                        </Grid>

                        {/* Gewicht */}
                        <Grid item xs={12} sm={6} lg={4}>
                            <Box m={1}>
                                <Card sx={{bgcolor: 'background.default'}}>
                                    <Box bgcolor={bordercolor} pl={1} >
                                        <Typography variant='h3' color='primary.contrastText'>Gewicht</Typography>
                                    </Box>
                                    <Box p={1} pb={3} height={160}>
                                        <RadioGroup value={patient_overweight} onChange={(e) => setPatient_overweight(e.target.value)}>
                                            <FormControlLabel value={'< 100kg'} control={<Radio />} label={'< 100kg'} />
                                            <FormControlLabel value={'100kg bis 130kg'} control={<Radio />} label={'100kg bis 130kg'} />
                                            <FormControlLabel value={'> 130kg'} control={<Radio />} label={'> 130kg'} />
                                        </RadioGroup>
                                    </Box>
                                </Card>
                            </Box>
                        </Grid>
                        
                        {/* Begleitung */}
                        <Grid item xs={12} sm={6} lg={4}>
                            <Box m={1}>
                                <Card sx={{bgcolor: 'background.default'}}>
                                    <Box bgcolor={bordercolor} pl={1} >
                                        <Typography variant='h3' color='primary.contrastText'>Begleitung</Typography>
                                    </Box>
                                    <Box p={1} pb={3} height={160}>
                                        <RadioGroup  value={patient_companion} onChange={(e) => setPatient_companion(e.target.value)}>
                                            <FormControlLabel value={'ohne'} control={<Radio />} label={<>ohne</>}  />
                                            <FormControlLabel value={'mit Begleitperson'} control={<Radio />} label={<>mit weiterer Begleitperson</>} />
                                            <FormControlLabel value={'mit Kind'} control={<Radio />} label={<>mit Kind</>} />
                                        </RadioGroup>
                                    </Box>
                                </Card>
                            </Box>
                        </Grid>

                        {/* Anmerkungen */}
                        <Grid item xs={12}>
                            <Box m={1}>
                                <Card sx={{bgcolor: 'background.default'}}>
                                    <Box bgcolor={bordercolor} pl={1} >
                                        <Typography variant='h3' color='primary.contrastText'>{'Anmerkung (optional)'}</Typography>
                                    </Box>
                                    <Box >
                                        <Box>
                                            <TextField
                                                placeholder='geben Sie uns hier Informationen mit...'
                                                multiline rows={3} value={note} onChange={(e) => setNote(e.target.value)} fullWidth />
                                        </Box>
                                    </Box>
                                </Card>
                            </Box>
                        </Grid>
                    </Grid>
                    </>)}

                    {activeStep === 2 && (<>
                    <Card sx={{bgcolor: 'background.default', p: 1, pb: 3}}>
                        <Typography ml={2} mt={2} mb={3} variant='h3'>Bitte überprüfen Sie diese Angaben:</Typography>
                        
                        <TransportTable 
                            patient_lastname={patient_lastname}
                            patient_firstname={patient_firstname}
                            case_number={case_number}
                            withReturn={with_return}
                            arrival_clinic={arrival_clinic}
                            arrival_station={arrival_station}
                            destination_name={destination_name}
                            destination_adress={destination_adress}
                            destination_station={destination_station}
                            barrier_free={barrier_free}
                            timeframe={!fastest_arrival ? (<>
                                    {formatDateBetween(formatDate(arrival_time_from),formatDate(arrival_time_to))}
                                </>) : (
                                    'schnellstmöglich'
                                )}
                            treatment_appointment_time={treatment_appointment_time?.valueOf() ? formatTime(treatment_appointment_time.valueOf()) : 'kein Termin'}
                            patient_mobility={patient_mobility}
                            medical_care={medical_care}
                            patient_oxygen={formatOxygen(patient_oxygen)}
                            patient_infection={patient_infection}
                            patient_overweight={patient_overweight}
                            patient_companion={patient_companion}
                            note={note}
                            creation_details={`Erstellt von ${auth.login_name} am ${date.toLocaleDateString()} um ${date.toLocaleTimeString()}`}
                            station_phone={station_phone}
                        />
                    </Card>
                    </>)}
                    
                    {activeStep === 3 && (<>
                    <Box sx={{mt: 7}}>
                        {isLoading ? (
                            <Box display="flex" justifyContent="center" alignItems="center" textAlign="center">
                                <CircularProgress color='info'/>
                                <Typography paddingLeft={2}>Daten werden versendet</Typography>
                            </Box>
                        ) : (
                            <>{serverResponse?.data?.error ? (
                                <Box>
                                    <Typography variant='h2'>
                                        {serverResponse?.data?.message}
                                    </Typography>
                                    
                                    <Typography textAlign="center" marginY={6}>
                                        <IconCircleXmark height="5em" width="5em" color="#FF7F11"/>
                                    </Typography>
                                    
                                    <Typography color={'error'}>
                                        Wir konnten Ihre Anfrage aktuell leider nicht bearbeiten.
                                        <br /><br />
                                        Bitte versuchen Sie es später erneut oder <Link href="/help" color='inherit'>kontaktieren Sie uns hier.</Link>
                                    </Typography>
                                    <Box marginTop={3} >
                                        <Link href="#0" color={'text.secondary'} onClick={(e) => {e.preventDefault();setShowRequestError((prev) => !prev)}}>
                                            {!showRequestError ? (
                                                "Fehlertext anzeigen"
                                            ) : (
                                                "Fehlertext ausblenden"
                                            )}
                                        </Link>
                                    </Box>
                                    {showRequestError && 
                                        <Typography >{JSON.stringify(serverResponse?.data?.error)}</Typography>}
                                    <Box mt={4}>
                                        <Button color="inherit" variant="outlined" sx={{mr: 5}} onClick={() => setActiveStep(0)}>
                                            Erneut versuchen
                                        </Button>
                                        <Button variant='contained' href="/">
                                            Zur Startseite
                                        </Button>
                                    </Box>
                                </Box>
                            ) : (
                                <Box>
                                    <Typography variant='h2'>
                                        {serverResponse?.data?.message}
                                    </Typography>

                                    <Typography textAlign="center" marginY={4}>
                                        <IconCheckCircle height="5em" width="5em" color="green"/>
                                    </Typography>

                                    <Typography variant='h3'>
                                        Zusammenfassung
                                    </Typography>
                                    
                                    <TransportTable 
                                        patient_lastname={serverResponse?.data?.transport?.patient_lastname}
                                        patient_firstname={serverResponse?.data?.transport?.patient_firstname}
                                        case_number={serverResponse?.data?.transport?.case_number}
                                        withReturn={serverResponse?.data?.transport?.with_return}
                                        arrival_clinic={serverResponse?.data?.transport?.arrival_clinic}
                                        arrival_station={serverResponse?.data?.transport?.arrival_station}
                                        destination_name={serverResponse?.data?.transport?.destination_name}
                                        destination_adress={serverResponse?.data?.transport?.destination_adress}
                                        destination_station={serverResponse?.data?.transport?.destination_station}
                                        barrier_free={serverResponse?.data?.transport?.barrier_free}
                                        timeframe={!serverResponse?.data?.transport?.fastest_arrival ? (<>
                                                {formatDate(serverResponse?.data?.transport?.arrival_time_from)}
                                                {' bis '}
                                                {formatDate(serverResponse?.data?.transport?.arrival_time_to)}
                                            </>) : (
                                                'schnellstmöglich'
                                            )}
                                        treatment_appointment_time={serverResponse?.data?.transport?.treatment_appointment_time}
                                        patient_mobility={serverResponse?.data?.transport?.patient_mobility}
                                        medical_care={serverResponse?.data?.transport?.medical_care}
                                        patient_oxygen={serverResponse?.data?.transport?.patient_oxygen}
                                        patient_infection={serverResponse?.data?.transport?.patient_infection}
                                        patient_overweight={serverResponse?.data?.transport?.patient_overweight}
                                        patient_companion={serverResponse?.data?.transport?.patient_companion}
                                        note={serverResponse?.data?.transport?.note}
                                        creation_details={`Erstellt von ${serverResponse?.data?.transport?.user?.firstname} ${serverResponse?.data?.transport?.user?.lastname}`}
                                        station_phone={serverResponse?.data?.transport?.station_phone}
                                    />
                                    
                                    <Box my={4}>
                                        <Button variant='contained' href="/">
                                            Zur Startseite
                                        </Button>
                                    </Box>
                                </Box>
                            )}</>
                        )}
                    </Box>
                    </>)}
                </HorizontalLinearStepper>
            </Box>
        </Box>
    )
}

export default CreateTransport