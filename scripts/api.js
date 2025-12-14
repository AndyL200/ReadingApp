import axios from "axios";

export const api = axios.create({
    baseURL: "http://10.0.0.7:5000",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});
