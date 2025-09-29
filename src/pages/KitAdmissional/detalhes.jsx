import styles from './Contratos.module.css'
import styled from "styled-components"
import { Link, Outlet, useLocation, useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import Texto from '@components/Texto'
import Frame from '@components/Frame'
import { GrAddCircle } from 'react-icons/gr'
import Botao from '@components/Botao'
import { Skeleton } from 'primereact/skeleton'
import Container from "@components/Container"
import { FaArrowAltCircleRight, FaDownload, FaTrash } from 'react-icons/fa'
import BotaoVoltar from "@components/BotaoVoltar"
import ContainerHorizontal from "@components/ContainerHorizontal"
import CustomImage from "@components/CustomImage"
import Loading from '@components/Loading'
import BotaoGrupo from "@components/BotaoGrupo"
import { Toast } from 'primereact/toast'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import http from "@http"
import FrameVertical from '@components/FrameVertical'
import { Tag } from 'primereact/tag';
import { Tooltip } from 'primereact/tooltip';
import { MdSettings, MdWarning } from 'react-icons/md';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import DataTableContratosDetalhes from '@components/DataTableContratosDetalhes'
import ModalContratoBeneficios from '../../components/ModalContratoBeneficio'
import { Real } from '@utils/formats'
import { useTranslation } from 'react-i18next'
import { TbSitemap, TbSitemapOff } from 'react-icons/tb'
import ModalAdicionarElegibilidadeItemKitAdmissional from '@components/ModalAdicionarElegibilidadeItemKitAdmissional';
import { FaPen } from 'react-icons/fa';
import ModalItemKitAdmissional from '@components/ModalItemKitAdmissional';

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const InfoBox = styled.div`
    background: linear-gradient(45deg, #f8fafc, #f1f5f9);
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
    color: #64748b;
    font-size: 14px;
    line-height: 1.5;
    text-align: left;
    & strong {
        font-weight: 500;
    }
    
    .main-title {
        font-weight: 800;
        color: #1f2937;
    }
`;

function KitAdmissionalDetalhes() {

    let { id } = useParams()
    const location = useLocation();
    const [kit, setKit] = useState(null)
    const toast = useRef(null)
    const [loading, setLoading] = useState(false)
    const [modalOpened, setModalOpened] = useState(false)
    const { t } = useTranslation('common');
    const [versaoSelecionada, setVersaoSelecionada] = useState(null);
    const [modalItemOpened, setModalItemOpened] = useState(false);
    const [itemEditando, setItemEditando] = useState(null);

    useEffect(() => {
        setLoading(true);
        // Busca do mock
        import('@json/kit_admissional.json').then((mod) => {
            const kitEncontrado = mod.default.find(k => String(k.id) === String(id));
            setKit(kitEncontrado);
            setLoading(false);
        });
    }, [id]);

    // Função para adicionar/editar versão (mock)
    const salvarVersao = (versao) => {
        toast.current.show({severity:'success', summary: 'Sucesso', detail: 'Versão salva!', life: 3000});
        setModalOpened(false);
    }

    // Função para salvar elegibilidade da versão (mock/local)
    const salvarElegibilidadeVersao = (dados) => {
        if (!versaoSelecionada) return;
        setKit(prevKit => {
            if (!prevKit) return prevKit;
            return {
                ...prevKit,
                elegibilidades: prevKit.elegibilidades.map(v =>
                    v.id === versaoSelecionada.id ? { ...v, elegibilidade: dados.regra_elegibilidade } : v
                )
            };
        });
        toast.current.show({severity:'success', summary: 'Sucesso', detail: 'Elegibilidade salva!', life: 3000});
        setModalOpened(false);
        setVersaoSelecionada(null);
    }

    // Função para editar item existente
    const editarItem = (item) => {
        setItemEditando(item);
        setModalItemOpened(true);
    };

    // Função para salvar novo ou editar item
    const salvarNovoItem = ({ nome, arquivo }) => {
        setKit(prevKit => {
            if (!prevKit) return prevKit;
            // Se for edição
            if (itemEditando) {
                return {
                    ...prevKit,
                    itens: prevKit.itens.map(i =>
                        i.id === itemEditando.id
                            ? { ...i, nome, arquivo: arquivo ? arquivo.name : i.arquivo }
                            : i
                    )
                };
            }
            // Se for novo
            const novoId = Math.max(0, ...(prevKit.itens?.map(i => i.id) || [])) + 1;
            return {
                ...prevKit,
                itens: [
                    ...(prevKit.itens || []),
                    {
                        id: novoId,
                        nome,
                        dt_inicio: '',
                        dt_fim: '',
                        status: 'A',
                        observacao: '',
                        arquivo: arquivo ? arquivo.name : '',
                        elegibilidades: []
                    }
                ]
            };
        });
        setModalItemOpened(false);
        setItemEditando(null);
    };

    return (
        <>
        <Frame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <ConfirmDialog  />
            <Container gap="16px">
                <BotaoVoltar linkFixo="/usuario/kit-admissional" />
                {kit ? (
                    <>
                        <BotaoGrupo align="space-between">
                            <Frame gap="15px">
                                <FrameVertical gap="10px">
                                    <ContainerHorizontal padding={'0px'} align="start" gap={'10px'} key={kit.id}>
                                        <b>{kit.nome} {kit.num_contrato_origem ? `- #${kit.num_contrato_origem}` : ``}</b>
                                        {kit.status === 'A' ? (
                                            <Tag severity="success" value="Ativo"></Tag>
                                        ) : (
                                            <Tag severity="danger" value="Inativo"></Tag>
                                        )}
                                    </ContainerHorizontal>
                                </FrameVertical>
                            </Frame>
                            <Botao aoClicar={() => setModalItemOpened(true)} estilo="neutro" size="small" tab><GrAddCircle fill="var(--black)" color="var(--black)"/> {t('add')} Item do Kit Admissional</Botao>
                        </BotaoGrupo>
                        <InfoBox>
                            <strong className="main-title">Sobre elegibilidade:</strong><br />
                            • Configure a elegibilidade de cada versão do documento do kit admissional.<br />
                            • <strong>Importante:</strong> se uma versão não tiver regras de elegibilidade, <u>nenhum colaborador</u> terá acesso a ela.<br />
                        </InfoBox>
                        {/* Tabela de versões do documento */}
                        <Frame gap="10px">
                            <table style={{width: '100%', borderCollapse: 'separate', borderSpacing: 0, marginTop: 8}}>
                                <thead>
                                    <tr style={{background: '#f8fafc'}}>
                                        <th style={{padding: '10px 8px', fontWeight: 700, fontSize: 15, color: '#222'}}>ID</th>
                                        <th style={{padding: '10px 8px', fontWeight: 700, fontSize: 15, color: '#222'}}>Nome</th>
                                        <th style={{padding: '10px 8px', fontWeight: 700, fontSize: 15, color: '#222'}}>Status</th>
                                        <th style={{padding: '10px 8px', fontWeight: 700, fontSize: 15, color: '#222'}}>Observação</th>
                                        <th style={{padding: '10px 8px', fontWeight: 700, fontSize: 15, color: '#222'}}>Arquivo</th>
                                        <th style={{padding: '10px 8px', fontWeight: 700, fontSize: 15, color: '#222', textAlign: 'center'}}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {kit.itens && kit.itens.map(item => {
                                        return (
                                            <tr key={item.id} style={{borderBottom: '1px solid #e5e7eb', background: '#fff'}}>
                                                <td style={{padding: '10px 8px', fontWeight: 500}}>{item.id}</td>
                                                <td style={{padding: '10px 8px'}}>{item.nome}</td>
                                                <td style={{padding: '10px 8px'}}>{item.status === 'A' ? <Tag severity="success" value="Ativo" /> : <Tag severity="danger" value="Inativo" />}</td>
                                                <td style={{padding: '10px 8px'}}>{item.observacao}</td>
                                                <td style={{padding: '10px 8px', textAlign: 'center'}}>
                                                    {item.arquivo ? (
                                                        <a href={item.arquivo} target="_blank" rel="noopener noreferrer" download style={{ color: '#2563eb', textDecoration: 'none' }} title="Baixar arquivo">
                                                            <FaDownload size={18} />
                                                        </a>
                                                    ) : (
                                                        <span style={{ color: '#888' }}>-</span>
                                                    )}
                                                </td>
                                                <td style={{padding: '10px 8px', textAlign: 'center'}}>
                                                    <span
                                                        style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', marginRight: 8 }}
                                                        onClick={() => editarItem(item)}
                                                        data-pr-tooltip="Editar item"
                                                    >
                                                        <FaPen size={16} />
                                                    </span>
                                                    <Tooltip target="[data-pr-tooltip='Editar item']" />
                                                    <span
                                                        style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                                                        onClick={() => { setVersaoSelecionada(item); setModalOpened(true); }}
                                                        data-pr-tooltip="Editar elegibilidade"
                                                    >
                                                        <MdSettings style={{ marginRight: 0, verticalAlign: 'middle', color: '#22c55e', fontSize: 22 }} />
                                                    </span>
                                                    <Tooltip target="[data-pr-tooltip='Editar elegibilidade']" />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </Frame>
                        <ModalAdicionarElegibilidadeItemKitAdmissional 
                            opened={modalOpened} 
                            aoFechar={() => { setModalOpened(false); setVersaoSelecionada(null); }} 
                            aoSalvar={salvarElegibilidadeVersao}
                            item={versaoSelecionada}
                        />
                        <ModalItemKitAdmissional
                            opened={modalItemOpened}
                            aoFechar={() => { setModalItemOpened(false); setItemEditando(null); }}
                            aoSalvar={salvarNovoItem}
                            item={itemEditando}
                        />
                    </>
                ) : null}
            </Container>
        </Frame>
        </>
    )
}

export default KitAdmissionalDetalhes