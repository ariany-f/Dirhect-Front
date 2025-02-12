import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import Texto from '@components/Texto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

function DataTableTarefas({ tarefas, colaborador = null }) {

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
        navegar(`/tarefas/detalhes/${value.id}`)
    }

    const representativStatusTemplate = (rowData) => {
        let status = rowData?.status;
        switch(rowData?.status)
        {
            case 'Concluída':
                status = <Tag severity="success" value="Concluída"></Tag>;
                break;
            case 'Em andamento':
                status = <Tag severity="warning" value="Em andamento"></Tag>;
                break;
            case 'Aguardando':
                status = <Tag severity="danger" value="Aguardando Início"></Tag>;
                break;
        }
        return (
            <b>{status}</b>
        )
    }

    const representativeProgressTemplate = (rowData) => {
        var feito = rowData.feito;
        var tarefas = rowData.total_tarefas;
        
        var progresso = Math.round((feito / tarefas) * 100); // Arredonda a porcentagem concluída
    
        // Define a cor com base no progresso
        let severity = "rgb(139, 174, 44)";
        if (progresso <= 30) {
            severity = "rgb(212, 84, 114)";
        } else if (progresso <= 99) {
            severity = "rgb(255, 146, 42)";
        }
    
        return (
            <ProgressBar 
                value={progresso} 
                color={severity} 
            />
        );
    };    

    const representativeTipoTemplate = (rowData) => {
        return <div key={rowData.id}>
            <Texto weight={700} width={'100%'}>
                {rowData.tipo}
            </Texto>
            <div style={{marginTop: '10px', width: '100%', fontWeight: '500', display: 'flex', color: 'var(--neutro-500)'}}>
                Itens:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData.total_tarefas}</p>
            </div>
        </div>
    }

    const representativeConcluidoTemplate = (rowData) => {
        return <>{rowData.feito}/{rowData.total_tarefas}</>
    }
    
    return (
        <>
            {!colaborador &&
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar" />
                </span>
            </div>}
            <DataTable value={tarefas} filters={filters} globalFilterFields={['titulo']}  emptyMessage="Não foram encontrados tarefas" selection={selectedVaga} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={7}  tableStyle={{ minWidth: '68vw' }}>
                <Column body={representativeTipoTemplate} field="tipo" header="Tipo" style={{ width: '30%' }}></Column>
                <Column body={representativeConcluidoTemplate} field="feito" header="Concluído" style={{ width: '10%' }}></Column>
                <Column body={representativeProgressTemplate} field="feito" header="Progresso" style={{ width: '45%' }}></Column>
                <Column body={representativStatusTemplate} field="status" header="Status" style={{ width: '25%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableTarefas