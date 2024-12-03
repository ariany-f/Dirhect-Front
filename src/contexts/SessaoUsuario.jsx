import http from '@http';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArmazenadorToken } from '../utils';

const usuarioInicial = {
    name: '',
    email: '',
    password: '',
    cpf: '',
    document: '',
    public_id: '',
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
    setUserPublicId: () => null,
    setCpf: () => null,
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
    retornarCompanySession: () => null,
    dadosUsuario: () => null,
    solicitarCodigo: () => null,
    solicitarCodigoLogin: () => null,
    validarCodigo: () => null,
    submeterLogout: () => null,
    submeterLogin: () => null,
    gerarBearer: () => null,
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
    const setCpf = (cpf) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                cpf
            }
        })
    }
    const setUserPublicId = (public_id) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                public_id
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

    const solicitarCodigoLogin = () => {

        var sendableContent = {
            password: usuario.password,
            cpf: usuario.cpf
        }

        return http.post('api/auth/code-generate', sendableContent)
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro.response.data
            })
    }

    const solicitarCodigo = () => {

        var sendableContent = {
            password: usuario.password,
            cpf: usuario.cpf
        }

        return http.post('api/auth/code', sendableContent)
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro.response.data
            })
    }

    
    const dadosUsuario = () => {

        return http.get('api/auth/me')
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro
            })
    }

    const solicitarCodigoRecuperacaoSenha = () => {

        usuario.cpf = usuario.cpf.replace(/[^a-zA-Z0-9 ]/g, '')
        return http.post('api/auth/forgot-password', usuario)
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

        return http.post('api/auth/reset-password', usuario)
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro
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
    
    const gerarBearer = () => {
        var sendCode = '';
        usuario.code.map(item => {
            if(typeof item.preenchimento !== undefined)
            {
                sendCode += item.preenchimento
            }
        })
        var sendableContent = {
            cpf: usuario.cpf,
            code: sendCode
        }

        return http.post('api/auth/bearer-token', sendableContent)
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro
            })
    }
    
    const validarCodigo = () => {
        var sendCode = '';
        usuario.code.map(item => {
            if(typeof item.preenchimento !== undefined)
            {
                sendCode += item.preenchimento
            }
        })
        var sendableContent = {
            email: usuario.email,
            cpf: usuario.cpf,
            password: usuario.password,
            company_public_id: usuario.company_public_id,
            code: sendCode,
            remember: usuario.remember
        }

        return http.post('api/auth/code-validate', sendableContent)
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro
            })
    }

    const submeterLogin = () => {
       
        var sendableContent = {
            email: usuario.email,
            cpf: usuario.cpf,
            password: usuario.password,
            company_public_id: usuario.company_public_id,
            remember: usuario.remember
        }

        return http.post('api/auth/login', sendableContent)
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro
            })
    }

    const submeterCompanySession = () => {
        
        if(ArmazenadorToken.UserCompanyPublicId)
        {
            var sendableContent = {
                public_id: ArmazenadorToken.UserCompanyPublicId
            }
            
            return http.post(`api/company/set-logged-in`, sendableContent)
                .then((response) => {
                    return response
                })
                .catch(erro => {
                    return erro.response
                })
        }
    }

    

    const retornarCompanySession = () => {
        
        return http.get(`api/company/get-logged-in`)
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro.response
            })
    }

    const submeterLogout = () => {
        return http.post('api/auth/logout')
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro
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
        setCpf,
        setUserPublicId,
        setRecuperacaoToken,
        setRecuperacaoPassword,
        setRecuperacaoConfirmPassword,
        setRecuperacaoPublicId,
        submeterLogin,
        submeterLogout,
        submeterCompanySession,
        retornarCompanySession,
        solicitarCodigo,
        solicitarCodigoLogin,
        validarCodigo,
        gerarBearer,
        dadosUsuario,
        solicitarCodigoRecuperacaoSenha,
        submeterRecuperacaoSenha,
        redefinirSenha
    }

    return (<SessaoUsuarioContext.Provider value={contexto}>
        {children}
    </SessaoUsuarioContext.Provider>)
}