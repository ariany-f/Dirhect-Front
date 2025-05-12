import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import Texto from '@components/Texto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from '@pages/tarefas/Pedidos.module.css'
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import { Real } from '@utils/formats'
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario'
import ModalTarefas from '@components/ModalTarefas'
import Botao from '@components/Botao'
import BotaoGrupo from '@components/BotaoGrupo'
import { GrAddCircle } from 'react-icons/gr'

function DataTableTarefas({ tarefas, colaborador = null }) {

    const[selectedVaga, setSelectedVaga] = useState(0)
    const [modalOpened, setModalOpened] = useState(false)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const {usuario} = useSessaoUsuarioContext()
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

    const representativeRecorrenciaTemplate = (rowData) => {
        if(rowData.recorrencia)
        {
            return rowData.tipo_recorrencia;
        }
        else {
            return 'Automático';
        }
    }

    const representativeDataTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{new Date(rowData.data).toLocaleDateString("pt-BR")}</p>
    }

    const representativeTipoTemplate = (rowData) => {
        return <div key={rowData.id}>
            <Texto weight={700} width={'100%'}>
                {rowData.tipo}
            </Texto>
            <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                Itens:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData.total_tarefas}</p>
            </div>
        </div>
    }

    const representativeConcluidoTemplate = (rowData) => {
        return <>{rowData.feito}/{rowData.total_tarefas}</>
    }
    
    return (
        <>
            <BotaoGrupo align={'space-between'} wrap>
                {!colaborador && (
                    <>
                        <div className="flex justify-content-end">
                            <span className="p-input-icon-left">
                                <CampoTexto width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar" />
                            </span>
                        </div>
                        <BotaoGrupo align="end" gap="8px">
                            {(usuario.tipo == 'cliente' || usuario.tipo == 'equipeFolhaPagamento') && 
                                <Botao aoClicar={() => setModalOpened(true)} estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon} fill="white" stroke="white" color="white"/> Registrar Tarefa</Botao>
                            }
                        </BotaoGrupo>
                    </>
                )}
            </BotaoGrupo>
            <DataTable value={tarefas} filters={filters} globalFilterFields={['titulo']}  emptyMessage="Não foram encontrados tarefas" selection={selectedVaga} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={10}  tableStyle={{ minWidth: '68vw' }}>
                <Column body={representativeTipoTemplate} field="tipo" header="Tipo" style={{ width: '30%' }}></Column>
                <Column body={representativeRecorrenciaTemplate} field="tipo_recorrencia" header="Recorrência" style={{width: '15%'}}></Column>
                <Column body={representativeDataTemplate} field="data" header="Data de Entrega" style={{width: '15%'}}></Column>
                <Column body={representativeConcluidoTemplate} field="feito" header="Concluídos" style={{ width: '10%' }}></Column>
                <Column body={representativeProgressTemplate} field="feito" header="Progresso" style={{ width: '45%' }}></Column>
                <Column body={representativStatusTemplate} field="status" header="Status" style={{ width: '25%' }}></Column>
            </DataTable>
            <ModalTarefas opened={modalOpened} aoFechar={() => setModalOpened(false)} />
        </>
    )
}

export default DataTableTarefas