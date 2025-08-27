import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { FaShieldAlt, FaGlobe, FaKey, FaUser, FaCog, FaLink, FaClock, FaInfo, FaEye, FaEyeSlash } from 'react-icons/fa';
import styled from 'styled-components';
import Texto from '@components/Texto';
import Botao from '@components/Botao';

const StatusTag = styled(Tag)`
    color: var(--black) !important;
    background-color: var(--neutro-200) !important;
    font-size: 13px !important;
    padding: 4px 12px !important;
    
    .p-tag-value {
        color: var(--black) !important;
        font-weight: 500 !important;
    }
`;

const TipoAutenticacaoTag = styled(Tag)`
    color: var(--white) !important;
    background-color: ${props => props.tipo === 'api_key' ? '#28a745' :
                        props.tipo === 'basic' ? '#1a73e8' :
                        props.tipo === 'bearer' ? '#ffa000' :
                        props.tipo === 'oauth' ? '#dc3545' :
                        '#6c757d'} !important;
    font-size: 13px !important;
    padding: 4px 12px !important;
    
    .p-tag-value {
        color: var(--white) !important;
        font-weight: 500 !important;
    }
`;

const DetailSection = styled.div`
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    border: 1px solid #e9ecef;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const DetailRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 12px 0;
    border-bottom: 1px solid #f1f3f4;
    
    &:last-child {
        border-bottom: none;
    }
`;

const DetailLabel = styled.div`
    font-weight: 600;
    color: #495057;
    font-size: 14px;
    min-width: 140px;
    flex-shrink: 0;
`;

const DetailValue = styled.div`
    color: #6c757d;
    font-size: 14px;
    flex: 1;
    margin-left: 16px;
    word-break: break-word;
`;

