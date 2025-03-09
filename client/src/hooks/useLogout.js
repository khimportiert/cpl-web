import useAuth from "./useAuth";
import axios from "../api/axios";
const useLogout = () => {
    const { auth, setAuth } = useAuth();

    const logout = async () => {
        try {
            await axios.post('/auth/logout', {}, {
                withCredentials: true
            });
            setAuth({});
        } catch (err) {
            setAuth({});
            console.error(err);
        }
    }

    return logout;
}

export default useLogout