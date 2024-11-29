import axios from "axios"
import { ArmazenadorToken } from "../utils"

const http = axios.create({
    baseURL: 'https://apibeneficios.aqbank.com.br/',
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
})

http.interceptors.request.use(function (config) {
    const token = ArmazenadorToken.AccessToken
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

const rotasIgnoradasPelosErros = [
    'api/auth/already-accessed',
    'api/auth/first-access',
    'api/auth/login',
    'api/auth/code',
    'api/auth/logout'
]

http.interceptors.response.use(
    (response) => (response.data) ? response.data : response,
    function (error) {
        if(!rotasIgnoradasPelosErros.includes(error.config.url) 
        &&  error.response && error.response.status === 401) {
            // Faz logout e envia usuário de volta pro login
            return ArmazenadorToken.removerToken()
        }
        return Promise.reject(error.response.data);
    }
);

export default http