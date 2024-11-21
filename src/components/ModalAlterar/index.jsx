import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import DropdownItens from '@components/DropdownItens'
import Titulo from "@components/Titulo"
import { RiCloseFill } from 'react-icons/ri'
import http from '@http'
import { useEffect, useState } from "react"
import styled from "styled-components"
import styles from './ModalAlterar.module.css'
import axios from "axios"

const Overlay = styled.div`
    background-color: rgba(0,0,0,0.80);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`

const DialogEstilizado = styled.dialog`
    display: flex;
    width: 40vw;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    border: none;
    margin: 0 auto;
    top: 22vh;
    padding: 24px;
    & button.close {
        & .fechar {
            box-sizing: initial;
            fill: var(--primaria);
            stroke: var(--primaria);
            color: var(--primaria);
        }
        position: absolute;
        right: 20px;
        top: 20px;
        cursor: pointer;
        border: none;
        background-color: initial;
    }
    & .icon {
        margin-right: 5px;
        box-sizing: initial;
        fill: var(--primaria);
        stroke: var(--primaria);
        color: var(--primaria);
    }
    & .frame:nth-of-type(1) {
        gap: 24px;
        & .frame {
            margin-bottom: 24px;
            & p{
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            & b {
                font-weight: 800;
                font-size: 14px;
            }
        }
    }
`

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
            address_state: address_state
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
                <DialogEstilizado id="modal-add-departamento" open={opened}>
                    <Frame>
                        <Titulo>
                             <form method="dialog">
                                <button className="close" onClick={fecharModal} formMethod="dialog">
                                    <RiCloseFill size={20} className="fechar" />  
                                </button>
                            </form>
                            <h6>Alterar Dados</h6>
                        </Titulo>
                    </Frame>
                    <Frame padding="24px 0px">
                        <div style={{height: '35vh', overflowY: 'scroll', flexWrap: 'wrap'}}>
                            <Col12 >
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
                                        placeholder="Digite o address_street do colaborador" />
                                </Col6>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        name="address_district" 
                                        valor={address_district} 
                                        setValor={setAddressDistrict} 
                                        type="text" 
                                        label="Bairro" 
                                        placeholder="Digite o Bairro do colaborador" />
                                </Col6>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        name="address_number" 
                                        valor={address_number} 
                                        setValor={setAddressNumber} 
                                        type="text" 
                                        label="Número" 
                                        placeholder="Digite o número do colaborador" />
                                </Col6>
                                <Col6>
                                    <CampoTexto 
                                        name="address_complement" 
                                        valor={address_complement} 
                                        setValor={setAddressComplement} 
                                        type="text" 
                                        label="Complemento (opcional)" 
                                        placeholder="Digite o address_complement do colaborador" />
                                </Col6>
                                <Col6>
                                    <CampoTexto 
                                        camposVazios={classError} 
                                        name="address_city" 
                                        valor={address_city} 
                                        setValor={setAddressCity} 
                                        type="text" 
                                        label="Cidade" 
                                        placeholder="Digite a address_city do colaborador" />
                                </Col6>
                                <Col6>
                                    <DropdownItens camposVazios={classError} valor={address_state} setValor={setAddressState} options={estados} label="UF" name="address_state" placeholder="Digite a UF do colaborador"/>
                                </Col6>
                            </Col12>
                        </div>
                    </Frame>
                    <form method="dialog">
                        <div className={styles.containerBottom}>
                            <Botao aoClicar={fecharModal} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
                            <Botao aoClicar={salvarDados} estilo="vermilion" size="medium" filled>Salvar</Botao>
                        </div>
                    </form>
                </DialogEstilizado>
            </Overlay>}
        </>
    )
}

export default ModalAlterar