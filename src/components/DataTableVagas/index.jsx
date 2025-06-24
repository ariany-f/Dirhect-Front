import { DataTable } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Real } from '@utils/formats'
import { FaUserAlt } from 'react-icons/fa';
import { Tag } from 'primereact/tag';
import http from '@http';

function DataTableVagas({ vagas: initialVagas }) {

    const[selectedVaga, setSelectedVaga] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [vagas, setVagas] = useState(initialVagas || []);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const navegar = useNavigate()

    useEffect(() => {
        setVagas(initialVagas || []);
    }, [initialVagas]);

    const fetchVagas = (field = null, order = null) => {
        let ordering = '';
        if (field) {
            ordering = order === 1 ? field : `-${field}`;
        }
        http.get(`vagas/?ordering=${ordering}`)
            .then(response => setVagas(response))
            .catch(() => setVagas([]));
    };

    const onSort = (e) => {
        setSortField(e.sortField);
        setSortOrder(e.sortOrder);
        fetchVagas(e.sortField, e.sortOrder);
    };

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    function verDetalhes(value)
    {
        setSelectedVaga(value)
        navegar(`/vagas/detalhes/${value.id}`)
    }

    const representativeSalarioTemplate = (rowData) => {       
        return <b>{(Real.format(rowData.salario))}</b>
    };

    const representativeAberturaTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{new Date(rowData.dt_abertura).toLocaleDateString("pt-BR")}</p>
    }
    
    const representativeEncerramentoTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{new Date(rowData.dt_encerramento).toLocaleDateString("pt-BR")}</p>
    }
    
    const representativeNumeroColaboradoresTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}><FaUserAlt /> {rowData?.total_candidatos ?? 0}</p>
    }

    const representativeTituloTemplate = (rowData) => {
        return <p style={{fontWeight: '600'}}>{rowData.titulo}</p>
    }

    const representativeAprovadosTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}><FaUserAlt /> {rowData?.candidatos_aprovados ?? 0}</p>
    }

    const representativeStatusTemplate = (rowData) => {
        const hoje = new Date();
        const abertura = new Date(rowData.dt_abertura);
        const encerramento = new Date(rowData.dt_encerramento);
        let status = rowData.status;
        let color = 'var(--green-500)';

        if (hoje < abertura) {
            status = 'Aguardando';
            color = 'var(--neutro-400)';
        } else if (hoje > encerramento) {
            status = 'Encerrada';
            color = 'var(--error)';
        } else {
            switch (status) {
                case 'A':
                    status = 'Aberta';
                    color = 'var(--green-500)';
                    break;
                case 'F':
                    status = 'Fechada';
                    color = 'var(--error)';
                    break;
            }
        }

        return (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Tag value={status} style={{ backgroundColor: color, color: 'white', fontWeight: 600, fontSize: 13, borderRadius: 8, padding: '4px 12px', textTransform: 'capitalize' }} />
            </div>
        );
    }

    return (
        <>
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar vaga" />
                </span>
            </div>
            <DataTable
                value={vagas}
                filters={filters}
                globalFilterFields={['titulo']}
                emptyMessage="Não foram encontradas vagas"
                selection={selectedVaga}
                onSelectionChange={(e) => verDetalhes(e.value)}
                selectionMode="single"
                paginator
                rows={10}
                tableStyle={{ minWidth: '68vw' }}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={onSort}
            >
                <Column body={representativeTituloTemplate} field="titulo" header="Titulo" style={{ width: '20%' }} sortable></Column>
                <Column field="descricao" header="Descrição" style={{ width: '25%' }} sortable></Column>
                <Column body={representativeAberturaTemplate} sortable header="Abertura" style={{ width: '15%' }}></Column>
                <Column body={representativeEncerramentoTemplate} header="Encerramento" style={{ width: '15%' }} sortable></Column>
                <Column body={representativeStatusTemplate} header="Status" style={{ width: '12%' }}></Column>
                <Column body={representativeNumeroColaboradoresTemplate} header="Candidatos" style={{ width: '10%' }}></Column>
                <Column body={representativeAprovadosTemplate} header="Aprovados" style={{ width: '10%' }}></Column>
                <Column body={representativeSalarioTemplate} header="Salário" style={{ width: '15%' }} sortable></Column>
            </DataTable>
        </>
    )
}

export default DataTableVagas