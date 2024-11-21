import { Skeleton } from 'primereact/skeleton'
import SwitchInput from '@components/SwitchInput'
import Titulo from '@components/Titulo'
import Texto from '@components/Texto'
import styles from './Detalhes.module.css'
import styled from "styled-components"
import http from '@http'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

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

function OperadorPermissoes() {

    let { id } = useParams()
    const [checkedBen, setCheckedBen] = useState(false);
    const [checkedPrem, setCheckedPrem] = useState(false);
    const [checkedClbrd, setCheckedClbrd] = useState(false);
    const [checkedDesp, setCheckedDesp] = useState(false);

    const [operador, setOperador] = useState(null)

    useEffect(() => {
        if(!operador)
        {
            http.get(`api/dashboard/operator/${id}`)
                .then(response => {
                    if (response.status === 'success') 
                    {
                        setOperador(response.operator)
                        setCheckedBen(response.operator.roles.all || response.operator.roles.financial)
                        setCheckedPrem(response.operator.roles.all || response.operator.roles.financial)
                        setCheckedClbrd(response.operator.roles.all || response.operator.roles.human_Resources)
                        setCheckedDesp(response.operator.roles.all || response.operator.roles.financial)
                    }
                })
                .catch(erro => console.log(erro))
        }
    }, [operador])

    function alterarPermissoes(){
        const obj = {}
        
        obj['collaborator_public_id'] = id

        obj['roles'] = {
            "status": false,
            "all": (checkedBen && checkedClbrd && checkedDesp && checkedPrem),
            "read": true,
            "financial": false,
            "human_Resources": false
        }


        http.put(`api/dashboard/operator/${id}`, obj)
        .then(response => {
            if (response.status === 'success') 
            {
                setOperador(response.operator)
                setCheckedBen(response.operator.roles.all || response.operator.roles.financial)
                setCheckedPrem(response.operator.roles.all || response.operator.roles.financial)
                setCheckedClbrd(response.operator.roles.all || response.operator.roles.human_Resources)
                setCheckedDesp(response.operator.roles.all || response.operator.roles.financial)
            }
        })
        .catch(erro => console.log(erro))
    }

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