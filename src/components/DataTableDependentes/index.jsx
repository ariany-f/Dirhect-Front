import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import './DataTable.css'
import Texto from '@components/Texto';
import Botao from '@components/Botao';
import BotaoGrupo from '@components/BotaoGrupo';
import CampoTexto from '@components/CampoTexto';
import styles from '@pages/Dependentes/Dependentes.module.css'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import http from '@http';
import { Tag } from 'primereact/tag';
import { GrAddCircle } from 'react-icons/gr';
import ModalAdicionarDependente from '@components/ModalAdicionarDependente';
import { DependenteProvider } from '@contexts/Dependente';

function DataTableDependentes({ dependentes, search = true }) {

    const[selectedDependente, setSelectedDependente] = useState(0)
    const [modalOpened, setModalOpened] = useState(false)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const navegar = useNavigate()
    const [dependentesComFuncionario, setDependentesComFuncionario] = useState([]);

    useEffect(() => {
        if (dependentes && dependentes.length > 0) {
            Promise.all(
                dependentes.map(dep =>
                    http.get(`funcionario/${dep.id_funcionario}/?format=json`)
                        .then(response => ({
                            ...dep,
                            funcionario: response
                        }))
                        .catch(error => {
                            console.log(`Erro ao buscar funcionario ${dep.id_funcionario}:`, error);
                            return dep; // mantém o dependente original
                        })
                )
            ).then(resultado => {
                setDependentesComFuncionario(resultado);
            });
        }
    }, [dependentes]);

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
    
    const representativeFuncNomeTemplate = (rowData) => {
        const cpf = rowData?.funcionario?.funcionario_pessoa_fisica?.cpf ?
        formataCPF(rowData?.funcionario?.funcionario_pessoa_fisica?.cpf)
        : '---';
        return <div key={rowData?.funcionario?.id}>
            <Texto weight={700} width={'100%'}>
                {rowData?.funcionario?.funcionario_pessoa_fisica?.nome}
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

    return (
        <>
            {search ?
                <div className="flex justify-content-end">
                    <span className="p-input-icon-left">
                        <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar dependente" />
                    </span>
                </div>
            :
                <BotaoGrupo align="end">
                    <BotaoGrupo align="center">
                        <Botao estilo="vermilion" size="small" aoClicar={() => setModalOpened(true)} tab><GrAddCircle className={styles.icon}/> Cadastrar Individualmente</Botao>
                    </BotaoGrupo>
                </BotaoGrupo>
            }
            <DataTable value={dependentesComFuncionario} filters={filters} globalFilterFields={['nome_depend', 'cpf']}  emptyMessage="Não foram encontrados dependentes" selection={selectedDependente} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={6}  tableStyle={{ minWidth: (search ? '68vw' : '48vw') }}>
                {search &&  <Column body={representativeFuncNomeTemplate} header="Funcionário" style={{ width: '35%' }}></Column>}
                <Column body={representativeNomeTemplate} header="Nome Completo" style={{ width: '35%' }}></Column>
                <Column body={representativeParentescoTemplate} header="Grau de Parentesco" style={{ width: '20%' }}></Column>
                <Column body={representativeNascimentoTemplate} header="Nascimento" style={{ width: '20%' }}></Column>
            </DataTable>
            <DependenteProvider>
                <ModalAdicionarDependente opened={modalOpened} aoFechar={() => setModalOpened(false)} />
            </DependenteProvider>
        </>
    )
}

export default DataTableDependentes