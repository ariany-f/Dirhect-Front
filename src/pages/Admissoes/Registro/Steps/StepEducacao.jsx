import React, { useState } from 'react';
import { useCandidatoContext } from '@contexts/Candidato';
import CampoTexto from '@components/CampoTexto';
import BotaoSemBorda from '@components/BotaoSemBorda';
import { GrAddCircle } from 'react-icons/gr';
import { FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const StepEducacao = () => {
    const { candidato, addArrayItem, updateArrayItem, removeArrayItem } = useCandidatoContext();
    const [abertos, setAbertos] = useState(() => {
        // Se não houver itens, retorna array vazio
        if (!Array.isArray(candidato.educacao) || candidato.educacao.length === 0) return [];
        // Retorna array com o índice do último item
        return [candidato.educacao.length - 1];
    });

    const toggleAcordeon = (idx) => {
        const educacao = candidato.educacao[idx];
        const isCompleto = educacao.nivel &&
                          educacao.instituicao &&
                          educacao.curso &&
                          educacao.dataInicio &&
                          educacao.dataConclusao;

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

    const podeAdicionarEducacao = () => {
        if (!Array.isArray(candidato.educacao) || candidato.educacao.length === 0) return true;
        const ultimaEducacao = candidato.educacao[candidato.educacao.length - 1];
        return ultimaEducacao.nivel &&
               ultimaEducacao.instituicao &&
               ultimaEducacao.curso &&
               ultimaEducacao.dataInicio &&
               ultimaEducacao.dataConclusao;
    };

    const adicionarEducacao = () => {
        if (podeAdicionarEducacao()) {
            // Fecha o item anterior
            const ultimoIndex = candidato.educacao.length - 1;
            if (ultimoIndex >= 0) {
                setAbertos(prev => prev.filter(i => i !== ultimoIndex));
            }
            
            // Adiciona novo item e abre ele
            addArrayItem('educacao', { nivel: '', instituicao: '', curso: '', dataInicio: '', dataConclusao: '' });
            setAbertos([candidato.educacao.length]); // Abre o novo item
        }
    };

    const ResumoEducacao = ({ edu }) => (
        <div style={{ display: 'flex', gap: '8px', color: 'var(--text-color-secondary)' }}>
            <span><strong>{edu.nivel}</strong></span>
            {edu.nivel && edu.instituicao && <span>•</span>}
            <span>{edu.instituicao}</span>
            {edu.instituicao && edu.curso && <span>•</span>}
            <span>{edu.curso}</span>
        </div>
    );

    return (
        <div data-tour="panel-step-3" style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center'}}>
            {(Array.isArray(candidato.educacao) ? candidato.educacao : []).map((edu, idx) => (
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
                            <strong>Educação {idx + 1}</strong>
                        ) : (
                            <ResumoEducacao edu={edu} />
                        )}
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <BotaoSemBorda 
                                aoClicar={(e) => {
                                    e.stopPropagation();
                                    removeArrayItem('educacao', idx);
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
                                name={`nivel-${idx}`}
                                valor={edu.nivel}
                                setValor={valor => updateArrayItem('educacao', idx, { ...edu, nivel: valor })}
                                label="Nível"
                            />
                            <CampoTexto
                                name={`instituicao-${idx}`}
                                valor={edu.instituicao}
                                setValor={valor => updateArrayItem('educacao', idx, { ...edu, instituicao: valor })}
                                label="Instituição"
                            />
                            <CampoTexto
                                name={`curso-${idx}`}
                                valor={edu.curso}
                                setValor={valor => updateArrayItem('educacao', idx, { ...edu, curso: valor })}
                                label="Curso"
                            />
                            <CampoTexto
                                name={`dataInicio-${idx}`}
                                valor={edu.dataInicio}
                                setValor={valor => updateArrayItem('educacao', idx, { ...edu, dataInicio: valor })}
                                label="Data de Início"
                                type="date"
                            />
                            <CampoTexto
                                name={`dataConclusao-${idx}`}
                                valor={edu.dataConclusao}
                                setValor={valor => updateArrayItem('educacao', idx, { ...edu, dataConclusao: valor })}
                                label="Data de Conclusão"
                                type="date"
                            />
                        </div>
                    )}
                </div>
            ))}
            <div style={{marginTop: '12px'}}>
                <BotaoSemBorda 
                    aoClicar={adicionarEducacao} 
                color={podeAdicionarEducacao() ? 'var(--primaria)' : 'var(--surface-500)'}
            >
                    <GrAddCircle /> Adicionar Educação
                </BotaoSemBorda>
            </div>
        </div>
    );
};

export default StepEducacao; 