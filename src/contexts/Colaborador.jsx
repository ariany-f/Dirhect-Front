import http from '@http'
import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ColaboradorInicial = {
    nome: '',
    email: '',
    cpf: '',
    data_nascimento: '',
    situacao: 'A',
    dependentes: [],
    departamento: '',
    telefone1: '',
    cnpj: '',
    chapa: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    sexo: 'F',
    public_company_id: ''
}

export const ColaboradorContext = createContext({
    colaborador: ColaboradorInicial,
    erros: {},
    setPlanilha: () => null,
    setNome: () => null,
    setEmail: () => null,
    setCpf: () => null,
    setSituacao: () => null,
    setChapa: () => null,
    setDataNascimento: () => null,
    setTelefone: () => null,
    setDepartamento: () => null,
    setSexo: () => null,
    setCompanyPublicId: () => null,
    setCep: () => null,
    setRua: () => null,
    setNumero: () => null,
    setComplemento: () => null,
    setBairro: () => null,
    setCidade: () => null,
    setEstado: () => null,
    submeterUsuario: () => null
})

export const useColaboradorContext = () => {
    return useContext(ColaboradorContext);
}

export const ColaboradorProvider = ({ children }) => {

    const navegar = useNavigate()

    const [colaborador, setColaborador] = useState(ColaboradorInicial)

    const setNome = (nome) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                nome
            }
        })
    }
    const setSituacao = (situacao) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                situacao
            }
        })
    }
    const setEmail = (email) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                email
            }
        })
    }
    const setChapa = (chapa) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                chapa
            }
        })
    }
    const setCpf = (cpf) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                cpf
            }
        })
    }
    const setDataNascimento = (data_nascimento) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                data_nascimento
            }
        })
    }
    const setTelefone = (telefone1) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                telefone1
            }
        })
    }
    const setCompanyPublicId = (public_company_id) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                public_company_id
            }
        })
    }
    const setDepartamento = (departamento) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                departamento
            }
        })
    }
    const setCep = (cep) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                cep
            }
        })
    }
    const setRua = (rua) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                rua
            }
        })
    }
    const setNumero = (numero) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                numero
            }
        })
    }
    const setComplemento = (complemento) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                complemento
            }
        })
    }
    const setBairro = (bairro) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                bairro
            }
        })
    }
    const setCidade = (cidade) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                cidade
            }
        })
    }
    const setEstado = (estado) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                estado
            }
        })
    }
    const setSexo = (gender) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                gender
            }
        })
    }

    const submeterUsuario = () => {
        
        var sendCpf = colaborador.cpf.replace(/[^a-zA-Z0-9 ]/g, '')
        colaborador.cpf = sendCpf

        return http.post('funcionario/?format=json', colaborador)
        .then((response) => {
            return response
        })
        .catch(erro => {
            return erro.response.data
        })
    }

    const contexto = {
        colaborador,
        setNome,
        setEmail,
        setSituacao,
        setCpf,
        setDataNascimento,
        setChapa,
        setTelefone,
        setSexo,
        setCompanyPublicId,
        setDepartamento,
        setCep,
        setRua,
        setNumero,
        setComplemento,
        setBairro,
        setCidade,
        setEstado,
        submeterUsuario
    }

    return (<ColaboradorContext.Provider value={contexto}>
        {children}
    </ColaboradorContext.Provider>)
}