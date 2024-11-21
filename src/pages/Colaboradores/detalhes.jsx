import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import BotaoVoltar from "@components/BotaoVoltar"
import BotaoGrupo from "@components/BotaoGrupo"
import BotaoSemBorda from "@components/BotaoSemBorda"
import Botao from "@components/Botao"
import Titulo from "@components/Titulo"
import Frame from "@components/Frame"
import Container from "@components/Container"
import styles from './Colaboradores.module.css'
import { Skeleton } from 'primereact/skeleton'
import { FaTrash } from 'react-icons/fa'
import { Toast } from 'primereact/toast'
import http from '@http'
import { useEffect, useRef, useState } from 'react'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { addLocale } from 'primereact/api'

function ColaboradorDetalhes() {

    let { id } = useParams()
    const location = useLocation();
    const [colaborador, setColaborador] = useState({})
    const navegar = useNavigate()
    const toast = useRef(null)

    addLocale('pt', {
        accept: 'Sim',
        reject: 'Não'
    })

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

    const desativarColaborador = () => {
        confirmDialog({
            message: 'Você quer desativar esse colaborador?',
            header: 'Desativar',
            icon: 'pi pi-info-circle',
            accept: () => {
                http.delete(`api/dashboard/collaborator/${id}`)
                .then(response => {
                    if(response.status === 'success')
                    {
                        toast.current.show({ severity: 'info', summary: 'Sucesso', detail: response.message, life: 3000 });
                        navegar('/colaborador')
                    }
                })
                .catch(erro => console.log(erro))
            },
            reject: () => {

            },
        });
    }

    return (
        <Frame>
            <Toast ref={toast} />
            <ConfirmDialog />
            <Container gap="32px">
                <BotaoVoltar linkFixo="/colaborador" />
                    {colaborador.name ? 
                        <BotaoGrupo align="space-between">
                            <Titulo>
                                <h3>{colaborador.name}</h3>
                            </Titulo>
                            <BotaoSemBorda $color="var(--primaria)">
                                <FaTrash /><Link onClick={desativarColaborador}>Desativar colaborador</Link>
                            </BotaoSemBorda>
                     </BotaoGrupo>
                    : <Skeleton variant="rectangular" width={300} height={40} />
                    }
                <BotaoGrupo>
                    <Link className={styles.link} to={`/colaborador/detalhes/${id}`}>
                        <Botao estilo={location.pathname == `/colaborador/detalhes/${id}` ? 'black':''} size="small" tab>Dados Pessoais</Botao>
                    </Link>
                    <Link className={styles.link} to={`/colaborador/detalhes/${id}/cartoes`}>
                        <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/cartoes` ? 'black':''} size="small" tab>Cartões</Botao>
                    </Link>
                    <Link className={styles.link} to={`/colaborador/detalhes/${id}/saldo`}>
                        <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/saldo` ? 'black':''} size="small" tab>Saldo em benefícios</Botao>
                    </Link>
                    <Link className={styles.link} to={`/colaborador/detalhes/${id}/carteiras`}>
                        <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/carteiras` ? 'black':''} size="small" tab>Carteiras</Botao>
                    </Link>
                </BotaoGrupo>
                <Outlet/>
            </Container>
        </Frame>
    )
}

export default ColaboradorDetalhes