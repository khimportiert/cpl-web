import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PersistLogin from './components/PersistLogin';
import Layout from './components/ui/Layout';
import CreateTransport from './pages/CreateTransport/CreateTransport';
import Login from './pages/Login/Login';
import Logout from './pages/Logout/Logout';
import ShowTransport from './pages/ShowTransport/ShowTransport';
import UpdateTransport from './pages/UpdateTransport/UpdateTransport';
import RequireAuth from './components/RequireAuth';
import Unauthorized from './pages/Unauthorized/Unauthorized';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/de';
import Home from './pages/Home/Home';
import Transports from './pages/Transports/Transports';
import Help from './pages/Help/Help';
import KT_Home from './pages/KT_Home/KT_Home';
import KT_Transport from './pages/KT_Transports/KT_Transport';
import { ROLES } from './config/roles';
import useAuth from './hooks/useAuth';
import StationInfo from './pages/StationInfo/StationInfo';
import Accounts from './pages/Accounts/Accounts';
import useFacilityInfo from './hooks/useFacilityInfo';
import { createThemeOptions } from './config/theme';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import { deDE } from "@mui/x-data-grid";

const roles = ROLES

function App() {

    const { auth } = useAuth()
    const facilityInfo = useFacilityInfo(auth.username)
    const theme = () => createTheme(createThemeOptions(facilityInfo?.facilityGroup?.color), deDE)


    return (
        <ThemeProvider theme={ theme }>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                <Routes>
                    <Route element={<PersistLogin />}>   
                        {/* without standart Layout */}
                        <Route path='/login' element={<Login />}></Route>
                        <Route path='/unauthorized' element={<Unauthorized />}></Route>

                        <Route path='/' element={<Layout />}>
                            {/* public routes */}
                            <Route path='/logout' element={<Logout />}></Route>
                            <Route path='/help' element={<Help />} ></Route>

                            {/* protected routes */}
                            <Route element={ <RequireAuth allowedRoles={[roles.KT, roles.KL, roles.KL_ADMIN]} />}>
                                <Route path='/' element={auth?.roles?.includes(roles.KT) ? <KT_Home /> : <Home />}></Route>
                            </Route>

                            <Route path='/kt' element={ <RequireAuth allowedRoles={[roles.KT]} />}>
                                <Route path='' element={<KT_Home />} ></Route>
                                <Route path='transports' element={<KT_Transport />}></Route>
                            </Route>

                            <Route element={ <RequireAuth allowedRoles={[roles.KL, roles.KL_ADMIN]} />}>
                                <Route path='/' element={<Home />} ></Route>
                                <Route path='/transports' element={<Transports />} ></Route>
                                <Route path='/create-transport' element={<CreateTransport />}></Route>
                                <Route path='/show-transport/:id' element={<ShowTransport />}></Route>
                                <Route path='/edit-transport/:id' element={<UpdateTransport />}></Route>
                            </Route>
                            
                            <Route element={ <RequireAuth allowedRoles={[roles.KL_ADMIN]} />}>
                                <Route path='/station-info' element={<StationInfo />}></Route>
                                <Route path='/accounts' element={<Accounts />}></Route>
                            </Route>

                        </Route>
                    </Route>
                </Routes>
            </LocalizationProvider>
        </ThemeProvider>
        
    );
}

export default App;