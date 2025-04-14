import http from '@http';
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArmazenadorToken } from '../utils';

const elegibilidadeInicial = {
    item_contrato: "",
    filiais: [],
    departamentos: [],
    funcoes: [],
    cargos: [],
    centros_custo: [],
    horarios: [],
    secoes: [],
    sindicatos: [],
}

export const ConfiguracaoElegibilidadeContext = createContext({
    elegibilidade: elegibilidadeInicial,
    erros: {},
    setFiliais: () => null,
    setDepartamentos: () => null,
    setCargos: () => null,
    setCentrosCusto: () => null,
    setHorarios: () => null,
    setSecoes: () => null,
    setSindicatos: () => null,
    setFuncoes: () => null,
    setItemContrato: () => null,
    submeterElegibilidade: () => null
})

export const useConfiguracaoElegibilidadeContext = () => {
    return useContext(ConfiguracaoElegibilidadeContext);
}

export const ConfiguracaoElegibilidadeProvider = ({ children }) => {

    const navegar = useNavigate()

    const [elegibilidade, setElegibilidade] = useState(elegibilidadeInicial)

    const setFiliais = (filiais) => {
        if(filiais.length === 0)
        {
            setElegibilidade(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    filiais
                }
            })
        }
        else
        {
            const fil = elegibilidade.filiais
            filiais.push(fil)
            setElegibilidade(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    filiais
                }
            })
        }
    }
    const setFuncoes = (funcoes) => {
        if(funcoes.length === 0)
        {
            setElegibilidade(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    funcoes
                }
            })
        }
        else
        {
            const fil = elegibilidade.funcoes
            funcoes.push(fil)
            setElegibilidade(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    funcoes
                }
            })
        }
    }
    const setCargos = (cargos) => {
        if(cargos.length === 0)
        {
            setElegibilidade(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    cargos
                }
            })
        }
        else
        {
            const fil = elegibilidade.cargos
            cargos.push(fil)
            setElegibilidade(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    cargos
                }
            })
        }
    }
    const setSindicatos = (sindicatos) => {
        if(sindicatos.length === 0)
        {
            setElegibilidade(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    sindicatos
                }
            })
        }
        else
        {
            const fil = elegibilidade.sindicatos
            sindicatos.push(fil)
            setElegibilidade(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    sindicatos
                }
            })
        }
    }
    const setHorarios = (horarios) => {
        if(horarios.length === 0)
        {
            setElegibilidade(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    horarios
                }
            })
        }
        else
        {
            const fil = elegibilidade.horarios
            horarios.push(fil)
            setElegibilidade(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    horarios
                }
            })
        }
    }
    const setCentrosCusto = (centros_custo) => {
        if(centros_custo.length === 0)
        {
            setElegibilidade(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    centros_custo
                }
            })
        }
        else
        {
            const fil = elegibilidade.centros_custo
            centros_custo.push(fil)
            setElegibilidade(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    centros_custo
                }
            })
        }
    }
    const setSecoes = (secoes) => {
        if(secoes.length === 0)
        {
            setElegibilidade(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    secoes
                }
            })
        }
        else
        {
            const fil = elegibilidade.secoes
            secoes.push(fil)
            setElegibilidade(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    secoes
                }
            })
        }
    }
    const setDepartamentos = (departamentos) => {
        if(departamentos.length === 0)
        {
            setElegibilidade(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    departamentos
                }
            })
        }
        else
        {
            const fil = elegibilidade.departamentos
            departamentos.push(fil)
            setElegibilidade(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    departamentos
                }
            })
        }
    }
    const setItemContrato = (item_contrato) => {
        setElegibilidade(estadoAnterior => {
            return {
                ...estadoAnterior,
                item_contrato
            }
        })
    }
    const submeterElegibilidade = () => {
        let obj = {}
        obj['name'] = elegibilidade.name
        obj['description'] = elegibilidade.description
        obj['balance'] = {}
        obj['balance']['filiais'] = {}
        obj['balance']['departments'] = {}
        if(elegibilidade.filiais.length > 0)
        {
            elegibilidade.filiais.map(item => {
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
        if(elegibilidade.departamentos.length > 0)
        {
            elegibilidade.departamentos.map(item => {
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
        elegibilidade,
        setItemContrato,
        setFiliais,
        setDepartamentos,
        setCentrosCusto,
        setHorarios,
        setSecoes,
        setSindicatos,
        setFuncoes,
        submeterElegibilidade
    }

    return (<ConfiguracaoElegibilidadeContext.Provider value={contexto}>
        {children}
    </ConfiguracaoElegibilidadeContext.Provider>)
}