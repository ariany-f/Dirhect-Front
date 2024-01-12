import { useRecargaSaldoLivreContext } from "../../contexts/RecargaSaldoLivre"
import http from '@http'
import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from 'react-router-dom'
import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Texto from "@components/Texto"
import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import './SelecionarColaboradores.css'
import { Toast } from 'primereact/toast'
import styled from 'styled-components'

const ContainerButton = styled.div`
    display: flex;
    width: 100%;
    padding: 20px;
    justify-content: space-between;
    & button {
        width: initial;
    }
`

const LadoALado = styled.div`
    display: flex;
    gap: 24px;
    & span {
        display: flex;
        align-items: center;
    }
`

const CardText = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 10px 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 8px;
    border:  ${ props => props.$border ?  props.$border : 'none'};
    background: ${ props => props.$background ?  props.$background : 'var(--neutro-100)'};
`

function PremiacaoDetalhes() {

    const toast = useRef(null)
    
    const {
        recarga,
        setColaboradores,
        setNome,
        setMotivo
    } = useRecargaSaldoLivreContext()
    
    return (
        <>
            <Frame>
                <Toast ref={toast} />
                <>
                    <Titulo>
                        <h5>Detalhes da recarga</h5>
                    </Titulo>
                    <CampoTexto valor={recarga.name} setValor={setNome} numeroCaracteres={50} placeholder='ex. Pagamento de Janeiro' label='Nome da Recarga' />
                    <Titulo>
                        <h5>Para que será utilizado este saldo livre?</h5>
                    </Titulo>
                    <CampoTexto valor={recarga.description} setValor={setMotivo} numeroCaracteres={50} placeholder='ex. Pagamento de Janeiro' label='Motivo da Recarga' />
                    <CardText>
                        <p>Os pagamentos feitos como prêmios devem aderir aos parâmetros definidos no artigo 457 da CLT e na Solução de Consulta COSIT nº 151/2019, com a devida atenção à retenção do Imposto de Renda.</p>
                    </CardText>
                    <CardText $border={'1px solid var(--neutro-200)'} $background={'var(--neutro-50)'}>
                        <Texto weight={700}>Para seus colaboradores</Texto>
                        <p>Os seus colaboradores podem utilizar esse saldo livre nas compras em qualquer estabelecimento que aceite bandeira Mastercard utilizando a função crédito à vista.</p>
                    </CardText>
                </>
                <ContainerButton>
                    <Botao aoClicar={() => navegar(-1)} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
                    <LadoALado>
                        <Link to="/saldo-livre/selecao-tipo-recarga">
                            <Botao aoClicar={() => {}} estilo="vermilion" size="medium" filled>Continuar</Botao>
                        </Link>
                    </LadoALado>
                </ContainerButton>
            </Frame>
        </>
    )
}

export default PremiacaoDetalhes

