import React, { useContext, useEffect, useState } from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import CaptionContext from '../../context/CaptionProvider'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Button, Card, CircularProgress, Drawer, Grid, InputAdornment, Link, TextField, Typography, useMediaQuery } from '@mui/material'
import formatDate from '../../utils/formatDate'
import formatDateBetween from '../../utils/formatDateBetween'
import formatTimeAgo from '../../utils/formatTimeAgo'
import formatWithReturn from '../../utils/formatWithReturn'
import TransportTable from '../../components/ui/TransportTable'
import State from '../../components/ui/States'
import { formatDateAttr } from '../../utils/formatDateAttr'
import IconArrowDownShort from '../../assets/icons/IconArrowDownShort'
import IconClose from '../../assets/icons/IconClose'
import { EmblemAdipositas, EmblemBegleitung, EmblemBetreuung, EmblemGehfähig, EmblemInfektion, EmblemLiegend, EmblemNoAdipositas, EmblemNoBegleitung, EmblemNoBetreuung, EmblemNoInfektion, EmblemNoSauerstoff, EmblemSauerstoff, EmblemSitzend } from '../../components/ui/Emblems'
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid'
import { useTheme } from '@emotion/react'
import NotificationCountContext from '../../context/NotificationCountProvider'
import useAuth from '../../hooks/useAuth'
import useFacilityInfo from '../../hooks/useFacilityInfo'
import useRefreshToken from '../../hooks/useRefreshToken'

