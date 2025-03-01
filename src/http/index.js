import axios from "axios";
import { ArmazenadorToken } from "@utils";

const http = axios.create({
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

// Interceptor para definir a baseURL dinamicamente antes de cada requisição
http.interceptors.request.use((config) => {
    const companyDomain = sessionStorage.getItem("company_domain") || 'geral.dirhect.net';
    config.baseURL = `https://${companyDomain}/api/`;

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
