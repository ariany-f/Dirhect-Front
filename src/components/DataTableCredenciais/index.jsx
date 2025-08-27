import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import Texto from '@components/Texto';
import BotaoGrupo from '@components/BotaoGrupo';
import Botao from '@components/Botao';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario';
import { Tag } from 'primereact/tag';
import { FaTrash, FaEdit, FaShieldAlt, FaGlobe, FaKey, FaUser, FaCog, FaFileExcel } from 'react-icons/fa';
import { MdFilterAltOff } from 'react-icons/md';
import { Tooltip } from 'primereact/tooltip';
import { GrAddCircle } from 'react-icons/gr';
import http from '@http';
import { Dropdown } from 'primereact/dropdown';
import { ArmazenadorToken } from '@utils';
import { Toast } from 'primereact/toast';
import CheckboxContainer from '@components/CheckboxContainer';
import { RadioButton } from 'primereact/radiobutton';
import styled from 'styled-components';

const StatusTag = styled(Tag)`
    color: var(--black) !important;
    background-color: var(--neutro-200) !important;
    font-size: 13px !important;
    padding: 4px 12px !important;
    
    .p-tag-value {
        color: var(--black) !important;
        font-weight: 500 !important;
    }
`;

const TipoAutenticacaoTag = styled(Tag)`
    color: var(--white) !important;
    background-color: ${props => props.tipo === 'api_key' ? '#28a745' :
                        props.tipo === 'basic' ? '#1a73e8' :
                        props.tipo === 'bearer' ? '#ffa000' :
                        props.tipo === 'oauth' ? '#dc3545' :
                        '#6c757d'} !important;
    font-size: 13px !important;
    padding: 4px 12px !important;
    
    .p-tag-value {
        color: var(--white) !important;
        font-weight: 500 !important;
    }
`;

