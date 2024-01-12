import http from '@http'
import { useEffect, useState } from "react"
import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import { GrAddCircle } from 'react-icons/gr'
import styles from './SaldoLivre.module.css'
import styled from "styled-components"
import { Link } from "react-router-dom"
import DataTablePremiacoes from '@components/DataTablePremiacoes'
import QuestionCard from '@components/QuestionCard'
import Management from '@assets/Management.svg'
import { AiFillQuestionCircle } from 'react-icons/ai'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`

const ContainerSemRegistro = styled.div`
    display: flex;
    padding: 96px 12px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 48px;
    width: 100%;
    text-align: center;
    & p {
        margin: 0 auto;
    }

    & h6 {
        width: 60%;
    }
`

function Premiacoes() {

    const [premiacoes, setPremiacoes] = useState([])
    
    useEffect(() => {
        if(!premiacoes.length)
        {
            http.get('api/dashboard/award')
            .then(response => {
                console.log(response)
                if(response.data.award.length)
                {
                    setPremiacoes(response.data.award)
                }
            })
            .catch(erro => console.log(erro))
        }
    }, [])

    
    return (
        <ConteudoFrame>
            <BotaoGrupo align="end">
                <BotaoGrupo>
                    <Link to="/saldo-livre/selecao-tipo-recarga">
                        <Botao estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Adicionar Saldo Livre</Botao>
                    </Link>
                </BotaoGrupo>
            </BotaoGrupo>
            <QuestionCard alinhamento="end" element={<AiFillQuestionCircle className="question-icon" size={18} />}>
                <Link to={'/saldo-livre/como-funciona'} style={{fontSize: '14px', marginLeft: '8px'}}>Como funciona?</Link>
            </QuestionCard>
            {
                premiacoes.length ?
                <DataTablePremiacoes premiacoes={premiacoes} />
                :
                
                <ContainerSemRegistro>
                    <section className={styles.container}>
                        <img src={Management} />
                        <h6>Você não configurou nenhum benefício para esse departamento</h6>
                        <p>Aqui você verá todos os benefícios configurados.</p>
                    </section>
                </ContainerSemRegistro>
            }

        </ConteudoFrame>
    )
}

export default Premiacoes