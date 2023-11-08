import axios from 'axios';
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const usuarioInicial = {
    email: '',
    password: '',
    code: []
}

export const SessaoUsuarioContext = createContext({
    usuario: usuarioInicial,
    erros: {},
    setEmail: () => null,
    setPassword: () => null,
    setCode: () => null,
    solicitarCodigo: () => null,
    submeterLogin: () => null
})

export const useSessaoUsuarioContext = () => {
    return useContext(SessaoUsuarioContext);
}

export const SessaoUsuarioProvider = ({ children }) => {

    const navegar = useNavigate()

    const [usuario, setUsuario] = useState(usuarioInicial)

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

        axios.post('https://beta-aqbeneficios.aqbank.com.br/api/auth/code', usuario)
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
        usuario.remember = false

        axios.post('https://beta-aqbeneficios.aqbank.com.br/api/auth/token', usuario)
            .then(() => {
                
            })
            .catch(erro => {
                console.error(erro)
            })
    }


    const contexto = {
        usuario,
        setEmail,
        setPassword,
        setCode,
        submeterLogin,
        solicitarCodigo
    }

    return (<SessaoUsuarioContext.Provider value={contexto}>
        {children}
    </SessaoUsuarioContext.Provider>)
}