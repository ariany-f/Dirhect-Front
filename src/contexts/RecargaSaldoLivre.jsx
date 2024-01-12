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
    collaborators: [],
    balance: []
}

export const RecargaSaldoLivreContext = createContext({
    recarga: saldoLivreInicial,
    erros: {},
    setColaboradores: () => null,
    setBalance: () => null,
    setNome: () => null,
    setMotivo: () => null
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
    const setBalance = (balance) => {
        if(balance.length === 0)
        {
            setRecarga(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    balance
                }
            })
        }
        else
        {
            const saldolivre = recarga.balance
            const exists = saldolivre.filter((item, index) => {
                if(item.public_id === balance.public_id)
                {
                    saldolivre[index] = balance
                }
                return item.public_id === balance.public_id
            })
            if(exists.length === 0)
            {
                saldolivre.push(balance)
            }
            setRecarga(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    saldolivre
                }
            })
        }
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
        setBalance,
        setNome,
        setMotivo
    }

    return (<RecargaSaldoLivreContext.Provider value={contexto}>
        {children}
    </RecargaSaldoLivreContext.Provider>)
}