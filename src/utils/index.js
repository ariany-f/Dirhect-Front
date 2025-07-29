const ACCESS_TOKEN = 'token_access'
const TEMP_TOKEN = 'temp_token'
const TEMP_TOKEN_MFA = 'temp_token_mfa'
const ADMISSAO_TOKEN = 'admissao_token'
const ADMISSAO_SECURITY_TOKEN = 'admissao_security_token'
const EXPIRATION = 'expires_at'
const REFRESH_TOKEN = 'refresh_token'
const PERMISSIONS = 'permissions'
const USER_NAME = 'name'
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
    static definirUsuario(name, email, cpf, public_id, tipo, company_public_id, company_domain, company_symbol, company_logo, mfa_required, profile = '') {
        if (!email) {
            throw new Error('Email é obrigatório')
        }
        try {
            localStorage.setItem(USER_NAME, name || '')
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
        localStorage.removeItem(USER_EMAIL)
        localStorage.removeItem(USER_CPF)
        localStorage.removeItem(USER_PUBLIC_ID)
        localStorage.removeItem(USER_TYPE)
        localStorage.removeItem(USER_PROFILE)
        // Limpar dados de empresa
        this.removerCompany()
        this.limparEmpresas()
        
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
    static get UserName() {
        return localStorage.getItem(USER_NAME)
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
}