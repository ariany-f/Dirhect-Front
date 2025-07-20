import React from 'react';
import { useCandidatoContext } from '@contexts/Candidato';
import CampoTexto from '@components/CampoTexto';

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
                
                <p style={{
                    margin: '0 0 20px 0',
                    fontSize: '14px',
                    color: 'var(--text-color-secondary)',
                    textAlign: 'center',
                    lineHeight: '1.5'
                }}>
                    Adicione aqui qualquer observação ou anotação relevante sobre o processo de admissão.
                </p>

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

                <div style={{
                    background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                    border: '1px solid #bae6fd',
                    borderRadius: 6,
                    padding: '12px',
                    marginTop: '16px'
                }}>
                    <p style={{
                        margin: 0,
                        fontSize: '13px',
                        color: '#0369a1',
                        lineHeight: '1.4'
                    }}>
                        <strong>💡 Dica:</strong> Use este campo para registrar informações importantes como:
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
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StepAnotacoes; 