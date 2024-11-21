import http from '@http'
import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const OperadorInicial = {
    collaborator_public_id: '',
    name: '',
    roles: {}
}

export const OperadorContext = createContext({
    operador: OperadorInicial,
    setRoles: () => null,
    setPublicId: () => null,
    setName: () => null,
    erros: {},
    submeterOperador: () => null
})

export const useOperadorContext = () => {
    return useContext(OperadorContext);
}

export const OperadorProvider = ({ children }) => {

    const navegar = useNavigate()

    const [operador, setOperador] = useState(OperadorInicial)

    const setRoles = (roles) => {
        setOperador(estadoAnterior => {
            return {
                ...estadoAnterior,
                roles
            }
        })
    }   
    
    const setPublicId = (collaborator_public_id) => {
        setOperador(estadoAnterior => {
            return {
                ...estadoAnterior,
                collaborator_public_id
            }
        })
    }
    
    const setName = (name) => {
        setOperador(estadoAnterior => {
            return {
                ...estadoAnterior,
                name
            }
        })
    }

    const submeterOperador = () => {
        
        return http.post('api/dashboard/operator', operador)
        .then((response) => {
            return response
        })
        .catch(erro => {
            return erro.response.data
        })
    }

    const contexto = {
        operador,
        setRoles,
        setPublicId,
        setName,
        submeterOperador
    }

    return (<OperadorContext.Provider value={contexto}>
        {children}
    </OperadorContext.Provider>)
}