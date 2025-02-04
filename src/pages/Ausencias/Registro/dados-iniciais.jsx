import CampoTexto from "@components/CampoTexto"
import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Titulo from "@components/Titulo"
import Texto from "@components/Texto"
import QuestionCard from '@components/QuestionCard'
import Loading from "@components/Loading"
import { useState, useRef, useEffect } from "react"
import http from '@http'
import styles from './Registro.module.css'
import styled from "styled-components"
import { RiQuestionLine } from "react-icons/ri"
import { useNavigate } from "react-router-dom"
import { Toast } from 'primereact/toast'
import axios from "axios"

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

function AusenciaDadosIniciais() {
    const navegar = useNavigate()
    const [dataInicialFerias, setDataInicialFerias] = useState('');
    const [dataFinalFerias, setDataFinalFerias] = useState('');
    const [classError, setClassError] = useState([]);
    const [estados, setEstados] = useState([])
    const [loading, setLoading] = useState(false)
    
    const toast = useRef(null)
    
    useEffect(() => {
        // if(!colaborador.public_company_id)
        // {
        //     retornarCompanySession()
        //     .then((response) => {
        //         console.log(response)
        //         if(response.success)
        //         {
        //             setCompanyPublicId(response.data.public_id)
        //         }
        //     })
        // }

        // http.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        // .then(response => {
        //      response.map((item) => {
        //          let obj = {
        //              name: item.nome,
        //              code: item.sigla
        //          }
        //          if(!estados.includes(obj))
        //          {
        //              setEstados(estadoAnterior => [...estadoAnterior, obj]);
        //          }
        //      })
        //  })
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
      
        setLoading(true)
        submeterUsuario().then(response => {
            if(response.success)
            {
                navegar('/colaborador/registro/sucesso')
            }
        }).catch((erro) => {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: erro.message })
            setLoading(false)
        })      
    }

    const ChangeCep = (value) => 
    {
        setAddressPostalCode(value)
        
        if(value.length > 8)
        {
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
    }

    
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <form onSubmit={handleSubmit}>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <Frame estilo="spaced">
                <Titulo>
                    <h6>Solicitação de Férias</h6>
                </Titulo>
            </Frame>
            <Frame alinhamento="end">
                <QuestionCard element={<small>Por que precisamos do período de férias?</small>}>
                    <RiQuestionLine className="question-icon" />
                </QuestionCard>
            </Frame>
            <Col12>
                <Col6>
                    <CampoTexto
                        camposVazios={classError}
                        name="data_inicial_ferias"
                        valor={dataInicialFerias}
                        setValor={setDataInicialFerias}
                        type="date"
                        label="Data Inicial de Férias"
                        placeholder="Selecione a data inicial"
                    />
                </Col6>
                <Col6>
                    <CampoTexto
                        camposVazios={classError}
                        name="data_final_ferias"
                        valor={dataFinalFerias}
                        setValor={setDataFinalFerias}
                        type="date"
                        label="Data Final de Férias"
                        placeholder="Selecione a data final"
                    />
                </Col6>
            </Col12>
            <ContainerButton>
                <Botao aoClicar={() => navegar('/ferias')} estilo="neutro" formMethod="dialog" size="medium" filled>Cancelar</Botao>
                <Botao aoClicar={(evento) => sendData(evento)} estilo="vermilion" size="medium" filled>Adicionar Férias</Botao>
            </ContainerButton>
        </form>
    )
}

export default AusenciaDadosIniciais