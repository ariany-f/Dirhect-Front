import Titulo from '@components/Titulo'
import SubTitulo from '@components/SubTitulo'
import ContainerHorizontal from '@components/ContainerHorizontal'
import CheckBoxContainer from '@components/CheckBoxContainer'
import Frame from '@components/Frame'
import CardText from '@components/CardText'
import styles from './Beneficios.module.css'
import { useState } from 'react'

function BeneficioSelecionarFormaPagamento() {
    
    const [saldoConta, setSaldoConta] = useState(false)

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
                <ContainerHorizontal width="50%" align="start" padding="16px">
                    <Frame gap="5px">
                        <CheckBoxContainer fontSize="16px" name="saldo" valor={saldoConta} setValor={setSaldoConta} label="Saldo da Conta"/>
                        <span>Você pode usar seus créditos em conjunto com <b>Pix, Boleto ou cartão de crédito</b>.</span>
                    </Frame>
                </ContainerHorizontal>
            </div>
        </Frame>
    )
}

export default BeneficioSelecionarFormaPagamento