import styled from "styled-components"
import { MdOutlineChevronRight } from 'react-icons/md'
import { IoMdSettings } from 'react-icons/io'
import { RiUserFollowFill, RiLogoutCircleLine, RiOrganizationChart, RiHandCoinFill } from 'react-icons/ri'
import { GiTreeBranch } from "react-icons/gi"
import { Link, useNavigate } from "react-router-dom"
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"
import { ArmazenadorToken } from "@utils"
import { MdShoppingCart } from 'react-icons/md'
import { FaBuilding, FaBusAlt } from "react-icons/fa"
import { LuSparkles } from "react-icons/lu"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import http from "@http"

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
    min-width: 280px;

    @media screen and (max-width: 768px) {
        right: 16px;
        top: 70px;
    }

    & ul {
        padding: 0;
        margin: 0;
        text-align: right;
        display: flex;
        flex-direction: column;
        justify-content: end;
        align-items: end;
        width: 100%;

        & li {
            list-style: none;
            display: flex;
            padding: 12px 16px;
            width: 100%;
            transition: background 0.2s;
            justify-content: end;
            align-items: end;

            &:hover {
                background: var(--neutro-100);
            }

            & .link {
                width: 100%;
                justify-content: end;
                align-items: center;
                align-self: stretch;
                font-size: 14px;
                font-weight: 500;
                text-decoration: none;
                color: inherit;
                & .group {
                    display: flex;
                    justify-content: end;
                    align-items: center;
                    gap: 12px;
                }
            }
        }
    }

    & .divider {
        width: 100%;
        height: 1px;
        background: var(--neutro-200);
        margin: 4px 0;
    }

    & .section-title {
        width: 100%;
        padding: 8px 16px;
        font-size: 12px;
        font-weight: 600;
        color: var(--neutro-500);
        text-transform: uppercase;
        text-align: left;
    }

    & .icon.sair {
        fill: var(--primaria);
        stroke: var(--primaria);
        color: var(--primaria);
    }
    & .icon {
        margin-right: 0;
        box-sizing: initial;
        fill: var(--neutro-950);
        stroke: var(--neutro-950);
        color: var(--neutro-950);
    }
`

const menuItems = [
    {
        title: "Benefícios",
        items: [
            { 
                label: 'Benefícios', 
                url: '/beneficio',
                icon: <RiHandCoinFill size={18}/>
            }, 
            { 
                label: 'Operadoras', 
                url: '/operadoras',
                icon: <FaBuilding size={16} />
            }, 
            { 
                label: 'Linhas de Transporte', 
                url: '/linhas-transporte',
                icon: <FaBusAlt size={16} />
            }
        ]
    },
    {
        title: "Organização",
        items: [
            { 
                label: 'Estrutura Organizacional', 
                url: '/estrutura',
                icon: <RiOrganizationChart size={18}/>
            },
            { 
                label: 'Elegibilidade', 
                url: '/elegibilidade',
                icon: <LuSparkles size={16} className="icon" />
            }
        ]
    }
];

function Menu({ opened = false, aoFechar }){
    const { 
        usuario,
        submeterLogout,
    } = useSessaoUsuarioContext()
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
    const navegar = useNavigate()
    const { t } = useTranslation('common');

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth > 768);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    function Sair() {
        if(opened) {
            const data = {  
                refresh: ArmazenadorToken.RefreshToken
            }
            http.post(`token/blacklist/`, data).then(() => {
                ArmazenadorToken.removerToken()
            }).finally(() => {
                aoFechar()
                navegar('/login')
            })
        }
    }

    const FecharMenu = () => {
        aoFechar()
    }
    
    return (
        <>
        {opened &&
            <DialogEstilizado>
                <nav style={{ width: '100%' }}>
                    <ul>
                        {/* Menu Items - Apenas no Mobile */}
                        {!isDesktop && menuItems.map((section, sectionIndex) => (
                            <div key={sectionIndex} style={{ width: '100%' }}>
                                <div className="section-title">{section.title}</div>
                                {section.items.map((item, itemIndex) => (
                                    <li key={itemIndex} onClick={() => FecharMenu()}>
                                        <Link className="link" to={item.url}>
                                            <div className="group">
                                                {item.label}
                                                {item.icon}
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                                {sectionIndex < menuItems.length - 1 && <div className="divider" />}
                            </div>
                        ))}

                        {/* Divider antes das opções do usuário - Apenas no Mobile */}
                        {!isDesktop && <div className="divider" />}

                        {/* User Options */}
                        <li onClick={() => FecharMenu()}>
                            <Link className="link" to="/usuario">
                                <div className="group">
                                    {t('settings')}
                                    <IoMdSettings size={20} className="icon"/>
                                </div>
                            </Link>
                        </li>
                        {usuario.tipo !== "candidato" && usuario.tipo !== "funcionario" && (
                            <li onClick={() => FecharMenu()}>
                                <Link className="link" to="/operador">
                                    <div className="group">
                                        {t('users')}
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
                        <li onClick={() => FecharMenu()}>
                            <Link className="link" to="/login/selecionar-grupo">
                                <div className="group">
                                    Alterar perfil
                                    <MdOutlineChevronRight size={20} className="icon"/>
                                </div>
                            </Link>
                        </li>
                        <div className="divider" />
                        <li onClick={Sair}>
                            <Link className="link">
                                <div className="group">
                                    {t('logout')}
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