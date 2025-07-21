const ACCESS_TOKEN = 'token_access'
const TEMP_TOKEN = 'temp_token'
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
        sessionStorage.setItem(USER_GROUPS, JSON.stringify(groups))
    }
    static get UserGroups() {
        return JSON.parse(sessionStorage.getItem(USER_GROUPS))
    }
    static definirPermissoes(permissions) {
        sessionStorage.setItem(USER_PERMISSIONS, JSON.stringify(permissions))
    }
    static removerPermissoes() {
        sessionStorage.removeItem(USER_PERMISSIONS)
    }
    static get UserPermissions() {
        return JSON.parse(sessionStorage.getItem(USER_PERMISSIONS))
    }
    static definirProfile(profile) {
        sessionStorage.setItem(USER_PROFILE, profile)
    }
    static get UserProfile() {
        return sessionStorage.getItem(USER_PROFILE)
    }
    static removerProfile() {
        sessionStorage.removeItem(USER_PROFILE)
    }
    static definirTempToken(tempToken) {
        sessionStorage.setItem(TEMP_TOKEN, tempToken)
    }
    static get TempToken() {
        return sessionStorage.getItem(TEMP_TOKEN)
    }
    static removerTempToken() {
        sessionStorage.removeItem(TEMP_TOKEN)
    }
    static definirAdmissaoToken(admissaoToken) {
        sessionStorage.setItem(ADMISSAO_TOKEN, admissaoToken)
    }
    static get AdmissaoToken() {
        return sessionStorage.getItem(ADMISSAO_TOKEN)
    }
    static removerAdmissaoToken() {
        sessionStorage.removeItem(ADMISSAO_TOKEN)
    }
    static definirAdmissaoSecurityToken(securityToken) {
        sessionStorage.setItem(ADMISSAO_SECURITY_TOKEN, securityToken)
    }
    static get AdmissaoSecurityToken() {
        return sessionStorage.getItem(ADMISSAO_SECURITY_TOKEN)
    }
    static removerAdmissaoSecurityToken() {
        sessionStorage.removeItem(ADMISSAO_SECURITY_TOKEN)
    }
    static definirToken(accessToken, expiration = null, refreshToken = null, permissions = null) {
        if (!accessToken) {
            throw new Error('Token de acesso é obrigatório')
        }
        try {
            sessionStorage.setItem(ACCESS_TOKEN, accessToken)
            if(expiration) {
                sessionStorage.setItem(EXPIRATION, expiration)
            }
            if(refreshToken) {
                sessionStorage.setItem(REFRESH_TOKEN, refreshToken)
            }
            if(permissions) {
                sessionStorage.setItem(PERMISSIONS, permissions)
            }
        } catch (error) {
            console.error('Erro ao armazenar token:', error)
            throw new Error('Falha ao armazenar dados de autenticação')
        }
    }
    static definirCompany(company_public_id, company_domain, company_symbol, company_logo) {
        sessionStorage.setItem(COMPANY_PUBLIC_ID, company_public_id)
        sessionStorage.setItem(COMPANY_DOMAIN, company_domain)
        sessionStorage.setItem(COMPANY_SYMBOL, company_symbol)
        sessionStorage.setItem(COMPANY_LOGO, company_logo)
    }
    static definirUsuario(name, email, cpf, public_id, tipo, company_public_id, company_domain, company_symbol, company_logo, mfa_required, profile = 'analista') {
        if (!email) {
            throw new Error('Email é obrigatório')
        }
        try {
            sessionStorage.setItem(USER_NAME, name || '')
            sessionStorage.setItem(USER_EMAIL, email)
            sessionStorage.setItem(USER_TYPE, tipo)
            sessionStorage.setItem(USER_CPF, cpf || '')
            sessionStorage.setItem(USER_PUBLIC_ID, public_id || '')
            sessionStorage.setItem(COMPANY_DOMAIN, company_domain || '')
            sessionStorage.setItem(COMPANY_PUBLIC_ID, company_public_id || '')
            sessionStorage.setItem(COMPANY_SYMBOL, company_symbol || '')
            sessionStorage.setItem(COMPANY_LOGO, company_logo || '')
            sessionStorage.setItem(MFA_REQUIRED, mfa_required || false)
            sessionStorage.setItem(USER_PROFILE, profile || 'analista')
        } catch (error) {
            console.error('Erro ao armazenar dados do usuário:', error)
            throw new Error('Falha ao armazenar dados do usuário')
        }
    }
    static removerCompany() {
        sessionStorage.removeItem(COMPANY_PUBLIC_ID)
        sessionStorage.removeItem(COMPANY_DOMAIN)
        sessionStorage.removeItem(COMPANY_SYMBOL)
        sessionStorage.removeItem(COMPANY_LOGO)
    }

    static limparEmpresas() {
        // Limpar dados de empresas do sessionStorage
        if (typeof window !== 'undefined' && window.sessionStorage) {
            const keysToRemove = [];
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                if (key && (key.includes('company') || key.includes('empresa') || key.includes('tenant') || key.includes('cliente'))) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => sessionStorage.removeItem(key));
        }
    }

    static removerToken() {
        sessionStorage.removeItem(ACCESS_TOKEN)
        sessionStorage.removeItem(MFA_REQUIRED)
        sessionStorage.removeItem(EXPIRATION)
        sessionStorage.removeItem(PERMISSIONS)
        sessionStorage.removeItem(USER_GROUPS)
        sessionStorage.removeItem(USER_PERMISSIONS)
        sessionStorage.removeItem(REFRESH_TOKEN)
        sessionStorage.removeItem(TEMP_TOKEN)
        sessionStorage.removeItem(ADMISSAO_TOKEN)
        sessionStorage.removeItem(ADMISSAO_SECURITY_TOKEN)
        sessionStorage.removeItem(USER_NAME)
        sessionStorage.removeItem(USER_EMAIL)
        sessionStorage.removeItem(USER_CPF)
        sessionStorage.removeItem(USER_PUBLIC_ID)
        sessionStorage.removeItem(USER_TYPE)
        sessionStorage.removeItem(USER_PROFILE)
        // Limpar dados de empresa
        this.removerCompany()
        this.limparEmpresas()
        
        return true;
    }
    static get AccessToken() {
        try {
            return sessionStorage.getItem(ACCESS_TOKEN) || null
        } catch (error) {
            console.error('Erro ao recuperar token:', error)
            return null
        }
    }
    static get ExpirationToken() {
        return sessionStorage.getItem(EXPIRATION)
    }
    static get RefreshToken() {
        return sessionStorage.getItem(REFRESH_TOKEN)
    }
    static get MfaRequired() {
        return sessionStorage.getItem(MFA_REQUIRED)
    }
    static get UserName() {
        return sessionStorage.getItem(USER_NAME)
    }
    static get UserEmail() {
        return sessionStorage.getItem(USER_EMAIL)
    }
    static get UserCpf() {
        return sessionStorage.getItem(USER_CPF)
    }
    static get UserTipo() {
        return sessionStorage.getItem(USER_TYPE)
    }
    static definirTipo(tipo) {
        sessionStorage.setItem(USER_TYPE, tipo)
    }
    static get UserPublicId() {
        return sessionStorage.getItem(USER_PUBLIC_ID)
    }
    static get UserCompanyPublicId() {
        return sessionStorage.getItem(COMPANY_PUBLIC_ID)
    }
    static get UserCompanyDomain() {
        return sessionStorage.getItem(COMPANY_DOMAIN)
    }
    static get UserCompanySymbol() {
        return sessionStorage.getItem(COMPANY_SYMBOL)
    }
    static get UserCompanyLogo() {
        return sessionStorage.getItem(COMPANY_LOGO)
    }
    static hasPermission(codename) {
        try {
            const groupsRaw = sessionStorage.getItem(USER_GROUPS);
            const permissionsRaw = sessionStorage.getItem(USER_PERMISSIONS);
            
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