const CredentialIcon = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: ${props => props.tipo === 'api_key' ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' :
                  props.tipo === 'basic' ? 'linear-gradient(135deg, #1a73e8 0%, #1565c0 100%)' :
                  props.tipo === 'bearer' ? 'linear-gradient(135deg, #ffa000 0%, #f57c00 100%)' :
                  props.tipo === 'oauth' ? 'linear-gradient(135deg, #dc3545 0%, #c62828 100%)' :
                  'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;
    color: #ffffff;
    border: 2px solid #f1f5f9;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin-right: 16px;
`;

const HeaderInfo = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 24px;
`;

const HeaderText = styled.div`
    flex: 1;
`;

const Title = styled.h2`
    font-size: 24px;
    font-weight: 700;
    color: #495057;
    margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
    font-size: 16px;
    color: #6c757d;
    margin: 0;
    line-height: 1.5;
`;

const TagsContainer = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 12px;
`;

const SectionTitle = styled.h3`
    font-size: 18px;
    font-weight: 600;
    color: #495057;
    margin: 0 0 16px 0;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const SensitiveValue = styled.div`
    font-family: monospace;
    background: #f8f9fa;
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #e9ecef;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const ToggleButton = styled.button`
    background: none;
    border: none;
    color: #6c757d;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s ease;
    
    &:hover {
        background: #e9ecef;
        color: #495057;
    }
`;

const JsonViewer = styled.pre`
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    padding: 12px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 12px;
    color: #495057;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 24px;
    color: #6c757d;
    font-style: italic;
`;

function ModalDetalhesCredencial({ credencial, visible, onHide, onEdit, onDelete }) {
    const [showSensitiveData, setShowSensitiveData] = React.useState({});

    const toggleSensitiveData = (field) => {
        setShowSensitiveData(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const getCredentialIcon = (tipoAutenticacao) => {
        switch (tipoAutenticacao) {
            case 'api_key':
                return <FaKey size={24} />;
            case 'basic':
                return <FaUser size={24} />;
            case 'bearer':
                return <FaShieldAlt size={24} />;
            case 'oauth':
                return <FaCog size={24} />;
            default:
                return <FaGlobe size={24} />;
        }
    };

    const formatJson = (jsonString) => {
        try {
            const parsed = JSON.parse(jsonString);
            return JSON.stringify(parsed, null, 2);
        } catch {
            return jsonString;
        }
    };

    const renderSensitiveValue = (value, field, label) => {
        if (!value) return <span style={{ color: '#9ca3af' }}>Não informado</span>;
        
        const isVisible = showSensitiveData[field];
        
        return (
            <SensitiveValue>
                <span style={{ fontFamily: 'monospace' }}>
                    {isVisible ? value : '••••••••••••••••'}
                </span>
                <ToggleButton onClick={() => toggleSensitiveData(field)}>
                    {isVisible ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </ToggleButton>
            </SensitiveValue>
        );
    };

    const renderHeadersAdicionais = () => {
        if (!credencial.headers_adicionais) {
            return <EmptyState>Nenhum header adicional configurado</EmptyState>;
        }

        try {
            const headers = typeof credencial.headers_adicionais === 'string' 
                ? JSON.parse(credencial.headers_adicionais) 
                : credencial.headers_adicionais;
            
            return (
                <JsonViewer>
                    {JSON.stringify(headers, null, 2)}
                </JsonViewer>
            );
        } catch {
            return (
                <div style={{ color: '#dc3545', fontFamily: 'monospace' }}>
                    {credencial.headers_adicionais}
                </div>
            );
        }
    };

    const renderCamposAdicionais = () => {
        if (!credencial.campos_adicionais || credencial.campos_adicionais.length === 0) {
            return <EmptyState>Nenhum campo adicional configurado</EmptyState>;
        }

        return (
            <div style={{ display: 'grid', gap: '12px' }}>
                {credencial.campos_adicionais.map((campo, index) => (
                    <div key={campo.id || index} style={{
                        background: '#f8f9fa',
                        border: '1px solid #e9ecef',
                        borderRadius: '8px',
                        padding: '16px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <div style={{ fontWeight: '600', color: '#495057' }}>
                                {campo.chave}
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Tag 
                                    value={campo.tipo_campo} 
                                    severity="info" 
                                    style={{ fontSize: '11px' }}
                                />
                                {campo.obrigatório && (
                                    <Tag 
                                        value="Obrigatório" 
                                        severity="warning" 
                                        style={{ fontSize: '11px' }}
                                    />
                                )}
                                {campo.sensivel && (
                                    <Tag 
                                        value="Sensível" 
                                        severity="danger" 
                                        style={{ fontSize: '11px' }}
                                    />
                                )}
                            </div>
                        </div>
                        <div style={{ color: '#6c757d', fontSize: '13px' }}>
                            {campo.sensivel ? renderSensitiveValue(campo.valor, `campo_${index}`, campo.chave) : campo.valor}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    if (!credencial) return null;

    return (
        <Dialog
            header={
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#495057'
                }}>
                    <FaShieldAlt size={24} color="var(--primaria)" />
                    Detalhes da Credencial
                </div>
            }
            visible={visible}
            onHide={onHide}
            style={{ width: '90vw', maxWidth: '1000px' }}
            modal
            closeOnEscape
            closable
            footer={<></>}
        >
            <div style={{ padding: '0' }}>
                {/* Header com informações principais */}
                <HeaderInfo>
                    <CredentialIcon tipo={credencial.tipo_autenticacao}>
                        {getCredentialIcon(credencial.tipo_autenticacao)}
                    </CredentialIcon>
                    <HeaderText>
                        <Title>{credencial.nome_sistema}</Title>
                        <Subtitle>{credencial.descricao || 'Sem descrição'}</Subtitle>
                        <TagsContainer>
                            <StatusTag 
                                value={credencial.ativo ? 'Ativo' : 'Inativo'} 
                                severity={credencial.ativo ? "success" : "danger"}
                            />
                            <TipoAutenticacaoTag 
                                value={credencial.tipo_autenticacao_display || credencial.tipo_autenticacao}
                                tipo={credencial.tipo_autenticacao}
                            />
                        </TagsContainer>
                    </HeaderText>
                </HeaderInfo>

                {/* Informações Básicas */}
                <DetailSection>
                    <SectionTitle>
                        <FaInfo size={16} />
                        Informações Básicas
                    </SectionTitle>
                    
                    <DetailRow>
                        <DetailLabel>Nome do Sistema</DetailLabel>
                        <DetailValue>{credencial.nome_sistema}</DetailValue>
                    </DetailRow>
                    
                    <DetailRow>
                        <DetailLabel>Descrição</DetailLabel>
                        <DetailValue>{credencial.descricao || 'Não informada'}</DetailValue>
                    </DetailRow>
                    
                    <DetailRow>
                        <DetailLabel>Status</DetailLabel>
                        <DetailValue>
                            <StatusTag 
                                value={credencial.ativo ? 'Ativo' : 'Inativo'} 
                                severity={credencial.ativo ? "success" : "danger"}
                            />
                        </DetailValue>
                    </DetailRow>
                    
                    <DetailRow>
                        <DetailLabel>Tipo de Autenticação</DetailLabel>
                        <DetailValue>
                            <TipoAutenticacaoTag 
                                value={credencial.tipo_autenticacao_display || credencial.tipo_autenticacao}
                                tipo={credencial.tipo_autenticacao}
                            />
                        </DetailValue>
                    </DetailRow>
                </DetailSection>

                {/* Configuração de Conexão */}
                <DetailSection>
                    <SectionTitle>
                        <FaLink size={16} />
                        Configuração de Conexão
                    </SectionTitle>
                    
                    <DetailRow>
                        <DetailLabel>URL do Endpoint</DetailLabel>
                        <DetailValue style={{ fontFamily: 'monospace' }}>
                            {credencial.url_endpoint}
                        </DetailValue>
                    </DetailRow>
                    
                    <DetailRow>
                        <DetailLabel>Timeout</DetailLabel>
                        <DetailValue>{credencial.timeout || 30} segundos</DetailValue>
                    </DetailRow>
                    
                    <DetailRow>
                        <DetailLabel>Status da Conexão</DetailLabel>
                        <DetailValue style={{ 
                            color: credencial.status_conexao === 'Conectado' ? '#28a745' : 
                                   credencial.status_conexao === 'Erro' ? '#dc3545' : '#ffc107'
                        }}>
                            {credencial.status_conexao || 'Desconhecido'}
                        </DetailValue>
                    </DetailRow>
                </DetailSection>

                {/* Credenciais de Autenticação */}
                <DetailSection>
                    <SectionTitle>
                        <FaKey size={16} />
                        Credenciais de Autenticação
                    </SectionTitle>
                    
                    {credencial.tipo_autenticacao === 'basic' && (
                        <>
                            <DetailRow>
                                <DetailLabel>Usuário</DetailLabel>
                                <DetailValue>{credencial.usuario || 'Não informado'}</DetailValue>
                            </DetailRow>
                            <DetailRow>
                                <DetailLabel>Senha</DetailLabel>
                                <DetailValue>
                                    {renderSensitiveValue(credencial.senha, 'senha', 'Senha')}
                                </DetailValue>
                            </DetailRow>
                        </>
                    )}
                    
                    {credencial.tipo_autenticacao === 'api_key' && (
                        <DetailRow>
                            <DetailLabel>API Key</DetailLabel>
                            <DetailValue>
                                {renderSensitiveValue(credencial.api_key, 'api_key', 'API Key')}
                            </DetailValue>
                        </DetailRow>
                    )}
                    
                    {credencial.tipo_autenticacao === 'bearer' && (
                        <DetailRow>
                            <DetailLabel>Bearer Token</DetailLabel>
                            <DetailValue>
                                {renderSensitiveValue(credencial.bearer_token, 'bearer_token', 'Bearer Token')}
                            </DetailValue>
                        </DetailRow>
                    )}
                    
                    {credencial.tipo_autenticacao === 'oauth' && (
                        <>
                            <DetailRow>
                                <DetailLabel>Client ID</DetailLabel>
                                <DetailValue>{credencial.client_id || 'Não informado'}</DetailValue>
                            </DetailRow>
                            <DetailRow>
                                <DetailLabel>Client Secret</DetailLabel>
                                <DetailValue>
                                    {renderSensitiveValue(credencial.client_secret, 'client_secret', 'Client Secret')}
                                </DetailValue>
                            </DetailRow>
                        </>
                    )}
                </DetailSection>

                {/* Headers Adicionais */}
                <DetailSection>
                    <SectionTitle>
                        <FaGlobe size={16} />
                        Headers Adicionais
                    </SectionTitle>
                    {renderHeadersAdicionais()}
                </DetailSection>

                {/* Campos Adicionais */}
                <DetailSection>
                    <SectionTitle>
                        <FaCog size={16} />
                        Campos Adicionais ({credencial.campos_adicionais?.length || 0})
                    </SectionTitle>
                    {renderCamposAdicionais()}
                </DetailSection>

                {/* Observações */}
                {credencial.observacoes && (
                    <DetailSection>
                        <SectionTitle>
                            <FaInfo size={16} />
                            Observações
                        </SectionTitle>
                        <div style={{ 
                            background: '#fff3cd', 
                            border: '1px solid #ffeaa7', 
                            borderRadius: '8px', 
                            padding: '16px',
                            color: '#856404'
                        }}>
                            {credencial.observacoes}
                        </div>
                    </DetailSection>
                )}
            </div>
        </Dialog>
    );
}

export default ModalDetalhesCredencial; 