import axios from "axios";
import { ArmazenadorToken } from "@utils";

const API_BASE_DOMAIN = import.meta.env.VITE_API_BASE_DOMAIN || "dirhect.net"; // Para Vite
const PROTOCOL = import.meta.env.VITE_MODE === 'development' ? 'http' : 'https';

const http = axios.create({
    
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

function tokenExpiraEmMenosDeUmMinuto() {
    const expiration = ArmazenadorToken.ExpirationToken;
    if (!expiration) return true;
    const expiresAt = new Date(expiration).getTime();
    const agora = Date.now();
    return (expiresAt - agora) < 60000;
}

async function tentarRefreshToken() {
    const refreshToken = ArmazenadorToken.RefreshToken;
    if (!refreshToken) return false;
    try {
        const response = await axios.post(
            `${PROTOCOL}://${sessionStorage.getItem("company_domain") || 'geral'}.${API_BASE_DOMAIN}/api/token/refresh/`,
            { refresh: refreshToken },
            { headers: { "Content-Type": "application/json" } }
        );
        // Atualiza o token e a expiração
        const expiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
        ArmazenadorToken.definirToken(
            response.data.access,
            expiration,
            response.data.refresh
        );
        return true;
    } catch (error) {
        // ArmazenadorToken.removerToken();
        return false;
    }
}

// Interceptor para definir a baseURL dinamicamente antes de cada requisição
http.interceptors.request.use(async (config) => {
    const companyDomain = sessionStorage.getItem("company_domain") || 'geral';
    config.baseURL = `${PROTOCOL}://${companyDomain}.${API_BASE_DOMAIN}/api/`;

    // Se faltar menos de 1 min para expirar, tenta refresh
    if (tokenExpiraEmMenosDeUmMinuto()) {
        await tentarRefreshToken();
    }

    const token = ArmazenadorToken.AccessToken;
    const tempToken = ArmazenadorToken.TempToken;
    const admissaoToken = ArmazenadorToken.AdmissaoToken;
    const admissaoSecurityToken = ArmazenadorToken.AdmissaoSecurityToken;
    
    // Se for uma requisição para /token e não tiver access token mas tiver temp token
    if ((config.url === '/mfa/validate/' || config.url === '/mfa/generate/' || config.url === '/token/') && tempToken) {
        config.headers['X-Temp-Token'] = tempToken;
        config.headers.Authorization = `Bearer ${token}`;
    } else if (admissaoToken) {
        // Se tiver admissao token, usa ele para endpoints de admissão
        //config.headers['X-Admissao-Token-Encoded'] = admissaoToken;
        config.headers['X-Admissao-Token-Encoded'] = admissaoSecurityToken;
        if (admissaoSecurityToken) {
            //config.headers['X-Admissao-Security-Token'] = admissaoSecurityToken; - desativado por enquanto (Edilson)
            config.headers['X-Admissao-Security-Token'] = admissaoToken;
        }
        config.headers.Authorization = `Bearer ${token}`;
    } else if (token) {
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

        if (
            error.response?.status === 401 &&
            error.response?.data?.code === "token_not_valid" &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            const refreshOk = await tentarRefreshToken();
            if (refreshOk) {
                originalRequest.headers['Authorization'] = `Bearer ${ArmazenadorToken.AccessToken}`;
                return http(originalRequest);
            } else {
                // ArmazenadorToken.removerToken();
                return Promise.reject(error.response?.data || error);
            }
        }
        
        return Promise.reject(error.response?.data || error);
    }
);

export default http;