import axios from "axios";
import { ArmazenadorToken } from "@utils";

const API_BASE_DOMAIN = import.meta.env.VITE_API_BASE_DOMAIN || "dirhect.net"; // Para Vite
const PROTOCOL = import.meta.env.VITE_MODE === 'development' ? 'http' : 'https';

// Contador de timeouts para redirecionar após 3 tentativas
let timeoutCount = 0;
const MAX_TIMEOUTS = 3;

const http = axios.create({
    timeout: 30000, // 30 segundos de timeout padrão
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

// Função para resetar o contador de timeouts
export const resetTimeoutCount = () => {
    timeoutCount = 0;
    console.log('Contador de timeouts resetado');
};

// Função para obter o status atual do contador de timeouts
export const getTimeoutStatus = () => {
    return {
        current: timeoutCount,
        max: MAX_TIMEOUTS,
        remaining: MAX_TIMEOUTS - timeoutCount
    };
};

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
            `${PROTOCOL}://${sessionStorage.getItem("company_domain") || 'dirhect'}.${API_BASE_DOMAIN}/api/token/refresh/`,
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
        ArmazenadorToken.removerToken();
        window.location.href = '/login';
        return false;
    }
}

// Interceptor para definir a baseURL dinamicamente antes de cada requisição
http.interceptors.request.use(async (config) => {
    const companyDomain = sessionStorage.getItem("company_domain") || 'dirhect';
    config.baseURL = `${PROTOCOL}://${companyDomain}.${API_BASE_DOMAIN}/api/`;

    // Se faltar menos de 1 min para expirar, tenta refresh
    if (tokenExpiraEmMenosDeUmMinuto()) {
        await tentarRefreshToken();
    }

    // Configurar Content-Type baseado no tipo de dados
    if (config.data instanceof FormData) {
        // Para FormData, não definir Content-Type - deixar o browser definir automaticamente
        // Isso é necessário para que o boundary seja definido corretamente
        delete config.headers['Content-Type'];
    } else {
        // Para JSON, manter o Content-Type padrão
        config.headers['Content-Type'] = 'application/json';
    }

    const token = ArmazenadorToken.AccessToken;
    const tempToken = ArmazenadorToken.TempToken;
    const admissaoToken = ArmazenadorToken.AdmissaoToken;
    const admissaoSecurityToken = ArmazenadorToken.AdmissaoSecurityToken;
    
    // Se for uma requisição para /token e não tiver access token mas tiver temp token
    if ((config.url === '/mfa/validate/' || config.url === '/mfa/generate/' || config.url === '/token/') && tempToken) {
        config.headers['X-Temp-Token'] = tempToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } else if (admissaoToken) {
        // Se tiver admissao token, usa ele para endpoints de admissão
        config.headers['X-Admissao-Token-Encoded'] = admissaoToken;
        //config.headers['X-Admissao-Token-Encoded'] = admissaoSecurityToken;
        if (admissaoSecurityToken) {
            config.headers['X-Admissao-Security-Token'] = admissaoSecurityToken;
            //config.headers['X-Admissao-Security-Token'] = admissaoToken;
        }
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } else if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    ArmazenadorToken.removerToken();
    window.location.href = '/login';
    return Promise.reject(error);
});

// Interceptor para tratar respostas
http.interceptors.response.use(
    (response) => {
        // Reset timeout count on successful response
        timeoutCount = 0;
        return response.data ? response.data : response;
    },
    async function (error) {
        const originalRequest = error.config;

        // Verificar se é um erro de conexão (timeout, DNS, rede, etc.)
        if (error.code === 'ECONNABORTED' || 
            error.message?.includes('timeout') || 
            error.code === 'ERR_NAME_NOT_RESOLVED' ||
            error.message?.includes('ERR_NAME_NOT_RESOLVED') ||
            error.code === 'ERR_NETWORK' ||
            error.message?.includes('ERR_NETWORK') ||
            error.code === 'ERR_INTERNET_DISCONNECTED' ||
            error.message?.includes('ERR_INTERNET_DISCONNECTED') ||
            error.code === 'ERR_CONNECTION_REFUSED' ||
            error.message?.includes('ERR_CONNECTION_REFUSED') ||
            error.code === 'ERR_CONNECTION_TIMED_OUT' ||
            error.message?.includes('ERR_CONNECTION_TIMED_OUT')) {
            timeoutCount++;
            console.warn(`Erro de conexão (${timeoutCount}/${MAX_TIMEOUTS}): ${error.code || error.message}`);
            
            if (timeoutCount >= MAX_TIMEOUTS) {
                console.error(`Máximo de erros de conexão atingido (${MAX_TIMEOUTS}). Redirecionando para login.`);
                ArmazenadorToken.removerToken();
                window.location.href = '/login';
                return Promise.reject(error);
            }
            
            return Promise.reject(error.response?.data || error);
        }

        // Reset timeout count for non-timeout errors
        timeoutCount = 0;

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