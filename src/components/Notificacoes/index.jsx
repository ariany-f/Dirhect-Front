import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaBell, FaCheck, FaTimes, FaExclamationTriangle, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import { Tooltip } from 'primereact/tooltip';
import http from '@http';
import { useNotificationsWebSocket } from '@ws';
import mockNotificacoes from '@json/notifications.json';
import { SessaoUsuarioContext } from '@contexts/SessaoUsuario';

// Importar ícones do menu
import { AiFillHome } from "react-icons/ai";
import { HiMiniNewspaper, HiMiniShoppingBag } from "react-icons/hi2";
import { RiHandCoinFill, RiFilePaperFill, RiUser3Fill, RiTrophyFill, RiTeamFill, RiBankCardFill, RiFileListFill, RiLogoutCircleLine, RiBlenderFill } from "react-icons/ri";
import { BiBusSchool, BiCart, BiDrink, BiSolidDashboard } from "react-icons/bi";
import { LuSparkles } from "react-icons/lu";
import { FaBuilding, FaBusAlt, FaClock, FaInfo, FaKey, FaSync, FaUmbrellaBeach, FaUserTimes } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { BsHourglassSplit } from "react-icons/bs";
import { TbBeach, TbBusinessplan, TbTable, TbTableShare } from "react-icons/tb";
import { MdAllInbox, MdBusiness, MdHandshake, MdShoppingCart, MdShoppingCartCheckout } from "react-icons/md";
import { GoTasklist } from "react-icons/go";
import { IoBusiness } from "react-icons/io5";
import { PiHandshake } from "react-icons/pi";
import { FaExchangeAlt } from 'react-icons/fa';

// Container principal das notificações
const NotificacoesContainer = styled.div`
  position: relative;
  display: inline-block;
`;

// Botão do sininho
const BellButton = styled.button`
  position: relative;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  color: var(--black);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: var(--neutro-100);
  }
  
  svg {
    font-size: 18px;
  }
`;

// Badge de contador
const NotificationBadge = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  border: 2px solid white;
  min-width: 18px;
`;

// Painel de notificações
const NotificacoesPanel = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid var(--neutro-200);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 350px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transition: all 0.2s ease;
  
  @media screen and (max-width: 768px) {
    width: 300px;
    right: -50px;
  }
`;

// Cabeçalho do painel
const PanelHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid var(--neutro-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--neutro-50);
  border-radius: 8px 8px 0 0;
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--black);
`;

const MarkAllButton = styled.button`
  background: none;
  border: none;
  color: var(--primaria);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--neutro-100);
  }
