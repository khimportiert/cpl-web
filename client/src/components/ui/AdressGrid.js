import { Grid, Typography } from '@mui/material'
import React from 'react'

const AdressGrid = (props) => {
  return (
    <Grid container mt={2} color={'#000'}>
        <Grid item xs={6}>
            <Typography>
                Straße
            </Typography>
            <Typography mt={1}>
                {props.adress?.street}
            </Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography>
                Hausnummer
            </Typography>
            <Typography mt={1}>
                {props.adress?.number}
            </Typography>
        </Grid>
        <Grid item xs={6} mt={4}>
            <Typography>
                Postleitzahl
            </Typography>
            <Typography mt={1}>
                {props.adress?.plz}
            </Typography>
        </Grid>
        <Grid item xs={6} mt={4}>
            <Typography>
                Ort
            </Typography>
            <Typography mt={1}>
                {props.adress?.city}
            </Typography>
        </Grid>
        <Grid item xs={6} mt={4}>
            <Typography>
                Land
            </Typography>
            <Typography mt={1}>
                {props.adress?.country}
            </Typography>
        </Grid>
    </Grid>
  )
}

export default AdressGrid