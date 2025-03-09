import { Toolbar, List, ListItem, ListItemIcon, Divider, ListItemText, ListItemButton, Typography, Box, Link, Badge } from "@mui/material";
import TvIcon from '@mui/icons-material/Tv';
import ReplyIcon from '@mui/icons-material/Reply';
import AddIcon from '@mui/icons-material/Add';
import TaxiAlertOutlinedIcon from '@mui/icons-material/TaxiAlertOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { ROLES } from "../../config/roles";
import AccountChangeButton from "../form/AccountChangeButton";
import ImgLogo from '../../assets/img/cpl-logo-text.png'
import { createThemeOptions } from '../../config/theme'

const decoCircleColor = createThemeOptions().palette.nav.secondary

export const KL_Drawer = (props) => (
    <div>
        {/* Logo */}
        <Box position={'absolute'} width={'100%'} top={10} display={'flex'} flexDirection={'column'} alignItems={'center'} >
            <Box component="img" sx={{width: 200}} alt="Logo." src={ImgLogo} />
        </Box>

        {/* Deko Circle */}
        {/* <Box position={'fixed'} zIndex={-1} width={430} height={430} border={`70px solid ${decoCircleColor}`} borderRadius={'50%'} top={-215} left={-215}/> */}

        <Toolbar />
        <List sx={{ '& .MuiListItemButton-root:hover': { bgcolor: 'nav.hover', } }}>
        <ListItem key={'names'} disablePadding sx={{pl:2, pt: 6}}>
                <ListItemText primary={`${props.firstname} ${props.lastname}`} primaryTypographyProps={{fontSize: '1.5rem'}} />
            </ListItem>
            <ListItem key={'Username'} disablePadding sx={{pl: 2, pb: 2}}>
                <ListItemText primary={
                    <Box display={'flex'}>
                        <Typography mr={2} variant="h3">Station:</Typography>
                        <AccountChangeButton station_username={props.username} station_name={props.station_name} />
                    </Box>
                    
                } />
            </ListItem>
            <Box>
                <Divider sx={{bgcolor: 'nav.text', width: '70%'}} />
            </Box>
            <ListItem key={'Dashboard'} disablePadding sx={{py: 1}}>
                <ListItemButton href='/'>
                <ListItemIcon>
                    <Badge color="primary" variant="dot">
                        <TvIcon sx={{color: 'nav.text'}} />
                    </Badge>
                </ListItemIcon>
                <ListItemText primary={'Dashboard'} primaryTypographyProps={{fontSize: '1.1rem'}} />
                </ListItemButton>
            </ListItem>
            <ListItem key={'Transporte'} disablePadding sx={{py: 1}}>
                <ListItemButton href='/transports'>
                <ListItemIcon>
                    <ReplyIcon sx={{color: 'nav.text'}} />
                </ListItemIcon>
                <ListItemText primary={'Transporte'} primaryTypographyProps={{fontSize: '1.1rem'}} />
                </ListItemButton>
            </ListItem>
            <ListItem key={'Neuer Transport'} disablePadding sx={{py: 1}}>
                <ListItemButton href='/create-transport'>
                <ListItemIcon>
                    <AddIcon sx={{color: 'nav.text'}} />
                </ListItemIcon>
                <ListItemText primary={'Neuer Transport'} primaryTypographyProps={{fontSize: '1.1rem'}} />
                </ListItemButton>
            </ListItem>
            <ListItem key={'Anfahrten'} disablePadding sx={{py: 1}}>
                <ListItemButton href='/#'>
                <ListItemIcon>
                    <TaxiAlertOutlinedIcon sx={{color: 'nav.text'}} />
                </ListItemIcon>
                <ListItemText primary={'Anfahrten'} primaryTypographyProps={{fontSize: '1.1rem'}} />
                </ListItemButton>
            </ListItem>
        </List>
        <Divider sx={{bgcolor: 'nav.text', width: '70%'}} />
        <List sx={{ '& .MuiListItemButton-root:hover': { bgcolor: 'nav.hover' } }}>
            <ListItem key={'Logout'} disablePadding  sx={{py: 1}}>
                <ListItemButton href='/logout'>
                <ListItemIcon>
                    <LogoutIcon sx={{color: 'nav.text'}} />
                </ListItemIcon>
                <ListItemText primary={'Logout'} primaryTypographyProps={{fontSize: '1.1rem'}} />
                </ListItemButton>
            </ListItem>
            <ListItem key={'Hilfe'} disablePadding  sx={{py: 1}}>
                <ListItemButton href='/help'>
                    <ListItemIcon />
                <ListItemText primary={'Hilfe'} primaryTypographyProps={{fontSize: '1.1rem'}} />
                </ListItemButton>
            </ListItem>
        </List>
    </div>
);

