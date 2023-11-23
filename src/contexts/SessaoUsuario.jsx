import http from '@http';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArmazenadorToken } from '../utils';

const usuarioInicial = {
    name: '',
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
    setName: () => null,
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
    const setName = (name) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                name
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

        return http.post('api/auth/code', usuario)
            .then((response) => {
                ArmazenadorToken.definirUsuario(
                    'Teste',
                    response.data.email,
                    usuario.document
                )
                return response
            })
            .catch(erro => {
                return erro
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
        if(!ArmazenadorToken.UserCompanyPublicId && usuario.company_public_id)
        {
            ArmazenadorToken.definirCompany(
                usuario.company_public_id
            )
        }
        if(ArmazenadorToken.UserCompanyPublicId)
        {
            http.post(`api/dashboard/session/company/${ArmazenadorToken.UserCompanyPublicId}`)
                .then(() => {
                    navegar('/')
                })
                .catch(erro => {
                    console.error(erro)
                })
        }
    }

    const submeterLogout = () => {
        http.get('api/auth/logout')
            .then((response) => {
                ArmazenadorToken.removerToken()
                setUsuarioEstaLogado(false)
                navegar('/')
            })
            .catch(erro => {
                console.error(erro)
            })
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
        setName,
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