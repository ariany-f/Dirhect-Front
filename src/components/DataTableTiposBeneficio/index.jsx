import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './DataTable.css';
import QuestionCard from '@components/QuestionCard';
import BadgeGeral from '@components/BadgeGeral';
import CampoTexto from '@components/CampoTexto';
import BotaoGrupo from '@components/BotaoGrupo';
import BotaoSemBorda from '@components/BotaoSemBorda';
import Botao from '@components/Botao';
import Texto from '@components/Texto';
import http from '@http';
import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { AiFillQuestionCircle } from 'react-icons/ai';
import IconeBeneficio from '@components/IconeBeneficio';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast';
import { FaMapPin, FaTrash } from 'react-icons/fa';
import { Tooltip } from 'primereact/tooltip';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaPen } from 'react-icons/fa';
import SwitchInput from '@components/SwitchInput';
import { Tag } from 'primereact/tag';
import styled from 'styled-components';
import ModalTipoBeneficio from '@components/ModalTipoBeneficio';
import { GrAddCircle } from 'react-icons/gr';
import styles from '@pages/Beneficios/Beneficios.module.css';
import { useTranslation } from 'react-i18next';
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario";
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { FaSearch } from 'react-icons/fa';

const StatusTag = styled.span`
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    
    ${props => props.$status === true ? `
        background-color: rgba(0, 200, 83, 0.1);
        color: var(--success);
    ` : `
        background-color: rgba(229, 115, 115, 0.1);
        color: var(--error);
    `}
`;

const SearchContainer = styled.div`
    position: relative;
    width: 320px;
    
    .p-inputtext {
        width: 100%;
        padding-left: 36px;
        background: var(--neutro-50);
        border: 1px solid var(--neutro-200);
        border-radius: 8px;
        height: 40px;
        font-size: 14px;
        
        &:focus {
            box-shadow: 0 0 0 2px var(--primaria-100);
            border-color: var(--primaria);
        }
    }
    
    .search-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--neutro-400);
        font-size: 14px;
    }
`;

