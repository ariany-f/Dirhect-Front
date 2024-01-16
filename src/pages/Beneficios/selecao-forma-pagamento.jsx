import Titulo from '@components/Titulo'
import SubTitulo from '@components/SubTitulo'
import ContainerHorizontal from '@components/ContainerHorizontal'
import CheckBoxContainer from '@components/CheckBoxContainer'
import Botao from '@components/Botao'
import Texto from '@components/Texto'
import Frame from '@components/Frame'
import CardText from '@components/CardText'
import DottedLine from '@components/DottedLine'
import styles from './Beneficios.module.css'
import { useState } from 'react'
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
import RadioButton from '../../components/RadioButton'
import { FaPix, FaBarcode, FaCreditCard } from "react-icons/fa6";

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

const ContainerButton = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    & button {
        width: initial;
    }
`

function BeneficioSelecionarFormaPagamento() {
    
    const [saldoConta, setSaldoConta] = useState(false)
    const [selectedPaymentOption, setSelectedPaymentOption] = useState(1)
    const [selectedDate, setSelectedDate] = useState(1)
    const navegar = useNavigate()
    
    function handleChange(valor)
    {
        setSelectedPaymentOption(valor)
        console.log(selectedPaymentOption)
    }
    
    function handleDateChange(valor)
    {
        setSelectedDate(valor)
    }


    return (
        <Frame padding="24px 0px">
            <CardText gap="8px" padding="16px" background="var(--warning-100)">
                <p className={styles.subtitulo}>Os valores dos benefícios serão disponibilizados aos colaboradores após a confirmação de pagamento.</p>
            </CardText>
            <Titulo>
                <h6>Forma de pagamento</h6>
                <SubTitulo>Escolha uma ou mais opção de pagamento</SubTitulo>
            </Titulo>
            <div className={styles.card_dashboard}>
                <ContainerHorizontal width="50%" gap="24px" align="start" padding="16px">
                    <Frame gap="24px">
                        <CheckBoxContainer fontSize="16px" name="saldo" valor={saldoConta} setValor={setSaldoConta} label="Saldo da Conta"/>
                        <Texto>Você pode usar seus créditos em conjunto com <b>Pix, Boleto ou cartão de crédito</b>.</Texto>

                        <DottedLine margin="2px" />
                        
                    </Frame>
                    <Frame gap="24px">
                        <CardLine>
                            <RadioButton name="payment_option" top="0" value={1} checked={selectedPaymentOption === 1} onSelected={() => handleChange(1)}/>
                            <Link>
                                <Texto aoClicar={() => handleChange(1)} size="16px" weight={700}><FaPix size={20} />&nbsp;Pix</Texto>
                            </Link>
                        </CardLine>
                        
                        <CardLine>
                            <RadioButton name="payment_option" top="0" value={2} checked={selectedPaymentOption === 2} onSelected={() => handleChange(2)}/>
                            <Link>
                                <Texto aoClicar={() => handleChange(2)} size="16px" weight={700}><FaBarcode size={20} />&nbsp;Boleto Bancário</Texto>
                            </Link>
                        </CardLine>
                        
                        <CardLine>
                            <RadioButton name="payment_option" top="0" value={3} checked={selectedPaymentOption === 3} onSelected={() => handleChange(3)}/>
                            <Link>
                                <Texto aoClicar={() => handleChange(3)} size="16px" weight={700}><FaCreditCard size={20} />&nbsp;Cartão de Crédito</Texto>
                            </Link>
                        </CardLine>
                    </Frame>
                    <CardText gap="8px" padding="16px">
                        <p className={styles.subtitulo}>O tempo para confirmação de pagamento para Pix e Cartão de crédito é de até 1 hora. Transferências realizadas por boleto demoram em média 3 dias úteis.</p>
                    </CardText>
                </ContainerHorizontal>
            </div>
            <Titulo>
                <h6>Data de depósito dos benefícios</h6>
                <SubTitulo>Escolha uma data para disponibilizar os benefícios ao seus colaboradores</SubTitulo>
            </Titulo>
            
            <div className={styles.card_dashboard}>
                <ContainerHorizontal width="50%" align="start" padding="16px">
                    <Frame gap="24px">
                        <CardLine>
                            <RadioButton name="date_option" top="0" value={1} checked={selectedDate === 1} onSelected={() => handleDateChange(1)}/>
                            <Link>
                                <Texto aoClicar={() => handleDateChange(1)} size="16px" weight={700}>Pagar hoje</Texto>
                            </Link>
                        </CardLine>
                        
                        <CardLine>
                            <RadioButton name="date_option" top="0" value={2} checked={selectedDate === 2} onSelected={() => handleDateChange(2)}/>
                            <Link>
                                <Texto aoClicar={() => handleDateChange(2)} size="16px" weight={700}>Agendar pagamento</Texto>
                            </Link>
                        </CardLine>
                    </Frame>
                </ContainerHorizontal>
            </div>
            
            <ContainerButton>
                <Botao aoClicar={() => navegar(-1)} estilo="neutro" formMethod="dialog" size="medium" filled>Cancelar</Botao>
                <Botao aoClicar={(evento) => {}} estilo="vermilion" size="medium" filled>Confirmar pagamento</Botao>
            </ContainerButton>
        </Frame>
    )
}

export default BeneficioSelecionarFormaPagamento