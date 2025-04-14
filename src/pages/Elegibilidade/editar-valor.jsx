import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom'
import BotaoGrupo from "@components/BotaoGrupo"
import Frame from "@components/Frame"
import Texto from "@components/Texto"
import BotaoSemBorda from "@components/BotaoSemBorda"
import Titulo from "@components/Titulo"
import { Skeleton } from 'primereact/skeleton'
import { FaPencilAlt } from 'react-icons/fa'
import { MdCancel } from "react-icons/md"
import Loading from "@components/Loading"
import { Toast } from 'primereact/toast'
import DataTablePremiacaoEditarValor from "@components/DataTablePremiacaoEditarValor";
import { useConfiguracaoElegibilidadeContext } from "@contexts/ConfiguracaoElegibilidade";
import DropdownItens from "@components/DropdownItens";
import CustomImage from "@components/CustomImage";
import Botao from "@components/Botao";
import http from "@http";
import styled from "styled-components";
import { RiBusFill, RiComputerLine, RiShoppingCartFill, RiGasStationFill, RiEBike2Fill } from 'react-icons/ri'
import { FaCar, FaCoins, FaQuestion, FaTheaterMasks, FaTooth } from 'react-icons/fa'
import { BiBookReader } from 'react-icons/bi'
import { PiForkKnifeFill } from 'react-icons/pi'
import { MdOutlineMedicalServices, MdOutlineFastfood, MdSecurity, MdDirectionsBike } from 'react-icons/md'
import styles from '@components/BadgeBeneficio/BadgeBeneficio.module.css'
import { IoFastFoodSharp } from 'react-icons/io5'
import { FaHeartPulse, FaMoneyBillTransfer } from 'react-icons/fa6'
import ModalConfigurarBeneficios from "../../components/ModalConfigurarBeneficios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const icones = [
    {
        "id": 1,
        "name": "Alimentação",
        "flexible_value": false,
        "description": "Mercados, supermercados e aplicativo de delivery.",
        "food_meal_one_category": false,
        "icone": <RiShoppingCartFill size={16} />
    },
    {
        "id": 2,
        "name": "Refeição",
        "flexible_value": false,
        "description": "Restaurantes, cafeterias, padarias, mercados, aplicativo de delivery e lojas de conveniência.",
        "food_meal_one_category": false,
        "icone": <IoFastFoodSharp size={16} />
    },
    {
        "id": 3,
        "name": "Mobilidade",
        "flexible_value": true,
        "description": "Postos de combustível, estacionamentos, pedágio, carros por aplicativo, recarga de bilhete de transporte e passagens de ônibus e trem.",
        "food_meal_one_category": false,
        "icone": <RiBusFill size={16} />
    },
    {
        "id": 4,
        "name": "Home Office",
        "flexible_value": true,
        "description": "Compra de cadeira ergométrica, itens de papelaria, assistência técnica de computador e custeio de contas de energia e internet",
        "food_meal_one_category": false,
        "icone": <RiComputerLine size={16} />
    },
    {
        "id": 5,
        "name": "Combustível",
        "flexible_value": true,
        "description": "",
        "food_meal_one_category": false,
        "icone": <RiGasStationFill size={16} />
    },
    {
        "id": 6,
        "name": "Cultura",
        "flexible_value": true,
        "description": "Streaming de vídeo e música, bancas de jornais, jogos online, ingressos para shows teatros e museus, instrumentos musicais, escolas de arte e música e parques de diversões, zoológicos e aquários.",
        "food_meal_one_category": false,
        "icone": <FaTheaterMasks size={16} />
    },
    {
        "id": 7,
        "name": "Educação",
        "flexible_value": true,
        "description": "Cursos online e presenciais, cursos de extensão, cursos e app de idiomas, ensino superior e técnico, eventos e feiras profissionais e livrarias e papelarias",
        "food_meal_one_category": false,
        "icone": <BiBookReader  size={16} />
    },
    {
        "id": 8,
        "name": "Saúde",
        "flexible_value": true,
        "description": "Farmácias, exames, consultas, serviços hospitalares, serviços médicos eterapias.",
        "food_meal_one_category": false,
        "icone": <FaHeartPulse size={16} />
    },
    {
        "id": 9,
        "name": "Auxílio Alimentação",
        "flexible_value": false,
        "description": "Alimentação e Refeição, tudo em uma só categoria.",
        "food_meal_one_category": true,
        "icone": <PiForkKnifeFill size={16} />
    },
    {
        "id": 10,
        "name": "Vale Combustível",
        "flexible_value": true,
        "description": "",
        "food_meal_one_category": false,
        "icone": <RiGasStationFill size={16} />
    },
    {
        "id": 11,
        "name": "Seguro de Vida",
        "flexible_value": true,
        "description": "",
        "food_meal_one_category": false,
        "icone": <MdSecurity size={16} />
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
        "icone": <FaCoins size={16} />
    },
    {
        "id": 14,
        "name": "Saúde Odonto",
        "flexible_value": true,
        "description": "",
        "food_meal_one_category": false,
        "icone": <FaTooth size={16} />
    },
    {
        "id": 15,
        "name": "Vale Alimentação",
        "flexible_value": false,
        "description": "Mercados, supermercados e aplicativo de delivery.",
        "food_meal_one_category": false,
        "icone": <RiShoppingCartFill size={16} />
    },
    {
        "id": 16,
        "name": "Vale Refeição",
        "flexible_value": false,
        "description": "Restaurantes, cafeterias, padarias, mercados, aplicativo de delivery e lojas de conveniência.",
        "food_meal_one_category": false,
        "icone": <IoFastFoodSharp size={16} />
    },
    {
        "id": 15,
        "name": "Odonto",
        "flexible_value": true,
        "description": "",
        "food_meal_one_category": false,
        "icone": <FaTooth size={16} />
    },
    {
        "id": 16,
        "name": "Seguro Bike",
        "flexible_value": true,
        "description": "Farmácias, exames, consultas, serviços hospitalares, serviços médicos eterapias.",
        "food_meal_one_category": false,
        "icone": <MdDirectionsBike size={16} />
    },
    {
        "id": 17,
        "name": "Seguro Moto",
        "flexible_value": true,
        "description": "Farmácias, exames, consultas, serviços hospitalares, serviços médicos eterapias.",
        "food_meal_one_category": false,
        "icone": <RiEBike2Fill size={16} />
    },
    {
        "id": 18,
        "name": "Seguro Automotivo",
        "flexible_value": true,
        "description": "Farmácias, exames, consultas, serviços hospitalares, serviços médicos eterapias.",
        "food_meal_one_category": false,
        "icone": <FaCar size={16} />
    },
]

