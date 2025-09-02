import { styled } from "styled-components";
import { RiHandCoinFill, RiOrganizationChart, RiTable2 } from "react-icons/ri";
import styles from './Cabecalho.module.css';
import Frame from "@components/Frame";
import Texto from "@components/Texto";
import { Link, useLocation } from "react-router-dom";
import { BsArrowLeftRight } from 'react-icons/bs';
import { MdOutlineKeyboardArrowDown, MdShoppingCart } from 'react-icons/md';
import Menu from "@components/Menu";
import { useState, useRef, useEffect } from "react";
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario";
import { FaBuilding, FaBusAlt, FaDatabase } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";
import { TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";
import { LuSparkles } from "react-icons/lu";
import LanguageSelector from "../LanguageSelector";
import { useTranslation } from 'react-i18next';
import CustomImage from '@components/CustomImage';
import { ArmazenadorToken } from '@utils';
import BrandColors from '@utils/brandColors';
import { FaUser } from 'react-icons/fa';

// MegaMenu Container
const MegaMenuWrapper = styled.div`
  position: relative;
  display: inline-block;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

// Menu Trigger Button
const MenuTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: transparent;
  font-family: var(--fonte-secundaria);
  font-weight: 600;
  font-size: 14px;
  color: var(--black);
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--neutro-100);
  }

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

// MegaMenu Panel
const MegaMenuPanel = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid var(--neutro-200);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transition: all 0.2s ease;
  z-index: 1000;
  width: auto;  /* Largura automática */
  min-width: max-content; /* Garante que o menu não fique menor que o conteúdo */
`;

// Menu Grid
const MenuGrid = styled.div`
  display: flex;
  gap: 24px;
`;

// Menu Column
const MenuColumn = styled.div`
  flex: 1;
  min-width: ${({ $minWidth }) => $minWidth || '250px'};
`;

// Update the MenuItem styled component to include icons
const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  color: var(--black);
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
  font-size: 14px;
  background-color: ${({ $isActive }) => $isActive ? 'var(--neutro-100)' : 'transparent'};
  pointer-events: ${({ $isActive }) => $isActive ? 'none' : 'auto'};
  cursor: ${({ $isActive }) => $isActive ? 'default' : 'pointer'};
  
  &:hover {
    background-color: var(--neutro-100);
  }
`;

const ChevronIcon = styled(MdOutlineKeyboardArrowDown)`
  transition: transform 0.2s ease;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

// Rest of your styled components remain the same...
const HeaderEstilizado = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  height: fit-content;
  padding: 2vh 4vw 2vh 4vw;
  width: inherit;
  z-index: 8;
  background-color: var(--white);
  box-shadow: 0px 1px 5px 0px lightgrey;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;

  @-moz-document url-prefix() {
    width: -moz-available;
  }

  @media screen and (max-width: 768px) {
    padding: 12px 16px;
    flex-direction: column;
    gap: 8px;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const HeaderBottom = styled.div`
  display: none;
  width: 100%;

  @media screen and (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }
`;

const RightItems = styled.nav`
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;

  @media screen and (max-width: 1024px) {
    gap: 24px;
  }

  @media screen and (max-width: 768px) {
    gap: 12px;
  }
`;

const ItemEmpresa = styled.button`
  font-family: var(--fonte-secundaria);
  background-color: var(--white);
  color: var(--black);
  padding: 11px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  border: 1px solid var(--neutro-200);
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  cursor: pointer;
  text-align: center;
  min-width: 150px;
  justify-content: center;

  &:disabled {
    cursor: default;
    opacity: 0.7;
    background-color: var(--neutro-50);
  }

  @media screen and (max-width: 768px) {
    min-width: unset;
    padding: 8px;
    font-size: 13px;
    flex: 1;
  }
`;

// ItemEmpresa mais fino para o perfil selecionado
const ItemPerfil = styled(ItemEmpresa)`
  min-width: 100px;
  padding: 8px 12px;
  gap: 6px;
  
  @media screen and (max-width: 768px) {
    min-width: unset;
    padding: 6px 8px;
    font-size: 12px;
  }
`;

const TituloResponsivo = styled.h6`
  margin: 0;
  font-size: ${({ $tituloLength }) => {
    if ($tituloLength > 35) return '14px';
    if ($tituloLength > 25) return '16px';
    if ($tituloLength > 20) return '18px';
    return '20px';
  }};
  font-weight: 600;
  color: var(--black);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
  line-height: 1.2;

  @media screen and (max-width: 1200px) {
    max-width: 300px;
    font-size: ${({ $tituloLength }) => {
      if ($tituloLength > 30) return '12px';
      if ($tituloLength > 20) return '14px';
      if ($tituloLength > 15) return '16px';
      return '18px';
    }};
  }

  @media screen and (max-width: 992px) {
    max-width: 250px;
    font-size: ${({ $tituloLength }) => {
      if ($tituloLength > 25) return '11px';
      if ($tituloLength > 18) return '12px';
      if ($tituloLength > 12) return '14px';
      return '16px';
    }};
  }

  @media screen and (max-width: 768px) {
    max-width: 200px;
    font-size: ${({ $tituloLength }) => {
      if ($tituloLength > 20) return '10px';
      if ($tituloLength > 15) return '12px';
      return '14px';
    }};
  }
`;

const ItemUsuario = styled.div`
  font-family: var(--fonte-secundaria);
  color: var(--black);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  cursor: pointer;
  
  & .user {
    background-color: var(--neutro-100);
    border-radius: 20px;
    justify-content: center;
    align-items: center;
    display: flex;
    width: 40px;
    height: 40px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 20px;
    }
  }

  @media screen and (max-width: 768px) {
    & .user {
      width: 32px;
      height: 32px;
      border-radius: 16px;
      
      img {
        border-radius: 16px;
      }
    }
  }
`;

const MarketplaceButton = styled(Frame)`
    @media screen and (max-width: 768px) {
        display: none;
    }
`;

const Cabecalho = ({ menuOpened, setMenuOpened, nomeEmpresa, aoClicar = null, simbolo, logo, sidebarOpened, setSidebarOpened }) => {
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);
  const { usuario } = useSessaoUsuarioContext();
  const menuRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);
  const { t } = useTranslation('common');

  // Verificar se o usuário tem apenas um perfil
  const gruposValidos = ArmazenadorToken.UserGroups ? 
    ArmazenadorToken.UserGroups.filter(grupo => !grupo.startsWith('_')) : [];
  const temApenasUmPerfil = gruposValidos.length <= 1;


  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAberto(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const titulos = [
    { "id": 1, "url": "", "pageTitulo": t('home') },
    { "id": 2, "url": "extrato", "pageTitulo": "Extrato da conta" },
    { "id": 3, "url": "colaborador", "pageTitulo": t("colaborators") },
    { "id": 4, "url": "estrutura", "pageTitulo": t("organizational_structure") },
    { "id": 5, "url": "elegibilidade", "pageTitulo": t("benefits_eligibility") },
    { "id": 6, "url": "beneficio", "pageTitulo": t("benefits") },
    { "id": 7, "url": "linhas-transporte", "pageTitulo": "Linhas de Transporte" },
    { "id": 8, "url": "despesa", "pageTitulo": "Despesas" },
    { "id": 9, "url": "operador", "pageTitulo": "Operadores" },
    { "id": 10, "url": "usuario", "pageTitulo": t('settings') },
    { "id": 11, "url": "dependentes", "pageTitulo": t("dependents") },
    { "id": 12, "url": "contratos", "pageTitulo": t("contracts") },
    { "id": 13, "url": "ferias", "pageTitulo": t("vacations") },
    { "id": 14, "url": "ausencias", "pageTitulo": t("absences") },
    { "id": 15, "url": "demissoes", "pageTitulo": t("terminations") },
    { "id": 16, "url": "admissao", "pageTitulo": t("hirings") },
    { "id": 17, "url": "ciclos", "pageTitulo": "Lançamentos de Folha" },
    { "id": 18, "url": "pedidos", "pageTitulo": t("orders") },
    { "id": 19, "url": "movimentos", "pageTitulo": "Movimentação" },
    { "id": 20, "url": "tarefas", "pageTitulo": t("processes") },
    { "id": 21, "url": "marketplace", "pageTitulo": "Marketplace" },
    { "id": 22, "url": "operadoras", "pageTitulo": "Operadoras" },
    { "id": 23, "url": "tipos-beneficio", "pageTitulo": "Tipos de Benefício" },
    { "id": 24, "url": "vagas", "pageTitulo": t("positions") },
    { "id": 25, "url": "atividades", "pageTitulo": t("activities") },
    { "id": 26, "url": "tabelas-de-sistema", "pageTitulo": "Tabelas de Sistema" }
  ];

  const titulo = titulos.find(item => 
    item.url === location.pathname.split("/")[1]
  )?.pageTitulo || BrandColors.getBrandName();

  function toggleMenu() {
    setMenuOpened(!menuOpened);
  }

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
        }
      ]
    },
    {
      title: "Organização",
      items: [
        { 
          label: t("organizational_structure"), 
          url: '/estrutura',
          icon: <RiOrganizationChart size={18}/>
        },
        { 
          label: 'Tabelas de Sistema', 
          url: '/tabelas-de-sistema',
          icon: <RiTable2 size={18}/>
        },
        ...(import.meta.env.VITE_OPTIONS_LINHAS_TRANSPORTE === 'true' ? [
          { 
            label: 'Linhas de Transporte', 
            url: '/linhas-transporte',
            icon: <FaBusAlt size={16} />
          }
        ] : [])
      ]
    }
  ];

  return (
    <HeaderEstilizado>
      <HeaderTop>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {isDesktop ? ( 
            <TbLayoutSidebarLeftCollapseFilled  style={{ cursor: 'pointer' }} size={24} onClick={() => setSidebarOpened(!sidebarOpened)} />
          ) : (
            <FaBars style={{ cursor: 'pointer' }} size={24} onClick={() => setSidebarOpened(!sidebarOpened)} />
          )}
          {isDesktop ? (
            <TituloResponsivo $tituloLength={titulo?.length || 0}>
              {titulo}
            </TituloResponsivo>
          ) : <>&nbsp;</>}
        </div>
        <RightItems>
            {isDesktop && (
              <div className={styles.divisor}>
                <MegaMenuWrapper 
                  ref={menuRef}
                  onMouseEnter={() => setMenuAberto(true)}
                  onMouseLeave={() => setMenuAberto(false)}
                >
                  <MenuTrigger onClick={() => setMenuAberto(!menuAberto)}>
                    <Texto weight="600" size={'14px'} color="black">
                      {t('options')}
                    </Texto>
                    <ChevronIcon $isOpen={menuAberto} size={16} />
                  </MenuTrigger>
                  
                  <MegaMenuPanel $isOpen={menuAberto}>
                    <MenuGrid>
                      {menuItems
                        .filter(section => {
                          // Filtrar seção de Benefícios apenas se tiver permissão
                          if (section.title === "Benefícios") {
                            return ArmazenadorToken.hasPermission('view_contrato');
                          }
                          return true; // Mostrar outras seções normalmente
                        })
                        .map((column, index) => (
                        <MenuColumn key={index}>
                          {column.items
                            .filter(item => {
                              // Filtrar itens da seção Benefícios baseado na permissão
                              if (column.title === "Benefícios") {
                                return ArmazenadorToken.hasPermission('view_contrato');
                              }
                              return true; // Mostrar outros itens normalmente
                            })
                            .map((item, itemIndex) => (
                            <MenuItem 
                              key={itemIndex} 
                              to={item.url}
                              onClick={() => setMenuAberto(false)}
                              $isActive={item.url === "/" ? location.pathname === "/" : location.pathname.startsWith(item.url)}
                            >
                              {item.icon}
                              <Texto weight="500" size={'14px'} color="black">
                                {item.label}
                              </Texto>
                            </MenuItem>
                          ))}
                        </MenuColumn>
                      ))}
                    </MenuGrid>
                  </MegaMenuPanel>
                </MegaMenuWrapper>
              </div>
            )}
          
          <div className={styles.divisor}>
            {ArmazenadorToken.hasPermission('view_clienttenant') && (
              <ItemEmpresa onClick={aoClicar}>
                {simbolo && simbolo !== null && simbolo !== 'null' ? 
                  <>
                    <CustomImage src={simbolo} title={nomeEmpresa} width={20} height={20} borderRadius={6} />
                    <span
                      style={{
                        fontSize: window.innerWidth <= 1024 ? '12px' : '14px',
                        maxWidth: window.innerWidth <= 1024 ? '80px' : '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        marginLeft: 4
                      }}
                    >
                      {nomeEmpresa}
                    </span>
                  </>
                : logo && logo !== null && logo !== 'null' ? 
                  <>
                    <CustomImage src={logo} title={nomeEmpresa} width={65} height={20} borderRadius={6} />
                  </>
                : <span
                    style={{
                      fontSize: window.innerWidth <= 1024 ? '12px' : '14px',
                      maxWidth: window.innerWidth <= 1024 ? '80px' : '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'inline-block',
                      verticalAlign: 'middle',
                    }}
                  >
                    {nomeEmpresa}
                  </span>}
                <BsArrowLeftRight />
              </ItemEmpresa>
            )}
            <ItemPerfil 
              onClick={temApenasUmPerfil ? undefined : () => window.location.href = '/login/selecionar-grupo'}
              disabled={temApenasUmPerfil}
              style={{
                minWidth: 'unset',
                padding: isDesktop ? undefined : '8px',
                fontSize: isDesktop ? undefined : '13px',
                display: 'flex',
                alignItems: 'center',
                gap: isDesktop ? '6px' : '0',
                justifyContent: 'center',
              }}
            >
              <FaUser size={16} />
              {isDesktop && (usuario.tipo || 'Perfil')}
              {!temApenasUmPerfil && <BsArrowLeftRight />}
            </ItemPerfil>
            <LanguageSelector />
            <ItemUsuario onClick={toggleMenu}>
              <div className="user">
                {usuario?.foto_perfil && usuario?.foto_perfil !== "" ? (
                  <img 
                    src={usuario.foto_perfil.includes(import.meta.env.VITE_API_BASE_DOMAIN) ? usuario.foto_perfil : `https://dirhect.${import.meta.env.VITE_API_BASE_DOMAIN}/${usuario.foto_perfil}`}
                    alt={`Foto de ${usuario?.name || 'Usuário'}`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div style={{ 
                  display: usuario?.foto_perfil && usuario?.foto_perfil !== "" ? 'none' : 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%'
                }}>
                  {(usuario && usuario?.name && usuario?.name !== null && usuario?.name !== undefined && usuario?.name !== '' && usuario?.name.trim() !== '') ? usuario?.name?.charAt(0) : 'U'}
                </div>
              </div>
              <MdOutlineKeyboardArrowDown />
            </ItemUsuario>
          </div>
        </RightItems>
      </HeaderTop>
      
      <Menu opened={menuOpened} aoFechar={toggleMenu} />
    </HeaderEstilizado>
  );
};

export default Cabecalho;