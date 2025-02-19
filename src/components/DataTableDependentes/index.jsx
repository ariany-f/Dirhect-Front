import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import './DataTable.css'
import Texto from '@components/Texto';
import BadgeGeral from '@components/BadgeGeral';
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Tag } from 'primereact/tag';

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
    
    // const representativeNomeTemplate = (rowData) => {
        
    //     return (
    //         rowData?.dados_pessoa_fisica?.nome
    //     )
    // }
    
    const representativeNascimentoTemplate = (rowData) => {
        
        return ( 
            rowData?.data_nascimento ?
            <b>{new Date(rowData?.data_nascimento).toLocaleDateString('pt-BR')}</b>
            : '---'
        )
    }
    
    const representativeFuncNomeTemplate = (rowData) => {
        const cpf = rowData?.funcionario?.dados_pessoa_fisica?.cpf ?
        formataCPF(rowData?.funcionario?.dados_pessoa_fisica?.cpf)
        : '---';
        return <div key={rowData?.funcionario?.id}>
            <Texto weight={700} width={'100%'}>
                {rowData?.funcionario?.dados_pessoa_fisica?.nome}
            </Texto>
            <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                CPF:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{cpf}</p>
            </div>
        </div>
    }
    
    
    const representativeNomeTemplate = (rowData) => {
        const cpf = rowData?.dados_pessoa_fisica?.cpf ?
        formataCPF(rowData?.dados_pessoa_fisica?.cpf)
        : '---';
        return <div key={rowData.id}>
            <Texto weight={700} width={'100%'}>
                {rowData?.dados_pessoa_fisica?.nome}
            </Texto>
            <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                CPF:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{cpf}</p>
            </div>
        </div>
    }

    

    const representativeParentescoTemplate = (rowData) => {
        let grau_parentesco = rowData?.grau_parentesco;
        switch(rowData?.grau_parentesco)
        {
            case 'Filho':
                return <Tag severity="success" value="Filho"></Tag>;
            default:
                return <Tag severity="primary" value={rowData?.grau_parentesco}></Tag>;
        }
        return (
            <Tag severity="primary" value={grau_parentesco}></Tag>
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
                <Column body={representativeParentescoTemplate} header="Grau de Parentesco" style={{ width: '20%' }}></Column>
                <Column body={representativeNascimentoTemplate} header="Nascimento" style={{ width: '20%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableDependentes