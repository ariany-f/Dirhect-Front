import React, { useState } from 'react';
import { useCandidatoContext } from '@contexts/Candidato';
import CampoTexto from '@components/CampoTexto';
import BotaoSemBorda from '@components/BotaoSemBorda';
import { GrAddCircle } from 'react-icons/gr';
import { FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const StepHabilidades = () => {
    const { candidato, addArrayItem, updateArrayItem, removeArrayItem } = useCandidatoContext();
    const [abertos, setAbertos] = useState(() => {
        // Se não houver itens, retorna array vazio
        if (!candidato.habilidades?.length) return [];
        // Retorna array com o índice do último item
        return [candidato.habilidades.length - 1];
    });

    const toggleAcordeon = (idx) => {
        const habilidade = candidato.habilidades[idx];
        const isCompleto = habilidade.nivel && habilidade.descricao;

        // Se não estiver completo e estiver tentando fechar, não permite
        if (!isCompleto && abertos.includes(idx)) {
            return;
        }

        setAbertos(prev => {
            if (prev.includes(idx)) {
                return prev.filter(i => i !== idx);
            }
            return [...prev, idx];
        });
    };

    const podeAdicionarHabilidade = () => {
        if (candidato.habilidades.length === 0) return true;
        
        const ultimaHabilidade = candidato.habilidades[candidato.habilidades.length - 1];
        return ultimaHabilidade.nivel && ultimaHabilidade.descricao;
    };

    const adicionarHabilidade = () => {
        if (podeAdicionarHabilidade()) {
            const ultimoIndex = candidato.habilidades.length - 1;
            if (ultimoIndex >= 0) {
                setAbertos(prev => prev.filter(i => i !== ultimoIndex));
            }
            
            addArrayItem('habilidades', { nivel: '', descricao: '' });
            setAbertos([candidato.habilidades.length]);
        }
    };

    const ResumoHabilidade = ({ hab }) => (
        <div style={{ display: 'flex', gap: '8px', color: 'var(--text-color-secondary)' }}>
            <span><strong>{hab.descricao}</strong></span>
            {hab.descricao && hab.nivel && <span>•</span>}
            <span>{hab.nivel}</span>
        </div>
    );

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
            {candidato.habilidades.map((hab, idx) => (
                <div key={idx} style={{ 
                    border: '1px solid #eee', 
                    borderRadius: 8, 
                    marginBottom: 12, 
                    padding: 12 
                }}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: abertos.includes(idx) ? '12px' : '0',
                        cursor: 'pointer'
                    }} onClick={() => toggleAcordeon(idx)}>
                        {abertos.includes(idx) ? (
                            <strong>Habilidade {idx + 1}</strong>
                        ) : (
                            <ResumoHabilidade hab={hab} />
                        )}
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <BotaoSemBorda 
                                aoClicar={(e) => {
                                    e.stopPropagation();
                                    removeArrayItem('habilidades', idx);
                                }}
                                color="var(--error-500)"
                            >
                                <FaTrash />
                            </BotaoSemBorda>
                            {abertos.includes(idx) ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                    </div>
                    
                    {abertos.includes(idx) && (
                        <div>
                            <CampoTexto
                                name={`descricao-${idx}`}
                                valor={hab.descricao}
                                setValor={valor => updateArrayItem('habilidades', idx, { ...hab, descricao: valor })}
                                label="Descrição"
                            />
                            <CampoTexto
                                name={`nivel-${idx}`}
                                valor={hab.nivel}
                                setValor={valor => updateArrayItem('habilidades', idx, { ...hab, nivel: valor })}
                                label="Nível"
                            />
                        </div>
                    )}
                </div>
            ))}
            <div style={{marginTop: '12px'}}>
                <BotaoSemBorda 
                    aoClicar={adicionarHabilidade} 
                    color={podeAdicionarHabilidade() ? 'var(--primaria)' : 'var(--surface-500)'}
                >
                    <GrAddCircle /> Adicionar Habilidade
                </BotaoSemBorda>
            </div>
        </div>
    );
};

export default StepHabilidades; 