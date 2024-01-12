import http from '@http'
import { useEffect, useRef, useState } from "react"
import { useParams, Link, useLocation, Outlet, useNavigate } from 'react-router-dom'
import BotaoVoltar from "@components/BotaoVoltar"
import BotaoGrupo from "@components/BotaoGrupo"
import QuestionCard from "@components/QuestionCard"
import BotaoSemBorda from "@components/BotaoSemBorda"
import Botao from "@components/Botao"
import styled from 'styled-components'
import Texto from "@components/Texto"
import { Toast } from 'primereact/toast'
import Titulo from "@components/Titulo"
import { Skeleton } from 'primereact/skeleton'
import { FaTrash } from 'react-icons/fa'
import './Detalhes.css'
import styles from './Departamento.module.css'
import { AiFillQuestionCircle } from 'react-icons/ai'
import { GrAddCircle } from 'react-icons/gr'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { addLocale } from 'primereact/api'
import ModalDepartamentoAdicionarBeneficio from '@components/ModalDepartamentoAdicionarBeneficio'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

function DepartamentoDetalhes() {

    let { id } = useParams()
    const [departamento, setDepartamento] = useState(null)
    const [modalBeneficioOpened, setModalBeneficioOpened] = useState(false)
    const location = useLocation()
    const navegar = useNavigate()
    const toast = useRef(null)

    addLocale('pt', {
        accept: 'Sim',
        reject: 'Não'
    })

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

    const excluirDepartamento = () => {
        confirmDialog({
            message: 'Você quer excluir esse departamento?',
            header: 'Deletar',
            icon: 'pi pi-info-circle',
            accept: () => {
                http.delete(`api/dashboard/department/${id}`)
                .then(response => {
                    if(response.status === 'success')
                    {
                        toast.current.show({ severity: 'info', summary: 'Sucesso', detail: response.message, life: 3000 });
                        navegar('/departamento/lista')
                    }
                })
                .catch(erro => console.log(erro))
            },
            reject: () => {

            },
        });
    }
   
    return (
        <ConteudoFrame>
            <Toast ref={toast} />
            <ConfirmDialog />
            <BotaoVoltar linkFixo={`/departamento`} />
            <Texto weight={500} size="12px">Departamento</Texto>
            {departamento ?
                <BotaoGrupo align="space-between">
                    <Titulo>
                        <h3>{departamento.name}</h3>
                    </Titulo>
                    <BotaoSemBorda $color="var(--error)">
                        <FaTrash /><Link onClick={excluirDepartamento} className={styles.link}>Excluir Departamento</Link>
                    </BotaoSemBorda>
                </BotaoGrupo>
            : <Skeleton variant="rectangular" width={300} height={35} />
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
                
                {location.pathname == `/departamento/detalhes/${id}` &&
                    <BotaoGrupo>
                        <Botao aoClicar={() => navegar(`/departamento/${id}/adicionar-colaboradores`)} estilo="vermilion" size="small"><GrAddCircle className={styles.icon}/>Adicionar colaboradores</Botao>
                    </BotaoGrupo>
                }
                {location.pathname == `/departamento/detalhes/${id}/configuracao-beneficios` &&
                    <BotaoGrupo>
                        <QuestionCard color="var(--neutro-500)" alinhamento="start" element={<small>Porque configurar os benefícios?</small>}>
                            <AiFillQuestionCircle className="question-icon" size={20} />
                        </QuestionCard>
                        <Botao aoClicar={() => setModalBeneficioOpened(true)} estilo="vermilion" size="small"><GrAddCircle className={styles.icon}/>Adicionar benefício</Botao>
                    </BotaoGrupo>
                }
            </BotaoGrupo>
            <Outlet />
            <ModalDepartamentoAdicionarBeneficio aoFechar={() => setModalBeneficioOpened(false)} opened={modalBeneficioOpened} />
        </ConteudoFrame>
    )
}

export default DepartamentoDetalhes