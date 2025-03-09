import { Box, CircularProgress, Tooltip, Typography } from "@mui/material"
import IconCheck from "../../assets/icons/IconCheck"
import IconTruckDelivery from "../../assets/icons/IconTruckDelivery"
import IconTruckCheck from "../../assets/icons/IconTruckCheck"
import IconCircleXmark from "../../assets/icons/IconCircleXmark"



export const StateAusstehend = () => {
    return <Box>
        <Tooltip title="Warten auf Auftragsannahme" placement="bottom-end" enterTouchDelay={300} disableFocusListener arrow>
            <Box mt={1} display={'flex'} alignItems={'center'} ml={'auto'} >
                <CircularProgress color='info' size={'1.25rem'}/>
                <Typography ml={1}>
                    ausstehend
                </Typography>
            </Box>
        </Tooltip>
    </Box>
}

export const StateAngenommen = () => {
    return <Box>
        <Tooltip title="Auftrag wurde angenommen" placement="bottom-end" enterTouchDelay={300} disableFocusListener arrow>
            <Box mt={1} display={'flex'} alignItems={'center'} ml={'auto'}>
                <IconCheck color={'green'} width={'2rem'} height={'2rem'} />
                <Typography ml={1}>
                    Angenommen
                </Typography>
            </Box>
        </Tooltip>
    </Box>
}

export const StateUnterwegs = () => {
    return <Box>
        <Tooltip title="Fahrzeug ist auf dem Weg" placement="bottom-end" enterTouchDelay={300} disableFocusListener arrow>
            <Box mt={1} display={'flex'} alignItems={'center'} ml={'auto'}>
                <IconTruckDelivery color={'green'} width={'2rem'} height={'2rem'} />
                <Typography ml={1}>
                    Unterwegs
                </Typography>
            </Box>
        </Tooltip>
    </Box>
}

export const StateEingetroffen = () => {
    return <Box>
        <Tooltip title="Fahrzeug ist eingetroffen" placement="bottom-end" enterTouchDelay={300} disableFocusListener arrow>
            <Box mt={1} display={'flex'} alignItems={'center'} ml={'auto'}>
                <IconTruckCheck color={'green'} width={'2rem'} height={'2rem'} />
                <Typography ml={1}>
                    Eingetroffen
                </Typography>
            </Box>
        </Tooltip>
    </Box>
}

export const StateAbgeschlossen = () => {
    return <Box>
        <Tooltip title="Auftrag abgeschlossen" placement="bottom-end" enterTouchDelay={300} disableFocusListener arrow>
            <Box mt={1} display={'flex'} alignItems={'center'} ml={'auto'}>
                <Typography ml={1} color={'text.secondary'}>
                    abgeschlossen
                </Typography>
            </Box>
        </Tooltip>
    </Box>
}

export const StateStorniert = () => {
    return <Box>
        <Tooltip title="Auftrag wurde storniert" placement="bottom-end" enterTouchDelay={300} disableFocusListener arrow>
            <Box mt={1} display={'flex'} alignItems={'center'} ml={'auto'}>
                <IconCircleXmark color={'red'} width={'1.5rem'} height={'1.5rem'} />
                <Typography ml={1}>
                    Storniert
                </Typography>
            </Box>
        </Tooltip>
    </Box>
}

const State = (props) => {
    return <>
        {props.state === 10 && <StateAusstehend />}
        {props.state === 20 && <StateAngenommen />}
        {props.state === 30 && <StateUnterwegs />}
        {props.state === 40 && <StateEingetroffen />}
        {props.state === 50 && <StateAbgeschlossen />}
        {props.state === 99 && <StateStorniert />}
    </>
}

export default State