import { DataTable } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { Tooltip } from 'primereact/tooltip';
import './DataTable.css'
import Texto from '@components/Texto';
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import Botao from '@components/Botao';
import { FaUmbrellaBeach, FaExclamationCircle, FaRegClock, FaCheckCircle, FaSun, FaCalendarCheck, FaCalendarAlt, FaTimesCircle, FaClock, FaExclamationTriangle, FaLock, FaLockOpen, FaMoneyCheck } from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario';
import { Tag } from 'primereact/tag';
import { ArmazenadorToken } from '@utils';
import ModalDetalhesFerias from '@components/ModalDetalhesFerias';
import { Toast } from 'primereact/toast';
import styled from 'styled-components';

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
        case 'S':
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
    onUpdate // nova prop para atualização
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
        if (!rowData) {
            return;
        }
    
        let dataInicioAquisitivo;
        if (rowData.fimperaquis) {
            const [ano, mes, dia] = rowData.fimperaquis.split('T')[0].split('-').map(Number);
            let dataInicio = new Date(ano - 1, mes - 1, dia);
            dataInicio.setDate(dataInicio.getDate() + 1);
            dataInicioAquisitivo = dataInicio;
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
    
        setEventoSelecionado(eventoParaModal);
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
                if (onUpdate) onUpdate(); // Chama callback de atualização
            } else if (resultado.erro) {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: resultado.mensagem, life: 3000 });
            } else if (resultado.aviso) {
                toast.current.show({ severity: 'warn', summary: 'Atenção', detail: resultado.mensagem, life: 3000 });
            } else if (resultado.info) {
                toast.current.show({ severity: 'info', summary: 'Aviso', detail: resultado.mensagem, life: 3000 });
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
        if (!rowData.dt_fim && !rowData.dt_inicio) {
            // Férias a solicitar
            if (ArmazenadorToken.hasPermission('add_ferias')) {
                return (
                    <p style={{fontWeight: '400', fontSize: '11px'}}>
                        <Botao aoClicar={() => verDetalhes(rowData)} estilo="vermilion" size="small" tab>
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
        
        // Mapeia o statusType para o texto oficial
        let statusText = '';
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

        // Mapeia o status original para texto
        let statusOriginalText = '';
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
            case 'S':
                statusOriginalText = 'Solicitada';
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
                {textosDiferentes && (
                    <p style={{
                        fontWeight: '400', 
                        fontSize: '11px', 
                        color: '#666', 
                        margin: 0,
                        lineHeight: '1.2'
                    }}>
                        {statusOriginalText}
                    </p>
                )}
            </div>
        );
    }
    
    const representativeColaboradorTemplate = (rowData) => {
       
        return <div key={rowData.id}>
            <Texto weight={700} width={'100%'}>
                {rowData?.dados_pessoa_fisica?.nome ?? rowData.funcionario_nome}
            </Texto>
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

    useEffect(() => {
        if(ferias)
        {
            if(colaborador)
            {
                // setFilteredData(ferias.filter(feria => feria.funcionario.id == colaborador))
            }
            else
            {
                // setFilteredData(ferias)
            }
        }
        
     }, [colaborador, ferias])

    // Função para lidar com mudanças de página
    const onPageChange = (event) => {
        const newPage = event.page + 1;
        const newPageSize = event.rows;
        
        setCurrentPage(newPage);
        setPageSize(newPageSize);
    };

    return (
        <>
            <Toast ref={toast} />
            <DataTable 
                value={ferias || []} 
                scrollable 
                scrollHeight="65vh"
                filters={filters} 
                globalFilterFields={['colaborador_id']} 
                emptyMessage="Não foram encontrados férias registradas" 
                selection={selectedFerias} 
                onSelectionChange={(e) => verDetalhes(e.value)} 
                selectionMode="single" 
                paginator 
                rows={pageSize}
                totalRecords={totalRecords}
                lazy
                first={(currentPage - 1) * pageSize}
                onPage={onPageChange}
                tableStyle={{ minWidth: (!colaborador ? '68vw' : '40vw') }}
            >
                {!colaborador && <Column body={representativeColaboradorTemplate} field="colaborador_id" header="Colaborador" style={{ width: '15%' }}></Column>}
                <Column body={representativeAquisicaoTemplate} field="fimperaquis" header="Aquisição" style={{ width: '18%' }}></Column>
                <Column body={representativeInicioTemplate} field="data_inicio" header="Férias" style={{ width: '12%' }}></Column>
                <Column body={representativePagamentoTemplate} field="datapagamento" header="Pagamento" style={{ width: '10%' }}></Column>
                {!colaborador && ( 
                    <>
                        <Column body={representativeAvisoFeriasTemplate} field="aviso_ferias" header="Aviso" style={{ width: '8%' }}></Column>
                    </>
                )}
                <Column field="nrodiasferias" header="Dias" style={{ width: '8%' }}></Column>
                <Column field="nrodiasabono" header="Abono" style={{ width: '8%' }}></Column>
                <Column body={representativ13Template} field="decimo" header="13º" style={{ width: '8%' }}></Column>
                <Column body={representativeFeriasColetivasTemplate} field="ferias_coletivas" header="Coletiva" style={{ width: '8%' }}></Column>
                <Column body={representativeSituacaoTemplate} field="situacaoferias" header="Situação" style={{ width: '18%' }}></Column>
            </DataTable>
            <ModalDetalhesFerias opened={modalDetalhesFeriasOpened} evento={eventoSelecionado} aoFechar={fecharModal} />
        </>
    )
}

export default DataTableFerias;