import React from 'react'

const formatDateBetween = (formattedDateFrom, formattedDateTo) => {
  const firstWordFrom = formattedDateFrom.split('um')[0]
  const firstWordTo = formattedDateTo.split('um')[0]
  const timeTo = formattedDateTo.split('um')[1]

  if(firstWordFrom === firstWordTo) {
    return (
        <>{formattedDateFrom} bis {timeTo}</>
    )
  } else {
    return (
        <>{formattedDateFrom} bis {formattedDateTo}</>
    )
  }
}

export default formatDateBetween