import http from '@http'
import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DependenteInicial = {
    nome: '',
    email: '',
    cpf: '',
    data_nascimento: '',
    grau_parentesco: '',
    situacao: 'A',
    telefone1: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    sexo: 'F',
}

export const DependenteContext = createContext({
    dependente: DependenteInicial,
    erros: {},
    setDependenteNome: () => null,
    setDependenteEmail: () => null,
    setDependenteCpf: () => null,
    setDependenteGrauParentesco: () => null,
    setDependenteSituacao: () => null,
    setDependenteDataNascimento: () => null,
    setDependenteTelefone: () => null,
    setDependenteDepartamento: () => null,
    setDependenteSexo: () => null,
    setDependenteCep: () => null,
    setDependenteRua: () => null,
    setDependenteNumero: () => null,
    setDependenteComplemento: () => null,
    setDependenteBairro: () => null,
    setDependenteCidade: () => null,
    setDependenteEstado: () => null,
    submeterDependente: () => null
})

export const useDependenteContext = () => {
    return useContext(DependenteContext);
}

export const DependenteProvider = ({ children }) => {

    const navegar = useNavigate()

    const [dependente, setDependente] = useState(DependenteInicial)

    const setDependenteNome = (nome) => {
        setDependente(estadoAnterior => {
            return {
                ...estadoAnterior,
                nome
            }
        })
    }
    const setDependenteGrauParentesco = (grau_parentesco) => {
        setDependente(estadoAnterior => {
            return {
                ...estadoAnterior,
                grau_parentesco
            }
        })
    }
    const setDependenteSituacao = (situacao) => {
        setDependente(estadoAnterior => {
            return {
                ...estadoAnterior,
                situacao
            }
        })
    }
    const setDependenteEmail = (email) => {
        setDependente(estadoAnterior => {
            return {
                ...estadoAnterior,
                email
            }
        })
    }
    const setDependenteCpf = (cpf) => {
        setDependente(estadoAnterior => {
            return {
                ...estadoAnterior,
                cpf
            }
        })
    }
    const setDependenteDataNascimento = (data_nascimento) => {
        setDependente(estadoAnterior => {
            return {
                ...estadoAnterior,
                data_nascimento
            }
        })
    }
    const setDependenteTelefone = (telefone1) => {
        setDependente(estadoAnterior => {
            return {
                ...estadoAnterior,
                telefone1
            }
        })
    }
    const setDependenteDepartamento = (departamento) => {
        setDependente(estadoAnterior => {
            return {
                ...estadoAnterior,
                departamento
            }
        })
    }
    const setDependenteCep = (cep) => {
        setDependente(estadoAnterior => {
            return {
                ...estadoAnterior,
                cep
            }
        })
    }
    const setDependenteRua = (rua) => {
        setDependente(estadoAnterior => {
            return {
                ...estadoAnterior,
                rua
            }
        })
    }
    const setDependenteNumero = (numero) => {
        setDependente(estadoAnterior => {
            return {
                ...estadoAnterior,
                numero
            }
        })
    }
    const setDependenteComplemento = (complemento) => {
        setDependente(estadoAnterior => {
            return {
                ...estadoAnterior,
                complemento
            }
        })
    }
    const setDependenteBairro = (bairro) => {
        setDependente(estadoAnterior => {
            return {
                ...estadoAnterior,
                bairro
            }
        })
    }
    const setDependenteCidade = (cidade) => {
        setDependente(estadoAnterior => {
            return {
                ...estadoAnterior,
                cidade
            }
        })
    }
    const setDependenteEstado = (estado) => {
        setDependente(estadoAnterior => {
            return {
                ...estadoAnterior,
                estado
            }
        })
    }
    const setDependenteSexo = (gender) => {
        setDependente(estadoAnterior => {
            return {
                ...estadoAnterior,
                gender
            }
        })
    }

    const submeterDependente = () => {
        const dependenteParaEnvio = {
            ...dependente,
            cpf: dependente.cpf.replace(/[^a-zA-Z0-9 ]/g, ''),
        };

        return http.post('dependente/?format=json', dependenteParaEnvio)
        .then((response) => {
            return response
        })
        .catch(erro => {
            return erro.response.data
        })
    }

    const contexto = {
        dependente,
        setDependenteNome,
        setDependenteEmail,
        setDependenteSituacao,
        setDependenteGrauParentesco,
        setDependenteCpf,
        setDependenteDataNascimento,
        setDependenteTelefone,
        setDependenteSexo,
        setDependenteDepartamento,
        setDependenteCep,
        setDependenteRua,
        setDependenteNumero,
        setDependenteComplemento,
        setDependenteBairro,
        setDependenteCidade,
        setDependenteEstado,
        submeterDependente
    }

    return (<DependenteContext.Provider value={contexto}>
        {children}
    </DependenteContext.Provider>)
}