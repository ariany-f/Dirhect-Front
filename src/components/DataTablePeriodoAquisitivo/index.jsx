import { DataTable } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { Tooltip } from 'primereact/tooltip';
import { Dropdown } from 'primereact/dropdown';
import Texto from '@components/Texto';
import { useNavigate } from 'react-router-dom';
import Botao from '@components/Botao';
import { FaUmbrellaBeach, FaExclamationCircle, FaRegClock, FaCheckCircle, FaSun, FaCalendarCheck, FaCalendarAlt, FaTimesCircle, FaClock, FaExclamationTriangle, FaLock, FaLockOpen, FaMoneyCheck, FaFileExcel } from 'react-icons/fa';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario';
import { Tag } from 'primereact/tag';
import { ArmazenadorToken } from '@utils';
import ModalDetalhesFerias from '@components/ModalDetalhesFerias';
import { Toast } from 'primereact/toast';
import styled from 'styled-components';
import http from '@http';

// Styled component para o status seguindo o formato do botão
const StatusTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 6px;
  padding: 6px 12px;
  font-family: var(--fonte-primaria);
  line-height: 1.2;
  transition: all .1s linear;
  background: ${({ $type }) => {
    if ($type === 'aSolicitar') return 'linear-gradient(to right, #ff5ca7, #ffb6c1)';
    if ($type === 'solicitada') return 'linear-gradient(to right, #fbb034,rgb(211, 186, 22))';
    if ($type === 'marcada') return 'linear-gradient(to right, #20c997, #17a2b8)';
    if ($type === 'aprovada') return 'linear-gradient(to left, var(--black), var(--gradient-secundaria))';
    if ($type === 'acontecendo') return 'linear-gradient(to right,rgb(45, 126, 219),rgb(18, 37, 130))';
    if ($type === 'passada') return 'linear-gradient(to right, #bdbdbd, #757575)';
    if ($type === 'finalizada') return 'linear-gradient(to right, #6c757d, #495057)';
    if ($type === 'paga') return 'linear-gradient(to right, #28a745, #20c997)';
    return 'linear-gradient(to left, var(--black), var(--gradient-secundaria))';
  }};
  color: #fff;
  border: none;
  width: fit-content;
  white-space: nowrap;
