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

const recuperacaoSenhaInicial = {
    token: '',
    password: '',
    confirm_password: '',
    publicId: ''
}

export const SessaoUsuarioContext = createContext({
    usuario: usuarioInicial,
    recuperacaoSenha: recuperacaoSenhaInicial,
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
    setRecuperacaoToken:() => null,
    setRecuperacaoPassword:() => null,
    setRecuperacaoConfirmPassword:() => null,
    setRecuperacaoPublicId:() => null,
    submeterCompanySession: () => null,
    solicitarCodigo: () => null,
    submeterLogout: () => null,
    submeterLogin: () => null,
    solicitarCodigoRecuperacaoSenha: () => null,
    submeterRecuperacaoSenha: () => null,
    redefinirSenha: () => null
})

export const useSessaoUsuarioContext = () => {

    return useContext(SessaoUsuarioContext);
}

export const SessaoUsuarioProvider = ({ children }) => {

    const navegar = useNavigate()

    const [usuario, setUsuario] = useState(usuarioInicial)
    const [recuperacaoSenha, setRecuperacaoSenha] = useState(recuperacaoSenhaInicial)
    const [usuarioEstaLogado, setUsuarioEstaLogado] = useState(!!ArmazenadorToken.AccessToken)

    const setRecuperacaoToken = (token) => {
        setRecuperacaoSenha(estadoAnterior => {
            return {
                ...estadoAnterior,
                token
            }
        })
    }
    const setRecuperacaoPublicId = (publicId) => {
        setRecuperacaoSenha(estadoAnterior => {
            return {
                ...estadoAnterior,
                publicId
            }
        })
    }
    const setRecuperacaoPassword = (password) => {
        setRecuperacaoSenha(estadoAnterior => {
            return {
                ...estadoAnterior,
                password
            }
        })
    }
    const setRecuperacaoConfirmPassword = (confirm_password) => {
        setRecuperacaoSenha(estadoAnterior => {
            return {
                ...estadoAnterior,
                confirm_password
            }
        })
    }
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

        var sendableContent = {
            password: usuario.password,
            document: usuario.document.replace(/[^a-zA-Z0-9 ]/g, '')
        }

        return http.post('api/auth/code', sendableContent)
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro.response.data
            })
    }

    const solicitarCodigoRecuperacaoSenha = () => {

        usuario.document = usuario.document.replace(/[^a-zA-Z0-9 ]/g, '')
        return http.post('api/user/forgot', usuario)
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro
            })
    }
    
    const submeterRecuperacaoSenha = () => {

        var sendCode = '';
        
        usuario.code.map(item => {
            if(typeof item.preenchimento !== undefined)
            {
                sendCode += item.preenchimento
            }
        })

        usuario.code = sendCode

        return http.post('api/user/forgot/code/validation', usuario)
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro.response.data
            })
    }

    const redefinirSenha = () => {

        return http.post(`api/user/password/reset/${recuperacaoSenha.publicId}`, recuperacaoSenha)
            .then((response) => {
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
        var sendableContent = {
            email: usuario.email,
            password: usuario.password,
            company_public_id: usuario.company_public_id,
            code: sendCode,
            remember: usuario.remember
        }

        return http.post('api/auth/token', sendableContent)
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro.response.data
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
        recuperacaoSenha,
        setUsuarioEstaLogado,
        setRemember,
        setDocument,
        setEmail,
        setPassword,
        setCompanies,
        setCode,
        setName,
        setSessionCompany,
        setRecuperacaoToken,
        setRecuperacaoPassword,
        setRecuperacaoConfirmPassword,
        setRecuperacaoPublicId,
        submeterLogin,
        submeterLogout,
        submeterCompanySession,
        solicitarCodigo,
        solicitarCodigoRecuperacaoSenha,
        submeterRecuperacaoSenha,
        redefinirSenha
    }

    return (<SessaoUsuarioContext.Provider value={contexto}>
        {children}
    </SessaoUsuarioContext.Provider>)
}