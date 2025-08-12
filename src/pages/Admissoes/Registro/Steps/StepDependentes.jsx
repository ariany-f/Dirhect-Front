import React, { useState, useEffect, useMemo } from 'react';
import { useCandidatoContext } from '@contexts/Candidato';
import { FaTrash, FaChevronDown, FaChevronUp, FaSave } from 'react-icons/fa';
import { GrAddCircle } from 'react-icons/gr';
import { v4 as uuidv4 } from 'uuid';
import CampoTexto from '@components/CampoTexto';
import DropdownItens from '@components/DropdownItens';
import SwitchInput from '@components/SwitchInput';
import http from '@http';
import BotaoSemBorda from '@components/BotaoSemBorda';
import styled from 'styled-components';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useRef } from 'react';


const FormGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const SaveButton = styled.button`
    background: linear-gradient(135deg, var(--black), var(--gradient-secundaria));
    color: white;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    transition: all 0.2s ease;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(12, 0, 76, 0.2);
    }
    
    &:disabled {
        background: var(--surface-400);
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
`;

const StyledToast = styled(Toast)`
    .p-toast {
        z-index: 9999 !important;
    }
    
    .p-toast-message {
        z-index: 9999 !important;
    }
`;

const SectionTitle = styled.div`
    grid-column: 1 / -1;
    font-size: 18px;
    font-weight: 600;
    color: #374151;
    margin: 20px 0 10px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid #e2e8f0;
`;

