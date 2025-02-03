import http from '@http'
import { useEffect, useState } from "react"
import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import { GrAddCircle } from 'react-icons/gr'
import styles from './SaldoLivre.module.css'
import styled from "styled-components"
import { Link, useOutletContext } from "react-router-dom"
import QuestionCard from '@components/QuestionCard'
import Management from '@assets/Management.svg'
import { AiFillQuestionCircle } from 'react-icons/ai'
import DataTableDependentes from '../../components/DataTableDependentes'

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

function DependentesListagem() {

    const [dependentes, setDependentes] = useState(null)
    const context = useOutletContext()
    
    useEffect(() => {
        if(context && (!dependentes))
        {
            setDependentes(context)
        }
    }, [dependentes, context])

    
    return (
        <ConteudoFrame>
            <BotaoGrupo align="end">
                <BotaoGrupo>
                    <Link to="/linhas-transporte/adicionar-detalhes">
                        <Botao estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> Adicionar Dependente</Botao>
                    </Link>
                </BotaoGrupo>
            </BotaoGrupo>
            <QuestionCard alinhamento="end" element={<AiFillQuestionCircle className="question-icon" size={18} />}>
                <Link to={'/linhas-transporte/como-funciona'} style={{fontSize: '14px', marginLeft: '8px'}}>Como funciona?</Link>
            </QuestionCard>
            {
                dependentes ?
                <DataTableDependentes dependentes={dependentes} />
                :
                <ContainerSemRegistro>
                    <section className={styles.container}>
                        <img src={Management} />
                        <h6>Não há dependentes registrados</h6>
                        <p>Aqui você verá todos os dependentes registradas.</p>
                    </section>
                </ContainerSemRegistro>
            }

        </ConteudoFrame>
    )
}

export default DependentesListagem