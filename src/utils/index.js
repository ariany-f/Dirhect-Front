const ACCESS_TOKEN = 'token_access'
const EXPIRATION = 'expires_at'

export class ArmazenadorToken {
    static definirToken(accessToken, expiration) {
        sessionStorage.setItem(ACCESS_TOKEN, accessToken)
        sessionStorage.setItem(EXPIRATION, expiration)
    }
    static removerToken() {
        sessionStorage.clear()
    }
    static get AccessToken() {
        return sessionStorage.getItem(ACCESS_TOKEN)
    }
    static get ExpirationToken() {
        return sessionStorage.getItem(EXPIRATION)
    }
}