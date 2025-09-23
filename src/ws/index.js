import { ArmazenadorToken } from "@utils";
import * as Sentry from "@sentry/react";

const API_BASE_DOMAIN = import.meta.env.VITE_API_BASE_DOMAIN || "dirhect.net";
const PROTOCOL = import.meta.env.MODE === 'development' ? 'ws' : 'wss';

// 🚫 CHAVE PARA DESABILITAR WEBSOCKET TEMPORARIAMENTE
const WEBSOCKET_ENABLED = import.meta.env.VITE_WEBSOCKET_ENABLED === 'true';

// Contador de erros de conexão para reconexão
let connectionErrorCount = 0;
const MAX_CONNECTION_ERRORS = 5;

// Flag para controlar reconexão em andamento
let reconnectInProgress = false;

// Mapa de conexões WebSocket ativas
const activeConnections = new Map();

// Classe principal do WebSocket
class WebSocketService {
  constructor(url, options = {}) {
    this.url = url;
    this.options = {
      autoReconnect: true,
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      ...options
    };
    
    this.ws = null;
    this.reconnectAttempts = 0;
    this.heartbeatTimer = null;
    this.reconnectTimer = null;
    this.listeners = new Map();
    this.isConnecting = false;
    this.isConnected = false;
    
    // Bind methods
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.send = this.send.bind(this);
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
  }

  // Conectar WebSocket
  connect() {
    if (!WEBSOCKET_ENABLED) {
      return Promise.resolve();
    }

    if (this.isConnecting || this.isConnected) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        this.isConnecting = true;
        
        // Construir URL completa
        const companyDomain = localStorage.getItem("company_domain") || 'dirhect';
        const fullUrl = `${PROTOCOL}://${companyDomain}.${API_BASE_DOMAIN}${this.url}`;
        
        console.log('Conectando WebSocket:', fullUrl);
        
        this.ws = new WebSocket(fullUrl);
        
        // Timeout de conexão
        const connectionTimeout = setTimeout(() => {
          if (this.ws.readyState === WebSocket.CONNECTING) {
            this.ws.close();
            reject(new Error('Timeout de conexão WebSocket'));
          }
        }, 10000);

        this.ws.onopen = (event) => {
          clearTimeout(connectionTimeout);
          this.isConnecting = false;
          this.isConnected = true;
          this.reconnectAttempts = 0;
          connectionErrorCount = 0;
          
          console.log('WebSocket conectado com sucesso');
          
          // Iniciar heartbeat
          this.startHeartbeat();
          
          // Emitir evento de conexão
          this.emit('open', event);
          
          resolve(event);
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            // Se for heartbeat, não processar
            if (data.type === 'heartbeat') {
              return;
            }
            
            // Emitir evento de mensagem
            this.emit('message', data);
            
            // Emitir evento específico por tipo
            if (data.type) {
              this.emit(data.type, data);
            }
          } catch (error) {
            console.error('Erro ao processar mensagem WebSocket:', error);
            this.emit('error', { type: 'parse_error', error, rawData: event.data });
          }
        };

