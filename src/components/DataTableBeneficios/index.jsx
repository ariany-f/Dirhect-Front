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
import BadgeStatusBeneficio from '../BadgeStatusBeneficio'
import { AiFillQuestionCircle } from 'react-icons/ai'

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

function DataTableBeneficios({ beneficios }) {
    
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
        navegar(`/beneficio/pagamento/${value.public_id}`)
    }

    const representativeAmountTemplate = (rowData) => {
            
            return <b>{(Real.format(rowData.recharge_amount))}</b>
           
    };

    const representativeStatusTemplate = (rowData) => {
        return <BadgeStatusBeneficio status={rowData.recharge_status_enum} />
    };

    const representativeDescriptionTemplate = (rowData) => {
        return (
            <>
                <Texto weight={700} width={'100%'}>
                    {rowData.recharge_name}
                </Texto>
                <div style={{marginTop: '10px', width: '100%', fontWeight: '500', display: 'flex', color: 'var(--neutro-500)'}}>
                    Colaboradores:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData.total_collaborators}</p>
                </div>
            </>
        )
    };

    const representativeCreatedTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{new Date(rowData.schedule_date).toLocaleDateString("pt-BR")}</p>
    }
    const representativeSendedTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{new Date(rowData.schedule_date).toLocaleDateString("pt-BR")}</p>
    }
    const goToTemplate = (rowData) => {
        return <Link to={`/beneficio/selecao-forma-pagamento/${rowData.public_id}`}><MdOutlineKeyboardArrowRight/></Link>
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
            <DataTable value={beneficios} filters={filters} globalFilterFields={['description']} emptyMessage="Não foram encontradas recargas" paginator rows={5}  onSelectionChange={(e) => verDetalhes(e.value)}  tableStyle={{ minWidth: '65vw' }}>
                <Column body={representativeDescriptionTemplate} header="Nome do pedido" style={{ width: '20%' }}></Column>
                <Column body={representativeCreatedTemplate} header="Data de criação" style={{ width: '20%' }}></Column>
                <Column body={representativeStatusTemplate} header="Status" style={{ width: '15%' }}></Column>
                <Column body={representativeSendedTemplate} header="Data do Envio" style={{ width: '15%' }}></Column>
                <Column body={representativeAmountTemplate} header="Valor total(R$)" style={{ width: '15%' }}></Column>
                <Column field="" header="" style={{ width: '5%' }}  body={goToTemplate}></Column>
            </DataTable>
        </>
    )
}

export default DataTableBeneficios