import { styled } from "styled-components"
import ItemNavegacao from "./ItemNavegacao"
import Botao from "@components/Botao"
import { AiFillHome } from "react-icons/ai"
import { RiHandCoinFill, RiFilePaperFill, RiUser3Fill, RiTrophyFill, RiTeamFill, RiBankCardFill, RiFileListFill, RiLogoutCircleLine, RiBlenderFill } from "react-icons/ri"
import { BiBusSchool, BiDrink, BiSolidDashboard } from "react-icons/bi"
import { LuSparkles } from "react-icons/lu"
import "./BarraLateral.css"
import { Link, useLocation } from "react-router-dom"
import logo from '/imagens/logo.png'
import { useEffect, useRef, useState } from "react"
import { useSessaoUsuarioContext } from "../../contexts/SessaoUsuario"
import { FaBusAlt } from "react-icons/fa"
import { FaUserGroup } from "react-icons/fa6"
import { FaBars } from "react-icons/fa";
import { BreadCrumb } from "primereact/breadcrumb"
import { BsHourglassSplit } from "react-icons/bs"
import { TbBeach, TbTable, TbTableShare } from "react-icons/tb";
import { MdAllInbox, MdShoppingCartCheckout } from "react-icons/md"
import { GoTasklist } from "react-icons/go";

const ListaEstilizada = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    width: 246px;
`
const BarraLateralEstilizada = styled.aside`
    display: 'inline-flex';
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
    background: #244078;
    @media screen and (max-width: 760px) {
        display: none;
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


function BarraLateral() {

    const location = useLocation()
    
    const [barraLateralOpened, setBarraLateralOpened] = useState(true)
    const [image, setImage] = useState(false)
    const [breadCrumbItems, setBreadCrumbItems] = useState([])
    const ref = useRef(null)
    const {
        usuario,
        setCompanies,
        usuarioEstaLogado
    } = useSessaoUsuarioContext()


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
                        "icone": <TbBeach size={20} stroke="white"/>,
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
                        "icone": <TbTableShare size={20} stroke="white" />,
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
                        "url": "/candidato/registro/1",
                        "pageTitulo": "Meu Cadastro",
                        "icone": <RiFilePaperFill size={20} className="icon" />,
                        "itemTitulo": "Meu Cadastro"
                    }
                ];
            case 'funcionario':
                return [
                    {
                        "id": 1,
                        "url": "/candidato/registro/1",
                        "pageTitulo": "Meu Cadastro",
                        "icone": <RiFilePaperFill size={20} className="icon" />,
                        "itemTitulo": "Meu Cadastro"
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
                        "icone": <TbBeach size={20} stroke="white"/>,
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
                    },
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
                        "icone": <TbBeach size={20} stroke="white"/>,
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
                        "icone": <TbTableShare size={20} stroke="white" />,
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
                        "icone": <TbBeach size={20} stroke="white"/>,
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
                    //     "url": "/beneficio",
                    //     "pageTitulo": "Tipos de Benefícios",
                    //     "icone": <RiHandCoinFill size={20} className="icon" />,
                    //     "itemTitulo": "Tipos de Benefícios"
                    // },
                    {
                        "id": 9,
                        "url": "/contratos",
                        "pageTitulo": "Contrato Fornecedor",
                        "icone": <RiFileListFill size={20} className="icon" />,
                        "itemTitulo": "Contrato Fornecedor"
                    },
                    {
                        "id": 10,
                        "url": "/linhas-transporte",
                        "pageTitulo": "Linhas de Transporte",
                        "icone": <FaBusAlt size={20} className="icon" />,
                        "itemTitulo": "Linhas de Transporte"
                    },
                    {
                        "id": 11,
                        "url": "/elegibilidade",
                        "pageTitulo": "Elegibilidade",
                        "icone": <LuSparkles size={20} className="icon" />,
                        "itemTitulo": "Elegibilidade"
                    },
                    {
                        "id": 12,
                        "url": "/pedidos",
                        "pageTitulo": "Pedidos",
                        "icone": <MdShoppingCartCheckout size={20} fill="white" />,
                        "itemTitulo": "Pedidos"
                    },
                    {
                        "id": 13,
                        "url": "/movimentos",
                        "pageTitulo": "Movimentos",
                        "icone": <MdAllInbox size={20} fill="white" />,
                        "itemTitulo": "Movimentos"
                    },
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

    return (
        <>
        <BarraLateralEstilizada $opened={barraLateralOpened}>
            

             {image ?
                <Logo src={logo} ref={ref} alt="Logo" />
                : ''
            }
            <nav>
                <NavTitulo>{titulos[usuario.tipo]}</NavTitulo>
                <ListaEstilizada>
                    {itensMenu().map((item) => {
                        return (
                            <Link key={item.id} className="link" to={item.url}>
                                <ItemNavegacao ativo={(('/'+location.pathname.split('/')[1]) === item.url) || (home.includes(location.pathname.split('/')[1]) && item.url == '/')}>
                                    {item.icone}
                                    {item.itemTitulo}
                                </ItemNavegacao>
                            </Link>
                        )
                    })}
                </ListaEstilizada>
            </nav>
        </BarraLateralEstilizada>
        <div style={{display: 'Flex', backgroundColor: 'transparent', height: '5vh', position: 'absolute', top: '3vh', border: 'none', borderRadius: '4px'}}>
        <Botao aoClicar={toggleBarraLateral} tab={true} estilo={"neutro"} outStyle={{marginRight: '1vw', marginLeft: barraLateralOpened ? 'calc(246px + 1vw)' : '1vw', backdropFilter: 'blur(30px) saturate(2)', '-webkit-backdrop-filter': 'blur(30px) saturate(2)', transition: '.5s cubic-bezier(.36,-0.01,0,.77)'}} >
            <FaBars></FaBars>
        </Botao>
        {/* <BreadCrumb model={breadCrumbItems} /> */}
        </div>
        </>
    )
}

export default BarraLateral