function DataTableTiposBeneficio({ 
    beneficios, 
    paginator, 
    rows, 
    totalRecords, 
    first, 
    onPage,
    onSearch, 
    onBeneficioDeleted,
    sortField,
    sortOrder,
    onSort
}) {
    const navegar = useNavigate();
    const toast = useRef(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [beneficiosStatus, setBeneficiosStatus] = useState({});
    const [modalOpened, setModalOpened] = useState(false);
    const [beneficioParaEditar, setBeneficioParaEditar] = useState(null);
    const { t } = useTranslation('common');
    const { usuario } = useSessaoUsuarioContext();
    const searchTimeout = useRef(null);
    const [tipos, setTipos] = useState({});

    // Atualiza o estado dos status quando os benefícios mudam
    useEffect(() => {
        if (beneficios?.length > 0) {
            setBeneficiosStatus(
                beneficios.reduce((acc, beneficio) => ({
                    ...acc,
                    [beneficio.id]: usuario?.tipo === 'global' ? beneficio.ativo : beneficio.ativo_tenant
                }), {})
            );
        }
    }, [beneficios]);

    useEffect(() => {
        // Buscar tipos de benefício do endpoint
        http.get('tipo_beneficio/?format=json').then(resp => {
            if (resp) {
                const tiposMap = resp.reduce((acc, tipo) => {
                    acc[tipo.chave] = tipo.descricao;
                    return acc;
                }, {});
                setTipos(tiposMap);
            }
        });
    }, []);

    function verDetalhes(value) {
        // navegar(`/beneficio/detalhes/${value.id}`);
    }

    const onGlobalFilterChange = (value) => {
        setGlobalFilterValue(value);
        
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }
        
        searchTimeout.current = setTimeout(() => {
            onSearch(value);
        }, 300);
    };

    const excluirBeneficio = (beneficioId) => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir este tipo de benefício?',
            header: 'Deletar',
            icon: 'pi pi-info-circle',
            accept: () => {
                http.delete(`/tipo_beneficio/${beneficioId}/?format=json`)
                .then(() => {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Tipo de Benefício excluído com sucesso',
                        life: 3000
                    });
                    
                    if (onBeneficioDeleted) {
                        onBeneficioDeleted();
                    }
                })
                .catch(error => {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Não foi possível excluir o tipo de benefício',
                        life: 3000
                    });
                    console.error('Erro ao excluir tipo de benefício:', error);
                });
            },
            reject: () => {}
        });
    };

    const atualizarStatus = async (id, novoStatus) => {
        // Atualiza o estado local imediatamente para feedback instantâneo
        setBeneficiosStatus(prev => ({
            ...prev,
            [id]: !!novoStatus
        }));
        try {
            // Chama o endpoint correto conforme o tipo de usuário
            let response;
            if (usuario?.tipo === 'global') {
                response = await http.put(`beneficio/${id}/?format=json`, {
                    ativo: !!novoStatus
                });
            } else {
                response = await http.put(`beneficio/${id}/?format=json`, {
                    ativo_tenant: !!novoStatus
                });
            }
            // Atualiza o estado local com o valor retornado pela API (caso backend retorne o objeto atualizado)
            if (response && (typeof response.ativo === 'boolean' || typeof response.ativo_tenant === 'boolean')) {
                setBeneficiosStatus(prev => ({
                    ...prev,
                    [id]: usuario?.tipo === 'global' ? response.ativo : response.ativo_tenant
                }));
            }
            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Benefício ${!!novoStatus ? 'ativado' : 'desativado'} com sucesso`,
                life: 3000
            });
        } catch (error) {
            // Reverte o estado em caso de erro
            setBeneficiosStatus(prev => ({
                ...prev,
                [id]: !novoStatus
            }));
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Não foi possível alterar o status do benefício',
                life: 3000
            });
            console.error('Erro ao atualizar status:', error);
        }
    };

    const salvarBeneficio = (dados) => {
        const method = beneficioParaEditar ? 'put' : 'post';
        const url = beneficioParaEditar ? 
            `/beneficio/${beneficioParaEditar.id}/?format=json` : 
            '/beneficio/?format=json';
        const successMessage = beneficioParaEditar ? 
            'Benefício atualizado com sucesso' : 
            'Benefício criado com sucesso';
        const errorMessage = beneficioParaEditar ? 
            'Erro ao atualizar benefício' : 
            'Erro ao criar benefício';

        http[method](url, dados)
            .then(() => {
                toast.current.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: successMessage,
                    life: 3000
                });
                setModalOpened(false);
                setBeneficioParaEditar(null);
                if (onBeneficioDeleted) {
                    onBeneficioDeleted();
                }
            })
            .catch(error => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: errorMessage,
                    life: 3000
                });
                console.error('Erro ao salvar benefício:', error);
            });
    };

    const abrirModalEdicao = (beneficio) => {
        setBeneficioParaEditar(beneficio);
        setModalOpened(true);
    };

    const representativeDescriptionTemplate = (rowData) => {
        return (
            <Texto weight={700}>{rowData.descricao}</Texto>
        );
    };

    const representativeActionsTemplate = (rowData) => {
        // Determina qual status usar
        const statusAtual = beneficiosStatus[rowData.id] !== undefined
            ? beneficiosStatus[rowData.id]
            : rowData.ativo;
        return (
            <div style={{ 
                display: 'flex', 
                gap: '16px',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    <StatusTag $status={statusAtual}>
                        {statusAtual ? "Ativo" : "Inativo"}
                    </StatusTag>
                    <SwitchInput
                        checked={statusAtual}
                        onChange={() => {
                            atualizarStatus(rowData.id, !statusAtual);
                        }}
                        style={{ width: '36px' }}
                    />
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <Tooltip target=".edit" mouseTrack mouseTrackLeft={10} />
                    <FaPen
                        className="edit"
                        data-pr-tooltip="Editar Benefício"
                        size={14}
                        onClick={(e) => {
                            e.stopPropagation();
                            abrirModalEdicao(rowData);
                        }}
                        style={{
                            cursor: 'pointer',
                            color: 'var(--primaria)',
                        }}
                    />
                    <Tooltip target=".delete" mouseTrack mouseTrackLeft={10} />
                    <RiDeleteBin6Line 
                        className="delete" 
                        data-pr-tooltip="Excluir Benefício" 
                        size={16} 
                        onClick={(e) => {
                            e.stopPropagation();
                            excluirBeneficio(rowData.id);
                        }}
                        style={{
                            cursor: 'pointer',
                            color: 'var(--erro)'
                        }}
                    />
                </div>
            </div>
        );
    };

    const handleSort = (event) => {
        if (onSort) {
            onSort({
                sortField: event.sortField,
                sortOrder: event.sortOrder
            });
        }
    };

    return (
        <>
            <ConfirmDialog />
            <Toast ref={toast} />
            <BotaoGrupo align="space-between">
                <CampoTexto  
                    width={'320px'} 
                    valor={globalFilterValue}
                    setValor={onGlobalFilterChange}
                    type="search" 
                    label="" 
                    placeholder="Buscar tipo de benefício" 
                />
                <BotaoGrupo align="end">
                    <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab>
                        <GrAddCircle className={styles.icon} stroke="white"/> {t('add')} Tipo de Benefício
                    </Botao>
                </BotaoGrupo>
            </BotaoGrupo>
            <DataTable 
                value={beneficios} 
                emptyMessage="Não foram encontrados tipos de benefício" 
                paginator={paginator}
                rows={rows}
                totalRecords={totalRecords}
                first={first}
                onPage={onPage}
                onSelectionChange={(e) => verDetalhes(e.value)}
                selectionMode="single"
                tableStyle={{ minWidth: '65vw' }}
                lazy
                sortField={sortField}
                sortOrder={sortOrder === 'desc' ? -1 : 1}
                onSort={handleSort}
                removableSort
            >
                <Column sortable body={representativeDescriptionTemplate} field="descricao" header="Nome" style={{ width: '50%' }}/>
                <Column body={representativeActionsTemplate} header="" style={{ width: '20%'}}/>
            </DataTable>

            <ModalTipoBeneficio 
                aoSalvar={salvarBeneficio}
                opened={modalOpened} 
                aoFechar={() => {
                    setModalOpened(false);
                    setBeneficioParaEditar(null);
                }}
                beneficio={beneficioParaEditar}
            />
        </>
    );
}

export default DataTableTiposBeneficio;