        this.ws.onclose = (event) => {
          clearTimeout(connectionTimeout);
          this.isConnecting = false;
          this.isConnected = false;
          this.stopHeartbeat();
          
          console.log('WebSocket desconectado:', event.code, event.reason);
          
          // Emitir evento de desconexão
          this.emit('close', event);
          
          // Tentar reconectar se habilitado
          if (this.options.autoReconnect && !event.wasClean) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          clearTimeout(connectionTimeout);
          this.isConnecting = false;
          connectionErrorCount++;
          
          console.error('Erro no WebSocket:', error);
          
          // Capturar erro no Sentry apenas se habilitado
          if (import.meta.env.VITE_ENABLE_SENTRY === 'true') {
            Sentry.captureException(error, {
              tags: {
                section: 'websocket',
                action: 'connection_error',
                severity: connectionErrorCount >= MAX_CONNECTION_ERRORS ? 'fatal' : 'warning'
              },
              extra: {
                connectionErrorCount,
                maxConnectionErrors: MAX_CONNECTION_ERRORS,
                url: fullUrl,
                reconnectAttempts: this.reconnectAttempts
              }
            });
          }
          
          // Emitir evento de erro
          this.emit('error', { type: 'connection_error', error });
          
          reject(error);
        };

      } catch (error) {
        this.isConnecting = false;
        console.error('Erro ao criar WebSocket:', error);
        reject(error);
      }
    });
  }

  // Desconectar WebSocket
  disconnect() {
    if (!WEBSOCKET_ENABLED) {
      return;
    }

    this.options.autoReconnect = false;
    this.stopHeartbeat();
    this.clearReconnectTimer();
    
    if (this.ws) {
      this.ws.close(1000, 'Desconexão manual');
      this.ws = null;
    }
    
    this.isConnected = false;
    this.isConnecting = false;
  }

  // Enviar mensagem
  send(data) {
    if (!WEBSOCKET_ENABLED) {
      return false;
    }

    if (!this.isConnected || !this.ws) {
      return false;
    }

    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      this.ws.send(message);
      return true;
    } catch (error) {
      console.error('Erro ao enviar mensagem WebSocket:', error);
      this.emit('error', { type: 'send_error', error });
      return false;
    }
  }

  // Adicionar listener
  on(event, callback) {
    if (!WEBSOCKET_ENABLED) {
      return;
    }

    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // Remover listener
  off(event, callback) {
    if (!WEBSOCKET_ENABLED) {
      return;
    }

    if (!this.listeners.has(event)) return;
    
    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  // Emitir evento
  emit(event, data) {
    if (!WEBSOCKET_ENABLED) {
      return;
    }

    if (!this.listeners.has(event)) return;
    
    const callbacks = this.listeners.get(event);
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Erro no callback WebSocket:', error);
      }
    });
  }

  // Agendar reconexão
  scheduleReconnect() {
    if (!WEBSOCKET_ENABLED) {
      return;
    }

    if (reconnectInProgress || this.reconnectAttempts >= this.options.maxReconnectAttempts) {
      this.emit('error', { type: 'max_reconnect_attempts' });
      return;
    }

    reconnectInProgress = true;
    this.reconnectAttempts++;
    
    const delay = this.options.reconnectInterval * Math.pow(2, Math.min(this.reconnectAttempts - 1, 5));
    
    console.log(`Tentando reconectar em ${delay}ms (tentativa ${this.reconnectAttempts})`);
    
    this.reconnectTimer = setTimeout(() => {
      reconnectInProgress = false;
      this.connect().catch(error => {
        console.error('Erro na reconexão:', error);
      });
    }, delay);
  }

  // Limpar timer de reconexão
  clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  // Iniciar heartbeat
  startHeartbeat() {
    if (!WEBSOCKET_ENABLED) return;

    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected) {
        this.send({ type: 'heartbeat', timestamp: Date.now() });
      }
    }, this.options.heartbeatInterval);
  }

  // Parar heartbeat
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // Obter status da conexão
  getStatus() {
    return {
      isConnected: WEBSOCKET_ENABLED ? this.isConnected : false,
      isConnecting: WEBSOCKET_ENABLED ? this.isConnecting : false,
      reconnectAttempts: this.reconnectAttempts,
      readyState: this.ws ? this.ws.readyState : null,
      websocketEnabled: WEBSOCKET_ENABLED
    };
  }
}

// Função para criar conexão WebSocket
export const createWebSocketConnection = (url, options = {}) => {
  if (!WEBSOCKET_ENABLED) {
    return null;
  }

  const connection = new WebSocketService(url, options);
  activeConnections.set(url, connection);
  return connection;
};

// Função para obter conexão existente
export const getWebSocketConnection = (url) => {
  return activeConnections.get(url);
};

// Função para fechar todas as conexões
export const closeAllConnections = () => {
  if (!WEBSOCKET_ENABLED) {
    return;
  }

  activeConnections.forEach(connection => {
    connection.disconnect();
  });
  activeConnections.clear();
};

// Função para obter status de todas as conexões
export const getAllConnectionsStatus = () => {
  if (!WEBSOCKET_ENABLED) {
    return {};
  }

  const status = {};
  activeConnections.forEach((connection, url) => {
    status[url] = connection.getStatus();
  });
  return status;
};

// Função para resetar contador de erros
export const resetConnectionErrorCount = () => {
  if (!WEBSOCKET_ENABLED) {
    return;
  }

  connectionErrorCount = 0;
  console.log('Contador de erros WebSocket resetado');
};

// Função para obter status do contador de erros
export const getConnectionErrorStatus = () => {
  if (!WEBSOCKET_ENABLED) {
    return { current: 0, max: 0, remaining: 0 };
  }

  return {
    current: connectionErrorCount,
    max: MAX_CONNECTION_ERRORS,
    remaining: MAX_CONNECTION_ERRORS - connectionErrorCount
  };
};

// Hook para notificações (específico para o componente)
export const useNotificationsWebSocket = () => {
  if (!WEBSOCKET_ENABLED) {
    return {
      connection: null,
      connect: () => Promise.resolve(),
      disconnect: () => {},
      send: () => false,
      on: () => {},
      off: () => {},
      getStatus: () => ({ isConnected: false, isConnecting: false, websocketEnabled: false })
    };
  }

  const connection = createWebSocketConnection('/ws/notificacoes/', {
    autoReconnect: true,
    reconnectInterval: 5000,
    maxReconnectAttempts: 10
  });

  return {
    connection,
    connect: () => connection.connect(),
    disconnect: () => connection.disconnect(),
    send: (data) => connection.send(data),
    on: (event, callback) => connection.on(event, callback),
    off: (event, callback) => connection.off(event, callback),
    getStatus: () => connection.getStatus()
  };
};

// Exportar classe principal
export default WebSocketService;