import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Real } from '@utils/formats'
import { Tag } from 'primereact/tag';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { Tooltip } from 'primereact/tooltip';

function DataTableCandidatos({ candidatos }) {

    const[selectedCandidato, setSelectedCandidato] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const navegar = useNavigate()
    const [listaCandidatos, setListaCandidatos] = useState(candidatos || []);

    useEffect(() => {
        setListaCandidatos(candidatos)
    }, [candidatos])

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

    const representativeStatusPreenchimentoTemplate = (rowData) => {
        const status = rowData.statusDePreenchimento;
        let color = 'var(--neutro-400)';
        if (status?.toLowerCase() === 'preenchido') color = 'var(--green-500)';
        else if (status?.toLowerCase() === 'em análise') color = 'var(--primaria)';
        else if (status?.toLowerCase() === 'rejeitado') color = 'var(--error)';
        return (
            <Tag
                value={status}
                style={{
                    backgroundColor: color,
                    color: 'white',
                    fontWeight: 600,
                    fontSize: 13,
                    borderRadius: 8,
                    padding: '4px 12px',
                    textTransform: 'capitalize'
                }}
            />
        );
    };

    const representativeStatusCandidatoTemplate = (rowData) => {
        const status = rowData.statusDeCandidato;
        let color = 'var(--neutro-400)';
        if (status?.toLowerCase() === 'aprovado') color = 'var(--green-500)';
        else if (status?.toLowerCase() === 'rejeitado') color = 'var(--error)';
        return (
            <Tag
                value={status}
                style={{
                    backgroundColor: color,
                    color: 'white',
                    fontWeight: 600,
                    fontSize: 13,
                    borderRadius: 8,
                    padding: '4px 12px',
                    textTransform: 'capitalize'
                }}
            />
        );
    };
    
    const handleAprovar = (rowData) => {
        setListaCandidatos(listaCandidatos.map(c =>
            c === rowData ? { ...c, statusDePreenchimento: 'Preenchido', statusDeCandidato: 'Aprovado' } : c
        ));
    };

    const handleRejeitar = (rowData) => {
        setListaCandidatos(listaCandidatos.map(c =>
            c === rowData ? { ...c, statusDePreenchimento: 'Rejeitado', statusDeCandidato: 'Rejeitado' } : c
        ));
    };

    const actionTemplate = (rowData) => (
        <div style={{ display: 'flex', gap: '12px' }}>
            {rowData.statusDeCandidato?.toLowerCase() !== 'aprovado' && (
                <>
                    <Tooltip target=".aprovar" mouseTrack mouseTrackLeft={10} />
                    <FaCheck 
                        title="Aprovar" 
                        data-pr-tooltip="Aprovar candidato"
                        className="aprovar"
                        onClick={() => handleAprovar(rowData)}
                    />
                </>
            )}
            {rowData.statusDeCandidato?.toLowerCase() !== 'rejeitado' && (
                <>
                    <Tooltip target=".rejeitar" mouseTrack mouseTrackLeft={10} />
                    <FaTimes 
                        title="Rejeitar" 
                        data-pr-tooltip="Rejeitar candidato"
                        className="rejeitar"
                        onClick={() => handleRejeitar(rowData)}
                    />
                </>
            )}
        </div>
    );

    return (
        <>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar candidato" />
                </span>
            </div>
            <DataTable value={listaCandidatos} filters={filters} globalFilterFields={['nome', 'email']}  emptyMessage="Não foram encontrados candidatos" selection={selectedCandidato} selectionMode="single" paginator rows={10}  tableStyle={{ minWidth: '68vw' }}>
                <Column field="nome" header="Nome" style={{ width: '13%' }}></Column>
                <Column field="email" header="E-mail" style={{ width: '20%' }}></Column>
                <Column field="telefone" header="Telefone" style={{ width: '13%' }}></Column>
                {/* <Column field="cpf" header="CPF" style={{ width: '15%' }}></Column> */}
                <Column body={representativeDataNascimentoTemplate} field="dataNascimento" header="Nascimento" style={{ width: '10%' }}></Column>
                <Column body={representativeDataExameMedicoTemplate} field="dataExameMedico" header="Exame Médico" style={{ width: '10%' }}></Column>
                <Column body={representativeDataInicioTemplate} field="dataInicio" header="Data Início" style={{ width: '10%' }}></Column>
                <Column body={representativeStatusPreenchimentoTemplate} field="statusDePreenchimento" header="Status Preenchimento" style={{ width: '12%' }} />
                <Column body={representativeStatusCandidatoTemplate} field="statusDeCandidato" header="Status Candidato" style={{ width: '12%' }} />
                <Column body={actionTemplate} style={{ width: '5%' }} />
                {/* <Column field="statusDeCandidato" header="Status Candidato" style={{ width: '10%' }}></Column> */}
            </DataTable>
        </>
    )
}

export default DataTableCandidatos