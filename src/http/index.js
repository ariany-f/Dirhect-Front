import axios from "axios";
import { ArmazenadorToken } from "@utils";

const API_BASE_DOMAIN = import.meta.env.VITE_API_BASE_DOMAIN || "dirhect.net"; // Para Vite
const PROTOCOL = import.meta.env.VITE_MODE === 'development' ? 'http' : 'https';

// Contador de erros de conexão para redirecionar após 3 tentativas
let connectionErrorCount = 0;
const MAX_CONNECTION_ERRORS = 3;

const http = axios.create({
    timeout: 30000, // 30 segundos de timeout padrão
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

// Função para resetar o contador de erros de conexão
export const resetConnectionErrorCount = () => {
    connectionErrorCount = 0;
    console.log('Contador de erros de conexão resetado');
};

// Função para obter o status atual do contador de erros
export const getConnectionErrorStatus = () => {
    return {
        current: connectionErrorCount,
        max: MAX_CONNECTION_ERRORS,
        remaining: MAX_CONNECTION_ERRORS - connectionErrorCount
    };
};

// Função para identificar erros de conexão com a API
function isConnectionError(error) {
    const connectionErrorCodes = [
        'ECONNABORTED',           // Timeout do Axios
        'ERR_NAME_NOT_RESOLVED',  // DNS não consegue resolver o nome
        'ERR_NETWORK',            // Erro geral de rede
        'ERR_INTERNET_DISCONNECTED', // Internet desconectada
        'ERR_CONNECTION_REFUSED', // Conexão recusada pelo servidor
        'ERR_CONNECTION_TIMED_OUT', // Timeout de conexão
        'ERR_EMPTY_RESPONSE',     // Resposta vazia do servidor
        'ERR_FR_TOO_MANY_REDIRECTS', // Muitos redirecionamentos
        'ERR_BAD_OPTION_VALUE',   // Valor de opção inválido
        'ERR_BAD_OPTION',         // Opção inválida
        'ECONNRESET',             // Conexão resetada pelo servidor
        'ENOTFOUND',              // Host não encontrado
        'ETIMEDOUT',              // Timeout de conexão
        'ECONNREFUSED'            // Conexão recusada
    ];

    const connectionErrorMessages = [
        'timeout',
        'ERR_NAME_NOT_RESOLVED',
        'ERR_NETWORK',
        'ERR_INTERNET_DISCONNECTED',
        'ERR_CONNECTION_REFUSED',
        'ERR_CONNECTION_TIMED_OUT',
        'ERR_EMPTY_RESPONSE',
        'ERR_FR_TOO_MANY_REDIRECTS',
        'ERR_BAD_OPTION_VALUE',
        'ERR_BAD_OPTION',
        'ECONNRESET',
        'ENOTFOUND',
        'ETIMEDOUT',
        'ECONNREFUSED',
        'Network Error',
        'Connection refused',
        'Connection timeout',
        'DNS resolution failed',
        'No internet connection'
    ];

    // Verificar se o código do erro está na lista
    if (error.code && connectionErrorCodes.includes(error.code)) {
        return true;
    }

    // Verificar se a mensagem do erro contém algum dos termos
    if (error.message) {
        return connectionErrorMessages.some(msg => 
            error.message.toLowerCase().includes(msg.toLowerCase())
        );
    }

    // Verificar se é um erro sem resposta (sem status HTTP)
    if (!error.response && error.request) {
        return true;
    }

    return false;
}

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
    // if (tokenExpiraEmMenosDeUmMinuto()) {
    //     await tentarRefreshToken();
    // }

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
    return Promise.reject(error);
});

// Interceptor para tratar respostas
http.interceptors.response.use(
    (response) => {
        // Reset connection error count on successful response
        connectionErrorCount = 0;
        return response.data ? response.data : response;
    },
    async function (error) {
        const originalRequest = error.config;

        // Verificar se é um erro de conexão com a API
        if (isConnectionError(error)) {
            connectionErrorCount++;
            console.warn(`Erro de conexão com a API (${connectionErrorCount}/${MAX_CONNECTION_ERRORS}): ${error.code || error.message}`);
            
            if (connectionErrorCount >= MAX_CONNECTION_ERRORS) {
                console.error(`Máximo de erros de conexão atingido (${MAX_CONNECTION_ERRORS}). Redirecionando para login.`);
                // ArmazenadorToken.removerToken();
                // window.location.href = '/login';
                return Promise.reject(error);
            }
            
            return Promise.reject(error.response?.data || error);
        }

        // Reset connection error count for non-connection errors
        connectionErrorCount = 0;

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
                ArmazenadorToken.removerToken();
                window.location.href = '/login';
                return Promise.reject(error.response?.data || error);
            }
        }
        
        return Promise.reject(error.response?.data || error);
    }
);

export default http;