function DataTableCredenciais({ credenciais, paginator, rows, totalRecords, first, onPage, totalPages, onSearch, showSearch = true, onSort, sortField, sortOrder, onFilter, filters, onEdit, onDelete, onViewDetails, onNewCredential }) {
    const [selectedCredencial, setSelectedCredencial] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [key, setKey] = useState(0);
    const [exportingExcel, setExportingExcel] = useState(false);
    const toast = useRef(null);
    const searchTimeoutRef = useRef(null);

    const navegar = useNavigate()
    const {usuario} = useSessaoUsuarioContext()

    const onGlobalFilterChange = (value) => {
        console.log('🔍 Campo de busca alterado:', value);
        setGlobalFilterValue(value);
        
        // Limpar timeout anterior
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        
        // Definir novo timeout para busca com debounce de 500ms
        searchTimeoutRef.current = setTimeout(() => {
            console.log('🔍 Executando busca após debounce:', value);
            onSearch(value);
        }, 500);
    };

    // Limpar timeout quando o componente for desmontado
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    const exportarExcel = async () => {
        setExportingExcel(true);
        try {
            const response = await http.get('integracao-tenant/credenciais-externas/export-excel/', {
                responseType: 'blob'
            });
            
            // Cria um link para download
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            
            // Gera um nome de arquivo com data/hora
            const dataAtual = new Date();
            const dataFormatada = dataAtual.toLocaleDateString('pt-BR').replace(/\//g, '-');
            const horaFormatada = dataAtual.toLocaleTimeString('pt-BR').replace(/:/g, '-');
            link.setAttribute('download', `credenciais_${dataFormatada}_${horaFormatada}.xlsx`);
            
            // Adiciona ao DOM, clica e remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Limpa a URL criada
            window.URL.revokeObjectURL(url);
            
            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Planilha exportada com sucesso!',
                life: 3000
            });
        } catch (error) {
            console.error('Erro ao exportar Excel:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao exportar planilha de credenciais',
                life: 3000
            });
        } finally {
            setExportingExcel(false);
        }
    };

    function verDetalhes(value) {
        setSelectedCredencial(value);
        // Abrir modal de detalhes
        if (value && onViewDetails) {
            onViewDetails(value);
        }
    }

    const representativeNomeTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Ícone baseado no tipo de autenticação */}
                <div style={{ flexShrink: 0 }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${
                            rowData.tipo_autenticacao === 'api_key' ? '#28a745' :
                            rowData.tipo_autenticacao === 'basic' ? '#1a73e8' :
                            rowData.tipo_autenticacao === 'bearer' ? '#ffa000' :
                            rowData.tipo_autenticacao === 'oauth' ? '#dc3545' :
                            '#6c757d'
                        } 0%, ${
                            rowData.tipo_autenticacao === 'api_key' ? '#20c997' :
                            rowData.tipo_autenticacao === 'basic' ? '#1565c0' :
                            rowData.tipo_autenticacao === 'bearer' ? '#f57c00' :
                            rowData.tipo_autenticacao === 'oauth' ? '#c62828' :
                            '#5a6268'
                        } 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#ffffff',
                        border: '2px solid #f1f5f9',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}>
                        {rowData.tipo_autenticacao === 'api_key' && <FaKey size={16} />}
                        {rowData.tipo_autenticacao === 'basic' && <FaUser size={16} />}
                        {rowData.tipo_autenticacao === 'bearer' && <FaShieldAlt size={16} />}
                        {rowData.tipo_autenticacao === 'oauth' && <FaCog size={16} />}
                        {!['api_key', 'basic', 'bearer', 'oauth'].includes(rowData.tipo_autenticacao) && <FaGlobe size={16} />}
                    </div>
                </div>
                
                {/* Nome e descrição */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <Texto weight={700} width={'100%'}>
                        {rowData.nome_sistema}
                    </Texto>
                    {rowData.descricao && (
                        <div style={{marginTop: '6px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                            <p style={{fontWeight: '400', color: 'var(--neutro-500)'}}>{rowData.descricao}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const representativeStatusTemplate = (rowData) => {
        const isAtivo = rowData.ativo;
        
        return (
            <StatusTag 
                value={isAtivo ? 'Ativo' : 'Inativo'} 
                severity={isAtivo ? "success" : "danger"}
            />
        );
    }

    const representativeTipoAutenticacaoTemplate = (rowData) => {
        const tipoDisplay = rowData.tipo_autenticacao_display || rowData.tipo_autenticacao;
        
        return (
            <TipoAutenticacaoTag 
                value={tipoDisplay}
                tipo={rowData.tipo_autenticacao}
            />
        );
    }

    const representativeUrlTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Texto weight={500} style={{ 
                    fontFamily: 'monospace', 
                    fontSize: '13px',
                    wordBreak: 'break-all',
                    maxWidth: '200px'
                }}>
                    {rowData.url_endpoint}
                </Texto>
            </div>
        );
    }

    const representativeStatusConexaoTemplate = (rowData) => {
        const status = rowData.status_conexao || 'Desconhecido';
        
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Texto weight={500} style={{ 
                    color: status === 'Conectado' ? '#28a745' : 
                           status === 'Erro' ? '#dc3545' : '#ffc107'
                }}>
                    {status}
                </Texto>
            </div>
        );
    }

    const representativeCamposAdicionaisTemplate = (rowData) => {
        const numCampos = rowData.campos_adicionais?.length || 0;
        
        if (numCampos === 0) {
            return (
                <Texto weight={400} style={{ color: '#9ca3af', fontSize: '13px' }}>Nenhum</Texto>
            );
        }
        
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <StatusTag 
                    value={numCampos.toString()} 
                    severity="info"
                />
                {numCampos > 3 && (
                    <Texto weight={400} style={{ color: '#6c757d', fontSize: '12px' }}>
                        +{numCampos - 3} mais
                    </Texto>
                )}
            </div>
        );
    }

    const representativeActionsTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Tooltip target=".editar" mouseTrack mouseTrackLeft={10} />
                <FaEdit 
                    className="editar" 
                    data-pr-tooltip="Editar Credencial" 
                    size={16} 
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onEdit) onEdit(rowData);
                    }}
                    style={{
                        cursor: 'pointer',
                        color: 'var(--primaria)'
                    }}
                />

                <Tooltip target=".excluir" mouseTrack mouseTrackLeft={10} />
                <FaTrash 
                    className="excluir" 
                    data-pr-tooltip="Excluir Credencial" 
                    size={16} 
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onDelete) onDelete(rowData);
                    }}
                    style={{
                        cursor: 'pointer',
                        color: 'var(--erro)'
                    }}
                />
            </div>
        );
    };

    const totalCredenciaisTemplate = () => {
        return 'Total de Credenciais: ' + (totalRecords ?? 0);
    };

    const filterClearTemplate = (options) => {
        return (
            <button 
                type="button" 
                onClick={options.filterClearCallback} 
                style={{
                    width: '2.5rem', 
                    height: '2.5rem', 
                    color: 'var(--white)',
                    backgroundColor: 'var(--surface-600)',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <MdFilterAltOff fill="var(--white)" />
            </button>
        );
    };

    return (
        <>
            <Toast ref={toast} />
            <BotaoGrupo align={showSearch ? 'space-between' : 'end'} wrap>
                {showSearch && (
                    <>
                    <div className="flex justify-content-end">
                        <span className="p-input-icon-left">
                            <CampoTexto width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar credencial" />
                        </span>
                    </div>
                    </>
                )}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {onNewCredential && (
                        <Botao 
                            aoClicar={onNewCredential}
                            size="small" 
                            style={{
                                background: 'linear-gradient(135deg, #fd7e14 0%, #e55a00 100%)',
                                border: 'none',
                                color: 'white',
                                boxShadow: '0 2px 8px rgba(253, 126, 20, 0.3)'
                            }}
                        >
                            <GrAddCircle size={14} /> Nova Credencial
                        </Botao>
                    )}
                    {ArmazenadorToken.hasPermission('view_funcionario') && (
                        <Botao 
                            aoClicar={exportarExcel} 
                            estilo="vermilion" 
                            size="small" 
                            tab
                            disabled={exportingExcel}
                        >
                            <FaFileExcel 
                                fill={exportingExcel ? '#9ca3af' : 'var(--secundaria)'} 
                                color={exportingExcel ? '#9ca3af' : 'var(--secundaria)'} 
                                size={16}
                            />
                            {exportingExcel ? 'Exportando...' : 'Exportar Excel'}
                        </Botao>
                    )}
                </div>
            </BotaoGrupo>
            <DataTable 
                key={key}
                selection={selectedCredencial} 
                onSelectionChange={(e) => verDetalhes(e.value)}
                selectionMode="single"
                value={credenciais} 
                filters={filters}
                onFilter={onFilter}
                emptyMessage="Não foram encontradas credenciais" 
                paginator={paginator}
                lazy
                rows={rows} 
                totalRecords={totalRecords} 

                first={first} 
                onPage={onPage} 
                onSort={onSort}
                removableSort 
                tableStyle={{ minWidth: '68vw' }}
                showGridlines
                stripedRows
                sortField={sortField}
                sortOrder={sortOrder === 'desc' ? -1 : 1}
                footerColumnGroup={
                    <ColumnGroup>
                        <Row>
                            <Column footer={totalCredenciaisTemplate} style={{ textAlign: 'right', fontWeight: 600 }} />
                        </Row>
                    </ColumnGroup>
                }
            >
                <Column body={representativeNomeTemplate} field="nome_sistema" header="Nome do Sistema" sortable style={{ width: '25%' }}></Column>
                <Column body={representativeStatusTemplate} field="ativo" header="Status" sortable style={{ width: '10%' }}></Column>
                <Column body={representativeTipoAutenticacaoTemplate} field="tipo_autenticacao" header="Tipo de Autenticação" sortable style={{ width: '15%' }}></Column>
                <Column body={representativeUrlTemplate} field="url_endpoint" header="URL do Endpoint" sortable style={{ width: '20%' }}></Column>
                <Column body={representativeStatusConexaoTemplate} field="status_conexao" header="Status da Conexão" style={{ width: '12%' }}></Column>
                <Column body={representativeCamposAdicionaisTemplate} field="campos_adicionais.length" header="Campos Adicionais" style={{ width: '8%' }}></Column>
                <Column header="Ações" style={{ width: '10%' }} body={representativeActionsTemplate}></Column>
            </DataTable>
        </>
    )
}

export default DataTableCredenciais