`;

const statusIcons = {
  aSolicitar: <FaExclamationCircle fill='white' size={12} />,
  solicitada: <FaRegClock fill='white' size={12}/>,
  aprovada: <FaCalendarCheck fill='white' size={12}/>,
  acontecendo: <FaSun fill='white' size={12}/>,
  passada: <FaCheckCircle fill='white' size={12}/>,
  marcada: <FaCalendarAlt fill='white' size={12}/>,
  finalizada: <FaCheckCircle fill='white' size={12}/>,
  paga: <FaCheckCircle fill='white' size={12}/>,
};

// Helper function to parse dates and avoid timezone issues
function parseDateAsLocal(dateString) {
    if (!dateString) return null;
    if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
        const [datePart] = dateString.split('T');
        const [year, month, day] = datePart.split('-').map(Number);
        return new Date(year, month - 1, day);
    }
    return new Date(dateString);
}

// Função mapStatusToType igual ao calendar_ferias.jsx
function mapStatusToType(status, data_inicio, data_fim) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const isAcontecendo = () => {
        if (!data_inicio || !data_fim) return false;
        const inicio = parseDateAsLocal(data_inicio);
        inicio.setHours(0, 0, 0, 0);
        const fim = parseDateAsLocal(data_fim);
        fim.setHours(0, 0, 0, 0);
        return hoje >= inicio && hoje <= fim;
    };

    switch (status) {
        case 'A':
            return isAcontecendo() ? 'acontecendo' : 'aprovada';
        case 'M':
            return isAcontecendo() ? 'acontecendo' : 'marcada';
        case 'F':
            return 'finalizada';
        case 'P':
            return 'paga';
        case 'X':
            return 'finalizada';
        case 'I':
        case 'G':
        case 'D':
        case 'E':
            return 'solicitada';
        case 'C':
            return 'passada';
        case 'R':
            return 'rejeitada';
        default:
            return isAcontecendo() ? 'acontecendo' : 'aprovada';
    }
}

function formatarDataBr(data) {
    if (!data) return '-------';
    // Aceita formatos YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss
    const [ano, mes, dia] = data.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
}

// Custom styles for PrimeReact Dropdown to match the select design
const CustomDropdownStyles = styled.div`
    /* Estilos mais diretos para sobrescrever o PrimeReact */
    .p-dropdown {
        background: var(--white) !important;
        border: 1px solid var(--surface-border) !important;
        border-radius: 4px !important;
        min-width: 300px !important;
    }

    .p-dropdown-filter-icon {
        top: calc(46px - 28px)!important;
    }
    
    .p-dropdown:hover {
        border-color: var(--primaria) !important;
        background: var(--surface-hover) !important;
    }
    
    .p-dropdown:focus-within {
        border-color: var(--primaria) !important;
    }
    
    .p-dropdown-label {
        padding: 10px 16px !important;
        padding-right: 60px !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        color: var(--text-color) !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
    }
    
    .p-dropdown-trigger {
        color: #6b7280 !important;
        width: 2rem !important;
    }
    
    .p-dropdown-trigger:hover {
        color: #374151 !important;
    }
    
    .p-dropdown-clear-icon {
        position: absolute !important;
        right: 2.5rem !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        color: #6b7280 !important;
        font-size: 12px !important;
        z-index: 10 !important;
    }
    
    .p-dropdown-clear-icon:hover {
        color: #374151 !important;
    }
    
    .p-dropdown-panel {
        background: var(--white) !important;
        border: 1px solid var(--surface-border) !important;
        border-radius: 4px !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
    }
    
    .p-dropdown-filter {
        padding: 8px 12px !important;
        border-bottom: 1px solid var(--surface-border) !important;
    }
    
    .p-dropdown-filter .p-inputtext {
        border: 1px solid var(--surface-border) !important;
        border-radius: 4px !important;
        padding: 8px 12px !important;
        font-size: 14px !important;
    }
    
    .p-dropdown-filter .p-inputtext:focus {
        border-color: var(--primaria) !important;
        box-shadow: 0 0 0 1px var(--primaria) !important;
    }
    
    .p-dropdown-items .p-dropdown-item {
        padding: 8px 16px !important;
        font-size: 14px !important;
        color: #374151 !important;
    }
    
    .p-dropdown-items .p-dropdown-item:hover {
        background: var(--surface-hover) !important;
    }
    
    .p-dropdown-items .p-dropdown-item.p-highlight {
        background: var(--surface-hover) !important;
        color: var(--text-color) !important;
    }
