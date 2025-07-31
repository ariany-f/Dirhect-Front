import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import './DataTable.css'
import Texto from '@components/Texto';
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario';
import { Tag } from 'primereact/tag';

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
    const [filteredData, setFilteredData] = useState([])
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const navegar = useNavigate();
    const { usuario } = useSessaoUsuarioContext();

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

    const representativePagamentoTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{formatarDataBr(rowData.datapagamento)}</p>;
    }
    
    const representativeFimAquisicaoTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{formatarDataBr(rowData.fimperaquis)}</p>;
    }

    const representativeSituacaoTemplate = (rowData) => {
        let tag = rowData?.situacaoferias;
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
                tag = <Tag severity="info" value={rowData?.situacaoferias || 'N/A'}></Tag>;
                break;
        }
        return <p style={{fontWeight: '400'}}>{tag}</p>
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
        switch(rowData?.decimo)
        {
            case 'Sim':
                tag = <Tag severity="success" value="Sim"></Tag>;
                break;
            case 'Não':
                tag = <Tag severity="danger" value="Não"></Tag>;
                break;
            default:
                tag = <Tag severity="danger" value="Não"></Tag>;
                break;
        }
        return (
            <b>{tag}</b>
        )
    }
    
    useEffect(() => {
        if(ferias)
        {
            if(colaborador)
            {
                setFilteredData(ferias.filter(feria => feria.funcionario.id == colaborador))
            }
            else
            {
                setFilteredData(ferias)
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
            {!colaborador &&
            <div className="flex justify-content-space-between">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar por colaborador" />
                </span>
            </div>}
            <DataTable 
                value={filteredData} 
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
                <Column body={representativeInicioTemplate} field="data_inicio" header="Inicio Férias" style={{ width: '15%' }}></Column>
                <Column body={representativeFimTemplate} field="data_fim" header="Fim Férias" style={{ width: '15%' }}></Column>
                <Column body={representativePagamentoTemplate} field="datapagamento" header="Pagamento" style={{ width: '15%' }}></Column>
                {colaborador && 
                <>
                    <Column field="nrodiasabono" header="Abono" style={{ width: '10%' }}></Column>
                    <Column field="nrodiasferias" header="Férias" style={{ width: '10%' }}></Column>
                </>
                }
                <Column body={representativ13Template} field="decimo" header="13º" style={{ width: '10%' }}></Column>
                <Column body={representativeSituacaoTemplate} field="situacaoferias" header="Situação" style={{ width: '10%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableFerias;