const ACCESS_TOKEN = 'token_access'
const EXPIRATION = 'expires_at'
const USER_NAME = 'name'
const USER_EMAIL = 'email'
const USER_DOCUMENT = 'document'
const COMPANY_PUBLIC_ID = 'company_public_id'

export class ArmazenadorToken {
    static definirToken(accessToken, expiration) {
        sessionStorage.setItem(ACCESS_TOKEN, accessToken)
        sessionStorage.setItem(EXPIRATION, expiration)
    }
    static definirCompany(company_public_id) {
        sessionStorage.setItem(COMPANY_PUBLIC_ID, company_public_id)
    }
    static definirUsuario(name, email, document) {
        sessionStorage.setItem(USER_NAME, name)
        sessionStorage.setItem(USER_EMAIL, email)
        sessionStorage.setItem(USER_DOCUMENT, document)
    }
    static removerToken() {
        sessionStorage.clear()
        window.location.href="/login"
    }
    static get AccessToken() {
        return sessionStorage.getItem(ACCESS_TOKEN)
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