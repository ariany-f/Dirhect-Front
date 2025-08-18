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
import ModalDepartamentoAdicionarBeneficio from '@components/ModalDepartamentoAdicionarBeneficio'
import ModalConfigurarBeneficios from '../../../components/ModalConfigurarBeneficios'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

function EstruturaColaboradorDetalhes() {

    let { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [colaborador, setColaborador] = useState(null)
    const [modalBeneficioOpened, setModalBeneficioOpened] = useState(false)
    const location = useLocation()
    const navegar = useNavigate()
    const toast = useRef(null)

    useEffect(() => {
        if(!colaborador) {
            http.get(`funcionario/${id}/?format=json`)
            .then(response => {
                setColaborador(response)
            })
            .catch(erro => console.log(erro))
        }
    }, [colaborador])

    const excluirColaborador = () => {
        confirmDialog({
            message: 'Você quer excluir esse colaborador?',
            header: 'Deletar',
            icon: 'pi pi-info-circle',
            accept: () => {
                setLoading(true)
                http.delete(`api/funcionario/destroy/${id}`)
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

    function enviarNovaConfiguracao(configuracao) {
        const data = {
            contrato_item:	configuracao.contrato_item,
            entidade_id_origem:	id,
            entidade_tipo: "funcionario"
        };
         http.post(`matriz_eligibilidade/`, data)
        .then(response => {
            setModalBeneficioOpened(false)
            setColaborador(null)
        })
        .catch(erro => console.log(erro))
    }
   
    return (
        <ConteudoFrame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <ConfirmDialog  />
            <BotaoVoltar linkFixo="/elegibilidade" />
            <Texto weight={500} size="12px">Colaborador</Texto>
            {colaborador?.funcionario_pessoa_fisica?.nome ?
                <BotaoGrupo align="space-between">
                    <Titulo>
                        <h3>{colaborador.funcionario_pessoa_fisica.nome}</h3>
                    </Titulo>
                    <BotaoSemBorda $color="var(--error)">
                        {/* <FaTrash /><Link onClick={excluirColaborador} className={styles.link}>Excluir Colaborador</Link> */}
                    </BotaoSemBorda>
                </BotaoGrupo>
            : <Skeleton variant="rectangular" width={300} height={35} />
            }
            <BotaoGrupo align="space-between">
                <BotaoGrupo>
                    <Link to={`/estrutura/colaborador/detalhes/${id}`}>
                        <Botao estilo={location.pathname == `/estrutura/colaborador/detalhes/${id}`?'black':''} size="small" tab>Configuração de Benefícios</Botao>
                    </Link>
                </BotaoGrupo>
                
                {location.pathname == `/estrutura/colaborador/detalhes/${id}` &&
                    <BotaoGrupo align="center">
                        {/* <QuestionCard color="var(--neutro-500)" alinhamento="start" element={<small>Porque configurar os benefícios?</small>}>
                            <AiFillQuestionCircle className="question-icon" size={20} />
                        </QuestionCard> */}
                        {/* <Botao aoClicar={() => setModalBeneficioOpened(true)} estilo="vermilion" size="small"><GrAddCircle className={styles.icon}/>Adicionar benefício</Botao> */}
                    </BotaoGrupo>
                }
            </BotaoGrupo>
            <Outlet />
            
            <ModalConfigurarBeneficios opened={modalBeneficioOpened} aoFechar={() => setModalBeneficioOpened(false)} aoSalvar={enviarNovaConfiguracao} />
            {/* <ModalDepartamentoAdicionarBeneficio aoFechar={() => setModalBeneficioOpened(false)} opened={modalBeneficioOpened} /> */}
        </ConteudoFrame>
    )
}

export default EstruturaColaboradorDetalhes
