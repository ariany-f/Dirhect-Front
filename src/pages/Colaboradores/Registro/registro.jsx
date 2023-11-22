import CampoTexto from "@components/CampoTexto"
import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Titulo from "@components/Titulo"
import { useState } from "react"
import http from '@http'
import styled from "styled-components"
import { RiQuestionLine } from "react-icons/ri"
import { useNavigate } from "react-router-dom"
 
const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
`

const Col6 = styled.div`
    width: 50%;
    max-width: 50%;
    flex: 1;
    padding: 20px;
`

const QuestionCard = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 500;
    & .question-icon {
        margin-left: 8px;
        cursor: pointer;
    }
`

const ContainerButton = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    & button {
        width: initial;
    }
`

function ColaboradorRegistro() {

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
        phone_number: ''
    })

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
    const [classError, setClassError] = useState([])
    const navigate = useNavigate();

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
            adicionarColaborador()
        }
    }

    const adicionarColaborador = () => {
        
        var sendDocument = collaborator.document.replace(/[^a-zA-Z0-9 ]/g, '')

        collaborator.document = sendDocument

        http.post('api/dashboard/collaborator', collaborator)
        .then((response) => {
            console.log(response)
        })
        .catch(erro => {
            alert(erro)
            console.error(erro)
        })
    }

    return (
        <>
            <Titulo>
                <h6>Dados do Colaborador</h6>
            </Titulo>
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
                        patternMask={['99 9999 9999']} 
                        name="phone_number" 
                        valor={collaborator.phone_number} 
                        setValor={setCelular} 
                        type="text" 
                        label="Celular do colaborador" 
                        placeholder="Digite o telefone do colaborador" />
                </Col6>
            </Col12>
            <Frame estilo="spaced">
                <Titulo>
                    <h6>Endereço do Colaborador</h6>
                </Titulo>
                <QuestionCard>
                    <small>Porque precisamos do endereço?</small>
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
                        setValor={setCep} 
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
                    <CampoTexto 
                        camposVazios={classError} 
                        name="address_state" 
                        valor={collaborator.address_state} 
                        setValor={setUf} 
                        type="text" 
                        label="UF" 
                        placeholder="Digite a UF do colaborador" />
                </Col6>
            </Col12>
            <ContainerButton>
                <Botao aoClicar={() => navigate(-1)} estilo="neutro" formMethod="dialog" size="medium" filled>Cancelar</Botao>
                <Botao aoClicar={(evento) => sendData(evento)} estilo="vermilion" size="medium" filled>Adicionar Colaborador</Botao>
            </ContainerButton>
        </>
    )
}

export default ColaboradorRegistro