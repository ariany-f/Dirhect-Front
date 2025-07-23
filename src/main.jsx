import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from './routes.jsx'
import 'primeicons/primeicons.css';
import * as Sentry from "@sentry/react";

const app = (
  <Sentry.ErrorBoundary fallback={<p>Algo deu errado.</p>}>
    <AppRouter />
  </Sentry.ErrorBoundary>
);

if (import.meta.env.VITE_ENABLE_SENTRY === 'true') {
  Sentry.init({
    dsn: "https://87f4b21d4a2b4070937882709e03efa0@o4509715042402304.ingest.us.sentry.io/4509715044958208",
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    integrations: [Sentry.browserTracingIntegration()],
    sendDefaultPii: true,
    tracesSampleRate: 1.0
  });
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(import.meta.env.MODE === 'development' ? (
    <React.StrictMode>{app}</React.StrictMode>
) : (
    app
));