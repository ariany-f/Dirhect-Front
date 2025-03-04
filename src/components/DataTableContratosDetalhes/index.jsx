import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineFastfood, MdOutlineKeyboardArrowRight, MdOutlineMedicalServices, MdSecurity } from 'react-icons/md'
import './DataTable.css'
import BadgeGeral from '@components/BadgeGeral';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import http from '@http';
import { Tag } from 'primereact/tag';
import ModalAlterarRegrasBeneficio from '../ModalAlterar/regras_beneficio';
import { ContextMenu } from 'primereact/contextmenu';
import { IoEllipsisVertical, IoFastFoodSharp } from 'react-icons/io5';
import { BiBookReader, BiShield } from 'react-icons/bi';
import { RiBusFill, RiComputerLine, RiGasStationFill, RiShoppingCartFill } from 'react-icons/ri';
import { PiForkKnifeFill } from 'react-icons/pi';
import { FaCoins, FaQuestion, FaTheaterMasks, FaTooth } from 'react-icons/fa';
import { FaHeartPulse, FaMoneyBillTransfer } from "react-icons/fa6";
import { CiMoneyBill } from 'react-icons/ci';
import styled from 'styled-components';

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

const Col12 = styled.div`
    display: flex;
    gap: 6px;
    justify-content: space-between;
`;

const Col5 = styled.div`
    width: ${(props) => (props.expanded ? "calc(44% - 6px)" : "100%")};
    transition: all 0.3s ease;
    padding: 0px;
`;

const Col7 = styled.div`
    width: ${(props) => (props.expanded ? "calc(56% - 6px)" : "100%")};
    transition: all 0.3s ease;
    padding: 0px;
`;



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

function DataTableContratosDetalhes({ beneficios }) {
    
    const[selectedBeneficio, setSelectedBeneficio] = useState(0)
    const[selectedItemBeneficio, setSelectedItemBeneficio] = useState(0)
    const [modalOpened, setModalOpened] = useState(false)
    const [sendData, setSendData] = useState({})
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [expandedRows, setExpandedRows] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
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
            Real.format(rowData.valor_empresa)
        )
    }

    const representativeDescontoTemplate = (rowData) => {
        return (
            Real.format(rowData.valor_desconto)
        )
    }

    const representativeBeneficiosTemplate = (rowData) => {
        const k = rowData?.dados_beneficio?.id ?? rowData?.id
        
        const icone = icones.filter(item => item.name == rowData?.dados_beneficio?.descricao);
        return <div key={k}>
                <BadgeGeral weight={500} nomeBeneficio={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {icone.length > 0 ? icone[0].icone : <FaQuestion size={20} />}
                        <div>
                            {rowData?.dados_beneficio?.descricao}
                        </div>
                    </div>
                }  />
            </div>
    }

    const alterarRegras = (descricao, tipo_calculo, tipo_desconto, extensivo_dependentes, valor, empresa, desconto) => {
        let data = {
            descricao: 'Adicionar',
            tipo_calculo: "M",
            tipo_desconto: "D",
            contrato_beneficio: parseInt(selectedBeneficio),
            extensivel_depentende: extensivo_dependentes,
            parametro_aplicacao: "I",
            numero_decimal: true,
            valor: valor,
            valor_empresa: empresa,
            valor_desconto: desconto
        }

        http.post('contrato_beneficio_item/', data)
        .then(response => {
            if(response.id)
            {
                toast.current.show({severity:'success', summary: 'Sucesso', detail: 'Sucesso!', life: 3000});
            }
        })
        .catch(erro => {
            toast.current.show({severity:'error', summary: 'Erro', detail: 'Erro!', life: 3000});
        })
        .finally(function() {
            setModalOpened(false)
        })
    }

    const onRowSelect = (e) => {
        setSelectedBeneficio(e.value);
        setSelectedItems(e.value.itens || []); // Pega os itens do benefício selecionado
    };

    return (
        <>
            <Col12>
                {/* <ContextMenu model={menuModel(selectedBeneficio)} ref={cm} onHide={() => setSelectedBeneficio(null)} /> */}
                <Col5 expanded={selectedBeneficio}>
                    <DataTable 
                        value={beneficios} 
                        filters={filters} 
                        globalFilterFields={['nome']} 
                        emptyMessage="Não foram encontrados beneficios" 
                        paginator 
                        rows={7}
                        selection={selectedBeneficio} 
                        onSelectionChange={onRowSelect}
                        selectionMode="single"
                    >
                        <Column body={representativeBeneficiosTemplate} field="dados_beneficio.descricao" header="Benefício" style={{ width: '45%' }}></Column>
                        <Column field="observacao" header="Observação" style={{ width: '35%' }}></Column>
                    </DataTable>
                </Col5>

                {selectedBeneficio && selectedItems && selectedItems.length > 0 ? 
                    <Col7 expanded={selectedBeneficio}>
                        <DataTable  
                            selection={selectedItemBeneficio}
                            selectionMode="single"
                            onSelectionChange={(e) => {setSelectedItemBeneficio(e.value.id); setSendData(e.value); setModalOpened(true)}} 
                            value={selectedItems} 
                        >
                            <Column body={representativeExtensivelTemplate} field="extensivel_depentende" header="Extensível Dependente" style={{ width: '10%' }} />
                            <Column body={representativeValorTemplate} field="valor" header="Valor" style={{ width: '12%' }} />
                            <Column body={representativeEmpresaTemplate} field="valor_empresa" header="Empresa" style={{ width: '15%' }} />
                            <Column body={representativeDescontoTemplate} field="valor_desconto" header="Desconto" style={{ width: '15%' }} />
                        </DataTable>
                    </Col7>
                : null
                }
            </Col12>
            <ModalAlterarRegrasBeneficio contrato={selectedItemBeneficio} aoSalvar={alterarRegras} aoFechar={() => setModalOpened(false)} opened={modalOpened} nomeBeneficio={selectedBeneficio?.dados_beneficio?.descricao} dadoAntigo={sendData} />
        </>
    )
}

export default DataTableContratosDetalhes