`;

// Lista de notificações
const NotificacoesList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

// Item de notificação - diferenças mais visíveis
const NotificacaoItem = styled.div`
  padding: 16px;
  border-bottom: 1px solid var(--neutro-100);
  display: flex;
  align-items: flex-start;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ $isRead }) => 
    $isRead === true || $isRead === 'true' ? 
    'transparent' : 
    'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)'
  };
  position: relative;
  border-left: ${({ $isRead, $type }) => {
    const isRead = $isRead === true || $isRead === 'true';
    if (isRead) return 'none';
    
    switch ($type) {
      case 'success': return '4px solid #10b981';
      case 'warning': return '4px solid #f59e0b';
      case 'error': return '4px solid #ef4444';
      case 'info': return '4px solid #3b82f6';
      default: return '4px solid #6b7280';
    }
  }};
  
  &:hover {
    background-color: ${({ $isRead }) => 
      $isRead === true || $isRead === 'true' ? 
      'var(--neutro-50)' : 
      'var(--neutro-100)'
    };
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  // Indicador visual para não lidas
  ${({ $isRead }) => {
    const isRead = $isRead === true || $isRead === 'true';
    if (!isRead) {
      return `
        &::before {
          content: '';
          position: absolute;
          top: 20px;
          right: 16px;
          width: 8px;
          height: 8px;
          background: var(--primaria);
          border-radius: 50%;
          box-shadow: 0 0 0 2px white;
        }
      `;
    }
    return '';
  }}
`;

// Ícone da notificação - opacidade aumentada para lidas
const NotificacaoIcon = styled.div`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  background: ${({ $type, $isRead }) => {
    const isRead = $isRead === true || $isRead === 'true';
    
    if (isRead) {
      // Para lidas: cinza uniforme
      return '#6b7280';
    } else {
      // Para não lidas: cores vibrantes
      switch ($type) {
        case 'success': return '#10b981';
        case 'warning': return '#f59e0b';
        case 'error': return '#ef4444';
        case 'info': return '#3b82f6';
        default: return '#6b7280';
      }
    }
  }};
  opacity: ${({ $isRead }) => {
    const isRead = $isRead === true || $isRead === 'true';
    return isRead ? 0.8 : 1; // Aumentado de 0.5 para 0.7
  }};
  transition: all 0.2s ease;
`;

// Conteúdo da notificação
const NotificacaoContent = styled.div`
  flex: 1;
  min-width: 0;
`;

// Título da notificação - opacidade aumentada para lidas
const NotificacaoTitle = styled.div`
  font-size: 14px;
  font-weight: ${({ $isRead }) => {
    const isRead = $isRead === true || $isRead === 'true';
    return isRead ? '500' : '700';
  }};
  color: ${({ $isRead }) => {
    const isRead = $isRead === true || $isRead === 'true';
    return isRead ? 'var(--neutro-600)' : 'var(--black)';
  }};
  margin-bottom: 4px;
  line-height: 1.3;
  opacity: ${({ $isRead }) => {
    const isRead = $isRead === true || $isRead === 'true';
    return 1; // Aumentado de 0.7 para 0.8
  }};
`;

// Mensagem da notificação - opacidade aumentada para lidas
const NotificacaoMessage = styled.div`
  font-size: 13px;
  color: ${({ $isRead }) => {
    const isRead = $isRead === true || $isRead === 'true';
    return isRead ? 'var(--neutro-500)' : 'var(--neutro-600)';
  }};
  line-height: 1.4;
  margin-bottom: 4px;
  opacity: ${({ $isRead }) => {
    const isRead = $isRead === true || $isRead === 'true';
    return 1; // Aumentado de 0.6 para 0.75
  }};
`;

// Tempo da notificação - opacidade aumentada para lidas
const NotificacaoTime = styled.div`
  font-size: 11px;
  color: ${({ $isRead }) => {
    const isRead = $isRead === true || $isRead === 'true';
    return isRead ? 'var(--neutro-300)' : 'var(--neutro-500)';
  }};
  opacity: ${({ $isRead }) => {
    const isRead = $isRead === true || $isRead === 'true';
    return isRead ? 0.7 : 1; // Aumentado de 0.5 para 0.7
  }};
`;

// Botão de fechar notificação - mais discreto
const CloseButton = styled.button`
  flex-shrink: 0;
  background: none;
  border: none;
  color: var(--neutro-400);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
  opacity: 0.6;
  
  &:hover {
    color: var(--neutro-600);
    background-color: var(--neutro-100);
    opacity: 1;
  }
`;

// Estado vazio
const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: var(--neutro-500);
`;

const EmptyIcon = styled.div`
  font-size: 32px;
  margin-bottom: 12px;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  margin: 0;
  font-size: 14px;
`;

const Notificacoes = () => {
  const navigate = useNavigate();
  const { usuario } = useContext(SessaoUsuarioContext);
  const [isOpen, setIsOpen] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  
  // Usar o hook do WebSocket
  const { connection, connect, disconnect, on, off, getStatus } = useNotificationsWebSocket();
  const [wsStatus, setWsStatus] = useState(getStatus());

  // Função para formatar tempo relativo
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Agora mesmo';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min atrás`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} horas atrás`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} dias atrás`;
    return `${Math.floor(diffInSeconds / 2592000)} semanas atrás`;
  };

  // Função para processar notificação da API
  const processNotification = (notification) => {
    return {
      id: notification.id,
      type: notification.type || 'info',
      title: notification.title,
      message: notification.message,
      time: formatTimeAgo(notification.created_at),
      isRead: notification.isRead || notification.is_read || false, // Corrigido para aceitar ambos os formatos
      created_at: notification.created_at,
      data: notification.data || {},
      link: notification.link || null,
      user_type: notification.user_type
    };
  };

  // Função para navegar quando clicar na notificação
  const handleNotificationClick = (notif) => {
    // Marcar como lida primeiro
    markAsRead(notif.id);
    
    // Fechar o painel
    setIsOpen(false);
    
    // Navegar se tiver link
    if (notif.link) {
      navigate(notif.link);
    }
  };

  // Carregar notificações da API
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // COMENTADO: Endpoint ainda não existe
      // const response = await http.get('notificacoes/');
      
      // if (response && Array.isArray(response)) {
      //   const processedNotifications = response.map(processNotification);
      //   setNotificacoes(processedNotifications);
      // } else {
      //   // Fallback para dados mockados se API não retornar dados
      //   console.warn('API não retornou dados, usando fallback');
      //   setNotificacoes(mockNotificacoes);
      // }
      
      console.log('Usando dados mockados - endpoint notificacoes/ ainda não existe');
      
      // Filtrar notificações baseadas no tipo de usuário
      const userNotifications = mockNotificacoes.filter(notif => 
        notif.user_type === usuario?.tipo
      );
      setNotificacoes(userNotifications.map(processNotification));
      
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      setError('Erro ao carregar notificações');
      // Usar dados mockados em caso de erro
      const userNotifications = mockNotificacoes.filter(notif => 
        notif.user_type === usuario?.tipo
      );
      setNotificacoes(userNotifications.map(processNotification));
    } finally {
      setLoading(false);
    }
  }, [usuario?.tipo]);

  // Conectar WebSocket
  const connectWebSocket = useCallback(async () => {
    try {
      await connect();
      
      // Listeners do WebSocket
      on('open', () => {
        console.log('WebSocket de notificações conectado');
        setError(null);
        setWsStatus(getStatus());
      });

      on('notification', (data) => {
        const newNotification = processNotification(data.notification);
        
        setNotificacoes(prev => {
          // Evitar duplicatas
          const exists = prev.some(n => n.id === newNotification.id);
          if (exists) return prev;
          
          // Adicionar no início da lista
          return [newNotification, ...prev];
        });
      });

      on('error', (error) => {
        console.error('Erro no WebSocket de notificações:', error);
        setError('Erro de conexão');
        setWsStatus(getStatus());
      });

      on('close', () => {
        console.log('WebSocket de notificações desconectado');
        setWsStatus(getStatus());
      });

    } catch (error) {
      console.error('Erro ao conectar WebSocket:', error);
      setError('Erro ao conectar WebSocket');
    }
  }, [connect, on]);

  // Marcar notificação como lida na API
  const markAsReadAPI = async (id) => {
    try {
    //   await http.patch(`notificacoes/${id}/`, { is_read: true });
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  // Marcar todas como lidas na API
  const markAllAsReadAPI = async () => {
    try {
    //   await http.patch('notificacoes/mark-all-read/');
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  // Remover notificação da API
  const removeNotificationAPI = async (id) => {
    try {
    //   await http.delete(`notificacoes/${id}/`);
    } catch (error) {
      console.error('Erro ao remover notificação:', error);
    }
  };

  // Marcar notificação como lida
  const markAsRead = async (id) => {
    // Atualizar estado local imediatamente
    setNotificacoes(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
    
    // Enviar para API
    await markAsReadAPI(id);
  };

  // Marcar todas como lidas
  const markAllAsRead = async () => {
    // Atualizar estado local imediatamente
    setNotificacoes(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    
    // Enviar para API
    await markAllAsReadAPI();
  };

  // Remover notificação
  const removeNotification = async (id) => {
    // Atualizar estado local imediatamente
    setNotificacoes(prev => prev.filter(notif => notif.id !== id));
    
    // Enviar para API
    await removeNotificationAPI(id);
  };

  // Função para obter ícone baseado no tipo de notificação
  const getIconByNotificationType = (notif) => {
    // Verificar se é uma notificação de férias
    if (notif.title?.includes('Férias') || notif.data?.tipo === 'ferias') {
      return <FaUmbrellaBeach size={16} fill="white" />;
    }
    
    // Verificar se é uma notificação de admissão
    if (notif.title?.includes('Admissão') || notif.data?.tipo?.includes('admissao')) {
      return <RiUser3Fill fill="white" size={16} className="icon" />;
    }
    
    // Verificar se é uma notificação de demissão
    if (notif.title?.includes('Demissão') || notif.data?.tipo?.includes('demissao')) {
      return <FaUserTimes size={16} fill="white" className="icon" />;
    }
    
    // Verificar se é uma notificação de benefícios
    if (notif.title?.includes('Benefício') || notif.data?.tipo?.includes('beneficio')) {
      return <LuSparkles size={16} className="icon" stroke="white" />;
    }
    
    // Verificar se é uma notificação de vagas
    if (notif.title?.includes('Vaga') || notif.data?.tipo?.includes('vaga')) {
      return <RiFilePaperFill size={16} fill="white" className="icon" />;
    }
    
    // Verificar se é uma notificação de contratos
    if (notif.title?.includes('Contrato') || notif.data?.tipo?.includes('contrato')) {
      return <RiFileListFill fill="white" size={16} className="icon" />;
    }
    
    // Verificar se é uma notificação de pedidos
    if (notif.title?.includes('Pedido') || notif.data?.tipo?.includes('pedido')) {
      return <HiMiniShoppingBag size={16} fill="white" />;
    }
    
    // Verificar se é uma notificação de processos/tarefas
    if (notif.title?.includes('Processo') || notif.title?.includes('Tarefa') || notif.data?.tipo?.includes('processo')) {
      return <GoTasklist size={16} fill="white" />;
    }
    
    // Verificar se é uma notificação de colaboradores
    if (notif.title?.includes('Colaborador') || notif.data?.tipo?.includes('colaborador')) {
      return <BiSolidDashboard size={16} className="icon" />;
    }
    
    // Verificar se é uma notificação de dependentes
    if (notif.title?.includes('Dependente') || notif.data?.tipo?.includes('dependente')) {
      return <FaUserGroup size={16} className="icon" />;
    }
    
    // Verificar se é uma notificação de ausências
    if (notif.title?.includes('Ausência') || notif.data?.tipo?.includes('ausencia')) {
      return <BsHourglassSplit size={16} className="icon" />;
    }
    
    // Verificar se é uma notificação de operadoras
    if (notif.title?.includes('Operadora') || notif.data?.tipo?.includes('operadora')) {
      return <FaBuilding size={16} className="icon" />;
    }
    
    // Verificar se é uma notificação de relatórios
    if (notif.title?.includes('Relatório') || notif.data?.tipo?.includes('relatorio')) {
      return <HiMiniNewspaper size={16} fill="white" />;
    }
    
    // Verificar se é uma notificação de agendamentos
    if (notif.title?.includes('Agendamento') || notif.data?.tipo?.includes('agendamento')) {
      return <FaClock size={16} className="icon" />;
    }
    
    
    // Verificar se é uma notificação de Syync
    if (notif.title?.includes('Syync') || notif.data?.tipo?.includes('syync')) {
      return <FaSync size={16} className="icon" />;
    }
    
    // Fallback para ícones baseados no tipo de notificação (success, warning, error, info)
    switch (notif.type) {
      case 'success': return <FaCheckCircle fill="white" />;
      case 'warning': return <FaExclamationTriangle fill="white" />;
      case 'error': return <FaTimes fill="white" />;
      case 'info': return <FaInfoCircle fill="white" />;
      default: return <FaInfoCircle fill="white" />;
    }
  };

  // Fechar painel ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Carregar notificações e conectar WebSocket na montagem
  useEffect(() => {
    if (usuario?.tipo) {
      loadNotifications();
      connectWebSocket();
    }

    return () => {
      disconnect();
    };
  }, [loadNotifications, connectWebSocket, disconnect, usuario?.tipo]);

  // Contar notificações não lidas
  const unreadCount = notificacoes.filter(n => !n.isRead).length;

  // No componente Notificacoes, adicione o novo tipo de usuário
  const getNotificationsByUserType = (userType) => {
    switch (userType) {
      case 'RH':
        return mockNotificacoes.filter(notif => notif.user_type === 'RH');
      case 'Outsourcing':
        return mockNotificacoes.filter(notif => notif.user_type === 'Outsourcing');
      case 'Colaborador':
        return mockNotificacoes.filter(notif => notif.user_type === 'Colaborador');
      case 'Beneficios':
        return mockNotificacoes.filter(notif => notif.user_type === 'Beneficios');
      default:
        return [];
    }
  };

  return (
    <NotificacoesContainer ref={containerRef}>
      <Tooltip target=".bell-button" text="Notificações" />
      <BellButton 
        className="bell-button"
        onClick={() => setIsOpen(!isOpen)}
        data-pr-tooltip="Notificações"
      >
        <FaBell />
        {unreadCount > 0 && (
          <NotificationBadge>
            {unreadCount > 99 ? '99+' : unreadCount}
          </NotificationBadge>
        )}
      </BellButton>

      <NotificacoesPanel $isOpen={isOpen}>
        <PanelHeader>
          <PanelTitle>Notificações</PanelTitle>
          {unreadCount > 0 && (
            <MarkAllButton onClick={markAllAsRead}>
              Marcar todas como lidas
            </MarkAllButton>
          )}
        </PanelHeader>

        <NotificacoesList>
          {loading ? (
            <EmptyState>
              <EmptyIcon>
                <FaBell />
              </EmptyIcon>
              <EmptyText>Carregando notificações...</EmptyText>
            </EmptyState>
          ) : notificacoes.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <FaBell />
              </EmptyIcon>
              <EmptyText>Nenhuma notificação</EmptyText>
            </EmptyState>
          ) : (
            notificacoes.map((notif) => (
              <NotificacaoItem 
                key={notif.id} 
                $isRead={notif.isRead}
                $type={notif.type}
                onClick={() => handleNotificationClick(notif)}
                style={{ cursor: notif.link ? 'pointer' : 'default' }}
              >
                <NotificacaoIcon $type={notif.type} $isRead={notif.isRead}>
                  {getIconByNotificationType(notif)}
                </NotificacaoIcon>
                
                <NotificacaoContent>
                  <NotificacaoTitle $isRead={notif.isRead}>
                    {notif.title}
                  </NotificacaoTitle>
                  <NotificacaoMessage $isRead={notif.isRead}>
                    {notif.message}
                  </NotificacaoMessage>
                  <NotificacaoTime $isRead={notif.isRead}>
                    {notif.time}
                  </NotificacaoTime>
                </NotificacaoContent>

                <CloseButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(notif.id);
                  }}
                >
                  <FaTimes size={12} />
                </CloseButton>
              </NotificacaoItem>
            ))
          )}
        </NotificacoesList>
      </NotificacoesPanel>
    </NotificacoesContainer>
  );
};

export default Notificacoes;