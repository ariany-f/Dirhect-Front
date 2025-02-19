import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import './DataTable.css'
import Texto from '@components/Texto';
import CampoTexto from '@components/CampoTexto';
import colaboradores from '@json/colaboradores.json'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario';
import { Tag } from 'primereact/tag';

function formatarDataBr(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

const fakeData = [
    {
        id: 1,
        colaborador_id: 8,
        data_inicio: formatarDataBr("2025-02-01"),
        data_fim: formatarDataBr("2025-02-10"),
        data_inicio_aquisicao: formatarDataBr("2024-02-01"),
        data_fim_aquisicao: formatarDataBr("2024-02-10"),
        dias: 10,
        decimo: "Sim",
        abono: "6"
    },
    {
        id: 2,
        colaborador_id: 11,
        data_inicio: formatarDataBr("2025-03-05"),
        data_fim: formatarDataBr("2025-03-15"),
        data_inicio_aquisicao: formatarDataBr("2024-03-05"),
        data_fim_aquisicao: formatarDataBr("2024-03-15"),
        dias: 11,
        decimo: "Não",
        abono: "5"
    },
    {
        id: 3,
        colaborador_id: 12,
        data_inicio: formatarDataBr("2025-04-10"),
        data_fim: formatarDataBr("2025-04-20"),
        data_inicio_aquisicao: formatarDataBr("2024-04-10"),
        data_fim_aquisicao: formatarDataBr("2024-04-20"),
        dias: 11,
        decimo: "Sim",
        abono: "10"
    },
    {
        id: 4,
        colaborador_id: 13,
        data_inicio: formatarDataBr("2025-05-01"),
        data_fim: formatarDataBr("2025-05-10"),
        data_inicio_aquisicao: formatarDataBr("2024-05-01"),
        data_fim_aquisicao: formatarDataBr("2024-05-10"),
        dias: 10,
        decimo: "Sim",
        abono: "5"
    },
    {
        id: 5,
        colaborador_id: 8,
        data_inicio: formatarDataBr("2025-06-15"),
        data_fim: formatarDataBr("2025-06-25"),
        data_inicio_aquisicao: formatarDataBr("2024-06-15"),
        data_fim_aquisicao: formatarDataBr("2024-06-25"),
        dias: 11,
        decimo: "Não",
        abono: "5"
    },
    {
        id: 6,
        colaborador_id: 11,
        data_inicio: formatarDataBr("2025-07-01"),
        data_fim: formatarDataBr("2025-07-10"),
        data_inicio_aquisicao: formatarDataBr("2024-07-01"),
        data_fim_aquisicao: formatarDataBr("2024-07-10"),
        dias: 10,
        decimo: "Sim",
        abono: "10"
    }
];

function DataTableFerias({ ferias, colaborador = null }) {
    const [selectedFerias, setSelectedFerias] = useState(0);
    const [modalOpened, setModalOpened] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const navegar = useNavigate();
    const { usuario } = useSessaoUsuarioContext();

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    function verDetalhes(value) {
        setSelectedFerias(value.id);
    }

    function formataCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    
    const representativeColaboradorTemplate = (rowData) => {
        const colab = colaboradores.filter(collaborator => collaborator.id == rowData.colaborador_id);
        if(colab.length > 0)
        {
            return <div key={rowData.id}>
                <Texto weight={700} width={'100%'}>
                    {colab[0].dados_pessoa_fisica?.nome}
                </Texto>
                <div style={{marginTop: '10px', width: '100%', fontWeight: '500', display: 'flex', color: 'var(--neutro-500)'}}>
                    Dias de Férias:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData.dias}</p>
                </div>
                <div style={{marginTop: '10px', width: '100%', fontWeight: '500', display: 'flex', color: 'var(--neutro-500)'}}>
                    Dias de Abono:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData.abono}</p>
                </div>
            </div>
        }
        else
        {
            return "--"
        }
    }

    
    const representativ13Template = (rowData) => {
        let tag = rowData.decimo;
        switch(rowData.decimo)
        {
            case 'Sim':
                tag = <Tag severity="success" value="Sim"></Tag>;
                break;
            case 'Não':
                tag = <Tag severity="danger" value="Não"></Tag>;
                break;
        }
        return (
            <b>{tag}</b>
        )
    }
    

    // Filtra os dados com base no colaborador, se fornecido
    const filteredData = colaborador ? fakeData.filter(feria => feria.colaborador_id == colaborador) : fakeData;

    return (
        <>
            {!colaborador &&
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar por colaborador" />
                </span>
            </div>}
            <DataTable value={filteredData} filters={filters} globalFilterFields={['colaborador_id']} emptyMessage="Não foram encontrados férias registradas" selection={selectedFerias} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={6} tableStyle={{ minWidth: '68vw' }}>
                {!colaborador && <Column body={representativeColaboradorTemplate} field="colaborador_id" header="Colaborador" style={{ width: '30%' }}></Column>}
                <Column field="data_inicio_aquisicao" header="Data Inicio Aquisição" style={{ width: '15%' }}></Column>
                <Column field="data_fim_aquisicao" header="Data Fim Aquisição" style={{ width: '15%' }}></Column>
                <Column field="data_inicio" header="Data Início" style={{ width: '15%' }}></Column>
                <Column field="data_fim" header="Data Fim" style={{ width: '15%' }}></Column>
                <Column body={representativ13Template} field="decimo" header="13º" style={{ width: '10%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableFerias;