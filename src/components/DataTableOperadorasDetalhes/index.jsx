import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdSecurity } from 'react-icons/md'
import './DataTable.css'
import BadgeGeral from '@components/BadgeGeral';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Tag } from 'primereact/tag';
import { IoEllipsisVertical, IoFastFoodSharp } from 'react-icons/io5';
import { BiBookReader, BiShield } from 'react-icons/bi';
import { RiBusFill, RiComputerLine, RiEBike2Fill, RiGasStationFill, RiShoppingCartFill } from 'react-icons/ri';
import { PiForkKnifeFill } from 'react-icons/pi';
import { FaCar, FaCoins, FaQuestion, FaTheaterMasks, FaTooth } from 'react-icons/fa';
import { FaHeartPulse, FaMoneyBillTransfer } from "react-icons/fa6";
import { MdDirectionsBike } from "react-icons/md";
import IconeBeneficio from '../IconeBeneficio';

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

function DataTableOperadorasDetalhes({ beneficios }) {

    const[selectedBeneficio, setSelectedBeneficio] = useState(0)
    const [sendData, setSendData] = useState({})
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

    const representativStatusTemplate = (rowData) => {
        let status = tipos[rowData?.beneficio.tipo];
        return status;
    }

    const representativeBeneficiosTemplate = (rowData) => {
       
        return (
            <>
            <BadgeGeral weight={500} nomeBeneficio={
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IconeBeneficio nomeIcone={rowData.beneficio.descricao} />
                    <div>
                        {rowData.beneficio.descricao}
                    </div>
                </div>
            }  />
           </>
        )
    }

    return (
        <>
            <DataTable 
                value={beneficios} 
                filters={filters} 
                globalFilterFields={['nome']} 
                emptyMessage="Não foram encontrados beneficios" 
                paginator rows={7}
                selection={selectedBeneficio} 
                onSelectionChange={(e) => {setSendData(e.value);}} 
                selectionMode="single"
                tableStyle={{ minWidth: '68vw' }}
            >
                <Column body={representativeBeneficiosTemplate} field="nome" header="Benefício" style={{ width: '25%' }}></Column>
                <Column body={representativStatusTemplate} field="tipo" header="Tipo" style={{ width: '65%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableOperadorasDetalhes