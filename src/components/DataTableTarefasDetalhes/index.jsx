import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import CampoArquivo from '@components/CampoArquivo';
import Botao from '@components/Botao';
import Texto from '@components/Texto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import CheckboxContainer from '@components/CheckboxContainer'
import { Real } from '@utils/formats'
import { Button } from 'primereact/button';
import { FaLink } from 'react-icons/fa';

function DataTableTarefasDetalhes({ tarefas }) {

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
            rowData.prazo
        )
    }

    const representativeCheckTemplate = (rowData, onUpdateStatus) => {
        const handleChange = (checked) => {
            onUpdateStatus(rowData.id, checked); // Atualiza o estado da tarefa
        };
    
        return (
            <CheckboxContainer name="feito" valor={rowData.check} setValor={handleChange} />
        );
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
            // Verifica se todas as tarefas anteriores estão concluídas
            const anterioresConcluidas = tarefas.slice(0, rowIndex).every(t => t.check === true);
            return <Botao size="small" aoClicar={() => anterioresConcluidas && alert('Integração com RM!')} disabled={!anterioresConcluidas} estilo={anterioresConcluidas ? 'vermilion' : 'cinza'}>
                <FaLink fill="white" /> Integrar
            </Botao>;
        }
        return null;
    };
    
    const representativeResponsibleTemplate = (rowData) => {
        if(rowData.responsible)
        {
            return <span>{rowData.responsible}</span>;
        }
        else
        {
            return <span>---</span>;
        }
    }
    
    const representativeDescricaoTemplate = (rowData) => {
        return <Texto width="100%" weight={600}>{rowData.descricao}</Texto>;
    }
    
    return (
        <>
            <DataTable value={tarefas} filters={filters} globalFilterFields={['funcionario']}  emptyMessage="Não foram encontrados tarefas" paginator rows={10}  tableStyle={{ minWidth: '68vw' }}>
                <Column body={representativeDescricaoTemplate} field="descricao" header="Descrição" style={{ width: '20%' }}></Column>
                <Column body={representativePrazoTemplate} field="prazo" header="Prazo (SLA)" style={{ width: '10%' }}></Column>
                <Column body={representativeCheckTemplate} field="check" header="Concluído" style={{ width: '10%' }}></Column>
                <Column body={representativeFilesTemplate} field="files" header="Anexos" style={{ width: '20%' }}></Column>
                <Column body={representativeResponsibleTemplate} field="responsible" header="Responsável" style={{ width: '12%' }}></Column>
                <Column body={(rowData, options) => representativeActionsTemplate(rowData, options, options.rowIndex)} header="Ações" style={{ width: '18%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableTarefasDetalhes