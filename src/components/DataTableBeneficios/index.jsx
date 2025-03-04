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
import { RiBusFill, RiComputerLine, RiGasStationFill, RiShoppingCartFill } from 'react-icons/ri'
import { FaCoins, FaTheaterMasks, FaTooth } from 'react-icons/fa'
import { FaHeartPulse, FaMoneyBillTransfer } from 'react-icons/fa6'
import { PiForkKnifeFill } from 'react-icons/pi'
import { BiBookReader } from 'react-icons/bi'

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
]


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
        const icone = (icones.filter((item) => {
            console.log(item.name)
            return item.name == rowData.descricao;
        }))
        if(icone.length > 0)
        {
            return (
                <BadgeGeral nomeBeneficio={rowData.descricao} iconeBeneficio={icone[0].icone} />
             )
        }
        else
        {
            return (
                <BadgeGeral nomeBeneficio={rowData.descricao} iconeBeneficio={<RiQuestionMark size={20} />} />
             )
        }
    };

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
            <DataTable value={beneficios} filters={filters} globalFilterFields={['description']} emptyMessage="Não foram encontradas recargas" paginator rows={7}  onSelectionChange={(e) => verDetalhes(e.value)}  tableStyle={{ minWidth: '65vw' }}>
                <Column body={representativeDescriptionTemplate} field="descricao" header="Nome" style={{ width: '20%' }}></Column>
                <Column body={representativeStatusTemplate} header="Tipo" style={{ width: '60%' }}></Column>
                {/* <Column field="" header="" style={{ width: '5%' }}  body={goToTemplate}></Column> */}
            </DataTable>
        </>
    )
}

export default DataTableBeneficios