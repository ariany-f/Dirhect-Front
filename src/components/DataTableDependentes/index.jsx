import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
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

function DataTableDependentes({ 
    dependentes, 
    search = true, 
    sortField, 
    sortOrder, 
    onSort,
    paginator = false,
    rows = 10,
    totalRecords = 0,
    first = 0,
    onPage,
    onSearch,
    showSearch = true,
    searchValue
}) {

    const[selectedDependente, setSelectedDependente] = useState(0)
    const [modalOpened, setModalOpened] = useState(false)
    const navegar = useNavigate()
    const { t } = useTranslation('common');

    const onGlobalFilterChange = (value) => {
        if (onSearch) {
            onSearch(value);
        }
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
        let grau_parentesco = rowData?.grau_parentesco_descricao;
        
        if (!grau_parentesco) {
            return <Tag severity="secondary" value="Não definido"></Tag>;
        }
        
        switch(rowData?.grau_parentesco)
        {
            case 'Filho':
                return <Tag severity="success" value="Filho"></Tag>;
            default:
                return <Tag severity="primary" value={rowData?.grau_parentesco_descricao}></Tag>;
        }
    }

    const totalDependentesTemplate = () => {
        return 'Total de Dependentes: ' + (totalRecords ?? 0);
    };

    return (
        <>
            <BotaoGrupo align="space-between">
                {search && showSearch &&
                    <div className="flex justify-content-end">
                        <span className="p-input-icon-left">
                            <CampoTexto  width={'320px'} valor={searchValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar dependente" />
                        </span>
                    </div>
                }
            </BotaoGrupo>
            
            <DataTable 
                value={dependentes} 
                emptyMessage="Não foram encontrados dependentes" 
                selection={selectedDependente} 
                onSelectionChange={(e) => verDetalhes(e.value)} 
                selectionMode="single" 
                paginator={paginator}
                lazy={paginator}
                rows={rows} 
                totalRecords={totalRecords}
                first={first}
                onPage={onPage}
                tableStyle={{ minWidth: (search ? '68vw' : '48vw') }}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={onSort}
                removableSort
                showGridlines
                stripedRows
                footerColumnGroup={
                    paginator ? (
                        <ColumnGroup>
                            <Row>
                                <Column footer={totalDependentesTemplate} style={{ textAlign: 'right', fontWeight: 600 }} />
                            </Row>
                        </ColumnGroup>
                    ) : null
                }
            >
                {search &&  <Column body={representativeFuncNomeTemplate} sortField="id_funcionario_id" header="Funcionário" sortable field="funcionario_pessoa_fisica__nome" style={{ width: '30%' }}></Column>}
                <Column body={representativeNomeTemplate} header="Nome Completo" sortable field="nome_depend" style={{ width: '30%' }}></Column>
                <Column body={representativeParentescoTemplate} header="Grau de Parentesco" sortable field="grau_parentesco" style={{ width: '25%' }}></Column>
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