import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import CampoTexto from '@components/CampoTexto';
import Texto from '@components/Texto';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Tag } from 'primereact/tag';
import { Real } from '@utils/formats'
import { Dropdown } from 'primereact/dropdown';

function DataTableCiclos() {
    const { ciclos = [], tipoUsuario = null } = useOutletContext();
    const [selectedCiclo, setSelectedCiclo] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        tipo: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const [tiposLancamento, setTiposLancamento] = useState([]);
    const [dadosFiltrados, setDadosFiltrados] = useState([]);
    const navegar = useNavigate();

    useEffect(() => {
        // Filtra os tipos de lançamento baseado no tipo de usuário
        if (tipoUsuario === 'grupo_rh') {
            setTiposLancamento([
                { label: 'Todos', value: null },
                { label: 'Benefícios', value: 'Benefícios' }
            ]);
            // Filtra os dados para mostrar apenas benefícios e descontos
            const filtrados = Array.isArray(ciclos) ? ciclos.filter(ciclo => 
                ciclo.tipo === 'Benefícios'
            ).sort((a, b) => {
                // Ordena por ano decrescente e mês decrescente
                if (b.data_referencia.year !== a.data_referencia.year) {
                    return b.data_referencia.year - a.data_referencia.year;
                }
                return b.data_referencia.month - a.data_referencia.month;
            }) : [];
            setDadosFiltrados(filtrados);
        } else {
            setTiposLancamento([
                { label: 'Todos', value: null },
                { label: 'Adiantamento', value: 'Adiantamento' },
                { label: 'Folha de Pagamento', value: 'Folha de Pagamento' },
                { label: 'Benefícios', value: 'Benefícios' },
                { label: 'Descontos', value: 'Descontos' }
            ]);
            const filtrados = Array.isArray(ciclos) ? ciclos.sort((a, b) => {
                // Ordena por ano decrescente e mês decrescente
                if (b.data_referencia.year !== a.data_referencia.year) {
                    return b.data_referencia.year - a.data_referencia.year;
                }
                return b.data_referencia.month - a.data_referencia.month;
            }) : [];
            setDadosFiltrados(filtrados);
        }
    }, [tipoUsuario, ciclos]);

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const onTipoFilterChange = (value) => {
        let _filters = { ...filters };
        _filters['tipo'].value = value;
        setFilters(_filters);
    };

    function verDetalhes(value) {
        if (value && value.id) {
            navegar(`/ciclos/detalhes/${value.id}`);
        }
    }

    const headerTemplate = (rowData) => {
        return <b>{rowData.data_referencia.year}</b>;
    };

    const representativStatusTemplate = (rowData) => {
        let status = rowData?.status;
        switch(rowData?.status) {
            case 'Aberta':
                status = <Tag severity="success" value="Aberto"></Tag>;
                break;
            case 'Fechada':
                status = <Tag severity="danger" value="Fechado"></Tag>;
                break;
        }
        return <b>{status}</b>;
    };

    const representativeMonthTemplate = (rowData) => {
        const mes = rowData.data_referencia.month;
        const nomeMes = new Date(2000, mes - 1, 1).toLocaleString('pt-BR', { month: 'long' });
        return nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);
    };

    const representativeTipoTemplate = (rowData) => {
        return (
            <div key={rowData.id}>
                <Texto weight={700} width={'100%'}>
                    {rowData.tipo}
                </Texto>
                <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                    Colaboradores:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData.total_colaboradores}</p>
                </div>
            </div>
        );
    };

    const tipoFilterTemplate = () => {
        return (
            <Dropdown
                value={filters.tipo.value}
                options={tiposLancamento}
                onChange={(e) => onTipoFilterChange(e.value)}
                placeholder="Filtrar por tipo"
                className="p-column-filter"
                showClear
                style={{ minWidth: '12rem' }}
            />
        );
    };
    
    return (
        <>
            <div className="flex justify-content-between mb-3">
                <div className="flex align-items-center">
                    <span className="p-input-icon-left mr-2">
                        <CampoTexto width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar" />
                    </span>
                </div>
            </div>
            <DataTable 
                value={dadosFiltrados} 
                groupRowsBy="data_referencia.year" 
                rowGroupHeaderTemplate={headerTemplate} 
                rowGroupMode="subheader" 
                filters={filters} 
                globalFilterFields={['tipo', 'data', 'status']} 
                emptyMessage="Não foram encontrados ciclos" 
                selection={selectedCiclo} 
                onSelectionChange={(e) => verDetalhes(e.value)} 
                selectionMode="single" 
                paginator 
                rows={10}  
                tableStyle={{ minWidth: '68vw' }}
                sortMode="single"
                sortField="data_referencia.year"
                sortOrder={-1}
            >
                <Column body={representativeTipoTemplate} field="tipo" header="Tipo" style={{ width: '35%' }} filterField="tipo" filter={tipoUsuario === 'grupo_rh'} filterElement={tipoFilterTemplate}></Column>
                <Column body={representativeMonthTemplate} field="data_referencia.month" header="Mês Referência" style={{ width: '35%' }}></Column>
                <Column field="data" header="Data de Pagamento" style={{ width: '35%' }}></Column>
                <Column body={representativStatusTemplate} field="status" header="Status" style={{ width: '35%' }}></Column>
            </DataTable>
        </>
    );
}

export default DataTableCiclos;