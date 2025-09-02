const ACCESS_TOKEN = 'token_access'
const TEMP_TOKEN = 'temp_token'
const TEMP_TOKEN_MFA = 'temp_token_mfa'
const ADMISSAO_TOKEN = 'admissao_token'
const ADMISSAO_SECURITY_TOKEN = 'admissao_security_token'
const EXPIRATION = 'expires_at'
const REFRESH_TOKEN = 'refresh_token'
const PERMISSIONS = 'permissions'
const USER_NAME = 'name'
const USER_FIRST_NAME = 'first_name'
const USER_LAST_NAME = 'last_name'
const USER_FOTO_PERFIL = 'foto_perfil'
const USER_EMAIL = 'email'
const USER_CPF = 'cpf'
const COMPANY_DOMAIN = 'company_domain'
const COMPANY_SYMBOL = 'company_symbol'
const COMPANY_LOGO = 'company_logo'
const COMPANY_PUBLIC_ID = 'company_public_id'
const USER_PUBLIC_ID = 'public_id'
const MFA_REQUIRED = 'mfa_required'
const USER_TYPE = 'tipo'
const USER_GROUPS = 'groups'
const USER_PERMISSIONS = 'group_permissions'
const USER_PROFILE = 'profile'
const MENUS_PARAMETERS = 'menus_parameters'
const TENANTS_CACHE = 'tenants_cache'
const COMPANIES_CACHE = 'companies_cache'
const DOMAINS_CACHE = 'domains_cache'
const CACHE_TIMESTAMP = 'cache_timestamp'
const IS_ADMIN = 'is_admin'
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutos em millisegundos

