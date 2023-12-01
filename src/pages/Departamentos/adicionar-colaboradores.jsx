import http from '@http'
import { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom'
import BotaoGrupo from "@components/BotaoGrupo"
import Frame from "@components/Frame"
import Texto from "@components/Texto"
import BotaoSemBorda from "@components/BotaoSemBorda"
import Titulo from "@components/Titulo"
import { Skeleton } from 'primereact/skeleton'
import { FaPencilAlt } from 'react-icons/fa'
import styles from './Departamento.module.css'

function DepartamentoAdicionarColaboradores() {

    let { id } = useParams()
    const [departamento, setDepartamento] = useState(null)

    useEffect(() => {
        http.get("api/dashboard/department/"+id)
            .then(response => {
                if(response.status === 'success')
                {
                    setDepartamento(response.department)
                }
            })
            .catch(erro => console.log(erro))
    }, [])

    const [colaboradores, setColaboradores] = useState([])

    useEffect(() => {
        http.get('api/dashboard/collaborator')
            .then(response => {
                setColaboradores(response.data.collaborators)
            })
            .catch(erro => console.log(erro))
    }, [])
   
    return (
        <Frame>
            <Texto weight={500} size="12px">Nome do departamento</Texto>
            {departamento ?
                <BotaoGrupo align="space-between">
                    <Titulo>
                        <h3>{departamento.name}</h3>
                    </Titulo>
                    <BotaoSemBorda $color="var(--error)">
                        <FaPencilAlt /><Link className={styles.link}>Editar</Link>
                    </BotaoSemBorda>
                </BotaoGrupo>
            : <Skeleton variant="rectangular" width={300} height={60} />
            }
        </Frame>
    )
}

export default DepartamentoAdicionarColaboradores