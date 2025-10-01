import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import Container from '@components/Container';
import TabelasSistemaNavigation from '@components/TabelasSistemaNavigation';
import http from '@http';
import styled from 'styled-components';

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`;

const TableHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

const Title = styled.h1`
    color: var(--primaria);
    font-size: 24px;
    font-weight: 600;
    margin: 0;
`;

const SearchContainer = styled.div`
    position: relative;
    
    .p-inputtext {
        padding-left: 35px;
        border-radius: 6px;
        border: 1px solid #ddd;
        width: 300px;
    }
    
    .search-icon {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: #666;
        font-size: 16px;
    }
`;

function TipoSanguineo() {
    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const toast = useRef(null);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            setLoading(true);
            const response = await http.get('tabela_dominio/tipo_sanguineo/');
            setDados(response.registros || response);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao carregar os dados da tabela.',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <TableHeader>
                <SearchContainer>
                    <i className="pi pi-search search-icon"></i>
                    <InputText
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Buscar..."
                    />
                </SearchContainer>
            </TableHeader>
        );
    };

    const idBodyTemplate = (rowData) => {
        return <span style={{ fontWeight: 'bold', color: '#666' }}>{rowData.id}</span>;
    };

    const idOrigemBodyTemplate = (rowData) => {
        return (
            <span style={{ 
                background: '#f0f0f0', 
                padding: '4px 8px', 
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '12px'
            }}>
                {rowData.id_origem}
            </span>
        );
    };

    const header = renderHeader();

    return (
        <ConteudoFrame>
            <Toast ref={toast} />
            
            <TabelasSistemaNavigation currentPath="/tabelas-de-sistema/tipo-sanguineo" />
            
            <Container>
                <DataTable
                    value={dados}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} tipo-sanguineo"
                    loading={loading}
                    header={header}
                    filters={filters}
                    globalFilterFields={['id_origem', 'descricao']}
                    emptyMessage="Nenhum registro encontrado."
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    tableStyle={{ minWidth: '50rem' }}
                    stripedRows
                    showGridlines
                >
                    <Column 
                        field="id" 
                        header="ID" 
                        body={idBodyTemplate}
                        style={{ width: '30%' }}
                        sortable 
                    />
                    <Column 
                        field="id_origem" 
                        header="Código" 
                        body={idOrigemBodyTemplate}
                        style={{ width: '30%' }}
                        sortable 
                    />
                    <Column 
                        style={{ width: '40%' }}
                        field="descricao" 
                        header="Descrição" 
                        sortable 
                    />
                </DataTable>
            </Container>
        </ConteudoFrame>
    );
}

export default TipoSanguineo;
