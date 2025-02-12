import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight, MdPlaylistAddCheck, MdPlaylistRemove } from 'react-icons/md'
import './DataTable.css'
import Frame from '@components/Frame';
import CampoTexto from '@components/CampoTexto';
import Texto from '@components/Texto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Tag } from 'primereact/tag';
import { RiDownload2Line, RiUpload2Line } from 'react-icons/ri';

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

function DataTableMovimentos({ movimentos, colaborador = null }) {

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
        navegar(`/movimentos/detalhes/${value.id}`)
    }

    const representativStatusTemplate = (rowData) => {
        let status = rowData?.status;
        switch(rowData?.status)
        {
            case 'Inclusão':
                status = <MdPlaylistAddCheck fill="green" size={24} />;
                break;
            case 'Remoção':
                status = <MdPlaylistRemove fill="red" size={24} />;
                break;
        }
        return (
            <Frame alinhamento="center">{status}</Frame>
        )
    }

    const representativeTipoTemplate = (rowData) => {
        return <div key={rowData.id}>
            <Texto weight={700} width={'100%'}>
                {rowData.tipo}
            </Texto>
            <div style={{marginTop: '10px', width: '100%', fontWeight: '500', display: 'flex', color: 'var(--neutro-500)'}}>
                Colaboradores:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData.total_colaboradores}</p>
            </div>
        </div>
    }

    
    return (
        <>
            {!colaborador &&
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar" />
                </span>
            </div>}
            <DataTable value={movimentos} filters={filters} globalFilterFields={['titulo']}  emptyMessage="Não foram encontrados movimentos" selection={selectedVaga} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={7}  tableStyle={{ minWidth: '68vw' }}>
                <Column body={representativeTipoTemplate} field="tipo" header="Tipo" style={{ width: '35%' }}></Column>
                <Column field="data" header="Data do Movimento" style={{ width: '35%' }}></Column>
                <Column body={representativStatusTemplate} field="status" header="Movimento" style={{ width: '10%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableMovimentos