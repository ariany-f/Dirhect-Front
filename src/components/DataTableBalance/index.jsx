import { DataTable } from 'primereact/datatable'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { Column } from 'primereact/column'
import './DataTable.css'
import Texto from '@components/Texto'
import QuestionCard from '@components/QuestionCard'
import CampoTexto from '@components/CampoTexto'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { AiFillQuestionCircle } from 'react-icons/ai'
import BadgeStatusBalance from '../BadgeStatusBalance'
import { Real } from '@utils/formats'

function DataTableBalance({ balance }) {
    
    const navegar = useNavigate()
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    
    function verDetalhes(value)
    {
        navegar(`/extrato/adicionar-saldo/pagamento/${value.public_id}`)
    }

    const representativeAmountTemplate = (rowData) => {
            return <b>{(Real.format(rowData.total_amount))}</b>
    };

    const representativeStatusTemplate = (rowData) => {
        return <BadgeStatusBalance status={rowData.transaction_status_enum} />
    };

    const representativeCreatedTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{new Date(rowData.created_at).toLocaleDateString("pt-BR")} {new Date(rowData.created_at).toLocaleTimeString("pt-BR")}</p>
    }
    const representativeSendedTemplate = (rowData) => {
        return <></>
    }
    const goToTemplate = (rowData) => {
        return <Link to={`/extrato/adicionar-saldo/pagamento/${rowData.public_id}`}><MdOutlineKeyboardArrowRight/></Link>
    }

    return (
        <>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Digite um nome de pedido" />
                </span>
                <QuestionCard alinhamento="end" element={<AiFillQuestionCircle className="question-icon" size={18} />}>
                    <p style={{fontSize: '14px', marginLeft: '8px'}}>Como funciona esses benefícios?</p>
                </QuestionCard>
            </div>
            <DataTable value={balance} filters={filters} globalFilterFields={['description']} emptyMessage="Não foram encontradas recargas" paginator rows={10}  onSelectionChange={(e) => verDetalhes(e.value)}  tableStyle={{ minWidth: '65vw' }}>
                <Column body={representativeCreatedTemplate} header="Data de criação" style={{ width: '20%' }}></Column>
                <Column body={representativeSendedTemplate} header="Forma de Pagamento" style={{ width: '15%' }}></Column>
                <Column body={representativeStatusTemplate} header="Status" style={{ width: '15%' }}></Column>
                <Column body={representativeAmountTemplate} header="Valor" style={{ width: '15%' }}></Column>
                <Column field="" header="" style={{ width: '5%' }}  body={goToTemplate}></Column>
            </DataTable>
        </>
    )
}

export default DataTableBalance