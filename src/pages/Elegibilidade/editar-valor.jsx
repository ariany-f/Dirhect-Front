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


function ElegibilidadeEditarValor() {

    const navegar = useNavigate()
    let { tipo } = useParams()
    const {
        elegibilidade,
        setFiliais,
        setDepartamentos
    } = useConfiguracaoElegibilidadeContext()
    const [loading, setLoading] = useState(false)
    const [edicaoAberta, setEdicaoAberta] = useState(false)
    const toast = useRef(null)
     // Estados para os benefícios (igual ao modal)
     const [contratos, setContratos] = useState([]);
     const [itensContrato, setItensContrato] = useState([]);
     const [BeneficiosContrato, setBeneficiosContrato] = useState([]);
     const [contratoSelecionado, setContratoSelecionado] = useState(null);
     const [beneficioContratoSelecionado, setBeneficioContratoSelecionado] = useState(null);
     const [itemContratoSelecionado, setItemContratoSelecionado] = useState(null);
     const [carregandoContratos, setCarregandoContratos] = useState(false);
     const [carregandoItens, setCarregandoItens] = useState(false);
     const [carregandoBeneficios, setCarregandoBeneficios] = useState(false);
 

    useEffect(() => {
      if(!elegibilidade)
      {
        setFiliais([])
        setDepartamentos([])
        navegar(-1)
      }
      else
      {
        console.log(elegibilidade)
      }
    }, [elegibilidade])

     // Carrega contratos ao montar o componente
     useEffect(() => {
        carregarContratos();
    }, []);

    // Funções de carregamento (iguais ao modal)
    const carregarContratos = async () => {
        setCarregandoContratos(true);
        try {
            const response = await http.get('contrato/?format=json');
            setContratos(response.map(contrato => ({
                id: contrato.id,
                name: `${contrato.dados_operadora.nome} ${contrato.observacao}`,
                code: contrato.id,
                operadora: {
                    nome: contrato.dados_operadora.nome,
                    imagem: contrato.dados_operadora.imagem
                }
            })));
        } catch (erro) {
            console.error('Erro ao carregar contratos:', erro);
        } finally {
            setCarregandoContratos(false);
        }
    };

    const carregarBeneficiosContrato = async (contratoId) => {
        if (!contratoId) return;
        
        setCarregandoBeneficios(true);
        try {
            const response = await http.get(`contrato/${contratoId}/?format=json`);
            setBeneficiosContrato(response.beneficios.map(item => ({
                id: item.id,
                name: `${item.dados_beneficio.descricao} (${item.dados_beneficio.descricao})`,
                contrato: contratoId,
                beneficio: {
                    icone: item.dados_beneficio.descricao
                },
                code: item.id
            })));
        } catch (erro) {
            console.error('Erro ao carregar itens do contrato:', erro);
        } finally {
            setCarregandoBeneficios(false);
        }
    };
    
    const carregarItensContratoBeneficio = async (contratoId, beneficioId) => {
        if (!contratoId) return;
        
        setCarregandoItens(true);
        try {
            const response = await http.get(`contrato/${contratoId}/?format=json`);
            const filtered = response.beneficios.filter(item => item.id === beneficioId);
            setItensContrato(filtered[0].itens.map(item => ({
                id: item.id,
                name: `${item.descricao} (${item.descricao})`,
                code: item.id
            })));
        } catch (erro) {
            console.error('Erro ao carregar itens do contrato:', erro);
        } finally {
            setCarregandoItens(false);
        }
    };

    const handleContratoChange = (contrato) => {
        setContratoSelecionado(contrato);
        setBeneficioContratoSelecionado(null);
        setItemContratoSelecionado(null);
        if (contrato) {
            carregarBeneficiosContrato(contrato.code);
        } else {
            setBeneficiosContrato([]);
        }
    };

    const handleBeneficioChange = (beneficio) => {
        setBeneficioContratoSelecionado(beneficio);
        setItemContratoSelecionado(null);
        if (beneficio) {
            carregarItensContratoBeneficio(beneficio.contrato, beneficio.code);
        } else {
            setItensContrato([]);
        }
    };

    // Templates para os dropdowns (iguais ao modal)
    const beneficioOptionTemplate = (option) => {
        if(option) {
            const iconeEncontrado = icones.find(icone => icone.name === option.beneficio?.icone);
            return (
                <div className="flex align-items-center" style={{display:'flex', gap:'10px', alignItems:'center', justifyContent: 'start'}}>
                    {iconeEncontrado && iconeEncontrado.icone}
                    <Texto weight={600} size="12px">{option.name}</Texto>
                </div>
            );
        }
        return <div className="flex align-items-center">Selecione um benefício</div>;
    };

    const contratoOptionTemplate = (option) => {
        if(option) {
            return (
                <div className="flex align-items-center" style={{display:'flex', gap:'10px'}}>
                    {option.operadora?.imagem && (
                        <CustomImage 
                            alt={option.operadora.nome} 
                            src={option.operadora.imagem} 
                            width={'30px'}
                            height={20} 
                            size={80} 
                            title={option?.operadora?.nome} 
                        />
                    )}
                    <Texto weight={600} size="12px">{option.name}</Texto>
                </div>
            );
        }
        return <div className="flex align-items-center">Selecione um contrato</div>;
    };

    const editarRecarga = (evento) => {
        if (evento.key === 'Enter') {
            evento.preventDefault()
            setEdicaoAberta(false)
        }
    }

    return (
        <Frame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            {elegibilidade ?
                <>
                    <BotaoGrupo align="space-between">
                        <Titulo>
                            <h6>Itens Elegíveis</h6>
                        </Titulo>
                    </BotaoGrupo>
                    <br />
                    {/* Seção de seleção de benefícios */}
                    <Col12>
                        <Col6>
                            <DropdownItens 
                                valor={contratoSelecionado} 
                                setValor={handleContratoChange} 
                                options={contratos} 
                                label="Contrato" 
                                name="contrato" 
                                placeholder={carregandoContratos ? "Carregando..." : "Selecione o contrato"}
                                disabled={carregandoContratos}
                                optionTemplate={contratoOptionTemplate}
                            /> 
                        </Col6>
                        <Col6>
                            <DropdownItens 
                                valor={beneficioContratoSelecionado} 
                                setValor={handleBeneficioChange} 
                                options={BeneficiosContrato} 
                                label="Benefícios do Contrato" 
                                name="beneficioContrato" 
                                placeholder={carregandoBeneficios ? "Carregando..." : (contratoSelecionado ? "Selecione o benefício" : "Selecione um contrato primeiro")}
                                disabled={!contratoSelecionado || carregandoBeneficios}
                                optionTemplate={beneficioOptionTemplate}
                            />
                        </Col6>
                    </Col12>
                    <Col12>
                        <Col6>
                            <DropdownItens 
                                valor={itemContratoSelecionado} 
                                setValor={setItemContratoSelecionado} 
                                options={itensContrato} 
                                label="Item do Contrato" 
                                name="itemContrato" 
                                placeholder={carregandoItens ? "Carregando..." : (contratoSelecionado ? "Selecione o item" : "Selecione um benefício primeiro")}
                                disabled={!contratoSelecionado || carregandoItens}
                            />
                        </Col6>
                    </Col12>
                    <ContainerButton>
                        <Botao aoClicar={() => navegar(-1)} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
                        <LadoALado>
                            <span>Selecionado&nbsp;<Texto color='var(--primaria)' weight={700}>{elegibilidade.filiais ? (elegibilidade.filiais.length-1) : 0}</Texto></span>
                            <Botao aoClicar={() => true} estilo="vermilion" size="medium" filled>Continuar</Botao>
                        </LadoALado>
                    </ContainerButton>
                </>
            : <Skeleton variant="rectangular" width={300} height={60} />
            }
        </Frame>
    )
}

export default ElegibilidadeEditarValor