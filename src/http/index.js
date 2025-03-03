import axios from "axios";
import { ArmazenadorToken } from "@utils";

const API_BASE_DOMAIN = import.meta.env.VITE_API_BASE_DOMAIN || "dirhect.net"; // Para Vite
const PROTOCOL = import.meta.env.MODE === 'development' ? 'http' : 'https';

const http = axios.create({
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

// Interceptor para definir a baseURL dinamicamente antes de cada requisição
http.interceptors.request.use((config) => {
    const companyDomain = sessionStorage.getItem("company_domain") || 'geral';
    config.baseURL = `${PROTOCOL}://${companyDomain}.${API_BASE_DOMAIN}/api/`;

    const token = ArmazenadorToken.AccessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor para tratar respostas
http.interceptors.response.use(
    (response) => response.data ? response.data : response,
    async function (error) {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
           
            ArmazenadorToken.removerToken();
            return Promise.reject(error.response?.data || error);
        }
        
        return Promise.reject(error.response?.data || error);
    }
);

export default http;
