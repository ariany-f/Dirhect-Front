import { styled } from "styled-components"
import ItemNavegacao from "./ItemNavegacao"
import { AiFillHome } from "react-icons/ai"
import { RiFilePaperFill, RiUser3Fill, RiTrophyFill, RiTeamFill, RiBankCardFill, RiFileListFill } from "react-icons/ri"
import { BiSolidDashboard } from "react-icons/bi"
import { LuSparkles } from "react-icons/lu"
import "./BarraLateral.css"
import { Link, useLocation } from "react-router-dom"

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
    return (
        <BarraLateralEstilizada>
             <Logo src="/imagens/logo.png" alt="Logo Multi Benefícios" />
            <nav>
                <NavTitulo>Menu principal</NavTitulo>
                <ListaEstilizada>
                    <Link className="link" to="/dashboard">
                        <ItemNavegacao ativo={(location.pathname === '/dashboard')}>
                            <AiFillHome size={20} className="icon" />
                            Home
                        </ItemNavegacao>
                    </Link>
                    <ItemNavegacao ativo={false}>
                        <RiFilePaperFill size={20} className="icon" />
                        Extrato
                    </ItemNavegacao>
                    <Link className="link" to="/dashboard/colaboradores">
                        <ItemNavegacao ativo={(location.pathname === '/dashboard/colaboradores')}>
                            <RiUser3Fill size={20} className="icon" />
                            Colaboradores
                        </ItemNavegacao>
                    </Link>
                    <ItemNavegacao ativo={false}>
                        <RiTeamFill size={20} className="icon" />
                        Departamentos
                    </ItemNavegacao>
                    <ItemNavegacao ativo={false}>
                        <RiBankCardFill size={20} className="icon" />
                        Cartões
                    </ItemNavegacao>
                    <ItemNavegacao ativo={false}>
                        <BiSolidDashboard size={20} className="icon" />
                        Benefícios
                    </ItemNavegacao>
                    <ItemNavegacao ativo={false}>
                        <RiTrophyFill size={20} className="icon" />
                        Premiações
                    </ItemNavegacao>
                    <ItemNavegacao ativo={false}>
                        <RiFileListFill size={20} className="icon" />
                        Despesas
                    </ItemNavegacao>
                </ListaEstilizada>
                <NavTitulo>Para sua empresa</NavTitulo>
                <ListaEstilizada>
                    <ItemNavegacao>
                        <LuSparkles size={20} className="icon" />
                        Vantagens <div className="novidade">Novidade</div>
                    </ItemNavegacao>
                </ListaEstilizada>
            </nav>
        </BarraLateralEstilizada>
    )
}

export default BarraLateral