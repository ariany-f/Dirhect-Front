import styled from "styled-components"
import { MdOutlineChevronRight } from 'react-icons/md'
import { IoMdSettings } from 'react-icons/io'
import { RiUserFollowFill, RiLogoutCircleLine, RiOrganizationChart } from 'react-icons/ri'
import { GiTreeBranch } from "react-icons/gi"
import { Link, useNavigate } from "react-router-dom"
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"
import { ArmazenadorToken } from "@utils"
import { MdShoppingCart } from 'react-icons/md'

const DialogEstilizado = styled.dialog`
    display: inline-flex;
    border: 1px solid var(--neutro-200, #E5E5E5); 
    flex-direction: column;
    justify-content: center;
    align-items: center;
    top: 84px;  
    position: fixed;
    right: 55px;
    inset-inline-start: unset;
    transition: all 0.3s ease-in-out;
    z-index: 1200;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    @media screen and (max-width: 768px) {
        right: 16px;
        top: 70px;
    }

    & ul{
        padding: 0;
        margin: 0;
        text-align: right;
        display: flex;
        flex-direction: column;
        justify-content: end;
        align-items: end;
        & li{
            list-style: none;
            display: flex;
            padding: 16px 24px;
            width: 100%;
            transition: background 0.2s;

            &:hover {
                background: var(--neutro-100);
            }

            & .link {
                width: 100%;
                justify-content: end;
                align-items: center;
                align-self: stretch;
                font-size: 14px;
                font-weight: 700;
                text-decoration: none;
                color: inherit;
                & .group {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 16px;
                }
            }
        }
    }
    & .icon.sair {
        fill: var(--primaria);
        stroke: var(--primaria);
        color: var(--primaria);
    }
    & .icon {
        margin-right: 5px;
        box-sizing: initial;
        fill: var(--neutro-950);
        stroke: var(--neutro-950);
        color: var(--neutro-950);
    }
`

function Menu({ opened = false, aoFechar }){

    const { 
        usuario,
        submeterLogout,
    } = useSessaoUsuarioContext()

    const navegar = useNavigate()

    function Sair() {
        if(opened)
        {
            aoFechar()
            ArmazenadorToken.removerToken()
        }
        
        navegar('/login')
    }

    const FecharMenu = () => {
        aoFechar()
    }
    
    return (
        <>
        {opened &&
            <DialogEstilizado>
                <nav>
                    <ul>
                        <li onClick={() => FecharMenu()}>
                            <Link className="link" to="/usuario">
                                <div className="group">
                                    Meus dados
                                    <IoMdSettings size={20} className="icon"/>
                                </div>
                            </Link>
                        </li>
                        {usuario.tipo !== "candidato" && usuario.tipo !== "funcionario" && (
                            <li onClick={() => FecharMenu()}>
                                <Link className="link" to="/operador">
                                    <div className="group">
                                        Usuários do Sistema
                                        <RiUserFollowFill size={20} className="icon"/>
                                    </div>
                                </Link>
                            </li>
                        )}
                        {usuario.tipo !== "candidato" && (
                            <li onClick={() => FecharMenu()}>
                                <Link className="link" to="/marketplace">
                                    <div className="group">
                                        Marketplace
                                        <MdShoppingCart size={20} className="icon"/>
                                    </div>
                                </Link>
                            </li>
                        )}
                        <li onClick={Sair}>
                            <Link className="link">
                                <div className="group">
                                    Sair
                                    <RiLogoutCircleLine size={20} className="icon sair"/>
                                </div>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </DialogEstilizado>
        }
        </>
    )
}
export default Menu