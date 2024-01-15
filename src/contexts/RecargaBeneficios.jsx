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
    departamentos: []
}

export const RecargaBeneficiosContext = createContext({
    recarga: recargaInicial,
    erros: {},
    setColaboradores: () => null,
    setDepartamentos: () => null,
    setNome: () => null,
    setAmountAuxilioCollaborator: () => null
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
        }
    }
    const setAmountAuxilioCollaborator = (collaborator, amount) => {
        const colaboradores = recarga.collaborators
        const colaborador = colaboradores.filter((el) => el === collaborator)
        colaborador.auxilio = amount
        
        setRecarga(estadoAnterior => {
            return {
                ...estadoAnterior,
                colaboradores
            }
        })
    }
    const setNome = (name) => {
        setRecarga(estadoAnterior => {
            return {
                ...estadoAnterior,
                name
            }
        })
    }
    const contexto = {
        recarga,
        setColaboradores,
        setDepartamentos,
        setNome,
        setAmountAuxilioCollaborator
    }

    return (<RecargaBeneficiosContext.Provider value={contexto}>
        {children}
    </RecargaBeneficiosContext.Provider>)
}