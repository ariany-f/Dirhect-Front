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
import { FaBuilding, FaBusAlt } from "react-icons/fa";
import { LuSparkles } from "react-icons/lu";

// MegaMenu Container
const MegaMenuWrapper = styled.div`
  position: relative;
  display: inline-block;
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
  padding: 16px;
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
  min-width: ${({ $minWidth }) => $minWidth || '180px'};
`;

// Menu Item

// Update the MenuItem styled component to include icons
const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  color: var(--black);
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
  font-size: 14px;
  
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
  height: fit-content;
  top: 0;
  padding: 0 6vw;
  flex-wrap: wrap;
`;

const RightItems = styled.nav`
  display: flex;
  align-items: center;
  gap: 48px;
  flex-wrap: wrap;
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
`;

const Cabecalho = ({ menuOpened, setMenuOpened, nomeEmpresa, aoClicar = null }) => {
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);
  const { usuario } = useSessaoUsuarioContext();
  const menuRef = useRef(null);

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
    { "id": 10, "url": "usuario", "pageTitulo": "Meus dados" },
    { "id": 11, "url": "dependentes", "pageTitulo": "Dependentes" },
    { "id": 12, "url": "contratos", "pageTitulo": "Contratos" },
    { "id": 13, "url": "ferias", "pageTitulo": "Férias" },
    { "id": 14, "url": "ausencias", "pageTitulo": "Ausências" },
    { "id": 15, "url": "demissoes", "pageTitulo": "Demissões" },
    { "id": 16, "url": "admissao", "pageTitulo": "Admissões" },
    { "id": 17, "url": "ciclos", "pageTitulo": "Lançamentos de Folha" },
    { "id": 18, "url": "pedidos", "pageTitulo": "Pedidos" },
    { "id": 19, "url": "movimentos", "pageTitulo": "Movimentos" },
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
          icon: <RiHandCoinFill size={16}/>
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

  return (
    <HeaderEstilizado>
      <h6>{titulo}</h6>
      <RightItems>
        <div className={styles.divisor}>
          <MegaMenuWrapper 
            ref={menuRef}
            onMouseEnter={() => setMenuAberto(true)}
            onMouseLeave={() => setMenuAberto(false)}
          >
            <MenuTrigger
              onClick={() => setMenuAberto(!menuAberto)}
            >
              <Texto weight="600" size={'14px'} color="black">
                Opções
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
          
          {/* Rest of your header items... */}
          {usuario.tipo !== "candidato" && usuario.tipo !== "funcionario" && (
            <Frame alinhamento="center">
              <Link 
                to="/estrutura"
                className={styles.link} 
                style={{
                  border: '1px solid var(--neutro-200)',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  padding: '8px',
                  boxSizing: 'initial'
                }}
              >
                <Texto weight="600" size={'14px'} color="black">
                  <RiOrganizationChart size={18} />
                  &nbsp;Estrutura Organizacional
                </Texto>
              </Link>
            </Frame>
          )}
          
          {usuario.tipo !== "candidato" && (
            <Frame alinhamento="center">
              <Link 
                to="/marketplace"
                className={styles.link}
                style={{
                  border: '1px solid var(--neutro-200)',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  padding: '8px',
                  boxSizing: 'initial'
                }}
              >
                <Texto weight="600" size={'14px'} color="black">
                  <MdShoppingCart size={18} />
                  &nbsp;Marketplace
                </Texto>
              </Link>
            </Frame>
          )}
        </div>
        
        <div className={styles.divisor}>
          {usuario.tipo !== "candidato" && usuario.tipo !== "funcionario" && (
            <ItemEmpresa onClick={aoClicar}>
              {nomeEmpresa}
              <BsArrowLeftRight />
            </ItemEmpresa>
          )}
          
          <ItemUsuario onClick={toggleMenu}>
            <div className="user">{usuario.name?.charAt(0) || 'U'}</div>
            <MdOutlineKeyboardArrowDown />
          </ItemUsuario>
        </div>
      </RightItems>
      
      <Menu opened={menuOpened} aoFechar={toggleMenu} />
    </HeaderEstilizado>
  );
};

export default Cabecalho;