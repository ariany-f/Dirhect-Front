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
import { useColaboradorContext } from "../../../contexts/Colaborador"
 
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

function ColaboradorDadosIniciais() {

    const navegar = useNavigate()
    const [estados, setEstados] = useState([]);
    const [classError, setClassError] = useState([])
    const navigate = useNavigate();

    const { 
        colaborador,
        setName,
        setEmail,
        setDocument,
        setDateBirth,
        setPhoneNumber,
        setAddressPostalCode,
        setAddressStreet,
        setAdicionarDepartamento,
        setAddressNumber,
        setAddressComplement,
        setAddressDistrict,
        setAddressCity,
        setAddressState,
        setSolicitarCartao,
        setDepartments,
        submeterUsuario
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
            adicionarColaborador()
        }
    }

    const adicionarColaborador = () => {
        if(colaborador.solicitar_cartao)
        {
            navegar('/colaborador/registro/envio-cartao')
        }
        else
        {
            submeterUsuario()
        }       
    }

    const ChangeCep = (value) => 
    {
        setAddressPostalCode(value)
        axios.get(`https://viacep.com.br/ws/${value.replace('-', '')}/json`)
        .then((response) => {
            if(response.data)
            {
                setAddressStreet(response.data.logradouro)
                setAddressDistrict(response.data.bairro)
                setAddressCity(response.data.localidade)
                setAddressState(response.data.uf)
            }
        })
    }

    const testeFuncaoDepartamentos = (valor) => {
        setDepartments(valor)
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
                        valor={colaborador.document} 
                        setValor={setDocument} 
                        type="text" 
                        label="CPF" 
                        placeholder="Digite o CPF do colaborador" />
                </Col6>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        name="name" 
                        valor={colaborador.name} 
                        setValor={setName} 
                        type="text" 
                        label="Nome do colaborador" 
                        placeholder="Digite o name completo do colaborador" />
                </Col6>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        name="email" 
                        valor={colaborador.email} 
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
                        valor={colaborador.phone_number} 
                        setValor={setPhoneNumber} 
                        type="text" 
                        label="Celular do colaborador" 
                        placeholder="Digite o telefone do colaborador" />
                </Col6>
            </Col12>
            <Col12>
                <Col6>
                    <CheckboxContainer name="remember" valor={colaborador.adicionar_departamento} setValor={setAdicionarDepartamento} label="Adicionar esse colaborador em um departamento" />
                </Col6>
            </Col12>
            {colaborador.adicionar_departamento &&
                <>
                    <Frame estilo="spaced">
                        <Titulo>
                            <h6>Departamento</h6>
                        </Titulo>
                    </Frame>
                    <DepartamentosRecentes setValor={testeFuncaoDepartamentos} />
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
                        valor={colaborador.address_postal_code} 
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
                        valor={colaborador.address_street} 
                        setValor={setAddressStreet} 
                        type="text" 
                        label="Logradouro" 
                        placeholder="Digite o address_street do colaborador" />
                </Col6>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        name="address_district" 
                        valor={colaborador.address_district} 
                        setValor={setAddressDistrict} 
                        type="text" 
                        label="Bairro" 
                        placeholder="Digite o Bairro do colaborador" />
                </Col6>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        name="address_number" 
                        valor={colaborador.address_number} 
                        setValor={setAddressNumber} 
                        type="text" 
                        label="Número" 
                        placeholder="Digite o número do colaborador" />
                </Col6>
                <Col6>
                    <CampoTexto 
                        name="address_complement" 
                        valor={colaborador.address_complement} 
                        setValor={setAddressComplement} 
                        type="text" 
                        label="Complemento (opcional)" 
                        placeholder="Digite o address_complement do colaborador" />
                </Col6>
                <Col6>
                    <CampoTexto 
                        camposVazios={classError} 
                        name="address_city" 
                        valor={colaborador.address_city} 
                        setValor={setAddressCity} 
                        type="text" 
                        label="Cidade" 
                        placeholder="Digite a address_city do colaborador" />
                </Col6>
                <Col6>
                    <DropdownItens camposVazios={classError} valor={colaborador.address_state} setValor={setAddressState} options={estados} label="UF" name="address_state" placeholder="Digite a UF do colaborador"/>
                </Col6>
                <Col6>
                    <div className={styles.ladoALado}>
                        <Texto weight={700}>Solicitar cartão para o colaborador</Texto>
                        <SwitchInput checked={colaborador.solicitar_cartao} onChange={setSolicitarCartao} />
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

export default ColaboradorDadosIniciais