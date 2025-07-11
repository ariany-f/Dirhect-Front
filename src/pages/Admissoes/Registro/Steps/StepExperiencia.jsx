import React, { useState } from 'react';
import { useCandidatoContext } from '@contexts/Candidato';
import CampoTexto from '@components/CampoTexto';
import BotaoSemBorda from '@components/BotaoSemBorda';
import { GrAddCircle } from 'react-icons/gr';
import { FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const StepExperiencia = () => {
    const { candidato, addArrayItem, updateArrayItem, removeArrayItem } = useCandidatoContext();
    const [abertos, setAbertos] = useState(() => {
        // Se não houver itens, retorna array vazio
        if (!candidato.experiencia?.length) return [];
        // Retorna array com o índice do último item
        return [candidato.experiencia.length - 1];
    });

    const toggleAcordeon = (idx) => {
        const experiencia = candidato.experiencia[idx];
        const isCompleto = experiencia.cargo &&
                          experiencia.empresa &&
                          experiencia.descricao &&
                          experiencia.dataInicio &&
                          experiencia.dataSaida;

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

    const podeAdicionarExperiencia = () => {
        if (!Array.isArray(candidato.experiencia) || candidato.experiencia.length === 0) return true;
        const ultimaExperiencia = candidato.experiencia[candidato.experiencia.length - 1];
        return ultimaExperiencia.cargo &&
               ultimaExperiencia.empresa &&
               ultimaExperiencia.descricao &&
               ultimaExperiencia.dataInicio &&
               ultimaExperiencia.dataSaida;
    };

    const adicionarExperiencia = () => {
        if (podeAdicionarExperiencia()) {
            const ultimoIndex = candidato.experiencia.length - 1;
            if (ultimoIndex >= 0) {
                setAbertos(prev => prev.filter(i => i !== ultimoIndex));
            }
            
            addArrayItem('experiencia', { cargo: '', empresa: '', descricao: '', dataInicio: '', dataSaida: '' });
            setAbertos([candidato.experiencia.length]);
        }
    };

    const ResumoExperiencia = ({ exp }) => (
        <div style={{ display: 'flex', gap: '8px', color: 'var(--text-color-secondary)' }}>
            <span><strong>{exp.cargo}</strong></span>
            {exp.cargo && exp.empresa && <span>•</span>}
            <span>{exp.empresa}</span>
        </div>
    );

    return (
        <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center'}}>
            {(Array.isArray(candidato.experiencia) ? candidato.experiencia : []).map((exp, idx) => (
                <div key={idx} style={{ 
                    border: '1px solid #eee', 
                    borderRadius: 8, 
                    marginBottom: 12, 
                    padding: 12,
                    width: '100%'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: abertos.includes(idx) ? '12px' : '0',
                        cursor: 'pointer'
                    }} onClick={() => toggleAcordeon(idx)}>
                        {abertos.includes(idx) ? (
                            <strong>Experiência {idx + 1}</strong>
                        ) : (
                            <ResumoExperiencia exp={exp} />
                        )}
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <BotaoSemBorda 
                                aoClicar={(e) => {
                                    e.stopPropagation();
                                    removeArrayItem('experiencia', idx);
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
                                name={`cargo-${idx}`}
                                valor={exp.cargo}
                                setValor={valor => updateArrayItem('experiencia', idx, { ...exp, cargo: valor })}
                                label="Cargo"
                            />
                            <CampoTexto
                                name={`empresa-${idx}`}
                                valor={exp.empresa}
                                setValor={valor => updateArrayItem('experiencia', idx, { ...exp, empresa: valor })}
                                label="Empresa"
                            />
                            <CampoTexto
                                name={`descricao-${idx}`}
                                valor={exp.descricao}
                                setValor={valor => updateArrayItem('experiencia', idx, { ...exp, descricao: valor })}
                                label="Descrição"
                            />
                            <CampoTexto
                                name={`dataInicio-${idx}`}
                                valor={exp.dataInicio}
                                setValor={valor => updateArrayItem('experiencia', idx, { ...exp, dataInicio: valor })}
                                label="Data de Início"
                                type="date"
                            />
                            <CampoTexto
                                name={`dataSaida-${idx}`}
                                valor={exp.dataSaida}
                                setValor={valor => updateArrayItem('experiencia', idx, { ...exp, dataSaida: valor })}
                                label="Data de Saída"
                                type="date"
                            />
                        </div>
                    )}
                </div>
            ))}
            <div style={{marginTop: '12px'}}>
                <BotaoSemBorda 
                    aoClicar={adicionarExperiencia} 
                    color={podeAdicionarExperiencia() ? 'var(--primaria)' : 'var(--surface-500)'}
                >
                    <GrAddCircle /> Adicionar Experiência
                </BotaoSemBorda>
            </div>
        </div>
    );
};

export default StepExperiencia; 