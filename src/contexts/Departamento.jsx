import http from '@http'
import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const departamentoInicial = {
    name: "",
    description: "",
    status: 10,
    collaborators: []
}

export const DepartamentoContext = createContext({
    departamento: departamentoInicial,
    erros: {},
    setDescription: () => null,
    setDepartamento: () => null,
    setColaboradores: () => null,
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
            collaborators.map(item => {
                colaboradores.push(item)
            })
            
            setDepartamento(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    colaboradores
                }
            })

            delete departamento['colaboradores']
        }
        else
        {
            departamento.collaborators = collaborators
        }
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
       
        const obj = {
            name: departamento.department.name,
            description: departamento.department.description,
            status: departamento.department.status,
            collaborators: departamento.collaborators
        }
        
        return http.post('api/dashboard/department', obj)
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
        setNome,
        submeterDepartamento
    }

    return (<DepartamentoContext.Provider value={contexto}>
        {children}
    </DepartamentoContext.Provider>)
}