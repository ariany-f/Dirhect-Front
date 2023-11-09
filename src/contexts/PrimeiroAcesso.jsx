import http from '@http';
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const usuarioInicial = {
    code: '',
    access_code: '',
    email: '',
    password: '',
    password_confirmation: ''
}

export const PrimeiroAcessoContext = createContext({
    usuario: usuarioInicial,
    erros: {},
    setCode: () => null,
    setAccessCode: () => null,
    setEmail: () => null,
    setPassword: () => null,
    setPasswordConfirmation: () => null,
    solicitarCodigo: () => null,
    validarCodigo: () => null,
    validarAcesso: () => null
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

    const validarAcesso = () => {
        
        // http.post('api/auth/access/check/email/code', usuario)
        // .then((response) => {
        //     console.log(response)
        // })
        // .catch(erro => {
        //     console.error(erro)
        // })

        // http.post('api/auth/access/check/', usuario)
        //     .then(() => {
                
        //     })
        //     .catch(erro => {
        //         console.error(erro)
        //     })

    }

    const solicitarCodigo = () => {

        let data = {};
        data.email = usuario.email
        data.access_code = usuario.access_code
        data.password = usuario.password
        data.password_confirmation = usuario.password_confirmation

        http.post('api/auth/access/first/', data)
            .then((response) => {
                console.log(response)
            })
            .catch(erro => {
                console.error(erro)
            })
    }

    const validarCodigo = () => {
        http.post('api/auth/access/first/validate', usuario)
            .then(() => {
                navegar('/login')
            })
            .catch(erro => {
                console.error(erro)
            })
    }


    const contexto = {
        usuario,
        setCode,
        setAccessCode,
        setEmail,
        setPassword,
        setPasswordConfirmation,
        solicitarCodigo,
        validarCodigo,
        validarAcesso
    }

    return (<PrimeiroAcessoContext.Provider value={contexto}>
        {children}
    </PrimeiroAcessoContext.Provider>)
}