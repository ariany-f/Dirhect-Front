import http from '@http';
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArmazenadorToken } from '../utils';

/*BENEFIT TYPE ENUM */
const COLLABORATOR = 1;
const DEPARTMENT = 2;

const saldoLivreInicial = {
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

export const RecargaSaldoLivreContext = createContext({
    recarga: saldoLivreInicial,
    erros: {},
    setColaboradores: () => null,
    setNome: () => null,
    setMotivo: () => null,
    setAmountAuxilioCollaborator: () => null
})

export const useRecargaSaldoLivreContext = () => {
    return useContext(RecargaSaldoLivreContext);
}

export const RecargaSaldoLivreProvider = ({ children }) => {

    const navegar = useNavigate()

    const [recarga, setRecarga] = useState(saldoLivreInicial)

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
    const setMotivo = (description) => {
        setRecarga(estadoAnterior => {
            return {
                ...estadoAnterior,
                description
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
        setMotivo,
        setAmountAuxilioCollaborator
    }

    return (<RecargaSaldoLivreContext.Provider value={contexto}>
        {children}
    </RecargaSaldoLivreContext.Provider>)
}