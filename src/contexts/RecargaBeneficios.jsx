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
    amount: 0,
    flexible_value: 0,
    is_flexible: false,
    status: 1,
    department_public_id: "",
    benefit_type_enum: 1,
    food_meal_one_category: false,
    collaborators: []
}

export const RecargaBeneficiosContext = createContext({
    recarga: recargaInicial,
    erros: {},
    setColaboradores: () => null,
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
        setNome,
        setAmountAuxilioCollaborator
    }

    return (<RecargaBeneficiosContext.Provider value={contexto}>
        {children}
    </RecargaBeneficiosContext.Provider>)
}