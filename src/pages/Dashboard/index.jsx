import http from '@http'
import { useEffect, useState } from 'react'
import IncompleteSteps from '@components/DashboardCard/IncompleteSteps'
import DashboardCard from '@components/DashboardCard'
import Loading from '@components/Loading'
import styled from 'styled-components'
import dashboardData from '@json/dashboard_resources.json'
import collaborators from '@json/colaboradores.json'
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario'

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

    useEffect(() => {
        if(usuarioEstaLogado)
        {
            /**
             * Pegar colaboradores
             */
            if((!colaboradores))
            {
                http.get('funcionario/?format=json')
                .then(response => {
                    setColaboradores(response)
                })
                .catch(erro => {
                    setLoadingOpened(false)
                })
            }
        }
    }, [usuarioEstaLogado, colaboradores])

    return (
        <>
        {colaboradores ?
            <>
                <DashboardCard colaboradores={colaboradores} />
            </>
        :
            <Loading opened={loadingOpened} />
        }
       </>
    )
}

export default Dashboard