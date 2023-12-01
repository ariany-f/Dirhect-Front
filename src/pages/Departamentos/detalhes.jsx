import http from '@http'
import { useEffect, useState } from "react";
import { useParams, Link, useLocation, Outlet } from 'react-router-dom'
import ModalAdicionarDepartamento from '@components/ModalAdicionarDepartamento'
import BotaoVoltar from "@components/BotaoVoltar"
import BotaoGrupo from "@components/BotaoGrupo"
import QuestionCard from "@components/QuestionCard"
import BotaoSemBorda from "@components/BotaoSemBorda"
import Botao from "@components/Botao"
import styled from 'styled-components'
import Texto from "@components/Texto"
import Titulo from "@components/Titulo"
import { Skeleton } from 'primereact/skeleton'
import { FaTrash } from 'react-icons/fa'
import styles from './Departamento.module.css'
import { AiFillQuestionCircle } from 'react-icons/ai'
import { GrAddCircle } from 'react-icons/gr'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`

function DepartamentoDetalhes() {

    let { id } = useParams()
    const [departamento, setDepartamento] = useState(null)
    const [modalOpened, setModalOpened] = useState(false)
    const location = useLocation();

    useEffect(() => {
        http.get(`api/dashboard/department/${id}`)
            .then(response => {
                if(response.status === 'success')
                {
                    setDepartamento(response.department)
                }
            })
            .catch(erro => console.log(erro))
    }, [])
   
    return (
        <ConteudoFrame>
            <BotaoVoltar linkFixo={`/departamento`} />
            <Texto weight={500} size="12px">Departamento</Texto>
            {departamento ?
                <BotaoGrupo align="space-between">
                    <Titulo>
                        <h3>{departamento.name}</h3>
                    </Titulo>
                    <BotaoSemBorda $color="var(--error)">
                        <FaTrash /><Link className={styles.link}>Excluir Departamento</Link>
                    </BotaoSemBorda>
                </BotaoGrupo>
            : <Skeleton variant="rectangular" width={300} height={60} />
            }
            <BotaoGrupo align="space-between">
                <BotaoGrupo>
                    <Link to={`/departamento/detalhes/${id}`}>
                        <Botao estilo={location.pathname == `/departamento/detalhes/${id}`?'black':''} size="small" tab>Colaboradores</Botao>
                    </Link>
                    <Link to={`/departamento/detalhes/${id}/configuracao-beneficios`}>
                        <Botao estilo={location.pathname == `/departamento/detalhes/${id}/configuracao-beneficios`?'black':''} size="small" tab>Configuração de Benefícios</Botao>
                    </Link>
                </BotaoGrupo>
                <BotaoGrupo>
                    <QuestionCard color="var(--neutro-500)" alinhamento="start" element={<small>Porque configurar os benefícios?</small>}>
                        <AiFillQuestionCircle className="question-icon" size={20} />
                    </QuestionCard>
                    <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small"><GrAddCircle className={styles.icon}/>Adicionar benefício</Botao>
                </BotaoGrupo>
            </BotaoGrupo>
            <Outlet />
            <ModalAdicionarDepartamento aoFechar={() => setModalOpened(false)} opened={modalOpened} />
        </ConteudoFrame>
    )
}

export default DepartamentoDetalhes