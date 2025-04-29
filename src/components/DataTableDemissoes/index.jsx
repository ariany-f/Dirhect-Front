import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import Texto from '@components/Texto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Real } from '@utils/formats'

function DataTableDemissao({ demissoes, colaborador = null }) {

    const[selectedVaga, setSelectedVaga] = useState(0)
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
        console.log(value)
    }

    function formataCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    const representativeColaboradorTemplate = (rowData) => {
        const cpf = rowData?.funcionario_pessoa_fisica?.cpf ?
        formataCPF(rowData?.funcionario_pessoa_fisica?.cpf)
        : '---';
        return <div key={rowData.id}>
            <Texto weight={700} width={'100%'}>
                {rowData?.funcionario_pessoa_fisica?.nome}
            </Texto>
            <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                CPF:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{cpf}</p>
            </div>
        </div>
    }

    const representativeDataDemissaoTemplate = (rowData) => {
        return new Date(rowData.dt_demissao).toLocaleDateString("pt-BR")
    }

    const representativeTipoDemissaoTemplate = (rowData) => {
        return rowData.tipo_demissao
    }

    const representativeChapaTemplate = (rowData) => {
        return (
            <Texto weight={600}>{rowData?.chapa}</Texto>
        )
    }
    
    return (
        <>
            {!colaborador &&
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar por candidato" />
                </span>
            </div>}
            <DataTable value={demissoes} filters={filters} globalFilterFields={['titulo']}  emptyMessage="Não foram encontradas demissões pendentes" selection={selectedVaga} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={10}  tableStyle={{ minWidth: (!colaborador ? '68vw' : '48vw') }}>
                {!colaborador &&
                    <Column body={representativeChapaTemplate} header="Matrícula" style={{ width: '10%' }}></Column>
                }
                {!colaborador &&
                    <Column body={representativeColaboradorTemplate} header="Colaborador" style={{ width: '30%' }}></Column>
                }
                <Column body={representativeDataDemissaoTemplate} field="data" header="Data Demissão" style={{ width: '30%' }}></Column>
                <Column body={representativeTipoDemissaoTemplate} field="tipo" header="Tipo Demissão" style={{ width: '30%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableDemissao