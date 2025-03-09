import { Box, Grid, Tooltip, Typography } from "@mui/material"
import IconCheck from "../../assets/icons/IconCheck"
import formatTimeAgo from "../../utils/formatTimeAgo"

const StateNotificationAngenommen = (props) => {
    const message = `Transport für "${props.patient_firstname} ${props.patient_lastname}" wurde angenommen`
    return (
    <Grid my={1} container width={props.width}>
        <Grid item xs={1}>
            <IconCheck color={'green'} width={'2rem'} height={'2rem'} />
        </Grid>
        <Grid item xs={11}>
            <Tooltip title={message} placement="top" enterTouchDelay={300} disableFocusListener arrow>
                <Box width={{xs: 'calc(100vw - 80px)', sm: 500-80}}>
                    <Typography noWrap>
                        {message}
                    </Typography>
                </Box>
            </Tooltip>
            
            <Typography fontSize={14} sx={{color: '#666666'}}>
                {formatTimeAgo(props.createdAt)}
            </Typography>
        </Grid>
    </Grid>)
}

const StateNotification = (props) => {
    return <>
        {props.state === 20 && <StateNotificationAngenommen {...props} />}
    </>
}

export default StateNotification