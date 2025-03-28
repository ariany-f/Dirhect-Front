import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import BotaoVoltar from "@components/BotaoVoltar"
import BotaoGrupo from "@components/BotaoGrupo"
import BotaoSemBorda from "@components/BotaoSemBorda"
import Botao from "@components/Botao"
import Titulo from "@components/Titulo"
import Frame from "@components/Frame"
import BadgeGeral from "@components/BadgeGeral"
import FrameVertical from "@components/FrameVertical"
import Container from "@components/Container"
import styles from './Colaboradores.module.css'
import { Skeleton } from 'primereact/skeleton'
import { FaTrash } from 'react-icons/fa'
import { Toast } from 'primereact/toast'
import http from '@http'
import { useEffect, useRef, useState } from 'react'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { addLocale } from 'primereact/api'
import { Tag } from 'primereact/tag';
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario';
import { RiGasStationFill, RiShoppingCartFill } from 'react-icons/ri';
import { MdOutlineFastfood } from 'react-icons/md';

function ColaboradorDetalhes() {

    let { id } = useParams()
    const location = useLocation();
    const [colaborador, setColaborador] = useState(null)
    const navegar = useNavigate()
    const toast = useRef(null)

    const {usuario} = useSessaoUsuarioContext()

    addLocale('pt', {
        accept: 'Sim',
        reject: 'Não'
    })

    useEffect(() => {
        if(!colaborador)
        {
            http.get(`funcionario/${id}/?format=json`)
                .then(response => {
                    setColaborador(response);
                })
                .catch(erro => console.log(erro))
        }
        
    }, [colaborador])

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

    function representativSituacaoTemplate() {
        let situacao = colaborador?.situacao;
        
        switch(colaborador?.situacao)
        {
            case 'A':
                situacao = <Tag severity="success" value="Ativo"></Tag>;
                break;
            case 'F':
                situacao = <Tag severity="primary" value="Férias"></Tag>;
                break;
            case 'P':
                situacao = <Tag severity="danger" value="Previdência"></Tag>;
                break;
            case 'I':
                situacao = <Tag severity="warning" value="Invalidez"></Tag>;
                break;
            case 'D':
                situacao = <Tag severity="warning" value="Demitido"></Tag>;
                break;
        }
        return situacao
    }

    return (
        <Frame>
            <Toast ref={toast} />
            <ConfirmDialog />
            <Container gap="32px">
                    {colaborador && usuario.public_id != colaborador?.id && 
                        <BotaoVoltar linkFixo="/colaborador" />
                    }
                    {colaborador && colaborador?.funcionario_pessoa_fisica?.nome ? 
                        <BotaoGrupo align="space-between">
                            <Titulo align="left">
                                <FrameVertical gap="10px">
                                    <h3>{colaborador?.funcionario_pessoa_fisica?.nome}</h3>
                                    {representativSituacaoTemplate()}
                                </FrameVertical>
                            </Titulo>
                            <BotaoSemBorda $color="var(--primaria)">
                                <FaTrash /><Link onClick={desativarColaborador}>Desativar colaborador</Link>
                            </BotaoSemBorda>
                     </BotaoGrupo>
                    : <Skeleton variant="rectangular" width={300} height={40} />
                    }
                    <FrameVertical gap="16px" alinhamento="left">
                        <BadgeGeral weight={500} severity="success" nomeBeneficio={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <RiShoppingCartFill size={20} />
                                <div>
                                Alimentação <br/>
                                R$ 150,00
                                </div>
                            </div>
                        }  />
                        <BadgeGeral weight={500} severity="success" nomeBeneficio={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <MdOutlineFastfood size={20} />
                                <div>
                                Refeição <br/>
                                R$ 550,00
                                </div>
                            </div>
                        }  />
                        <BadgeGeral weight={500} severity="neutro" nomeBeneficio={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <RiGasStationFill size={20} />
                                <div>
                                Combustível <br/>
                                R$ 350,00
                                </div>
                            </div>
                        }  />
                    </FrameVertical>
                <BotaoGrupo>
                    <Link className={styles.link} to={`/colaborador/detalhes/${id}`}>
                        <Botao estilo={location.pathname == `/colaborador/detalhes/${id}` ? 'black':''} size="small" tab>Dados Pessoais</Botao>
                    </Link>
                    {/* <Link className={styles.link} to={`/colaborador/detalhes/${id}/saldo`}>
                        <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/saldo` ? 'black':''} size="small" tab>Saldo em benefícios</Botao>
                    </Link> */}
                    <Link className={styles.link} to={`/colaborador/detalhes/${id}/dependentes`}>
                    <Botao 
                        estilo={location.pathname.startsWith(`/colaborador/detalhes/${id}/dependentes`) ? 'black' : ''} 
                        size="small" 
                        tab
                    >
                        Dependentes
                    </Botao>
                </Link>
                    <Link className={styles.link} to={`/colaborador/detalhes/${id}/ferias`}>
                        <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/ferias` ? 'black':''} size="small" tab>Férias</Botao>
                    </Link>
                    <Link className={styles.link} to={`/colaborador/detalhes/${id}/ausencias`}>
                        <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/ausencias` ? 'black':''} size="small" tab>Ausências</Botao>
                    </Link>
                    <Link className={styles.link} to={`/colaborador/detalhes/${id}/demissoes`}>
                        <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/demissoes` ? 'black':''} size="small" tab>Demissões</Botao>
                    </Link>
                    {(usuario.tipo == 'cliente' || usuario.tipo == 'equipeFolhaPagamento') &&
                        <>
                        <Link className={styles.link} to={`/colaborador/detalhes/${id}/ciclos`}>
                            <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/ciclos` ? 'black':''} size="small" tab>Ciclos de Folha</Botao>
                        </Link>
                        <Link className={styles.link} to={`/colaborador/detalhes/${id}/esocial`}>
                            <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/esocial` ? 'black':''} size="small" tab>ESocial</Botao>
                        </Link>
                        </>
                    }

                    {(usuario.tipo == 'equipeBeneficios') && 
                        <>
                            <Link className={styles.link} to={`/colaborador/detalhes/${id}/pedidos`}>
                                <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/pedidos` ? 'black':''} size="small" tab>Pedidos</Botao>
                            </Link>
                            <Link className={styles.link} to={`/colaborador/detalhes/${id}/movimentos`}>
                                <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/movimentos` ? 'black':''} size="small" tab>Movimentos</Botao>
                            </Link>
                        </>
                    }
                    

                    {/* <Link className={styles.link} to={`/colaborador/detalhes/${id}/carteiras`}>
                        <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/carteiras` ? 'black':''} size="small" tab>Carteiras</Botao>
                    </Link> */}
                </BotaoGrupo>
                <Outlet context={colaborador}/>
            </Container>
        </Frame>
    )
}

export default ColaboradorDetalhes