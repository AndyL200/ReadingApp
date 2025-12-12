import {createContext, useContext, useEffect, useLayoutEffect} from "react";
import api from "@/scripts/api.js";


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
    function validPass(password) {
        if (password.length < 8) {
            return {valid: false, error: "Password must be at least 9 characters"}
        }
        else if (!/[A-Z]/.test(password)) {
            return {valid: false, error: "Password must contain at least one uppercase letter"}
        }
        else if (!/[a-z]/.test(password)) {
            return {valid: false, error: "Password must contain at least one lowercase letter"}
        }
        else if (!/[0-9]/.test(password)) {
            return {valid: false, error: "Password must contain at least one number"}
        }

        return {valid: true, error: null}
    }
    function validUsername(username) {
        if (username.length < 4) {
            return {valid: false, error: "Username must be at least 4 characters"}
        }
        return {valid: true, error: null}
    }
    function validEmail(email) {
        //email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    //TODO() change to email = null and use OR clause in query DONE
    async function Login(password, username = null, email = null) {
        if(!email && !username) {
            console.error("Either email or username is required for login")
            return {LOGIN_SUCCESS: false, ERROR: "Either email or username is required for login"};
        }
        
        else if (!password) {
            console.error("Password required")
            return {LOGIN_SUCCESS: false, ERROR: "Password required"};
        }

        const passwordCheck = validPass(password);
        if(!passwordCheck.valid) {
            return {LOGIN_SUCCESS: false, ERROR: passwordCheck.error}
        }
        if(username) 
        {
            const usernameCheck = validUsername(username)
            if(!usernameCheck.valid) {
                return {LOGIN_SUCCESS: false, ERROR: usernameCheck.error}
            }
        }
        else if (email && !validEmail(email)) {
            console.error("Invalid email")
            return {LOGIN_SUCCESS: false, ERROR: "Invalid email"};
        }
        try {
            const response = await api.post("/api/login", {
                email: email,
                password: password,
                username: username
            })
            if(response.data?.accessToken) {
                setToken(response.data.accessToken)
            }

            return {LOGIN_SUCCESS: response.data.LOGIN_SUCCESS, ERROR: response.data.ERROR};
            
        }
        catch (err) {
            console.error("Login error: ", err)
            return {LOGIN_SUCCESS: false, ERROR: err.message};
        }
    }
    // async function checkForUser(email) {
    //     try {
    //         const response = await api.post("/api/auth_pre_check", {})
    //     }
    //     catch {
    //         return false;
    //     }
    // }
    async function Register(email, password, username = null) {
        if(!email || !password) {
            console.error("Email and password are required for registration")
            return {SIGNUP_SUCCESS: false, ERROR: "Email and password are required"};
        }
        else if (!(email.endsWith("@") && email.endsWith("."))) {
            console.error("Invalid email")
            return {SIGNUP_SUCCESS: false, ERROR: "Invalid email"};
        }
        const passwordCheck = validPass(password);
        if(!passwordCheck.valid) {
            return {LOGIN_SUCCESS: false, ERROR: passwordCheck.error}
        }
        if(username) 
        {
            const usernameCheck = validUsername(username)
            if(!usernameCheck.valid) {
                return {LOGIN_SUCCESS: false, ERROR: usernameCheck.error}
            }
        }
        if (email && !validEmail(email)) {
            console.error("Invalid email")
            return {LOGIN_SUCCESS: false, ERROR: "Invalid email"};
        }
        try {
            const response = await api.post("/api/signup", {
                email: email,
                password: password,
                username: username
            })
            if(response.data?.accessToken) {
                setToken(response.data.accessToken)
            }
            //If email or username exists, the signup success will be false
            return {SIGNUP_SUCCESS: response.data.SIGNUP_SUCCESS, ERROR: response.data.ERROR};
        }
        catch (err) {
            console.error("Registration error: ", err)
            return {SIGNUP_SUCCESS: false, ERROR: err}
        }
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
        <AuthContext.Provider value={{token, Login, Register, Logout, validEmail, validUsername}}>
            {children}
        </AuthContext.Provider>
    )
}


