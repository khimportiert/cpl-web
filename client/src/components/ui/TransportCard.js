import { Box, Card, CardActionArea, CardContent, CircularProgress, Divider, Grid, Tooltip, Typography } from "@mui/material"
import IconClockCircle from "../../assets/icons/IconClock"
import IconLocationDot from "../../assets/icons/IconLocationDot"
import IconPerson from "../../assets/icons/IconPerson"
import { EmblemAdipositas, EmblemBegleitung, EmblemBetreuung, EmblemGehfähig, EmblemInfektion, EmblemLiegend, EmblemSauerstoff, EmblemSitzend } from "./Emblems"
import State from "./States"

const card = (props) => {
    return (<>
        {/* Kachel */}
        <Box>
            <Card style={{'backgroundColor': '#fbfbfb'}} sx={{ mx: 3, my: 1, borderBottom: 2, borderColor: (props.state === 50 ? '#999' : '#05e177'), borderRadius: '0px', boxShadow: 0 }}>
                <CardActionArea onClick={props.onClick}>
                    <CardContent>
                        <Box position={'relative'}>

                            {/* Erstellt */}
                            <Box display={'flex'} justifyContent={'space-between'}>
                                <Tooltip title={`Erstellt am ${props.created}`} placement="bottom-start" enterTouchDelay={300} disableFocusListener arrow>
                                    <Typography color={'text.secondary'}>
                                        {/* {props.created} */}
                                    </Typography>
                                </Tooltip>

                                <Tooltip title={`Erstellt ${props.created}`} placement="bottom-end" enterTouchDelay={300} disableFocusListener arrow>
                                    <Typography color={'text.secondary'}>
                                        {props.createdCalc}
                                    </Typography>
                                </Tooltip>
                            </Box>

                            <Divider />

                            {/* Patientenname & Status*/}
                            <Box display={'flex'} justifyContent={'space-between'}>
                                {/* Patientenname */}
                                <Tooltip title={`${props.patient_firstname} ${props.patient_lastname}`} placement="bottom-start" enterTouchDelay={300} disableFocusListener arrow>
                                    <Box mt={1} display={'flex'} alignItems={'center'} maxWidth={'calc(90% - 150px)'}>
                                        <IconPerson width="1.25rem" height="1.25rem"/>
                                        <Typography fontSize={'1.15rem'} ml={1} noWrap>
                                            {props.patient_firstname} {props.patient_lastname} {props.case_number && (<>&#40;{props.case_number}&#41;</>)}
                                        </Typography>
                                    </Box>
                                </Tooltip>

                                {/* Status */}
                                <State state={props.state} />
                                
                            </Box>
                            

                            {/* Grid Container */}
                            <Grid container mt={2}>

                                {/* Abholung */}
                                <Grid item xs={6} md={4}>
                                    <Grid container>
                                        <Grid item>
                                            <Tooltip title={'Abholung'} placement="bottom-start" enterTouchDelay={300} disableFocusListener arrow>
                                                <Box>
                                                    <IconClockCircle width="1.25rem" height="1.25rem"/>
                                                </Box>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item ml={1}>
                                            <Box>
                                                <Typography variant="h4">
                                                    {props.arrival_date_from}
                                                </Typography>
                                                <Typography>
                                                    {props.arrival_time_from} -
                                                </Typography>
                                                <Typography variant="h4">
                                                    {props.arrival_date_to}
                                                </Typography>
                                                <Typography>
                                                    {props.arrival_time_to}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        
                                    </Grid>
                                    
                                </Grid>

                                {/* Zielort & Station */}
                                <Grid item xs={6} md={4}>
                                    <Grid container>
                                        <Grid item xs={0}>
                                            <Tooltip title={`Zielort: ${props.destination_clinic}`} placement="bottom-start" enterTouchDelay={300} disableFocusListener arrow>
                                                <Box>
                                                    <IconLocationDot width="1.25rem" height="1.25rem"/>
                                                </Box>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item ml={1} xs={9}>
                                            {/* Zielort */}
                                            <Typography variant='h4'>
                                                {props.destination_clinic}
                                            </Typography>

                                            {/* Station */}
                                            {props.destination_station &&
                                            <Box>
                                                <Typography fontSize={"1.00rem"}>
                                                    Station {props.destination_station}
                                                </Typography>
                                            </Box>}
                                        </Grid>
                                    </Grid>
                                </Grid>

                            </Grid>

                            {/* Emblems */}
                            <Box position={{xs:'static', sm:'absolute'}} right={0} bottom={0} display={'flex'} alignItems={'center'} gap={1}>
                                {props.patient_mobility === 'gehfähig' && <EmblemGehfähig />}
                                {props.patient_mobility === 'sitzend' && <EmblemSitzend />}
                                {props.patient_mobility === 'liegend' && <EmblemLiegend />}
                                {props.medical_care !== 'nein' && <EmblemBetreuung />}
                                {props.patient_oxygen !== 'nein' && <EmblemSauerstoff />}
                                {props.patient_infection !== 'nein' && <EmblemInfektion />}
                                {props.patient_overweight !== 'nein' &&  <EmblemAdipositas />}
                                {props.patient_companion !== 'ohne' && <EmblemBegleitung />}
                            </Box>

                        </Box>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Box>
        
    </>)
}

export default card