import React from 'react'

export const getStationFromGroup = (facilityGroup, username) => {
    let result = {}

    facilityGroup.facilities.filter((facility) => {
        facility.stations.filter((station) => {
            if(station.username === username) {
                result = station
            }
        })
    })

    return result
}

export const getFacilityFromGroup = (facilityGroup, username) => {
    let result = {}

    facilityGroup.facilities.filter((facility) => {
        facility.stations.filter((station) => {
            if(station.username === username) {
                result = facility
            }
        })
    })

    return result
}
