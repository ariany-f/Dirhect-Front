import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function DataTableColaboradores({ colaboradores }) {

    const[selectedCollaborator, setSelectedCollaborator] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
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

    function verDetalhes(value)
    {
        setSelectedCollaborator(value)
        navegar(`/colaborador/detalhes/${value.id}`)
    }
    
    function formataCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    
    const representativeCPFTemplate = (rowData) => {
    
        return (
            formataCPF(rowData?.dados_pessoa_fisica?.cpf)
        )
    }
    
    const representativeNomeTemplate = (rowData) => {
        
        return (
            rowData?.dados_pessoa_fisica?.nome
        )
    }

    return (
        <>
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar colaborador" />
                </span>
            </div>
            <DataTable value={colaboradores} filters={filters} globalFilterFields={['dados_pessoa_fisica.nome', 'dados_pessoa_fisica.cpf']}  emptyMessage="Não foram encontrados colaboradores" selection={selectedCollaborator} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={7} tableStyle={{ minWidth: '68vw' }}>
                <Column body={representativeNomeTemplate} header="Nome Completo" style={{ width: '35%' }}></Column>
                <Column body={representativeCPFTemplate} header="CPF" style={{ width: '20%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableColaboradores