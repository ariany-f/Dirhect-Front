import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineFastfood, MdOutlineKeyboardArrowRight, MdOutlineMedicalServices } from 'react-icons/md'
import './DataTable.css'
import BadgeGeral from '@components/BadgeGeral';
import Texto from '@components/Texto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { RiBusFill, RiComputerLine, RiGasStationFill, RiShoppingCartFill } from 'react-icons/ri';
import { PiForkKnifeFill } from 'react-icons/pi';
import { BiBookReader } from 'react-icons/bi';
import { FaTheaterMasks } from 'react-icons/fa';

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});


const Col12 = styled.div`
    display: flex;
    width: 100%;
    gap: 24px;
    flex-wrap: wrap;
`

const Col6 = styled.div`
    display: inline-flex;
    align-items: start;
    justify-content: center;
    gap: 8px;
    flex-direction: column;
`

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
        "icone": <MdOutlineFastfood size={20} />
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
        "icone": <MdOutlineMedicalServices size={20} />
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
    }
]


function DataTableElegibilidadeDetalhes({ elegibilidade, pagination = true }) {

    const[selectedVaga, setSelectedVaga] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [expandedRows, setExpandedRows] = useState(null);
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

    const representativeContratoTemplate = (rowData) => {
        return (
            <Texto weight={700}>{rowData.nome_fornecedor}</Texto>
        )
    }

    const representativeValorTemplate = (rowData) => {
        return (
            Real.format(rowData.valor)
        )
    }

    const representativeBeneficiosTemplate = (rowData) => {
        return (
            <>
            {rowData.beneficios && rowData.beneficios.length > 0 &&
                <Col12>
                {rowData.beneficios.map((benefit, index) => {
                    return (
                        <Col6 key={index}>
                            {icones.map(item => {
                                if(item.name == benefit.beneficio)
                                {
                                    return (
                                        <BadgeGeral weight={500} nomeBeneficio={
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div>{item.icone}</div>
                                                <div>
                                                {benefit.beneficio} <br /> 
                                                {representativeValorTemplate(benefit)}
                                                </div>
                                            </div>
                                        }  />
                                    )
                                }
                            })}    
                        </Col6>
                    )
                })}
                </Col12>
           }
           </>
        )
    }

    const rowExpansionTemplate = (data) => {
        return (
            <div className="card">
                <DataTable emptyMessage="Não foram encontrados benefícios" tableStyle={{ minWidth: '65vw' }} value={data.beneficios}>
                    <Column field="beneficio" header="Benefício"></Column>
                    <Column body={representativeValorTemplate} field="valor" header="Valor"></Column>
                </DataTable>
            </div>
        );
    };
    
    const allowExpansion = (rowData) => {
        return rowData.beneficios.length > 0;
    };
    
    return (
        <>
            <DataTable expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} rowExpansionTemplate={rowExpansionTemplate} value={elegibilidade} filters={filters} globalFilterFields={['data_inicio']}  emptyMessage="Não foram encontrados elegibilidade" paginator={pagination} rows={7}  tableStyle={{ minWidth: '68vw' }}>
                {/* <Column expander={allowExpansion} style={{ width: '5%' }} /> */}
                <Column body={representativeContratoTemplate} field="nome_fornecedor" header="Contrato" style={{ width: '15%' }}></Column>
                <Column body={representativeBeneficiosTemplate} field="beneficios" header="Benefícios" style={{ width: '55%' }}></Column>
                <Column field="data_inicio" header="Data Início" style={{ width: '15%' }}></Column>
                <Column field="data_fim" header="Data Fim" style={{ width: '15%' }}></Column>
            </DataTable>
        </>
    )
}

export default DataTableElegibilidadeDetalhes