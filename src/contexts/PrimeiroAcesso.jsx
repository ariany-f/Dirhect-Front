import http from '@http';
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArmazenadorToken } from '../utils';

const usuarioInicial = {
    code: '',
    access_code: '',
    document: '',
    email: '',
    password: '',
    password_confirmation: ''
}

export const PrimeiroAcessoContext = createContext({
    usuario: usuarioInicial,
    erros: {},
    setCode: () => null,
    setDocument: () => null,
    setAccessCode: () => null,
    setEmail: () => null,
    setPassword: () => null,
    setPasswordConfirmation: () => null,
    solicitarCodigo: () => null,
    solicitarCodigoLogin: () => null,
    solicitarNovoCodigo: () => null,
    gerarBearer: () => null,
    validarCodigo: () => null
})

export const usePrimeiroAcessoContext = () => {
    return useContext(PrimeiroAcessoContext);
}

export const PrimeiroAcessoProvider = ({ children }) => {

    const navegar = useNavigate()

    const [usuario, setUsuario] = useState(usuarioInicial)

    const setCode = (code) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                code
            }
        })
    }
    const setAccessCode = (access_code) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                access_code
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
    const setDocument = (document) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                document
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
    const setPasswordConfirmation = (password_confirmation) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                password_confirmation
            }
        })
    }
    
    const solicitarNovoCodigo = () => {

        let data = {};
        data.email = usuario.email
        data.document = usuario.document.replace(/[^a-zA-Z0-9 ]/g, '')
        data.cpf = usuario.document
        data.password = usuario.password

       return  http.post('api/auth/code', data)
            .then((response) => {
                return response
            })
            .catch((erro) => {
                console.log(erro)
                return erro
            })
    }

    const solicitarCodigoLogin = () => {

        var sendableContent = {
            email: usuario.email,
            password: usuario.password,
            document: usuario.document.replace(/[^a-zA-Z0-9 ]/g, ''),
            cpf: usuario.document
        }

        return http.post('api/auth/collaborator/first-access-code', sendableContent)
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro.response.data
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
            cpf: usuario.document,
            code: sendCode
        }

        return http.post('api/auth/bearer-token', sendableContent)
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro.response.data
            })
    }
    
    const solicitarCodigo = () => {

        let data = {};
        data.email = usuario.email
        data.cpf = usuario.document
        data.document = usuario.document
        data.code = usuario.code
        data.password = usuario.password
        data.password_confirmation = usuario.password_confirmation

       return  http.post('api/auth/first-access', data)
            .then((response) => {
                return response
            })
            .catch((erro) => {
                console.log(erro)
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
            cpf: usuario.document,
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
                return erro.response.data
            })
    }


    const contexto = {
        usuario,
        setCode,
        setAccessCode,
        setEmail,
        setDocument,
        setPassword,
        setPasswordConfirmation,
        solicitarCodigo,
        solicitarCodigoLogin,
        solicitarNovoCodigo,
        gerarBearer,
        validarCodigo
    }

    return (<PrimeiroAcessoContext.Provider value={contexto}>
        {children}
    </PrimeiroAcessoContext.Provider>)
}