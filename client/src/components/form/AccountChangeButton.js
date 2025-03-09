import React from 'react'
import useAuth from '../../hooks/useAuth'
import useAccountChange from '../../hooks/useAccountChange'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, Typography } from '@mui/material'
import useRefreshToken from '../../hooks/useRefreshToken'

const AccountChangeButton = (props) => {

    const { auth } = useAuth()
    const refresh = useRefreshToken();

    const [open, setOpen] = React.useState(false);

    const setAccount = useAccountChange()
    const handleAccountChange = async (station) => {
        setAccount(station)
        setOpen(false)
    }

    return (
        <div>
            <Link color={'secondary'} href='#0' onClick={(e) => {e.preventDefault();setOpen(true)}}>
                <Typography variant='h3' fontWeight={600}>{props.station_name}</Typography>
            </Link>
            

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>
                {'Station wechseln'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Sie können zwischen Ihnen befugten Stationen wechseln:
                    </DialogContentText>
                    <DialogActions sx={{display: 'flex', flexDirection: 'column'}}>
                        {auth?.allowed_stations?.length > 0 ? auth.allowed_stations.map((station) => {
                            if(station) {
                                return (
                                    <Button key={station.username} onClick={() => handleAccountChange(station)}>
                                        {station.name}
                                    </Button>
                                )
                            }
                        }) : (
                            <Box>
                                Keine befugte Station
                            </Box>
                        )}
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AccountChangeButton