import http from '@http'
import { useEffect, useState } from 'react'
import IncompleteSteps from '@components/DashboardCard/IncompleteSteps'
import DashboardCard from '@components/DashboardCard'
import Loading from '@components/Loading'
import styled from 'styled-components'
import { useSessaoUsuarioContext } from '../../contexts/SessaoUsuario'

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

    const {
        usuarioEstaLogado
    } = useSessaoUsuarioContext()

    const [colaboradores, setColaboradores] = useState(null)
    const [loadingOpened, setLoadingOpened] = useState(true)
    const [dashboardData, setDashboardData] = useState({
            userDashResource: {
                total_benefit_balance: 0,
                notifications: null,
                name: null,
                public_id: null,
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
        if(usuarioEstaLogado)
        {
            if(!dashboardData.userDashResource.public_id)
            {
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
                    setLoadingOpened(false)
                })
            }
    
            /**
             * Pegar colaboradores
             */
            if(!colaboradores)
            {
                http.get('api/dashboard/collaborator')
                .then(response => {
                    if(response.data)
                    {
                        setColaboradores(response.data.collaborators)
                    }
                })
                .catch(erro => {
                    console.error(erro)
                    setLoadingOpened(false)
                })
            }
        }
    }, [usuarioEstaLogado])

    return (
        <>
        {usuarioEstaLogado &&
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
                <Loading opened={loadingOpened} />
            }
            </>
        }
       </>
    )
}

export default Dashboard