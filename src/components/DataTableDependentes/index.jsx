import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function DataTableDependentes({ dependentes, search = true }) {

    const[selectedDependente, setSelectedDependente] = useState(0)
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
        setSelectedDependente(value.id)
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
    
    const representativeFuncNomeTemplate = (rowData) => {
        
        return (
            rowData?.funcionario?.dados_pessoa_fisica?.nome
        )
    }

    return (
        <>
            {search &&
                <div className="flex justify-content-end">
                    <span className="p-input-icon-left">
                        <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar dependente" />
                    </span>
                </div>
            }
            <DataTable value={dependentes} filters={filters} globalFilterFields={['dados_pessoa_fisica.nome', 'dados_pessoa_fisica.cpf']}  emptyMessage="Não foram encontrados dependentes" selection={selectedDependente} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={6}  tableStyle={{ minWidth: '68vw' }}>
                <Column body={representativeFuncNomeTemplate} header="Funcionário" style={{ width: '35%' }}></Column>
                <Column body={representativeNomeTemplate} header="Nome Completo" style={{ width: '35%' }}></Column>
                <Column body={representativeCPFTemplate} header="CPF" style={{ width: '20%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableDependentes