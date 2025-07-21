import React, { useState, useEffect } from 'react';
import { useCandidatoContext } from '@contexts/Candidato';
import CampoTexto from '@components/CampoTexto';
import BotaoSemBorda from '@components/BotaoSemBorda';
import { GrAddCircle } from 'react-icons/gr';
import { FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Dropdown } from 'primereact/dropdown';
import http from '@http';
import styled from 'styled-components';

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px 24px;
    width: 100%;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 12px 0;
    }
`;

const SectionTitle = styled.div`
    grid-column: 1 / -1;
    font-size: 16px;
    font-weight: 600;
    color: #374151;
    margin: 16px 0 8px 0;
    padding-bottom: 6px;
    border-bottom: 1px solid #e2e8f0;
`;

const DependenteContainer = styled.div`
    border: 1px solid #eee;
    border-radius: 8px;
    margin-bottom: 12px;
    padding: 16px;
    width: 100%;
    background: #fafafa;
`;

const DependenteHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    transition: background-color 0.2s;
    
    &:hover {
        background-color: #f0f0f0;
    }
`;

const DependenteContent = styled.div`
    padding: 12px;
    background: white;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
`;

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

    // Mapear dados dos dependentes da API para o formato do frontend
    useEffect(() => {
        if (Array.isArray(candidato.dependentes) && candidato.dependentes.length > 0) {
            // Verifica se os dados já estão no formato correto (se tem campo 'nome')
            const primeiroDependente = candidato.dependentes[0];
            if (primeiroDependente && primeiroDependente.nome_depend && !primeiroDependente.nome) {
                // Mapeia os dados da API para o formato do frontend
                const dependentesMapeados = candidato.dependentes.map(dep => ({
                    id: dep.id, // Preserva o ID da API
                    nome: dep.nome_depend || '',
                    cpf: dep.cpf || '',
                    data_nascimento: dep.dtnascimento || '',
                    grau_parentesco: dep.grau_parentesco || '',
                    cartorio: dep.cartorio || '',
                    nroregistro: dep.nroregistro || '',
                    nrolivro: dep.nrolivro || '',
                    nrofolha: dep.nrofolha || '',
                    cartao_vacina: dep.cartao_vacina || '',
                    nrosus: dep.nrosus || '',
                    nronascidovivo: dep.nronascidovivo || '',
                    nome_mae: dep.nome_mae || '',
                    genero: dep.genero || null,
                    estadocivil: dep.estadocivil || null
                }));

                // Atualiza o estado com os dados mapeados
                setCandidato(prev => ({
                    ...prev,
                    dependentes: dependentesMapeados
                }));
            }
        }
    }, [candidato.dependentes, setCandidato]);

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

    // Função para salvar dependentes no endpoint específico
    const salvarDependentes = async () => {
        if (!candidato.id || !Array.isArray(candidato.dependentes) || candidato.dependentes.length === 0) {
            return;
        }

        try {
            // Mapeia os dependentes para o formato da API
            const dependentesParaEnviar = candidato.dependentes.map((dep, index) => ({
                nrodepend: index + 1,
                nome_depend: dep.nome || '',
                cpf: dep.cpf ? dep.cpf.replace(/\D/g, '') : null, // Remove formatação do CPF
                dtnascimento: dep.data_nascimento || null,
                cartorio: dep.cartorio || null,
                nroregistro: dep.nroregistro || null,
                nrolivro: dep.nrolivro || null,
                nrofolha: dep.nrofolha || null,
                cartao_vacina: dep.cartao_vacina || null,
                nrosus: dep.nrosus || null,
                nronascidovivo: dep.nronascidovivo || null,
                nome_mae: dep.nome_mae || null,
                id_admissao: candidato.id,
                genero: dep.genero || null,
                estadocivil: dep.estadocivil || null,
                grau_parentesco: dep.grau_parentesco || null
            }));

            console.log('Enviando dependentes:', dependentesParaEnviar);

            const response = await http.post(`admissao/${candidato.id}/adiciona_dependentes/`, dependentesParaEnviar);
            
            console.log('Dependentes salvos com sucesso:', response);
            
            // Atualiza o estado local com os dados retornados da API
            if (response && Array.isArray(response)) {
                setCandidato(prev => ({
                    ...prev,
                    dependentes: response
                }));
            }

        } catch (error) {
            console.error('Erro ao salvar dependentes:', error);
            throw error;
        }
    };

    const toggleAcordeon = (idx) => {
        const dependente = candidato.dependentes[idx];
        const isCompleto = dependente.nome && dependente.data_nascimento;

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
        return ultimoDependente.nome && ultimoDependente.data_nascimento;
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
                grau_parentesco: '',
                cartorio: '',
                nroregistro: '',
                nrolivro: '',
                nrofolha: '',
                cartao_vacina: '',
                nrosus: '',
                nronascidovivo: '',
                nome_mae: '',
                genero: null,
                estadocivil: null
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
                <DependenteContainer key={idx}>
                    <DependenteHeader onClick={() => toggleAcordeon(idx)}>
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
                    </DependenteHeader>
                    
                    {abertos.includes(idx) && (
                        <DependenteContent>
                            <SectionTitle>Dados Básicos</SectionTitle>
                            <GridContainer>
                                <CampoTexto
                                    name={`nome-${idx}`}
                                    valor={dep.nome}
                                    setValor={valor => updateArrayItem('dependentes', idx, { ...dep, nome: valor })}
                                    label="Nome Completo *"
                                />
                                <CampoTexto
                                    name={`cpf-${idx}`}
                                    valor={dep.cpf}
                                    setValor={valor => updateArrayItem('dependentes', idx, { ...dep, cpf: valor })}
                                    label="CPF"
                                    patternMask="999.999.999-99"
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
                                        Grau de Parentesco *
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
                            </GridContainer>
                            
                            <SectionTitle>Dados Adicionais</SectionTitle>
                            <GridContainer>
                                <CampoTexto
                                    name={`nome_mae-${idx}`}
                                    valor={dep.nome_mae || ''}
                                    setValor={valor => updateArrayItem('dependentes', idx, { ...dep, nome_mae: valor })}
                                    label="Nome da Mãe"
                                />
                                <CampoTexto
                                    name={`cartorio-${idx}`}
                                    valor={dep.cartorio || ''}
                                    setValor={valor => updateArrayItem('dependentes', idx, { ...dep, cartorio: valor })}
                                    label="Cartório"
                                />
                                <CampoTexto
                                    name={`nroregistro-${idx}`}
                                    valor={dep.nroregistro || ''}
                                    setValor={valor => updateArrayItem('dependentes', idx, { ...dep, nroregistro: valor })}
                                    label="Número do Registro"
                                />
                                <CampoTexto
                                    name={`nrolivro-${idx}`}
                                    valor={dep.nrolivro || ''}
                                    setValor={valor => updateArrayItem('dependentes', idx, { ...dep, nrolivro: valor })}
                                    label="Livro"
                                />
                                <CampoTexto
                                    name={`nrofolha-${idx}`}
                                    valor={dep.nrofolha || ''}
                                    setValor={valor => updateArrayItem('dependentes', idx, { ...dep, nrofolha: valor })}
                                    label="Folha"
                                />
                                <CampoTexto
                                    name={`cartao_vacina-${idx}`}
                                    valor={dep.cartao_vacina || ''}
                                    setValor={valor => updateArrayItem('dependentes', idx, { ...dep, cartao_vacina: valor })}
                                    label="Cartão de Vacina"
                                />
                                <CampoTexto
                                    name={`nrosus-${idx}`}
                                    valor={dep.nrosus || ''}
                                    setValor={valor => updateArrayItem('dependentes', idx, { ...dep, nrosus: valor })}
                                    label="Número SUS"
                                />
                                <CampoTexto
                                    name={`nronascidovivo-${idx}`}
                                    valor={dep.nronascidovivo || ''}
                                    setValor={valor => updateArrayItem('dependentes', idx, { ...dep, nronascidovivo: valor })}
                                    label="Número Nascido Vivo"
                                />
                            </GridContainer>
                        </DependenteContent>
                    )}
                </DependenteContainer>
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