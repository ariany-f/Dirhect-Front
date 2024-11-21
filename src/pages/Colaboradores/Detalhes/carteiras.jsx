import { Skeleton } from 'primereact/skeleton'
import SwitchInput from '@components/SwitchInput'
import Titulo from '@components/Titulo'
import SubTitulo from '@components/SubTitulo'
import CardText from '@components/CardText'
import Texto from '@components/Texto'
import styles from './Detalhes.module.css'
import styled from "styled-components"
import { useState } from 'react'
import { Link } from 'react-router-dom'

const CardLine = styled.div`
    padding: 24px 0px;
    border-bottom: 1px solid var(--neutro-200);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:nth-child(1) {
        padding-top: 8px;
    }
    &:last-of-type {
        border-bottom: none;
        padding-bottom: 8px;
    }
`

function ColaboradorCarteiras() {

    const [checkedBen, setCheckedBen] = useState(false);
    const [checkedPrem, setCheckedPrem] = useState(true);
    const [checkedDesp, setCheckedDesp] = useState(true);

    return (
        <>
            <Titulo>
                <h6>Carteiras</h6>
                <SubTitulo>Você pode ativar ou desativar as carteiras do seu colaborador</SubTitulo>
            </Titulo>
            <CardText background="var(--info-50)">
                <SubTitulo>O colaborador escolhe qual saldo quer utilizar selecionando o tipo de carteira em seu aplicativo.</SubTitulo>
            </CardText>
            <div className={styles.card_dashboard}>
                <CardLine>
                    <Texto weight="800">Benefícios</Texto>
                    {checkedBen ? 
                        <Texto weight="700" color="var(--primaria)">Ativo</Texto>
                    : <Texto weight="700">Fixo</Texto>
                    }
                    <SwitchInput checked={checkedBen} onChange={setCheckedBen} />
                </CardLine>
                <CardLine>
                    <Texto weight="800">Premiações</Texto>
                    {checkedPrem ? 
                        <Texto weight="700" color="var(--primaria)">Ativo</Texto>
                    : <Texto weight="700">Fixo</Texto>
                    }
                    <SwitchInput checked={checkedPrem} onChange={setCheckedPrem} />
                </CardLine>
                <CardLine>
                    <Texto weight="800">Despesas</Texto>
                    {checkedDesp ? 
                        <Texto weight="700" color="var(--primaria)">Ativo</Texto>
                    : <Texto weight="700">Fixo</Texto>
                    }
                    <SwitchInput checked={checkedDesp} onChange={setCheckedDesp} />
                </CardLine>
            </div>
        </>
    )
}

export default ColaboradorCarteiras