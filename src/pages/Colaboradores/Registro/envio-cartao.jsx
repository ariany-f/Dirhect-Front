import CampoTexto from "@components/CampoTexto"
import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Titulo from "@components/Titulo"
import Texto from "@components/Texto"
import SubTitulo from "@components/SubTitulo"
import DropdownItens from '@components/DropdownItens'
import CardText from '@components/CardText'
import RadioButton from '@components/RadioButton'
import { useState, useEffect } from "react"
import http from '@http'
import styles from './Registro.module.css'
import styled from "styled-components"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { MdLocalShipping } from "react-icons/md"
import { useColaboradorContext } from "../../../contexts/Colaborador"
 
const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`

const Col6 = styled.div`
    padding: 20px;
    flex: 1 1 50%;
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

const CardLine = styled.div`
    padding: 16px 6px;
    border-bottom: 1px solid var(--neutro-200);
    width: 100%;
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: start;
    &:nth-child(1) {
        padding-top: 8px;
    }
    &:last-of-type {
        border-bottom: none;
        padding-bottom: 8px;
    }
`

function ColaboradorEnvioCartao() {

    const navegar = useNavigate()
    const [estados, setEstados] = useState([]);
    const [classError, setClassError] = useState([])
    const [selectedAddressOption, setSelectedAddressOption] = useState(1)

    const { 
        colaborador,
        setRequestedCardEnum,
        setAnotherAddressPostalCode,
        setAnotherAddressStreet,
        setAnotherAddressNumber,
        setAnotherAddressComplement,
        setAnotherAddressDistrict,
        setAnotherAddressCity,
        setAnotherAddressState,
    } = useColaboradorContext()
    
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
            adicionarDadosEnvioCartao()
        }
    }

    const adicionarDadosEnvioCartao = () => {

       navegar('/colaborador/registro/bandeira-cartao')
    }
    
    function handleChange(valor)
    {
        setSelectedAddressOption(valor)
        setRequestedCardEnum(valor)
        setAnotherAddressPostalCode('')
        setAnotherAddressStreet('')
        setAnotherAddressNumber('')
        setAnotherAddressComplement('')
        setAnotherAddressDistrict('')
        setAnotherAddressCity('')
        setAnotherAddressState('')
    }

    const ChangeCep = (value) => 
    {
        setAnotherAddressPostalCode(value)
        if(value.length > 8)
        {
            axios.get(`https://viacep.com.br/ws/${value.replace('-', '')}/json`)
            .then((response) => {
                console.log(response)
                if(response.data)
                {
                    setAnotherAddressStreet(response.data.logradouro)
                    setAnotherAddressDistrict(response.data.bairro)
                    setAnotherAddressCity(response.data.localidade)
                    setAnotherAddressState(response.data.uf)
                }
            })
        }
    }

    return (
        <form>
            <Frame estilo="spaced">
                <Titulo>
                    <h6>Envio de cartão</h6>
                    <SubTitulo>
                        Escolha onde quer receber o cartão:
                    </SubTitulo>
                </Titulo>
            </Frame>
            <Frame>
                <div className={styles.card_dashboard}>
                    <CardLine>
                        <RadioButton top="0" value={1} checked={selectedAddressOption === 1} onSelected={() => handleChange(1)}/>
                        <Link>
                            <Texto aoClicar={() => handleChange(1)} size="14px" weight={700}>Enviar para minha empresa</Texto>
                        </Link>
                    </CardLine>
                    
                    <CardLine>
                        <RadioButton top="0" value={2} checked={selectedAddressOption === 2} onSelected={() => handleChange(2)}/>
                        <Link>
                            <Texto aoClicar={() => handleChange(2)} size="14px" weight={700}>Enviar para o endereço do colaborador</Texto>
                        </Link>
                    </CardLine>
                    
                    <CardLine>
                        <RadioButton top="0" value={3} checked={selectedAddressOption === 3} onSelected={() => handleChange(2)}/>
                        <Link>
                            <Texto aoClicar={() => handleChange(3)} size="14px" weight={700}>Enviar para outro endereço</Texto>
                        </Link>
                    </CardLine>
                </div>
                <CardText gap="4px" padding="16px" background="var(--alert-success-50)">
                    <Texto color="var(--alert-success)" weight={700} ><MdLocalShipping className="icon" />&nbsp;Frete Grátis</Texto>
                    <p className={styles.subtitulo}>Receba seu cartão com frete grátis e aproveite todas as vantagens!</p>
                </CardText>
            </Frame>
            {selectedAddressOption && selectedAddressOption === 3 &&
                <>
                    <Frame estilo="spaced">
                        <Titulo>
                            <h6>Outro endereço</h6>
                        </Titulo>
                    </Frame>
                    <Col12 >
                        <Col6>
                            <CampoTexto 
                                camposVazios={classError} 
                                patternMask={['99999-999']} 
                                name="another_address_address_postal_code" 
                                valor={colaborador.another_address_postal_code} 
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
                                name="another_address_address_street" 
                                valor={colaborador.another_address_street} 
                                setValor={setAnotherAddressStreet} 
                                type="text" 
                                label="Logradouro" 
                                placeholder="Digite o another_address_street do colaborador" />
                        </Col6>
                        <Col6>
                            <CampoTexto 
                                camposVazios={classError} 
                                name="another_address_address_district" 
                                valor={colaborador.another_address_district} 
                                setValor={setAnotherAddressDistrict} 
                                type="text" 
                                label="Bairro" 
                                placeholder="Digite o Bairro do colaborador" />
                        </Col6>
                        <Col6>
                            <CampoTexto 
                                camposVazios={classError} 
                                name="another_address_address_number" 
                                valor={colaborador.another_address_number} 
                                setValor={setAnotherAddressNumber} 
                                type="text" 
                                label="Número" 
                                placeholder="Digite o número do colaborador" />
                        </Col6>
                        <Col6>
                            <CampoTexto 
                                name="another_address_address_complement" 
                                valor={colaborador.another_address_complement} 
                                setValor={setAnotherAddressComplement} 
                                type="text" 
                                label="Complemento (opcional)" 
                                placeholder="Digite o another_address_complement do colaborador" />
                        </Col6>
                        <Col6>
                            <CampoTexto 
                                camposVazios={classError} 
                                name="another_address_address_city" 
                                valor={colaborador.another_address_city} 
                                setValor={setAnotherAddressCity} 
                                type="text" 
                                label="Cidade" 
                                placeholder="Digite a another_address_city do colaborador" />
                        </Col6>
                        <Col6>
                            <DropdownItens camposVazios={classError} valor={colaborador.another_address_state} setValor={setAnotherAddressState} options={estados} label="UF" name="another_address_address_state" placeholder="Digite a UF do colaborador"/>
                        </Col6>
                    </Col12>
                </>
            }
            <ContainerButton>
                <Botao aoClicar={() => navegar(-1)} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
                <Botao aoClicar={(evento) => sendData(evento)} estilo="vermilion" size="medium" filled>Continuar</Botao>
            </ContainerButton>
        </form>
    )
}

export default ColaboradorEnvioCartao