`;

function DataTablePeriodoAquisitivo({ 
    ferias, 
    colaborador = null,
    totalRecords = 0,
    currentPage = 1,
    setCurrentPage,
    pageSize = 10,
    setPageSize,
    onUpdate, // nova prop para atualização
    onSort, // nova prop para ordenação
    sortField = '',
    sortOrder = '',
    onFilter, // nova prop para filtros
    filtersProp = {}, // nova prop para estado dos filtros
    situacoesUnicas = [], // nova prop para situações disponíveis
    onExportExcel, // nova prop para exportar Excel
    exportingExcel = false, // nova prop para estado de exportação
    onSecaoFilterChange // nova prop para filtro de seção
}) {

    const [colaboradores, setColaboradores] = useState(null)
    const [selectedFerias, setSelectedFerias] = useState(0);
    const [modalOpened, setModalOpened] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [modalDetalhesFeriasOpened, setModalDetalhesFeriasOpened] = useState(false)
    const [eventoSelecionado, setEventoSelecionado] = useState(null)
    const navegar = useNavigate();
    const { usuario } = useSessaoUsuarioContext();
    const toast = useRef(null);

    // Estados para filtro de seção
    const [secoes, setSecoes] = useState([]);
    const [secaoSelecionada, setSecaoSelecionada] = useState('');
    const [loadingSecoes, setLoadingSecoes] = useState(false);
    const [filtroSecao, setFiltroSecao] = useState('');

    // Buscar seções da API
    useEffect(() => {
        const fetchSecoes = async () => {
            setLoadingSecoes(true);
            try {
                const response = await http.get('secao/');
                const secoesFormatadas = response.map(secao => ({
                    label: `${secao.id_origem} - ${secao.descricao}`,
                    value: secao.id_origem
                }));
                setSecoes(secoesFormatadas);
            } catch (error) {
                console.error('Erro ao buscar seções:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar seções',
                    life: 3000
                });
            } finally {
                setLoadingSecoes(false);
            }
        };

        fetchSecoes();
    }, []);

    // Função para lidar com mudança de seção
    const handleSecaoChange = (event) => {
        const novaSecao = event.value;
        setSecaoSelecionada(novaSecao);
        
        // Chama callback para atualizar filtros no componente pai
        if (onSecaoFilterChange) {
            onSecaoFilterChange(novaSecao);
        }
    };

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    function verDetalhes(rowData) {
        if (!rowData || !rowData.funcionario_id) {
            console.warn('Dados inválidos para verDetalhes:', rowData);
            toast.current?.show({ 
                severity: 'error', 
                summary: 'Erro', 
                detail: 'Dados do registro de férias estão incompletos', 
                life: 3000 
            });
            return;
        }
    
        let dataInicioAquisitivo;
        if (rowData.fimperaquis) {
            const [ano, mes, dia] = rowData.fimperaquis.split('T')[0].split('-').map(Number);
            // Data de início é exatamente 1 ano antes da data de fim
            dataInicioAquisitivo = new Date(ano - 1, mes - 1, dia);
        }
    
        const eventoParaModal = {
            colab: {
                id: rowData.funcionario_id,
                nome: rowData.funcionario_nome,
                gestor: rowData.gestor || null
            },
            evento: {
                ...rowData,
                status: rowData.situacaoferias,
                periodo_aquisitivo_inicio: dataInicioAquisitivo,
                periodo_aquisitivo_fim: rowData.fimperaquis,
                tarefas: rowData.tarefas,
                marcacoes: rowData.marcacoes || [],
                saldo: rowData.saldo || rowData.nrodiasferias || 30,
                saldo_dias: rowData.saldo || rowData.nrodiasferias || 30
            }
        };
    
        if (!rowData.dt_inicio && !rowData.dt_fim) {
            eventoParaModal.tipo = 'aSolicitar';
        }
    
        setEventoSelecionado({ ...eventoParaModal, colab: { ...eventoParaModal.colab, funcionario_situacao_padrao: rowData.funcionario_situacao_padrao === true } });
        setModalDetalhesFeriasOpened(true);
    }

    function formataCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    
    const representativeInicioAquisicaoTemplate = (rowData) => {
        if (!rowData.fimperaquis) return <p style={{
            fontWeight: '400', 
            fontSize: '12px',
            whiteSpace: 'nowrap',
            width: '100%',
            textAlign: 'left'
        }}>-</p>;
        
        const [ano, mes, dia] = rowData.fimperaquis.split('T')[0].split('-').map(Number);
        // Subtrai 1 ano para início
        let dataInicio = new Date(ano - 1, mes - 1, dia);
        // Soma 1 dia
        dataInicio.setDate(dataInicio.getDate() + 1);
        // Formata DD/MM/AAAA
        const diaInicioStr = String(dataInicio.getDate()).padStart(2, '0');
        const mesInicioStr = String(dataInicio.getMonth() + 1).padStart(2, '0');
        const anoInicioStr = dataInicio.getFullYear();
        
        return (
            <p style={{
                fontWeight: '400', 
                fontSize: '12px',
                whiteSpace: 'nowrap',
                width: '100%',
                textAlign: 'left',
                margin: 0
            }}>
                {`${diaInicioStr}/${mesInicioStr}/${anoInicioStr}`}
            </p>
        );
    }

    const representativeFimAquisicaoTemplate = (rowData) => {
        if (!rowData.fimperaquis) return <p style={{
            fontWeight: '400', 
            fontSize: '12px',
            whiteSpace: 'nowrap',
            width: '100%',
            textAlign: 'left'
        }}>-</p>;
        
        const [ano, mes, dia] = rowData.fimperaquis.split('T')[0].split('-').map(Number);
        
        // Formata fim da aquisição
        const diaFimStr = String(dia).padStart(2, '0');
        const mesFimStr = String(mes).padStart(2, '0');
        const anoFimStr = ano;
        
        return (
            <p style={{
                fontWeight: '400', 
                fontSize: '12px',
                whiteSpace: 'nowrap',
                textAlign: 'left',
                margin: 0
            }}>
                {`${diaFimStr}/${mesFimStr}/${anoFimStr}`}
            </p>
        );
    }

    const representativeSituacaoPeriodoTemplate = (rowData) => {
        const isPeriodoAberto = rowData?.periodo_aberto === true;
        const isPeriodoPerdido = rowData?.periodo_perdido === true;
        
        let statusText = 'Fechado';
        let statusColor = '#F59E0B';
        let icon = <FaLock size={14} />;
        
        if (isPeriodoPerdido) {
            statusText = 'Perdido';
            statusColor = '#EF4444';
            icon = <FaExclamationTriangle size={14} />;
        } else if (isPeriodoAberto) {
            statusText = 'Aberto';
            statusColor = '#10B981';
            icon = <FaLockOpen size={14} />;
        }
        
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                justifyContent: 'flex-start'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: `${statusColor}15`,
                    border: `1px solid ${statusColor}40`,
                    color: statusColor,
                    fontWeight: '500',
                    fontSize: '12px',
                    whiteSpace: 'nowrap'
                }}>
                    {icon}
                    {statusText}
                </div>
            </div>
        );
    }

    const fecharModal = (resultado) => {
        setModalDetalhesFeriasOpened(false);
        setEventoSelecionado(null);
        if (resultado) {
            if (resultado.sucesso) {
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: resultado.mensagem, life: 3000 });

                if (onUpdate) { 
                    setTimeout(() => {
                        onUpdate(); // Chama callback de atualização apenas em caso de sucesso
                    }, 2000);
                }
            } else if (resultado.erro) {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: resultado.mensagem, life: 3000 });
                // Não chama onUpdate em caso de erro
            } else if (resultado.aviso) {
                toast.current.show({ severity: 'warn', summary: 'Atenção', detail: resultado.mensagem, life: 3000 });
                // Não chama onUpdate em caso de aviso
            } else if (resultado.info) {
                toast.current.show({ severity: 'info', summary: 'Aviso', detail: resultado.mensagem, life: 3000 });
                // Não chama onUpdate em caso de info
            }
        }
    };

    const representativeSituacaoTemplate = (rowData) => {
        // Busca o id da situação "Demitido" na lista de tipoSituacao
        const isDemitido = rowData.funcionario_situacao_padrao === true;
        const isMarcadoDemissao = rowData.funcionario_marcado_demissao === true;
        if (!rowData.dt_fim && !rowData.dt_inicio) {
            // Férias a solicitar
            if (ArmazenadorToken.hasPermission('add_ferias')) {
                return (
                    <p style={{fontWeight: '400', fontSize: '11px'}}>
                        <Botao disabled={isDemitido || isMarcadoDemissao} aoClicar={() => verDetalhes(rowData)} estilo="vermilion" size="small" tab>
                            <FaUmbrellaBeach fill="var(--secundaria)" color="var(--secundaria)" size={16}/>Solicitar
                        </Botao>
                    </p>
                );
            } else {
                return <p style={{fontWeight: '400', fontSize: '11px'}}>N/A</p>;
            }
        }

        // Usa a função mapStatusToType para determinar o status
        const statusType = mapStatusToType(rowData.situacaoferias, rowData.dt_inicio, rowData.dt_fim);
        
        // Busca o texto da situação na API primeiro
        const situacaoEncontrada = situacoesUnicas.find(s => s.value === rowData.situacaoferias);
        
        // Mapeia o statusType para o texto oficial usando situacoesUnicas
        let statusText = '';
        if (situacaoEncontrada) {
            // Se encontrou na API, usa o label da API
            statusText = situacaoEncontrada.label;
        } else {
            // Fallback para casos onde a situação não está nas opções da API
            switch (statusType) {
                case 'aSolicitar':
                    statusText = 'A solicitar';
                    break;
                case 'solicitada':
                    statusText = 'Em análise';
                    break;
                case 'marcada':
                    statusText = 'Marcada';
                    break;
                case 'aprovada':
                    statusText = 'Aprovada';
                    break;
                case 'finalizada':
                    statusText = 'Finalizada';
                    break;
                case 'paga':
                    statusText = 'Paga';
                    break;
                case 'acontecendo':
                    statusText = 'Em férias';
                    break;
                case 'passada':
                    statusText = 'Concluída';
                    break;
                case 'rejeitada':
                    statusText = 'Rejeitada';
                    break;
                default:
                    statusText = 'N/A';
                    break;
            }
        }

        return (
            <div style={{
                display: 'flex', 
                flexDirection: 'column', 
                gap: '3px',
                alignItems: 'flex-start',
                width: '100%'
            }}>
                <StatusTag $type={statusType}>
                    {statusIcons[statusType]} {statusText}
                </StatusTag>
            </div>
        );
    }
    
    const representativeColaboradorTemplate = (rowData) => {
        // Verificação de segurança para garantir que rowData é válido
        if (!rowData) {
            return <div>-</div>;
        }
       
        return <div key={rowData.id} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <Texto weight={700} width={'100%'} style={{ fontSize: '14px', lineHeight: '1.1' }}>
                {rowData?.dados_pessoa_fisica?.nome ?? rowData.funcionario_nome ?? 'Colaborador'}
            </Texto>
            {rowData.secao_nome && (
                <Texto weight={400} width={'100%'} style={{ fontSize: '12px', color: '#666', lineHeight: '1.2' }}>
                    {rowData.secao_codigo ? `${rowData.secao_codigo} ` : ''} {rowData.secao_nome ? `${rowData.secao_nome}` : ''}
                </Texto>
            )}
        </div>
    }

    const representativeChapaTemplate = (rowData) => {
        return <div style={{ textAlign: 'left', width: '100%' }}>
            <Texto weight={500} style={{ fontSize: '13px' }}>
                {rowData.funcionario_chapa || '-'}
            </Texto>
        </div>
    }

    // Função para lidar com mudanças de página
    const onPageChange = (event) => {
        const newPage = event.page + 1;
        const newPageSize = event.rows;
        
        // Se tem callback do componente pai, usar ele (server-side)
        if (setCurrentPage && setPageSize) {
            setCurrentPage(newPage);
            setPageSize(newPageSize);
        } else {
            // Fallback para paginação local (client-side)
            setCurrentPage(newPage);
            setPageSize(newPageSize);
        }
    };

    // Função para lidar com ordenação
    const onSortChange = (event) => {
        console.log('🔄 Sort change event:', event);
        if (onSort) {
            const { sortField, sortOrder } = event;
            
            // Se sortOrder é null ou undefined, significa que o sort foi removido
            if (sortOrder === null || sortOrder === undefined) {
                console.log('🗑️ Removendo ordenação');
                onSort({ field: '', order: '' });
                return;
            }
            
            // Converter sortOrder do PrimeReact (1/-1) para string (asc/desc)
            const orderString = sortOrder === 1 ? 'asc' : sortOrder === -1 ? 'desc' : '';
            console.log('📤 Enviando sort:', { field: sortField, order: orderString });
            onSort({ field: sortField, order: orderString });
        }
    };

    const totalFeriasTemplate = () => {
        return 'Total de Períodos Aquisitivos: ' + (totalRecords ?? 0);
    };

    // Memoizar configuração do DataTable para evitar re-renders
    const dataTableConfig = useMemo(() => ({
        scrollable: false,
        filters: filtersProp,
        onFilter: onFilter,
        globalFilterFields: ['colaborador_id'],
        emptyMessage: "Não foram encontrados períodos aquisitivos registrados",
        selection: selectedFerias,
        selectionMode: "single",
        paginator: true,
        rows: pageSize,
        totalRecords: totalRecords,
        lazy: true,
        first: (currentPage - 1) * pageSize,
        removableSort: true,
        tableStyle: { 
            minWidth: (!colaborador ? '68vw' : '40vw'),
            borderCollapse: 'collapse',
            borderSpacing: 0,
            width: '100%',
            tableLayout: 'fixed'
        }
    }), [filtersProp, selectedFerias, pageSize, totalRecords, currentPage, colaborador, onFilter]);

    // Função para calcular larguras das colunas dinamicamente
    const getColumnWidths = useMemo(() => {
        // Definir as proporções originais (quando todas as colunas estão presentes)
        const originalProportions = {
            colaborador: 23,
            chapa: 11,
            inicio: 11,
            fim: 11,
            situacaoPeriodo: 13,
            saldo: 13,
            situacao: 18
        };
        
        // Determinar quais colunas estão presentes e suas proporções
        const availableColumns = [];
        const availableProportions = {};
        
        if (!colaborador) {
            // Quando não há colaborador (lista geral), incluir colunas de colaborador e chapa
            availableColumns.push('colaborador', 'chapa');
            availableProportions['colaborador'] = originalProportions['colaborador'];
            availableProportions['chapa'] = originalProportions['chapa'];
        }
        
        // Sempre incluir estas colunas
        availableColumns.push('inicio', 'fim', 'situacaoPeriodo', 'saldo', 'situacao');
        availableProportions['inicio'] = originalProportions['inicio'];
        availableProportions['fim'] = originalProportions['fim'];
        availableProportions['situacaoPeriodo'] = originalProportions['situacaoPeriodo'];
        availableProportions['saldo'] = originalProportions['saldo'];
        availableProportions['situacao'] = originalProportions['situacao'];
        
        // Calcular as larguras percentuais ajustadas
        const widths = {};
        
        // Distribuir proporcionalmente entre as colunas disponíveis
        const totalProportion = availableColumns.reduce((sum, col) => sum + availableProportions[col], 0);
        
        availableColumns.forEach((col, index) => {
            const proportion = availableProportions[col] / totalProportion;
            widths[col] = `${(proportion * 100).toFixed(1)}%`;
        });
        
        return widths;
    }, [colaborador]);

    return (
        <>
            <Toast ref={toast} />
            <DataTable 
                value={ferias || []} 
                {...dataTableConfig}
                onSelectionChange={(e) => verDetalhes(e.value)} 
                onPage={onPageChange}
                onSort={onSortChange}
                stripedRows
                className="auto-card mobile-hide-optional"
                sortField={sortField || null}
                rowsPerPageOptions={[5, 10, 25, 50]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords}"
                sortOrder={sortOrder === 'desc' ? -1 : sortOrder === 'asc' ? 1 : sortOrder ? 0 : null}
                rowClassName={(rowData) => `row-${rowData.id}`}
                style={{ borderCollapse: 'collapse', borderSpacing: 0 }}
                header={
                    onExportExcel ? (
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            width: '100%',
                            padding: '8px 0'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <CustomDropdownStyles>
                                    <Dropdown
                                        value={secaoSelecionada}
                                        options={secoes}
                                        onChange={handleSecaoChange}
                                        placeholder="Filtrar por seção"
                                        filter
                                        filterBy="label"
                                        showClear={!!secaoSelecionada}
                                        disabled={loadingSecoes}
                                        className="custom-dropdown"
                                    />
                                </CustomDropdownStyles>
                            </div>
                            <Botao 
                                aoClicar={onExportExcel} 
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
                        </div>
                    ) : (
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '16px',
                            width: '100%',
                            padding: '8px 0'
                        }}>
                            <span style={{ fontSize: '18px', fontWeight: '600', color: '#374151' }}>
                                Períodos Aquisitivos
                            </span>
                            {!colaborador && (
                                <CustomDropdownStyles>
                                    <Dropdown
                                        value={secaoSelecionada}
                                        options={secoes}
                                        onChange={handleSecaoChange}
                                        placeholder="Filtrar por seção"
                                        filter
                                        filterBy="label"
                                        showClear={!!secaoSelecionada}
                                        disabled={loadingSecoes}
                                        className="custom-dropdown"
                                    />
                                </CustomDropdownStyles>
                            )}
                        </div>
                    )
                }
            >
                {!colaborador && <Column body={representativeColaboradorTemplate} sortable field="funcionario_nome" sortField="funcionario" header="Nome" style={{ width: getColumnWidths.colaborador }} className="col-colaborador"></Column>}
                {!colaborador && <Column body={representativeChapaTemplate} sortable field="funcionario_chapa" header="Matrícula" style={{ width: getColumnWidths.chapa }} className="col-chapa"></Column>}
                <Column 
                    body={representativeInicioAquisicaoTemplate} 
                    field="fimperaquis" 
                    header="Início" 
                    style={{ width: getColumnWidths.inicio }} 
                    className="col-inicio-aquisicao"
                    headerStyle={{ fontSize: '11px' }}
                ></Column>
                <Column 
                    body={representativeFimAquisicaoTemplate} 
                    field="fimperaquis" 
                    header="Fim" 
                    style={{ width: getColumnWidths.fim }} 
                    className="col-fim-aquisicao"
                    headerStyle={{ fontSize: '11px' }}
                ></Column>
                <Column 
                    body={representativeSituacaoPeriodoTemplate} 
                    field="periodo_aberto" 
                    header="Situação do Período" 
                    style={{ width: getColumnWidths.situacaoPeriodo }} 
                    className="col-situacao-periodo"
                    headerStyle={{ fontSize: '11px' }}
                ></Column>
                <Column 
                    body={(rowData) => `${rowData.saldo || rowData.nrodiasferias || 30} dias`} 
                    sortable 
                    field="saldo" 
                    header="Saldo Disponível" 
                    style={{ width: getColumnWidths.saldo }} 
                    className="col-saldo"
                    headerStyle={{ fontSize: '11px' }}
                ></Column>
                <Column 
                    body={representativeSituacaoTemplate}
                    field="situacaoferias" 
                    header="Ações" 
                    style={{ width: getColumnWidths.situacao }}
                    className="col-situacao"
                    headerStyle={{ fontSize: '11px' }}
                ></Column>
            </DataTable>
            <ModalDetalhesFerias opened={modalDetalhesFeriasOpened} evento={eventoSelecionado} aoFechar={fecharModal} isDemitido={eventoSelecionado?.colab?.funcionario_situacao_padrao === true} />
        </>
    )
}

export default DataTablePeriodoAquisitivo;
