import React from 'react';
import { OverlayRight, DialogEstilizadoRight } from '@components/Modal/styles';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RiCloseFill } from 'react-icons/ri';
import styled from 'styled-components';
import Titulo from '@components/Titulo';
import Frame from '@components/Frame';
import { Col12 } from '@components/Colunas';
import { FaHistory, FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

const BotaoFechar = styled.button`
    background: none;
    border: none;
    color: #757575;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0 8px;
    transition: color 0.2s;
    &:hover {
        color: #f44336;
    }
`;

const CabecalhoFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 24px;
`;

const LogItem = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 12px;
    background: ${({ tipo }) => {
        switch (tipo) {
            case 'erro':
                return '#fff5f5';
            case 'sucesso':
                return '#f0f9ff';
            case 'info':
                return '#f8fafc';
            default:
                return '#f8fafc';
        }
    }};
    border-left: 4px solid ${({ tipo }) => {
        switch (tipo) {
            case 'erro':
                return '#dc3545';
            case 'sucesso':
                return '#28a745';
            case 'info':
                return '#17a2b8';
            default:
                return '#6c757d';
        }
    }};
`;

const LogIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${({ tipo }) => {
        switch (tipo) {
            case 'erro':
                return '#dc3545';
            case 'sucesso':
                return '#28a745';
            case 'info':
                return '#17a2b8';
            default:
                return '#6c757d';
        }
    }};
    color: white;
    flex-shrink: 0;
`;

const LogContent = styled.div`
    flex: 1;
    min-width: 0;
`;

const LogTitle = styled.div`
    font-weight: 600;
    font-size: 14px;
    color: #333;
    margin-bottom: 4px;
`;

const LogDescription = styled.div`
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
    line-height: 1.4;
`;

const LogMeta = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 12px;
    color: #888;
`;

const LogTimestamp = styled.span`
    font-weight: 500;
`;

const LogUser = styled.span`
    font-style: italic;
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    text-align: center;
    color: #666;
`;

const getLogType = (log) => {
    if (log.erro || log.status === 'erro' || log.tipo === 'erro') {
        return 'erro';
    }
    if (log.status === 'sucesso' || log.tipo === 'sucesso') {
        return 'sucesso';
    }
    return 'info';
};

const getLogIcon = (tipo) => {
    switch (tipo) {
        case 'erro':
            return <FaExclamationTriangle size={14} />;
        case 'sucesso':
            return <FaCheckCircle size={14} />;
        case 'info':
            return <FaInfoCircle size={14} />;
        default:
            return <FaInfoCircle size={14} />;
    }
};

const getLogTitle = (log) => {
    if (log.erro) {
        return 'Erro';
    }
    if (log.acao) {
        return log.acao;
    }
    if (log.tipo) {
        return log.tipo.charAt(0).toUpperCase() + log.tipo.slice(1);
    }
    return 'Log';
};

export default function ModalHistoricoTarefa({ opened, aoFechar, tarefa, logs }) {
    if (!opened || !tarefa) return null;

    const logsOrdenados = [...logs].sort((a, b) => {
        const dataA = new Date(a.criado_em || a.timestamp || a.data);
        const dataB = new Date(b.criado_em || b.timestamp || b.data);
        return dataB - dataA; // Mais recente primeiro
    });

    return (
        <OverlayRight $opened={opened} onClick={aoFechar}>
            <DialogEstilizadoRight $align="flex-end" open={opened} $opened={opened} onClick={e => e.stopPropagation()}>
                <Frame style={{padding: '24px 32px', maxWidth: '600px', width: '100%'}}>
                    <CabecalhoFlex>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <FaHistory size={20} color="var(--primary-color)" />
                            <Titulo size="medium">Histórico da Tarefa</Titulo>
                        </div>
                        <BotaoFechar onClick={aoFechar} formMethod="dialog">
                            <RiCloseFill size={22} className="fechar" />
                        </BotaoFechar>
                    </CabecalhoFlex>

                    <Col12>
                        <div style={{ marginBottom: '24px' }}>
                            <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>{tarefa.descricao}</h4>
                            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                                ID: {tarefa.id} • Status: {tarefa.status_display || tarefa.status}
                            </p>
                        </div>

                        {logsOrdenados.length === 0 ? (
                            <EmptyState>
                                <FaHistory size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                                <p>Nenhum log encontrado para esta tarefa.</p>
                            </EmptyState>
                        ) : (
                            <div>
                                {logsOrdenados.map((log, index) => {
                                    const tipo = getLogType(log);
                                    const icon = getLogIcon(tipo);
                                    const title = getLogTitle(log);
                                    const description = log.descricao || log.mensagem || log.erro || 'Log registrado';
                                    const timestamp = log.criado_em || log.timestamp || log.data;
                                    const user = log.usuario || log.user || log.criado_por;

                                    return (
                                        <LogItem key={index} tipo={tipo}>
                                            <LogIcon tipo={tipo}>
                                                {icon}
                                            </LogIcon>
                                            <LogContent>
                                                <LogTitle>{title}</LogTitle>
                                                <LogDescription>{description}</LogDescription>
                                                <LogMeta>
                                                    {timestamp && (
                                                        <LogTimestamp>
                                                            {format(new Date(timestamp), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                                        </LogTimestamp>
                                                    )}
                                                    {user && (
                                                        <LogUser>
                                                            por {user}
                                                        </LogUser>
                                                    )}
                                                </LogMeta>
                                            </LogContent>
                                        </LogItem>
                                    );
                                })}
                            </div>
                        )}
                    </Col12>
                </Frame>
            </DialogEstilizadoRight>
        </OverlayRight>
    );
} 