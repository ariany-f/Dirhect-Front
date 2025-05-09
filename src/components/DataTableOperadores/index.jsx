import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import Botao from '@components/Botao';
import BotaoGrupo from '@components/BotaoGrupo';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { GrAddCircle } from 'react-icons/gr';
import styles from '@pages/Operadores/Operadores.module.css'
import { useTranslation } from 'react-i18next';

function DataTableOperadores({ operadores }) {

    const[selectedOperator, setSelectedOperator] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const navegar = useNavigate()
    const { t } = useTranslation('common');

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    function verDetalhes(value)
    {
        setSelectedOperator(value)
        navegar(`/operador/detalhes/${value.id}`)
    }
    
    const representativeFullNameTemplate = (rowData) => {
        return (
           rowData.first_name + ' ' + rowData.last_name
        )
    }

    const representativeNameTemplate = (rowData) => {
        return (
           rowData.username
        )
    }
    
    const representativeEmailTemplate = (rowData) => {
        return (
           rowData.email
        )
    }

    return (
        <>
            <BotaoGrupo align="space-between">
                <div className="flex justify-content-end">
                    <span className="p-input-icon-left">
                        <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar operador" />
                    </span>
                </div>
                <BotaoGrupo align="end">
                    <Link to="/operador/registro">
                        <Botao estilo="vermilion" size="small" tab><GrAddCircle className={styles.icon}/> {t('add')} operador</Botao>
                    </Link>
                </BotaoGrupo>
            </BotaoGrupo>
            <DataTable value={operadores} filters={filters} globalFilterFields={['username', 'email']}  emptyMessage="Não foram encontrados operadores" selection={selectedOperator} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={10}  tableStyle={{ minWidth: '68vw' }}>
                <Column field="username" body={representativeNameTemplate} header="Usuário" style={{ width: '35%' }}></Column>
                <Column field="name" body={representativeFullNameTemplate} header="Nome" style={{ width: '35%' }}></Column>
                <Column field="email" body={representativeEmailTemplate} header="E-mail" style={{ width: '35%' }}></Column>
                {/* <Column field="cpf" body={representativeDocumentTemplate} header="CPF" style={{ width: '20%' }}></Column> */}
                
            </DataTable>
        </>
    )
}

export default DataTableOperadores