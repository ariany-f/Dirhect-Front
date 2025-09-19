import { DataTable } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Tooltip } from 'primereact/tooltip';
import Texto from '@components/Texto';
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import Botao from '@components/Botao';
import { FaUmbrellaBeach, FaExclamationCircle, FaRegClock, FaCheckCircle, FaSun, FaCalendarCheck, FaCalendarAlt, FaTimesCircle, FaClock, FaExclamationTriangle, FaLock, FaLockOpen, FaMoneyCheck } from 'react-icons/fa';
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

function DataTableFerias({ 
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
    situacoesUnicas = [] // nova prop para situações disponíveis
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
                tarefas: rowData.tarefas
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
    
    const representativeInicioTemplate = (rowData) => {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                width: '100%'
            }}>
                <p style={{
                    fontWeight: '400', 
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    width: '100%',
                    textAlign: 'left',
                    margin: 0
                }}>
                    {formatarDataBr(rowData.dt_inicio)}
                </p>
                <p style={{
                    fontWeight: '400', 
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    width: '100%',
                    textAlign: 'left',
                    margin: 0
                }}>
                    {formatarDataBr(rowData.dt_fim)}
                </p>
            </div>
        );
    }
    
    const representativeAquisicaoTemplate = (rowData) => {
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
        
        // Formata fim da aquisição
        const diaFimStr = String(dia).padStart(2, '0');
        const mesFimStr = String(mes).padStart(2, '0');
        const anoFimStr = ano;

        // Lógica dos ícones de período
        const isPeriodoAberto = rowData?.periodo_aberto === true;
        const isPeriodoPerdido = rowData?.periodo_perdido === true;
        
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                width: '100%'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    width: '100%'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        flex: 1
                    }}>
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
                        <p style={{
                            fontWeight: '400', 
                            fontSize: '12px',
                            whiteSpace: 'nowrap',
                            width: '100%',
                            textAlign: 'left',
                            margin: 0
                        }}>
                            {`${diaFimStr}/${mesFimStr}/${anoFimStr}`}
                        </p>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '1px',
                        alignItems: 'center'
                    }}>
                        <Tooltip target=".periodo-aberto-icon" />
                        {isPeriodoAberto ? (
                            <FaLockOpen 
                                className="periodo-aberto-icon"
                                data-pr-tooltip="Período Aberto"
                                size={12} 
                                color="#10B981" 
                                fill="#10B981"
                                style={{
                                    filter: 'drop-shadow(0 0 2px rgba(16, 185, 129, 0.3))',
                                    cursor: 'help'
                                }}
                            />
                        ) : (
                            <FaLock 
                                className="periodo-aberto-icon"
                                data-pr-tooltip="Período Fechado"
                                size={12} 
                                color="#F59E0B" 
                                fill="#F59E0B"
                                style={{
                                    filter: 'drop-shadow(0 0 2px rgba(245, 158, 11, 0.3))',
                                    cursor: 'help'
                                }}
                            />
                        )}
                        <Tooltip target=".periodo-perdido-icon" />
                        {isPeriodoPerdido ? (
                            <FaExclamationTriangle 
                                className="periodo-perdido-icon"
                                data-pr-tooltip="Período Perdido"
                                size={12} 
                                color="#EF4444" 
                                fill="#EF4444"
                                style={{
                                    filter: 'drop-shadow(0 0 2px rgba(239, 68, 68, 0.3))',
                                    cursor: 'help'
                                }}
                            />
                        ) : null}
                    </div>
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

    const representativePagamentoTemplate = (rowData) => {
        return <p style={{
            fontWeight: '400', 
            fontSize: '12px',
            whiteSpace: 'nowrap',
            width: '100%',
            textAlign: 'left'
        }}>{rowData.datapagamento ? formatarDataBr(rowData.datapagamento) : '-------'}</p>;
    }
    
    const representativeAvisoFeriasTemplate = (rowData) => {
        return <p style={{
            fontWeight: '400', 
            fontSize: '12px',
            whiteSpace: 'nowrap',
            width: '100%',
            textAlign: 'left'
        }}>{rowData.aviso_ferias ? formatarDataBr(rowData.aviso_ferias) : '-------'}</p>;
    }
    
    const representativeAbonoPecuniarioTemplate = (rowData) => {
        let tag = rowData?.abono_pecuniario;
        let tooltipText = '';
        
        switch(rowData?.abono_pecuniario)
        {
            case true:
                tag = <Tag severity="success" value="Sim"></Tag>;
                tooltipText = 'Abono Pecuniário: Sim';
                break;
            case false:
                tag = <Tag severity="danger" value="Não"></Tag>;
                tooltipText = 'Abono Pecuniário: Não';
                break;
            default:
                tag = '-';
                tooltipText = 'Abono Pecuniário: Não informado';
                break;
        }
        return (
            <div style={{ cursor: 'help', textAlign: 'left', width: '100%' }}>
                <Tooltip target=".abono-pecuniario-tag" />
                <div className="abono-pecuniario-tag" data-pr-tooltip={tooltipText}>
                    <b>{tag}</b>
                </div>
            </div>
        )
    }
    
    const representativeFeriasColetivasTemplate = (rowData) => {
        let tag = rowData?.ferias_coletivas;
        let tooltipText = '';
        
        switch(rowData?.ferias_coletivas)
        {
            case true:
                tag = <Tag severity="success" value="Sim"></Tag>;
                tooltipText = 'Férias Coletivas: Sim';
                break;
            case false:
                tag = <Tag severity="danger" value="Não"></Tag>;
                tooltipText = 'Férias Coletivas: Não';
                break;
            default:
                tag = '-';
                tooltipText = 'Férias Coletivas: Não informado';
                break;
        }
        return (
            <div style={{ cursor: 'help', textAlign: 'left', width: '100%' }}>
                <Tooltip target=".ferias-coletivas-tag" />
                <div className="ferias-coletivas-tag" data-pr-tooltip={tooltipText}>
                    <b>{tag}</b>
                </div>
            </div>
        )
    }

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

        // Mapeia o status original para texto usando situacoesUnicas
        let statusOriginalText = '';
        if (situacaoEncontrada) {
            // Se encontrou na API, usa o label da API
            statusOriginalText = situacaoEncontrada.label;
        } else {
            // Fallback para casos onde a situação não está nas opções da API
            switch (rowData.situacaoferias) {
                case 'A':
                    statusOriginalText = 'Aprovada';
                    break;
                case 'M':
                    statusOriginalText = 'Marcada';
                    break;
                case 'F':
                    statusOriginalText = 'Finalizada';
                    break;
                case 'P':
                    statusOriginalText = 'Paga';
                    break;
                case 'X':
                    statusOriginalText = 'Finalizada Próximo Mês';
                    break;
                case 'I':
                    statusOriginalText = 'Iniciada Solicitação';
                    break;
                case 'G':
                    statusOriginalText = 'Aguardando Gestor';
                    break;
                case 'D':
                    statusOriginalText = 'Aguardando DP';
                    break;
                case 'E':
                    statusOriginalText = 'Em Análise';
                    break;
                case 'C':
                    statusOriginalText = 'Cancelada';
                    break;
                case 'R':
                    statusOriginalText = 'Rejeitada';
                    break;
                default:
                    statusOriginalText = 'N/A';
                    break;
            }
        }

        // Verifica se os textos são diferentes (normalizando singular/plural)
        const normalizarTexto = (texto) => {
            return texto.toLowerCase()
                .replace(/marcadas?/g, 'marcada')
                .replace(/pagas?/g, 'paga')
                .replace(/aprovadas?/g, 'aprovada')
                .replace(/finalizadas?/g, 'finalizada')
                .replace(/concluídas?/g, 'concluída')
                .replace(/rejeitadas?/g, 'rejeitada');
        };

        const textosDiferentes = normalizarTexto(statusText) !== normalizarTexto(statusOriginalText);

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
                {/* {textosDiferentes && (
                    <p style={{
                        fontWeight: '400', 
                        fontSize: '11px', 
                        color: '#666', 
                        margin: 0,
                        lineHeight: '1.2'
                    }}>
                        {statusOriginalText}
                    </p>
                )} */}
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
            {(rowData.funcionario_chapa || rowData.secao_nome) && (
                <Texto weight={400} width={'100%'} style={{ fontSize: '12px', color: '#666', lineHeight: '1.2' }}>
                    {rowData.funcionario_chapa ? `${rowData.funcionario_chapa} ` : ''} {rowData.secao_nome ? `${rowData.secao_nome}` : ''}
                </Texto>
            )}
        </div>
    }

    
    const representativ13Template = (rowData) => {
        let tag = rowData?.adiantar_13;
        let tooltipText = '';
        
        switch(rowData?.adiantar_13)
        {
            case true:
                tag = <Tag severity="success" value="Sim"></Tag>;
                tooltipText = 'Adiantamento: Sim';
                break;
            case false:
                tag = <Tag severity="danger" value="Não"></Tag>;
                tooltipText = 'Adiantamento: Não';
                break;
            default:
                tag = '-';
                tooltipText = 'Adiantamento: Não informado';
                break;
        }
        return (
            <div style={{ cursor: 'help', textAlign: 'left', width: '100%' }}>
                <Tooltip target=".decimo-tag" />
                <div className="decimo-tag" data-pr-tooltip={tooltipText}>
                    <b>{tag}</b>
                </div>
            </div>
        )
    }

    // Função para lidar com mudanças de página
    const onPageChange = (event) => {
        const newPage = event.page + 1;
        const newPageSize = event.rows;
        
        setCurrentPage(newPage);
        setPageSize(newPageSize);
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
        return 'Total de Férias: ' + (totalRecords ?? 0);
    };

    // Memoizar configuração do DataTable para evitar re-renders
    const dataTableConfig = useMemo(() => ({
        scrollable: false,
        filters: filtersProp,
        onFilter: onFilter,
        globalFilterFields: ['colaborador_id'],
        emptyMessage: "Não foram encontrados férias registradas",
        selection: selectedFerias,
        selectionMode: "single",
        paginator: true,
        rows: pageSize,
        totalRecords: totalRecords,
        lazy: true,
        first: (currentPage - 1) * pageSize,
        removableSort: true,
        tableStyle: { minWidth: (!colaborador ? '68vw' : '40vw') }
    }), [filtersProp, selectedFerias, pageSize, totalRecords, currentPage, colaborador, onFilter]);

    // Templates para botões de filtro (igual ao DataTableColaboradores)
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
                <i className="pi pi-filter-slash" />
            </button>
        );
    };

    const filterApplyTemplate = (options) => {
        return (
            <button 
                type="button" 
                onClick={options.filterApplyCallback} 
                style={{
                    width: '2.5rem', 
                    height: '2.5rem', 
                    color: 'var(--white)',
                    backgroundColor: 'var(--green-500)',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <i className="pi pi-check" />
            </button>
        );
    };

    // Template para filtro de situação (COPIA EXATA do DataTableColaboradores)
    const SituacaoFilterContent = ({ options, situacoesUnicas }) => {
        const [filtroSituacao, setFiltroSituacao] = useState('');
        const [selectedSituacoes, setSelectedSituacoes] = useState([]);

        // Inicializar com o valor atual do filtro
        useEffect(() => {
            if (options.value) {
                setSelectedSituacoes(Array.isArray(options.value) ? options.value : [options.value]);
            } else {
                setSelectedSituacoes([]);
            }
        }, [options.value]);

        const onSituacaoChange = (situacaoValue, checked) => {
            let newSelectedSituacoes;
            
            if (checked) {
                // Adicionar à seleção
                newSelectedSituacoes = [...selectedSituacoes, situacaoValue];
            } else {
                // Remover da seleção
                newSelectedSituacoes = selectedSituacoes.filter(val => val !== situacaoValue);
            }
            
            setSelectedSituacoes(newSelectedSituacoes);
            
            // Chamar o callback com o array de valores selecionados
            if (newSelectedSituacoes.length === 0) {
                options.filterCallback(null);
            } else {
                options.filterCallback(newSelectedSituacoes);
            }
        };

        const situacoesOrdenadas = [...(situacoesUnicas || [])].sort((a, b) => a.label.localeCompare(b.label));

        const situacoesFiltradas = situacoesOrdenadas.filter(situacao => 
            situacao.label.toLowerCase().includes(filtroSituacao.toLowerCase())
        );

        // Função para selecionar/deselecionar todos
        const onSelecionarTodos = (checked) => {
            let newSelectedSituacoes;
            
            if (checked) {
                // Selecionar todas as situações filtradas
                newSelectedSituacoes = situacoesFiltradas.map(situacao => situacao.value);
            } else {
                // Deselecionar todas
                newSelectedSituacoes = [];
            }
            
            setSelectedSituacoes(newSelectedSituacoes);
            
            // Chamar o callback
            if (newSelectedSituacoes.length === 0) {
                options.filterCallback(null);
            } else {
                options.filterCallback(newSelectedSituacoes);
            }
        };

        // Verificar se todas as situações filtradas estão selecionadas
        const todasSelecionadas = situacoesFiltradas.length > 0 && 
            situacoesFiltradas.every(situacao => selectedSituacoes.includes(situacao.value));
        
        // Verificar se algumas estão selecionadas (para estado indeterminado)
        const algumasSelecionadas = situacoesFiltradas.some(situacao => selectedSituacoes.includes(situacao.value));

        return (
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <CampoTexto
                    valor={filtroSituacao}
                    setValor={setFiltroSituacao}
                    placeholder="Buscar situação..."
                    width="100%"
                />
                
                {/* Opção Selecionar Todos */}
                {situacoesFiltradas.length > 0 && (
                    <div style={{ 
                        borderBottom: '1px solid #e5e7eb', 
                        paddingBottom: '0.75rem', 
                        marginBottom: '0.5rem' 
                    }}>
                        <div className="flex align-items-center">
                            <input
                                type="checkbox"
                                id="selecionar-todos-ferias"
                                checked={todasSelecionadas}
                                ref={(input) => {
                                    if (input) input.indeterminate = algumasSelecionadas && !todasSelecionadas;
                                }}
                                onChange={(e) => onSelecionarTodos(e.target.checked)}
                                style={{ marginRight: '8px' }}
                            />
                            <label 
                                htmlFor="selecionar-todos-ferias" 
                                style={{ 
                                    cursor: 'pointer', 
                                    flex: 1, 
                                    fontWeight: '600', 
                                    color: '#374151' 
                                }}
                            >
                                Selecionar Todos
                            </label>
                        </div>
                    </div>
                )}
                
                <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '10px' }}>
                    {situacoesFiltradas.map(situacao => (
                        <div key={situacao.value} className="flex align-items-center">
                            <input
                                type="checkbox"
                                id={`situacao-${situacao.value}`}
                                checked={selectedSituacoes.includes(situacao.value)}
                                onChange={(e) => onSituacaoChange(situacao.value, e.target.checked)}
                                style={{ marginRight: '8px' }}
                            />
                            <label 
                                htmlFor={`situacao-${situacao.value}`} 
                                style={{ cursor: 'pointer', flex: 1 }}
                            >
                                {situacao.label}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const situacaoFilterTemplate = (options) => {
        return <SituacaoFilterContent options={options} situacoesUnicas={situacoesUnicas} />;
    };

    // Função para calcular larguras das colunas dinamicamente
    const getColumnWidths = useMemo(() => {
        // Definir as proporções originais (quando todas as colunas estão presentes)
        const originalProportions = {
            colaborador: 25,
            aquisicao: 15,
            ferias: 12,
            pagamento: 12,
            aviso: 8,
            dias: 8,
            abono: 8,
            decimo: 8,
            coletiva: 10,
            situacao: 15
        };
        
        // Determinar quais colunas estão presentes
        const availableColumns = [];
        
        if (!colaborador) {
            availableColumns.push('colaborador');
        }
        availableColumns.push('aquisicao', 'ferias', 'pagamento');
        if (!colaborador) {
            availableColumns.push('aviso');
        }
        availableColumns.push('dias', 'abono', 'decimo', 'coletiva', 'situacao');
        
        // Calcular a soma das proporções das colunas disponíveis
        const totalProportion = availableColumns.reduce((sum, col) => sum + originalProportions[col], 0);
        
        // Calcular as larguras percentuais ajustadas
        const widths = {};
        let totalCalculated = 0;
        
        availableColumns.forEach((col, index) => {
            if (index === availableColumns.length - 1) {
                // Para a última coluna, usar o que falta para completar 100%
                widths[col] = `${(100 - totalCalculated).toFixed(1)}%`;
            } else {
                const width = (originalProportions[col] / totalProportion * 100);
                widths[col] = `${width.toFixed(1)}%`;
                totalCalculated += parseFloat(width.toFixed(1));
            }
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
            >
                {!colaborador && <Column body={representativeColaboradorTemplate} sortable field="funcionario_nome" sortField="funcionario" header="Colaborador" style={{ width: getColumnWidths.colaborador }} className="col-colaborador"></Column>}
                <Column body={representativeAquisicaoTemplate} field="fimperaquis" header="Aquisição" style={{ width: getColumnWidths.aquisicao }} className="col-aquisicao"></Column>
                <Column body={representativeInicioTemplate} field="dt_inicio" header="Férias" style={{ width: getColumnWidths.ferias }} className="col-ferias"></Column>
                <Column body={representativePagamentoTemplate} sortable field="datapagamento" header="Pagamento" style={{ width: getColumnWidths.pagamento }} className="col-pagamento"></Column>
                {!colaborador && ( 
                    <>
                        <Column body={representativeAvisoFeriasTemplate} sortable field="aviso_ferias" header="Aviso" style={{ width: getColumnWidths.aviso }} className="hide-mobile col-aviso"></Column>
                    </>
                )}
                <Column body={(rowData) => rowData.nrodiasferias} sortable field="nrodiasferias" header="Dias" style={{ width: getColumnWidths.dias }} className="col-dias"></Column>
                <Column body={(rowData) => rowData.nrodiasabono} sortable field="nrodiasabono" header="Abono" style={{ width: getColumnWidths.abono }} className="hide-mobile col-abono"></Column>
                <Column body={representativ13Template} sortable field="adiantar_13" header="13º" style={{ width: getColumnWidths.decimo }} className="hide-mobile col-decimo"></Column>
                <Column body={representativeFeriasColetivasTemplate} sortable field="ferias_coletivas" header="Coletiva" style={{ width: getColumnWidths.coletiva }} className="hide-mobile col-coletiva"></Column>
                <Column 
                    sortable 
                    body={representativeSituacaoTemplate}
                    field="situacaoferias" 
                    header="Situação" 
                    style={{ width: getColumnWidths.situacao }}
                    className="col-situacao"
                    filter
                    filterField="situacaoferias"
                    showFilterMenu={true}
                    filterElement={situacaoFilterTemplate}
                    filterMatchMode="custom"
                    showFilterMatchModes={false}
                    showFilterOperator={false}
                    showAddButton={false}
                    filterClear={filterClearTemplate}
                    filterApply={filterApplyTemplate}
                ></Column>
            </DataTable>
            <ModalDetalhesFerias opened={modalDetalhesFeriasOpened} evento={eventoSelecionado} aoFechar={fecharModal} isDemitido={eventoSelecionado?.colab?.funcionario_situacao_padrao === true} />
        </>
    )
}

export default DataTableFerias;