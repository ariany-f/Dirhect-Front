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
    async function (error) {
        const originalRequest = error.config;

        // Verifica se o token expirou e se não é uma requisição de refresh
        if (error.response?.status === 401 && 
            error.response?.data?.message === "O bearer token expirou" && 
            !originalRequest._retry) {
            
            originalRequest._retry = true; // Marca a requisição para evitar loop infinito
            
            try {
                const token = ArmazenadorToken.AccessToken;
                const response = await axios.post(
                    'https://apibeneficios.aqbank.com.br/api/auth/refresh',
                    {},
                    {
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                if (response.data?.success) {
                    // Atualiza o token no armazenamento
                    ArmazenadorToken.definirToken(response.data.access_token);
                    // Atualiza o token na requisição original
                    originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
                    // Reexecuta a requisição original
                    return http(originalRequest);
                }
            } catch (refreshError) {
                ArmazenadorToken.removerToken();
                return Promise.reject(refreshError.response?.data || refreshError);
            }
        }

        if(!rotasIgnoradasPelosErros.includes(error.config.url) &&  error.response && error.response.status === 401) {
            // Faz logout e envia usuário de volta pro login
            return ArmazenadorToken.removerToken()
        }

        // Caso seja 429
        if (error.response && error.response.status === 429 && (!originalRequest.url.includes('api/auth/refresh'))) {

             // Faz logout e envia usuário de volta pro login
            ArmazenadorToken.removerToken();
            return Promise.reject(error.response ? error.response.data : error);
        }
        
        return Promise.reject(error.response.data);
    }
);

export default http