export const KL_Admin_Drawer = (props) => (
    <div>
        <Box position={'absolute'} width={'100%'} top={10} display={'flex'} flexDirection={'column'} alignItems={'center'} >
            <Box component="img" sx={{width: 200}} alt="Logo." src={ImgLogo} />
        </Box>

        {/* Deko Circle */}
        {/* <Box position={'fixed'} zIndex={-1} width={430} height={430} border={`70px solid ${decoCircleColor}`} borderRadius={'50%'} top={-215} left={-215}/> */}

        <Toolbar />
        <List sx={{ '& .MuiListItemButton-root:hover': { bgcolor: 'nav.hover' } }}>
            <ListItem key={'login_name'} disablePadding sx={{pl:2, pt: 6}}>
                <ListItemText primary={`${props.login_name}`} primaryTypographyProps={{fontSize: '1.5rem'}} />
            </ListItem>
            <ListItem key={'Username'} disablePadding sx={{pl: 2, pb: 2}}>
                <ListItemText primary={
                    <Box display={'flex'}>
                        <Typography mr={2} variant="h3">Station:</Typography>
                        <AccountChangeButton station_username={props.username} station_name={props.station_name} />
                    </Box>
                } />
            </ListItem>
            <Divider sx={{bgcolor: 'nav.text', width: '70%'}} />
            <ListItem key={'Dashboard'} disablePadding sx={{py: 1}}>
                <ListItemButton href='/' >
                <ListItemIcon>
                    <TvIcon sx={{color: 'nav.text'}} />
                </ListItemIcon>
                <ListItemText primary={'Dashboard'} primaryTypographyProps={{fontSize: '1.1rem'}} />
                </ListItemButton>
            </ListItem>
            <ListItem key={'Transporte'} disablePadding sx={{py: 1}}>
                <ListItemButton href='/transports'>
                <ListItemIcon>
                    <ReplyIcon sx={{color: 'nav.text'}} />
                </ListItemIcon>
                <ListItemText primary={'Transporte'} primaryTypographyProps={{fontSize: '1.1rem'}} />
                </ListItemButton>
            </ListItem>
            <ListItem key={'Neuer Transport'} disablePadding sx={{py: 1}}>
                <ListItemButton href='/create-transport'>
                <ListItemIcon>
                    <AddIcon sx={{color: 'nav.text'}} />
                </ListItemIcon>
                <ListItemText primary={'Neuer Transport'} primaryTypographyProps={{fontSize: '1.1rem'}} />
                </ListItemButton>
            </ListItem>
            <ListItem key={'Anfahrten'} disablePadding sx={{py: 1}}>
                <ListItemButton href='/#'>
                <ListItemIcon>
                    <TaxiAlertOutlinedIcon sx={{color: 'nav.text'}} />
                </ListItemIcon>
                <ListItemText primary={'Anfahrten'} primaryTypographyProps={{fontSize: '1.1rem'}} />
                </ListItemButton>
            </ListItem>
        </List>
        <Divider sx={{bgcolor: 'nav.text', width: '70%'}} />
        <List sx={{ '& .MuiListItemButton-root:hover': { bgcolor: 'nav.hover' } }}>
            <ListItem key={'Stationsinfo'} disablePadding  sx={{py: 1}}>
                <ListItemButton href='/station-info'>
                <ListItemIcon>
                    <InfoOutlinedIcon sx={{color: 'nav.text'}} />
                </ListItemIcon>
                <ListItemText primary={'Stationsinfo'} primaryTypographyProps={{fontSize: '1.1rem'}} />
                </ListItemButton>
            </ListItem>
            <ListItem key={'Benutzer'} disablePadding  sx={{py: 1}}>
                <ListItemButton href='/accounts'>
                <ListItemIcon>
                    <GroupOutlinedIcon sx={{color: 'nav.text'}} />
                </ListItemIcon> 
                <ListItemText primary={'Benutzer'} primaryTypographyProps={{fontSize: '1.1rem'}} />
                </ListItemButton>
            </ListItem>
        </List>
        <Divider sx={{bgcolor: 'nav.text', width: '70%'}} />
        <List sx={{ '& .MuiListItemButton-root:hover': { bgcolor: 'nav.hover' } }}>
            <ListItem key={'Logout'} disablePadding  sx={{py: 1}}>
                <ListItemButton href='/logout'>
                <ListItemIcon>
                    <LogoutIcon sx={{color: 'nav.text'}} />
                </ListItemIcon>
                <ListItemText primary={'Logout'} primaryTypographyProps={{fontSize: '1.1rem'}} />
                </ListItemButton>
            </ListItem>
            <ListItem key={'Hilfe'} disablePadding  sx={{py: 1}}>
                <ListItemButton href='/help'>
                    <ListItemIcon />
                <ListItemText primary={'Hilfe'} primaryTypographyProps={{fontSize: '1.1rem'}} />
                </ListItemButton>
            </ListItem>
        </List>
    </div>
);

