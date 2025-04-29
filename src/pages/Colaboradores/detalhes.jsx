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
import { FaCopy, FaTrash } from 'react-icons/fa'
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

        & ${BotaoGrupo} {
            flex-wrap: wrap;
            gap: 8px;
            
            & a {
                flex: 1 1 calc(50% - 4px);
                min-width: calc(50% - 4px);
            }

            & button {
                width: 100%;
            }
        }
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
        
        & ${BadgeGeral} {
            font-size: 0.9rem;
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
        } else {
            if((!funcao) && colaborador.id_funcao)
            {
                http.get(`funcao/${colaborador.id_funcao}/?format=json`)
                    .then(response => {
                        setFuncao(response);
                    })
                    .catch(erro => console.log(erro))
            }
            if((!filial) && colaborador.filial)
            {
                http.get(`filial/${colaborador.filial}/?format=json`)
                    .then(response => {
                        setFilial(response);
                    })
                    .catch(erro => console.log(erro))
            }
            if((!secao) && colaborador.id_secao)
            {
                http.get(`secao/${colaborador.id_secao}/?format=json`)
                    .then(response => {
                        setSecao(response);
                    })
                    .catch(erro => console.log(erro))
            }
        }
        
    }, [colaborador, funcao, filial, secao])

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

    function formataCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    function copiarTexto(texto) {
        navigator.clipboard.writeText(texto);
        toast.current.show({ severity: 'info', summary: '', detail: 'Texto copiado para a área de transferência.', life: 2000 });
    }

    return (
        <Frame>
            <Toast ref={toast} />
            <ConfirmDialog />
            <HeaderContainer gap="24px" alinhamento="space-between">
                {colaborador && colaborador?.funcionario_pessoa_fisica?.nome ? 
                    <>
                        <BotaoVoltar linkFixo="/colaborador" />
                        <BotaoGrupo align="start">
                            <Titulo align="left">
                                <FrameVertical gap="10px">
                                    <h3>{colaborador?.chapa} - {colaborador?.funcionario_pessoa_fisica?.nome}</h3>
                                    {representativSituacaoTemplate()}
                                </FrameVertical>
                                {colaborador?.funcionario_pessoa_fisica && colaborador?.funcionario_pessoa_fisica.email &&
                                    <>
                                        <p>{colaborador?.funcionario_pessoa_fisica.email}</p>  
                                        <IoCopyOutline className={styles.copyIcon} onClick={() => {copiarTexto(colaborador?.funcionario_pessoa_fisica?.email)}} />
                                    </>
                                }
                            </Titulo>
                        </BotaoGrupo>
                    </>
                    : <>
                        <Skeleton variant="rectangular" width={70} height={20} />
                        <ContainerHorizontal gap="16px" align="start">
                            <Skeleton variant="rectangular" width={340} height={40} />
                            <Skeleton variant="rectangular" width={70} height={30} />
                        </ContainerHorizontal>
                    </>
                }
                {/* <BeneficiosContainer gap="16px" alinhamento="left">
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
                </BeneficiosContainer> */}
            </HeaderContainer>
            <Col12Vertical>
                    {colaborador && colaborador?.funcionario_pessoa_fisica?.nome ? 
                        <Col4Vertical>
                        <div style={{marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                            <Frame gap="2px" alinhamento="start">
                                <Texto size={'14px'} weight={600}>Nome Social</Texto>
                                <div style={{display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'end'}}>
                                    <Texto size={'14px'}>{colaborador?.funcionario_pessoa_fisica?.nome_social}</Texto>
                                    <IoCopyOutline size={10} className={styles.copyIcon} onClick={() => {copiarTexto(colaborador?.funcionario_pessoa_fisica?.nome_social)}} />
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
                                <Texto size={'14px'} weight={600}>Sexo</Texto>
                                <Texto size={'14px'}>{colaborador?.funcionario_pessoa_fisica?.sexo}</Texto>
                            </Frame>
                            <Frame gap="2px" alinhamento="start">
                                <Texto size={'14px'} weight={600}>Telefone</Texto>
                                <div style={{display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'end'}}>
                                    <Texto size={'14px'}>{colaborador?.funcionario_pessoa_fisica?.telefone1}</Texto>
                                    <IoCopyOutline size={10} className={styles.copyIcon} onClick={() => {copiarTexto(colaborador?.funcionario_pessoa_fisica?.telefone1)}} />
                                </div>
                            </Frame>
                            
                            <Frame gap="2px" alinhamento="start">
                                <Texto size={'14px'} weight={600}>Função</Texto>
                                <div style={{display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'end'}}>
                                    <Tag severity="info" value={funcao?.nome ?? 'Não definida'}></Tag>
                                </div>
                            </Frame>
                            
                            <Frame gap="2px" alinhamento="start">
                                <Texto size={'14px'} weight={600}>Seção</Texto>
                                <div style={{display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'end'}}>
                                    <Tag severity="info" value={secao?.nome ?? 'Não definida'}></Tag>
                                </div>
                            </Frame>
                            
                            <Frame gap="2px" alinhamento="start">
                                <Texto size={'14px'} weight={600}>Filial</Texto>
                                <div style={{display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'end'}}>
                                    <Tag severity="info" value={filial?.nome ?? 'Não definida'}></Tag>
                                </div>
                            </Frame>
                     </div>
                     </Col4Vertical>
                    : <Skeleton variant="rectangular" width={220} height={420} />
                    }
                    {colaborador && colaborador?.funcionario_pessoa_fisica?.nome ? 
                    <Col8Vertical>
                    <BotaoGrupo gap="8px">
                        <Link className={styles.link} to={`/colaborador/detalhes/${id}`}>
                            <Botao estilo={location.pathname == `/colaborador/detalhes/${id}` ? 'black':''} size="small" tab>Dados Contratuais</Botao>
                        </Link>
                        <Link className={styles.link} to={`/colaborador/detalhes/${id}/dados-pessoais`}>
                            <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/dados-pessoais` ? 'black':''} size="small" tab>Dados Pessoais</Botao>
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
                        {/* <Link className={styles.link} to={`/colaborador/detalhes/${id}/demissoes`}>
                            <Botao estilo={location.pathname == `/colaborador/detalhes/${id}/demissoes` ? 'black':''} size="small" tab>Demissões</Botao>
                        </Link> */}
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
                </Col8Vertical>
                : <Skeleton variant="rectangular" width={900} height={420} />
                }
            </Col12Vertical>
        </Frame>
    )
}

export default ColaboradorDetalhes