import jwtDecode from 'jwt-decode';
import { axiosPrivate } from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const setAuthState = ((res) => {
        const decodedJWT = jwtDecode(res.data.accessToken)
        setAuth(prev => {
            return {
                ...prev,
                id: decodedJWT.UserInfo.id,
                username: decodedJWT.UserInfo.username,
                firstname: decodedJWT.UserInfo.firstname,
                lastname: decodedJWT.UserInfo.lastname,
                login_name: decodedJWT.UserInfo.login_name,
                roles: decodedJWT.UserInfo.roles,
                accessToken: res.data.accessToken,
                allowed_stations: decodedJWT.UserInfo.allowed_stations,
            }
        })
    });

    const refresh = async () => {
        const response = await axiosPrivate.get('/auth/refresh')
        
        setAuthState(response)
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;