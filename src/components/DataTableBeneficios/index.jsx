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
import tiposBeneficio from '@json/tipos_beneficio.json';
import { Tooltip } from 'primereact/tooltip';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaPencil } from 'react-icons/fa6';
import SwitchInput from '@components/SwitchInput';
import { Tag } from 'primereact/tag';
import styled from 'styled-components';
import ModalBeneficios from '@components/ModalBeneficios';
import { GrAddCircle } from 'react-icons/gr';
import styles from '@pages/Beneficios/Beneficios.module.css';
import { useTranslation } from 'react-i18next';
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario";

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

function DataTableBeneficios({ 
    beneficios, 
    paginator, 
    rows, 
    totalRecords, 
    first, 
    onPage,
    onSearch, 
    onBeneficioDeleted
}) {
    const navegar = useNavigate();
    const toast = useRef(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [beneficiosStatus, setBeneficiosStatus] = useState({});
    const [modalOpened, setModalOpened] = useState(false);
    const [beneficioParaEditar, setBeneficioParaEditar] = useState(null);
    const { t } = useTranslation('common');
    const { usuario } = useSessaoUsuarioContext();

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

    // Cria um objeto de mapeamento de tipos a partir do JSON importado
    const tipos = tiposBeneficio.reduce((acc, tipo) => {
        acc[tipo.code] = tipo.nome;
        return acc;
    }, {});
    
    function verDetalhes(value) {
        // navegar(`/beneficio/detalhes/${value.id}`);
    }

    const onGlobalFilterChange = (value) => {
        setGlobalFilterValue(value);
        onSearch(value);
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
        try {
            // Atualiza o estado local imediatamente para feedback instantâneo
            setBeneficiosStatus(prev => ({
                ...prev,
                [id]: novoStatus
            }));

            // Chama o endpoint correto conforme o tipo de usuário
            if (usuario?.tipo === 'global') {
                await http.put(`beneficio/${id}/?format=json`, {
                    status: novoStatus ? 0 : 1
                });
            } else {
                await http.put(`beneficio/${id}/?format=json`, {
                    status_tenant: novoStatus ? 0 : 1
                });
            }

            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Benefício ${novoStatus ? 'ativado' : 'desativado'} com sucesso`,
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
        const statusAtual = usuario?.tipo === 'global' ? rowData.ativo : rowData.ativo_tenant;
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
                        onChange={(e) => {
                            atualizarStatus(rowData.id, e.value);
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
                    <FaPencil
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
            >
                <Column body={representativeDescriptionTemplate} field="descricao" header="Nome" style={{ width: '20%' }}/>
                <Column body={representativeStatusTemplate} header="Tipo" style={{ width: '40%' }}/>
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