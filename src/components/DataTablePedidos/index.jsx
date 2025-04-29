import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import BotaoGrupo from '@components/BotaoGrupo';
import Botao from '@components/Botao';
import Texto from '@components/Texto';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Tag } from 'primereact/tag';
import { GrAddCircle } from 'react-icons/gr';
import QuestionCard from '@components/QuestionCard';
import { AiFillQuestionCircle } from 'react-icons/ai';
import styles from '@pages/Pedidos/Pedidos.module.css'
import { Real } from '@utils/formats'

function DataTablePedidos({ pedidos, colaborador = null }) {

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
        navegar(`/pedidos/detalhes/${value.id}`)
    }

    const representativStatusTemplate = (rowData) => {
        let status = rowData?.status;
        switch(rowData?.status)
        {
            case 'Em preparação':
                status = <Tag severity="neutral" value="Em preparação"></Tag>;
                break;
            case 'Em validação':
                status = <Tag severity="warning" value="Em validação"></Tag>;
                break;
            case 'Em aprovação':
                status = <Tag severity="info" value="Em aprovação"></Tag>;
                break;
            case 'Pedido Realizado':
                status = <Tag severity="success" value="Pedido Realizado"></Tag>;
                break;
            case 'Cancelado':
                status = <Tag severity="danger" value="Cancelado"></Tag>;
                break;
        }
        return (
            <b>{status}</b>
        )
    }

    const representativeTipoTemplate = (rowData) => {
        return <div key={rowData.id}>
            <Texto weight={700} width={'100%'}>
                {rowData.tipo}
            </Texto>
            <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                Colaboradores:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData.total_colaboradores}</p>
            </div>
        </div>
    }

    const representativeValorTemplate = (rowData) => {
        return (
             Real.format(rowData.valor)
        )   
    }
    
    return (
        <>
            <BotaoGrupo align="space-between">
                {!colaborador &&
                <div className="flex justify-content-end">
                    <span className="p-input-icon-left">
                        <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar" />
                    </span>
                </div>}
                <BotaoGrupo>
                    <Link to="/pedidos/adicionar-detalhes">
                        <Botao estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon} color="white" fill="white"/> Criar Pedido</Botao>
                    </Link>
                    <QuestionCard alinhamento="end" element={<AiFillQuestionCircle className="question-icon" size={18} />}>
                        <Link to={'/pedidos/como-funciona'} style={{fontSize: '14px', marginLeft: '8px'}}>Como funciona?</Link>
                    </QuestionCard>
                </BotaoGrupo>
            </BotaoGrupo>
           
            <DataTable value={pedidos} filters={filters} globalFilterFields={['titulo']}  emptyMessage="Não foram encontrados pedidos" selection={selectedVaga} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={7}  tableStyle={{ minWidth: (!colaborador ? '68vw' : '48vw') }}>
                <Column body={representativeTipoTemplate} field="tipo" header="Tipo" style={{ width: '35%' }}></Column>
                <Column field="data_referencia" header="Referência" style={{ width: '35%' }}></Column>
                <Column field="data" header="Data de Pagamento" style={{ width: '35%' }}></Column>
                <Column body={representativStatusTemplate} field="status" header="Status" style={{ width: '35%' }}></Column>
                <Column body={representativeValorTemplate} field="valor" header="Valor Total" style={{ width: '25%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTablePedidos