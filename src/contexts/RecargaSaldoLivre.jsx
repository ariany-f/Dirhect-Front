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
    filiais: [],
    departamentos: [],
    balance: []
}

export const RecargaSaldoLivreContext = createContext({
    recarga: saldoLivreInicial,
    erros: {},
    setFiliais: () => null,
    setDepartamentos: () => null,
    setBalance: () => null,
    setNome: () => null,
    setMotivo: () => null,
    submeterSaldoLivre: () => null
})

export const useRecargaSaldoLivreContext = () => {
    return useContext(RecargaSaldoLivreContext);
}

export const RecargaSaldoLivreProvider = ({ children }) => {

    const navegar = useNavigate()

    const [recarga, setRecarga] = useState(saldoLivreInicial)

    const setFiliais = (filiais) => {
        if(filiais.length === 0)
        {
            setRecarga(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    filiais
                }
            })
        }
        else
        {
            const fil = recarga.filiais
            filiais.push(fil)
            setRecarga(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    filiais
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
            const fil = recarga.departamentos
            departamentos.push(fil)
            setRecarga(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    departamentos
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
    const submeterSaldoLivre = () => {
        let obj = {}
        obj['name'] = recarga.name
        obj['description'] = recarga.description
        obj['balance'] = {}
        obj['balance']['filiais'] = {}
        obj['balance']['departments'] = {}
        if(recarga.filiais.length > 0)
        {
            recarga.filiais.map(item => {
                let colaborador = {}
                item.map((col, index) => {
                    let collaborator = {}
                    collaborator.public_id = col.public_id
                    collaborator.amount = col.amount
                    colaborador[index] = collaborator
                })
                obj.balance['filiais'] = colaborador
            })
        }
        if(recarga.departamentos.length > 0)
        {
            recarga.departamentos.map(item => {
                let departamento = {}
                item.map((col, index) => {
                    let department = {}
                    department.public_id = col.public_id
                    department.amount = col.amount
                    departamento[index] = department
                })
                obj['balance']['departments'] = departamento
            })
        }
        return sendRequest(obj)
    }

    function sendRequest(obj)
    {
        http.post('api/recharge/free-balance', obj)
        .then((response) => {
            return response
        })
        .catch(erro => {
            return erro.response.data
        })
    }
    const contexto = {
        recarga,
        setFiliais,
        setDepartamentos,
        setBalance,
        setNome,
        setMotivo,
        submeterSaldoLivre
    }

    return (<RecargaSaldoLivreContext.Provider value={contexto}>
        {children}
    </RecargaSaldoLivreContext.Provider>)
}