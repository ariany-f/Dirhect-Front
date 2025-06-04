import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './DataTable.css';
import QuestionCard from '@components/QuestionCard';
import BadgeGeral from '@components/BadgeGeral';
import CampoTexto from '@components/CampoTexto';
import BotaoGrupo from '@components/BotaoGrupo';
import BotaoSemBorda from '@components/BotaoSemBorda';
import Botao from '@components/Botao';
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
import ModalBeneficios from '@components/ModalBeneficios';
import { GrAddCircle } from 'react-icons/gr';
import styles from '@pages/Beneficios/Beneficios.module.css';
import { useTranslation } from 'react-i18next';
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario";
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { FaSearch } from 'react-icons/fa';
import { CiSettings } from 'react-icons/ci';

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

function DataTableBeneficios({ 
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
            message: 'Tem certeza que deseja excluir este benefício?',
            header: 'Deletar',
            icon: 'pi pi-info-circle',
            accept: () => {
                http.delete(`/beneficio/${beneficioId}/?format=json`)
                .then(() => {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Benefício excluído com sucesso',
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
                        detail: 'Não foi possível excluir o benefício',
                        life: 3000
                    });
                    console.error('Erro ao excluir benefício:', error);
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

    const representativeStatusTemplate = (rowData) => {
        return tipos[rowData.tipo] || rowData.tipo;
    };

    const representativeDescriptionTemplate = (rowData) => {
        return (
            <BadgeGeral nomeBeneficio={rowData.descricao} iconeBeneficio={<IconeBeneficio nomeIcone={rowData?.icone ?? rowData?.descricao}/>} />
        );
    };

    const representativeActionsTemplate = (rowData) => {
        // Determina qual status usar
        const statusAtual = beneficiosStatus[rowData.id] !== undefined
            ? beneficiosStatus[rowData.id]
            : (usuario?.tipo === 'global' ? rowData.ativo : rowData.ativo_tenant);
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

    // Função para atualizar multiplos/obrigatoriedade
    const atualizarCampo = async (id, campo, valor) => {
        try {
            await http.put(`beneficio/${id}/?format=json`, {
                [campo]: valor
            });
            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Campo '${campo}' atualizado com sucesso`,
                life: 2000
            });
            if (onBeneficioDeleted) onBeneficioDeleted();
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: `Erro ao atualizar '${campo}'`,
                life: 2000
            });
        }
    };

    // Colunas dinâmicas para multiplos e obrigatoriedade
    const renderMultiplosItens = (rowData) => (
        <SwitchInput checked={rowData.multiplos_itens} disabled={usuario?.tipo === 'global'}
            onChange={() => atualizarCampo(rowData.id, 'multiplos_itens', !rowData.multiplos_itens)} style={{ width: 36 }} />
    );
    const renderMultiplasOperadoras = (rowData) => (
        <SwitchInput checked={rowData.multiplos_operadoras} disabled={usuario?.tipo === 'global'}
            onChange={() => atualizarCampo(rowData.id, 'multiplos_operadoras', !rowData.multiplos_operadoras)} style={{ width: 36 }} />
    );
    const renderObrigatoriedade = (rowData) => (
        <SwitchInput checked={rowData.obrigatoriedade} disabled={usuario?.tipo === 'global'}
            onChange={() => atualizarCampo(rowData.id, 'obrigatoriedade', !rowData.obrigatoriedade)} style={{ width: 36 }} />
    );

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
                    placeholder="Buscar benefício" 
                />
                <BotaoGrupo align="end">
                    <BotaoSemBorda color="var(--primaria)">
                        <FaMapPin/><Link to={'/beneficio/onde-usar'} className={styles.link}>Onde usar</Link>
                    </BotaoSemBorda>
                    <BotaoSemBorda color="var(--primaria)">
                        <CiSettings size={16}/> <Link to={'/tipos-beneficio'} className={styles.link}>Tipos de Benefício</Link>
                    </BotaoSemBorda>
                    <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab>
                        <GrAddCircle className={styles.icon} stroke="white"/> {t('add')} Benefício
                    </Botao>
                </BotaoGrupo>
            </BotaoGrupo>
            <DataTable 
                value={beneficios} 
                emptyMessage="Não foram encontrados benefícios" 
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
                <Column sortable body={representativeDescriptionTemplate} field="descricao" header="Nome" style={{ width: '20%' }}/>
                <Column sortable body={representativeStatusTemplate} field="tipo" header="Tipo Benefício" style={{ width: '20%' }}/>
                {usuario?.tipo !== 'global' && <Column body={renderMultiplosItens} field="multiplos_itens" sortable header="Múltiplos Itens" style={{ width: '15%' }}/>}
                {usuario?.tipo !== 'global' && <Column body={renderMultiplasOperadoras} field="multiplos_operadoras" sortable header="Múltiplas Operadoras" style={{ width: '15%' }}/>}
                {usuario?.tipo !== 'global' && <Column body={renderObrigatoriedade} field="obrigatoriedade" header="Obrigatório" style={{ width: '10%' }}/>}
                <Column body={representativeActionsTemplate} header="" style={{ width: '20%'}}/>
            </DataTable>

            <ModalBeneficios 
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

export default DataTableBeneficios;