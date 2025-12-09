import {createContext, useContext, useEffect, useLayoutEffect} from "react";
import api from "scripts/api.js";


const AuthContext = createContext(undefined);



export const AuthProvider = ({children}) => {
    //No default state because we need to check for the token first
    const [token, setToken] = useState();

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const response = await api.get("/api/me")
                setToken(response.data.accessToken)
            }
            catch {
                setToken(null)
            }
        }
        fetchMe()
    }, []);

    async function Login(email, password) {

    }
    async function Register(email, password) {

    }
    async function Logout() {
        setToken(null);
    }
    useLayoutEffect(() => {
        // Inject token into api REST calls
        //use token or existing authorization header
        const authInterceptor = api.interceptors.request.use((config) => {
            config.headers.Authorization = !config._retry && token ? `Bearer ${token}` : config.headers.Authorization;
            return config;
        })
    }, [token])  


    return (
        <AuthContext.Provider value={{token, Login, Register, Logout}}>
            {children}
        </AuthContext.Provider>
    )
}

