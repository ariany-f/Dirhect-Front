import http from '@http';
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArmazenadorToken } from '@utils';

const calendarioInicial = {
    id: 0,
    nome: "",
    id_origem: 0,
    descricao: ""
}

export const CalendariosContext = createContext({
    calendario: calendarioInicial,
    erros: {},
    setNome: () => null,
    setIdOrigem: () => null,
    setDescricao: () => null
})

export const useCalendariosContext = () => {
    return useContext(CalendariosContext);
}

export const CalendariosProvider = ({ children }) => {

    const navegar = useNavigate()
    const [calendario, setCalendario] = useState(calendarioInicial)

    // const setBeneficiosVinculados = (beneficios_vinculados) => {
    //     if(beneficios_vinculados.length === 0)
    //     {
    //         setCalendario(estadoAnterior => {
    //             return {
    //                 ...estadoAnterior,
    //                 beneficios_vinculados
    //             }
    //         })
    //     }
    //     else
    //     {
    //         const beneficios_vinculados = calendario.beneficios_vinculados
    //         beneficios_vinculados.push(beneficios_vinculados)
    //         setCalendario(estadoAnterior => {
    //             return {
    //                 ...estadoAnterior,
    //                 beneficios_vinculados
    //             }
    //         })
    //     }
    // }
    // const setImagem = (imagem) => {
    //     setCalendario(estadoAnterior => {
    //         return {
    //             ...estadoAnterior,
    //             imagem
    //         }
    //     })
    // }
    const setNome = (nome) => {
        setCalendario(estadoAnterior => {
            return {
                ...estadoAnterior,
                nome
            }
        })
    }
    const setIdOrigem = (id_origem) => {
        setCalendario(estadoAnterior => {
            return {
                ...estadoAnterior,
                id_origem
            }
        })
    }
    const setDescricao = (descricao) => {
        setCalendario(estadoAnterior => {
            return {
                ...estadoAnterior,
                descricao
            }
        })
    }
    const contexto = {
        calendario,
        setNome,
        setIdOrigem,
        setDescricao
    }

    return (<CalendariosContext.Provider value={contexto}>
        {children}
    </CalendariosContext.Provider>)
}