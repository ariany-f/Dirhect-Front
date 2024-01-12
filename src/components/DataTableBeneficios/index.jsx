import { DataTable } from 'primereact/datatable'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { Column } from 'primereact/column'
import './DataTable.css'
import Texto from '@components/Texto'
import QuestionCard from '@components/QuestionCard'
import CampoTexto from '@components/CampoTexto'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import BadgeStatusBeneficio from '../BadgeStatusBeneficio'
import { AiFillQuestionCircle } from 'react-icons/ai'

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

function DataTableBeneficios({ beneficios }) {
    
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

    const representativeAmountTemplate = (rowData) => {
         
            if(rowData.is_flexible)
            {
                return <b>{(Real.format(rowData.amount_flexible))}</b>
            }
            else
            {
                return <b>{(Real.format(rowData.amount_fixed))}</b>
            }
    };

    const representativeStatusTemplate = (rowData) => {
        return <BadgeStatusBeneficio status={rowData.status} />
    };

    const representativeDescriptionTemplate = (rowData) => {
        return (
            <>
                <Texto weight={700} width={'100%'}>
                    {rowData.description}
                </Texto>
                <div style={{marginTop: '10px', width: '100%', fontWeight: '500', display: 'flex', color: 'var(--neutro-500)'}}>
                    Colaboradores:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{rowData.users.length}</p>
                </div>
            </>
        )
    };

    const representativeCreatedTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{new Date(rowData.created_at).toLocaleDateString("pt-BR")}</p>
    }
    const representativeSendedTemplate = (rowData) => {
        return <p style={{fontWeight: '400'}}>{new Date(rowData.updated_at).toLocaleDateString("pt-BR")}</p>
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
            <DataTable value={beneficios} filters={filters} globalFilterFields={['description']} emptyMessage="Não foram encontrados pedidos" paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '68vw' }}>
                <Column body={representativeDescriptionTemplate} header="Nome do pedido" style={{ width: '35%' }}></Column>
                <Column body={representativeCreatedTemplate} header="Data de criação" style={{ width: '15%' }}></Column>
                <Column body={representativeStatusTemplate} header="Status" style={{ width: '10%' }}></Column>
                <Column body={representativeSendedTemplate} header="Data do Envio" style={{ width: '15%' }}></Column>
                <Column body={representativeAmountTemplate} header="Valor total(R$)" style={{ width: '20%' }}></Column>
                {/* <Column field="" header="" style={{ width: '5%' }}  body={<MdOutlineKeyboardArrowRight/>}></Column> */}
            </DataTable>
        </>
    )
}

export default DataTableBeneficios