import styled from "styled-components"
import { MdOutlineChevronRight } from 'react-icons/md'
import { IoMdSettings } from 'react-icons/io'
import { RiUserFollowFill, RiLogoutCircleLine } from 'react-icons/ri'
import { Link, useNavigate } from "react-router-dom"
import { useSessaoUsuarioContext } from "../../contexts/SessaoUsuario"
import { ArmazenadorToken } from "../../utils"

const DialogEstilizado = styled.dialog`
    display: inline-flex;
    border: 1px solid var(--neutro-200, #E5E5E5); 
    flex-direction: column;
    justify-content: center;
    align-items: center;
    top: 84px;  
    position: fixed;
    right: 84px;
    inset-inline-start: unset;
    z-index: 9;
    & ul{
        padding: 0;
        & li{
            list-style: none;
            display: flex;
            padding: 24px;
            & .link {
                width: 100%;
                justify-content: space-between;
                align-items: center;
                align-self: stretch;
                font-size: 14px;
                font-weight: 700;
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
        }
        submeterLogout().then(response => {
            if(response.success)
            {
                ArmazenadorToken.removerToken()
                navegar('/login')
            }
        }).catch(response => {
            console.log(response)
        })
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
                                    <IoMdSettings size={20} className="icon"/>
                                    Meus dados
                                </div>
                                <MdOutlineChevronRight size={20} />
                            </Link>
                        </li>
                        {/* <li onClick={() => FecharMenu()}>
                            <Link className="link">
                                <div className="group">
                                    <IoCardSharp size={20} className="icon"/>
                                    Forma de pagamento
                                </div>
                                <MdOutlineChevronRight size={20} />
                            </Link>
                        </li> */}
                        <li onClick={() => FecharMenu()}>
                            <Link className="link" to="/operador">
                                <div className="group">
                                    <RiUserFollowFill size={20} className="icon"/>
                                    Operadores
                                </div>
                                <MdOutlineChevronRight size={20} />
                            </Link>
                        </li>
                        <li onClick={Sair}>
                            <Link className="link">
                                <div className="group">
                                    <RiLogoutCircleLine size={20} className="icon sair"/>
                                    Sair
                                </div>
                                
                                <MdOutlineChevronRight size={20} />
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