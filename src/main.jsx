import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from './routes.jsx'
import 'primeicons/primeicons.css';
import * as Sentry from "@sentry/react";


const app = (
  <Sentry.ErrorBoundary 
    fallback={({ error, resetError }) => (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <h2>Oops! Algo deu errado</h2>
        <p>Ocorreu um erro inesperado. Nossa equipe foi notificada.</p>
        <details style={{ marginTop: '20px' }}>
          <summary>Detalhes técnicos</summary>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '4px',
            textAlign: 'left',
            fontSize: '12px',
            overflow: 'auto'
          }}>
            {error?.message}
          </pre>
        </details>
        <button 
          onClick={resetError}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Tentar novamente
        </button>
      </div>
    )}
    beforeCapture={(scope, error, errorInfo) => {
      // Adicionar contexto extra quando capturar erro
      scope.setTag('errorBoundary', true);
      scope.setContext('errorInfo', errorInfo);
      scope.setLevel('error');
    }}
  >
    <AppRouter />
  </Sentry.ErrorBoundary>
);

if (import.meta.env.VITE_ENABLE_SENTRY === 'true') {
  Sentry.init({
    dsn: "https://87f4b21d4a2b4070937882709e03efa0@o4509715042402304.ingest.us.sentry.io/4509715044958208",
    
    // Configurações de ambiente
    environment: import.meta.env.MODE || 'production',
    release: import.meta.env.VITE_APP_VERSION || '1.0.0',
    
    // Integrações para captura avançada
    integrations: [
             // Monitoramento de performance e navegação
       Sentry.browserTracingIntegration({
         // Captura cliques automáticos
         enableInp: true,
         // Instrumentação manual para React Router (simplificada)
         enableLongTask: true,
         enableInteractions: true,
       }),
      
      // Captura replay de sessões com erros
      Sentry.replayIntegration({
        // Só grava sessões com erros para economizar recursos
        sessionSampleRate: 0.1, // 10% de todas as sessões
        errorSampleRate: 1.0,    // 100% das sessões com erro
        maskAllText: true,       // Mascara texto por privacidade
        maskAllInputs: true,     // Mascara inputs por segurança
        blockAllMedia: true,     // Bloqueia mídia por performance
      }),
      
      // Captura informações do navegador
      Sentry.browserProfilingIntegration(),
      
      // Captura breadcrumbs personalizados
      Sentry.breadcrumbsIntegration({
        console: true,   // Logs do console
        dom: true,       // Eventos DOM (clicks, submits)
        fetch: true,     // Requisições fetch
        history: true,   // Mudanças de histórico/rota
        sentry: true,    // Eventos internos do Sentry
        xhr: true,       // Requisições XMLHttpRequest
      }),
    ],
    
    // Configurações de sampling
    tracesSampleRate: import.meta.env.MODE === 'development' ? 1.0 : 0.1, // 100% dev, 10% prod
    profilesSampleRate: import.meta.env.MODE === 'development' ? 1.0 : 0.1, // Profiling de performance
    
    // Configurações de dados pessoais
    sendDefaultPii: false, // Não enviar PII por padrão (mais seguro)
    
    // Configurações de captura
    beforeSend(event, hint) {
      // Filtrar erros de desenvolvimento
      if (import.meta.env.MODE === 'development') {
        console.log('Sentry event:', event);
      }
      
      // Filtrar erros de extensões do navegador
      if (event.exception) {
        const error = hint.originalException;
        if (error && error.message) {
          // Ignorar erros de extensões
          if (error.message.includes('extension://') || 
              error.message.includes('moz-extension://') ||
              error.message.includes('safari-extension://')) {
            return null;
          }
          
          // Ignorar erros de scripts de terceiros
          if (error.message.includes('Script error') ||
              error.message.includes('Non-Error promise rejection')) {
            return null;
          }
        }
      }
      
      return event;
    },
    
    // Configurar contexto inicial
    initialScope: {
      tags: {
        component: 'main-app',
        framework: 'react'
      },
      contexts: {
        app: {
          name: 'Dirhect',
          version: import.meta.env.VITE_APP_VERSION || '1.0.0'
        }
      }
    },
    
    // Configurações de transporte
    transportOptions: {
      // Buffer de eventos quando offline
      bufferSize: 30,
    },
    
    // Limites de captura
    maxBreadcrumbs: 50,        // Máximo de breadcrumbs
    attachStacktrace: true,    // Anexar stack traces
    
    // Configurações de debug
    debug: import.meta.env.MODE === 'development',
    
    // Normalizar URLs para não vazar dados sensíveis
    normalizeDepth: 6,
  });
  
     // Configurar contexto do usuário (quando disponível)
   if (typeof window !== 'undefined') {
     // Capturar informações básicas do browser
     Sentry.setContext('browser', {
       name: navigator.userAgent,
       language: navigator.language,
       cookieEnabled: navigator.cookieEnabled,
       onLine: navigator.onLine,
       platform: navigator.platform,
     });
     
     // Capturar informações da tela
     Sentry.setContext('screen', {
       width: screen.width,
       height: screen.height,
       colorDepth: screen.colorDepth,
       pixelDepth: screen.pixelDepth,
     });
     
     // Capturar mudanças de rota manualmente
     let currentPath = window.location.pathname;
     const originalPushState = window.history.pushState;
     const originalReplaceState = window.history.replaceState;
     
     window.history.pushState = function(...args) {
       const newPath = args[2] || window.location.pathname;
       if (newPath !== currentPath) {
         Sentry.addBreadcrumb({
           category: 'navigation',
           message: `Navigated from ${currentPath} to ${newPath}`,
           level: 'info',
           data: { from: currentPath, to: newPath }
         });
         currentPath = newPath;
       }
       return originalPushState.apply(this, args);
     };
     
     window.history.replaceState = function(...args) {
       const newPath = args[2] || window.location.pathname;
       if (newPath !== currentPath) {
         Sentry.addBreadcrumb({
           category: 'navigation',
           message: `Replaced route from ${currentPath} to ${newPath}`,
           level: 'info',
           data: { from: currentPath, to: newPath }
         });
         currentPath = newPath;
       }
       return originalReplaceState.apply(this, args);
     };
     
     // Capturar eventos de popstate (botão voltar/avançar)
     window.addEventListener('popstate', () => {
       const newPath = window.location.pathname;
       if (newPath !== currentPath) {
         Sentry.addBreadcrumb({
           category: 'navigation',
           message: `Navigated via browser controls from ${currentPath} to ${newPath}`,
           level: 'info',
           data: { from: currentPath, to: newPath, trigger: 'popstate' }
         });
         currentPath = newPath;
       }
     });
   }
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(import.meta.env.VITE_MODE === 'development' ? (
    <React.StrictMode>{app}</React.StrictMode>
) : (
    app
));