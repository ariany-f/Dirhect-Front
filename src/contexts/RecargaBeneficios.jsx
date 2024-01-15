import http from '@http';
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArmazenadorToken } from '../utils';

/*BENEFIT TYPE ENUM */
const COLLABORATOR = 1;
const DEPARTMENT = 2;

const recargaInicial = {
    name: "",
    description: "",
    collaborators: [],
    departamentos: [],
    benefits: []
}

export const RecargaBeneficiosContext = createContext({
    recarga: recargaInicial,
    erros: {},
    setNome: () => null,
    setColaboradores: () => null,
    setDepartamentos: () => null,
    setAmount: () => null,
    submeterRecarga: () => null
})

export const useRecargaBeneficiosContext = () => {
    return useContext(RecargaBeneficiosContext);
}

export const RecargaBeneficiosProvider = ({ children }) => {

    const navegar = useNavigate()

    const [recarga, setRecarga] = useState(recargaInicial)

    const setColaboradores = (collaborators) => {
        if(collaborators.length === 0)
        {
            setRecarga(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    collaborators
                }
            })
            delete recarga['colaboradores']
        }
        else
        {
            const colaboradores = recarga.collaborators
            colaboradores.push(collaborators)
            setRecarga(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    colaboradores
                }
            })
            delete recarga['colaboradores']
        }
    }
    const setDepartamentos = (departamentos) => {
        if(departamentos.length === 0)
        {
            setRecarga(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    departamentos
                }
            })
            delete recarga['departments']
        }
        else
        {
            const departments = recarga.departamentos
            departments.push(departamentos)
            setRecarga(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    departments
                }
            })
            delete recarga['departments']
        }
    }
    const setAmount = (benefits) => {
        if(benefits.length === 0)
        {
            setRecarga(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    benefits
                }
            })
            delete recarga['beneficio']
        }
        else
        {
            const beneficio = recarga.benefits
            const exists = beneficio.filter((item, index) => {
                if(item.public_id === benefits.public_id)
                {
                    beneficio[index] = benefits
                }
                return item.public_id === benefits.public_id
            })
            if(exists.length === 0)
            {
                beneficio.push(benefits)
            }
            setRecarga(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    beneficio
                }
            })
            
            delete recarga['beneficio']
        }
    }
    const setNome = (name) => {
        setRecarga(estadoAnterior => {
            return {
                ...estadoAnterior,
                name
            }
        })
    }
    const submeterRecarga = () => {
        let obj = {}
        obj['name'] = recarga.name
        obj['description'] = recarga.description
        obj['benefit_type_enum'] = recarga.collaborators.length > 0 ? COLLABORATOR : DEPARTMENT
        obj['benefits'] = []
        obj['benefits']['collaborators'] = []
        obj['benefits']['departments'] = []
        if(recarga.collaborators.length > 0)
        {
            recarga.collaborators.map(item => {
                let colaborador = item
                obj['benefits']['collaborators'].push(colaborador)
            })
        }
        if(recarga.departamentos.length > 0)
        {
            recarga.departamentos.map(item => {
                let departamento = item
                obj['benefits']['departments'].push(departamento)
            })
        }
        console.log(obj)
    }
    const contexto = {
        recarga,
        setColaboradores,
        setDepartamentos,
        setNome,
        setAmount,
        submeterRecarga
    }

    return (<RecargaBeneficiosContext.Provider value={contexto}>
        {children}
    </RecargaBeneficiosContext.Provider>)
}