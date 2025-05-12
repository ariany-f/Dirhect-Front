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
import { Real } from '@utils/formats'

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
            case 'Aprovado':
                status = <Tag severity={'success'} value="Aprovado"></Tag>;
                break;
            case 'Aguardando':
                status = <Tag severity={'warning'} value="Aguardando"></Tag>;
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
            <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                Beneficiários:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData.total_colaboradores}</p>
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
            <DataTable value={movimentos} filters={filters} globalFilterFields={['titulo']}  emptyMessage="Não foram encontrados movimentos" selection={selectedVaga} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={10} tableStyle={{ minWidth: ((!colaborador) ? '68vw' : '48vw'), maxWidth: (colaborador ? '54vw' : 'initial')}}>
                <Column body={representativeTipoTemplate} field="tipo" header="Tipo" style={{ width: '25%' }}></Column>
                <Column field="data_referencia" header="Referência" style={{ width: '15%' }}></Column>
                <Column field="data" header="Data do Movimento" style={{ width: '15%' }}></Column>
                <Column body={representativStatusTemplate} field="status" header="Movimento" style={{ width: '15%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableMovimentos