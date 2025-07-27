import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import BotaoGrupo from "@components/BotaoGrupo"
import DropdownItens from '@components/DropdownItens'
import Titulo from "@components/Titulo"
import { RiCloseFill } from 'react-icons/ri'
import http from '@http'
import { useEffect, useState } from "react"
import styled from "styled-components"
import styles from './ModalAlterar.module.css'
import axios from "axios"
import { Overlay, DialogEstilizado } from '@components/Modal/styles'

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`

const Col6 = styled.div`
    padding: 10px;
    flex: 1 1 50%;
`

function ModalAlterar({ opened = false, aoClicar, aoFechar, dadoAntigo }) {
    const [alteravel, setAlteravel] = useState(dadoAntigo)
    const [classError, setClassError] = useState([])
    const [estados, setEstados] = useState([]);
    const [address, setAddress] = useState(true)

    const [address_postal_code, setAddressPostalCode] = useState('')
    const [address_street, setAddressStreet] = useState('')
    const [address_number, setAddressNumber] = useState('')
    const [address_complement, setAddressComplement] = useState('')
    const [address_district, setAddressDistrict] = useState('')
    const [address_city, setAddressCity] = useState('')
    const [address_state, setAddressState] = useState('')
    
    useEffect(() => {

        /** Preenche os inputs com os dados atuais */
        if(dadoAntigo)
        {
            setAddressPostalCode(dadoAntigo.address_postal_code)
            setAddressStreet(dadoAntigo.address_street)
            setAddressNumber(dadoAntigo.address_number)
            setAddressComplement(dadoAntigo.address_complement)
            setAddressDistrict(dadoAntigo.address_district)
            setAddressCity(dadoAntigo.address_city)
            setAddressState(dadoAntigo.address_state)
        }

        /** Preenche dropdown de estados */
        if(!estados.length)
        {
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
        }
    }, [dadoAntigo, alteravel, estados])
    
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

    const salvarDados = () => {
        let send = {
            address_postal_code: address_postal_code,
            address_street: address_street,
            address_number: address_number,
            address_complement: address_complement,
            address_district: address_district,
            address_city: address_city,
            address_state: address_state.code
        }
        aoClicar(send)
    }

    const fecharModal = () => {
        setAlteravel('')
        setAddressPostalCode('')
        setAddressStreet('')
        setAddressNumber('')
        setAddressComplement('')
        setAddressDistrict('')
        setAddressCity('')
        setAddressState('')
        aoFechar()
    }

    return(
        <>
            {opened &&
            <Overlay>
                <DialogEstilizado open={opened}>
                    <Frame>
                        <Titulo>
                            <button className="close" onClick={fecharModal}>
                                <RiCloseFill size={20} className="fechar" />  
                            </button>
                            <h6>Alterar Dados</h6>
                        </Titulo>
                    </Frame>
                    <Frame padding="24px 0px">
                        <div style={{height: '35vh', overflowY: 'scroll', flexWrap: 'wrap'}}>
                            <Col12>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        patternMask={['99999-999']} 
                                        name="address_postal_code" 
                                        valor={address_postal_code} 
                                        setValor={ChangeCep} 
                                        type="text" 
                                        label="CEP" 
                                        placeholder="Digite o CEP" />
                                </Col6>
                            </Col12>
                            <Col12>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        name="address_street" 
                                        valor={address_street} 
                                        setValor={setAddressStreet} 
                                        type="text" 
                                        label="Logradouro" 
                                        placeholder="Digite o logradouro" />
                                </Col6>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        name="address_district" 
                                        valor={address_district} 
                                        setValor={setAddressDistrict} 
                                        type="text" 
                                        label="Bairro" 
                                        placeholder="Digite o bairro" />
                                </Col6>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        name="address_number" 
                                        valor={address_number} 
                                        setValor={setAddressNumber} 
                                        type="text" 
                                        label="Número" 
                                        placeholder="Digite o número" />
                                </Col6>
                                <Col6>
                                    <CampoTexto 
                                        name="address_complement" 
                                        valor={address_complement} 
                                        setValor={setAddressComplement} 
                                        type="text" 
                                        label="Complemento (opcional)" 
                                        placeholder="Digite o complemento" />
                                </Col6>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        name="address_city" 
                                        valor={address_city} 
                                        setValor={setAddressCity} 
                                        type="text" 
                                        label="Cidade" 
                                        placeholder="Digite a cidade" />
                                </Col6>
                                <Col6>
                                    <DropdownItens
                                        camposVazios={classError}
                                        name="address_state"
                                        valor={address_state}
                                        setValor={setAddressState}
                                        options={estados}
                                        label="Estado"
                                        placeholder="Selecione o estado"
                                    />
                                </Col6>
                            </Col12>
                        </div>
                    </Frame>
                    <BotaoGrupo align="end">
                        <Botao
                            aoClicar={fecharModal} 
                            estilo="neutro" 
                            size="medium" 
                            filled
                        >
                            Cancelar
                        </Botao>
                        <Botao
                            aoClicar={salvarDados} 
                            estilo="vermilion" 
                            size="medium" 
                            filled
                        >
                            Salvar
                        </Botao>
                    </BotaoGrupo>
                </DialogEstilizado>
            </Overlay>
            }
        </>
    )
}

export default ModalAlterar