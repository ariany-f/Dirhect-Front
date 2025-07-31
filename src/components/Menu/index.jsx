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

            &.no-hover:hover {
                background: transparent;
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
            ...(import.meta.env.VITE_OPTIONS_LINHAS_TRANSPORTE === 'true' ? [
                { 
                    label: 'Linhas de Transporte', 
                    url: '/linhas-transporte',
                    icon: <FaBusAlt size={16} />
                }
            ] : [])
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

    // Verificar se o usuário tem apenas um perfil
    const gruposValidos = ArmazenadorToken.UserGroups ? 
        ArmazenadorToken.UserGroups.filter(grupo => !grupo.startsWith('_')) : [];
    const temApenasUmPerfil = gruposValidos.length <= 1;

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
            submeterLogout().then(() => {
                aoFechar()
                navegar('/login')
            }).catch(() => {
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
                        {!isDesktop && menuItems
                            .filter(section => {
                                // Filtrar seção de Benefícios apenas se tiver permissão
                                if (section.title === "Benefícios") {
                                    return ArmazenadorToken.hasPermission('view_contrato');
                                }
                                return true; // Mostrar outras seções normalmente
                            })
                            .map((section, sectionIndex) => (
                            <div key={sectionIndex} style={{ width: '100%' }}>
                                <div className="section-title">{section.title}</div>
                                {section.items
                                    .filter(item => {
                                        // Filtrar itens da seção Benefícios baseado na permissão
                                        if (section.title === "Benefícios") {
                                            // Operadoras também precisa da permissão view_contrato
                                            if (item.label === 'Operadoras') {
                                                return ArmazenadorToken.hasPermission('view_contrato');
                                            }
                                            // Outros itens da seção Benefícios
                                            return ArmazenadorToken.hasPermission('view_contrato');
                                        }
                                        return true; // Mostrar outros itens normalmente
                                    })
                                    .map((item, itemIndex) => (
                                    <li key={itemIndex} onClick={() => FecharMenu()}>
                                        <Link className="link" to={item.url}>
                                            <div className="group">
                                                {item.label}
                                                {item.icon}
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                                {sectionIndex < menuItems.filter(section => {
                                    if (section.title === "Benefícios") {
                                        return ArmazenadorToken.hasPermission('view_contrato');
                                    }
                                    return true;
                                }).length - 1 && <div className="divider" />}
                            </div>
                        ))}

                        {/* Divider antes das opções do usuário - Apenas no Mobile */}
                        {!isDesktop && <div className="divider" />}

                        {/* Informações do usuário */}
                        <li className="no-hover" style={{ 
                            padding: '12px 18px', 
                            borderBottom: '1px solid var(--neutro-200)',
                            cursor: 'default'
                        }}>
                            <div style={{ 
                                fontSize: '12px', 
                                color: 'var(--neutro-500)', 
                                textAlign: 'right',
                                fontWeight: '500'
                            }}>
                                {usuario.name && (
                                    <div style={{ 
                                        fontSize: '14px', 
                                        color: 'var(--neutro-950)', 
                                        fontWeight: '700',
                                        marginBottom: '4px'
                                    }}>
                                        {usuario.name}
                                    </div>
                                )}
                                {usuario.email}
                            </div>
                        </li>

                        {/* User Options */}
                        <li onClick={() => FecharMenu()}>
                            <Link className="link" to="/usuario">
                                <div className="group">
                                    {t('settings')}
                                    <IoMdSettings size={20} className="icon"/>
                                </div>
                            </Link>
                        </li>
                        {usuario.tipo !== "candidato" && usuario.tipo !== "funcionario" && ArmazenadorToken.hasPermission('view_user') && (
                            <li onClick={() => FecharMenu()}>
                                <Link className="link" to="/operador">
                                    <div className="group">
                                        {t('users')}
                                        <RiUserFollowFill size={20} className="icon"/>
                                    </div>
                                </Link>
                            </li>
                        )}
                        {import.meta.env.VITE_OPTIONS_MARKETPLACE === 'true' && usuario.tipo !== "candidato" && (
                            <li onClick={() => FecharMenu()}>
                                <Link className="link" to="/marketplace">
                                    <div className="group">
                                        Marketplace
                                        <MdShoppingCart size={20} className="icon"/>
                                    </div>
                                </Link>
                            </li>
                        )}
                        {!temApenasUmPerfil && (
                            <li onClick={() => FecharMenu()}>
                                <Link className="link" to="/login/selecionar-grupo">
                                    <div className="group">
                                        Alterar perfil
                                        <MdOutlineChevronRight size={20} className="icon"/>
                                    </div>
                                </Link>
                            </li>
                        )}
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