import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

function DataTableCandidatos({ candidatos }) {

    const[selectedCandidato, setSelectedCandidato] = useState(0)
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

    const representativeDataNascimentoTemplate = (rowData) => {
        return new Date(rowData.dataNascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
    }

    const representativeDataInicioTemplate = (rowData) => {
        return new Date(rowData.dataInicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
    }

    const representativeDataExameMedicoTemplate = (rowData) => {
        return new Date(rowData.dataExameMedico).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
    }

    return (
        <>
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar candidato" />
                </span>
            </div>
            <DataTable value={candidatos} filters={filters} globalFilterFields={['nome', 'email']}  emptyMessage="Não foram encontrados candidatos" selection={selectedCandidato} selectionMode="single" paginator rows={7}  tableStyle={{ minWidth: '68vw' }}>
                <Column field="nome" header="Nome" style={{ width: '15%' }}></Column>
                <Column field="email" header="E-mail" style={{ width: '25%' }}></Column>
                <Column field="telefone" header="Telefone" style={{ width: '15%' }}></Column>
                {/* <Column field="cpf" header="CPF" style={{ width: '15%' }}></Column> */}
                <Column body={representativeDataNascimentoTemplate} field="dataNascimento" header="Nascimento" style={{ width: '15%' }}></Column>
                <Column body={representativeDataExameMedicoTemplate} field="dataExameMedico" header="Data Exame Médico" style={{ width: '10%' }}></Column>
                <Column body={representativeDataInicioTemplate} field="dataInicio" header="Data Início" style={{ width: '10%' }}></Column>
                <Column field="statusDePreenchimento" header="Status" style={{ width: '10%' }}></Column>
                {/* <Column field="statusDeCandidato" header="Status Candidato" style={{ width: '10%' }}></Column> */}
            </DataTable>
        </>
    )
}

export default DataTableCandidatos