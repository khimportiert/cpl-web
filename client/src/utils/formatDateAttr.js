import React from 'react'
import formatDate from './formatDate'

export const formatDateAttr = (timestamp) => {
  const formattedDate = formatDate(timestamp)
  const date = formattedDate.split('um')[0]
  const time = formattedDate.split('um')[1]

  return {date: date, time: time}
}
