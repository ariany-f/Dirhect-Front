import http from '@http'
import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const departamentoInicial = {
    name: "",
    description: "",
    status: 10,
    collaborators_count: 0,
    collaborators: []
}

export const DepartamentoContext = createContext({
    departamento: departamentoInicial,
    erros: {},
    setDescription: () => null,
    setDepartamento: () => null,
    setColaboradores: () => null,
    setNumeroColaboradores: () => null,
    setNome: () => null,
    submeterDepartamento: () => null
})

export const useDepartamentoContext = () => {
    return useContext(DepartamentoContext);
}

export const DepartamentoProvider = ({ children }) => {

    const navegar = useNavigate()
    const [departamento, setDepartamento] = useState(departamentoInicial)

    const setColaboradores = (collaborators) => {
       
        if(departamento.collaborators && departamento.collaborators.length > 0)
        {
            const colaboradores = departamento.collaborators

            if(collaborators && Object.keys(collaborators).length > 0)
            {
                collaborators.map(item => {
                    colaboradores.push(item)
                })
                
                setNumeroColaboradores(Object.keys(colaboradores).length)
    
                setDepartamento(estadoAnterior => {
                    return {
                        ...estadoAnterior,
                        colaboradores
                    }
                })

                delete departamento['colaboradores']
            }
        }
        else
        {
            if(collaborators && Object.keys(collaborators).length > 0)
            {
                setNumeroColaboradores(Object.keys(collaborators).length)
                
                setDepartamento(estadoAnterior => {
                    return {
                        ...estadoAnterior,
                        collaborators
                    }
                })
            }
        }
    }
    const setNumeroColaboradores = (collaborators_count) => {
        setDepartamento(estadoAnterior => {
            return {
                ...estadoAnterior,
                collaborators_count
            }
        })
    }
    const setNome = (name) => {
        setDepartamento(estadoAnterior => {
            return {
                ...estadoAnterior,
                name
            }
        })
    }
    const setDescription = (description) => {
        setDepartamento(estadoAnterior => {
            return {
                ...estadoAnterior,
                description
            }
        })
    }
    
    const submeterDepartamento = () => {
            
        return http.post('api/dashboard/department', departamento)
            .then((response) => {
                return response
            })
            .catch(erro => {
                return erro.response.data
            })
    }

    const contexto = {
        departamento,
        setDepartamento,
        setColaboradores,
        setDescription,
        setNumeroColaboradores,
        setNome,
        submeterDepartamento
    }

    return (<DepartamentoContext.Provider value={contexto}>
        {children}
    </DepartamentoContext.Provider>)
}