import { styled } from "styled-components"
import ItemNavegacao from "./ItemNavegacao"
import Botao from "@components/Botao"
import { AiFillHome } from "react-icons/ai"
import { HiMiniNewspaper, HiMiniShoppingBag  } from "react-icons/hi2";
import { RiHandCoinFill, RiFilePaperFill, RiUser3Fill, RiTrophyFill, RiTeamFill, RiBankCardFill, RiFileListFill, RiLogoutCircleLine, RiBlenderFill } from "react-icons/ri"
import { BiBusSchool, BiCart, BiDrink, BiSolidDashboard } from "react-icons/bi"
import { LuSparkles } from "react-icons/lu"
import "./BarraLateral.css"
import { Link, useLocation } from "react-router-dom"
import logo from '/imagens/logo.png'
import { useEffect, useRef, useState } from "react"
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"
import { FaBuilding, FaBusAlt, FaUmbrellaBeach } from "react-icons/fa"
import { FaUserGroup } from "react-icons/fa6"
import { FaBars } from "react-icons/fa";
import { BreadCrumb } from "primereact/breadcrumb"
import { BsHourglassSplit } from "react-icons/bs"
import { TbBeach, TbBusinessplan, TbTable, TbTableShare } from "react-icons/tb";
import { MdAllInbox, MdBusiness, MdHandshake, MdShoppingCart, MdShoppingCartCheckout } from "react-icons/md"
import { GoTasklist } from "react-icons/go";
import { IoBusiness } from "react-icons/io5"
import { PiHandshake } from "react-icons/pi"
import { Ripple } from 'primereact/ripple'

const ListaEstilizada = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    width: 246px;
    @media screen and (max-width: 760px) {
        width: 100%;
    }
`

const BarraLateralEstilizada = styled.aside`
    display: flex;
    padding: 26px 0px;
    margin-left: ${ props => (!!props.$opened) ? '0' : '-246px' };
    min-height: 100vh;
    flex-direction: column;
    align-items: flex-start;
    backdrop-filter: blur(30px) saturate(2);
    -webkit-backdrop-filter: blur(30px) saturate(2);
    transition: .5s cubic-bezier(.36,-0.01,0,.77);
    gap: 32px;
    flex-shrink: 0;
    background: linear-gradient(to bottom, #0c004c, #5d0b62);

    @media screen and (max-width: 760px) {
        position: fixed;
        z-index: 1100;
        width: 85%;
        max-width: 320px;
        margin-left: ${ props => (!!props.$opened) ? '0' : '-100%' };
        box-shadow: ${props => (!!props.$opened) ? '0 0 15px rgba(0,0,0,0.3)' : 'none'};
        height: 100vh;
        display: flex;
        overflow: hidden;
    }
`

const NavEstilizada = styled.nav`
    @media screen and (max-width: 760px) {
        width: 100%;
        height: calc(100vh - 150px);
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior-y: contain;
        position: relative;
        flex: 1;
        display: flex;
        flex-direction: column;

        /* Estilização da scrollbar */
        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
        }

        &::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 3px;
        }

        &::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.4);
        }
    }
`

const Overlay = styled.div`
    display: none;
    
    @media screen and (max-width: 760px) {
        display: ${props => (!!props.$opened) ? 'block' : 'none'};
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1099;
        backdrop-filter: blur(2px);
    }
`

const NavTitulo = styled.p`
    color: var(--white);
    opacity: 0.5;
    display: flex;
    padding: 10px 30px;
    align-items: center;
    gap: 10px;
    align-self: stretch;
    font-weight: 300;
`

const Logo = styled.img`
    padding: 0px 30px;
    max-width: 245px;
`

const StyledLink = styled(Link)`
    position: relative;
    overflow: hidden;
