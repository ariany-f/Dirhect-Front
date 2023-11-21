import { styled } from "styled-components"
import ItemNavegacao from "./ItemNavegacao"
import { AiFillHome } from "react-icons/ai"
import { RiFilePaperFill, RiUser3Fill, RiTrophyFill, RiTeamFill, RiBankCardFill, RiFileListFill } from "react-icons/ri"
import { BiSolidDashboard } from "react-icons/bi"
import { LuSparkles } from "react-icons/lu"
import "./BarraLateral.css"
import { Link, useLocation } from "react-router-dom"
import logo from '/imagens/logo.png'

const ListaEstilizada = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    width: 236px;
`
const BarraLateralEstilizada = styled.aside`
    display: inline-flex;
    padding: 26px 0px;
    flex-direction: column;
    align-items: flex-start;
    gap: 32px;
    flex-shrink: 0;
    background: var(--gradient-gradient-1, linear-gradient(180deg, #FF3C00 0%, #FF7B32 100%));
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
`


function BarraLateral() {

    const location = useLocation();

    const itensMenu = [
        {
            "id": 1,
            "url": "/",
            "pageTitulo": "Plataforma RH",
            "icone": <AiFillHome size={20} className="icon" />,
            "itemTitulo": "Home"
        },
        {
            "id": 2,
            "url": "/extrato",
            "pageTitulo": "Extrato",
            "icone": <RiFilePaperFill titulo="Extrato" size={20} className="icon" />,
            "itemTitulo": "Extrato"
        },
        {
            "id": 3,
            "url": "/colaborador",
            "pageTitulo": "Colaboradores",
            "icone": <RiUser3Fill size={20} className="icon" />,
            "itemTitulo": "Colaboradores"
        },
        {
            "id": 4,
            "url": "/departamento",
            "pageTitulo": "Departamentos",
            "icone": <RiTeamFill size={20} className="icon" />,
            "itemTitulo": "Departamentos"
        },
        {
            "id": 5,
            "url": "/cartao",
            "pageTitulo": "Cartões",
            "icone": <RiBankCardFill size={20} className="icon" />,
            "itemTitulo": "Cartões"
        },
        {
            "id": 6,
            "url": "/beneficio",
            "pageTitulo": "Benefícios",
            "icone": <BiSolidDashboard size={20} className="icon" />,
            "itemTitulo": "Benefícios"
        },
        {
            "id": 7,
            "url": "/premiacao",
            "pageTitulo": "Premiações",
            "icone": <RiTrophyFill size={20} className="icon" />,
            "itemTitulo": "Premiações"
        },
        {
            "id": 8,
            "url": "/despesa",
            "pageTitulo": "Despesas",
            "icone": <RiFileListFill size={20} className="icon" />,
            "itemTitulo": "Despesas"
        }
    ];

    const home = [
        'adicionar-cnpj',
        'adicionar-email',
        'adicionar-celular'
    ]

    return (
        <BarraLateralEstilizada>
             <Logo src={logo} alt="Logo Multi Benefícios" />
            <nav>
                <NavTitulo>Menu principal</NavTitulo>
                <ListaEstilizada>
                    {itensMenu.map((item) => {
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
                <NavTitulo>Para sua empresa</NavTitulo>
                <ListaEstilizada>
                    <Link className="link" titulo="Vantagens" to="/vantagens">
                        <ItemNavegacao ativo={(location.pathname === '/vantagens')}>
                            <LuSparkles size={20} className="icon" />
                            Vantagens <div className="novidade">Novidade</div>
                        </ItemNavegacao>
                    </Link>
                </ListaEstilizada>
            </nav>
        </BarraLateralEstilizada>
    )
}

export default BarraLateral