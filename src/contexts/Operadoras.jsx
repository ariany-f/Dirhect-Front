import http from '@http';
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArmazenadorToken } from '../utils';

const operadoraInicial = {
    id: 0,
    nome: "",
    imagem: "",
    beneficios_vinculados: []
}

export const OperadorasContext = createContext({
    operadora: operadoraInicial,
    erros: {},
    setBeneficiosVinculados: () => null,
    setImagem: () => null,
    setNome: () => null
})

export const useOperadorasContext = () => {
    return useContext(OperadorasContext);
}

export const OperadorasProvider = ({ children }) => {

    const navegar = useNavigate()

    const [operadora, setOperadora] = useState(operadoraInicial)

    const setBeneficiosVinculados = (beneficios_vinculados) => {
        if(beneficios_vinculados.length === 0)
        {
            setOperadora(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    beneficios_vinculados
                }
            })
        }
        else
        {
            const beneficios_vinculados = operadora.beneficios_vinculados
            beneficios_vinculados.push(beneficios_vinculados)
            setOperadora(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    beneficios_vinculados
                }
            })
        }
    }
    const setImagem = (imagem) => {
        setOperadora(estadoAnterior => {
            return {
                ...estadoAnterior,
                imagem
            }
        })
    }
    const setNome = (nome) => {
        setOperadora(estadoAnterior => {
            return {
                ...estadoAnterior,
                nome
            }
        })
    }
    const contexto = {
        operadora,
        setBeneficiosVinculados,
        setImagem,
        setNome
    }

    return (<OperadorasContext.Provider value={contexto}>
        {children}
    </OperadorasContext.Provider>)
}