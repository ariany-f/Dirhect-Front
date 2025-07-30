import React from 'react';
import { useCandidatoContext } from '@contexts/Candidato';
import CampoTexto from '@components/CampoTexto';
import styled from 'styled-components';

const InfoBox = styled.div`
    grid-column: 1 / -1;
    background: linear-gradient(45deg, #f8fafc, #f1f5f9);
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
    color: #64748b;
    font-size: 14px;
    line-height: 1.5;
    
    .icon {
        color: #3b82f6;
        margin-right: 8px;
    }
`;

const StepAnotacoes = () => {
    const { candidato, setCandidato } = useCandidatoContext();

    return (
        <div data-tour="panel-step-anotacoes" style={{
            width: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px', 
            alignItems: 'center',
            padding: '20px'
        }}>
            <div style={{
                border: '1px solid #eee',
                borderRadius: 8,
                padding: 20,
                width: '100%',
                backgroundColor: '#fafafa'
            }}>

                
            <h3 style={{
                    margin: '0 0 16px 0',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'var(--text-color)',
                    textAlign: 'center'
                }}>
                    Anotações e Observações
            </h3>
                <InfoBox>
                    <strong>Dica:</strong> Use este campo para registrar informações importantes como:
                    <br />
                    • Observações sobre documentos
                    <br />
                    • Observações sobre entrevistas
                    <br />
                    • Condições especiais de contratação
                    <br />
                    • Observações sobre dependentes
                    <br />
                    • Qualquer outra informação relevante
                </InfoBox>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: '500', 
                        color: 'var(--text-color)',
                        fontSize: '14px'
                    }}>
                        Anotações
                    </label>
                    <CampoTexto
                        name="anotacoes"
                        valor={candidato.anotacoes || ''}
                        setValor={(valor) => {
                            setCandidato(prev => ({
                                ...prev,
                                anotacoes: valor
                            }));
                        }}
                        placeholder="Digite aqui suas anotações..."
                        rows={8}
                        width="100%"
                    />
                </div>
            </div>
        </div>
    );
};

export default StepAnotacoes; 