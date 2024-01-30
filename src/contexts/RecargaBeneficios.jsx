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
    total: 0,
    collaborators: [],
    departamentos: [],
    benefits: []
}

export const RecargaBeneficiosContext = createContext({
    recarga: recargaInicial,
    erros: {},
    setNome: () => null,
    setColaboradores: () => null,
    setDepartamentos: () => null,
    setTotal: () => null,
    setAmount: () => null,
    submeterRecarga: () => null
})

export const useRecargaBeneficiosContext = () => {
    return useContext(RecargaBeneficiosContext);
}

export const RecargaBeneficiosProvider = ({ children }) => {

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
            delete recarga['colaboradores']
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
            delete recarga['colaboradores']
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
            delete recarga['departments']
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
            delete recarga['departments']
        }
    }
    const setAmount = (benefits) => {
        if(benefits.length === 0)
        {
            setRecarga(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    benefits
                }
            })
            delete recarga['beneficio']
        }
        else
        {
            const beneficio = recarga.benefits
            const exists = beneficio.filter((item, index) => {
                if(item.public_id === benefits.public_id)
                {
                    beneficio[index] = benefits
                }
                return item.public_id === benefits.public_id
            })
            if(exists.length === 0)
            {
                beneficio.push(benefits)
            }
            setRecarga(estadoAnterior => {
                return {
                    ...estadoAnterior,
                    beneficio
                }
            })
            
            delete recarga['beneficio']
        }
    }
    const setNome = (name) => {
        setRecarga(estadoAnterior => {
            return {
                ...estadoAnterior,
                name
            }
        })
    }  
    
    const setTotal = (total) => {
        setRecarga(estadoAnterior => {
            return {
                ...estadoAnterior,
                total
            }
        })
    }
    const submeterRecarga = () => {
        let obj = {}
        obj['name'] = recarga.name
        obj['description'] = recarga.description
        obj['benefit_type_enum'] = recarga.collaborators.length > 0 ? COLLABORATOR : DEPARTMENT
        obj['collaborators'] = []
        obj['departments'] = []

        let valueTotal = 0
        if(recarga.collaborators.length > 0)
        {
            recarga.collaborators.map((item, key) => {
                let colaborador = {}
                item.map((col, index) => {
                    let collaborator = {}
                    collaborator['public_id'] = col.public_id
                    collaborator['all_benefits'] = col.all_benefits
                    colaborador[index] = collaborator

                    col.all_benefits.map(benefit => {
                        valueTotal = valueTotal + benefit.amount
                        if(benefit.flexible_value)
                        {
                            valueTotal = valueTotal + benefit.flexible_value
                        }
                    })
                })
                
                obj['recharge_amount'] = valueTotal
                obj['collaborators'] = colaborador
            })
            
        }
        if(recarga.departamentos.length > 0)
        {
            recarga.departamentos.map((item, key) => {
                let departamento = {}
                item.map((col, index) => {
                    let department = {}
                    department['public_id'] = col.public_id
                    department['all_benefits'] = col.all_benefits
                    departamento[index] = department

                    col.all_benefits.map(benefit => {
                        valueTotal = valueTotal + benefit.amount
                        if(benefit.flexible_value)
                        {
                            valueTotal = valueTotal + benefit.flexible_value
                        }
                    })
                })
                
                obj['recharge_amount'] = valueTotal
                obj['departments'] = departamento
            })
        }
        return sendRequest(obj)
    }

    function sendRequest(obj)
    {
        return http.post('api/recharge/benefits', obj)
        .then((response) => {
            return response
        })
        .catch(erro => {
            return erro.response.data
        })
    }
    
    const contexto = {
        recarga,
        setColaboradores,
        setDepartamentos,
        setNome,
        setTotal,
        setAmount,
        submeterRecarga
    }

    return (<RecargaBeneficiosContext.Provider value={contexto}>
        {children}
    </RecargaBeneficiosContext.Provider>)
}