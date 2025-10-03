import http from '@http';
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArmazenadorToken } from '@utils';

const bancoInicial = {
    id: 0,
    nome: "",
    id_origem: 0,
    descricao: ""
}

export const BancosContext = createContext({
    banco: bancoInicial,
    erros: {},
    setNome: () => null,
    setIdOrigem: () => null,
    setDescricao: () => null
})

export const useBancosContext = () => {
    return useContext(BancosContext);
}

export const BancosProvider = ({ children }) => {

    const navegar = useNavigate()
    const [banco, setBanco] = useState(bancoInicial)

    // const setBeneficiosVinculados = (beneficios_vinculados) => {
    //     if(beneficios_vinculados.length === 0)
    //     {
    //         setBanco(estadoAnterior => {
    //             return {
    //                 ...estadoAnterior,
    //                 beneficios_vinculados
    //             }
    //         })
    //     }
    //     else
    //     {
    //         const beneficios_vinculados = banco.beneficios_vinculados
    //         beneficios_vinculados.push(beneficios_vinculados)
    //         setBanco(estadoAnterior => {
    //             return {
    //                 ...estadoAnterior,
    //                 beneficios_vinculados
    //             }
    //         })
    //     }
    // }
    // const setImagem = (imagem) => {
    //     setBanco(estadoAnterior => {
    //         return {
    //             ...estadoAnterior,
    //             imagem
    //         }
    //     })
    // }
    const setNome = (nome) => {
        setBanco(estadoAnterior => {
            return {
                ...estadoAnterior,
                nome
            }
        })
    }
    const setIdOrigem = (id_origem) => {
        setBanco(estadoAnterior => {
            return {
                ...estadoAnterior,
                id_origem
            }
        })
    }
    const setDescricao = (descricao) => {
        setBanco(estadoAnterior => {
            return {
                ...estadoAnterior,
                descricao
            }
        })
    }
    const contexto = {
        banco,
        setNome,
        setIdOrigem,
        setDescricao
    }

    return (<BancosContext.Provider value={contexto}>
        {children}
    </BancosContext.Provider>)
}