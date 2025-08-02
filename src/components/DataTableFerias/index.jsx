import { DataTable } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { Tooltip } from 'primereact/tooltip';
import './DataTable.css'
import Texto from '@components/Texto';
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import Botao from '@components/Botao';
import { FaUmbrellaBeach } from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario';
import { Tag } from 'primereact/tag';
import { ArmazenadorToken } from '@utils';
import ModalDetalhesFerias from '@components/ModalDetalhesFerias';
import { FaCheckCircle, FaTimesCircle, FaClock, FaExclamationTriangle, FaLock, FaLockOpen } from 'react-icons/fa';
import { Toast } from 'primereact/toast';

function formatarDataBr(data) {
    if (!data) return '-';
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
    setPageSize
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

    function verDetalhes(value) {
        setSelectedFerias(value.id);
    }

    function formataCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    
    const representativeInicioTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{formatarDataBr(rowData.dt_inicio)}</p>;
    }
    
    const representativeFimTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{formatarDataBr(rowData.dt_fim)}</p>;
    }
    
    const representativeInicioAquisicaoTemplate = (rowData) => {
        if (!rowData.fimperaquis) return <p style={{fontWeight: '400'}}>-</p>;
        const [ano, mes, dia] = rowData.fimperaquis.split('T')[0].split('-').map(Number);
        // Subtrai 1 ano
        let dataInicio = new Date(ano - 1, mes - 1, dia);
        // Soma 1 dia
        dataInicio.setDate(dataInicio.getDate() + 1);
        // Formata DD/MM/AAAA
        const diaStr = String(dataInicio.getDate()).padStart(2, '0');
        const mesStr = String(dataInicio.getMonth() + 1).padStart(2, '0');
        const anoStr = dataInicio.getFullYear();
        return <p style={{fontWeight: '400'}}>{`${diaStr}/${mesStr}/${anoStr}`}</p>;
    }

    const fecharModal = (resultado) => {
        setModalDetalhesFeriasOpened(false);
        setEventoSelecionado(null);
        if (resultado) {
            if (resultado.sucesso) {
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: resultado.mensagem, life: 3000 });
                // Adicione uma callback para atualizar a lista se necessário
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
        return <p style={{fontWeight: '400'}}>{rowData.datapagamento ? formatarDataBr(rowData.datapagamento) : '-'}</p>;
    }
    
    const representativeFimAquisicaoTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{formatarDataBr(rowData.fimperaquis)}</p>;
    }

    const representativeSituacaoTemplate = (rowData) => {
        let tag = rowData?.situacaoferias;
        if(rowData.dt_fim && rowData.dt_inicio)
        {
            switch(rowData?.situacaoferias)
            {
                case 'G': // Aguardando Aprovação do Gestor
                    tag = <Tag severity="warning" value="Aguardando Gestor"></Tag>;
                    break;
                case 'D': // Aguardando Aprovação do DP
                    tag = <Tag severity="info" value="Aguardando DP"></Tag>;
                    break;
                case 'M': // Marcadas
                    tag = <Tag severity="success" value="Marcadas"></Tag>;
                    break;
                case 'P': // Pagas
                    tag = <Tag severity="success" value="Pagas"></Tag>;
                    break;
                case 'F': // Finalizadas
                    tag = <Tag severity="danger" value="Finalizadas"></Tag>;
                    break;
                case 'X': // Finalizadas para o próximo mês
                    tag = <Tag severity="danger" value="Finalizadas Próximo Mês"></Tag>;
                    break;
                // Status antigos (mantidos para compatibilidade)
                case 'A': // Aprovada
                    tag = <Tag severity="success" value="Aprovada"></Tag>;
                    break;
                case 'S': // Solicitada
                    tag = <Tag severity="info" value="Solicitada"></Tag>;
                    break;
                case 'E': // Em Andamento
                    tag = <Tag severity="info" value="Em Andamento"></Tag>;
                    break;
                case 'C': // Cancelada
                    tag = <Tag severity="danger" value="Cancelada"></Tag>;
                    break;
                case 'R': // Rejeitada
                    tag = <Tag severity="danger" value="Rejeitada"></Tag>;
                    break;
                default:
                    if(ArmazenadorToken.hasPermission('add_ferias'))
                    {
                        let [anoRow, mesRow, diaRow] = rowData.fimperaquis.split('T')[0].split('-').map(Number);
                        // Subtrai 1 ano
                        let dataInicioRow = new Date(anoRow - 1, mesRow - 1, diaRow);
                        // Soma 1 dia
                        dataInicioRow.setDate(dataInicioRow.getDate() + 1);

                        const ev = {
                            colab: {
                                id: rowData.funcionario.id,
                                nome: rowData.funcionario_nome,
                                gestor: rowData.gestor || null
                            },
                            evento: {
                                periodo_aquisitivo_inicio: dataInicioRow,
                                periodo_aquisitivo_fim: rowData.fimperaquis,
                                saldo_dias: rowData.nrodiasferias,
                                limite: rowData.fimperaquis
                            },
                            tipo: 'aSolicitar'
                        }
                        tag = <Botao aoClicar={() => marcarFerias(ev)} estilo="vermilion" size="small" tab><FaUmbrellaBeach fill="var(--secundaria)" color="var(--secundaria)" size={16}/>Solicitar</Botao>;
                    } else {
                        tag = <Tag severity="info" value="N/A"></Tag>;
                    }
                    break;
            }
        } else {
            if(ArmazenadorToken.hasPermission('add_ferias'))
            {
                let [anoRow, mesRow, diaRow] = rowData.fimperaquis.split('T')[0].split('-').map(Number);
                // Subtrai 1 ano
                let dataInicioRow = new Date(anoRow - 1, mesRow - 1, diaRow);
                // Soma 1 dia
                dataInicioRow.setDate(dataInicioRow.getDate() + 1);

                const ev = {
                    colab: {
                        id: rowData.funcionario.id,
                        nome: rowData.funcionario_nome,
                        gestor: rowData.gestor || null
                    },
                    evento: {
                        periodo_aquisitivo_inicio: dataInicioRow,
                        periodo_aquisitivo_fim: rowData.fimperaquis,
                        saldo_dias: rowData.nrodiasferias,
                        limite: rowData.fimperaquis
                    },
                    tipo: 'aSolicitar'
                }
                tag = <Botao aoClicar={() => marcarFerias(ev)} estilo="vermilion" size="small" tab><FaUmbrellaBeach fill="var(--secundaria)" color="var(--secundaria)" size={16}/>Solicitar</Botao>;
            } else {
                tag = <Tag severity="info" value="N/A"></Tag>;
            }
        }
        return <p style={{fontWeight: '400'}}>{tag}</p>
    }

    function marcarFerias(rowData) {
        setEventoSelecionado(rowData)
        setModalDetalhesFeriasOpened(true)
    }
    
    const representativeColaboradorTemplate = (rowData) => {
       
        return <div key={rowData.id}>
            <Texto weight={700} width={'100%'}>
                {rowData?.dados_pessoa_fisica?.nome ?? rowData.funcionario_nome}
            </Texto>
            <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                Dias de Férias:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData.nrodiasferias ?? 0}</p>
            </div>
            <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                Dias de Abono:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData.nrodiasabono ?? 0}</p>
            </div>
        </div>
    }

    
    const representativ13Template = (rowData) => {
        let tag = rowData?.decimo;
        let tooltipText = '';
        
        switch(rowData?.decimo)
        {
            case 'Sim':
                tag = <Tag severity="success" value="Sim"></Tag>;
                tooltipText = '13º Salário: Sim';
                break;
            case 'Não':
                tag = <Tag severity="danger" value="Não"></Tag>;
                tooltipText = '13º Salário: Não';
                break;
            default:
                tag = '-';
                tooltipText = '13º Salário: Não informado';
                break;
        }
        return (
            <div style={{ cursor: 'help' }}>
                <Tooltip target=".decimo-tag" />
                <div className="decimo-tag" data-pr-tooltip={tooltipText}>
                    <b>{tag}</b>
                </div>
            </div>
        )
    }

    const representativePeriodoAbertoTemplate = (rowData) => {
        const isPeriodoAberto = rowData?.periodo_aberto === true;
        const isPeriodoPerdido = rowData?.periodo_perdido === true;
        
        return (
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <Tooltip target=".periodo-aberto-icon" />
                {isPeriodoAberto ? (
                    <FaLockOpen 
                        className="periodo-aberto-icon"
                        data-pr-tooltip="Período Aberto"
                        size={16} 
                        color="#10B981" 
                        fill="#10B981"
                        style={{
                            filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.3))',
                            cursor: 'help'
                        }}
                    />
                ) : (
                    <FaLock 
                        className="periodo-aberto-icon"
                        data-pr-tooltip="Período Fechado"
                        size={16} 
                        color="#F59E0B" 
                        fill="#F59E0B"
                        style={{
                            filter: 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.3))',
                            cursor: 'help'
                        }}
                    />
                )}
                <Tooltip target=".periodo-perdido-icon" />
                {isPeriodoPerdido ? (
                    <FaExclamationTriangle 
                        className="periodo-perdido-icon"
                        data-pr-tooltip="Período Perdido"
                        size={16} 
                        color="#EF4444" 
                        fill="#EF4444"
                        style={{
                            filter: 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.3))'
                        }}
                    />
                ) : (
                    <></>
                )}
            </div>
        );
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
                tableStyle={{ minWidth: (!colaborador ? '68vw' : '48vw') }}
            >
                {!colaborador && <Column body={representativeColaboradorTemplate} field="colaborador_id" header="Colaborador" style={{ width: '30%' }}></Column>}
                <Column body={representativeInicioAquisicaoTemplate} field="data_inicio_aquisicao" header="Inicio Aquisição" style={{ width: '15%' }}></Column>
                <Column body={representativeFimAquisicaoTemplate} field="data_fim_aquisicao" header="Fim Aquisição" style={{ width: '15%' }}></Column>
                <Column body={representativePeriodoAbertoTemplate} field="periodo_aberto" header="Período" style={{ width: '10%' }}></Column>
                <Column body={representativeInicioTemplate} field="data_inicio" header="Inicio Férias" style={{ width: '15%' }}></Column>
                <Column body={representativeFimTemplate} field="data_fim" header="Fim Férias" style={{ width: '15%' }}></Column>
                <Column body={representativePagamentoTemplate} field="datapagamento" header="Pagamento" style={{ width: '12%' }}></Column>
                {colaborador && (
                    <>
                        <Column field="nrodiasabono" header="Abono" style={{ width: '10%' }}></Column>
                        <Column field="nrodiasferias" header="Férias" style={{ width: '10%' }}></Column>
                    </>
                )} 
                <Column body={representativ13Template} field="decimo" header="13º" style={{ width: '10%' }}></Column>
                <Column body={representativeSituacaoTemplate} field="situacaoferias" header="Situação" style={{ width: '15%' }}></Column>
            </DataTable>
            <ModalDetalhesFerias opened={modalDetalhesFeriasOpened} evento={eventoSelecionado} aoFechar={fecharModal} />
        </>
    )
}

export default DataTableFerias;