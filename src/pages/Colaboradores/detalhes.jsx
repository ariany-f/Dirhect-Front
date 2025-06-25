import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import BotaoVoltar from "@components/BotaoVoltar"
import BotaoGrupo from "@components/BotaoGrupo"
import BotaoSemBorda from "@components/BotaoSemBorda"
import Texto from "@components/Texto"
import Botao from "@components/Botao"
import Titulo from "@components/Titulo"
import Frame from "@components/Frame"
import BadgeGeral from "@components/BadgeGeral"
import FrameVertical from "@components/FrameVertical"
import ContainerHorizontal from "@components/ContainerHorizontal"
import Container from "@components/Container"
import styles from './Colaboradores.module.css'
import { Skeleton } from 'primereact/skeleton'
import { FaCopy, FaTrash, FaUserTimes } from 'react-icons/fa'
import { IoMdFemale, IoMdMale } from "react-icons/io";
import { Toast } from 'primereact/toast'
import http from '@http'
import { useEffect, useRef, useState } from 'react'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { addLocale } from 'primereact/api'
import { Tag } from 'primereact/tag';
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario';
import { RiFileCopy2Line, RiGasStationFill, RiShoppingCartFill } from 'react-icons/ri';
import { MdOutlineFastfood } from 'react-icons/md';
import { IoCopyOutline } from 'react-icons/io5';
import styled from 'styled-components';
import { BiFemale, BiMale } from 'react-icons/bi';
import { ArmazenadorToken } from '@utils';
import ModalDemissao from '@components/ModalDemissao';
import { TiUserDelete } from "react-icons/ti";


const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
    
    @media screen and (max-width: 768px) {
        flex-direction: column;
        gap: 16px;
    }
`;

const Col6 = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;
    flex: 1 1 calc(50% - 10px);
    gap: 8px;

    @media screen and (max-width: 768px) {
        flex: 1 1 100%;
        padding: 0;
    }
`;

const Col12Vertical = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 30px;
    flex-wrap: wrap;
    width: 100%;
    gap: 15px;
    justify-content: space-between;

    @media screen and (max-width: 768px) {
        flex-direction: column;
        margin-top: 16px;
        flex-direction: column-reverse;
    }
`;

const Col4Vertical = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1 1 calc(25% - 15px);
    max-width: calc(25% - 15px);
    gap: 8px;
    border: 1px solid var(--neutro-200);
    border-radius: 16px;
    padding: 5px 24px;

    @media screen and (max-width: 768px) {
        flex: 1 1 100%;
        max-width: 100%;
        order: 2;
    }
`;

const Col8Vertical = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1 1 calc(75% - 15px);
    max-width: calc(75% - 15px);
    gap: 16px;

    @media screen and (max-width: 768px) {
        flex: 1 1 100%;
        max-width: 100%;
        order: 1;
    }
`;

const BeneficiosContainer = styled(FrameVertical)`
    @media screen and (max-width: 768px) {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: flex-start;

        & > div {
            flex: 1 1 calc(50% - 4px);
            min-width: calc(50% - 4px);
        }
    }

    @media screen and (max-width: 480px) {
        & > div {
            flex: 1 1 100%;
        }
    }
`;

const HeaderContainer = styled(Container)`
    @media screen and (max-width: 768px) {
        & h3 {
            font-size: 1.2rem;
        }
    }
