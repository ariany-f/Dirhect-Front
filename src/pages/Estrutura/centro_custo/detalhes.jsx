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
import '@pages/Estrutura/Detalhes.css'
import styles from '@pages/Estrutura/Departamento.module.css'
import { AiFillQuestionCircle } from 'react-icons/ai'
import { GrAddCircle } from 'react-icons/gr'
import Loading from '@components/Loading'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { addLocale } from 'primereact/api'
import ModalDepartamentoAdicionarBeneficio from '@components/ModalDepartamentoAdicionarBeneficio'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

function CentroCustoDetalhes() {

    let { id } = useParams()
    const [loading, setLoading] = useState(false)
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
        if(!departamento) {
            http.get(`centro_custo/${id}/?format=json`)
            .then(response => {
                setDepartamento(response)
            })
            .catch(erro => console.log(erro))
        }
    }, [departamento])

    const excluirDepartamento = () => {
        confirmDialog({
            message: 'Você quer excluir esse centro de custo?',
            header: 'Deletar',
            icon: 'pi pi-info-circle',
            accept: () => {
                setLoading(true)
                http.delete(`api/department/destroy/${id}`)
                .then(response => {
                   if(response.success)
                    {
                        toast.current.show({ severity: 'info', summary: 'Sucesso', detail: response.message, life: 3000 });
                        navegar('/estrutura')
                    }
                })
                .catch(erro => {
                    console.log(erro)
                })
                .finally(function() {
                    setLoading(false)
                });
            },
            reject: () => {

            },
        });
    }
   
    return (
        <ConteudoFrame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <ConfirmDialog />
            <BotaoVoltar linkFixo="/elegibilidade" />
            <Texto weight={500} size="12px">Centro de Custo</Texto>
            {departamento?.nome ?
                <BotaoGrupo align="space-between">
                    <Titulo>
                        <h3>{departamento.nome}</h3>
                    </Titulo>
                    <BotaoSemBorda $color="var(--error)">
                        {/* <FaTrash /><Link onClick={excluirDepartamento} className={styles.link}>Excluir Centro de Custo</Link> */}
                    </BotaoSemBorda>
                </BotaoGrupo>
            : <Skeleton variant="rectangular" width={300} height={35} />
            }
            <BotaoGrupo align="space-between">
                    <Link to={`/estrutura/centro_custo/detalhes/${id}`}>
                        <Botao estilo={location.pathname == `/estrutura/centro_custo/detalhes/${id}`?'black':''} size="small" tab>Configuração de Benefícios</Botao>
                    </Link>
                <BotaoGrupo>
                    <Link to={`/estrutura/centro_custo/detalhes/${id}/adicionar-colaboradores`}>
                        <Botao estilo={location.pathname == `/estrutura/centro_custo/detalhes/${id}/adicionar-colaboradores`?'black':''} size="small" tab>Colaboradores</Botao>
                    </Link>
                </BotaoGrupo>
                
                {location.pathname == `/estrutura/centro_custo/detalhes/${id}/adicionar-colaboradores` &&
                  <></>
                }
                {location.pathname == `/estrutura/centro_custo/detalhes/${id}` &&
                    <BotaoGrupo align="center">
                        {/* <QuestionCard color="var(--neutro-500)" alinhamento="start" element={<small>Porque configurar os benefícios?</small>}>
                            <AiFillQuestionCircle className="question-icon" size={20} />
                        </QuestionCard> */}
                        {/* <Botao aoClicar={() => setModalBeneficioOpened(true)} estilo="vermilion" size="small"><GrAddCircle className={styles.icon}/>Adicionar benefício</Botao> */}
                    </BotaoGrupo>
                }
            </BotaoGrupo>
            <Outlet />
            <ModalDepartamentoAdicionarBeneficio aoFechar={() => setModalBeneficioOpened(false)} opened={modalBeneficioOpened} />
        </ConteudoFrame>
    )
}

export default CentroCustoDetalhes