export class ArmazenadorToken {
    static definirGrupos(groups) {
        localStorage.setItem(USER_GROUPS, JSON.stringify(groups))
    }
    static get UserGroups() {
        return JSON.parse(localStorage.getItem(USER_GROUPS))
    }
    static definirPermissoes(permissions) {
        localStorage.setItem(USER_PERMISSIONS, JSON.stringify(permissions))
    }
    static removerPermissoes() {
        localStorage.removeItem(USER_PERMISSIONS)
    }
    static get UserPermissions() {
        return JSON.parse(localStorage.getItem(USER_PERMISSIONS))
    }
    static definirParametrosMenus(parametros) {
        localStorage.setItem(MENUS_PARAMETERS, JSON.stringify(parametros))
    }
    static get ParametrosMenus() {
        try {
            return JSON.parse(localStorage.getItem(MENUS_PARAMETERS)) || {}
        } catch (error) {
            console.error('Erro ao recuperar parâmetros de menus:', error)
            return {}
        }
    }
    static removerParametrosMenus() {
        localStorage.removeItem(MENUS_PARAMETERS)
    }
    static definirProfile(profile) {
        localStorage.setItem(USER_PROFILE, profile)
    }
    static get UserProfile() {
        return localStorage.getItem(USER_PROFILE)
    }
    static removerProfile() {
        localStorage.removeItem(USER_PROFILE)
    }
    static definirTempToken(tempToken) {
        localStorage.setItem(TEMP_TOKEN, tempToken)
    }
    static get TempToken() {
        return localStorage.getItem(TEMP_TOKEN)
    }
    static removerTempToken() {
        localStorage.removeItem(TEMP_TOKEN)
    }
    static definirTempTokenMFA(tempTokenMFA) {
        localStorage.setItem(TEMP_TOKEN_MFA, tempTokenMFA)
    }
    static get TempTokenMFA() {
        return localStorage.getItem(TEMP_TOKEN_MFA)
    }
    static removerTempTokenMFA() {
        localStorage.removeItem(TEMP_TOKEN_MFA)
    }
    static definirAdmissaoToken(admissaoToken) {
        localStorage.setItem(ADMISSAO_TOKEN, admissaoToken)
    }
    static get AdmissaoToken() {
        return localStorage.getItem(ADMISSAO_TOKEN)
    }
    static removerAdmissaoToken() {
        localStorage.removeItem(ADMISSAO_TOKEN)
    }
    static definirAdmissaoSecurityToken(securityToken) {
        localStorage.setItem(ADMISSAO_SECURITY_TOKEN, securityToken)
    }
    static get AdmissaoSecurityToken() {
        return localStorage.getItem(ADMISSAO_SECURITY_TOKEN)
    }
    static removerAdmissaoSecurityToken() {
        localStorage.removeItem(ADMISSAO_SECURITY_TOKEN)
    }
    static definirToken(accessToken, expiration = null, refreshToken = null, permissions = null) {
        if (!accessToken) {
            throw new Error('Token de acesso é obrigatório')
        }
        try {
            localStorage.setItem(ACCESS_TOKEN, accessToken)
            if(expiration) {
                localStorage.setItem(EXPIRATION, expiration)
            }
            if(refreshToken) {
                localStorage.setItem(REFRESH_TOKEN, refreshToken)
            }
            if(permissions) {
                localStorage.setItem(PERMISSIONS, permissions)
            }
        } catch (error) {
            console.error('Erro ao armazenar token:', error)
            throw new Error('Falha ao armazenar dados de autenticação')
        }
    }
    static definirCompany(company_public_id, company_domain, company_symbol, company_logo) {
        localStorage.setItem(COMPANY_PUBLIC_ID, company_public_id)
        localStorage.setItem(COMPANY_DOMAIN, company_domain)
        localStorage.setItem(COMPANY_SYMBOL, company_symbol)
        localStorage.setItem(COMPANY_LOGO, company_logo)
    }
    static definirUsuario(name, email, cpf, public_id, tipo, company_public_id, company_domain, company_symbol, company_logo, mfa_required, profile = '', first_name = '', last_name = '', foto_perfil = '', is_admin = false) {
        if (!email) {
            throw new Error('Email é obrigatório')
        }
        try {
            localStorage.setItem(USER_NAME, name || '')
            localStorage.setItem(USER_FIRST_NAME, first_name || '')
            localStorage.setItem(USER_LAST_NAME, last_name || '')
            localStorage.setItem(USER_FOTO_PERFIL, foto_perfil || '')
            localStorage.setItem(USER_EMAIL, email)
            localStorage.setItem(USER_TYPE, tipo)
            localStorage.setItem(USER_CPF, cpf || '')
            localStorage.setItem(USER_PUBLIC_ID, public_id || '')
            localStorage.setItem(COMPANY_DOMAIN, company_domain || '')
            localStorage.setItem(COMPANY_PUBLIC_ID, company_public_id || '')
            localStorage.setItem(COMPANY_SYMBOL, company_symbol || '')
            localStorage.setItem(COMPANY_LOGO, company_logo || '')
            localStorage.setItem(MFA_REQUIRED, mfa_required || false)
            localStorage.setItem(USER_PROFILE, profile || '')
            localStorage.setItem(IS_ADMIN, is_admin || false)
        } catch (error) {
            console.error('Erro ao armazenar dados do usuário:', error)
            throw new Error('Falha ao armazenar dados do usuário')
        }
    }
    static removerCompany() {
        localStorage.removeItem(COMPANY_PUBLIC_ID)
        localStorage.removeItem(COMPANY_DOMAIN)
        localStorage.removeItem(COMPANY_SYMBOL)
        localStorage.removeItem(COMPANY_LOGO)
        localStorage.removeItem(COMPANIES_CACHE)
        localStorage.removeItem(DOMAINS_CACHE)
        localStorage.removeItem(CACHE_TIMESTAMP)
        localStorage.removeItem(TENANTS_CACHE)
    }

