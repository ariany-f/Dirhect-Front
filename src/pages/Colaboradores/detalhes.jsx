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
    const [colaborador, setColaborador] = useState(null)
    const [pessoafisica, setPessoaFisica] = useState(null)
    const navegar = useNavigate()
    const toast = useRef(null)

    addLocale('pt', {
        accept: 'Sim',
        reject: 'Não'
    })

    useEffect(() => {
        if(!colaborador)
        {
            http.get('funcionario/?format=json')
                .then(response => {
                    // Busca o colaborador dentro de response
                    const colaboradorEncontrado = response.find(item => item.id == id);

                    if (colaboradorEncontrado) {
                        setColaborador(colaboradorEncontrado);
                    }
                })
                .catch(erro => console.log(erro))
        }
        
        if(colaborador && (!pessoafisica)) {
            
            http.get('pessoa_fisica/?format=json')
                .then(response => {
                    // Busca o colaborador dentro de response
                    const pessoaFisicaEncontrada = response.find(item => item.id === colaborador.id_pessoafisica);

                    if (pessoaFisicaEncontrada) {
                        setPessoaFisica(pessoaFisicaEncontrada);
                    }
                })
                .catch(erro => console.log(erro))
        }
    }, [colaborador, pessoafisica])

    const desativarColaborador = () => {
        confirmDialog({
            message: 'Você quer desativar esse colaborador?',
            header: 'Desativar',
            icon: 'pi pi-info-circle',
            accept: () => {
                http.delete(`api/collaborator/destroy/${id}`)
                .then(response => {
                   if(response.success)
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
                    {pessoafisica && pessoafisica?.nome ? 
                        <BotaoGrupo align="space-between">
                            <Titulo>
                                <h3>{pessoafisica?.nome}</h3>
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
                    {/* <Link className={styles.link} to={`/colaborador/detalhes/${id}/cartoes`}>
                        <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/cartoes` ? 'black':''} size="small" tab>Cartões</Botao>
                    </Link> */}
                    <Link className={styles.link} to={`/colaborador/detalhes/${id}/saldo`}>
                        <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/saldo` ? 'black':''} size="small" tab>Saldo em benefícios</Botao>
                    </Link>
                    <Link className={styles.link} to={`/colaborador/detalhes/${id}/dependentes`}>
                        <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/dependentes` ? 'black':''} size="small" tab>Dependentes</Botao>
                    </Link>
                    {/* <Link className={styles.link} to={`/colaborador/detalhes/${id}/carteiras`}>
                        <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/carteiras` ? 'black':''} size="small" tab>Carteiras</Botao>
                    </Link> */}
                </BotaoGrupo>
                <Outlet context={pessoafisica}/>
            </Container>
        </Frame>
    )
}

export default ColaboradorDetalhes