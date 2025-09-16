import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import Frame from '@components/Frame';
import Titulo from '@components/Titulo';
import Container from '@components/Container';
import styled from 'styled-components';
import QuestionCard from '@components/QuestionCard'
import { FaCalendarAlt, FaUser, FaIdCard, FaFileAlt, FaClock, FaDollarSign, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Tag } from 'primereact/tag';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario';
import { ArmazenadorToken } from '@utils';
import http from '@http';
import Botao from '@components/Botao';
import BotaoGrupo from '@components/BotaoGrupo';

const DemissaoContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`;

const DemissaoCard = styled.div`
    background: #ffffff;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    
    &:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }
`;

const InfoRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #f1f5f9;
    
    &:last-child {
        border-bottom: none;
    }
    
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
`;

const InfoLabel = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #475569;
    min-width: 180px;
    
    svg {
        color: #64748b;
    }
`;

const InfoValue = styled.div`
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
    text-align: right;
    flex: 1;
    
    @media (max-width: 768px) {
        text-align: left;
        width: 100%;
    }
`;

const ProcessoTag = styled(Tag)`
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
    color: white !important;
    font-weight: 600 !important;
    padding: 6px 12px !important;
    border-radius: 6px !important;
`;

const StatusTag = styled(Tag)`
    background: ${props => props.status === 'ativo' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'} !important;
    color: white !important;
    font-weight: 600 !important;
    padding: 6px 12px !important;
    border-radius: 6px !important;
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
    background: #f8fafc;
    border: 2px dashed #cbd5e1;
    border-radius: 12px;
    
    svg {
        margin-bottom: 16px;
        color: #64748b;
    }
    
    h3 {
        color: #475569;
        margin-bottom: 8px;
        font-size: 18px;
    }
    
    p {
        color: #64748b;
        font-size: 14px;
        max-width: 400px;
    }
`;

// Adicionar styled components para os botões
const ActionButtons = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #f1f5f9;
`;

const BotaoAprovarCustom = styled(Botao)`
    background: #e6f7f2 !important;
    color: #007a5a !important;
    border: none !important;

    &:hover:not(:disabled) {
        background: #d1f0e8 !important;
    }

    svg {
        fill: #007a5a !important;
    }
`;

const BotaoReprovarCustom = styled(Botao)`
    background: #fff1f0 !important;
    color: #d92d20 !important;
    border: none !important;

    &:hover:not(:disabled) {
        background: #ffe2e0 !important;
    }

    svg {
        fill: #d92d20 !important;
    }
`;

// Adicionar styled component para status de erro
const StatusErro = styled.div`
    background: #fef2f2;
    color: #dc2626;
    border-left: 4px solid #dc2626;
    border-radius: 4px;
    padding: 16px;
    font-size: 14px;
    margin-top: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
`;

function ColaboradorDemissao() {
    const { colaborador, demissao } = useOutletContext();
    const { usuario } = useSessaoUsuarioContext();
    const toast = useRef(null);
    const [loading, setLoading] = useState({});
    
    // Usar dados reais da API
    const demissaoData = demissao || [];

    const formatarData = (data) => {
        if (!data) return 'Não informado';
        return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
    };

    const formatarDataHora = (dataHora) => {
        if (!dataHora) return 'Não informado';
        return new Date(dataHora).toLocaleDateString('pt-BR') + ' às ' + new Date(dataHora).toLocaleTimeString('pt-BR');
    };

    // Função para aprovar demissão
    const handleAprovar = async (atividadeId) => {
        setLoading(prev => ({ ...prev, [atividadeId]: true }));
        
        try {
            await http.post(`tarefas/${atividadeId}/aprovar/`);
            
            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Demissão aprovada com sucesso!',
                life: 3000
            });
            
            // Recarregar a página para atualizar os dados
            window.location.reload();
            
        } catch (error) {
            console.error('Erro ao aprovar demissão:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao aprovar demissão. Tente novamente.',
                life: 3000
            });
        } finally {
            setLoading(prev => ({ ...prev, [atividadeId]: false }));
        }
    };

    // Função para rejeitar demissão
    const handleRejeitar = async (atividadeId) => {
        setLoading(prev => ({ ...prev, [atividadeId]: true }));
        
        try {
            await http.post(`tarefas/${atividadeId}/rejeitar/`);
            
            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Demissão rejeitada com sucesso!',
                life: 3000
            });
            
            // Recarregar a página para atualizar os dados
            window.location.reload();
            
        } catch (error) {
            console.error('Erro ao rejeitar demissão:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao rejeitar demissão. Tente novamente.',
                life: 3000
            });
        } finally {
            setLoading(prev => ({ ...prev, [atividadeId]: false }));
        }
    };

    if (!demissaoData || demissaoData.length === 0) {
        return (
            <Frame>
                <Toast ref={toast} />
                <Container gap="24px">
                    <Titulo>Demissão</Titulo>
                    <EmptyState>
                        <FaExclamationTriangle size={48} />
                        <h3>Nenhuma solicitação de demissão encontrada</h3>
                        <p>Este colaborador não possui solicitações de demissão registradas no sistema.</p>
                    </EmptyState>
                </Container>
            </Frame>
        );
    }

    return (
        <Frame>
            <Toast ref={toast} />
            <Container gap="24px">
                
                <Titulo>
                    <QuestionCard alinhamento="start" element={<h6>Demissão</h6>}>
                        <AiFillQuestionCircle className="question-icon" size={20} />
                    </QuestionCard>
                </Titulo>
                
                <DemissaoContainer>
                    {demissaoData.map((demissao, index) => (
                        <DemissaoCard key={demissao.id || index}>
                            <InfoRow>
                                <InfoLabel>
                                    <FaCalendarAlt />
                                    Data da Demissão
                                </InfoLabel>
                                <InfoValue>{formatarData(demissao.data)}</InfoValue>
                            </InfoRow>

                            <InfoRow>
                                <InfoLabel>
                                    Processo Relacionado
                                </InfoLabel>
                                <InfoValue><Link to={`/tarefas/detalhes/${demissao.processo}`}>Ir para detalhes do processo</Link></InfoValue>
                            </InfoRow>

                            <InfoRow>
                                <InfoLabel>
                                    Tipo de Demissão
                                </InfoLabel>
                                <InfoValue>
                                    <Tag 
                                        value={demissao.tipo_descricao} 
                                        style={{ 
                                            background: '#1e40af',
                                            color: '#ffffff',
                                            fontWeight: '600',
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            fontSize: '13px'
                                        }}
                                    />
                                </InfoValue>
                            </InfoRow>

                            <InfoRow>
                                <InfoLabel>
                                    Motivo
                                </InfoLabel>
                                <InfoValue>{demissao.motivo_descricao}</InfoValue>
                            </InfoRow>

                            {demissao.data_pagamento && (
                                <InfoRow>
                                    <InfoLabel>
                                        <FaDollarSign />
                                        Data de Pagamento
                                    </InfoLabel>
                                    <InfoValue>{formatarData(demissao.data_pagamento)}</InfoValue>
                                </InfoRow>
                            )}

                            {demissao.data_inicio_aviso && (
                                <InfoRow>
                                    <InfoLabel>
                                        <FaClock />
                                        Início do Aviso
                                    </InfoLabel>
                                    <InfoValue>{formatarData(demissao.data_inicio_aviso)}</InfoValue>
                                </InfoRow>
                            )}

                            <InfoRow>
                                <InfoLabel>
                                    Aviso Indenizado
                                </InfoLabel>
                                <InfoValue>
                                    <StatusTag 
                                        value={demissao.aviso_indenizado ? 'Sim' : 'Não'} 
                                        status={demissao.aviso_indenizado ? 'ativo' : 'inativo'}
                                    />
                                </InfoValue>
                            </InfoRow>

                            {demissao.observacao && (
                                <InfoRow>
                                    <InfoLabel>
                                        Observações
                                    </InfoLabel>
                                    <InfoValue>{demissao.observacao}</InfoValue>
                                </InfoRow>
                            )}

                            <InfoRow>
                                <InfoLabel>
                                    Criado em
                                </InfoLabel>
                                <InfoValue>{formatarDataHora(demissao.created_at)}</InfoValue>
                            </InfoRow>

                            {demissao.anexo && (
                                <InfoRow>
                                    <InfoLabel>
                                        <FaFileAlt />
                                        Anexo
                                    </InfoLabel>
                                    <InfoValue>
                                        <a 
                                            href={demissao.anexo} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            style={{
                                                color: '#3b82f6',
                                                textDecoration: 'none',
                                                fontWeight: '600'
                                            }}
                                        >
                                            Visualizar Anexo
                                        </a>
                                    </InfoValue>
                                </InfoRow>
                            )}

                            {/* Status de erro da atividade */}
                            {(usuario?.tipo === 'Outsourcing' || usuario?.tipo === 'RH') && demissao.atividade_status === 'erro' && (
                                <StatusErro>
                                    <FaExclamationTriangle size={20} style={{ color: '#dc2626', flexShrink: 0 }}/>
                                    <span>
                                        <strong>Erro na atividade:</strong> Esta solicitação de demissão possui um erro no processo. 
                                        Entre em contato com o administrador do sistema para resolver.
                                    </span>
                                </StatusErro>
                            )}

                            {/* Botões de ação para usuários Outsourcing - apenas se status for pendente */}
                            {demissao.atividade_uid && 
                             demissao.atividade_status === 'pendente' && 
                             usuario?.tipo === 'Outsourcing' && 
                             ArmazenadorToken.hasPermission('change_tarefa') && (
                                <ActionButtons>
                                    <BotaoGrupo>
                                        <BotaoAprovarCustom 
                                            size="small" 
                                            aoClicar={() => handleAprovar(demissao.atividade_uid)}
                                            disabled={loading[demissao.atividade_uid]}
                                        >
                                            <FaCheckCircle /> Aprovar
                                        </BotaoAprovarCustom>
                                        <BotaoReprovarCustom 
                                            size="small" 
                                            aoClicar={() => handleRejeitar(demissao.atividade_uid)}
                                            disabled={loading[demissao.atividade_uid]}
                                        >
                                            <FaTimesCircle /> Reprovar
                                        </BotaoReprovarCustom>
                                    </BotaoGrupo>
                                </ActionButtons>
                            )}
                        </DemissaoCard>
                    ))}
                </DemissaoContainer>
            </Container>
        </Frame>
    );
}

export default ColaboradorDemissao;