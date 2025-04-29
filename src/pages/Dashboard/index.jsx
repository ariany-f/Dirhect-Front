import http from '@http'
import { useEffect, useState } from 'react'
import IncompleteSteps from '@components/DashboardCard/IncompleteSteps'
import DashboardCard from '@components/DashboardCard'
import Loading from '@components/Loading'
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario'

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