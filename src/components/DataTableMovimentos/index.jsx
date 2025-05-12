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
import { ProgressBar } from 'primereact/progressbar';

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
            case 'Concluído':
                status = <Tag severity={'success'} value="Concluído"></Tag>;
                break;
            case 'Aguardando':
                status = <Tag severity={'danger'} value="Aguardando"></Tag>;
                break;
            case 'Em andamento':
                status = <Tag severity={'warning'} value="Em andamento"></Tag>;
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

    const representativeProgressTemplate = (rowData) => {
        const total = rowData.detalhes?.length || 0;
        const concluidos = rowData.detalhes?.filter(d => d.status === 'Concluído' || d.status === 'Concluido').length || 0;
        const progresso = total > 0 ? Math.round((concluidos / total) * 100) : 0;
    
        // Define a cor com base no progresso
        let severity = "rgb(139, 174, 44)"; // Verde para 100%
        if (progresso <= 0) {
            severity = "rgb(212, 84, 114)"; // Vermelho para <= 30%
        } else if (progresso <= 99) {
            severity = "rgb(255, 146, 42)"; // Laranja para <= 99%
        }
    
        return (
            <ProgressBar 
                value={progresso} 
                color={severity}
            />
        );
    };

    const representativeConcluidoTemplate = (rowData) => {
        const concluidos = rowData.detalhes?.filter(d => d.status === 'Concluído' || d.status === 'Concluido').length || 0;
        const total = rowData.detalhes?.length || 0;
        return <>{concluidos}/{total}</>
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
                <Column body={representativeConcluidoTemplate} field="total_colaboradores" header="Concluídos" style={{ width: '15%' }}></Column>
                <Column body={representativeProgressTemplate} field="detalhes" header="Progresso" style={{ width: '25%' }}></Column>
                <Column body={representativStatusTemplate} field="status" header="Movimento" style={{ width: '15%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableMovimentos