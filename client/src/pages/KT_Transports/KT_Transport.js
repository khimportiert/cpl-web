import React, { useContext, useEffect, useState } from 'react'
import CaptionContext from '../../context/CaptionProvider'
import { DataGrid, GridToolbar, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Box, Button, Divider, Drawer, Grid, IconButton, Link, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { EmblemAdipositas, EmblemBegleitung, EmblemBetreuung, EmblemGehfähig, EmblemInfektion, EmblemLiegend, EmblemNoAdipositas, EmblemNoBegleitung, EmblemNoBetreuung, EmblemNoInfektion, EmblemNoSauerstoff, EmblemSauerstoff, EmblemSitzend } from '../../components/ui/Emblems';
import State from '../../components/ui/States';
import { useLocation, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import formatDate from '../../utils/formatDate';
import formatTimeAgo from '../../utils/formatTimeAgo';
import TransportTable from '../../components/ui/TransportTable';
import formatWithReturn from '../../utils/formatWithReturn';
import formatDateBetween from '../../utils/formatDateBetween';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconCopy from '../../assets/icons/IconCopy';
import useAuth from '../../hooks/useAuth';
import NotificationCountContext from '../../context/NotificationCountProvider';
import useFacilityInfo from '../../hooks/useFacilityInfo';


const KT_Transport = () => {

    // Überschrift und Titel
    const { setCaption, setHref } = useContext(CaptionContext)
    const { notificationCount } = useContext(NotificationCountContext)
    useEffect(() => {
        setCaption('Aufträge')
        setHref('/kt/transports')
        let title_notification = notificationCount && notificationCount !== 0 ? `(${notificationCount})` : ''
        let title = `${title_notification} Aufträge - Compulance Web`
        document.title = title;
    }, [notificationCount])

    const TRANSPORTS_URL = '/api/transports'
    const NOTIFICATION_URL = '/api/notifications'
    const REFRESH_TIMER = 10000
    const navigate = useNavigate()
    const location = useLocation()
    const axiosPrivate = useAxiosPrivate()
    const { auth } = useAuth()

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
                setAngenommen(response.data.state !== 10)
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

    const [isLoading, setLoading] = useState(false)
    const [angenommen, setAngenommen] = useState(false)
    const [transports, setTransports] = useState([])
    const [clickedTransport, setClickedTransport] = useState()
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [rows, setRows] = useState([])

    // Abholung Cell Render
    const renderTimestamp = (timestamp) => {
        const formattedDate = formatDate(timestamp)
        return (
            <Box>
                {formattedDate}
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

    // Emblem Cell Render
    const renderEmblems = (transport) => {
        return (
        <Box display={'flex'} gap={0.5}>
            {transport?.patient_mobility === 'gehfähig' && <EmblemGehfähig />}
            {transport?.patient_mobility === 'sitzend' && <EmblemSitzend />}
            {transport?.patient_mobility === 'liegend'&& <EmblemLiegend />}
            {transport?.medical_care !== 'nein' ? <EmblemBetreuung /> : <EmblemNoBetreuung />}
            {transport?.patient_oxygen !== 'nein' ? <EmblemSauerstoff /> : <EmblemNoSauerstoff />}
            {transport?.patient_infection !== 'nein' ? <EmblemInfektion /> : <EmblemNoInfektion />}
            {transport?.patient_overweight !== '< 100kg' ?  <EmblemAdipositas /> : <EmblemNoAdipositas />}
            {transport?.patient_companion !== 'ohne' ? <EmblemBegleitung /> : <EmblemNoBegleitung />}
        </Box>)
    }

    // Adress Cell Render
    const renderAdress = (adress) => {
        const street = adress?.street
        const number = adress?.number
        const plz = adress?.plz
        const city = adress?.city
        return (
            <Box>
                <Link color={'text.primary'} target='_blank' href={`http://maps.google.com/?q=${street} ${number} ${plz} ${city}`}>
                    {`${street} ${number} ${plz} ${city}`}
                </Link>
            </Box>
        )
    }

    // Zielort Cell Render
    const renderZielort = ({name, station}) => {
        return (
            <Box>
                <Typography>{name}</Typography>
                <Typography>{station}</Typography>
            </Box>
        )
    }

    // Status Cell Render
    const renderState = (state) => {
        return (
            <State state={state} />)
    }

    // Row Klick Handler
    const handleRowClick = (params) => {
        setClickedTransport(params.row.data)
        setAngenommen(params.row.data.state !== 10)
        setDetailsOpen(true)
    }

    // Annehme Handler
    const setState20 = async () => {
        if(!clickedTransport?._id) {
            console.warning('no record selected')
        }

        try {
            await axiosPrivate.put(`${TRANSPORTS_URL}/${clickedTransport._id}`, {state: 20})
            setAngenommen(true)
            refresh()
            await axiosPrivate.post(NOTIFICATION_URL, {
                user_from: auth.username,
                user_to: clickedTransport?.user.username,
                transport_id: clickedTransport?._id,
                transport_patient_firstname: clickedTransport?.patient_firstname,
                transport_patient_lastname: clickedTransport?.patient_lastname,
                transport_state: 20,
            })
        } catch (err) {
            // TODO: handle error
            console.log(err)
        }
    }

    // Context Menu
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleContextMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleContextMenuClose = () => {
        setAnchorEl(null);
    };

    // API Request
    const refresh = () => {
        let isMounted = true;
        const controller = new AbortController();

        setLoading(true)
        const getTransports = async () => {
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
        refresh() 
        const interval = setInterval(() => {
            refresh()
          }, REFRESH_TIMER);
          return () => clearInterval(interval);
    }, [])

    const columns = [
        { field: 'Abholung_von', headerName: 'Abholung von', description: 'Abholung von', minWidth: 150, flex: 1,
            renderCell: (params) => <>{renderTimestamp(params.value)}</> },

        { field: 'Abholung_bis', headerName: 'Abholung bis', description: 'Abholung bis', minWidth: 150, flex: 1,
            renderCell: (params) => <>{renderTimestamp(params.value)}</> },

        { field: 'Patientenname', headerName: 'Patientenname', description: 'Patientenname', minWidth: 150, flex: 1, },

        { field: 'Von_Einrichtung', headerName: 'Von-Einrichtung', description: 'Name der Einrichtung', minWidth: 200, flex: 2, },

        { field: 'Von_Adresse', headerName: 'Von-Adresse', description: 'Abholadresse', minWidth: 250, flex: 2,
            renderCell: (params) => <>{renderAdress(params.value)}</> },

        { field: 'Von_Station', headerName: 'Von-Station', description: 'Von-Station', minWidth: 150, flex: 1, },

        { field: 'Nach', headerName: 'Nach', description: 'Zielort', minWidth: 200, flex: 2,
            renderCell: (params) => <>{renderZielort(params.value)}</> },

        { field: 'Nach_Adresse', headerName: 'Nach-Adresse', description: 'Nach-Adresse', minWidth: 250, flex: 2,
            renderCell: (params) => <>{renderAdress(params.value)}</> },

        { field: 'Fahrzeit', headerName: 'Fahrzeit', description: 'geschätzte Fahrzeit', minWidth: 150, flex: 1, },

        { field: 'Eigenschaften', headerName: 'Eigenschaften', description: 'Eigenschaften',  minWidth: 250, flex: 2,
            renderCell: (params) => <>{params.value}</> },

        { field: 'Status', headerName: 'Status', description: 'Status', minWidth: 150, flex: 1,
            renderCell: (params) => <>{renderState(params.value)}</> },

        { field: 'Eingang', headerName: 'Eingang', description: 'Auftragseingang', minWidth: 150, flex: 1,
            renderCell: (params) => <>{renderTimeAgo(params.value)}</> },

    ]

    useEffect(() => {
        const r = transports.map((transport) => { 
            return {
                id: transport._id,
                Abholung_von: transport.arrival_time_from,
                Abholung_bis: transport.arrival_time_to,
                Patientenname: `${transport.patient_firstname || ''} ${transport.patient_lastname || ''}`,
                Von_Einrichtung: transport.arrival_clinic,
                Von_Adresse: transport.arrival_adress,
                Von_Station: transport.arrival_station,
                Nach: {'name': transport.destination_name, 'station': transport.destination_station },
                Nach_Adresse: transport.destination_adress,
                Fahrzeit: 'TODO: Fahrzeit',
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
            <GridToolbarColumnsButton style={{ color: '#494949' }} />
            <GridToolbarFilterButton style={{ color: '#494949' }} />
            <GridToolbarDensitySelector style={{ color: '#494949' }} />
            <GridToolbarQuickFilter style={{ marginLeft: 'auto'}} />
          </GridToolbarContainer>
        )
    }

    return (
        <Box>
            {/* Data Table */}
            <Box ml={{xs: '20px', xl: '260px'}} mr={'20px'} mt={'70px'}>
                <Box height={'calc(100vh - 100px)'}>
                    <DataGrid 
                        rows={rows}
                        columns={columns}
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
                        initialState={{
                            columns: {
                                columnVisibilityModel: {
                                    Patientenname: false,
                                    Fahrzeit: false,
                                    Eigenschaften: false,
                                    Von_Adresse: false,
                                    Von_Station: false,
                                    Nach_Station: false
                                },
                            },
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        autoPageSize 
                    />
                </Box>
            </Box>

            {/* Details Drawer */}
            <Box>
                <Drawer open={detailsOpen} anchor='right' onClose={() => {setDetailsOpen(false)}} BackdropProps={{ style: {opacity: 0.6} }}>
                    
                    <Box pt={5} pl={2} width={{xs: '85vw', sm: 500}} height={'100vh'}  overflow={'auto'}>
                        
                        {/* Kopf */}
                        <Box display={{xs:'flex', xl:'block'}} justifyContent={'center'} flexDirection={'column'}>
                            {/* Buttons */}
                            <Box mb={5} display={'flex'} justifyContent={'space-around'}>
                                <Box ml={2} mr={4} width={'100%'}>
                                    <Button variant='contained' disabled={angenommen} onClick={setState20} fullWidth>Annehmen</Button>
                                </Box>
                                <Box mr={4}>
                                    <IconButton variant='outlined' color='grey' onClick={handleContextMenuClick}><MoreVertIcon /></IconButton>
                                    <Menu
                                        sx={{mt: 1}}
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleContextMenuClose}
                                    >
                                        <MenuItem sx={{px: 7,py: 1}} onClick={handleContextMenuClose}>Terminänderung</MenuItem>
                                        <Divider />
                                        <MenuItem sx={{px: 7,py: 1, color: 'error.main'}} onClick={handleContextMenuClose}>Stornieren</MenuItem>
                                    </Menu>
                                </Box>
                            </Box>
                        </Box>

                        {/* Transporttabelle */}
                        <TransportTable
                            compact={true}
                            patient_lastname={clickedTransport?.patient_lastname}
                            patient_firstname={clickedTransport?.patient_firstname}
                            case_number={clickedTransport?.case_number}
                            withReturn={clickedTransport?.with_return}
                            arrival_clinic={clickedTransport?.arrival_clinic}
                            arrival_station={clickedTransport?.arrival_station}
                            destination_name={clickedTransport?.destination_name}
                            destination_adress={clickedTransport?.destination_adress}
                            destination_station={clickedTransport?.destination_station}
                            barrier_free={clickedTransport?.barrier_free}
                            timeframe={formatDateBetween(formatDate(clickedTransport?.arrival_time_from), formatDate(clickedTransport?.arrival_time_to))}
                            treatment_appointment_time={clickedTransport?.treatment_appointment_time}
                            patient_mobility={clickedTransport?.patient_mobility}
                            medical_care={clickedTransport?.medical_care}
                            patient_oxygen={clickedTransport?.patient_oxygen}
                            patient_infection={clickedTransport?.patient_infection}
                            patient_overweight={clickedTransport?.patient_overweight}
                            patient_companion={clickedTransport?.patient_companion}
                            note={clickedTransport?.note}
                            creation_details={`Erstellt von ${clickedTransport?.user?.firstname} ${clickedTransport?.user?.lastname} ${formatDate(clickedTransport?.created)}`}
                            station_phone={clickedTransport?.station_phone}
                        />

                        {/* Copy Button */}
                        <Box mr={3} display={'flex'} flexDirection={'row-reverse'}>
                            <Tooltip title='In die Zwischenablage kopieren'>
                                <IconButton onClick={() => navigator.clipboard.writeText(JSON.stringify(clickedTransport))}>
                                    <IconCopy width='2rem' height='2rem' />
                                </IconButton>
                            </Tooltip>
                            
                        </Box>
                    </Box>
                    
                </Drawer>
            </Box>

        </Box>
        
    )
}

export default KT_Transport