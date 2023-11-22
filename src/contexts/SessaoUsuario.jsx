import http from '@http';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArmazenadorToken } from '../utils';

const usuarioInicial = {
    email: '',
    password: '',
    document: '',
    company_public_id: '',
    remember: false,
    companies: [],
    code: []
}

export const SessaoUsuarioContext = createContext({
    usuario: usuarioInicial,
    erros: {},
    setUsuarioEstaLogado: () => null,
    setCompanies: () => null,
    setRemember: () => null,
    setDocument: () => null,
    setSessionCompany: () => null,
    setEmail: () => null,
    setPassword: () => null,
    setCode: () => null,
    submeterCompanySession: () => null,
    solicitarCodigo: () => null,
    submeterLogout: () => null,
    submeterLogin: () => null
})

export const useSessaoUsuarioContext = () => {

    return useContext(SessaoUsuarioContext);
}

export const SessaoUsuarioProvider = ({ children }) => {

    const navegar = useNavigate()

    const [usuario, setUsuario] = useState(usuarioInicial)
    const [usuarioEstaLogado, setUsuarioEstaLogado] = useState(!!ArmazenadorToken.AccessToken)

    const setRemember = (remember) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                remember
            }
        })
    }
    const setDocument = (document) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                document
            }
        })
    }
    const setEmail = (email) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                email
            }
        })
    }
    const setPassword = (password) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                password
            }
        })
    }
    const setCode = (code) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                code
            }
        })
    }
    const setCompanies = (companies) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                companies
            }
        })
    }
    const setSessionCompany = (company_public_id) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                company_public_id
            }
        })
    }

    const solicitarCodigo = () => {

      //  var sendDocument = usuario.document.replace(/[^a-zA-Z0-9 ]/g, '')
        
      //  usuario.document = sendDocument

        return http.post('api/auth/code', usuario)
            .then((response) => {
                return response.data
            })
            .catch(erro => {
                console.error(erro)
            })
    }

    const submeterLogin = () => {

        var sendCode = '';

        usuario.code.map(item => {
            if(typeof item.preenchimento !== undefined)
            {
                sendCode += item.preenchimento
            }
        })

        usuario.code = sendCode

        return http.post('api/auth/token', usuario)
            .then((response) => {
                ArmazenadorToken.definirToken(
                    response.data.token_access,
                    response.data.expires_at
                )
                return response.data
            })
            .catch(erro => {
                console.error(erro)
            })
    }

    const submeterCompanySession = () => {
        http.post(`api/dashboard/session/company/${usuario.company_public_id}`)
            .then(() => {
                navegar('/')
            })
            .catch(erro => {
                console.error(erro)
            })
    }

    const submeterLogout = () => {
        setUsuarioEstaLogado(false)
        ArmazenadorToken.efetuarLogout()
    }


    const contexto = {
        usuario,
        usuarioEstaLogado,
        setUsuarioEstaLogado,
        setRemember,
        setDocument,
        setEmail,
        setPassword,
        setCompanies,
        setCode,
        setSessionCompany,
        submeterLogin,
        submeterLogout,
        submeterCompanySession,
        solicitarCodigo
    }

    return (<SessaoUsuarioContext.Provider value={contexto}>
        {children}
    </SessaoUsuarioContext.Provider>)
}