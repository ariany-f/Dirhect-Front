import SubTitulo from '@components/SubTitulo'
import Container from '@components/Container'
import BotaoSemBorda from '@components/BotaoSemBorda'
import Texto from '@components/Texto'
import Frame from '@components/Frame'
import Steps from '@components/Steps'
import styles from './../DashboardCard.module.css'
import { Skeleton } from 'primereact/skeleton'
import { useEffect, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { RiTeamFill, RiWallet3Fill } from 'react-icons/ri'
import { MdArrowCircleRight } from 'react-icons/md'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const SpacedLine = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`

const Card = styled.div`
    border: 1px solid var(--neutro-200);
    border-radius: 16px;
    display: flex;
    padding: 20px 24px;
    justify-content: start;
    align-items: start;
    align-self: stretch;
    gap: 24px;
    flex-direction: column;
    flex: 1;
    &.active {
        border: 1px solid var(--primaria);
    }
    &.inactive {
        opacity: .5;
    }
`

function IncompleteSteps({ transactions = [], colaboradores = [] }){

    const [percent, setPercent] = useState(0)
    const [step, setStep] = useState(null)

    useEffect(() => {

        if(colaboradores.length > 0)
        {
            setPercent(97)
            setStep(3)
        }
        else
        {
            setPercent(67)
            setStep(2)
        }
        
    }, [colaboradores, transactions])

    if(1 == 0) 
    {

        return (
            <Container align="start" gap="32px">
                <Frame gap="8px">
                    <SubTitulo>Ficamos muito felizes em ver você por aqui</SubTitulo>
                    {/* <Texto weight="700" size="16px">Complete as etapas de contratação!</Texto> */}
                </Frame>
                <div className={styles.percent}>
                    {percent ?
                        <h2>{percent}%</h2>
                    : <Skeleton variant="rectangular" width={100} height={50} />
                    }
                    <SpacedLine >
                        <Texto size="14px">Progresso de contratação</Texto>
                        <Texto weight="700" size="12px">{step}/3</Texto>
                    </SpacedLine>
                    {step ?
                        <Steps total={3} atual={step} />
                        : <Skeleton variant="rectangular" width={100} height={4} />
                    }
                </div>
                <div className={styles.wrapper_cards}>
                    <Card className="inactive">
                        <Texto weight="700">
                            <FaCheckCircle size={20} />&nbsp;Contratação
                        </Texto>
                        Contratação Dirhect
                    </Card>
                    <Card className={step === 2 ? 'active' : 'inactive'}>
                        <Texto weight="700">
                            <RiTeamFill size={20} />&nbsp;Cadastro de colaborados
                        </Texto>
                        Cadastre seus colaboradores.
                        {step === 2 &&
                            <BotaoSemBorda color="var(--terciaria)">
                                <Link to="/colaborador/registro" className={styles.link}>
                                    Cadastrar Colaboradores&nbsp;<MdArrowCircleRight className='icon' size={18} />
                                </Link>
                            </BotaoSemBorda>
                        }
                    </Card>
                    <Card className={step === 3 ? 'active' : ''}>
                        <Texto weight="700">
                            <RiWallet3Fill size={20} />&nbsp;Configuração de benefícios
                        </Texto>
                        Configure os benefícios para os seus colaboradores.
                        {step === 3 &&
                            <BotaoSemBorda color="var(--terciaria)">
                                <Link to={'/beneficio/selecao-tipo-recarga'} className={styles.link}>
                                    Configurar&nbsp;<MdArrowCircleRight className='icon' size={18} />
                                </Link>
                            </BotaoSemBorda>
                        }
                    </Card>
                </div>
            </Container>
        )
    }
    else
    {
        return ""
    }
}

export default IncompleteSteps