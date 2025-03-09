import React from 'react'

const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    let hours = date.getHours()
    if(hours<10)
        hours = `0${hours}`
    let minutes = date.getMinutes()
    if(minutes<10)
        minutes = `0${minutes}`

    return (
        `${hours}:${minutes}`
    )
}

export default formatTime