import http from '@http';
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArmazenadorToken } from '../utils';

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
})

export const useRecargaBeneficiosContext = () => {
    return useContext(RecargaBeneficiosContext);
}

export const RecargaBeneficiosProvider = ({ children }) => {

    const navegar = useNavigate()

    const [recarga, setRecarga] = useState(recargaInicial)

    const contexto = {
        recarga
    }

    return (<RecargaBeneficiosContext.Provider value={contexto}>
        {children}
    </RecargaBeneficiosContext.Provider>)
}