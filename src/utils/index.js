const ACCESS_TOKEN = 'token_access'
const EXPIRATION = 'expires_at'
const USER_NAME = 'name'
const USER_EMAIL = 'email'
const USER_DOCUMENT = 'document'
const COMPANY_PUBLIC_ID = 'company_public_id'

export class ArmazenadorToken {
    static definirToken(accessToken, expiration) {
        if (!accessToken || !expiration) {
            throw new Error('Token de acesso e expiração são obrigatórios')
        }
        try {
            sessionStorage.setItem(ACCESS_TOKEN, accessToken)
            sessionStorage.setItem(EXPIRATION, expiration)
        } catch (error) {
            console.error('Erro ao armazenar token:', error)
            throw new Error('Falha ao armazenar dados de autenticação')
        }
    }
    static definirCompany(company_public_id) {
        sessionStorage.setItem(COMPANY_PUBLIC_ID, company_public_id)
    }
    static definirUsuario(name, email, document) {
        if (!email) {
            throw new Error('Email é obrigatório')
        }
        try {
            sessionStorage.setItem(USER_NAME, name || '')
            sessionStorage.setItem(USER_EMAIL, email)
            sessionStorage.setItem(USER_DOCUMENT, document || '')
        } catch (error) {
            console.error('Erro ao armazenar dados do usuário:', error)
            throw new Error('Falha ao armazenar dados do usuário')
        }
    }
    static removerToken() {
        return sessionStorage.clear()
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
    
    static get UserName() {
        return sessionStorage.getItem(USER_NAME)
    }
    static get UserEmail() {
        return sessionStorage.getItem(USER_EMAIL)
    }
    static get UserDocument() {
        return sessionStorage.getItem(USER_DOCUMENT)
    }
    static get UserCompanyPublicId() {
        return sessionStorage.getItem(COMPANY_PUBLIC_ID)
    }
}