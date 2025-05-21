import http from '@http'
import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const OperadorInicial = {
    email: '',
    first_name: '',
    last_name: '',
    tenant_id: '',
    username: '',
    password: '',
    groups: {}
}

export const OperadorContext = createContext({
    operador: OperadorInicial,
    setGroups: () => null,
    setEmail: () => null,
    setFirstName: () => null,
    setLastName: () => null,
    setTenantId: () => null,
    setUsername: () => null,
    setPassword: () => null,
    erros: {},
    submeterOperador: () => null
})

export const useOperadorContext = () => {
    return useContext(OperadorContext);
}

export const OperadorProvider = ({ children }) => {

    const navegar = useNavigate()

    const [operador, setOperador] = useState(OperadorInicial)

    const setGroups = (groups) => {
        setOperador(estadoAnterior => {
            return {
                ...estadoAnterior,
                groups
            }
        })
    }   
    
    const setEmail = (collaborator_public_id) => {
        setOperador(estadoAnterior => {
            return {
                ...estadoAnterior,
                collaborator_public_id
            }
        })
    }
    
    const setFirstName = (first_name) => {
        setOperador(estadoAnterior => {
            return {
                ...estadoAnterior,
                first_name
            }
        })
    }

    const setLastName = (last_name) => {
        setOperador(estadoAnterior => {
            return {
                ...estadoAnterior,
                last_name
            }
        })
    }

    const setTenantId = (tenant_id) => {
        setOperador(estadoAnterior => {
            return {
                ...estadoAnterior,
                tenant_id
            }
        })
    }

    const setUsername = (username) => {
        setOperador(estadoAnterior => {
            return {
                ...estadoAnterior,
                username
            }
        })
    }

    const setPassword = (password) => {
        setOperador(estadoAnterior => {
            return {
                ...estadoAnterior,
                password
            }
        })
    }

    const submeterOperador = () => {
        return http.post('usuario/', operador)
        .then((response) => {
            return response
        })
        .catch(erro => {
            return erro.response
        })
    }

    const contexto = {
        operador,
        setGroups,
        setEmail,
        setFirstName,
        setLastName,
        setTenantId,
        setUsername,
        setPassword,
        submeterOperador
    }

    return (<OperadorContext.Provider value={contexto}>
        {children}
    </OperadorContext.Provider>)
}