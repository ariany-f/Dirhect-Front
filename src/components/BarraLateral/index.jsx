import { styled } from "styled-components"
import ItemNavegacao from "./ItemNavegacao"
import Botao from "@components/Botao"
import { AiFillHome } from "react-icons/ai"
import { HiMiniNewspaper, HiMiniShoppingBag } from "react-icons/hi2"
import { RiHandCoinFill, RiFilePaperFill, RiUser3Fill, RiTrophyFill, RiTeamFill, RiBankCardFill, RiFileListFill, RiLogoutCircleLine, RiBlenderFill } from "react-icons/ri"
import { BiBusSchool, BiCart, BiDrink, BiSolidDashboard } from "react-icons/bi"
import { LuSparkles } from "react-icons/lu"
import "./BarraLateral.css"
import { Link, useLocation } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"
import { FaBuilding, FaBusAlt, FaUmbrellaBeach, FaUserTimes } from "react-icons/fa"
import { FaUserGroup } from "react-icons/fa6"
import { FaBars } from "react-icons/fa"
import { BreadCrumb } from "primereact/breadcrumb"
import { BsHourglassSplit } from "react-icons/bs"
import { TbBeach, TbBusinessplan, TbTable, TbTableShare } from "react-icons/tb"
import { MdAllInbox, MdBusiness, MdHandshake, MdShoppingCart, MdShoppingCartCheckout } from "react-icons/md"
import { GoTasklist } from "react-icons/go"
import { IoBusiness } from "react-icons/io5"
import { useTranslation } from 'react-i18next';
import { PiHandshake } from "react-icons/pi"
import { Ripple } from 'primereact/ripple'
import { ArmazenadorToken } from "@utils"
import http from "@http"
import { FaExchangeAlt } from 'react-icons/fa'
import BrandColors from '@utils/brandColors'

const ListaEstilizada = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    width: 245px;
    height: calc(100vh - 200px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    position: relative;
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0);
    will-change: transform;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;

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
`

const BarraLateralEstilizada = styled.aside`
    display: flex;
    padding: 26px 0px;
    margin-left: ${props => (!!props.$opened) ? '0' : '-246px'};
    min-height: 100vh;
    flex-direction: column;
    align-items: flex-start;
    backdrop-filter: blur(30px) saturate(2);
    -webkit-backdrop-filter: blur(30px) saturate(2);
    transition: .5s cubic-bezier(.36,-0.01,0,.77);
    gap: 32px;
    flex-shrink: 0;
    background: linear-gradient(to bottom, var(--terciaria), var(--gradient-secundaria));

    @media screen and (max-width: 760px) {
        position: fixed;
        z-index: 1100;
        max-width: 320px;
        margin-left: ${props => (!!props.$opened) ? '0' : '-100%'};
        box-shadow: ${props => (!!props.$opened) ? '0 0 15px rgba(0,0,0,0.3)' : 'none'};
        height: 100vh;
        overflow: hidden;
    }
`

const NavEstilizada = styled.nav`
   
        height: calc(100vh - 150px);
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
        position: relative;
        flex: 1;
        display: flex;
        flex-direction: column;
        transform: translate3d(0, 0, 0);
        -webkit-transform: translate3d(0, 0, 0);
        will-change: transform;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        
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
    padding: 0px 40px;
    max-width: 245px;
`

const StyledLink = styled(Link)`
    position: relative;
    overflow: hidden;