`

function BarraLateral() {

    const location = useLocation()
    
    const [barraLateralOpened, setBarraLateralOpened] = useState(window.innerWidth > 760)
    const [image, setImage] = useState(false)
    const [breadCrumbItems, setBreadCrumbItems] = useState([])
    const ref = useRef(null)
    const {
        usuario,
        setCompanies,
        usuarioEstaLogado
    } = useSessaoUsuarioContext()


    useEffect(() => {
        const handleResize = () => {
            setBarraLateralOpened(window.innerWidth > 760)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        if(logo){
            setImage(true)
        }
    }, [logo])

    useEffect(() => {
        const pathSegments = location.pathname.split('/').filter(Boolean);
        const newBreadCrumbItems = pathSegments.map((segment, index) => ({
            label: segment.charAt(0).toUpperCase() + segment.slice(1),
            url: '/' + pathSegments.slice(0, index + 1).join('/')
        }));
        setBreadCrumbItems(newBreadCrumbItems);
    }, [location]);

    const itensMenu = () => {

        switch (usuario.tipo) {
            case 'cliente':
                return [
                    {
                        "id": 1,
                        "url": "/",
                        "pageTitulo": "Home",
                        "icone": <AiFillHome size={20} className="icon" />,
                        "itemTitulo": "Home"
                    },
                    {
                        "id": 2,
                        "url": "/vagas",
                        "pageTitulo": "Vagas",
                        "icone": <RiFilePaperFill size={20} className="icon" />,
                        "itemTitulo": "Vagas"
                    },
                    {
                        "id": 3,
                        "url": "/admissao",
                        "pageTitulo": "Admissões",
                        "icone": <RiUser3Fill size={20} className="icon" />,
                        "itemTitulo": "Admissões"
                    },
                    {
                        "id": 4,
                        "url": "/colaborador",
                        "pageTitulo": "Colaboradores",
                        "icone": <BiSolidDashboard size={20} className="icon" />,
                        "itemTitulo": "Colaboradores"
                    },
                    {
                        "id": 5,
                        "url": "/dependentes",
                        "pageTitulo": "Dependentes",
                        "icone": <FaUserGroup size={20} className="icon" />,
                        "itemTitulo": "Dependentes"
                    },
                    {
                        "id": 6,
                        "url": "/ferias",
                        "pageTitulo": "Férias",
                        "icone": <FaUmbrellaBeach size={20} fill="white"/>,
                        "itemTitulo": "Férias"
                    },
                    {
                        "id": 7,
                        "url": "/ausencias",
                        "pageTitulo": "Ausências",
                        "icone": <BsHourglassSplit size={20} className="icon" />,
                        "itemTitulo": "Ausências"
                    },
                    {
                        "id": 8,
                        "url": "/demissoes",
                        "pageTitulo": "Demissões",
                        "icone": <RiUser3Fill size={20} className="icon" />,
                        "itemTitulo": "Demissões"
                    },
                    {
                        "id": 9,
                        "url": "/ciclos",
                        "pageTitulo": "Lançtos de Folha",
                        "icone": <HiMiniNewspaper size={20} fill="white"/>,
                        "itemTitulo": "Lançtos de Folha"
                    },
                    {
                        "id": 10,
                        "url": "/tarefas",
                        "pageTitulo": "Tarefas",
                        "icone": <GoTasklist size={20} fill="white" />,
                        "itemTitulo": "Tarefas"
                    },
                ];
            case 'candidato':
                return [
                    {
                        "id": 1,
                        "url": "/admissao/registro/1",
                        "pageTitulo": "Minha Admissão",
                        "icone": <RiFileListFill size={20} className="icon" />,
                        "itemTitulo": "Minha Admissão"
                    }
                ];
            case 'funcionario':
                return [
                    {
                        "id": 1,
                        "url": "/colaborador/detalhes/109",
                        "pageTitulo": "Meu Cadastro",
                        "icone": <RiFilePaperFill size={20} className="icon" />,
                        "itemTitulo": "Meu Cadastro"
                    },
                    {
                        "id": 1,
                        "url": "/admissao/registro/109",
                        "pageTitulo": "Minha Admissão",
                        "icone": <RiFileListFill size={20} className="icon" />,
                        "itemTitulo": "Minha Admissão"
                    },
                    {
                        "id": 2,
                        "url": "/dependentes",
                        "pageTitulo": "Dependentes",
                        "icone": <FaUserGroup size={20} className="icon" />,
                        "itemTitulo": "Dependentes"
                    },  {
                        "id": 3,
                        "url": "/ferias",
                        "pageTitulo": "Férias",
                        "icone": <FaUmbrellaBeach size={20} fill="white"/>,
                        "itemTitulo": "Férias"
                    },
                    {
                        "id": 4,
                        "url": "/ausencias",
                        "pageTitulo": "Ausências",
                        "icone": <BsHourglassSplit size={20} className="icon" />,
                        "itemTitulo": "Ausências"
                    },
                    {
                        "id": 5,
                        "url": "/demissoes",
                        "pageTitulo": "Demissões",
                        "icone": <RiUser3Fill size={20} className="icon" />,
                        "itemTitulo": "Demissões"
                    },
                    {
                        "id": 5,
                        "url": `/ciclos/${usuario.public_id}`,
                        "pageTitulo": "Ciclos de Pagamento",
                        "icone": <RiUser3Fill size={20} className="icon" />,
                        "itemTitulo": "Ciclos de Pagamento"
                    }
                ];
            case 'equipeFolhaPagamento':
                return [
                    {
                        "id": 1,
                        "url": "/",
                        "pageTitulo": "Home",
                        "icone": <AiFillHome size={20} className="icon" />,
                        "itemTitulo": "Home"
                    },
                    {
                        "id": 2,
                        "url": "/admissao",
                        "pageTitulo": "Admissões",
                        "icone": <RiUser3Fill size={20} className="icon" />,
                        "itemTitulo": "Admissões"
                    },
                    {
                        "id": 3,
                        "url": "/colaborador",
                        "pageTitulo": "Colaboradores",
                        "icone": <BiSolidDashboard size={20} className="icon" />,
                        "itemTitulo": "Colaboradores"
                    },
                    {
                        "id": 4,
                        "url": "/dependentes",
                        "pageTitulo": "Dependentes",
                        "icone": <FaUserGroup size={20} className="icon" />,
                        "itemTitulo": "Dependentes"
                    },
                    {
                        "id": 5,
                        "url": "/ferias",
                        "pageTitulo": "Férias",
                        "icone": <FaUmbrellaBeach size={20} fill="white"/>,
                        "itemTitulo": "Férias"
                    },
                    {
                        "id": 6,
                        "url": "/ausencias",
                        "pageTitulo": "Ausências",
                        "icone": <BsHourglassSplit size={20} className="icon" />,
                        "itemTitulo": "Ausências"
                    },
                    {
                        "id": 7,
                        "url": "/demissoes",
                        "pageTitulo": "Demissões",
                        "icone": <RiUser3Fill size={20} className="icon" />,
                        "itemTitulo": "Demissões"
                    },
                    {
                        "id": 8,
                        "url": "/ciclos",
                        "pageTitulo": "Lançtos de Folha",
                        "icone": <HiMiniNewspaper size={20} fill="white" />,
                        "itemTitulo": "Lançtos de Folha"
                    },
                    {
                        "id": 9,
                        "url": "/tarefas",
                        "pageTitulo": "Tarefas",
                        "icone": <GoTasklist size={20} fill="white" />,
                        "itemTitulo": "Tarefas"
                    },
                ];
            case 'equipeBeneficios':
                return [
                    {
                        "id": 1,
                        "url": "/",
                        "pageTitulo": "Home",
                        "icone": <AiFillHome size={20} className="icon" />,
                        "itemTitulo": "Home"
                    },
                    {
                        "id": 2,
                        "url": "/admissao",
                        "pageTitulo": "Admissões",
                        "icone": <RiUser3Fill size={20} className="icon" />,
                        "itemTitulo": "Admissões"
                    },
                    {
                        "id": 3,
                        "url": "/colaborador",
                        "pageTitulo": "Colaboradores",
                        "icone": <BiSolidDashboard size={20} className="icon" />,
                        "itemTitulo": "Colaboradores"
                    },
                    {
                        "id": 4,
                        "url": "/dependentes",
                        "pageTitulo": "Dependentes",
                        "icone": <FaUserGroup size={20} className="icon" />,
                        "itemTitulo": "Dependentes"
                    },
                    {
                        "id": 5,
                        "url": "/ferias",
                        "pageTitulo": "Férias",
                        "icone": <FaUmbrellaBeach size={20} fill="white"/>,
                        "itemTitulo": "Férias"
                    },
                    {
                        "id": 6,
                        "url": "/ausencias",
                        "pageTitulo": "Ausências",
                        "icone": <BsHourglassSplit size={20} className="icon" />,
                        "itemTitulo": "Ausências"
                    },
                    {
                        "id": 7,
                        "url": "/demissoes",
                        "pageTitulo": "Demissões",
                        "icone": <RiUser3Fill size={20} className="icon" />,
                        "itemTitulo": "Demissões"
                    },
                    // {
                    //     "id": 8,
                    //     "url": "/linhas-transporte",
                    //     "pageTitulo": "Linhas de Transporte",
                    //     "icone": <FaBusAlt size={20} className="icon" />,
                    //     "itemTitulo": "Linhas de Transporte"
                    // },
                    // {
                    //     "id": 9,
                    //     "url": "/beneficio",
                    //     "pageTitulo": "Benefícios",
                    //     "icone": <RiHandCoinFill size={20} className="icon" />,
                    //     "itemTitulo": "Benefícios"
                    // },
                    // {
                    //     "id": 10,
                    //     "url": "/operadoras",
                    //     "pageTitulo": "Operadoras",
                    //     "icone": <FaBuilding size={20} className="icon" />,
                    //     "itemTitulo": "Operadoras"
                    // },
                    {
                        "id": 11,
                        "url": "/contratos",
                        "pageTitulo": "Contratos",
                        "icone": <RiFileListFill size={20} className="icon" />,
                        "itemTitulo": "Contratos"
                    },
                    {
                        "id": 12,
                        "url": "/elegibilidade",
                        "pageTitulo": "Elegibilidade",
                        "icone": <LuSparkles size={20} className="icon" />,
                        "itemTitulo": "Elegibilidade"
                    },
                    {
                        "id": 13,
                        "url": "/pedidos",
                        "pageTitulo": "Pedidos",
                        "icone": <HiMiniShoppingBag size={20} fill="white" />,
                        "itemTitulo": "Pedidos"
                    },
                    {
                        "id": 14,
                        "url": "/movimentos",
                        "pageTitulo": "Movimentação",
                        "icone": <MdAllInbox size={20} fill="white" />,
                        "itemTitulo": "Movimentação"
                    }
                ];
            default:
                return [];
        }
    };
    
    const home = [
        'adicionar-cnpj',
        'adicionar-email',
        'adicionar-celular'
    ]
    
    const titulos = {
        'equipeFolhaPagamento': 'Folha de Pagamento',
        'equipeBeneficios': 'Benefícios',
        'funcionario': 'Colaborador',
        'candidato': 'Candidato',
        'cliente': 'Cliente'
    }

    function toggleBarraLateral() {
        setBarraLateralOpened(!barraLateralOpened);
    }

    const fecharMenu = () => {
        setBarraLateralOpened(false);
    }

    return (
        <>
            <Overlay $opened={barraLateralOpened} onClick={fecharMenu} />
            <BarraLateralEstilizada $opened={barraLateralOpened}>
                {image ?
                    <Logo src={logo} ref={ref} alt="Logo" />
                    : ''
                }
                <NavEstilizada>
                    <NavTitulo>{titulos[usuario.tipo]}</NavTitulo>
                    <ListaEstilizada>
                        {itensMenu().map((item) => {
                            return (
                                <StyledLink 
                                    key={item.id} 
                                    className="link p-ripple" 
                                    to={item.url}
                                    onClick={() => {
                                        if (window.innerWidth <= 760) {
                                            setBarraLateralOpened(false)
                                        }
                                    }}>
                                    <ItemNavegacao ativo={item.url === "/" ? location.pathname === "/" : location.pathname.startsWith(item.url)}>
                                        {item.icone}
                                        {item.itemTitulo}
                                    </ItemNavegacao>
                                    <Ripple />
                                </StyledLink>
                            )
                        })}
                    </ListaEstilizada>
                </NavEstilizada>
            </BarraLateralEstilizada>
            <div style={{display: 'Flex', backgroundColor: 'transparent', height: '5vh', position: 'absolute', top: '2.5vh', border: 'none', borderRadius: '4px', zIndex: '8'}}>
                <Botao aoClicar={toggleBarraLateral} tab={true} estilo={"neutro"} outStyle={{marginRight: '1vw', marginLeft: barraLateralOpened ? 'calc(246px + 1vw)' : '1vw', backdropFilter: 'blur(30px) saturate(2)', '-webkit-backdrop-filter': 'blur(30px) saturate(2)', transition: '.5s cubic-bezier(.36,-0.01,0,.77)'}} >
                    <FaBars></FaBars>
                </Botao>
            </div>
        </>
    )
}

export default BarraLateral