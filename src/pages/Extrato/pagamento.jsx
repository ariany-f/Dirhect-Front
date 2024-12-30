import BotaoVoltar from "@components/BotaoVoltar"
import Frame from '@components/Frame'
import Container from '@components/Container'
import BadgeStatusBeneficio from '@components/BadgeStatusBeneficio'
import ContainerHorizontal from '@components/ContainerHorizontal'
import BotaoSemBorda from '@components/BotaoSemBorda'
import BadgeBeneficio from "@components/BadgeBeneficio"
import Texto from '@components/Texto'
import Titulo from '@components/Titulo'
import BotaoGrupo from '@components/BotaoGrupo'
import Botao from '@components/Botao'
import styled from "styled-components"
import styles from './Extrato.module.css'
import { Link, useParams } from "react-router-dom"
import { RiFileCopyLine, RiSearchEyeFill  } from "react-icons/ri"
import { FaBarcode, FaPix, FaUser } from "react-icons/fa6"
import { useEffect, useState } from "react"
import http from '@http'

const CodigoDiv = styled.div`
    padding: 10px;
    border: 1px solid var(--neutro-200);
    border-radius: 8px;
    font-size: 14px;
`

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

function ExtratoPagamento() {

    const { id } = useParams()
    const [checkout, setCheckout] = useState(null)
    const [paymentType, setPaymentType] = useState('boleto')
    const benefits = [
        'Alimentação',
        'Refeição',
        'Auxílio Alimentação',
        'Mobilidade',
        'Saúde',
        'Home Office',
        'Educação',
        'Cultura'
    ]

    useEffect(() => {
        const url = `api/checkout?source=balance&&public_id=${id}`;
        // http.get(url)
        // .then((response) => {
        //     if(response.data)
        //     {
        //         setCheckout(response.data)
        //     }
        // })
        // .catch(erro => {
        //     console.error(erro)
        // })  
    }, [])

    return (
        <Frame>
            <Container gap="24px">
                <BotaoVoltar linkFixo="/extrato" />
                <div className={styles.wrapper_cards}>
                    {paymentType === 'boleto' &&
                        <Container>
                            <div className={styles.card_dashboard}>
                                <Frame estilo="spaced">
                                    <Texto weight={700}><FaBarcode/>&nbsp;Boleto Bancário</Texto>
                                </Frame>
                                <Frame estilo="spaced">
                                    <div className={styles.empilhado}>
                                        <p>Código de barras</p>
                                        <BotaoGrupo align="space-between" verticalalign="center">
                                            <Texto weight={600}>23794.15009 90033.744005 93000.211404 8 00000000000000</Texto>
                                            <BotaoGrupo>
                                                <BotaoSemBorda><RiFileCopyLine size={18}/> Copiar código</BotaoSemBorda>
                                                <Botao fontSize="14px" size="200px"><RiSearchEyeFill className={styles.icon} size={18}/>Visualizar boleto</Botao>
                                            </BotaoGrupo>
                                        </BotaoGrupo>
                                    </div>
                                </Frame>
                                <Frame estilo="spaced">
                                    <div className={styles.empilhado}>
                                        <p>Valor do boleto</p>
                                        <b>{Real.format(checkout?.item.total_amount ?? 0)}</b>
                                    </div>
                                    
                                    <div className={styles.empilhado}>
                                        <p>Data de vencimento</p>
                                        <b>14/09/2023</b>
                                    </div>
                                </Frame>
                            </div>
                            <div className={styles.card_dashboard}>
                                <Frame estilo="spaced">                                    
                                    <div className={styles.empilhado}>
                                        <p>CNPJ</p>
                                        <b>43.400.087/0001-05</b>
                                    </div>
                                    
                                    <div className={styles.empilhado}>
                                        <p>Razão social</p>
                                        <b>Soluções Industriais Ltda.</b>
                                    </div>

                                    <div className={styles.empilhado}>
                                        <p>Código da transação</p>
                                        <b>8BA1E4DF-E82C-4209-ACDB-066E29BBF2E3</b>
                                    </div>
                                </Frame>
                            </div>
                        </Container>
                    }
                     {paymentType === 'pix' &&
                        <div className={styles.card_dashboard}>
                            <Frame estilo="spaced">
                                <Texto weight={700}><FaPix className={styles.icongreen}/>&nbsp;Pix</Texto>
                            </Frame>
                            <Frame estilo="spaced">
                                <p>Você pode utilizar a câmera do seu celular para ler o QR Code ou copiar o código e pagar no aplicativo de seu banco:</p>
                            </Frame>
                            <Frame estilo="spaced">
                                QRCode
                                <div className={styles.empilhado}>
                                    <div className={styles.rightalign}>
                                        <p>00020101021226830014br.gov.bcb.pix2561api.pagseguro.com/pix/v2/E94BFC78-17C5-4FC5-A955-ABA1663FDDFD27600016BR.COM.PAGSEGURO0136E94BFC78-17C5-4FC5-A955-ABA1663FDDFD5204799453039865406350.005802BR5922PAGSEGURO TECNOLOGIA L6009Sao Paulo62070503***6304D339</p>
                                        <BotaoSemBorda><RiFileCopyLine size={18}/> Copiar código</BotaoSemBorda>
                                    </div>
                                </div>
                            </Frame>
                            <Frame estilo="spaced">
                                <div className={styles.empilhado}>
                                    <p>Valor do Pix</p>
                                    <b>{Real.format(checkout?.item.total_amount ?? 0)}</b>
                                </div>
                                
                                <div className={styles.empilhado}>
                                    <p>CNPJ</p>
                                    <b>43.400.087/0001-05</b>
                                </div>
                                
                                <div className={styles.empilhado}>
                                    <p>Razão social</p>
                                    <b>Soluções Industriais Ltda.</b>
                                </div>

                                <div className={styles.empilhado}>
                                    <p>Instituição</p>
                                    <b>Banco do Brasil</b>
                                </div>
                            </Frame>
                        </div>
                    }
                </div>
            </Container>
        </Frame>
    )
}

export default ExtratoPagamento