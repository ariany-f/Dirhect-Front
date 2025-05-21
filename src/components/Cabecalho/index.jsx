import { styled } from "styled-components";
import { RiHandCoinFill, RiOrganizationChart } from "react-icons/ri";
import styles from './Cabecalho.module.css';
import Frame from "@components/Frame";
import Texto from "@components/Texto";
import { Link, useLocation } from "react-router-dom";
import { BsArrowLeftRight } from 'react-icons/bs';
import { MdOutlineKeyboardArrowDown, MdShoppingCart } from 'react-icons/md';
import Menu from "@components/Menu";
import { useState, useRef, useEffect } from "react";
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario";
import { FaBars, FaBuilding, FaBusAlt } from "react-icons/fa";
import { LuSparkles } from "react-icons/lu";
import LanguageSelector from "../LanguageSelector";
import { useTranslation } from 'react-i18next';
import CustomImage from '@components/CustomImage';


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
  gap: 8px;
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
  z-index: 7;
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
  gap: 36px;
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

  @media screen and (max-width: 768px) {
    min-width: unset;
    padding: 8px;
    font-size: 13px;
    flex: 1;
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
  }

  @media screen and (max-width: 768px) {
    & .user {
      width: 32px;
      height: 32px;
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
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
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
    { "id": 1, "url": "", "pageTitulo": "Dirhect" },
    { "id": 2, "url": "extrato", "pageTitulo": "Extrato da conta" },
    { "id": 3, "url": "colaborador", "pageTitulo": "Colaboradores" },
    { "id": 4, "url": "estrutura", "pageTitulo": "Estrutura Organizacional" },
    { "id": 5, "url": "elegibilidade", "pageTitulo": "Elegibilidade" },
    { "id": 6, "url": "beneficio", "pageTitulo": "Benefícios" },
    { "id": 7, "url": "linhas-transporte", "pageTitulo": "Linhas de Transporte" },
    { "id": 8, "url": "despesa", "pageTitulo": "Despesas" },
    { "id": 9, "url": "operador", "pageTitulo": "Operadores" },
    { "id": 10, "url": "usuario", "pageTitulo": t('me') },
    { "id": 11, "url": "dependentes", "pageTitulo": "Dependentes" },
    { "id": 12, "url": "contratos", "pageTitulo": "Contratos" },
    { "id": 13, "url": "ferias", "pageTitulo": "Férias" },
    { "id": 14, "url": "ausencias", "pageTitulo": "Ausências" },
    { "id": 15, "url": "demissoes", "pageTitulo": "Demissões" },
    { "id": 16, "url": "admissao", "pageTitulo": "Admissões" },
    { "id": 17, "url": "ciclos", "pageTitulo": "Lançamentos de Folha" },
    { "id": 18, "url": "pedidos", "pageTitulo": "Pedidos" },
    { "id": 19, "url": "movimentos", "pageTitulo": "Movimentação" },
    { "id": 20, "url": "tarefas", "pageTitulo": "Tarefas" },
    { "id": 21, "url": "marketplace", "pageTitulo": "Marketplace" },
    { "id": 22, "url": "operadoras", "pageTitulo": "Operadoras" }
  ];

  const titulo = titulos.find(item => 
    item.url === location.pathname.split("/")[1]
  )?.pageTitulo || "Dirhect";

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
          label: 'Estrutura Organizacional', 
          url: '/estrutura',
          icon: <RiOrganizationChart size={18}/>
        },
        { 
          label: 'Linhas de Transporte', 
          url: '/linhas-transporte',
          icon: <FaBusAlt size={16} />
        }
      ]
    }
  ];

  return (
    <HeaderEstilizado>
      <HeaderTop>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <FaBars style={{ cursor: 'pointer' }} size={24} onClick={() => setSidebarOpened(!sidebarOpened)} />
          {isDesktop ? <h6>{titulo}</h6> : <>&nbsp;</>}
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
                      {menuItems.map((column, index) => (
                        <MenuColumn key={index}>
                          {column.items.map((item, itemIndex) => (
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
            {usuario.tipo !== "candidato" && usuario.tipo !== "funcionario" && (
              <ItemEmpresa onClick={aoClicar}>
                {simbolo && simbolo !== null && simbolo !== 'null' ? 
                  <>
                    <CustomImage src={simbolo} title={nomeEmpresa} width={20} height={20} borderRadius={6} />
                    {nomeEmpresa}
                  </>
                : logo && logo !== null && logo !== 'null' ? 
                  <>
                    <CustomImage src={logo} title={nomeEmpresa} width={65} height={20} borderRadius={6} />
                  </>
                : nomeEmpresa}
                <BsArrowLeftRight />
              </ItemEmpresa>
            )}
            <LanguageSelector />
            <ItemUsuario onClick={toggleMenu}>
              <div className="user">{usuario.name?.charAt(0) || 'U'}</div>
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