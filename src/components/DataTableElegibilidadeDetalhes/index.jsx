import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import BadgeGeral from '@components/BadgeGeral';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});


const Col12 = styled.div`
    display: flex;
    width: 100%;
    gap: 24px;
    flex-wrap: wrap;
`

const Col6 = styled.div`
    display: inline-flex;
    align-items: start;
    justify-content: center;
    gap: 8px;
    flex-direction: column;
`

function DataTableElegibilidadeDetalhes({ elegibilidade, pagination = true }) {

    const[selectedVaga, setSelectedVaga] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [expandedRows, setExpandedRows] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const navegar = useNavigate()

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const representativeValorTemplate = (rowData) => {
        return (
            Real.format(rowData.valor)
        )
    }
    
    const representativeBeneficiosTemplate = (rowData) => {
        console.log(rowData)
        return (
            <>
            {rowData.beneficios && rowData.beneficios.length > 0 &&
                <Col12>
                {rowData.beneficios.map((benefit, index) => {
                    return (
                        <Col6 key={index}>
                            <BadgeGeral nomeBeneficio={`${benefit.beneficio} ${representativeValorTemplate(benefit)}`} />
                        </Col6>
                    )
                })}
                </Col12>
           }
           </>
        )
    }

    const rowExpansionTemplate = (data) => {
        return (
            <div className="card">
                <DataTable emptyMessage="Não foram encontrados benefícios" tableStyle={{ minWidth: '65vw' }} value={data.beneficios}>
                    <Column field="beneficio" header="Benefício"></Column>
                    <Column body={representativeValorTemplate} field="valor" header="Valor"></Column>
                </DataTable>
            </div>
        );
    };
    
    const allowExpansion = (rowData) => {
        return rowData.beneficios.length > 0;
    };
    
    return (
        <>
            <DataTable expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} rowExpansionTemplate={rowExpansionTemplate} value={elegibilidade} filters={filters} globalFilterFields={['data_inicio']}  emptyMessage="Não foram encontrados elegibilidade" paginator={pagination} rows={7}  tableStyle={{ minWidth: '68vw' }}>
                {/* <Column expander={allowExpansion} style={{ width: '5%' }} /> */}
                <Column field="nome_fornecedor" header="Contrato" style={{ width: '35%' }}></Column>
                <Column body={representativeBeneficiosTemplate} field="beneficios" header="Benefícios" style={{ width: '35%' }}></Column>
                <Column field="data_inicio" header="Data Início" style={{ width: '35%' }}></Column>
                <Column field="data_fim" header="Data Fim" style={{ width: '35%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableElegibilidadeDetalhes