import BotaoVoltar from "@components/BotaoVoltar"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import CardText from "@components/CardText"
import Frame from "@components/Frame"
import styled from "styled-components"
import styles from './SaldoLivre.module.css'
import { LiaBirthdayCakeSolid } from "react-icons/lia"
import { FaChartLine, FaUserPlus } from "react-icons/fa";
import { TbChristmasTree } from "react-icons/tb";
import { IoGiftSharp } from "react-icons/io5";
import DottedLine from "@components/DottedLine"

const CardIcones = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;
`

const CardIcone = styled.div`
    display: flex;
    padding: 16px;
    align-items: center;
    font-weight: 700;
    width: 100%;
    gap: 24px;
    border-radius: 16px;
    border: 1px solid var(--neutro-200);
    & svg *{
        font-weight: 700;
    }
`

function PremiacaoComoFunciona() {
    return (
        <Frame>
            <BotaoVoltar/>
            <Titulo>
                <h6>Vantagens</h6>
                <SubTitulo>
                    Você pode premiar seus colaboradores em diferentes ocasiões:
                </SubTitulo>
            </Titulo>
            <CardIcones>
                <CardIcone><LiaBirthdayCakeSolid />Aniversário</CardIcone>
                <CardIcone><IoGiftSharp />Premiações</CardIcone>
                <CardIcone><FaChartLine />Meta alcançada/reconhecimento</CardIcone>
                <CardIcone><TbChristmasTree />Datas comemorativas</CardIcone>
                <CardIcone><FaUserPlus />Indicação</CardIcone>
            </CardIcones>
            <CardText background="var(--warning-50)">
                <b>Importante</b>
                <p className={styles.subtitulo}> Bonificações, comissões ou qualquer outro valor de natureza salarial não podem entrar como Saldo Livre pois não tem respaldo jurídico.</p>
            </CardText>   
            <CardText>
                <p className={styles.subtitulo}> Os pagamentos feitos como Saldo Livre podem ser considerados como prêmios que aderem aos parâmetros definidos no artigo 457 da CLT e na Solução de Consulta COSIT nº 151/2019, com a devida atenção à retenção do Imposto de Renda.</p>
            </CardText>
            <DottedLine margin="16px"/>    
            <Titulo>
                <h6>Como funciona para o colaborador</h6>
                <SubTitulo>
                    Para utilizar o Saldo Livre, o colaborador deve mudar para a carteira de Saldo Livre no seu aplicativo AQBank Multibenefícios:
                </SubTitulo>
            </Titulo>
            <CardText background="var(--warning-50)">
                <p className={styles.subtitulo}>É necessário que o colaborador tenha saldo em sua Carteira.</p>
            </CardText>  
        </Frame>
    )
}
export default PremiacaoComoFunciona