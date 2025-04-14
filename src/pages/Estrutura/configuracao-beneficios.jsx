import http from '@http'
import { useEffect, useState } from "react"
import { useParams } from 'react-router-dom'
import Frame from "@components/Frame"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import Texto from "@components/Texto"
import BotaoSemBorda from "@components/BotaoSemBorda"
import MainContainer from "@components/MainContainer"
import Dashboard from '@assets/Dashboard.svg'
import { RiBusFill, RiComputerLine, RiShoppingCartFill, RiGasStationFill, RiEBike2Fill } from 'react-icons/ri'
import { FaPen, FaCar, FaCoins, FaQuestion, FaTheaterMasks, FaTooth } from 'react-icons/fa'
import { BiBookReader } from 'react-icons/bi'
import { PiForkKnifeFill } from 'react-icons/pi'
import { MdOutlineMedicalServices, MdOutlineFastfood, MdSecurity } from 'react-icons/md'
import { IoFastFoodSharp } from 'react-icons/io5'
import { FaHeartPulse, FaMoneyBillTransfer } from 'react-icons/fa6'
import { MdDirectionsBike } from "react-icons/md";
import styled from 'styled-components'
import ModalConfigurarBeneficios from '../../components/ModalConfigurarBeneficios'

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


const Beneficio = styled.div`
   display: flex;
    width: 308px;
    padding: 16px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 24px;
    align-self: stretch;
    border-radius: 16px;
    border: 1px solid var(--neutro-200);
`

const Col12 = styled.div`
    display: flex;
    width: 100%;
    gap: 24px;
    flex-wrap: wrap;
`

const Col12Spaced = styled.div`
    display: flex;
    width: 100%;
    gap: 8px;
    justify-content: space-between;
`

const Col6Input = styled.div`
    flex: 1;
    width: 50%;
`

const Col6 = styled.div`
    display: inline-flex;
    align-items: start;
    justify-content: center;
    gap: 8px;
    flex-direction: column;
`

const Item = styled.div`
    cursor: pointer;
    border-width: 1px;
    border-style: solid;
    border-radius: 16px;
    display: flex;
    padding: 20px;
    justify-content: space-between;
    align-items: center;
    width: 94%;
    border-color: ${ props => props.$active ? 'var(--primaria)' : 'var(--neutro-200)' };
`;

const Badge = styled.div`
    cursor: pointer;
    flex-direction: column;
    gap: 24px;
    padding: 2px 8px;
    font-size: 12px;
    color: var(--neutro-600);
    font-weight: 600;
    border-radius: 8px;
    display: flex;
    border: 1px solid var(--neutro-200);
    background-color: var(--neutro-50);
    & p {
        color: var(--neutro-100);
        font-weight: 700;
    }
`

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

function EstruturaConfiguracaoBeneficios(type = 'Filial') {

    let { id } = useParams()
    const [configuracoes, setConfiguracoes] = useState(null)

    useEffect(() => {
        if(id && (!configuracoes)) {
            http.get(`matriz_eligibilidade/?format=json`)
                .then(response => {
                    const atualizada = response.filter(
                        el => el.content_type_name === type.type && el.entidade_id_origem === id
                    )
                    setConfiguracoes(atualizada)
                })
                .catch(erro => console.log(erro))
        }
        console.log(configuracoes)
    }, [configuracoes, id, type])

    // Função para encontrar o ícone correspondente ao benefício
    const getIcone = (descricaoBeneficio) => {
        const beneficioMap = {
            'Vale Combustível': 'Vale Combustivel',
            'Saúde': 'Saúde'
        };
        
        const nomeIcone = beneficioMap[descricaoBeneficio] || descricaoBeneficio;
        const iconeEncontrado = icones.find(icone => icone.name === nomeIcone);
        return iconeEncontrado ? iconeEncontrado.icone : null;
    }

    return (
        <Frame>
            {configuracoes && configuracoes.length > 0 ? (
                <Col12>
                    {configuracoes.map((config) => {
                        const beneficio = config.item_beneficio;
                        const dadosBeneficio = beneficio.beneficio.dados_beneficio;
                        const icone = getIcone(dadosBeneficio.descricao);
                        
                        return (
                            <Col6 key={config.id}>
                                <Beneficio>
                                    <Col12Spaced>
                                        <Col6>
                                            {icone && <Texto weight={600}>{icone}  {dadosBeneficio.descricao}</Texto>}
                                        </Col6>
                                        <Col6>
                                            <BotaoSemBorda aoClicar={() => {}}>
                                                <FaPen /> Editar
                                            </BotaoSemBorda>
                                        </Col6>
                                    </Col12Spaced>
                                    
                                    <div style={{ marginTop: '16px' }}>
                                        <Texto>Plano: {beneficio.descricao}</Texto>
                                        
                                        <Col12Spaced style={{ marginTop: '12px' }}>
                                            <Col6>
                                                <Badge>
                                                    {beneficio.tipo_calculo === 'F' ? 'Fixo' : 'Variável'}
                                                </Badge>
                                                <Texto weight={600}>
                                                    {Real.format(beneficio.valor)}
                                                </Texto>
                                            </Col6>
                                            
                                            <Col6>
                                                <Badge>Desconto</Badge>
                                                <Texto weight={600}>
                                                    {Real.format(beneficio.valor_desconto)}
                                                </Texto>
                                            </Col6>
                                        </Col12Spaced>
                                    </div>
                                </Beneficio>
                            </Col6>
                        );
                    })}
                </Col12>
            ) : (
                <Frame align="center">
                    <MainContainer align="center">
                        <img src={Dashboard} size={100} alt="Nenhum contrato" />
                        <Titulo>
                            <h6>Nenhum contrato configurado</h6>
                            <SubTitulo>
                                Quando houver contratos configurados, eles aparecerão aqui
                            </SubTitulo>
                        </Titulo>
                    </MainContainer>
                </Frame>
            )}
        </Frame>
    )
}

export default EstruturaConfiguracaoBeneficios