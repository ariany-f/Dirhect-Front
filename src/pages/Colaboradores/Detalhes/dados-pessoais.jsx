import { useEffect, useState } from "react"
import http from '@http'
import Titulo from '@components/Titulo'
import { useParams } from "react-router-dom"
import styles from '@components/DashboardCard/DashboardCard.module.css'
import { Skeleton } from 'primereact/skeleton'

function ColaboradorDadosPessoais() {

    let { id } = useParams()
    const [colaborador, setColaborador] = useState({})

    useEffect(() => {
        http.get(`api/dashboard/collaborator/${id}`)
            .then(response => {
                if(response.collaborator)
                {
                    setColaborador(response.collaborator)
                }
            })
            .catch(erro => console.log(erro))
    }, [])

    return (
        <>
            <Titulo><h6>Informações gerais</h6></Titulo>
            
            <div className={styles.card_dashboard}>
                Nome completo<br/>
                {colaborador.name ? 
                    colaborador?.name
                    : <Skeleton variant="rectangular" width={200} height={25} />
                }
            </div>
        </>
    )
}

export default ColaboradorDadosPessoais