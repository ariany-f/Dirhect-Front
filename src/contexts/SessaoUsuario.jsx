import http from '@http';
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArmazenadorToken } from '../utils';

const usuarioInicial = {
    document: '',
    password: '',
    company_public_id: '',
    email: '',
    companies: [],
    remember: false,
    code: []
}

export const SessaoUsuarioContext = createContext({
    usuario: usuarioInicial,
    erros: {},
    setCompanyPublicId: () => null,
    setCompanies: () => null,
    setRemember: () => null,
    setDocument: () => null,
    setEmail: () => null,
    setPassword: () => null,
    setCode: () => null,
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
    const setCompanyPublicId = (company_public_id) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                company_public_id
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

    const solicitarCodigo = () => {

        http.post('api/auth/code', usuario)
            .then((response) => {
                setEmail(response.data.email)
                setCompanies(response.data.companies)
                navegar('/login/selecionar-empresa')
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

        http.post('api/auth/token', usuario)
            .then((response) => {
                ArmazenadorToken.definirToken(
                    response.data.token_access,
                    response.data.expires_at
                )
                setUsuarioEstaLogado(true)
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
        setCompanyPublicId,
        setRemember,
        setDocument,
        setPassword,
        setCompanies,
        setCode,
        submeterLogin,
        submeterLogout,
        solicitarCodigo
    }

    return (<SessaoUsuarioContext.Provider value={contexto}>
        {children}
    </SessaoUsuarioContext.Provider>)
}