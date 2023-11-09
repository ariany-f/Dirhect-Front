import http from '@http';
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArmazenadorToken } from '../utils';

const usuarioInicial = {
    email: '',
    password: '',
    remember: false,
    code: []
}

export const SessaoUsuarioContext = createContext({
    usuario: usuarioInicial,
    erros: {},
    setRemember: () => null,
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

    const solicitarCodigo = () => {

        http.post('api/auth/code', usuario)
            .then(() => {

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
                navegar('/login/selecionar-empresa')
            })
            .catch(erro => {
                console.error(erro)
            })
    }

    const submeterLogout = () => {
        ArmazenadorToken.efetuarLogout()
        setUsuarioEstaLogado(false)
    }


    const contexto = {
        usuario,
        usuarioEstaLogado,
        setRemember,
        setEmail,
        setPassword,
        setCode,
        submeterLogin,
        submeterLogout,
        solicitarCodigo
    }

    return (<SessaoUsuarioContext.Provider value={contexto}>
        {children}
    </SessaoUsuarioContext.Provider>)
}