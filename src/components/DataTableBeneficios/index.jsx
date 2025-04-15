import { DataTable } from 'primereact/datatable'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { Column } from 'primereact/column'
import './DataTable.css'
import Texto from '@components/Texto'
import QuestionCard from '@components/QuestionCard'
import BadgeGeral from '@components/BadgeGeral'
import CampoTexto from '@components/CampoTexto'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { MdOutlineKeyboardArrowRight, MdSecurity } from 'react-icons/md'
import BadgeStatusBeneficio from '../BadgeStatusBeneficio'
import { AiFillQuestionCircle } from 'react-icons/ai'
import { Tag } from 'primereact/tag'
import { IoFastFoodSharp } from 'react-icons/io5'
import { RiBusFill, RiComputerLine, RiEBike2Fill, RiGasStationFill, RiQuestionMark, RiShoppingCartFill } from 'react-icons/ri'
import { FaCar, FaCoins, FaTheaterMasks, FaTooth } from 'react-icons/fa'
import { FaHeartPulse, FaMoneyBillTransfer } from 'react-icons/fa6'
import { PiForkKnifeFill } from 'react-icons/pi'
import { BiBookReader } from 'react-icons/bi'
import { MdDirectionsBike } from "react-icons/md";
import IconeBeneficio from '../IconeBeneficio'

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

const tipos = {
    'C': 'Cultura',
    'E': 'Educação',
    'H': 'Home & Office',
    'M': 'Mobilidade',
    'P': 'P(rograma) de A(limentação) do T(rabalhador)',
    'S': 'Saúde e Bem Estar'
}

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
        navegar(`/beneficio/detalhes/${value.id}`)
    }

    const representativeStatusTemplate = (rowData) => {
        return tipos[rowData.tipo]
    };

    const representativeDescriptionTemplate = (rowData) => {
        return (
            <BadgeGeral nomeBeneficio={rowData.descricao} iconeBeneficio={<IconeBeneficio nomeIcone={rowData.descricao}/>} />
        )
    };

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
            <DataTable value={beneficios} filters={filters} globalFilterFields={['description']} emptyMessage="Não foram encontradas recargas" paginator rows={7}  onSelectionChange={(e) => verDetalhes(e.value)}  tableStyle={{ minWidth: '65vw' }}>
                <Column body={representativeDescriptionTemplate} field="descricao" header="Nome" style={{ width: '20%' }}></Column>
                <Column body={representativeStatusTemplate} header="Tipo" style={{ width: '60%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableBeneficios