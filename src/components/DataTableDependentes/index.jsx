import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import './DataTable.css'
import Texto from '@components/Texto';
import Botao from '@components/Botao';
import BotaoGrupo from '@components/BotaoGrupo';
import CampoTexto from '@components/CampoTexto';
import styles from '@pages/Dependentes/Dependentes.module.css'
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import http from '@http';
import { Tag } from 'primereact/tag';
import { GrAddCircle } from 'react-icons/gr';
import ModalAdicionarDependente from '@components/ModalAdicionarDependente';
import { DependenteProvider } from '@contexts/Dependente';
import { useTranslation } from 'react-i18next';

function DataTableDependentes({ dependentes, search = true, sortField, sortOrder, onSort }) {

    const[selectedDependente, setSelectedDependente] = useState(0)
    const [modalOpened, setModalOpened] = useState(false)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const navegar = useNavigate()
    const { t } = useTranslation('common');

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    function verDetalhes(value)
    {
        setSelectedDependente(value.id)
        navegar(`/colaborador/detalhes/${value.id_funcionario}/dependentes/${value.id}`)
    }
    
    function formataCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
   
    const representativeCPFTemplate = (rowData) => {
    
        return (
            formataCPF(rowData?.dependente_pessoa_fisica?.cpf)
        )
    }
    
    const representativeNascimentoTemplate = (rowData) => {
        
        return ( 
            rowData?.dtnascimento ?
            <Texto weight={500}>{new Date(rowData?.dtnascimento).toLocaleDateString('pt-BR')}</Texto>
            : '---'
        )
    }

    const representativeIdadeTemplate = (rowData) => {
        const calcularIdade = (dataNascimento) => {
            const hoje = new Date();
            const nascimento = new Date(dataNascimento);
            let idade = hoje.getFullYear() - nascimento.getFullYear();
            const mes = hoje.getMonth() - nascimento.getMonth();
    
            if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
                idade--;
            }
    
            return idade;
        };
    
        return (
            rowData?.dtnascimento ?
            <Texto weight={500}>
                {calcularIdade(rowData.dtnascimento)} anos
            </Texto>
            : '---'
        );
    };
    
    
    const representativeFuncNomeTemplate = (rowData) => {
        const cpf = rowData?.funcionario_pessoa_fisica?.cpf ?
        formataCPF(rowData?.funcionario_pessoa_fisica?.cpf)
        : '---';
        return <div key={rowData?.funcionario?.id}>
            <Texto weight={700} width={'100%'}>
                {rowData?.funcionario_pessoa_fisica?.nome}
            </Texto>
            <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                CPF:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{cpf}</p>
            </div>
        </div>
    }
    
    
    const representativeNomeTemplate = (rowData) => {
        const cpf = rowData?.cpf ?
        formataCPF(rowData?.cpf)
        : '---';
        return <div key={rowData.id}>
            <Texto weight={700} width={'100%'}>
                {rowData?.nome_depend}
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

    const handleSort = (event) => {
        if (onSort) {
            onSort({
                field: event.sortField,
                order: event.sortOrder === 1 ? 'asc' : 'desc'
            });
        }
    };

    return (
        <>
            <BotaoGrupo align="space-between">
                {search &&
                    <div className="flex justify-content-end">
                        <span className="p-input-icon-left">
                            <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar dependente" />
                        </span>
                    </div>
                }
            </BotaoGrupo>
            
            <DataTable 
                value={dependentes} 
                filters={filters} 
                globalFilterFields={['nome_depend', 'cpf']}  
                emptyMessage="Não foram encontrados dependentes" 
                selection={selectedDependente} 
                onSelectionChange={(e) => verDetalhes(e.value)} 
                selectionMode="single" 
                paginator 
                rows={10}  
                tableStyle={{ minWidth: (search ? '68vw' : '48vw') }}
                sortField={sortField}
                sortOrder={sortOrder === 'desc' ? -1 : 1}
                onSort={handleSort}
                removableSort
            >
                {search &&  <Column body={representativeFuncNomeTemplate} sortField="id_funcionario_id" header="Funcionário" sortable field="funcionario_pessoa_fisica__nome" style={{ width: '30%' }}></Column>}
                <Column body={representativeNomeTemplate} header="Nome Completo" sortable field="nome_depend" style={{ width: '30%' }}></Column>
                <Column body={representativeParentescoTemplate} header="Grau de Parentesco" sortable field="grau_parentesco" style={{ width: '20%' }}></Column>
                <Column body={representativeNascimentoTemplate} header="Nascimento" sortable field="dtnascimento" style={{ width: '15%' }}></Column>
                <Column body={representativeIdadeTemplate} header="Idade" style={{ width: '25%' }}></Column>
            </DataTable>
            <DependenteProvider>
                <ModalAdicionarDependente opened={modalOpened} aoFechar={() => setModalOpened(false)} />
            </DependenteProvider>
        </>
    )
}

export default DataTableDependentes