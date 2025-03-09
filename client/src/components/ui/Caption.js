import { Box, Link, Typography } from '@mui/material'
import React from 'react'
import AccountChangeButton from '../form/AccountChangeButton'
import useAuth from '../../hooks/useAuth'
import useFacilityInfo from '../../hooks/useFacilityInfo'

const Caption = ( props ) => {
  const { auth } = useAuth()
  const facilityInfo = useFacilityInfo(auth.username)

  return (
    <Box position={'fixed'} zIndex={1100} bgcolor={'background.default'} width={'100vw'} boxShadow={'0px -30px 40px black'} top={0} py={0.5} display={'flex'} >
        <Link href={props.href} underline={'none'} mx={'auto'} ml={{sm: '90px', xl: '270px'}}>
          <Typography display={'flex'} alignItems={'center'} height={35} fontSize={{xs: '1.2rem', sm: '1.5rem'}} color={'text.primary'}>
              {props.children}
          </Typography>
        </Link>
        {facilityInfo?.station && 
        <Box display={{xs: 'none', sm: 'flex'}} alignItems={'end'} mr={15}>
          <Typography fontSize={'1.1rem'} fontWeight={500} mr={2}>
            Aktuelle Station:
          </Typography>
          {<AccountChangeButton station_username={auth.username} station_name={facilityInfo?.station?.name} />}
        </Box>
        }
        

    </Box>
  )
}

export default Caption