import CampoTexto from "@components/CampoTexto"
import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Titulo from "@components/Titulo"
import Texto from "@components/Texto"
import QuestionCard from '@components/QuestionCard'
import SwitchInput from '@components/SwitchInput'
import DropdownItens from '@components/DropdownItens'
import CheckboxContainer from "@components/CheckboxContainer"
import DepartamentosRecentes from "@components/DepartamentosRecentes"
import { useState, useEffect } from "react"
import http from '@http'
import styles from './Registro.module.css'
import styled from "styled-components"
import { RiQuestionLine } from "react-icons/ri"
import { useNavigate } from "react-router-dom"
import axios from "axios"
 
const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`

const Col6 = styled.div`
    padding: 20px;
    width: 455px;
`

const ContainerButton = styled.div`
    display: flex;
    width: 100%;
    padding: 20px;
    justify-content: space-between;
    & button {
        width: initial;
    }
`

function ColaboradorRegistro() {

    const navegar = useNavigate()
    const [estados, setEstados] = useState([]);
    const [classError, setClassError] = useState([])
    const navigate = useNavigate();
    
    useEffect(() => {
        http.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(response => {
             response.map((item) => {
                 let obj = {
                     name: item.nome,
                     code: item.sigla
                 }
                 if(!estados.includes(obj))
                 {
                     setEstados(estadoAnterior => [...estadoAnterior, obj]);
                 }
             })
         })
     }, [])

    const [collaborator, setCollaborator] = useState({
        requested_card_enum: 17,
        document: '',
        name: '',
        email: '',
        date_birth: '',
        departments: [],
        address_postal_code: '',
        address_street: '',
        address_district: '',
        address_number: '',
        address_complement: '',
        address_city: '',
        address_state: '',
        phone_number: '',
        solicitar_cartao: false,
        adicionar_department: false
    })

    const setAdicionarDepartment = (adicionar_department) => {
        setCollaborator(estadoAnterior => {
            return {
                ...estadoAnterior,
                adicionar_department
            }
        })
    }
    const setSolicitarCartao = (solicitar_cartao) => {
        setCollaborator(estadoAnterior => {
            return {
                ...estadoAnterior,
                solicitar_cartao
            }
        })
    }
    const setCep = (address_postal_code) => {
        setCollaborator(estadoAnterior => {
            return {
                ...estadoAnterior,
                address_postal_code
            }
        })
    }
    const setLogradouro = (address_street) => {
        setCollaborator(estadoAnterior => {
            return {
                ...estadoAnterior,
                address_street
            }
        })
    }
    const setNumero = (address_number) => {
        setCollaborator(estadoAnterior => {
            return {
                ...estadoAnterior,
                address_number
            }
        })
    }
    const setComplemento = (address_complement) => {
        setCollaborator(estadoAnterior => {
            return {
                ...estadoAnterior,
                address_complement
            }
        })
    }
    const setBairro = (address_district) => {
        setCollaborator(estadoAnterior => {
            return {
                ...estadoAnterior,
                address_district
            }
        })
    }
    const setCidade = (address_city) => {
        setCollaborator(estadoAnterior => {
            return {
                ...estadoAnterior,
                address_city
            }
        })
    }
    const setUf = (address_state) => {
        setCollaborator(estadoAnterior => {
            return {
                ...estadoAnterior,
                address_state
            }
        })
    }
    const setCelular = (phone_number) => {
        setCollaborator(estadoAnterior => {
            return {
                ...estadoAnterior,
                phone_number
            }
        })
    }
    const setEmail = (email) => {
        setCollaborator(estadoAnterior => {
            return {
                ...estadoAnterior,
                email
            }
        })
    }
    const setNome = (name) => {
        setCollaborator(estadoAnterior => {
            return {
                ...estadoAnterior,
                name
            }
        })
    }
    const setDocument = (document) => {
        setCollaborator(estadoAnterior => {
            return {
                ...estadoAnterior,
                document
            }
        })
    }
    const setDepartamentos = (departments) => {
        setCollaborator(estadoAnterior => {
            return {
                ...estadoAnterior,
                departments
            }
        })
    }

    const sendData = (evento) => {
        evento.preventDefault()

        document.querySelectorAll('input').forEach(function(element, index) {
            
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
            adicionarColaborador()
        }
    }

    const adicionarColaborador = () => {
        
        var sendDocument = collaborator.document.replace(/[^a-zA-Z0-9 ]/g, '')

        collaborator.document = sendDocument

        http.post('api/dashboard/collaborator', collaborator)
        .then((response) => {
            if(collaborator.solicitar_cartao)
            {
                // Adicionar id do colaborador para envio do cartão
                navegar("/envio-cartao")
            }
            else
            {
                navegar("/colaborador")
            }
        })
        .catch(erro => {
            alert(erro)
            console.error(erro)
        })
    }

    const ChangeCep = (value) => 
    {
        setCep(value)
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

    return (
        <form>
            <Frame estilo="spaced">
                <Titulo>
                    <h6>Dados do Colaborador</h6>
                </Titulo>
            </Frame>
            <Col12 >
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        patternMask={['999.999.999-99']} 
                        name="document" 
                        valor={collaborator.document} 
                        setValor={setDocument} 
                        type="text" 
                        label="CPF" 
                        placeholder="Digite o CPF do colaborador" />
                </Col6>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        name="name" 
                        valor={collaborator.name} 
                        setValor={setNome} 
                        type="text" 
                        label="Nome do colaborador" 
                        placeholder="Digite o name completo do colaborador" />
                </Col6>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        name="email" 
                        valor={collaborator.email} 
                        setValor={setEmail} 
                        type="email" 
                        label="Email do colaborador" 
                        placeholder="Digite o email do colaborador" />
                </Col6>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        patternMask={['99 9999-9999', '99 99999-9999']} 
                        name="phone_number" 
                        valor={collaborator.phone_number} 
                        setValor={setCelular} 
                        type="text" 
                        label="Celular do colaborador" 
                        placeholder="Digite o telefone do colaborador" />
                </Col6>
            </Col12>
            <Col12>
                <Col6>
                    <CheckboxContainer name="remember" valor={collaborator.adicionar_department} setValor={setAdicionarDepartment} label="Adicionar esse colaborador em um departamento" />
                </Col6>
            </Col12>
            {collaborator.adicionar_department &&
                <>
                    <Frame estilo="spaced">
                        <Titulo>
                            <h6>Departamento</h6>
                        </Titulo>
                    </Frame>
                    <DepartamentosRecentes setValor={setDepartamentos} />
                </>
            }
            <Frame estilo="spaced">
                <Titulo>
                    <h6>Endereço do Colaborador</h6>
                </Titulo>
                <QuestionCard element={<small>Porque precisamos do endereço?</small>}>
                    <RiQuestionLine className="question-icon" />
                </QuestionCard>
            </Frame>
            <Col12 >
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        patternMask={['99999-999']} 
                        name="address_postal_code" 
                        valor={collaborator.address_postal_code} 
                        setValor={ChangeCep} 
                        type="text" 
                        label="CEP" 
                        placeholder="Digite o CEP do colaborador" />
                </Col6>
            </Col12>
            <Col12>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        name="address_street" 
                        valor={collaborator.address_street} 
                        setValor={setLogradouro} 
                        type="text" 
                        label="Logradouro" 
                        placeholder="Digite o address_street do colaborador" />
                </Col6>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        name="address_district" 
                        valor={collaborator.address_district} 
                        setValor={setBairro} 
                        type="text" 
                        label="Bairro" 
                        placeholder="Digite o Bairro do colaborador" />
                </Col6>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        name="address_number" 
                        valor={collaborator.address_number} 
                        setValor={setNumero} 
                        type="text" 
                        label="Número" 
                        placeholder="Digite o número do colaborador" />
                </Col6>
                <Col6>
                    <CampoTexto 
                        name="address_complement" 
                        valor={collaborator.address_complement} 
                        setValor={setComplemento} 
                        type="text" 
                        label="Complemento (opcional)" 
                        placeholder="Digite o address_complement do colaborador" />
                </Col6>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        name="address_city" 
                        valor={collaborator.address_city} 
                        setValor={setCidade} 
                        type="text" 
                        label="Cidade" 
                        placeholder="Digite a address_city do colaborador" />
                </Col6>
                <Col6>
                    <DropdownItens camposVazios={classError} valor={collaborator.address_state} setValor={setUf} options={estados} label="UF" name="address_state" placeholder="Digite a UF do colaborador"/>
                </Col6>
                <Col6>
                    <div className={styles.ladoALado}>
                        <Texto weight={700}>Solicitar cartão para o colaborador</Texto>
                        <SwitchInput checked={collaborator.solicitar_cartao} onChange={setSolicitarCartao} />
                    </div>
                </Col6>
            </Col12>
            <ContainerButton>
                <Botao aoClicar={() => navigate(-1)} estilo="neutro" formMethod="dialog" size="medium" filled>Cancelar</Botao>
                <Botao aoClicar={(evento) => sendData(evento)} estilo="vermilion" size="medium" filled>Adicionar Colaborador</Botao>
            </ContainerButton>
        </form>
    )
}

export default ColaboradorRegistro