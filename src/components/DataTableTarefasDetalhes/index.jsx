import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import CampoArquivo from '@components/CampoArquivo';
import Botao from '@components/Botao';
import Texto from '@components/Texto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Checkbox } from 'primereact/checkbox';
import CheckboxContainer from '@components/CheckboxContainer'
import { Real } from '@utils/formats'
import { Button } from 'primereact/button';
import { FaLink } from 'react-icons/fa';
import { Tag } from 'primereact/tag';
import http from '@http';
import { Toast } from 'primereact/toast';

function DataTableTarefasDetalhes({ tarefas }) {
    const toast = useRef(null);
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

    const representativePrazoTemplate = (rowData) => {
        return (
            rowData.agendado_para ? new Date(rowData.agendado_para).toLocaleDateString('pt-BR') : '-'
        )
    }

    const representativeCheckTemplate = (rowData) => {
        const handleChange = async (checked) => {
            try {
                await http.post(`/tarefas/${rowData.id}/concluir/`);
                rowData.status = 'concluida';
                rowData.status_display = 'Concluída';
                rowData.check = true;
                toast.current.show({
                    severity: 'success',
                    summary: 'Tarefa concluída com sucesso',
                    life: 3000
                });
            } catch (error) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro ao concluir tarefa',
                    life: 3000
                });
            }
        };
    
        return (
            <CheckboxContainer 
                name="feito" 
                valor={rowData.status === 'aprovada'} 
                setValor={handleChange} 
            />
        );
    };

    const representativeStatusTemplate = (rowData) => {
        let severity = '';
        let status = rowData.status_display;

        switch(rowData.status_display) {
            case 'Concluída':
                severity = 'success';
                break;
            case 'Em andamento':
                severity = 'warning';
                break;
            case 'Pendente':
                severity = 'danger';
                break;
            default:
                severity = 'info';
        }

        return <Tag severity={severity} value={status} />;
    };

    const representativePrioridadeTemplate = (rowData) => {
        let severity = '';
        let label = '';

        switch(rowData.prioridade) {
            case 1:
                severity = 'danger';
                label = 'Alta';
                break;
            case 2:
                severity = 'warning';
                label = 'Média';
                break;
            case 3:
                severity = 'info';
                label = 'Baixa';
                break;
            default:
                severity = 'info';
                label = 'Normal';
        }

        return <Tag severity={severity} value={label} />;
    };

    const representativeConcluidoEmTemplate = (rowData) => {
        return rowData.concluido_em ? new Date(rowData.concluido_em).toLocaleDateString('pt-BR') : '-';
    };
    
    const handleUpload = async (arquivoId, file) => {
        if (!file) return;
    };

    const representativeFilesTemplate = (rowData) => {
        return <CampoArquivo     
                onFileChange={(file) => handleUpload(rowData.id, file)}
                accept=".pdf, .jpg, .png"
                id={`arquivo`}
                name={`arquivo`}></CampoArquivo>
    }

    const representativeActionsTemplate = (rowData, _, rowIndex) => {
        if (rowData.descricao === 'Integrar com RM') {
            const anterioresConcluidas = tarefas.slice(0, rowIndex).every(t => t.check === true);
            return <Botao size="small" aoClicar={() => anterioresConcluidas && alert('Integração com RM!')} disabled={!anterioresConcluidas} estilo={anterioresConcluidas ? 'vermilion' : 'cinza'}>
                <FaLink fill="white" /> Integrar
            </Botao>;
        }
        return null;
    };
    
    const representativeDescricaoTemplate = (rowData) => {
        return <Texto width="100%" weight={600}>{rowData.descricao}</Texto>;
    }
    
    // Ordena as tarefas por prioridade
    const tarefasOrdenadas = Array.isArray(tarefas) ? [...tarefas].sort((a, b) => a.prioridade - b.prioridade) : [];
    
    return (
        <>
            <Toast ref={toast} />
            <DataTable 
                value={tarefasOrdenadas} 
                filters={filters} 
                globalFilterFields={['funcionario']}  
                emptyMessage="Não foram encontrados tarefas" 
                paginator 
                rows={10}  
                tableStyle={{ minWidth: '68vw' }}
            >
                <Column body={representativePrioridadeTemplate} field="prioridade" header="Prioridade" style={{ width: '10%' }}></Column>
                <Column body={representativeDescricaoTemplate} field="descricao" header="Descrição" style={{ width: '30%' }}></Column>
                <Column body={representativeStatusTemplate} field="status" header="Status" style={{ width: '15%' }}></Column>
                <Column body={representativePrazoTemplate} field="agendado_para" header="Data Agendada" style={{ width: '15%' }}></Column>
                <Column body={representativeConcluidoEmTemplate} field="concluido_em" header="Concluído em" style={{ width: '15%' }}></Column>
                <Column body={representativeCheckTemplate} field="check" header="Concluído" style={{ width: '15%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableTarefasDetalhes