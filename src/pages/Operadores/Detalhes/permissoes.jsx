import { Skeleton } from 'primereact/skeleton'
import SwitchInput from '@components/SwitchInput'
import Titulo from '@components/Titulo'
import SubTitulo from '@components/SubTitulo'
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

const CardText = styled.div`
    display: flex;
    padding: 10px 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 8px;
    background: var(--info-50);
`

function OperadorPermissoes() {

    const [checkedBen, setCheckedBen] = useState(false);
    const [checkedPrem, setCheckedPrem] = useState(true);
    const [checkedClbrd, setCheckedClbrd] = useState(true);
    const [checkedDesp, setCheckedDesp] = useState(true);

    return (
        <>
            <Titulo>
                <h6>Permissões de uso</h6>
            </Titulo>
            <div className={styles.card_dashboard}>
                <CardLine>
                    <Texto weight="800">Adicionar saldo</Texto>
                    <SwitchInput checked={checkedBen} onChange={setCheckedBen} />
                </CardLine>
                <CardLine>
                    <Texto weight="800">Recarregar benefícios</Texto>
                    <SwitchInput checked={checkedPrem} onChange={setCheckedPrem} />
                </CardLine>
                <CardLine>
                    <Texto weight="800">Adicionar colaboradores</Texto>
                    <SwitchInput checked={checkedClbrd} onChange={setCheckedClbrd} />
                </CardLine>
                <CardLine>
                    <Texto weight="800">Controle de despesas</Texto>
                    <SwitchInput checked={checkedDesp} onChange={setCheckedDesp} />
                </CardLine>
            </div>
        </>
    )
}

export default OperadorPermissoes