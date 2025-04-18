import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import Botao from "@components/Botao"
import { useEffect, useState } from "react"
import DropdownItens from '@components/DropdownItens'
import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import http from '@http'
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"
import axios from "axios";
        
const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const Col6 = styled.div`
    padding: 20px;
    flex: 1 1 50%;
`;

const ContainerButton = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    & button {
        width: initial;
    }
`

function AdicionarCnpj() {

    const { 
        usuario,
        dadosUsuario,
        setCompanies,
    } = useSessaoUsuarioContext()

    const [estados, setEstados] = useState([]);

    const navegar = useNavigate()

    useEffect(() => {
    //    http.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    //    .then(response => {
    //         response.map((item) => {
    //             let obj = {
    //                 name: item.nome,
    //                 code: item.sigla
    //             }
    //             if(!estados.includes(obj))
    //             {
    //                 setEstados(estadoAnterior => [...estadoAnterior, obj]);
    //             }
    //         })
    //     })
    }, [])


    const [classError, setClassError] = useState([])
    const [company, setCompany] = useState({
        status: 6,
        public_company_id: usuario.company_public_id,
        public_user_id: usuario.public_id,
        cnpj: '',
        social_reason: '',
        trade_name: '',
        address_postal_code: '',
        address_street: '',
        address_district: '',
        address_number: '',
        municipal_registration: '',
        state_registration: '',
        address_complement: '',
        address_city: '',
        address_state: '',
        email: usuario.email,
        phone_code: '11',
        phone_number: '984979026'
    })
    
    const setCnpj = (cnpj) => {
        setCompany(estadoAnterior => {
            return {
                ...estadoAnterior,
                cnpj
            }
        })
    }
    const setInscricaoMunicipal = (municipal_registration) => {
        setCompany(estadoAnterior => {
            return {
                ...estadoAnterior,
                municipal_registration
            }
        })
    }
    const setInscricaoEstadual = (state_registration) => {
        setCompany(estadoAnterior => {
            return {
                ...estadoAnterior,
                state_registration
            }
        })
    }
    const setRazaoSocial = (social_reason) => {
        setCompany(estadoAnterior => {
            return {
                ...estadoAnterior,
                social_reason
            }
        })
    }
    const setNomeFantasia = (trade_name) => {
        setCompany(estadoAnterior => {
            return {
                ...estadoAnterior,
                trade_name
            }
        })
    }
    const setCep = (address_postal_code) => {
        setCompany(estadoAnterior => {
            return {
                ...estadoAnterior,
                address_postal_code
            }
        })
    }
    const setLogradouro = (address_street) => {
        setCompany(estadoAnterior => {
            return {
                ...estadoAnterior,
                address_street
            }
        })
    }
    const setNumero = (address_number) => {
        setCompany(estadoAnterior => {
            return {
                ...estadoAnterior,
                address_number
            }
        })
    }
    const setComplemento = (address_complement) => {
        setCompany(estadoAnterior => {
            return {
                ...estadoAnterior,
                address_complement
            }
        })
    }
    const setBairro = (address_district) => {
        setCompany(estadoAnterior => {
            return {
                ...estadoAnterior,
                address_district
            }
        })
    }
    const setCidade = (address_city) => {
        setCompany(estadoAnterior => {
            return {
                ...estadoAnterior,
                address_city
            }
        })
    }
    const setUf = (address_state) => {
        var uf = address_state.code
        setCompany(estadoAnterior => {
            return {
                ...estadoAnterior,
                uf
            }
        })
    }

    const navigate = useNavigate()
    const adicionarCnpj = () => {
        http.post('api/company/store', company)
        .then((response) => {
            if(response.success)
            {
                dadosUsuario()
                .then((response) => {
                    if(response.success)
                    {
                        setCompanies(response.data.companies)
                        toast.current.show({ severity: 'info', summary: 'Sucesso', detail: response.message, life: 3000 });
                        navegar('/')
                    }
                })
            }
        })
        .catch(erro => {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: response.message, life: 3000 });
        })
    }
    
    const ChangeCep = (value) => 
    {
        setCep(value)
        if(value.length > 8)
        {
            axios.get(`https://viacep.com.br/ws/${value.replace('-', '')}/json`)
            .then((response) => {
                if(response.data)
                {
                    setLogradouro(response.data.logradouro)
                    setBairro(response.data.bairro)
                    setCidade(response.data.localidade)
                    setUf(response.data.uf)
                }
            })
        }
    }

    const sendData = (evento) => {
        evento.preventDefault()

        document.querySelectorAll('input').forEach(function(element) {
            if(element.value !== '' && (!element.classList.contains('not_required')))
            {
                if(classError.includes(element.name))
                {
                    setClassError(classError.filter(item => item !== element.name))
                }
            }
            else
            {
                if(!classError.includes(element.name))
                {
                    setClassError(estadoAnterior => [...estadoAnterior, element.name])
                }
            }
        })

        if(document.querySelectorAll("form .error").length === 0)
        {
            adicionarCnpj()
        }
    }

    return (
       <form>
            <Titulo>
                <h6>Empresa</h6>
            </Titulo>
            <Col12>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError}
                        patternMask={['99.999.999/9999-99']}
                        name="cnpj" 
                        valor={company.cnpj} 
                        setValor={setCnpj} 
                        type="text" 
                        label="CNPJ" 
                        placeholder="Digite o CNPJ" />
                </Col6>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        name="social_reason" 
                        valor={company.social_reason} 
                        setValor={setRazaoSocial} 
                        type="text" 
                        label="Razão Social" 
                        placeholder="Digite a Razão Social" />
                </Col6>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        name="name" 
                        valor={company.trade_name} 
                        setValor={setNomeFantasia} 
                        type="text" 
                        label="Nome Fantasia" 
                        placeholder="Digite o Nome Fantasia" />
                </Col6>
            </Col12>
            <Col12>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError}
                        patternMask={['99999999-9']}
                        name="municipal_registration" 
                        valor={company.municipal_registration} 
                        setValor={setInscricaoMunicipal} 
                        type="text" 
                        label="Inscrição Municipal" 
                        placeholder="Digite a Inscrição Municipal" />
                </Col6>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError}
                        patternMask={['999.999.999.999']}
                        name="state_registration" 
                        valor={company.state_registration} 
                        setValor={setInscricaoEstadual} 
                        type="text" 
                        label="Inscrição Estadual" 
                        placeholder="Digite a Inscrição Estadual" />
                </Col6>
            </Col12>
            <Titulo>
                <h6>Endereço da Empresa</h6>
            </Titulo>
            
            <Col12 >
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        patternMask={['99999-999']} 
                        name="address_postal_code" 
                        valor={company.address_postal_code} 
                        setValor={ChangeCep} 
                        type="text" 
                        label="CEP" 
                        placeholder="Digite o CEP da Empresa" />
                </Col6>
            </Col12>
            <Col12>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        name="address_street" 
                        valor={company.address_street} 
                        setValor={setLogradouro} 
                        type="text" 
                        label="Logradouro" 
                        placeholder="Digite o address_street da Empresa" />
                </Col6>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        name="address_district" 
                        valor={company.address_district} 
                        setValor={setBairro} 
                        type="text" 
                        label="Bairro" 
                        placeholder="Digite o address_district da Empresa" />
                </Col6>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        name="address_number" 
                        valor={company.address_number} 
                        setValor={setNumero} 
                        type="text" 
                        label="Número" 
                        placeholder="Digite o número da Empresa" />
                </Col6>
                <Col6>
                    <CampoTexto 
                        name="address_complement" 
                        valor={company.address_complement} 
                        setValor={setComplemento} 
                        type="text" 
                        label="Complemento (opcional)" 
                        placeholder="Digite o address_complement da Empresa" />
                </Col6>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        name="address_city" 
                        valor={company.address_city} 
                        setValor={setCidade} 
                        type="text" 
                        label="Cidade" 
                        placeholder="Digite a address_city da Empresa" />
                </Col6>
                <Col6>
                    <DropdownItens camposVazios={classError} valor={company.address_state} setValor={setUf} options={estados} label="UF" name="address_state" placeholder="Digite a UF da Empresa"/>
                </Col6>
            </Col12>
            <ContainerButton>
                <Botao aoClicar={() => navigate(-1)} estilo="neutro" formMethod="dialog" size="medium" filled>Cancelar</Botao>
                <Botao aoClicar={(evento) => sendData(evento)} estilo="vermilion" size="medium" filled>Adicionar Empresa</Botao>
            </ContainerButton>
       </form>
    )
}

export default AdicionarCnpj