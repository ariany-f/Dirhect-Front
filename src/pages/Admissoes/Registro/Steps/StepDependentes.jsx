import React, { useState, useEffect } from 'react';
import { useCandidatoContext } from '@contexts/Candidato';
import CampoTexto from '@components/CampoTexto';
import BotaoSemBorda from '@components/BotaoSemBorda';
import { GrAddCircle } from 'react-icons/gr';
import { FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Dropdown } from 'primereact/dropdown';
import http from '@http';

const StepDependentes = () => {
    const { candidato, addArrayItem, updateArrayItem, removeArrayItem, setCandidato } = useCandidatoContext();
    const [abertos, setAbertos] = useState([]);
    const [grausParentesco, setGrausParentesco] = useState([]);

    // Inicializar abertos quando dependentes mudar
    useEffect(() => {
        if (Array.isArray(candidato.dependentes) && candidato.dependentes.length > 0) {
            setAbertos([candidato.dependentes.length - 1]);
        } else {
            setAbertos([]);
        }
    }, [candidato.dependentes]);

    // Carregar graus de parentesco da API
    useEffect(() => {
        const carregarGrausParentesco = async () => {
            try {
                const response = await http.get('tabela_dominio/grau_parentesco/');
                console.log('Resposta da API grau_parentesco:', response);
                
                // Verifica se a resposta tem a estrutura esperada
                if (response && response.registros && Array.isArray(response.registros)) {
                    console.log('Usando response.registros:', response.registros);
                    setGrausParentesco(response.registros);
                } else if (Array.isArray(response)) {
                    console.log('Usando response direto:', response);
                    setGrausParentesco(response);
                } else {
                    console.error('Estrutura de dados inesperada:', response);
                    setGrausParentesco([]);
                }
            } catch (error) {
                console.error('Erro ao carregar graus de parentesco:', error);
                setGrausParentesco([]);
            }
        };

        carregarGrausParentesco();
    }, []);

    const toggleAcordeon = (idx) => {
        const dependente = candidato.dependentes[idx];
        const isCompleto = dependente.nome &&
                          dependente.cpf &&
                          dependente.data_nascimento &&
                          dependente.grau_parentesco;

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

    const podeAdicionarDependente = () => {
        if (!Array.isArray(candidato.dependentes) || candidato.dependentes.length === 0) return true;
        const ultimoDependente = candidato.dependentes[candidato.dependentes.length - 1];
        return ultimoDependente.nome &&
               ultimoDependente.cpf &&
               ultimoDependente.data_nascimento &&
               ultimoDependente.grau_parentesco;
    };

    const adicionarDependente = () => {
        if (podeAdicionarDependente()) {
            // Fecha o item anterior
            const ultimoIndex = candidato.dependentes.length - 1;
            if (ultimoIndex >= 0) {
                setAbertos(prev => prev.filter(i => i !== ultimoIndex));
            }
            
            // Adiciona novo item e abre ele
            addArrayItem('dependentes', { 
                nome: '', 
                cpf: '', 
                data_nascimento: '', 
                grau_parentesco: ''
            });
            setAbertos([candidato.dependentes.length]); // Abre o novo item
        }
    };

    const ResumoDependente = ({ dep }) => (
        <div style={{ display: 'flex', gap: '8px', color: 'var(--text-color-secondary)' }}>
            <span><strong>{dep.nome}</strong></span>
            {dep.nome && dep.cpf && <span>•</span>}
            <span>{dep.cpf}</span>
            {dep.cpf && dep.grau_parentesco && <span>•</span>}
            <span>{dep.grau_parentesco}</span>
        </div>
    );

    return (
        <div data-tour="panel-step-dependentes" style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center'}}>
            {/* Itens de Dependentes */}
            {(Array.isArray(candidato.dependentes) ? candidato.dependentes : []).map((dep, idx) => (
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
                            <strong>Dependente {idx + 1}</strong>
                        ) : (
                            <ResumoDependente dep={dep} />
                        )}
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <BotaoSemBorda 
                                aoClicar={(e) => {
                                    e.stopPropagation();
                                    removeArrayItem('dependentes', idx);
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
                                name={`nome-${idx}`}
                                valor={dep.nome}
                                setValor={valor => updateArrayItem('dependentes', idx, { ...dep, nome: valor })}
                                label="Nome Completo"
                            />
                            <CampoTexto
                                name={`cpf-${idx}`}
                                valor={dep.cpf}
                                setValor={valor => updateArrayItem('dependentes', idx, { ...dep, cpf: valor })}
                                label="CPF"
                            />
                            <CampoTexto
                                name={`data_nascimento-${idx}`}
                                valor={dep.data_nascimento}
                                setValor={valor => updateArrayItem('dependentes', idx, { ...dep, data_nascimento: valor })}
                                label="Data de Nascimento"
                                type="date"
                            />
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ 
                                    display: 'block', 
                                    marginBottom: '8px', 
                                    fontWeight: '500', 
                                    color: 'var(--text-color)',
                                    fontSize: '14px'
                                }}>
                                    Grau de Parentesco
                                </label>
                                <Dropdown
                                    value={dep.grau_parentesco}
                                    options={Array.isArray(grausParentesco) ? grausParentesco : []}
                                    onChange={(e) => {
                                        updateArrayItem('dependentes', idx, { ...dep, grau_parentesco: e.value });
                                    }}
                                    placeholder="Selecione o grau de parentesco"
                                    optionLabel="descricao"
                                    optionValue="id"
                                    style={{ width: '100%' }}
                                    className="p-inputtext-sm"
                                />
                            </div>
                        </div>
                    )}
                </div>
            ))}
            <div style={{marginTop: '12px'}}>
                <BotaoSemBorda 
                    aoClicar={adicionarDependente} 
                    color={podeAdicionarDependente() ? 'var(--primaria)' : 'var(--surface-500)'}
                >
                    <GrAddCircle /> Adicionar Dependente
                </BotaoSemBorda>
            </div>
        </div>
    );
};

export default StepDependentes; 