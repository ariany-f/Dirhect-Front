import http from '@http'
import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ColaboradorInicial = {
    name: '',
    email: '',
    cpf: '',
    date_birth: '',
    phone_number: '',
    phone_code: '11',
    cnpj: '',
    address_postal_code: '',
    address_street: '',
    address_number: '',
    address_complement: '',
    address_district: '',
    address_city: '',
    address_state: '',
    brand_card_enum: 1,
    departments: [],
    requested_card_enum: null,
    solicitar_cartao: false,
    adicionar_departamento: false,
    another_address_postal_code: '',
    another_address_street: '',
    another_address_number: '',
    another_address_complement: '',
    another_address_district: '',
    another_address_city: '',
    another_address_state: '',
    gender: '1',
    public_company_id: ''
}

export const ColaboradorContext = createContext({
    colaborador: ColaboradorInicial,
    erros: {},
    setPlanilha: () => null,
    setName: () => null,
    setEmail: () => null,
    setCpf: () => null,
    setBrandCardEnum: () => null,
    setDateBirth: () => null,
    setPhoneNumber: () => null,
    setDepartments: () => null,
    setGender: () => null,
    setCompanyPublicId: () => null,
    setAddressPostalCode: () => null,
    setAddressStreet: () => null,
    setAddressNumber: () => null,
    setAddressComplement: () => null,
    setAddressDistrict: () => null,
    setAddressCity: () => null,
    setAddressState: () => null,
    setRequestedCardEnum: () => null,
    setAnotherAddressPostalCode: () => null,
    setAnotherAddressStreet: () => null,
    setAnotherAddressNumber: () => null,
    setAnotherAddressComplement: () => null,
    setAnotherAddressDistrict: () => null,
    setAnotherAddressCity: () => null,
    setAnotherAddressState: () => null,
    setSolicitarCartao: () => null,
    setAdicionarDepartamento: () => null,
    submeterUsuario: () => null
})

export const useColaboradorContext = () => {
    return useContext(ColaboradorContext);
}

export const ColaboradorProvider = ({ children }) => {

    const navegar = useNavigate()

    const [colaborador, setColaborador] = useState(ColaboradorInicial)

    const setName = (name) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                name
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
    const setCpf = (cpf) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                cpf
            }
        })
    }
    const setDateBirth = (date_birth) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                date_birth
            }
        })
    }
    const setPhoneNumber = (phone_number) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                phone_number
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
    const setDepartments = (departments) => {
        const departamentos = colaborador.departments
        departamentos.push(departments)
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                departamentos
            }
        })
    }
    const setAddressPostalCode = (address_postal_code) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                address_postal_code
            }
        })
    }
    const setAddressStreet = (address_street) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                address_street
            }
        })
    }
    const setAddressNumber = (address_number) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                address_number
            }
        })
    }
    const setAddressComplement = (address_complement) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                address_complement
            }
        })
    }
    const setAddressDistrict = (address_district) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                address_district
            }
        })
    }
    const setBrandCardEnum = (brand_card_enum) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                brand_card_enum
            }
        })
    }
    const setAddressCity = (address_city) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                address_city
            }
        })
    }
    const setAddressState = (address_state) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                address_state
            }
        })
    }
    const setRequestedCardEnum = (requested_card_enum) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                requested_card_enum
            }
        })
    }
    const setAnotherAddressPostalCode = (another_address_postal_code) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                another_address_postal_code
            }
        })
    }
    const setAnotherAddressStreet = (another_address_street) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                another_address_street
            }
        })
    }
    const setAnotherAddressNumber = (another_address_number) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                another_address_number
            }
        })
    }
    const setGender = (gender) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                gender
            }
        })
    }
    const setAnotherAddressComplement = (another_address_complement) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                another_address_complement
            }
        })
    }
    const setAnotherAddressDistrict = (another_address_district) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                another_address_district
            }
        })
    }
    const setAnotherAddressCity = (another_address_city) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                another_address_city
            }
        })
    }
    const setAnotherAddressState = (another_address_state) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                another_address_state
            }
        })
    }
    const setSolicitarCartao = (solicitar_cartao) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                solicitar_cartao
            }
        })
    }
    const setAdicionarDepartamento = (adicionar_departamento) => {
        setColaborador(estadoAnterior => {
            return {
                ...estadoAnterior,
                adicionar_departamento
            }
        })
    }

    const submeterUsuario = () => {
        
        var sendCpf = colaborador.cpf.replace(/[^a-zA-Z0-9 ]/g, '')
        colaborador.cpf = sendCpf

        return http.post('api/collaborator/store', colaborador)
        .then((response) => {
            return response
        })
        .catch(erro => {
            return erro.response.data
        })
    }

    const contexto = {
        colaborador,
        setName,
        setEmail,
        setCpf,
        setDateBirth,
        setBrandCardEnum,
        setPhoneNumber,
        setGender,
        setCompanyPublicId,
        setDepartments,
        setAddressPostalCode,
        setAddressStreet,
        setAddressNumber,
        setAddressComplement,
        setAddressDistrict,
        setAddressCity,
        setAddressState,
        setRequestedCardEnum,
        setAnotherAddressPostalCode,
        setAnotherAddressStreet,
        setAnotherAddressNumber,
        setAnotherAddressComplement,
        setAnotherAddressDistrict,
        setAnotherAddressCity,
        setAnotherAddressState,
        setSolicitarCartao,
        setAdicionarDepartamento,
        submeterUsuario
    }

    return (<ColaboradorContext.Provider value={contexto}>
        {children}
    </ColaboradorContext.Provider>)
}