export const KT_Drawer = (props) => (
    <div>
        <Box position={'absolute'} width={'100%'} top={10} display={'flex'} flexDirection={'column'} alignItems={'center'} >
            <Box component="img" sx={{width: 200}} alt="Logo." src={ImgLogo} />
        </Box>
        
        {/* Deko Circle */}
        {/* <Box position={'fixed'} zIndex={-1} width={430} height={430} border={`70px solid ${decoCircleColor}`} borderRadius={'50%'} top={-215} left={-215}/> */}

        <Toolbar />
        <List sx={{ '& .MuiListItemButton-root:hover': { bgcolor: 'nav.hover' } }}>
            <ListItem key={'login_name'} disablePadding sx={{py: 1}}>
                <ListItemIcon />
                <ListItemText primary={props.login_name} primaryTypographyProps={{fontSize: '1.1rem'}} />
            </ListItem>
            <Divider sx={{bgcolor: 'nav.text', width: '70%'}} />
            <ListItem key={'Dashboard'} disablePadding sx={{py: 1}}>
                <ListItemButton href='/'>
                <ListItemIcon>
                    <TvIcon sx={{color: 'nav.text'}} />
                </ListItemIcon>
                <ListItemText primary={'Dashboard'} primaryTypographyProps={{fontSize: '1.1rem'}} />
                </ListItemButton>
            </ListItem>
            <ListItem key={'Aufträge'} disablePadding sx={{py: 1}}>
                <ListItemButton href='/kt/transports'>
                <ListItemIcon>
                    <ReplyIcon sx={{color: 'nav.text'}} />
                </ListItemIcon>
                <ListItemText primary={'Aufträge'} primaryTypographyProps={{fontSize: '1.1rem'}} />
                </ListItemButton>
            </ListItem>
        </List>
        <Divider sx={{bgcolor: 'nav.text', width: '70%'}} />
        <List sx={{ '& .MuiListItemButton-root:hover': { bgcolor: 'nav.hover' } }}>
            <ListItem key={'Logout'} disablePadding  sx={{py: 1}}>
                <ListItemButton href='/logout'>
                <ListItemIcon>
                    <LogoutIcon sx={{color: 'nav.text'}} />
                </ListItemIcon>
                <ListItemText primary={'Logout'} primaryTypographyProps={{fontSize: '1.1rem'}} />
                </ListItemButton>
            </ListItem>
            <ListItem key={'Hilfe'} disablePadding  sx={{py: 1}}>
                <ListItemButton href='/help'>
                    <ListItemIcon />
                <ListItemText primary={'Hilfe'} primaryTypographyProps={{fontSize: '1.1rem'}} />
                </ListItemButton>
            </ListItem>
        </List>
    </div>
);

export const AuthDrawer = (props) => {
    if(props?.roles?.includes(ROLES.KT)) 
        return <KT_Drawer login_name={props.login_name} />
    if(props?.roles?.includes(ROLES.KL))
        return <KL_Drawer firstname={props.firstname} lastname={props.lastname} username={props.username} station_name={props.station_name} />
    if(props?.roles?.includes(ROLES.KL_ADMIN))
        return <KL_Admin_Drawer login_name={props.login_name} username={props.username} station_name={props.station_name} />
}
