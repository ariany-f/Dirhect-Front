import axios from "axios"
import { ArmazenadorToken } from "../utils";

const http = axios.create({
    baseURL: 'https://beta-aqbeneficios.aqbank.com.br/'
})

// Add a request interceptor
http.interceptors.request.use(function (config) {
    // Do something before request is sent 
    const token = ArmazenadorToken.AccessToken
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
}, function (error) {
    // Do something with request error return
    return Promise.reject(error);
});

export default http