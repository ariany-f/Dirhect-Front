import http from '@http'
import { useEffect, useState } from 'react'
import IncompleteSteps from '@components/DashboardCard/IncompleteSteps'
import DashboardCard from '@components/DashboardCard'
import Loading from '@components/Loading'
import styled from 'styled-components'
import dashboardData from '@json/dashboard_resources.json'
import collaborators from '@json/colaboradores.json'
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
                // http.get('api/auth/me')
                // .then(response => {
                //     setDashboardData(response.data)
                //     setLoadingOpened(false)
                // })
                // .then(() => {
                //     setSaldo(dashboardData.userDashResource.total_benefit_balance)
                //     setLoadingOpened(false)
                // })
                // .catch(erro => {
                //     console.error(erro)
                //     setLoadingOpened(false)
                // })
            }
    
            /**
             * Pegar colaboradores
             */
            // http.get('api/collaborator/index')
            // .then(response => {
            //     if(response.success)
            //     {
            //         setColaboradores(response.data.collaborators)
            //     }
            // })
            // .catch(erro => {
            //     console.error(erro)
            //     setLoadingOpened(false)
            // })
        }
    }, [usuarioEstaLogado])

    return (
        <>
        {/* {usuarioEstaLogado && */}
            <>
            {collaborators ?
                <>
                    {(!collaborators.length || !dashboardData.transactions.length) ? 
                        <IncompleteSteps transactions={dashboardData.transactions} colaboradores={collaborators} />
                    :
                        <DashboardCard dashboardData={dashboardData} colaboradores={collaborators} />
                    }
                </>
            :
                <Loading opened={loadingOpened} />
            }
            </>
        {/* } */}
       </>
    )
}

export default Dashboard