const StepDependentes = ({ classError = [], modoLeitura = false }) => {
    const { candidato, setCandidato } = useCandidatoContext();
    const [grausParentesco, setGrausParentesco] = useState([]);
    const [generos, setGeneros] = useState([]);
    const [estadosCivis, setEstadosCivis] = useState([]);
    const [abertos, setAbertos] = useState(() => {
        if (!candidato.dependentes || candidato.dependentes.length === 0) {
            return [];
        }
        
        // Verifica se todos os dependentes estão salvos
        const todosSalvos = candidato.dependentes.every(dep => dep.id);
        
        // Se todos estão salvos, retorna array vazio (todos fechados)
        if (todosSalvos) {
            return [];
        }
        
        // Se há dependentes não salvos, abre o último
        return [candidato.dependentes.length - 1];
    });
    const [salvandoDependente, setSalvandoDependente] = useState(null);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [modalSalvamentoVisible, setModalSalvamentoVisible] = useState(false);
    const [modalRemocaoVisible, setModalRemocaoVisible] = useState(false);
    const toast = useRef(null);

    // Função para verificar se um campo está em erro
    const isCampoEmErro = useMemo(() => {
        return (campo) => {
            return classError.includes(campo);
        };
    }, [classError]);

    // Função para verificar se um campo é obrigatório baseado nas incidências ou grau de parentesco
    const isCampoObrigatorioPorIncidencia = (dependente, campo) => {
        const incidenciasQueRequeremCPF = dependente.incidencia_irrf || dependente.incidencia_assist_medica || dependente.incidencia_assist_odonto;
        const grauRequerCPF = dependente.grau_parentesco === '6' || dependente.grau_parentesco === '7' || 
                              dependente.grau_parentesco === 6 || dependente.grau_parentesco === 7;
        
        if (campo === 'cpf' || campo === 'dt_nascimento') {
            return incidenciasQueRequeremCPF || grauRequerCPF;
        }
        
        return false;
    };

    // Função para verificar se um campo está em erro por validação de incidência
    const isCampoEmErroPorIncidencia = (dependente, campo) => {
        if (!isCampoObrigatorioPorIncidencia(dependente, campo)) {
            return false;
        }
        
        if (campo === 'cpf' && !dependente.cpf) {
            return true;
        }
        
        if (campo === 'dt_nascimento' && !dependente.dt_nascimento) {
            return true;
        }
        
        return false;
    };

    useEffect(() => {
        // Carregar graus de parentesco
        http.get('tabela_dominio/grau_parentesco/')
            .then(response => {
                const formattedOptions = response.registros?.map(item => ({
                    code: item.id_origem,
                    name: item.descricao,
                    id_origem: item.id_origem
                })) || [];
                setGrausParentesco(formattedOptions);
            })
            .catch(error => {
                console.error("Erro ao buscar graus de parentesco:", error);
            });

        // Carregar gêneros
        http.get('tabela_dominio/genero/')
            .then(response => {
                const formattedOptions = response.registros?.map(item => ({
                    code: item.id_origem,
                    name: item.descricao,
                    id_origem: item.id_origem
                })) || [];
                setGeneros(formattedOptions);
            })
            .catch(error => {
                console.error("Erro ao buscar gêneros:", error);
            });

        // Carregar estados civis
        http.get('tabela_dominio/estado_civil/')
            .then(response => {
                const formattedOptions = response.registros?.map(item => ({
                    code: item.id_origem,
                    name: item.descricao,
                    id_origem: item.id_origem
                })) || [];
                setEstadosCivis(formattedOptions);
            })
            .catch(error => {
                console.error("Erro ao buscar estados civis:", error);
            });
    }, []);

    const toggleAcordeon = (idx) => {
        const dependente = candidato.dependentes[idx];
        
        // Se o dependente já foi salvo, pode ser fechado/aberto livremente
        if (dependente.id) {
            setAbertos(prev =>
                prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
            );
            return;
        }

        // Para dependentes novos, verificar se está completo
        const isCompleto = dependente.nome_depend && dependente.grau_parentesco && dependente.nrodepend;
        if (!isCompleto && abertos.includes(idx)) {
            return;
        }

        setAbertos(prev =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    };

    const podeAdicionarDependente = () => {
        if (!candidato.dependentes || candidato.dependentes.length === 0) return true;
        
        // Verifica se todos os dependentes foram salvos (têm ID)
        const dependentesNaoSalvos = candidato.dependentes.filter(dep => !dep.id);
        return dependentesNaoSalvos.length === 0;
    };

    const confirmarSalvarDependente = (dependente) => {
        // Previne múltiplos diálogos e cliques duplos
        if (modalSalvamentoVisible || salvandoDependente === dependente.temp_id) {
            return;
        }
        
        const parentescoNome = grausParentesco.find(g => g.code === dependente.grau_parentesco)?.name || 'Não informado';
        
        setModalSalvamentoVisible(true);
        confirmDialog({
            message: (
                <div>
                    <p>Confirma o cadastro do dependente com os seguintes dados?</p>
                    <div style={{ 
                        background: '#f8fafc', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '8px', 
                        padding: '12px', 
                        marginTop: '12px',
                        fontSize: '14px'
                    }}>
                        <div><strong>Nome:</strong> {dependente.nome_depend}</div>
                        <div><strong>Número:</strong> {dependente.nrodepend}</div>
                        <div><strong>Grau de Parentesco:</strong> {parentescoNome}</div>
                        {dependente.cpf && <div><strong>CPF:</strong> {dependente.cpf}</div>}
                        {dependente.dt_nascimento && <div><strong>Data de Nascimento:</strong> {dependente.dt_nascimento}</div>}
                    </div>
                </div>
            ),
            header: 'Confirmar Cadastro de Dependente',
            icon: 'pi pi-check-circle',
            accept: () => {
                setModalSalvamentoVisible(false);
                // Pequeno delay para garantir que o estado foi atualizado
                setTimeout(() => {
                    executarSalvarDependente(dependente);
                }, 100);
            },
            reject: () => {
                setModalSalvamentoVisible(false);
            },
            acceptLabel: 'Sim, cadastrar',
            rejectLabel: 'Cancelar',
            acceptClassName: 'p-button-success',
            rejectClassName: 'p-button-text'
        });
    };

    const executarSalvarDependente = async (dependente) => {
        if (!dependente.nome_depend || !dependente.grau_parentesco || !dependente.nrodepend) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Preencha todos os campos obrigatórios antes de salvar.',
                life: 3000
            });
            return;
        }

        // Verifica se alguma incidência que requer CPF e data de nascimento está marcada
        const incidenciasQueRequeremCPF = dependente.incidencia_irrf || dependente.incidencia_assist_medica || dependente.incidencia_assist_odonto;
        const grauRequerCPF = dependente.grau_parentesco === '6' || dependente.grau_parentesco === '7' || 
                              dependente.grau_parentesco === 6 || dependente.grau_parentesco === 7;
        
        if ((incidenciasQueRequeremCPF || grauRequerCPF) && (!dependente.cpf || !dependente.dt_nascimento)) {
            const motivo = grauRequerCPF ? 'o grau de parentesco é Pai ou Mãe' : 'há incidências de IRRF, Assistência Médica ou Assistência Odontológica';
            toast.current?.show({
                severity: 'warn',
                summary: 'Atenção',
                detail: `CPF e Data de Nascimento são obrigatórios quando ${motivo}.`,
                life: 4000
            });
            return;
        }

        // Verifica se já foi salvo ou está sendo salvo
        if (dependente.id || salvandoDependente === dependente.temp_id) {
            console.log('Dependente já salvo ou em processo de salvamento');
            return;
        }

        // Marca como salvando
        setSalvandoDependente(dependente.temp_id);

        try {
            const admissaoId = candidato.id || window.location.pathname.split('/').pop();
            const dependenteParaEnviar = {
                nome_depend: dependente.nome_depend,
                nrodepend: dependente.nrodepend,
                cpf: dependente.cpf ? dependente.cpf.replace(/\D/g, '') : null,
                dt_nascimento: dependente.dt_nascimento || null,
                cartorio: dependente.cartorio || null,
                nroregistro: dependente.nroregistro || null,
                nrolivro: dependente.nrolivro || null,
                nrofolha: dependente.nrofolha || null,
                cartao_vacina: dependente.cartao_vacina || false,
                nrosus: dependente.nrosus || null,
                nronascidovivo: dependente.nronascidovivo || null,
                nome_mae: dependente.nome_mae || null,
                grau_parentesco: dependente.grau_parentesco,
                genero: dependente.genero,
                estadocivil: dependente.estadocivil,
                incidencia_irrf: dependente.incidencia_irrf || false,
                incidencia_inss: dependente.incidencia_inss || false,
                incidencia_assist_medica: dependente.incidencia_assist_medica || false,
                incidencia_assist_odonto: dependente.incidencia_assist_odonto || false,
                incidencia_pensao: dependente.incidencia_pensao || false,
                incidencia_sal_familia: dependente.incidencia_sal_familia || false
            };

            console.log('Salvando dependente:', dependenteParaEnviar);

            const response = await http.post(`admissao/${admissaoId}/adiciona_dependentes/`, [dependenteParaEnviar]);
            
            if (response && response.length > 0) {
                const dependenteSalvo = response[0];
                
                // Atualiza o dependente no estado com o ID retornado pela API
                const novosDependentes = candidato.dependentes.map(dep => 
                    dep.temp_id === dependente.temp_id 
                        ? { ...dep, id: dependenteSalvo.id, ...dependenteSalvo }
                        : dep
                );
                
                setCandidato({ ...candidato, dependentes: novosDependentes });
                
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Dependente cadastrado com sucesso!',
                    life: 3000
                });
            }
        } catch (error) {
            console.error('Erro ao salvar dependente:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: error.response?.data?.message || 'Erro ao cadastrar dependente. Tente novamente.',
                life: 5000
            });
        } finally {
            // Sempre limpa o estado de salvamento
            setSalvandoDependente(null);
        }
    };

    const handleAdicionarDependente = () => {
        if (!podeAdicionarDependente()) return;

        // Calcula automaticamente o próximo número baseado no maior número existente
        const numerosExistentes = (candidato.dependentes || [])
            .map(dep => parseInt(dep.nrodepend) || 0)
            .filter(num => !isNaN(num));
        
        const maiorNumero = numerosExistentes.length > 0 ? Math.max(...numerosExistentes) : 0;
        const proximoNumero = maiorNumero + 1;

        // Determina grau de parentesco sugerido baseado nos dependentes existentes
        const grauSugerido = determinarGrauParentescoSugerido();

        const novoDependente = {
            temp_id: uuidv4(),
            nome_depend: '',
            cpf: '',
            dt_nascimento: '',
            grau_parentesco: grauSugerido,
            nrodepend: proximoNumero.toString(),
            nome_mae: '',
            cartorio: '',
            nroregistro: '',
            nrolivro: '',
            nrofolha: '',
            cartao_vacina: false,
            nrosus: '',
            nronascidovivo: '',
            genero: '',
            estadocivil: '',
            incidencia_irrf: false,
            incidencia_inss: false,
            incidencia_assist_medica: false,
            incidencia_assist_odonto: false,
            incidencia_pensao: false,
            incidencia_sal_familia: false
        };
        const novosDependentes = [...(candidato.dependentes || []), novoDependente];
        const novoIndex = novosDependentes.length - 1;

        setAbertos([novoIndex]);
        setCandidato({ ...candidato, dependentes: novosDependentes });
    };

    const determinarGrauParentescoSugerido = () => {
        const dependentesExistentes = candidato.dependentes || [];
        const grausExistentes = dependentesExistentes.map(dep => dep.grau_parentesco).filter(Boolean);
        
        // Se não há dependentes, não sugere nada
        if (grausExistentes.length === 0) {
            return '';
        }

        // Mapear códigos para nomes para análise
        const grausExistentesNomes = grausExistentes.map(codigo => {
            const grau = grausParentesco.find(g => g.code === codigo);
            return grau ? grau.name.toLowerCase() : '';
        }).filter(Boolean);

        // Lógica de sugestão baseada em padrões comuns
        const temConjuge = grausExistentesNomes.some(nome => 
            nome.includes('cônjuge') || nome.includes('esposa') || nome.includes('esposo') || nome.includes('companheiro')
        );
        
        const temFilho = grausExistentesNomes.some(nome => 
            nome.includes('filho') || nome.includes('filha')
        );

        // Se já tem cônjuge e está adicionando outro dependente, provavelmente é filho
        if (temConjuge && !temFilho) {
            const grauFilho = grausParentesco.find(g => 
                g.name.toLowerCase().includes('filho')
            );
            if (grauFilho) {
                return grauFilho.code;
            }
        }

        // Se já tem filhos, provavelmente é outro filho
        if (temFilho) {
            const grauFilho = grausParentesco.find(g => 
                g.name.toLowerCase().includes('filho')
            );
            if (grauFilho) {
                return grauFilho.code;
            }
        }

        // Se só tem um dependente, pega o mesmo grau (útil para múltiplos filhos)
        if (grausExistentes.length === 1) {
            return grausExistentes[0];
        }

        return '';
    };

    const getGrausParentescoDisponiveis = (dependenteAtual) => {
        const dependentesExistentes = (candidato.dependentes || []).filter(dep => 
            (dep.id || dep.temp_id) !== (dependenteAtual.id || dependenteAtual.temp_id)
        );
        
        const grausJaUsados = dependentesExistentes.map(dep => dep.grau_parentesco).filter(Boolean);
        
        // Filtrar graus que são únicos (como cônjuge)
        return grausParentesco.filter(grau => {
            const nomeGrau = grau.name.toLowerCase();
            
            // Graus que podem ser únicos
            const grausUnicos = ['cônjuge', 'esposa', 'esposo', 'companheiro', 'companheira', 'pai', 'mãe'];
            const isGrauUnico = grausUnicos.some(unico => nomeGrau.includes(unico));
            
            // Se é um grau único e já foi usado, não disponibilizar
            if (isGrauUnico && grausJaUsados.includes(grau.code)) {
                return false;
            }
            
            return true;
        });
    };

    const confirmarRemocaoDependente = (dependente) => {
        if (modalRemocaoVisible) return; // Previne múltiplos diálogos
        
        if (dependente.id) {
            // Dependente já salvo - mostrar confirmação
            setModalRemocaoVisible(true);
            confirmDialog({
                message: `Tem certeza que deseja remover o dependente "${dependente.nome_depend || 'Sem nome'}"? Esta ação não pode ser desfeita.`,
                header: 'Confirmar Remoção',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    executarRemocaoDependente(dependente);
                    setModalRemocaoVisible(false);
                },
                reject: () => {
                    setModalRemocaoVisible(false);
                },
                acceptLabel: 'Sim, remover',
                rejectLabel: 'Cancelar',
                acceptClassName: 'p-button-danger',
                rejectClassName: 'p-button-text'
            });
        } else {
            // Dependente novo - remover diretamente
            executarRemocaoDependente(dependente);
        }
    };

    const executarRemocaoDependente = async (dependente) => {
        try {
            if (dependente.id) {
                // Dependente já salvo - chama API para remover
                const admissaoId = candidato.id || window.location.pathname.split('/').pop();
                await http.post(`admissao/${admissaoId}/remover_dependentes/`, {
                    dependentes_ids: [dependente.id]
                });
                
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Dependente removido com sucesso!',
                    life: 3000
                });
            }
            
            // Remove do estado local
            const novosDependentes = candidato.dependentes.filter(dep => 
                (dep.id || dep.temp_id) !== (dependente.id || dependente.temp_id)
            );
            setCandidato({ ...candidato, dependentes: novosDependentes });
            
        } catch (error) {
            console.error("Erro ao remover dependente:", error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao remover dependente. Tente novamente.',
                life: 5000
            });
        }
    };

    const handleUpdateDependente = (id, campo, valor) => {
        const novosDependentes = candidato.dependentes.map(dep => {
            if ((dep.id || dep.temp_id) === id) {
                return { ...dep, [campo]: valor };
            }
            return dep;
        });
        setCandidato({ ...candidato, dependentes: novosDependentes });
    };

    const podeSalvarDependente = (dependente) => {
        const camposObrigatorios = dependente.nome_depend && dependente.grau_parentesco && dependente.nrodepend;
        
        if (!camposObrigatorios || dependente.id) {
            return false;
        }

        // Verifica se alguma incidência que requer CPF e data de nascimento está marcada
        const incidenciasQueRequeremCPF = dependente.incidencia_irrf || dependente.incidencia_assist_medica || dependente.incidencia_assist_odonto;
        const grauRequerCPF = dependente.grau_parentesco === '6' || dependente.grau_parentesco === '7' || 
                              dependente.grau_parentesco === 6 || dependente.grau_parentesco === 7;
        
        if (incidenciasQueRequeremCPF || grauRequerCPF) {
            return dependente.cpf && dependente.dt_nascimento;
        }

        return true;
    };

    const ResumoDependente = ({ dep }) => {
        const parentesco = grausParentesco.find(g => g.code === dep.grau_parentesco)?.name;
        return (
            <div style={{ display: 'flex', gap: '8px', color: 'var(--text-color-secondary)' }}>
                <span><strong>{dep.nome_depend || 'Novo Dependente'}</strong></span>
                {dep.nome_depend && parentesco && <span>•</span>}
                <span>{parentesco}</span>
            </div>
        );
    };

    return (
        <>
            <StyledToast ref={toast} />
            <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', paddingTop: '10px'}}>
                {(candidato.dependentes || []).map((dependente, idx) => {
                    const id = dependente.id || dependente.temp_id;
                    const isOpen = abertos.includes(idx);
                    const isSaved = !!dependente.id;
                    const isSaving = salvandoDependente === dependente.temp_id;
                    
                    return (
                        <div key={id} style={{ 
                            border: '1px solid #eee', 
                            borderRadius: 8, 
                            marginBottom: 12, 
                            padding: '24px 12px',
                            width: '100%',
                            backgroundColor: isSaved ? '#f8f9fa' : 'white'
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                marginBottom: isOpen ? '12px' : '0',
                                cursor: 'pointer'
                            }} onClick={() => toggleAcordeon(idx)}>
                                {isOpen ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <strong>{dependente.nome_depend || `Dependente ${idx + 1}`}</strong>
                                        <p>{dependente.nrodepend}</p>
                                        {isSaving && <span style={{ color: '#6b7280', fontSize: '12px' }}>(Salvando...)</span>}
                                        {isSaved && <span style={{ color: '#059669', fontSize: '12px' }}>✓ Salvo</span>}
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <ResumoDependente dep={dependente} />
                                        {isSaved && <span style={{ color: '#059669', fontSize: '12px' }}>✓</span>}
                                    </div>
                                )}
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    {!modoLeitura && (
                                        <BotaoSemBorda

                                            aoClicar={(e) => {
                                                e.stopPropagation();
                                                confirmarRemocaoDependente(dependente);
                                            }}
                                            color="var(--error-500)"
                                        >
                                            Remover
                                        </BotaoSemBorda>
                                    )}
                                    {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                                </div>
                            </div>
                            
                            {isOpen && (
                                <div style={{paddingTop: '16px'}}>
                                    <FormGrid>

                                        <SectionTitle>Identificação</SectionTitle>

                                        <CampoTexto
                                            camposVazios={isCampoEmErro(`nome_depend_${idx}`) ? [`nome_depend_${idx}`] : []}
                                            label="Nome Completo"
                                            required={true}
                                            valor={dependente.nome_depend}
                                            setValor={(valor) => handleUpdateDependente(id, 'nome_depend', valor)}
                                            disabled={modoLeitura || isSaved}
                                        />
                                        <DropdownItens
                                            camposVazios={isCampoEmErro(`grau_parentesco_${idx}`) ? [`grau_parentesco_${idx}`] : []}
                                            label="Grau de Parentesco"
                                            required={true}
                                            valor={(() => {
                                                // Para dependentes salvos, sempre busca na lista completa
                                                if (dependente.id) {
                                                    const valorEncontrado = grausParentesco.find(g => {
                                                        // Tenta buscar por code (number) e id_origem (string)
                                                        return g.code == dependente.grau_parentesco || g.id_origem == dependente.grau_parentesco;
                                                    });
                                                    return valorEncontrado || '';
                                                }
                                                // Para dependentes novos, busca na lista filtrada
                                                const opcoesDisponiveis = getGrausParentescoDisponiveis(dependente);
                                                const valorEncontrado = opcoesDisponiveis.find(g => {
                                                    return g.code == dependente.grau_parentesco || g.id_origem == dependente.grau_parentesco;
                                                });
                                                return valorEncontrado || '';
                                            })()}
                                            setValor={(valor) => handleUpdateDependente(id, 'grau_parentesco', valor.code)}
                                            options={dependente.id ? grausParentesco : getGrausParentescoDisponiveis(dependente)}
                                            $margin="0px"
                                            disabled={modoLeitura || isSaved}
                                        />
                                    </FormGrid>
                                    <div style={{marginTop: '4px', width: '100%', marginBottom: '32px'}}>
                                        <h4 style={sectionTitleStyle}>Incidências</h4>
                                        <FormGrid>
                                            <div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0'}}>
                                                <SwitchInput
                                                    checked={dependente.incidencia_irrf}
                                                    onChange={(checked) => handleUpdateDependente(id, 'incidencia_irrf', checked)}
                                                />
                                                <span style={{fontSize: '14px', color: '#374151'}}>Incidência IRRF</span>
                                            </div>
                                            <div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0'}}>
                                                <SwitchInput
                                                    checked={dependente.incidencia_assist_medica}
                                                    onChange={(checked) => handleUpdateDependente(id, 'incidencia_assist_medica', checked)}
                                                />
                                                <span style={{fontSize: '14px', color: '#374151'}}>Incidência Assistência Médica</span>
                                            </div>
                                            <div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0'}}>
                                                <SwitchInput
                                                    checked={dependente.incidencia_inss}
                                                    onChange={(checked) => handleUpdateDependente(id, 'incidencia_inss', checked)}
                                                />
                                                <span style={{fontSize: '14px', color: '#374151'}}>Incidência INSS</span>
                                            </div>
                                            <div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0'}}>
                                                <SwitchInput
                                                    checked={dependente.incidencia_assist_odonto}
                                                    onChange={(checked) => handleUpdateDependente(id, 'incidencia_assist_odonto', checked)}
                                                />
                                                <span style={{fontSize: '14px', color: '#374151'}}>Incidência Assistência Odontológica</span>
                                            </div>
                                            <div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0'}}>
                                                <SwitchInput
                                                    checked={dependente.incidencia_sal_familia}
                                                    onChange={(checked) => handleUpdateDependente(id, 'incidencia_sal_familia', checked)}
                                                />
                                                <span style={{fontSize: '14px', color: '#374151'}}>Incidência Salário Família</span>
                                            </div>
                                            <div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0'}}>
                                                <SwitchInput
                                                    checked={dependente.incidencia_pensao}
                                                    onChange={(checked) => handleUpdateDependente(id, 'incidencia_pensao', checked)}
                                                />
                                                <span style={{fontSize: '14px', color: '#374151'}}>Incidência Pensão</span>
                                            </div>
                                        </FormGrid>
                                    </div>
                                    <FormGrid>
                                        <CampoTexto
                                            camposVazios={isCampoEmErro(`cpf_${idx}`) || isCampoEmErroPorIncidencia(dependente, 'cpf') ? [`cpf_${idx}`] : []}
                                            label="CPF"
                                            required={dependente.incidencia_irrf || dependente.incidencia_assist_medica || dependente.incidencia_assist_odonto || dependente.grau_parentesco === '6' || dependente.grau_parentesco === '7' || dependente.grau_parentesco === 6 || dependente.grau_parentesco === 7}
                                            valor={dependente.cpf}
                                            setValor={(valor) => handleUpdateDependente(id, 'cpf', valor)}
                                            patternMask="999.999.999-99"
                                            disabled={modoLeitura || isSaved}
                                        />
                                        <CampoTexto
                                            camposVazios={isCampoEmErro(`dt_nascimento_${idx}`) || isCampoEmErroPorIncidencia(dependente, 'dt_nascimento') ? [`dt_nascimento_${idx}`] : []}
                                            label="Data de Nascimento"
                                            required={dependente.incidencia_irrf || dependente.incidencia_assist_medica || dependente.incidencia_assist_odonto || dependente.grau_parentesco === '6' || dependente.grau_parentesco === '7' || dependente.grau_parentesco === 6 || dependente.grau_parentesco === 7}
                                            valor={dependente.dt_nascimento}
                                            setValor={(valor) => handleUpdateDependente(id, 'dt_nascimento', valor)}
                                            type="date"
                                            disabled={modoLeitura || isSaved}
                                        />
                                        <DropdownItens
                                            label="Gênero"
                                            valor={(() => {
                                                const valorEncontrado = generos.find(g => {
                                                    return g.code == dependente.genero || g.id_origem == dependente.genero;
                                                });
                                                return valorEncontrado || '';
                                            })()}
                                            required={true}
                                            setValor={(valor) => handleUpdateDependente(id, 'genero', valor.code)}
                                            options={generos}
                                            placeholder="Selecione o gênero"
                                            disabled={modoLeitura || isSaved}
                                            filter
                                        />
                                        <DropdownItens
                                            label="Estado Civil"
                                            required={true}
                                            valor={(() => {
                                                const valorEncontrado = estadosCivis.find(g => {
                                                    return g.code == dependente.estadocivil || g.id_origem == dependente.estadocivil;
                                                });
                                                return valorEncontrado || '';
                                            })()}
                                            setValor={(valor) => handleUpdateDependente(id, 'estadocivil', valor.code)}
                                            options={estadosCivis}
                                            placeholder="Selecione o estado civil"
                                            disabled={modoLeitura || isSaved}
                                            filter
                                        />
                                    </FormGrid>
                                    
                                    <div style={{marginTop: '24px'}}>

                                        <SectionTitle>Dados Adicionais</SectionTitle>
                                        <FormGrid>
                                            <CampoTexto label="Nome da Mãe" valor={dependente.nome_mae} setValor={v => handleUpdateDependente(id, 'nome_mae', v)} disabled={modoLeitura || isSaved} />
                                            <CampoTexto label="Cartório" valor={dependente.cartorio} setValor={v => handleUpdateDependente(id, 'cartorio', v)} disabled={modoLeitura || isSaved} />
                                            <CampoTexto label="Número do Registro" valor={dependente.nroregistro} setValor={v => handleUpdateDependente(id, 'nroregistro', v)} disabled={modoLeitura || isSaved} />
                                            <CampoTexto label="Número do Livro" valor={dependente.nrolivro} setValor={v => handleUpdateDependente(id, 'nrolivro', v)} disabled={modoLeitura || isSaved} />
                                            <CampoTexto label="Número da Folha" valor={dependente.nrofolha} setValor={v => handleUpdateDependente(id, 'nrofolha', v)} disabled={modoLeitura || isSaved} />
                                            <div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0'}}>
                                                <SwitchInput
                                                    checked={dependente.cartao_vacina}
                                                    onChange={(checked) => handleUpdateDependente(id, 'cartao_vacina', checked)}
                                                />
                                                <span style={{fontSize: '14px', color: '#374151'}}>Cartão de Vacina</span>
                                            </div>
                                            <CampoTexto label="Número SUS" valor={dependente.nrosus} setValor={v => handleUpdateDependente(id, 'nrosus', v)} disabled={modoLeitura || isSaved} />
                                            <CampoTexto label="Número Nascido Vivo" valor={dependente.nronascidovivo} setValor={v => handleUpdateDependente(id, 'nronascidovivo', v)} disabled={modoLeitura || isSaved} />
                                        </FormGrid>
                                    </div>
                                    
                                    {!modoLeitura && !isSaved && (
                                        <SaveButton
                                            onClick={() => confirmarSalvarDependente(dependente)}
                                            disabled={!podeSalvarDependente(dependente) || isSaving}
                                        >
                                            <FaSave fill="var(--white)" />
                                            {isSaving ? 'Salvando...' : 'Salvar Dependente'}
                                        </SaveButton>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
                {!modoLeitura && (
                    <div style={{marginTop: '12px'}}>
                        <BotaoSemBorda 
                            aoClicar={handleAdicionarDependente} 
                            color={podeAdicionarDependente() ? 'var(--primaria)' : 'var(--surface-500)'}
                        >
                            <GrAddCircle /> Adicionar Dependente
                        </BotaoSemBorda>
                    </div>
                )}
            </div>
        </>
    );
};

const sectionTitleStyle = {
    fontSize: '16px', 
    fontWeight: '600', 
    color: '#4b5563', 
    paddingBottom: '12px',
    marginBottom: '16px',
    borderBottom: '1px solid #f1f5f9'
};

export default StepDependentes; 