`;

function ColaboradorDetalhes() {

    let { id } = useParams()
    const location = useLocation();
    const [colaborador, setColaborador] = useState(null)
    const [filial, setFilial] = useState(null)
    const [funcao, setFuncao] = useState(null)
    const [secao, setSecao] = useState(null)
    const [tipoFuncionario, setTipoFuncionario] = useState(null)
    const [tipoSituacao, setTipoSituacao] = useState(null)
    const [departamento, setDepartamento] = useState(null)
    const [centroCusto, setCentroCusto] = useState(null)
    const [modalDemissaoAberto, setModalDemissaoAberto] = useState(false);
    const navegar = useNavigate()
    const toast = useRef(null)

    const {usuario} = useSessaoUsuarioContext()

    addLocale('pt', {
        accept: 'Sim',
        reject: 'Não'
    })

    const handleSalvarDemissao = (dadosDemissao) => {
        http.post(`funcionario/${id}/solicita_demissao/`, {
            ...dadosDemissao
        })
        .then(() => {
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Solicitação de demissão enviada com sucesso!', life: 3000 });
            setModalDemissaoAberto(false);
            // Re-fetch collaborator data to update status
            http.get(`funcionario/${id}/?format=json`)
                .then(response => {
                    setColaborador(response);
                });
        })
        .catch(erro => {
            console.error("Erro ao enviar solicitação de demissão", erro);
            const errorMessage = erro.response?.data?.detail || 'Falha ao enviar solicitação de demissão.';
            toast.current.show({ severity: 'error', summary: 'Erro', detail: errorMessage, life: 3000 });
        });
    };

    useEffect(() => {
        if(!colaborador)
        {
            http.get(`funcionario/${id}/?format=json`)
                .then(response => {
                    setColaborador(response);
                    setTipoFuncionario(response.tipo_funcionario_descricao);
                    setTipoSituacao(response.tipo_situacao_descricao);
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
        let situacao = colaborador?.tipo_situacao_descricao;
        let cor = colaborador?.tipo_situacao_cor_tag;
        
        situacao = <Tag severity={null} style={{backgroundColor: cor}} value={situacao}></Tag>;
        return situacao
    }

    function formataCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    function copiarTexto(texto) {
        navigator.clipboard.writeText(texto);
        toast.current.show({ severity: 'info', summary: '', detail: 'Texto copiado para a área de transferência.', life: 2000 });
    }

    function representativeGeneroTemplate() {
        let genero = colaborador?.genero_descricao ?? colaborador?.funcionario_pessoa_fisica?.sexo;
        switch(genero)
        {
            case 'Masculino':
            case 'M':
                genero = <IoMdMale size={16} fill='var(--info)'/>;
                break;
            case 'Feminino':
            case 'F':
                genero = <IoMdFemale size={16} fill='var(--error)'/>;
                break;
            default:
                genero = '';
        }
        return genero
    }

    const formatarCPF = (cpf) => {
        if (!cpf) return 'CPF não informado';
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    return (
        <Frame>
            <Toast ref={toast} />
            <ConfirmDialog />
            
            {/* Botão voltar acima do header */}
            {colaborador?.funcionario_pessoa_fisica?.nome && (
                <div style={{ marginBottom: '16px' }}>
                    <BotaoVoltar linkFixo="/colaborador" />
                </div>
            )}
            
            {/* Header com informações do colaborador - similar ao da admissão */}
            {colaborador?.funcionario_pessoa_fisica && (
                <div style={{
                    background: 'linear-gradient(to bottom, #0c004c, #5d0b62)',
                    borderRadius: 8,
                    padding: '12px 16px',
                    marginBottom: 0,
                    marginRight: '-24px', // Compensa o padding do Frame
                    color: '#fff',
                    boxShadow: '0 2px 8px rgba(12, 0, 76, 0.3)',
                    position: 'sticky',
                    top: 0,
                    width: '100%'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 10
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10
                        }}>
                            <div style={{
                                width: 36,
                                height: 36,
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 16,
                                fontWeight: 500,
                                color: '#fff'
                            }}>
                                {colaborador.funcionario_pessoa_fisica.nome?.charAt(0)?.toUpperCase() || 'C'}
                            </div>
                            <div>
                                <h2 style={{
                                    margin: 0,
                                    fontSize: 16,
                                    fontWeight: 700,
                                    color: '#fff',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                }}>
                                    {colaborador.chapa} - {colaborador.funcionario_pessoa_fisica.nome}
                                </h2>
                                <p style={{
                                    margin: 0,
                                    fontSize: 12,
                                    color: '#fff',
                                    opacity: 0.9,
                                    fontWeight: 400
                                }}>
                                    CPF: {formatarCPF(colaborador.funcionario_pessoa_fisica.cpf)}
                                </p>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                background: 'rgba(255, 255, 255, 0.15)',
                                padding: '4px 8px',
                                borderRadius: 6,
                                backdropFilter: 'blur(10px)'
                            }}>
                                <span style={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: '#fff',
                                    opacity: 0.9
                                }}>
                                    Status:
                                </span>
                                <span style={{
                                    background: colaborador.tipo_situacao_descricao === 'Ativo' ? '#4CAF50' : '#FF9800',
                                    color: '#fff',
                                    padding: '4px 8px',
                                    borderRadius: 12,
                                    fontSize: 11,
                                    fontWeight: 400,
                                    textTransform: 'capitalize'
                                }}>
                                    {colaborador.tipo_situacao_descricao || 'Status não informado'}
                                </span>
                            </div>
                            
                            {colaborador?.tipo_situacao_descricao == 'Ativo' && (
                                <Botao aoClicar={() => setModalDemissaoAberto(true)} estilo="vermilion" size="small">
                                    <FaUserTimes fill='var(--white)' size={16} style={{marginRight: '8px'}} /> 
                                    Solicitar Demissão
                                </Botao>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Conteúdo original simplificado */}
            <HeaderContainer gap="24px" alinhamento="space-between">
                {!colaborador?.funcionario_pessoa_fisica?.nome && (
                    <>
                        <Skeleton variant="rectangular" width={'70%'} height={'20%'} />
                        <ContainerHorizontal gap="16px" align="start">
                            <Skeleton variant="rectangular" width={'50%'} height={40} />
                            <Skeleton variant="rectangular" width={70} height={30} />
                        </ContainerHorizontal>
                    </>
                )}
            </HeaderContainer>
            <Col12Vertical>
                {colaborador && colaborador?.funcionario_pessoa_fisica?.nome ? 
                    <Col4Vertical>
                    <div style={{marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                        <Frame gap="2px" alinhamento="start">
                            <Texto size={'14px'} weight={600}>Nome Social</Texto>
                            <div style={{display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'end'}}>
                                {/* {colaborador?.funcionario_pessoa_fisica?.sexo == 'M' ? <BiMale size={20}/> : <BiFemale size={20}/>} */}
                                {representativeGeneroTemplate()}
                                <div style={{display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'end'}}>
                                    <Texto size={'14px'}>{colaborador?.funcionario_pessoa_fisica?.nome_social}</Texto>
                                    <IoCopyOutline size={10} className={styles.copyIcon} onClick={() => {copiarTexto(colaborador?.funcionario_pessoa_fisica?.nome_social)}} />
                                </div>
                            </div>
                        </Frame>
                    
                        <Frame gap="2px" alinhamento="start">
                            <Texto size={'14px'} weight={600}>CPF</Texto>
                            <div style={{display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'end'}}>
                                <Texto size={'14px'}>{formataCPF(colaborador?.funcionario_pessoa_fisica?.cpf)}</Texto>
                                <IoCopyOutline size={10} className={styles.copyIcon} onClick={() => {copiarTexto(colaborador?.funcionario_pessoa_fisica?.cpf)}} />
                            </div>
                        </Frame>
                    
                        <Frame gap="2px" alinhamento="start">
                            <Texto size={'14px'} weight={600}>Nascimento</Texto>
                            <div style={{display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'end'}}>
                                <Texto size={'14px'}>{new Date(colaborador?.funcionario_pessoa_fisica?.data_nascimento).toLocaleDateString('pt-BR')}</Texto>
                                <IoCopyOutline size={10} className={styles.copyIcon} onClick={() => {copiarTexto(new Date(colaborador?.funcionario_pessoa_fisica?.data_nascimento).toLocaleDateString('pt-BR'))}} />
                            </div>
                        </Frame>
                        
                        
                        <Frame gap="2px" alinhamento="start">
                            <Texto size={'14px'} weight={600}>Filial</Texto>
                            <div style={{display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'end'}}>
                                <Tag severity="info" value={colaborador?.filial_nome ?? 'Não definida'}></Tag>
                            </div>
                        </Frame>
                        
                        <Frame gap="2px" alinhamento="start">
                            <Texto size={'14px'} weight={600}>Função</Texto>
                            <div style={{display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'end'}}>
                                <Tag severity="info" value={colaborador?.funcao_nome ?? 'Não definida'}></Tag>
                            </div>
                        </Frame>
                        
                        <Frame gap="2px" alinhamento="start">
                            <Texto size={'14px'} weight={600}>Tipo de Funcionário</Texto>
                            <div style={{display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'end'}}>
                                <Tag severity="info" value={tipoFuncionario ?? 'Não definida'}></Tag>
                            </div>
                        </Frame>
                 </div>
                 </Col4Vertical>
                : <Skeleton variant="rectangular" width={'23%'} height={420} />
                }
                {colaborador && colaborador?.funcionario_pessoa_fisica?.nome ? 
                <Col8Vertical>
                <BotaoGrupo tabs gap="8px">
                    <Link className={styles.link} to={`/colaborador/detalhes/${id}`}>
                        <Botao estilo={location.pathname == `/colaborador/detalhes/${id}` ? 'black':''} size="small" tab>Benefícios</Botao>
                    </Link>
                    <Link className={styles.link} to={`/colaborador/detalhes/${id}/dados-contratuais`}>
                        <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/dados-contratuais` ? 'black':''} size="small" tab>Dados Contratuais</Botao>
                    </Link>
                    <Link className={styles.link} to={`/colaborador/detalhes/${id}/dados-pessoais`}>
                        <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/dados-pessoais` ? 'black':''} size="small" tab>Dados Pessoais</Botao>
                    </Link>
                    {ArmazenadorToken.hasPermission('view_dependente') &&
                    <Link className={styles.link} to={`/colaborador/detalhes/${id}/dependentes`}>
                        <Botao 
                            estilo={location.pathname.startsWith(`/colaborador/detalhes/${id}/dependentes`) ? 'black' : ''} 
                            size="small" 
                            tab
                        >
                            Dependentes
                        </Botao>
                    </Link>}
                    <Link className={styles.link} to={`/colaborador/detalhes/${id}/ferias`}>
                        <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/ferias` ? 'black':''} size="small" tab>Férias</Botao>
                    </Link>
                    <Link className={styles.link} to={`/colaborador/detalhes/${id}/ausencias`}>
                        <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/ausencias` ? 'black':''} size="small" tab>Ausências</Botao>
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

                    {(usuario.tipo == 'grupo_rh' || usuario.tipo == 'global') && 
                        <>
                            <Link className={styles.link} to={`/colaborador/detalhes/${id}/pedidos`}>
                                <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/pedidos` ? 'black':''} size="small" tab>Pedidos</Botao>
                            </Link>
                            <Link className={styles.link} to={`/colaborador/detalhes/${id}/movimentos`}>
                                <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/movimentos` ? 'black':''} size="small" tab>Movimentos</Botao>
                            </Link>
                        </>
                    }
                </BotaoGrupo>
                <Outlet context={colaborador}/>
            </Col8Vertical>
            : <Container gap="8px">
                    <Skeleton variant="rectangular" width={'100%'} height={30} />
                    <Skeleton variant="rectangular" width={'100%'} height={420} />
                </Container>
            }
        </Col12Vertical>
        <ModalDemissao 
            opened={modalDemissaoAberto}
            aoFechar={() => setModalDemissaoAberto(false)}
            colaborador={colaborador}
            aoSalvar={handleSalvarDemissao}
            mostrarColaborador={false}
        />
    </Frame>
)
}

export default ColaboradorDetalhes