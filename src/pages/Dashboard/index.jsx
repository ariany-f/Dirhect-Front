import http from '@http'
import { useEffect, useState } from 'react'
import IncompleteSteps from '../../components/DashboardCard/incomplete'
import DashboardCard from '../../components/DashboardCard'
import extracts from '@json/extracts.json'
import dashboardResources from '@json/dashboard_resources.json'

function Dashboard() {

    const registerIsComplete = true
    const [colaboradores, setColaboradores] = useState([])
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
        {(!registerIsComplete) ? 
            <IncompleteSteps />
        :
            <DashboardCard dashboardData={dashboardData} colaboradores={colaboradores} />
        }
       </>
    )
}

export default Dashboard