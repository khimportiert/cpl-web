import { Box, Divider, Grid, Link, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { BarrierefreiChip, BegleitungChip, BehandlungsterminChip, GewichtChip, InfektionChip, MedizinischeBetreuungChip, MobilityChip, SauerstoffChip } from "./TransportTableChip";

const table = (props) => {
    return (
    <Grid container>
        <Grid item xs={12} md={props.compact ? 12 : 6} pl={2}>

            {/* Hin-/Rückfahrt */}
            <Box mt={3}>
                <Typography variant='h4'>{props.withReturn}</Typography>
            </Box>

            <Box sx={{display: 'grid', gridTemplateColumns: {xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(1, 1fr)'}}} >
                
                {/* Abholort */}
                <Box mt={3}>
                    <Typography mb={1}>Abholort</Typography>
                    <Typography variant="h4">{props.arrival_clinic}</Typography>
                    <Typography variant="h4">{props.arrival_station}</Typography>
                </Box>

                {/* Zielort und Adresse */}
                <Box mt={3}>
                    <Typography mb={1}>Zielort</Typography>
                    <Typography variant="h4">{props.destination_name} <BarrierefreiChip label={props.barrier_free} variant={'outlined'} size={'small'} /></Typography>
                    <Typography variant="h4">{props.destination_station}</Typography>
                    <Typography variant="body1">{props.destination_adress?.street} {props.destination_adress?.number}</Typography>
                    <Typography variant="body1">{props.destination_adress?.plz} {props.destination_adress?.city}</Typography>
                </Box>

                {/* Abholungszeitrum */}
                <Box mt={3}>
                    <Typography mb={1}>Abholungszeitraum</Typography>
                    <Typography variant="h4">{props.timeframe}</Typography>
                </Box>
                
                {/* Patientenname */}
                <Box mt={3}>
                    <Typography mb={1}>Patientenname</Typography>
                    <Typography variant="h4">{props.patient_firstname} {props.patient_lastname} {props.case_number && (`(${props.case_number})`)}</Typography>
                </Box>
            </Box>

            <Box mt={3} display={{xs: 'block', md: props.compact ? 'block' : 'none'}}>
            </Box>
            
        </Grid>

        <Grid item xs={12} md={props.compact ? 12 : 6} mt={{xs: 5, md:0}}>
            {/* Transporttabelle */}
            <TableContainer>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>Behandlungstermin</TableCell>
                            <TableCell>
                                <BehandlungsterminChip label={props.treatment_appointment_time} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Mobilität</TableCell>
                            <TableCell>
                                <MobilityChip label={props.patient_mobility} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Med. Betreuung</TableCell>
                            <TableCell>
                                <MedizinischeBetreuungChip label={props.medical_care} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Sauerstoff</TableCell>
                            <TableCell>
                                <SauerstoffChip label={props.patient_oxygen} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Infektion</TableCell>
                            <TableCell>
                                <InfektionChip label={props.patient_infection} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Gewicht</TableCell>
                            <TableCell>
                                <GewichtChip label={props.patient_overweight} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Begleitung</TableCell>
                            <TableCell>
                                <BegleitungChip label={props.patient_companion} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Anmerkung</TableCell>
                            <TableCell>
                                <Typography>{props.note || '-'}</Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <Typography ml={2} mt={2}>Nummer für Rückfragen: <Link href={`tel:${props.station_phone}`} color="inherit">{props.station_phone}</Link></Typography>
            <Typography ml={2} mt={1}>{props.creation_details}</Typography>
        </Grid>
    </Grid>
    )
}

export default table