    static limparEmpresas() {
        // Limpar dados de empresas do localStorage
        if (typeof window !== 'undefined' && window.localStorage) {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.includes('company') || key.includes('empresa') || key.includes('tenant') || key.includes('cliente'))) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
        }
    }

    // Funções para gerenciar cache de tenants, companies e domains
    static salvarTenantsCache(tenants) {
        try {
            localStorage.setItem(TENANTS_CACHE, JSON.stringify(tenants));
            localStorage.setItem(CACHE_TIMESTAMP, Date.now().toString());
        } catch (error) {
            console.error('Erro ao salvar cache de tenants:', error);
        }
    }

    static getTenantsCache() {
        try {
            const timestamp = localStorage.getItem(CACHE_TIMESTAMP);
            if (!timestamp) return null;

            const cacheAge = Date.now() - parseInt(timestamp);
            if (cacheAge > CACHE_DURATION) {
                this.limparCache();
                return null;
            }

            const tenants = localStorage.getItem(TENANTS_CACHE);
            return tenants ? JSON.parse(tenants) : null;
        } catch (error) {
            console.error('Erro ao recuperar cache de tenants:', error);
            return null;
        }
    }

    static salvarCompaniesCache(companies) {
        try {
            localStorage.setItem(COMPANIES_CACHE, JSON.stringify(companies));
            localStorage.setItem(CACHE_TIMESTAMP, Date.now().toString());
        } catch (error) {
            console.error('Erro ao salvar cache de companies:', error);
        }
    }

    static getCompaniesCache() {
        try {
            const timestamp = localStorage.getItem(CACHE_TIMESTAMP);
            if (!timestamp) return null;

            const cacheAge = Date.now() - parseInt(timestamp);
            if (cacheAge > CACHE_DURATION) {
                this.limparCache();
                return null;
            }

            const companies = localStorage.getItem(COMPANIES_CACHE);
            return companies ? JSON.parse(companies) : null;
        } catch (error) {
            console.error('Erro ao recuperar cache de companies:', error);
            return null;
        }
    }

    static salvarDomainsCache(domains) {
        try {
            localStorage.setItem(DOMAINS_CACHE, JSON.stringify(domains));
            localStorage.setItem(CACHE_TIMESTAMP, Date.now().toString());
        } catch (error) {
            console.error('Erro ao salvar cache de domains:', error);
        }
    }

    static getDomainsCache() {
        try {
            const timestamp = localStorage.getItem(CACHE_TIMESTAMP);
            if (!timestamp) return null;

            const cacheAge = Date.now() - parseInt(timestamp);
            if (cacheAge > CACHE_DURATION) {
                this.limparCache();
                return null;
            }

            const domains = localStorage.getItem(DOMAINS_CACHE);
            return domains ? JSON.parse(domains) : null;
        } catch (error) {
            console.error('Erro ao recuperar cache de domains:', error);
            return null;
        }
    }

    static limparCache() {
        localStorage.removeItem(TENANTS_CACHE);
        localStorage.removeItem(COMPANIES_CACHE);
        localStorage.removeItem(DOMAINS_CACHE);
        localStorage.removeItem(CACHE_TIMESTAMP);
    }

    static isCacheValido() {
        try {
            const timestamp = localStorage.getItem(CACHE_TIMESTAMP);
            if (!timestamp) return false;

            const cacheAge = Date.now() - parseInt(timestamp);
            return cacheAge <= CACHE_DURATION;
        } catch (error) {
            return false;
        }
    }

    static removerToken() {
        localStorage.removeItem(ACCESS_TOKEN)
        localStorage.removeItem(MFA_REQUIRED)
        localStorage.removeItem(EXPIRATION)
        localStorage.removeItem(PERMISSIONS)
        localStorage.removeItem(USER_GROUPS)
        localStorage.removeItem(USER_PERMISSIONS)
        localStorage.removeItem(REFRESH_TOKEN)
        localStorage.removeItem(TEMP_TOKEN)
        localStorage.removeItem(ADMISSAO_TOKEN)
        localStorage.removeItem(ADMISSAO_SECURITY_TOKEN)
        localStorage.removeItem(USER_NAME)
        localStorage.removeItem(IS_ADMIN)
        localStorage.removeItem(USER_FIRST_NAME)
        localStorage.removeItem(USER_LAST_NAME)
        localStorage.removeItem(USER_FOTO_PERFIL)
        localStorage.removeItem(USER_EMAIL)
        localStorage.removeItem(USER_CPF)
        localStorage.removeItem(USER_PUBLIC_ID)
        localStorage.removeItem(USER_TYPE)
        localStorage.removeItem(USER_PROFILE)
        // Remover parâmetros de menu
        this.removerParametrosMenus()
        // Limpar dados de empresa
        this.removerCompany()
        this.limparEmpresas()
        // Limpar cache
        this.limparCache()
        
        return true;
    }
    static get AccessToken() {
        try {
            return localStorage.getItem(ACCESS_TOKEN) || null
        } catch (error) {
            console.error('Erro ao recuperar token:', error)
            return null
        }
    }
    static get ExpirationToken() {
        return localStorage.getItem(EXPIRATION)
    }
    static get RefreshToken() {
        return localStorage.getItem(REFRESH_TOKEN)
    }
    static get MfaRequired() {
        return localStorage.getItem(MFA_REQUIRED)
    }
    static get IsAdmin() {
        return localStorage.getItem(IS_ADMIN)
    }
    static definirIsAdmin(is_admin) {
        localStorage.setItem(IS_ADMIN, is_admin)
    }
    static removerIsAdmin() {
        localStorage.removeItem(IS_ADMIN)
    }
    static get UserName() {
        return localStorage.getItem(USER_NAME)
    }
    static get UserFirstName() {
        return localStorage.getItem(USER_FIRST_NAME)
    }
    static get UserLastName() {
        return localStorage.getItem(USER_LAST_NAME)
    }
    static get UserFotoPerfil() {
        return localStorage.getItem(USER_FOTO_PERFIL)
    }
    static get UserEmail() {
        return localStorage.getItem(USER_EMAIL)
    }
    static get UserCpf() {
        return localStorage.getItem(USER_CPF)
    }
    static get UserTipo() {
        return localStorage.getItem(USER_TYPE)
    }
    static definirMfaRequired(mfa_required) {
        localStorage.setItem(MFA_REQUIRED, mfa_required)
    }
    static definirTipo(tipo) {
        localStorage.setItem(USER_TYPE, tipo)
    }
    static definirFirstName(first_name) {
        localStorage.setItem(USER_FIRST_NAME, first_name)
    }
    static definirLastName(last_name) {
        localStorage.setItem(USER_LAST_NAME, last_name)
    }
    static definirFotoPerfil(foto_perfil) {
        localStorage.setItem(USER_FOTO_PERFIL, foto_perfil)
    }
    static get UserPublicId() {
        return localStorage.getItem(USER_PUBLIC_ID)
    }
    static get UserCompanyPublicId() {
        return localStorage.getItem(COMPANY_PUBLIC_ID)
    }
    static get UserCompanyDomain() {
        return localStorage.getItem(COMPANY_DOMAIN)
    }
    static get UserCompanySymbol() {
        return localStorage.getItem(COMPANY_SYMBOL)
    }
    static get UserCompanyLogo() {
        return localStorage.getItem(COMPANY_LOGO)
    }
    static hasPermission(codename) {
        try {
            const groupsRaw = localStorage.getItem(USER_GROUPS);
            const permissionsRaw = localStorage.getItem(USER_PERMISSIONS);
            
            if (!permissionsRaw) return false;
            let groups = permissionsRaw;

            if (typeof permissionsRaw === 'string') {
                try {
                    groups = JSON.parse(permissionsRaw);
                } catch {
                    // Se não for JSON, pode ser um objeto já
                }
            }
            // Se for objeto único, transforma em array
            if (!Array.isArray(groups)) {
                groups = [groups];
            }
            
            for (const group of groups) {

                // GAMBIARRA
                if(codename === 'view_pedido') {
                    if(group.name === 'Benefícios') {
                        return true;
                    }
                }
                else if(codename === 'view_folha') {
                    console.log(group)
                    if(group.name === 'RH') {
                        return true;
                    }
                }
                else if(codename === 'view_cadastro') {
                    if(group.name === 'Candidato' || group.name === 'Colaborador') {
                        return true;
                    }
                }
                else {
                    // VÁLIDO SOMENTE O QUE ESTÁ AQUI DENTRO
                    if (group.permissions && Array.isArray(group.permissions)) {
                        if (group.permissions.some(p => p.codename === codename)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    static metadadosDeveSerExibido() {
        try {
            const parametrosMenus = this.ParametrosMenus;
            const userType = localStorage.getItem(USER_TYPE);
            
            if (!userType || !parametrosMenus) return false;

            // Função para normalizar texto (remover acentos e caracteres especiais)
            const normalizarTexto = (texto) => {
                return texto
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
                    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove caracteres especiais
                    .replace(/\s+/g, '_') // Substitui espaços por underscore
                    .toUpperCase();
            };

            const menuNameTranslated = normalizarTexto('Metadados');
            const perfilMenu = `${userType.toUpperCase()}_${menuNameTranslated}`;
            const todosMenu = `TODOS_${menuNameTranslated}`;
            
            // Função para buscar parâmetro de forma case-insensitive
            const buscarParametro = (chave) => {
                // Primeiro tenta a chave exata
                if (parametrosMenus[chave] !== undefined) {
                    return parametrosMenus[chave];
                }
                
                // Depois tenta case-insensitive
                const chaveLower = chave.toLowerCase();
                for (const [key, value] of Object.entries(parametrosMenus)) {
                    if (key.toLowerCase() === chaveLower) {
                        return value;
                    }
                }
                
                return undefined;
            };
            
            // Verifica se existe parâmetro específico para o perfil
            const perfilValue = buscarParametro(perfilMenu);
            if (perfilValue !== undefined) {
                return perfilValue === 'true' || perfilValue === '1';
            }
            
            // Verifica se existe parâmetro para todos os perfis
            const todosValue = buscarParametro(todosMenu);
            if (todosValue !== undefined) {
                return todosValue === 'true' || todosValue === '1';
            }
            
            // Se não há parâmetro específico, não permite (comportamento padrão)
            return false;
        } catch (error) {
            console.error('Erro ao verificar permissão de metadados:', error);
            return false;
        }
    }
}