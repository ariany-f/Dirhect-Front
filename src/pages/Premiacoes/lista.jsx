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
import Loading from '@components/Loading'
import { AiFillQuestionCircle } from 'react-icons/ai'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
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

    const [loading, setLoading] = useState(false)
    const [premiacoes, setPremiacoes] = useState([])
    
    useEffect(() => {
        if(premiacoes.length === 0)
        {
            // setLoading(true)
            // http.get('api/dashboard/recharge/free-balance')
            // .then(response => {
            //     setLoading(false)
            //     console.log(response)
            //     if(response.data.award)
            //     {
            //         setPremiacoes(response.data.award)
            //     }
            // })
            // .catch(erro => {
            //     setLoading(false)
            // })
        }
    }, [])

    
    return (
        <ConteudoFrame>
        <Loading opened={loading} />
            <BotaoGrupo align="end">
                <BotaoGrupo>
                    <Link to="/linhas-transporte/adicionar-detalhes">
                        <Botao estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Adicionar Linha de Transporte</Botao>
                    </Link>
                </BotaoGrupo>
            </BotaoGrupo>
            <QuestionCard alinhamento="end" element={<AiFillQuestionCircle className="question-icon" size={18} />}>
                <Link to={'/linhas-transporte/como-funciona'} style={{fontSize: '14px', marginLeft: '8px'}}>Como funciona?</Link>
            </QuestionCard>
            {
                premiacoes.length ?
                <DataTablePremiacoes premiacoes={premiacoes} />
                :
                <ContainerSemRegistro>
                    <section className={styles.container}>
                        <img src={Management} />
                        <h6>Não há linhas registradas</h6>
                        <p>Aqui você verá todas as linhas registradas.</p>
                    </section>
                </ContainerSemRegistro>
            }

        </ConteudoFrame>
    )
}

export default Premiacoes