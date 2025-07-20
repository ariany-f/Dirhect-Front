import { DataTable } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Real } from '@utils/formats'
import { FaUserAlt } from 'react-icons/fa';
import { Tag } from 'primereact/tag';
import http from '@http';

function DataTableVagas({ 
    vagas: initialVagas,
    // Props para paginação via servidor
    paginator = false,
    rows = 10,
    totalRecords = 0,
    first = 0,
    onPage,
    onSearch,
    onSort,
    sortField,
    sortOrder,
    showSearch = true
}) {

    const[selectedVaga, setSelectedVaga] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const [vagas, setVagas] = useState(initialVagas || []);
    const navegar = useNavigate()

    useEffect(() => {
        setVagas(initialVagas || []);
    }, [initialVagas]);

    const onGlobalFilterChange = (value) => {
        setGlobalFilterValue(value);
        if (onSearch) {
            onSearch(value);
        }
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
                case 'T':
                    status = 'Transferida';
                    color = 'var(--warning)';
                    break;
            }
        }

        return (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Tag value={status} style={{ backgroundColor: color, color: 'white', fontWeight: 600, fontSize: 13, borderRadius: 8, padding: '4px 12px', textTransform: 'capitalize' }} />
            </div>
        );
    }

    const handleSort = (event) => {
        if (onSort) {
            onSort({
                field: event.sortField,
                order: event.sortOrder === 1 ? 'asc' : 'desc'
            });
        }
    };

    const totalVagasTemplate = () => {
        return 'Total de Vagas: ' + (totalRecords ?? 0);
    };

    return (
        <>
            {showSearch &&
                <div className="flex justify-content-end">
                    <span className="p-input-icon-left">
                        <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar vaga" />
                    </span>
                </div>
            }
            <DataTable
                value={vagas}
                emptyMessage="Não foram encontradas vagas"
                selection={selectedVaga}
                onSelectionChange={(e) => verDetalhes(e.value)}
                selectionMode="single"
                paginator={paginator}
                lazy={paginator}
                rows={rows}
                totalRecords={totalRecords}
                first={first}
                onPage={onPage}
                tableStyle={{ minWidth: '68vw' }}
                sortField={sortField}
                sortOrder={sortOrder === 'desc' ? -1 : 1}
                onSort={handleSort}
                removableSort
                showGridlines
                stripedRows
                footerColumnGroup={
                    paginator ? (
                        <ColumnGroup>
                            <Row>
                                <Column footer={totalVagasTemplate} style={{ textAlign: 'right', fontWeight: 600 }} />
                            </Row>
                        </ColumnGroup>
                    ) : null
                }
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