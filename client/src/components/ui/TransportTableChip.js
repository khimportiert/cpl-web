import { Chip } from '@mui/material'
import React from 'react'

export const BarrierefreiChip = (props) => {
    const label = props.label
    const color = label === 'nein' ? 'default' : 'success'
    const text = label === 'nein' ? 'nicht barrierefei' : 'Barrierefrei / Fahrstuhl'
    return (
        <Chip {...props} label={text} color={color}/>
    )
}

export const BehandlungsterminChip = (props) => {
    const label = props.label
    const color = label === 'kein Termin' ? 'default' : 'primary'
    return (
        <Chip label={label} color={color}/>
    )
}

export const MobilityChip = (props) => {
    const label = props.label
    const color = label === 'gehfähig' ? 'default' : 'primary'
    return (
        <Chip label={label} color={color}/>
    )
}

export const MedizinischeBetreuungChip = (props) => {
    const label = props.label
    const color = label === 'nein' ? 'default' : 'primary'
    return (
        <Chip label={label} color={color}/>
    )
}

export const SauerstoffChip = (props) => {
    const label = props.label
    const color = label === 'nein' ? 'default' : 'primary'
    return (
        <Chip label={label} color={color}/>
    )
}

export const InfektionChip = (props) => {
    const label = props.label
    const color = label === 'nein' ? 'default' : 'primary'
    return (
        <Chip label={label} color={color}/>
    )
}

export const GewichtChip = (props) => {
    const label = props.label
    const color = label === '< 100kg' ? 'default' : 'primary'
    return (
        <Chip label={label} color={color}/>
    )
}

export const BegleitungChip = (props) => {
    const label = props.label
    const color = label === 'ohne' ? 'default' : 'primary'
    return (
        <Chip label={label} color={color}/>
    )
}
