import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import { AppBar, Box, Button, CircularProgress, Container, Divider, Grid, Link, TextField, Typography } from '@mui/material';
import jwtDecode from 'jwt-decode';
import useRefreshToken from '../../hooks/useRefreshToken';
import ImgLogo from '../../assets/img/cpl-logo-text.png'
import ImgBackground from '../../assets/img/login-bg.png'

const LOGIN_URL = '/auth/login';

const Login = () => {

    // set Page Title
    useEffect(() => {
        let title = 'Login - Compulance Web'
        document.title = title;
    }, []);

    const refresh = useRefreshToken()

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const formatInput = (value) => {
        setUser(value.trim())
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true)

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ login_name: user, password: pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            setLoading(false)
            
            await refresh()

            setUser('');
            setPwd('');

            if(from !== '/login') {
                navigate(from)
            } else {
                navigate('/')
            }
            
        } catch (err) {
            setLoading(false)
            if (!err?.response) {
                setErrMsg('Server antwortet nicht. Login fehlgeschlagen.');
            } else if (err.response?.status === 400) {
                setErrMsg('Benutzername oder Passwort fehlt');
            } else if (err.response?.status === 401) {
                setErrMsg('Benutzername oder Passwort nicht korrekt');
            } else if (err.response?.status === 429) {
                setErrMsg('Es wurde in den letzten Minuten zu viele Anmeldeversuche gestartet. Bitte versuchen Sie es in Kürze erneut.');
            } else {
                setErrMsg('Der Login konnte aufgrund technischer Probleme nicht durchgeführt werden.');
            }
        }
    }

    return (
            <Box sx={{ bgcolor: ['background.default', 'background.paper'], 
                backgroundImage: {sm: `url(${ImgBackground})`}, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center center' }} 
                minHeight={'100vh'} paddingTop={10}>

                <Box maxWidth="sm" sx={{ bgcolor: 'rgba(255, 255, 255, 0.6)', mx: 'auto', backdropFilter: 'blur(10px)'}} paddingX={4} pb={5}>
                    
                    <Box width={'100%'} pt={4} display={'flex'} flexDirection={'column'} alignItems={'center'} >
                        <Box component="img" sx={{width: 220}} alt="Logo." src={ImgLogo} />
                    </Box>

                    <Box minHeight={40}>
                        {isLoading ? (
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <CircularProgress color='info'/>
                            </Box>
                        ) : (
                            <Typography variant="p" className={errMsg ? "errmsg" : "offscreen"} color="error.main">{errMsg}</Typography>
                        )}
                    </Box>
                    
                    <form onSubmit={handleSubmit} noValidate>
                        <Grid container direction={'column'} spacing={5}>
                            <Grid item>
                                <TextField id="login_name" autoComplete="off" autoFocus onChange={(e) => setUser(e.target.value)} onBlur={(e) => formatInput(e.target.value)} value={user} required
                                    label="Benutzer" variant="standard" color="text" error={errMsg !== ''} fullWidth />
                            </Grid>
                            <Grid item>
                                <TextField id="password" autoComplete="off" type="password" onChange={(e) => setPwd(e.target.value)} value={pwd} required
                                    label="Passwort" variant="standard" color="text" error={errMsg !== ''} fullWidth />
                            </Grid>
                            <Grid item>
                                <Button type="submit" variant="contained" color='primary' fullWidth>
                                    <Typography>
                                        Login
                                    </Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </form>

                    <Divider sx={{ mt: 13 }}>
                        <Typography variant='h3' color={'text.secondary'}>
                            Hilfe
                        </Typography>
                    </Divider>
                    <Typography variant='p' color={'text.secondary'} lineHeight={3}>
                        Telefonische Auftragsannahme unter&nbsp;
                        <Link href="tel:(030) 4933003" color="inherit">
                            (030) 4933003
                        </Link>
                        <br />
                        Bei Anmeldeproblemen bitte&nbsp;
                        <Link href="mailto:help@lybos.de" color="inherit">
                            help@lybos.de
                        </Link>
                        &nbsp;kontaktieren
                    </Typography>
                    

                </Box>
                
            </Box>
    )
}

export default Login