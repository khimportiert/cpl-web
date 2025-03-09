import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import IconVanShuttle from '../../assets/icons/IconVanShuttle';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import useAuth from '../../hooks/useAuth';
import { AuthDrawer } from './Drawers';
import useFacilityInfo from '../../hooks/useFacilityInfo';

const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const { auth } = useAuth()
  const facilityInfo = useFacilityInfo(auth.username)

  const drawer = <AuthDrawer 
                    roles={auth.roles}
                    login_name={auth.login_name} 
                    firstname={auth.firstname} 
                    lastname={auth.lastname} 
                    username={auth.username} 
                    station_name={facilityInfo?.station?.name}
                />

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Box
        component="nav"
        sx={{ width: { xl: drawerWidth }, flexShrink: { sm: 0 } }}
        >

        <Box position={'fixed'} top={0} left={0} zIndex={1200}>
            <Toolbar>
            <IconButton
                onClick={handleDrawerToggle}
                sx={{ display: { xl: 'none' }, mt: {xs: -1, sm: -2}, color: 'text.primary' }}
            >
                <MenuIcon />
            </IconButton>
            </Toolbar>
        </Box>

        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
            keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
            display: { xs: 'block', xl: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            PaperProps={{
                sx: {
                    backgroundColor: "nav.main",
                    color: "nav.text",
                }
            }}
        >
            {drawer}
        </Drawer>
        <Drawer
            variant="permanent"
            sx={{
            display: { xs: 'none', xl: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            PaperProps={{
                sx: {
                    backgroundColor: "nav.main",
                    color: "nav.text",
                }
            }}
            open
        >
            {drawer}
        </Drawer>
        </Box>
    </Box>
    );
}

export default ResponsiveDrawer;