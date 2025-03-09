import { Box } from '@mui/material'
import React from 'react'

const BoxContainer = ({children}) => {
  return (
    <Box mx={'auto'} pt={10} px={[2, 2, 20]} height={'100%'} minHeight={'100vh'} maxWidth={[800,1300]}>
        {children}
    </Box>
  )
}

export default BoxContainer