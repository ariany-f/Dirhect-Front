import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineFastfood, MdOutlineKeyboardArrowRight, MdOutlineMedicalServices, MdSecurity } from 'react-icons/md'
import './DataTable.css'
import BadgeGeral from '@components/BadgeGeral';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Tag } from 'primereact/tag';
import ModalAlterarRegrasBeneficio from '../ModalAlterar/regras_beneficio';
import { ContextMenu } from 'primereact/contextmenu';
import { IoEllipsisVertical, IoFastFoodSharp } from 'react-icons/io5';
import { BiBookReader, BiShield } from 'react-icons/bi';
import { RiBusFill, RiComputerLine, RiGasStationFill, RiShoppingCartFill } from 'react-icons/ri';
import { PiForkKnifeFill } from 'react-icons/pi';
import { FaCoins, FaTheaterMasks, FaTooth } from 'react-icons/fa';
import { FaHeartPulse, FaMoneyBillTransfer } from "react-icons/fa6";
import { CiMoneyBill } from 'react-icons/ci';

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});


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
        "name": "Vale Combustivel",
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
    }
]

function DataTableContratosDetalhes({ beneficios }) {

    const[selectedBeneficio, setSelectedBeneficio] = useState(0)
    const [modalOpened, setModalOpened] = useState(false)
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

    const representativeValorTemplate = (rowData) => {
        return (
            Real.format(rowData.valor)
        )
    }

    const representativeExtensivelTemplate = (rowData) => {
        return (
           rowData.extensivo_dependentes ? <Tag severity="success" value="Sim"/> : <Tag severity="danger" value="Não"/>
        )
    }

    const representativeEmpresaTemplate = (rowData) => {
        return (
            Real.format(rowData.empresa)
        )
    }
    
    const representativStatusTemplate = (rowData) => {
        let status = rowData?.status;
        switch(rowData?.status)
        {
            case 'Ativo':
                status = <Tag severity="success" value="Ativo"></Tag>;
                break;
            case 'Vencido':
                status = <Tag severity="warning" value="Vencido"></Tag>;
                break;
            case 'Cancelado':
                status = <Tag severity="danger" value="Cancelado"></Tag>;
                break;
        }
        return (
            <b>{status}</b>
        )
    }

    const representativeBeneficiosTemplate = (rowData) => {
        return (
            <>
            {icones.map(item => {
                if(item.name == rowData.nome)
                {
                    return (
                        <BadgeGeral weight={500} nomeBeneficio={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {item.icone}
                                <div>
                                    {rowData.nome}
                                </div>
                            </div>
                        }  />
                    )
                }
            })}     
           </>
        )
    }

    const cm = useRef(null);
    const menuModel = (selectedBeneficio) => {
        if (!selectedBeneficio) return [];
        return [
            { 
                label: <b>Editar</b>, 
                command: () => { 
                    setSendData(selectedBeneficio) 
                    setModalOpened(true)
                }
            }
        ];
    
    };

    return (
        <>
            {/* <ContextMenu model={menuModel(selectedBeneficio)} ref={cm} onHide={() => setSelectedBeneficio(null)} /> */}
            <DataTable 
                value={beneficios} 
                filters={filters} 
                globalFilterFields={['nome']} 
                emptyMessage="Não foram encontrados beneficios" 
                paginator rows={7}
                selection={selectedBeneficio} 
                onSelectionChange={(e) => {setSendData(e.value); setModalOpened(true)}} 
                selectionMode="single"
                tableStyle={{ minWidth: '68vw' }}
            >
                <Column body={representativeBeneficiosTemplate} field="nome" header="Benefício" style={{ width: '35%' }}></Column>
                <Column field="data_inicio" header="Data Inicio" style={{ width: '35%' }}></Column>
                <Column field="data_fim" header="Data Fim" style={{ width: '35%' }}></Column>
                <Column field="tempo_minimo" header="Tempo Mínimo" style={{ width: '35%' }}></Column>
                <Column body={representativeExtensivelTemplate} field="extensivo_dependentes" header="Extensível Dependente" style={{ width: '35%' }}></Column>
                <Column body={representativStatusTemplate} field="status" header="Status" style={{ width: '35%' }}></Column>
            </DataTable>
            <ModalAlterarRegrasBeneficio aoFechar={() => setModalOpened(false)} opened={modalOpened} dadoAntigo={sendData} />
        </>
    )
}

export default DataTableContratosDetalhes