// Estilos reutilizáveis (pode mover para um arquivo separado)
const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 16px;
    padding: 16px;
    width: 100%;
`;

const Col6 = styled.div`
    flex: 1 1 calc(50% - 8px);
`;


const ContainerButton = styled.div`
    display: flex;
    width: 100%;
    padding: 20px;
    justify-content: space-between;
    & button {
        width: initial;
    }
`

const LadoALado = styled.div`
    display: flex;
    gap: 24px;
    & span {
        display: flex;
        align-items: center;
    }
`

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

function ElegibilidadeEditarValor() {

    const navegar = useNavigate()
    let { tipo } = useParams()
    const [itensAdicionados, setItemAdicionados] = useState([])
    const {
        elegibilidade,
        setItemContrato,
        setFiliais,
        setDepartamentos
    } = useConfiguracaoElegibilidadeContext()
    const [loading, setLoading] = useState(false)
    const [modalBeneficioOpened, setModalBeneficioOpened] = useState(false)
    const toast = useRef(null)

    useEffect(() => {
      if(!elegibilidade)
      {
        setFiliais([])
        setDepartamentos([])
        setItemContrato([])
        navegar(-1)
      }
    }, [elegibilidade])
    
    function enviarNovaConfiguracao(configuracao) {
        setLoading(true);
    
        // Buscar os detalhes do item no endpoint
        http.get(`contrato_beneficio_item/${configuracao.contrato_item}/?format=json`)
        .then(response => {
            setItemAdicionados(response);
            setItemContrato(response);
            setModalBeneficioOpened(false);
        })
        .catch(error => {
            console.error('Erro ao buscar detalhes do item:', error);
        })
        .finally(() => {
            setLoading(false);
        });
    }

    return (
        <Frame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            {elegibilidade ? (
                <>
                    <BotaoGrupo align="space-between">
                        <Titulo>
                            <h6>Itens Elegíveis</h6>
                        </Titulo>
                        <Botao 
                            aoClicar={() => setModalBeneficioOpened(true)}
                            estilo="primaria"
                            size="medium"
                            filled
                        >
                            Adicionar Item
                        </Botao>
                    </BotaoGrupo>
                    
                    {/* Tabela de itens adicionados */}
                    {elegibilidade.itens_contrato.length > 0 ? (
                        <div style={{ marginTop: '20px' }}>
                            <DataTable 
                                value={elegibilidade.itens_contrato}
                                emptyMessage="Nenhum item adicionado"
                                tableStyle={{ minWidth: '72vw' }}
                            >
                                <Column 
                                    field="rowData.beneficio.nome_operadora" 
                                    header="Operadora" 
                                    style={{ width: '20%' }}
                                    body={(rowData) => (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <CustomImage src={rowData.beneficio.image_operadora} alt={rowData.beneficio.nome_operadora} width={24} height={24} />
                                            <Texto>{rowData.beneficio.nome_operadora}</Texto>
                                        </div>
                                    )}
                                />
                                <Column 
                                    field="rowData.beneficio.dados_beneficio.descricao" 
                                    header="Benefício" 
                                    style={{ width: '10%' }}
                                    body={(rowData) => (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {icones.find(icone => icone.name === rowData.beneficio.dados_beneficio.descricao).icone}
                                            {rowData.beneficio.dados_beneficio.descricao}
                                        </div>
                                    )}
                                />
                                <Column 
                                    field="descricao" 
                                    header="Descrição" 
                                    style={{ width: '10%' }}
                                />
                                <Column 
                                    field="valor" 
                                    header="Valor" 
                                    style={{ width: '10%' }}
                                    body={(rowData) => Real.format(rowData.valor || 0)}
                                />
                                <Column 
                                    field="valor_empresa" 
                                    header="Valor Empresa" 
                                    style={{ width: '10%' }}
                                    body={(rowData) => Real.format(rowData.valor_empresa || 0)}
                                />
                                <Column 
                                    field="valor_colaborador" 
                                    header="Valor Colaborador" 
                                    style={{ width: '10%' }}
                                    body={(rowData) => Real.format(rowData.valor_desconto || 0)}
                                />
                            </DataTable>
                        </div>
                    ) : (
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <Texto>Nenhum item de contrato adicionado ainda</Texto>
                        </div>
                    )}
                    
                    <ContainerButton>
                        <Botao aoClicar={() => navegar(-1)} estilo="neutro" size="medium" filled>
                            Voltar
                        </Botao>
                        <Botao 
                            aoClicar={() => console.log('Salvar', itensAdicionados)}
                            estilo="vermilion" 
                            size="medium" 
                            filled
                            disabled={itensAdicionados.length === 0}
                        >
                            Salvar Configuração
                        </Botao>
                    </ContainerButton>
                </>
            ) : (
                <Skeleton variant="rectangular" width={300} height={60} />
            )}
            <ModalConfigurarBeneficios opened={modalBeneficioOpened} aoFechar={() => setModalBeneficioOpened(false)} aoSalvar={enviarNovaConfiguracao} />
        </Frame>
    )
}

export default ElegibilidadeEditarValor