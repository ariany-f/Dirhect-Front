import http from '@http'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Container from '@components/Container'
import styles from './Extrato.module.css'
import { Skeleton } from 'primereact/skeleton'

const WrapperCards = styled.div`
    display: inline-flex;
    align-items: flex-start;
    align-content: flex-start;
    gap: 24px;
    flex-wrap: wrap;
    width: 100%;
`

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

function Extrato() {

    const [dashboardData, setDashboardData] = useState({
            userDashResource: {
                total_benefit_balance: 0,
                notifications: null,
                name: '',
                public_id: '',
                status: 1
            },
            transactions: [],
            lastTransaction: []
    })

    const setSaldo = (saldo) => {
        setDashboardData(estadoAnterior => {
            return {
                ...estadoAnterior,
                saldo
            }
        })
    }

    useEffect(() => {
        /**
         * Dados necessários para exibição no painel do usuário
         */
        http.get('api/dashboard/user')
        .then(response => {
            setDashboardData(response.data)
        })
        .then(() => {
            setSaldo(dashboardData.userDashResource.total_benefit_balance)
        })
        .catch(erro => {
            console.error(erro)
        })

    }, [])

    return (
        <Container gap="32px">
            <div className={styles.saldo}>
                <p>Saldo disponível</p>
                {dashboardData?.userDashResource.public_id ?
                    <h2>{Real.format(dashboardData?.userDashResource.total_benefit_balance)}</h2>
                : <Skeleton variant="rectangular" width={200} height={50} />
                }
            </div>
        </Container>
    )
}

export default Extrato