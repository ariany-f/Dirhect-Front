import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FaBell, FaCheck, FaTimes, FaExclamationTriangle, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import { Tooltip } from 'primereact/tooltip';
import http from '@http';
import { useNotificationsWebSocket } from '@ws';

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

// Item de notificação
const NotificacaoItem = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid var(--neutro-100);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  background: ${({ $isRead }) => $isRead ? 'transparent' : 'var(--neutro-50)'};
  
  &:hover {
    background-color: var(--neutro-100);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

// Ícone da notificação
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
  background: ${({ $type }) => {
    switch ($type) {
      case 'success': return 'rgb(193, 212, 206)';
      case 'warning': return 'rgb(221, 210, 192)';
      case 'error': return 'rgb(214, 188, 188)';
      case 'info': return 'rgb(185, 200, 224)';
      default: return 'rgb(165, 168, 175)';
    }
  }};
`;

// Conteúdo da notificação
const NotificacaoContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificacaoTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 4px;
  line-height: 1.3;
`;

const NotificacaoMessage = styled.div`
  font-size: 13px;
  color: var(--neutro-600);
  line-height: 1.4;
  margin-bottom: 4px;
`;

const NotificacaoTime = styled.div`
  font-size: 11px;
  color: var(--neutro-500);
`;

// Botão de fechar notificação
const CloseButton = styled.button`
  flex-shrink: 0;
  background: none;
  border: none;
  color: var(--neutro-400);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
  
  &:hover {
    color: var(--neutro-600);
    background-color: var(--neutro-100);
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

// Dados mockados para fallback
const mockNotificacoes = [
  {
    id: 1,
    type: 'success',
    title: 'Férias Aprovadas',
    message: 'Suas férias de 15/01 a 30/01 foram aprovadas pelo gestor.',
    time: '2 horas atrás',
    isRead: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    data: { ferias_id: 123, gestor: 'João Silva' }
  },
  {
    id: 2,
    type: 'warning',
    title: 'Prazo de Solicitação',
    message: 'Você tem 5 dias para solicitar férias do período aquisitivo 2023.',
    time: '1 dia atrás',
    isRead: false,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    data: { dias_restantes: 5, periodo: '2023' }
  },
  {
    id: 3,
    type: 'info',
    title: 'Nova Funcionalidade',
    message: 'Agora você pode visualizar suas férias em formato de calendário.',
    time: '3 dias atrás',
    isRead: true,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    data: { feature: 'calendario_ferias' }
  },
  {
    id: 4,
    type: 'error',
    title: 'Erro no Sistema',
    message: 'Ocorreu um problema temporário. Tente novamente em alguns minutos.',
    time: '1 semana atrás',
    isRead: true,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    data: { error_code: 'SYSTEM_001' }
  }
];

const Notificacoes = () => {
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
      isRead: notification.is_read || false,
      created_at: notification.created_at,
      data: notification.data || {}
    };
  };

  // Carregar notificações da API
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
    //   const response = await http.get('notificacoes/');
      
    //   if (response && Array.isArray(response)) {
    //     const processedNotifications = response.map(processNotification);
    //     setNotificacoes(processedNotifications);
    //   } else {
    //     // Fallback para dados mockados se API não retornar dados
    //     console.warn('API não retornou dados, usando fallback');
    //     setNotificacoes(mockNotificacoes);
    //   }
    console.log('Usando dados mockados - endpoint notificacoes/ ainda não existe');
    setNotificacoes(mockNotificacoes);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      setError('Erro ao carregar notificações');
      // Usar dados mockados em caso de erro
      setNotificacoes(mockNotificacoes);
    } finally {
      setLoading(false);
    }
  }, []);

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

  // Obter ícone baseado no tipo
  const getIcon = (type) => {
    switch (type) {
      case 'success': return <FaCheckCircle fill="#10b981" />;
      case 'warning': return <FaExclamationTriangle fill="#f59e0b" />;
      case 'error': return <FaTimes fill="#ef4444" />;
      case 'info': return <FaInfoCircle fill="#3b82f6" />;
      default: return <FaInfoCircle fill="#6b7280" />;
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
    loadNotifications();
    connectWebSocket();

    return () => {
      disconnect();
    };
  }, [loadNotifications, connectWebSocket, disconnect]);

  // Contar notificações não lidas
  const unreadCount = notificacoes.filter(n => !n.isRead).length;

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
          <PanelTitle>
            Notificações
          </PanelTitle>
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
                onClick={() => markAsRead(notif.id)}
              >
                <NotificacaoIcon $type={notif.type}>
                  {getIcon(notif.type)}
                </NotificacaoIcon>
                
                <NotificacaoContent>
                  <NotificacaoTitle>{notif.title}</NotificacaoTitle>
                  <NotificacaoMessage>{notif.message}</NotificacaoMessage>
                  <NotificacaoTime>{notif.time}</NotificacaoTime>
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