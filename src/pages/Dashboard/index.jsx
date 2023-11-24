import http from '@http'
import { useEffect, useState } from 'react'
import IncompleteSteps from '@components/DashboardCard/IncompleteSteps'
import DashboardCard from '@components/DashboardCard'
import Container from '@components/Container'
import extracts from '@json/extracts.json'
import dashboardResources from '@json/dashboard_resources.json'
import { Skeleton } from 'primereact/skeleton'
import styled from 'styled-components'

const WrapperCards = styled.div`
    display: inline-flex;
    align-items: flex-start;
    align-content: flex-start;
    gap: 24px;
    flex-wrap: wrap;
    width: 100%;
`

const CardsEmpilhados = styled.div`
    gap: 24px;
    display: flex;
    flex-direction: column;
    flex: 1;
`

function Dashboard() {

    const [colaboradores, setColaboradores] = useState(null)
    const [dashboardData, setDashboardData] = useState({
            saldo: 0,
            transactions: extracts,
            lastTransaction: dashboardResources[0].userDashResource.last_transaction
    })

    const setSaldo = (saldo) => {
        setDashboardData(estadoAnterior => {
            return {
                ...estadoAnterior,
                saldo
            }
        })
    }
    const setTransactions = (transactions) => {
        setDashboardData(estadoAnterior => {
            return {
                ...estadoAnterior,
                transactions
            }
        })
    }
    const setLastTransaction = (lastTransaction) => {
        setDashboardData(estadoAnterior => {
            return {
                ...estadoAnterior,
                lastTransaction
            }
        })
    }

    useEffect(() => {

        setSaldo(dashboardResources[0].userDashResource.total_benefit_balance)

        /**
         * Dados necessários para exibição no painel do usuário
         */
        // http.get('api/dashboard/user')
        // .then(response => {
        //     console.log(response)
        // })
        // .catch(erro => {
        //     console.error(erro)
        // })

        /**
         * Pegar colaboradores
         */
        http.get('api/dashboard/collaborator')
        .then(response => {
            if(response.data)
            {
                setColaboradores(response.data.collaborators)
            }
        })
        .catch(erro => {
            console.error(erro)
        })
    }, [])

    return (
       <>
       {colaboradores ?
        <>
            {(!colaboradores.length || !dashboardData.transactions.length) ? 
                <IncompleteSteps transactions={dashboardData.transactions} colaboradores={colaboradores} />
            :
                <DashboardCard dashboardData={dashboardData} colaboradores={colaboradores} />
            }
        </>
        :
            <Container gap="32px">
                <Skeleton variant="rectangular" width={300} height={80} />
                <WrapperCards>
                    <Skeleton variant="rectangular" width={450} height={500} />
                    <CardsEmpilhados>
                        <Skeleton variant="rectangular" width={440} height={70} />
                        <Skeleton variant="rectangular" width={440} height={270} />
                    </CardsEmpilhados>
                </WrapperCards>
            </Container>
       }
       </>
    )
}

export default Dashboard