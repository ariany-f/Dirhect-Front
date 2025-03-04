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
import { RiBusFill, RiComputerLine, RiGasStationFill, RiShoppingCartFill } from 'react-icons/ri';
import { PiForkKnifeFill } from 'react-icons/pi';
import { FaCoins, FaQuestion, FaTheaterMasks, FaTooth } from 'react-icons/fa';
import { FaHeartPulse, FaMoneyBillTransfer } from "react-icons/fa6";

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

const icones = [
    {
        "id": 1,
        "name": "Alimentação",
        "flexible_value": false,
        "description": "Mercados, supermercados e aplicativo de delivery.",
        "food_meal_one_category": false,
        "icone": <RiShoppingCartFill size={20} />
    },
    {
        "id": 2,
        "name": "Refeição",
        "flexible_value": false,
        "description": "Restaurantes, cafeterias, padarias, mercados, aplicativo de delivery e lojas de conveniência.",
        "food_meal_one_category": false,
        "icone": <IoFastFoodSharp size={20} />
    },
    {
        "id": 3,
        "name": "Mobilidade",
        "flexible_value": true,
        "description": "Postos de combustível, estacionamentos, pedágio, carros por aplicativo, recarga de bilhete de transporte e passagens de ônibus e trem.",
        "food_meal_one_category": false,
        "icone": <RiBusFill size={20} />
    },
    {
        "id": 4,
        "name": "Home Office",
        "flexible_value": true,
        "description": "Compra de cadeira ergométrica, itens de papelaria, assistência técnica de computador e custeio de contas de energia e internet",
        "food_meal_one_category": false,
        "icone": <RiComputerLine size={20} />
    },
    {
        "id": 5,
        "name": "Combustível",
        "flexible_value": true,
        "description": "",
        "food_meal_one_category": false,
        "icone": <RiGasStationFill size={20} />
    },
    {
        "id": 6,
        "name": "Cultura",
        "flexible_value": true,
        "description": "Streaming de vídeo e música, bancas de jornais, jogos online, ingressos para shows teatros e museus, instrumentos musicais, escolas de arte e música e parques de diversões, zoológicos e aquários.",
        "food_meal_one_category": false,
        "icone": <FaTheaterMasks size={20} />
    },
    {
        "id": 7,
        "name": "Educação",
        "flexible_value": true,
        "description": "Cursos online e presenciais, cursos de extensão, cursos e app de idiomas, ensino superior e técnico, eventos e feiras profissionais e livrarias e papelarias",
        "food_meal_one_category": false,
        "icone": <BiBookReader  size={20} />
    },
    {
        "id": 8,
        "name": "Saúde",
        "flexible_value": true,
        "description": "Farmácias, exames, consultas, serviços hospitalares, serviços médicos eterapias.",
        "food_meal_one_category": false,
        "icone": <FaHeartPulse size={20} />
    },
    {
        "id": 9,
        "name": "Auxílio Alimentação",
        "flexible_value": false,
        "description": "Alimentação e Refeição, tudo em uma só categoria.",
        "food_meal_one_category": true,
        "icone": <PiForkKnifeFill size={20} />
    },
    {
        "id": 10,
        "name": "Vale Combustível",
        "flexible_value": true,
        "description": "",
        "food_meal_one_category": false,
        "icone": <RiGasStationFill size={20} />
    },
    {
        "id": 11,
        "name": "Seguro de Vida",
        "flexible_value": true,
        "description": "",
        "food_meal_one_category": false,
        "icone": <MdSecurity size={20} />
    },
    {
        "id": 12,
        "name": "Empréstimo Consignado",
        "flexible_value": true,
        "description": "",
        "food_meal_one_category": false,
        "icone": <FaMoneyBillTransfer size={30} />
    },
    {
        "id": 13,
        "name": "Previdência Privada",
        "flexible_value": true,
        "description": "",
        "food_meal_one_category": false,
        "icone": <FaCoins size={20} />
    },
    {
        "id": 14,
        "name": "Saúde Odonto",
        "flexible_value": true,
        "description": "",
        "food_meal_one_category": false,
        "icone": <FaTooth size={20} />
    },
    {
        "id": 15,
        "name": "Vale Alimentação",
        "flexible_value": false,
        "description": "Mercados, supermercados e aplicativo de delivery.",
        "food_meal_one_category": false,
        "icone": <RiShoppingCartFill size={20} />
    },
    {
        "id": 16,
        "name": "Vale Refeição",
        "flexible_value": false,
        "description": "Restaurantes, cafeterias, padarias, mercados, aplicativo de delivery e lojas de conveniência.",
        "food_meal_one_category": false,
        "icone": <IoFastFoodSharp size={20} />
    },
    {
        "id": 15,
        "name": "Odonto",
        "flexible_value": true,
        "description": "",
        "food_meal_one_category": false,
        "icone": <FaTooth size={20} />
    },
]

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
        const icone = icones.filter(item => item.name == rowData?.beneficio.descricao);
        return (
            <>
            <BadgeGeral weight={500} nomeBeneficio={
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {icone.length > 0 ? icone[0].icone : <FaQuestion size={20} />}
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