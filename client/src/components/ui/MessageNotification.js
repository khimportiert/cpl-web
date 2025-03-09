import { Box, Grid, Tooltip, Typography } from '@mui/material'
import IconMessage from '../../assets/icons/IconMessage'
import formatTimeAgo from '../../utils/formatTimeAgo'

export const MessageNotification = (props) => {
    const head = `Neue Nachricht (Transport ${props.patient_firstname} ${props.patient_lastname})`
    return (
        <Grid my={1} container width={props.width}>
            <Grid item xs={1}>
                <IconMessage width={'2rem'} height={'2rem'} />
            </Grid>
            <Grid item xs={11}>
                <Tooltip title={props.message} placement="top" enterTouchDelay={300} disableFocusListener arrow>
                    <Box width={{xs: 'calc(100vw - 80px)', sm: 500-80}}>
                        <Typography noWrap>
                            {head}
                        </Typography>
                        <Typography noWrap>
                            {`"${props.message}"`}
                        </Typography>
                    </Box>
                </Tooltip>
                
                <Typography fontSize={14} sx={{color: '#666666'}}>
                    {formatTimeAgo(props.createdAt)}
                </Typography>
            </Grid>
        </Grid>
    )
}