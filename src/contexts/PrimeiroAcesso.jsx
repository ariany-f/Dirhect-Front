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
        data.document = usuario.document
        data.code = usuario.code
        data.password = usuario.password
        data.password_confirmation = usuario.password_confirmation

        http.post('api/auth/first-access', data)
            .then((response) => {
                console.log(response)
                // if(response.data)
                // {
                //     setEmail(response.data.email)
                // }
            })
            .catch(erro => {
                console.error(erro)
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

        usuario.code = sendCode

        http.post('api/auth/first-access', usuario)
            .then((response) => {
                console.log(response);
                // ArmazenadorToken.definirToken(
                //     response.data.token_access,
                //     response.data.expires_at
                // )
                // navegar('/')
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
        setDocument,
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