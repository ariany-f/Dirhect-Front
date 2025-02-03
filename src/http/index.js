import axios from "axios"
import { ArmazenadorToken } from "../utils"

const http = axios.create({
    baseURL: 'http://dirhect.win:8000/api/',
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
})

// http.interceptors.request.use(function (config) {
//     const token = ArmazenadorToken.AccessToken
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`
//     }
//     return config;
// }, function (error) {
//     return Promise.reject(error);
// });

const rotasIgnoradasPelosErros = [

]

http.interceptors.response.use(
    (response) => (response.data) ? response.data : response,
    async function (error) {
        const originalRequest = error.config;

        // Verifica se o token expirou e se não é uma requisição de refresh
        if (error.response?.status === 401 &&  
            !originalRequest._retry) {
            
            originalRequest._retry = true; // Marca a requisição para evitar loop infinito
           
            ArmazenadorToken.removerToken();
            return Promise.reject(refreshError.response?.data || refreshError);
        }
        
        return Promise.reject(error.response.data);
    }
);

export default http