const Transports = () => {

    // Überschrift und Titel
    const { setCaption, setHref } = useContext(CaptionContext)
    const { notificationCount } = useContext(NotificationCountContext)
    useEffect(() => {
        setCaption('Bestellte Transporte')
        setHref('/transports')
        let title_notification = notificationCount && notificationCount !== 0 ? `(${notificationCount})` : ''
        let title = `${title_notification} Bestellte Transporte - Compulance Web`
        document.title = title;
    }, [notificationCount])

    // Get Current Breakpoint
    const theme = useTheme();
    const greaterThanMid = useMediaQuery(theme.breakpoints.up("md"));
    const smallToMid = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const lessThanSmall = useMediaQuery(theme.breakpoints.down("sm"));

    const TRANSPORTS_URL = '/api/transports'
    const REFRESH_TIMER = 10000
    const navigate = useNavigate()
    const location = useLocation()
    const axiosPrivate = useAxiosPrivate()
    const { auth } = useAuth()
    const refresh = useRefreshToken();

    const [isLoading, setLoading] = useState(false)
    const [transports, setTransports] = useState([])
    const [stateOpen, setStateOpen] = useState(false)
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [clickedTransport, setClickedTransport] = useState()
    const [rows, setRows] = useState([])

    // URL Params Query
    const queryParams = new URLSearchParams(window.location.search)
    const transport_id = queryParams.get('id')
    useEffect(() => {
        if(transport_id) {
            try {
                getTransport()
                setDetailsOpen(true)
            } catch (err) {
                console.log(err)
            }
        }
    }, [])
    // URL Params API Request
    const getTransport = () => {
        let isMounted = true;
        const controller = new AbortController();

        setLoading(true)
        const request = async () => {
            try {
                const response = await axiosPrivate.get(`${TRANSPORTS_URL}/${transport_id}`, {
                    signal: controller.signal
                });
                isMounted && setClickedTransport(response.data);
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

    // Abholung Cell Render
    const renderTimeframe = (transport) => {
        const arrival_date_from=`${formatDateAttr(transport.arrival_time_from).date}`
        const arrival_time_from=`${formatDateAttr(transport.arrival_time_from).time} Uhr`
        const arrival_date_to=formatDateAttr(transport.arrival_time_from).date === formatDateAttr(transport.arrival_time_to).date ? '' : `${formatDateAttr(transport.arrival_time_to).date}`
        const arrival_time_to=`${formatDateAttr(transport.arrival_time_to).time} Uhr`

        return (
            <Box width={'100%'}>
                <Typography variant='h4'>{arrival_date_from}</Typography>
                <Typography>{arrival_time_from} -</Typography>
                <Typography variant='h4'>{arrival_date_to}</Typography>
                <Typography>{arrival_time_to}</Typography>
            </Box>
        )
    }

    // Erstellt Cell Render
    const renderTimeAgo = (timestamp) => {
        const timeAgo = formatTimeAgo(timestamp)
        return (
            <Box>
                {timeAgo}
            </Box>
        )
    }

    // Zielort Cell Render
    const renderZielort = (params) => {
        return (
            <Box>
                <Typography>{params.name}</Typography>
                <Typography>{params.station}</Typography>
            </Box>
        )
    }

    // Emblem Cell Render
    const renderEmblems = (transport) => {
        return (
        <Box display={'block'}>
            <Box display={'flex'} gap={0.5}>
                {transport.patient_mobility === 'gehfähig' && <EmblemGehfähig />}
                {transport.patient_mobility === 'sitzend' && <EmblemSitzend />}
                {transport.patient_mobility === 'liegend' && <EmblemLiegend />}
                {transport?.medical_care !== 'nein' ? <EmblemBetreuung /> : <EmblemNoBetreuung />}
                {transport?.patient_oxygen !== 'nein' ? <EmblemSauerstoff /> : <EmblemNoSauerstoff />}
                {transport?.patient_infection !== 'nein' ? <EmblemInfektion /> : <EmblemNoInfektion />}
                {transport?.patient_overweight !== '< 100kg' ?  <EmblemAdipositas /> : <EmblemNoAdipositas />}
                {transport?.patient_companion !== 'ohne' ? <EmblemBegleitung /> : <EmblemNoBegleitung />}
            </Box>
        </Box>)
    }

    // Status Cell Render
    const renderState = (state) => {
        return (
            <State state={state} />)
    }

    // Row Klick Handler
    const handleRowClick = (params) => {
        setClickedTransport(params.row.data)
        setDetailsOpen(true)
    }

    // API Request
    const requestTransports = async () => {
        setLoading(true)
        let isMounted = true;
        const controller = new AbortController();

        const getTransports = async () => {
            console.log(auth.username)
            try {
                const response = await axiosPrivate.get(TRANSPORTS_URL, {
                    signal: controller.signal
                });
                isMounted && setTransports(response.data);
                setLoading(false)
            } catch (err) {
                setLoading(false)
                if(err?.name !== 'CanceledError')
                    console.error(err);
                // 'cause StrictMode
                if(!controller.signal.aborted)
                    navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getTransports()

        return () => {
            isMounted = false;
            controller.abort();
        }
    }

    useEffect(() => {
        requestTransports() 
        const interval = setInterval(() => {
            requestTransports()
          }, REFRESH_TIMER);
          return () => clearInterval(interval);
    }, [auth])


    const columns = [
        { field: 'Abholung', headerName: 'Abholung', description: 'Abholung', minWidth: 90, flex: 2, sortable: false,
            renderCell: (params) => <>{renderTimeframe(params.value)}</> },

        { field: 'Patientenname', headerName: 'Patientenname', description: 'Patientenname', minWidth: 210, flex: 2, sortable: false,
            renderCell: (params) => <Box>{params.value.name} {renderEmblems(params.value.data)}</Box>},

        { field: 'Nach', headerName: 'Nach', description: 'Zielort', minWidth: 100, flex: 3, sortable: false,
            renderCell: (params) => <>{renderZielort(params.value)}</>},

        { field: 'Status', headerName: 'Status', description: 'Status', width: 160,
            renderCell: (params) => <>{renderState(params.value)}</> },

        { field: 'Eingang', headerName: 'Eingang', description: 'Auftragseingang', width: 130,
            renderCell: (params) => <>{renderTimeAgo(params.value)}</> },
    ]

    useEffect(() => {
        const r = transports.map((transport) => { 
            return {
                id: transport._id,
                Abholung: transport,
                Patientenname: {name: `${transport.patient_firstname || ''} ${transport.patient_lastname || ''} ${transport.case_number ? '('+transport.case_number+')' : ''}`, data: transport},
                Nach: {name: transport.destination_name, station: transport.destination_station},
                Eigenschaften: renderEmblems(transport),
                Status: transport.state,
                Eingang: transport.created,
                data: transport
            }
        })
        setRows(r)
    }, [transports])

    const CustomToolbar =() => {
        return (
          <GridToolbarContainer>
            <GridToolbarFilterButton style={{ color: '#494949' }} />
            <GridToolbarDensitySelector style={{ color: '#494949' }} />
            <GridToolbarQuickFilter style={{ marginLeft: 'auto'}} />
          </GridToolbarContainer>
        )
    }

    return (
        <Box bgcolor={'background.paper'}>
            <Box maxWidth={{xl: 'calc(100vw - 500px)'}} bgcolor={'background.paper'}>

                    <Card sx={{ml: {xs: 0, sm: 2, xl: '260px'}, mr: {xs: 0, sm: 2}, mt: 8, mb: 2, bgcolor: 'background.default', height: 'calc(100vh - 80px)'}}>
                        <DataGrid 
                            rows={rows}
                            rowHeight={110}
                            columns={columns}
                            columnVisibilityModel={{
                                Nach: greaterThanMid,
                                Eingang: greaterThanMid,
                            }}
                            onRowClick={handleRowClick}
                            slots={{
                                toolbar: CustomToolbar,
                            }}
                            slotProps={{
                                toolbar: {
                                    showQuickFilter: true,
                                    quickFilterProps: { debounceMs: 500 },
                                },
                            }}
                            autoPageSize
                        />
                </Card>
                

            </Box>

            {/* Details */}
                <Drawer open={detailsOpen} anchor='right' onClose={() => {setDetailsOpen(false)}} BackdropProps={{ style: {opacity: 0.6} }}>
                    <Box pt={5} pl={2} width={{xs: '85vw', sm: 500}} height={'100vh'}  overflow={'auto'}>
                    {clickedTransport && detailsOpen && <>

                        {/* Schließen */}
                        <Box position={'fixed'} right={20} top={20}>
                            <Link p={1} href="#0" onClick={(e) => {e.preventDefault();setDetailsOpen(false)}}>
                                <IconClose color='#000' width={'2rem'} height={'2rem'} />
                            </Link>
                        </Box>

                        {/* Status */}
                        <Box display={'flex'} justifyContent={'center'} >
                            <State state={clickedTransport.state}/>
                        </Box>


                        {/* Statusverlauf */}
                        <Box mt={3} mb={5} textAlign={'center'}>

                            {clickedTransport.state >= 99 ? (
                                <>
                                {/* Storniert */}
                                </>
                            ) : (
                            <>
                                {/* Nicht Storniert */}
                                <Link href="#0" color={'text.secondary'} onClick={(e) => {e.preventDefault();setStateOpen((prev) => !prev)}}>
                                    {!stateOpen ? (
                                        "Statusverlauf anzeigen"
                                    ) : (
                                        "Statusverlauf ausblenden"
                                    )}
                                </Link>

                                {stateOpen && <>
                                
                                <Typography my={2} fontWeight={clickedTransport.state >= 20 ? 500 : 400 } color={clickedTransport.state >= 20 ? 'text.primary' : 'text.secondary' }>Auftrag angenommen</Typography>
                                <IconArrowDownShort width='1.5rem' height='1.5rem'/>
                                <Typography my={2} fontWeight={clickedTransport.state >= 30 ? 500 : 400 } color={clickedTransport.state >= 30 ? 'text.primary' : 'text.secondary' }>Unterwegs</Typography>
                                <IconArrowDownShort width='1.5rem' height='1.5rem'/>
                                <Typography my={2} fontWeight={clickedTransport.state >= 40 ? 500 : 400 } color={clickedTransport.state >= 40 ? 'text.primary' : 'text.secondary' }>Fahrzeug ist eingetroffen</Typography>
                                <IconArrowDownShort width='1.5rem' height='1.5rem'/>
                                <Typography my={2} fontWeight={clickedTransport.state >= 50 ? 500 : 400 } color={clickedTransport.state >= 50 ? 'text.primary' : 'text.secondary' }>abgeschlossen</Typography>
                                <Box mb={15} />
                                </>}
                            </>)}
                            
                        </Box>
                        </>}


                        {/* Transporttabelle */}
                        {clickedTransport && detailsOpen && 
                        <Box display={{xs:'flex', xl:'block'}} justifyContent={'center'}>
                        <TransportTable
                        compact={true}
                        patient_lastname={clickedTransport.patient_lastname}
                        patient_firstname={clickedTransport.patient_firstname}
                        case_number={clickedTransport.case_number}
                        withReturn={clickedTransport.with_return}
                        arrival_clinic={clickedTransport.arrival_clinic}
                        arrival_station={clickedTransport.arrival_station}
                        destination_name={clickedTransport.destination_name}
                        destination_adress={clickedTransport.destination_adress}
                        destination_station={clickedTransport.destination_station}
                        barrier_free={clickedTransport.barrier_free}
                        timeframe={formatDateBetween(formatDate(clickedTransport.arrival_time_from), formatDate(clickedTransport.arrival_time_to))}
                        treatment_appointment_time={clickedTransport.treatment_appointment_time}
                        patient_mobility={clickedTransport.patient_mobility}
                        medical_care={clickedTransport.medical_care}
                        patient_oxygen={clickedTransport.patient_oxygen}
                        patient_infection={clickedTransport.patient_infection}
                        patient_overweight={clickedTransport.patient_overweight}
                        patient_companion={clickedTransport.patient_companion}
                        note={clickedTransport.note}
                        creation_details={`Erstellt von ${clickedTransport.user.firstname} ${clickedTransport.user.lastname} ${formatDate(clickedTransport.created)}`}
                        station_phone={clickedTransport.station_phone}
                        />
                        </Box>}
                    </Box>
                </Drawer>
        </Box>
    )
}

export default Transports