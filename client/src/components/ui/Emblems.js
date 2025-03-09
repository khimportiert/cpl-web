import { Box, Tooltip } from "@mui/material"
import IconPersonWalking from "../../assets/icons/IconPersonWalking"
import IconSeatPassenger from "../../assets/icons/IconSeatPassenger"
import IconStretcher from "../../assets/icons/IconStretcher"
import IconMaskVentilator from "../../assets/icons/IconMaskVentilator"
import IconUserDoctor from "../../assets/icons/IconUserDoctor"
import IconVirus from "../../assets/icons/IconVirus"
import IconWeightHanging from "../../assets/icons/IconWeightHanging"
import IconUserGroup from "../../assets/icons/IconUserGroup"

const boxSize = '1.8rem'
const iconSize = '1.2rem'

export const EmblemGehfähig = () => {
    return <>
        {/* Gehfähig */}
        <Tooltip title="Gehfähig" placement="top" enterTouchDelay={300} disableFocusListener arrow>
        <Box display={'flex'} width={boxSize} height={boxSize} bgcolor={'#39A9DB'} alignItems={'center'} justifyContent={'center'} borderRadius={'10px'}>
            <IconPersonWalking width={iconSize} height={iconSize} color="#fff"/>
        </Box>
        </Tooltip>
    </>
}

export const EmblemSitzend = () => {
    return <>
        {/* Sitzend */}
        <Tooltip title="Sitzend" placement="top" enterTouchDelay={300} disableFocusListener arrow>
        <Box display={'flex'} width={boxSize} height={boxSize} bgcolor={'#39A9DB'} alignItems={'center'} justifyContent={'center'} borderRadius={'10px'}>
            <IconSeatPassenger width={iconSize} height={iconSize} color="#fff"/>
        </Box>
        </Tooltip>
    </>
}

export const EmblemLiegend = () => {
    return <>
        {/* Liegend */}
        <Tooltip title="Liegend" placement="top" enterTouchDelay={300} disableFocusListener arrow>
        <Box display={'flex'} width={boxSize} height={boxSize} bgcolor={'#39A9DB'} alignItems={'center'} justifyContent={'center'} borderRadius={'10px'}>
            <IconStretcher width={iconSize} height={iconSize} color="#fff"/>
        </Box>
        </Tooltip>
    </>
}

export const EmblemSauerstoff = (props) => {
    return <>
        {/* Sauerstoff */}
        <Tooltip title={props.title || 'Sauerstoff benötigt'} placement="top" enterTouchDelay={300} disableFocusListener arrow>
        <Box display={'flex'} width={boxSize} height={boxSize} bgcolor={'#3A86FF'} alignItems={'center'} justifyContent={'center'} borderRadius={'10px'}>
            <IconMaskVentilator width={iconSize} height={iconSize} color="#fff"/>
        </Box>
        </Tooltip>
    </>
}

export const EmblemBetreuung = () => {
    return <>
        {/* Med. Betreuung */}
        <Tooltip title="Medizinische Betreuung benötigt" placement="top" enterTouchDelay={300} disableFocusListener arrow>
        <Box display={'flex'} width={boxSize} height={boxSize} bgcolor={'#DB2763'} alignItems={'center'} justifyContent={'center'} borderRadius={'10px'}>
            <IconUserDoctor width={iconSize} height={iconSize} color="#fff"/>
        </Box>
        </Tooltip>
    </>
}

export const EmblemInfektion = () => {
    return <>
        {/* Infektion */}
        <Tooltip title="Infektion" placement="top" enterTouchDelay={300} disableFocusListener arrow>
        <Box display={'flex'} width={boxSize} height={boxSize} bgcolor={'#76B041'} alignItems={'center'} justifyContent={'center'} borderRadius={'10px'}>
            <IconVirus width={iconSize} height={iconSize} color="#fff"/>
        </Box>
        </Tooltip>
    </>
}

export const EmblemAdipositas = () => {
    return <>
        {/* Adipositas */}
        <Tooltip title="Adipositas" placement="top" enterTouchDelay={300} disableFocusListener arrow>
        <Box display={'flex'} width={boxSize} height={boxSize} bgcolor={'#392F5A'} alignItems={'center'} justifyContent={'center'} borderRadius={'10px'}>
            <IconWeightHanging width="1.1rem" height="1.1rem" color="#fff"/>
        </Box>
        </Tooltip>
    </>
}

export const EmblemBegleitung = () => {
    return <>
        {/* Begleitung */}
        <Tooltip title={"ohne Begleitung"} placement="top" enterTouchDelay={300} disableFocusListener arrow>
        <Box display={'flex'} width={boxSize} height={boxSize} bgcolor={'#FF8811'} alignItems={'center'} justifyContent={'center'} borderRadius={'10px'}>
            <IconUserGroup width={iconSize} height={iconSize} color="#fff"/>
        </Box>
        </Tooltip>
    </>
}





export const EmblemNoSauerstoff = () => {
    return <>
        {/* Sauerstoff */}
        <Tooltip title={'kein Sauerstoff benötigt'} placement="top" enterTouchDelay={300} disableFocusListener arrow>
        <Box display={'flex'} width={boxSize} height={boxSize} bgcolor={'grey'} alignItems={'center'} justifyContent={'center'} borderRadius={'10px'}>
            <IconMaskVentilator width={iconSize} height={iconSize} color="#fff"/>
        </Box>
        </Tooltip>
    </>
}

export const EmblemNoBetreuung = () => {
    return <>
        {/* Med. Betreuung */}
        <Tooltip title="keine Medizinische Betreuung benötigt" placement="top" enterTouchDelay={300} disableFocusListener arrow>
        <Box display={'flex'} width={boxSize} height={boxSize} bgcolor={'grey'} alignItems={'center'} justifyContent={'center'} borderRadius={'10px'}>
            <IconUserDoctor width={iconSize} height={iconSize} color="#fff"/>
        </Box>
        </Tooltip>
    </>
}

export const EmblemNoInfektion = () => {
    return <>
        {/* Infektion */}
        <Tooltip title="keine Infektion" placement="top" enterTouchDelay={300} disableFocusListener arrow>
        <Box display={'flex'} width={boxSize} height={boxSize} bgcolor={'grey'} alignItems={'center'} justifyContent={'center'} borderRadius={'10px'}>
            <IconVirus width={iconSize} height={iconSize} color="#fff"/>
        </Box>
        </Tooltip>
    </>
}

export const EmblemNoAdipositas = () => {
    return <>
        {/* Adipositas */}
        <Tooltip title="keine Adipositas" placement="top" enterTouchDelay={300} disableFocusListener arrow>
        <Box display={'flex'} width={boxSize} height={boxSize} bgcolor={'grey'} alignItems={'center'} justifyContent={'center'} borderRadius={'10px'}>
            <IconWeightHanging width="1.1rem" height="1.1rem" color="#fff"/>
        </Box>
        </Tooltip>
    </>
}

export const EmblemNoBegleitung = () => {
    return <>
        {/* Begleitung */}
        <Tooltip title={"ohne Begleitung"} placement="top" enterTouchDelay={300} disableFocusListener arrow>
        <Box display={'flex'} width={boxSize} height={boxSize} bgcolor={'grey'} alignItems={'center'} justifyContent={'center'} borderRadius={'10px'}>
            <IconUserGroup width={iconSize} height={iconSize} color="#fff"/>
        </Box>
        </Tooltip>
    </>
}