`

function capitalizeTipo(tipo) {
  if (!tipo) return '';
  return tipo
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function BarraLateral({ $sidebarOpened }) {
   
    const location = useLocation()
    
    const [barraLateralOpened, setBarraLateralOpened] = useState($sidebarOpened)
    const [image, setImage] = useState(false)
    const [breadCrumbItems, setBreadCrumbItems] = useState([])
    const ref = useRef(null)
    const { t } = useTranslation('common');

    const [grupos, setGrupos] = useState([]);
    const [parametrosMenus, setParametrosMenus] = useState({});

    const {
        usuario,
        setCompanies,
        usuarioEstaLogado
    } = useSessaoUsuarioContext()

    // Verificar se o usuário tem apenas um perfil
    const gruposValidos = ArmazenadorToken.UserGroups ? 
        ArmazenadorToken.UserGroups.filter(grupo => !grupo.startsWith('_')) : [];
    const temApenasUmPerfil = gruposValidos.length <= 1;

    
    useEffect(() => {
        if(usuario.tipo) {
            // Se já existe no ArmazenadorToken, usa ele
            if (ArmazenadorToken.UserPermissions && Array.isArray(ArmazenadorToken.UserPermissions) && ArmazenadorToken.UserPermissions.length > 0) {
                setGrupos(ArmazenadorToken.UserPermissions);
            } else {
                http.get(`permissao_grupo/?format=json&name=${usuario.tipo}`)
                    .then(response => {
                        setGrupos(response);
                        ArmazenadorToken.definirPermissoes(response);
                    })
                    .catch(error => console.log('Erro ao buscar grupos:', error));
            }

            // Buscar parâmetros de menus
            http.get('parametros/por-assunto/?assunto=MENUS')
                .then(response => {
                    console.log('Parâmetros de menus:', response);
                    setParametrosMenus(response.parametros || {});
                })
                .catch(error => console.log('Erro ao buscar parâmetros de menus:', error));
        }
    }, [usuario]);

    useEffect(() => {

        const handleTouchMove = (e) => {
            if ($sidebarOpened && window.innerWidth <= 760) {
                const navElement = document.querySelector('nav')
                if (navElement && !navElement.contains(e.target)) {
                    e.preventDefault()
                }
            }
        }

        if (window.innerWidth <= 760) {
            document.addEventListener('touchmove', handleTouchMove, { passive: false })
        }

        return () => {
            document.removeEventListener('touchmove', handleTouchMove)
        }
    }, [$sidebarOpened])

    useEffect(() => {
        if(usuario.tipo) {
            const logoPath = BrandColors.getBrandLogo();
            if (logoPath) {
                setImage(true);
            }
        }
    }, [usuario.tipo]);

    useEffect(() => {
        const pathSegments = location.pathname.split('/').filter(Boolean)
        const newBreadCrumbItems = pathSegments.map((segment, index) => ({
            label: segment.charAt(0).toUpperCase() + segment.slice(1),
            url: '/' + pathSegments.slice(0, index + 1).join('/')
        }))
        setBreadCrumbItems(newBreadCrumbItems)
    }, [location])

    // Mapeamento de permissões para menus
    const permissionMap = {
        'view_funcionario': [t('colaborators'), t('terminations')],
        'view_admissao': [t('hirings')],
        'view_tarefa': [t('processes')],
        'view_dependente': [t('dependents')],
        'view_ferias': [t('vacations')],
        'view_ausencia': [t('absences')],
        'view_contrato': [t('contracts')],
        'view_contratobeneficioitem': [t('benefits_eligibility')],
        'view_vaga': [t('positions')],
    };

    // Menus sempre visíveis
    const alwaysVisible = [
        {
            id: 1,
            url: '/',
            pageTitulo: t('home'),
            icone: <AiFillHome size={20} className="icon" />,
            itemTitulo: t('home'),
        },
    ];

    // Buscar permissões do grupo do usuário logado diretamente
    const grupo = grupos.find(g => g.name === usuario.tipo);
    const userPermissions = grupo ? grupo.permissions.map(p => p.codename) : [];
    const userGroups = grupo ? grupo.name : [];

    // Menus condicionais por permissão
    const conditionalMenus = [
        {
            id: 3,
            url: '/admissao',
            pageTitulo: t('hirings'),
            icone: <RiUser3Fill size={20} className="icon" />,
            itemTitulo: t('hirings'),
            permission: 'view_admissao',
        },
        {
            id: 7,
            url: '/tarefas',
            pageTitulo: t('processes'),
            icone: <GoTasklist size={20} fill="white" />, 
            itemTitulo: t('processes'),
            permission: 'view_tarefa',
        },
        {
            id: 19,
            url: '/atividades',
            pageTitulo: t('activities'),
            icone: <BsHourglassSplit size={20} className="icon" />,
            itemTitulo: t('activities'),
            permission: 'view_tarefa',
        },
        {
            id: 11,
            url: '/colaborador',
            pageTitulo: t('colaborators'),
            icone: <BiSolidDashboard size={20} className="icon" />,
            itemTitulo: t('colaborators'),
            permission: 'view_funcionario',
        },
        {
            id: 12,
            url: '/dependentes',
            pageTitulo: t('dependents'),
            icone: <FaUserGroup size={20} className="icon" />,
            itemTitulo: t('dependents'),
            permission: 'view_dependente',
        },
        {
            id: 13,
            url: '/ferias',
            pageTitulo: t('vacation_program'),
            icone: <FaUmbrellaBeach size={20} fill="white"/>,
            itemTitulo: t('vacation_program'),
            permission: 'view_ferias',
        },
        {
            id: 14,
            url: '/ausencias',
            pageTitulo: t('absences'),
            icone: <BsHourglassSplit size={20} className="icon" />,
            itemTitulo: t('absences'),
            permission: 'view_ausencia',
        },
        {
            id: 15,
            url: '/demissoes',
            pageTitulo: t('terminations'),
            icone: <FaUserTimes size={20} className="icon" />,
            itemTitulo: t('terminations'),
            permission: 'view_funcionario',
        },
        {
            id: 16,
            url: '/contratos',
            pageTitulo: t('contracts'),
            icone: <RiFileListFill size={20} className="icon" />,
            itemTitulo: t('contracts'),
            permission: 'view_contrato',
        },
        {
            id: 17,
            url: '/elegibilidade',
            pageTitulo: t('benefits_eligibility'),
            icone: <LuSparkles size={20} className="icon" stroke="white"/>,
            itemTitulo: t('benefits_eligibility'),
            permission: 'view_contratobeneficioitem',
        },
        {
            id: 18,
            url: '/vagas',
            pageTitulo: t('positions'),
            icone: <RiFilePaperFill size={20} className="icon" />,
            itemTitulo: t('positions'),
            permission: 'view_vagas',
        },
        {
            id: 4,
            url: '/pedidos',
            pageTitulo: t('orders'),
            icone: <HiMiniShoppingBag size={20} fill="white" />, 
            itemTitulo: t('orders'),
            permission: 'view_pedido',
        },
        {
            id: 5,
            url: '/movimentos',
            pageTitulo: 'Movimentação',
            icone: <MdAllInbox size={20} fill="white" />, 
            itemTitulo: 'Movimentação',
            permission: 'view_pedido',
        },
        {
            id: 6,
            url: '/ciclos',
            pageTitulo: 'Lançtos de Folha',
            icone: <HiMiniNewspaper size={20} fill="white"/>,
            itemTitulo: 'Lançtos de Folha',
            permission: 'view_folha',
        },
        {
            id: 9,
            url: '/colaborador/detalhes/109',
            pageTitulo: 'Meu Cadastro',
            icone: <RiFilePaperFill size={20} className="icon" />,
            itemTitulo: 'Meu Cadastro',
            permission: 'view_cadastro',
        },
        {
            id: 10,
            url: '/ciclos/1',
            pageTitulo: 'Ciclos de Pagamento',
            icone: <RiUser3Fill size={20} className="icon" />,
            itemTitulo: 'Ciclos de Pagamento',
            permission: 'view_folha',
        },
    ];

    // Adicionar permissões de acordo com o grupo do usuário GAMBIARRA
    if(userGroups.includes('Benefícios')) {
        userPermissions.push('view_pedido')
    }
    else if(userGroups.includes('RH')) {
       // userPermissions.push('view_folha')
    }
    else if(userGroups.includes('Colaborador')) {
        userPermissions.push('view_cadastro')
    }


    // Função para normalizar texto (remover acentos e caracteres especiais)
    const normalizarTexto = (texto) => {
        return texto
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .replace(/[^a-zA-Z0-9\s]/g, '') // Remove caracteres especiais
            .replace(/\s+/g, '_') // Substitui espaços por underscore
            .toUpperCase();
    };

    // Função para verificar se um menu deve ser exibido baseado nos parâmetros
    const menuDeveSerExibido = (menu) => {
        // Traduz o nome do menu usando i18n e normaliza
        const menuNameTranslated = normalizarTexto(t(menu.itemTitulo.toLowerCase()));
        
        const perfilMenu = `${userGroups.toUpperCase()}_${menuNameTranslated}`;
        const todosMenu = `TODOS_${menuNameTranslated}`;
        
        // Também verifica versões no singular/plural para compatibilidade
        const menuNameSingular = menuNameTranslated.replace(/S$/, ''); // Remove 'S' final
        const menuNamePlural = menuNameTranslated.endsWith('S') ? menuNameTranslated : `${menuNameTranslated}S`; // Adiciona 'S' se não terminar
        
        const perfilMenuSingular = `${userGroups.toUpperCase()}_${menuNameSingular}`;
        const perfilMenuPlural = `${userGroups.toUpperCase()}_${menuNamePlural}`;
        const todosMenuSingular = `TODOS_${menuNameSingular}`;
        const todosMenuPlural = `TODOS_${menuNamePlural}`;
        
        // Função para buscar parâmetro de forma case-insensitive
        const buscarParametro = (chave) => {
            // Primeiro tenta a chave exata
            if (parametrosMenus[chave] !== undefined) {
                return parametrosMenus[chave];
            }
            
            // Depois tenta case-insensitive
            const chaveLower = chave.toLowerCase();
            for (const [key, value] of Object.entries(parametrosMenus)) {
                if (key.toLowerCase() === chaveLower) {
                    return value;
                }
            }
            
            return undefined;
        };
        
        console.log(`Verificando menu: ${menu.itemTitulo}`, {
            originalName: menu.itemTitulo,
            translatedName: menuNameTranslated,
            perfilMenu,
            todosMenu,
            perfilMenuSingular,
            perfilMenuPlural,
            todosMenuSingular,
            todosMenuPlural,
            perfilValue: buscarParametro(perfilMenu) || buscarParametro(perfilMenuSingular) || buscarParametro(perfilMenuPlural),
            todosValue: buscarParametro(todosMenu) || buscarParametro(todosMenuSingular) || buscarParametro(todosMenuPlural)
        });
        
        // Verifica se existe parâmetro específico para o perfil (original, singular e plural)
        const perfilValue = buscarParametro(perfilMenu) || buscarParametro(perfilMenuSingular) || buscarParametro(perfilMenuPlural);
        if (perfilValue !== undefined) {
            return perfilValue === 'true' || perfilValue === '1';
        }
        
        // Verifica se existe parâmetro para todos os perfis (original, singular e plural)
        const todosValue = buscarParametro(todosMenu) || buscarParametro(todosMenuSingular) || buscarParametro(todosMenuPlural);
        if (todosValue !== undefined) {
            return todosValue === 'true' || todosValue === '1';
        }
        
        // Se não há parâmetro específico, permite o menu (comportamento padrão)
        return true;
    };

    // Filtrar menus condicionais pelas permissões do usuário E pelos parâmetros
    const filteredConditionalMenus = conditionalMenus.filter(menu => 
        userPermissions.includes(menu.permission) && menuDeveSerExibido(menu)
    );

    // Juntar menus sempre visíveis e condicionais
    const menus = [...alwaysVisible, ...filteredConditionalMenus];

    // Ordem desejada conforme imagem
    const ordemDesejada = [
      t('home'),
      t('positions'),
      t('hirings'),
      t('colaborators'),
      t('dependents'),
      t('vacation_program'),
      t('absences'),
      t('terminations'),
      t('contracts'),
      t('benefits_eligibility'),
      t('orders'),
      'Movimentação',
      t('processes'),
      t('activities'),
      'Lançtos de Folha'
    ];

    const menusOrdenados = [
      ...ordemDesejada
        .map(titulo => menus.find(menu => menu.itemTitulo === titulo))
        .filter(Boolean),
      ...menus.filter(menu => !ordemDesejada.includes(menu.itemTitulo))
    ];

    function toggleBarraLateral() {
        setBarraLateralOpened(!barraLateralOpened)
        
    }

    const fecharMenu = () => {
        setBarraLateralOpened(false)
    }

    // Fallback: se grupos não carregou ainda, renderiza só os menus alwaysVisible
    if (!grupos || grupos.length === 0) {
        return (
            <BarraLateralEstilizada $opened={$sidebarOpened}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    width: '100%',
                    overflow: 'hidden'
                }}>
                    <NavEstilizada>
                        <NavTitulo>{capitalizeTipo(usuario.tipo)}</NavTitulo>
                        {!temApenasUmPerfil && (
                            <Link to="/login/selecionar-grupo" style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>
                                <FaExchangeAlt size={18} style={{ marginLeft: 6, opacity: 0.7 }} />
                            </Link>
                        )}
                        <ListaEstilizada>
                            {alwaysVisible.map((item) => (
                                <StyledLink 
                                    key={item.id} 
                                    className="link p-ripple" 
                                    to={item.url}
                                    onClick={() => window.innerWidth <= 760 && setBarraLateralOpened(false)}>
                                    <ItemNavegacao ativo={item.url === "/" ? location.pathname === "/" : location.pathname.startsWith(item.url)}>
                                        {item.icone}
                                        {item.itemTitulo}
                                    </ItemNavegacao>
                                    <Ripple />
                                </StyledLink>
                            ))}
                        </ListaEstilizada>
                    </NavEstilizada>
                </div>
            </BarraLateralEstilizada>
        );
    }

    return (
        <>
            {/* <Overlay $opened={$sidebarOpened} onClick={fecharMenu} /> */}
            <BarraLateralEstilizada $opened={$sidebarOpened}>
                {image && <Logo src={BrandColors.getBrandLogo()} ref={ref} alt="Logo" />}
                
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    width: '100%',
                    overflow: 'hidden'
                }}>
                    <NavEstilizada>
                        <NavTitulo>
                            {usuario.tipo}
                            {!temApenasUmPerfil && (
                                <Link to="/login/selecionar-grupo" style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>
                                    <FaExchangeAlt fill="white" size={18} style={{ marginLeft: 6, opacity: 0.7 }} />
                                </Link>
                            )}
                        </NavTitulo>
                        <ListaEstilizada>
                            {menusOrdenados.map((item) => (
                                <StyledLink 
                                    key={item.id} 
                                    className="link p-ripple" 
                                    to={item.url}
                                    onClick={() => window.innerWidth <= 760 && setBarraLateralOpened(false)}>
                                    <ItemNavegacao ativo={item.url === "/" ? location.pathname === "/" : location.pathname.startsWith(item.url)}>
                                        {item.icone}
                                        {item.itemTitulo}
                                    </ItemNavegacao>
                                    <Ripple />
                                </StyledLink>
                            ))}
                        </ListaEstilizada>
                    </NavEstilizada>
                </div>
            </BarraLateralEstilizada>
            
            <div style={{
                display: 'flex', 
                backgroundColor: 'transparent', 
                height: '5vh', 
                position: 'absolute', 
                top: '2.5vh', 
                border: 'none', 
                borderRadius: '4px', 
                zIndex: '8'
            }}>
            </div>
        </>
    )
}

export default BarraLateral