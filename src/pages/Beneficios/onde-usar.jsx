import { RiBusFill, RiComputerLine, RiShoppingCartFill, RiGasStationFill } from 'react-icons/ri'
import { FaCoins, FaTheaterMasks, FaTooth } from 'react-icons/fa'
import { BiBookReader } from 'react-icons/bi'
import { PiForkKnifeFill } from 'react-icons/pi'
import { MdOutlineMedicalServices, MdOutlineFastfood, MdSecurity } from 'react-icons/md'
import BotaoVoltar from "@components/BotaoVoltar"
import Container from "@components/Container"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import Frame from "@components/Frame"
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { IoFastFoodSharp } from 'react-icons/io5'
import { FaHeartPulse, FaMoneyBillTransfer } from 'react-icons/fa6'

const icones = [
    {
        "id": 1,
        "name": "Alimentação",
        "flexible_value": false,
        "description": "Mercados, supermercados e aplicativo de delivery.",
        "food_meal_one_category": false,
        "icone": <RiShoppingCartFill />
    },
    {
        "id": 2,
        "name": "Refeição",
        "flexible_value": false,
        "description": "Restaurantes, cafeterias, padarias, mercados, aplicativo de delivery e lojas de conveniência.",
        "food_meal_one_category": false,
        "icone": <IoFastFoodSharp />
    },
    {
        "id": 3,
        "name": "Mobilidade",
        "flexible_value": true,
        "description": "Postos de combustível, estacionamentos, pedágio, carros por aplicativo, recarga de bilhete de transporte e passagens de ônibus e trem.",
        "food_meal_one_category": false,
        "icone": <RiBusFill />
    },
    {
        "id": 4,
        "name": "Home Office",
        "flexible_value": true,
        "description": "Compra de cadeira ergométrica, itens de papelaria, assistência técnica de computador e custeio de contas de energia e internet",
        "food_meal_one_category": false,
        "icone": <RiComputerLine />
    },
    {
        "id": 5,
        "name": "Combustível",
        "flexible_value": true,
        "description": "",
        "food_meal_one_category": false,
        "icone": <RiGasStationFill />
    },
    {
        "id": 6,
        "name": "Cultura",
        "flexible_value": true,
        "description": "Streaming de vídeo e música, bancas de jornais, jogos online, ingressos para shows teatros e museus, instrumentos musicais, escolas de arte e música e parques de diversões, zoológicos e aquários.",
        "food_meal_one_category": false,
        "icone": <FaTheaterMasks />
    },
    {
        "id": 7,
        "name": "Educação",
        "flexible_value": true,
        "description": "Cursos online e presenciais, cursos de extensão, cursos e app de idiomas, ensino superior e técnico, eventos e feiras profissionais e livrarias e papelarias",
        "food_meal_one_category": false,
        "icone": <BiBookReader  />
    },
    {
        "id": 8,
        "name": "Saúde",
        "flexible_value": true,
        "description": "Farmácias, exames, consultas, serviços hospitalares, serviços médicos eterapias.",
        "food_meal_one_category": false,
        "icone": <FaHeartPulse />
    },
    {
        "id": 9,
        "name": "Auxílio Alimentação",
        "flexible_value": false,
        "description": "Alimentação e Refeição, tudo em uma só categoria.",
        "food_meal_one_category": true,
        "icone": <PiForkKnifeFill />
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
    }
]

const Card = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 24px;
    padding: 16px;
    align-self: stretch;
    border-radius: 16px;
    border: 1px solid var(--neutro-200);
    & svg * {
        color: var(--primaria)
    }
`

const IconBorder = styled.div`
   border-radius: 8px;
   background-color: var(--vermilion-50);
   padding: 8px;
`

const CardLine = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`

function BeneficioOndeUsar() {

    const [fixed, setFixed] = useState([])
    const [flexible, setFlexible] = useState([])
    
    useEffect(() => {
    
        if(fixed.length === 0)
        {
            setFixed(icones.filter((item) => {
                return !item.flexible_value
            }))
        }
        if(flexible.length === 0)
        {
            setFlexible(icones.filter((item) => {
                return item.flexible_value
            }))
        }
    }, [fixed, flexible])

    return (
       <>
       <Frame>
            <Container gap="24px">
                <BotaoVoltar linkFixo="/beneficio" />
                <Titulo>
                    <h6>Onde Usar</h6>
                </Titulo>
                <Titulo>
                    <b>Benefício Fixado</b>
                    <SubTitulo>
                        Refere-se à ao valor total que permanecerá fixo dentro dessa categoria, sem a possibilidade de distribuição de valor entre diferentes categorias de benefícios.
                    </SubTitulo>
                </Titulo>
                {
                    fixed.map(item => {
                        return (
                            <Card key={item.id}>
                                <IconBorder>{item.icone}</IconBorder>
                                <CardLine>
                                    <b>{item.name}</b>
                                    <small>{item.description}</small>
                                </CardLine>
                            </Card>
                        )
                    })
                }
                <Titulo>
                    <b>Benefício Flexível</b>
                    <SubTitulo>
                        O saldo flexível é aquele que pode ser transferido entre as categorias de benefícios. Você também tem a opção de fixar o valor para esses benefícios habilitando em “Fixar Valor” e definindo o valor que será fixo.
                    </SubTitulo>
                </Titulo>
                {
                    flexible.map(item => {
                        return (
                            <Card key={item.id}>
                                <IconBorder>{item.icone}</IconBorder>
                                <CardLine>
                                    <b>{item.name}</b>
                                    <small>{item.description}</small>
                                </CardLine>
                            </Card>
                        )
                    })
                }
            </Container>
        </Frame>
       </>
    )
}

export default BeneficioOndeUsar