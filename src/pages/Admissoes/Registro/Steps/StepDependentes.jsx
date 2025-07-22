import React, { useState, useEffect, useRef } from 'react';
import { useCandidatoContext } from '@contexts/Candidato';
import CampoTexto from '@components/CampoTexto';
import BotaoSemBorda from '@components/BotaoSemBorda';
import { GrAddCircle } from 'react-icons/gr';
import { FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
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
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

// Estilos customizados para o ConfirmDialog
const CustomConfirmDialog = styled.div`
    .p-confirm-dialog {
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        border: none;
        overflow: hidden;
    }
    
    .p-confirm-dialog-header {
        background: linear-gradient(135deg, #dc2626, #b91c1c);
        color: white;
        padding: 20px 24px;
        border-bottom: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .p-confirm-dialog-header-icon {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
    }
    
    .p-confirm-dialog-header-icon i {
        color: white;
        font-size: 18px;
    }
    
    .p-confirm-dialog-title {
        font-size: 18px;
        font-weight: 600;
        color: white;
        margin: 0;
    }
    
    .p-confirm-dialog-content {
        padding: 24px;
        background: white;
    }
    
    .p-confirm-dialog-message {
        font-size: 16px;
        line-height: 1.6;
        color: #374151;
        margin: 0;
        display: flex;
        align-items: flex-start;
        gap: 16px;
    }
    
    .p-confirm-dialog-message-icon {
        background: linear-gradient(135deg, #fef3c7, #fde68a);
        border-radius: 50%;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-top: 2px;
    }
    
    .p-confirm-dialog-message-icon i {
        color: #d97706;
        font-size: 20px;
    }
    
    .p-confirm-dialog-footer {
        padding: 20px 24px;
        background: #f9fafb;
        border-top: 1px solid #e5e7eb;
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        align-items: center;
    }
    
    .p-confirm-dialog-footer .p-button {
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 120px;
        justify-content: center;
    }
    
    .p-confirm-dialog-footer .p-button.p-button-secondary {
        background: #f3f4f6;
        color: #6b7280;
        border: 1px solid #d1d5db;
    }
    
    .p-confirm-dialog-footer .p-button.p-button-secondary:hover {
        background: #e5e7eb;
        color: #374151;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .p-confirm-dialog-footer .p-button.p-button-danger {
        background: linear-gradient(135deg, #dc2626, #b91c1c);
        color: white;
        box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    }
    
    .p-confirm-dialog-footer .p-button.p-button-danger:hover {
        background: linear-gradient(135deg, #b91c1c, #991b1b);
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4);
    }
    
    .p-confirm-dialog-footer .p-button:active {
        transform: translateY(0);
    }
    
    .p-confirm-dialog-footer .p-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
    }
    
    /* Força as cores corretas para os botões */
    .p-confirm-dialog-footer .p-button.p-button-danger {
        background: linear-gradient(135deg, #dc2626, #b91c1c) !important;
        color: white !important;
        border: none !important;
    }
    
    .p-confirm-dialog-footer .p-button.p-button-danger:hover {
        background: linear-gradient(135deg, #b91c1c, #991b1b) !important;
        color: white !important;
    }
    
    .p-confirm-dialog-footer .p-button.p-button-secondary {
        background: #f3f4f6 !important;
        color: #6b7280 !important;
        border: 1px solid #d1d5db !important;
    }
    
    .p-confirm-dialog-footer .p-button.p-button-secondary:hover {
        background: #e5e7eb !important;
        color: #374151 !important;
    }
`;

const StepDependentes = () => {
    const { candidato, addArrayItem, updateArrayItem, removeArrayItem, setCandidato } = useCandidatoContext();
    const [abertos, setAbertos] = useState([]);
    const [grausParentesco, setGrausParentesco] = useState([]);
    const [mapeamentoFeito, setMapeamentoFeito] = useState(false);
    const [removendoDependente, setRemovendoDependente] = useState(null);
    const toast = useRef(null);

    // Inicializar abertos quando dependentes mudar
    useEffect(() => {
        if (Array.isArray(candidato.dependentes) && candidato.dependentes.length > 0) {
            setAbertos([candidato.dependentes.length - 1]);
        } else {
            setAbertos([]);
        }
        
        // Resetar flag de mapeamento quando dependentes mudarem
        setMapeamentoFeito(false);
    }, [candidato.dependentes]);

    // Mapear dados dos dependentes da API para o formato do frontend
    useEffect(() => {
        if (!mapeamentoFeito && Array.isArray(candidato.dependentes) && candidato.dependentes.length > 0) {
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

                // Remove dependentes duplicados baseado no CPF
                const dependentesUnicos = dependentesMapeados.filter((dep, index, arr) => {
                    if (!dep.cpf) return true;
                    
                    const cpfLimpo = dep.cpf.replace(/\D/g, '');
                    const primeiroIndex = arr.findIndex(d => 
                        d.cpf && d.cpf.replace(/\D/g, '') === cpfLimpo
                    );
                    
                    return index === primeiroIndex;
                });

                // Se houve remoção de duplicatas, mostra aviso
                if (dependentesUnicos.length < dependentesMapeados.length) {
                    console.warn(`Removidos ${dependentesMapeados.length - dependentesUnicos.length} dependentes duplicados`);
                }

                // Atualiza o estado com os dados mapeados e sem duplicatas
                setCandidato(prev => ({
                    ...prev,
                    dependentes: dependentesUnicos
                }));
                
                // Marca que o mapeamento foi feito
                setMapeamentoFeito(true);
            }
        }
    }, [candidato.dependentes, mapeamentoFeito]); // Adicionado mapeamentoFeito para controlar execução

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

    // Função para remover dependente
    const removerDependente = async (idx) => {
        const dependente = candidato.dependentes[idx];
        
        // Usa ConfirmDialog do PrimeReact
        confirmDialog({
            message: (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <i className="pi pi-exclamation-triangle" style={{ color: '#d97706', fontSize: '20px' }}></i>
                    </div>
                    <div>
                        <p style={{ margin: '0 0 8px 0', fontSize: '16px', lineHeight: '1.6', color: '#374151' }}>
                            Tem certeza que deseja remover o dependente <strong>"{dependente.nome || 'Dependente'}"</strong>?
                        </p>
                        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                            Esta ação não pode ser desfeita e removerá permanentemente os dados do dependente.
                        </p>
                    </div>
                </div>
            ),
            header: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <i className="pi pi-trash" style={{ color: 'white', fontSize: '18px' }}></i>
                    </div>
                    <span>Confirmar Remoção</span>
                </div>
            ),
            icon: null, // Removemos o ícone padrão pois já temos o customizado
            acceptLabel: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="pi pi-trash" style={{ fontSize: '14px' }}></i>
                    Sim, remover
                </div>
            ),
            rejectLabel: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="pi pi-times" style={{ fontSize: '14px' }}></i>
                    Cancelar
                </div>
            ),
            acceptClassName: 'p-button-danger',
            rejectClassName: 'p-button-secondary',
            accept: async () => {
                // Define o estado de loading
                setRemovendoDependente(idx);
                
                try {
                    // Se o dependente tem ID (existe na API), chama o endpoint de remoção
                    if (dependente.id) {
                        await http.post(`admissao/${candidato.id}/remover_dependentes/`, {
                            dependentes_ids: [dependente.id]
                        });
                        console.log('Dependente removido com sucesso da API');
                        
                        // Feedback de sucesso
                        if (toast.current) {
                            toast.current.show({
                                severity: 'success',
                                summary: 'Dependente removido',
                                detail: `O dependente "${dependente.nome || 'Dependente'}" foi removido com sucesso.`,
                                life: 3000
                            });
                        }
                    }
                    
                    // Só remove do estado local se a remoção na API foi bem-sucedida
                    removeArrayItem('dependentes', idx);
                    
                    // Atualiza os índices dos abertos
                    setAbertos(prev => prev.filter(i => i !== idx).map(i => i > idx ? i - 1 : i));
                    
                } catch (error) {
                    console.error('Erro ao remover dependente:', error);
                    
                    // Feedback de erro
                    if (toast.current) {
                        toast.current.show({
                            severity: 'error',
                            summary: 'Erro ao remover',
                            detail: 'Não foi possível remover o dependente. Tente novamente.',
                            life: 4000
                        });
                    }
                    
                    // NÃO remove do estado local se houve erro na API
                } finally {
                    // Limpa o estado de loading
                    setRemovendoDependente(null);
                }
            },
            reject: () => {
                // Usuário cancelou a remoção
                console.log('Remoção cancelada pelo usuário');
            }
        });
    };

    // Função para remover múltiplos dependentes
    const removerMultiplosDependentes = async (ids) => {
        try {
            await http.post(`admissao/${candidato.id}/remover_dependentes/`, {
                dependentes_ids: ids
            });
            console.log('Dependentes removidos com sucesso da API');
            
            // Feedback de sucesso
            if (toast.current) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Dependentes removidos',
                    detail: `${ids.length} dependente(s) removido(s) com sucesso.`,
                    life: 3000
                });
            }
            
            return true;
        } catch (error) {
            console.error('Erro ao remover dependentes:', error);
            
            // Feedback de erro
            if (toast.current) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro ao remover',
                    detail: 'Não foi possível remover os dependentes. Tente novamente.',
                    life: 4000
                });
            }
            
            return false;
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
        
        // Verifica se o último dependente está completo
        const dependenteCompleto = ultimoDependente.nome && ultimoDependente.data_nascimento;
        
        // Verifica se há CPF duplicado no último dependente
        const cpfDuplicado = validarCPFDuplicado(ultimoDependente.cpf, candidato.dependentes.length - 1);
        
        return dependenteCompleto && !cpfDuplicado;
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

    // Função para validar se um CPF já existe
    const validarCPFDuplicado = (cpf, indexAtual) => {
        if (!cpf) return false;
        
        const cpfLimpo = cpf.replace(/\D/g, '');
        
        return candidato.dependentes.some((dep, index) => {
            if (index === indexAtual) return false; // Ignora o próprio item
            
            if (dep.cpf) {
                const cpfComparacao = dep.cpf.replace(/\D/g, '');
                return cpfComparacao === cpfLimpo;
            }
            
            return false;
        });
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
            <Toast ref={toast} style={{ zIndex: 9999 }} />
            <CustomConfirmDialog>
                <ConfirmDialog />
            </CustomConfirmDialog>
            
            {/* Itens de Dependentes */}
            {(Array.isArray(candidato.dependentes) ? candidato.dependentes : []).map((dep, idx) => (
                <DependenteContainer key={idx}>
                    <DependenteHeader onClick={() => toggleAcordeon(idx)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                            {dep.id && (
                                <i className="pi pi-lock" style={{ color: '#d97706', fontSize: '14px' }}></i>
                            )}
                            <span style={{ 
                                fontWeight: '500', 
                                color: dep.id ? '#6b7280' : '#374151',
                                textDecoration: dep.id ? 'none' : 'none'
                            }}>
                                {dep.nome || 'Dependente sem nome'}
                            </span>
                            {dep.id && (
                                <span style={{ 
                                    fontSize: '12px', 
                                    color: '#9ca3af', 
                                    fontStyle: 'italic' 
                                }}>
                                    (Salvo)
                                </span>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <BotaoSemBorda 
                                aoClicar={(e) => {
                                    e.stopPropagation();
                                    removerDependente(idx);
                                }}
                                color="var(--error-500)"
                                disabled={removendoDependente === idx}
                            >
                                {removendoDependente === idx ? (
                                    <div style={{ 
                                        width: '12px', 
                                        height: '12px', 
                                        border: '2px solid #fff', 
                                        borderTop: '2px solid transparent', 
                                        borderRadius: '50%', 
                                        animation: 'spin 1s linear infinite' 
                                    }} />
                                ) : (
                                    <FaTrash />
                                )}
                            </BotaoSemBorda>
                            <i 
                                className={`pi ${abertos.includes(idx) ? 'pi-chevron-down' : 'pi-chevron-right'}`}
                                style={{ 
                                    fontSize: '14px', 
                                    color: '#6b7280',
                                    transition: 'transform 0.2s ease'
                                }}
                            />
                        </div>
                    </DependenteHeader>
                    
                    {abertos.includes(idx) && (
                        <DependenteContent>
                            {dep.id && (
                                <div style={{
                                    background: '#fef3c7',
                                    border: '1px solid #fde68a',
                                    borderRadius: '6px',
                                    padding: '8px 12px',
                                    marginBottom: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <i className="pi pi-lock" style={{ color: '#d97706', fontSize: '14px' }}></i>
                                    <span style={{ fontSize: '14px', color: '#92400e', fontWeight: '500' }}>
                                        Este dependente já foi salvo e não pode ser editado. Para fazer alterações, exclua e adicione um novo.
                                    </span>
                                </div>
                            )}
                            <SectionTitle>Dados Básicos</SectionTitle>
                            <GridContainer>
                                <CampoTexto
                                    name={`nome-${idx}`}
                                    valor={dep.nome}
                                    setValor={valor => updateArrayItem('dependentes', idx, { ...dep, nome: valor })}
                                    label="Nome Completo *"
                                    disabled={!!dep.id}
                                />
                                <CampoTexto
                                    name={`cpf-${idx}`}
                                    valor={dep.cpf}
                                    setValor={valor => updateArrayItem('dependentes', idx, { ...dep, cpf: valor })}
                                    label="CPF"
                                    patternMask="999.999.999-99"
                                    error={validarCPFDuplicado(dep.cpf, idx) ? "CPF já cadastrado para outro dependente" : null}
                                    disabled={!!dep.id}
                                />
                                <CampoTexto
                                    name={`data_nascimento-${idx}`}
                                    valor={dep.data_nascimento}
                                    setValor={valor => updateArrayItem('dependentes', idx, { ...dep, data_nascimento: valor })}
                                    label="Data de Nascimento"
                                    type="date"
                                    disabled={!!dep.id}
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
                                        disabled={!!dep.id}
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
                                    disabled={!!dep.id}
                                />
                                <CampoTexto
                                    name={`cartorio-${idx}`}
                                    valor={dep.cartorio || ''}
                                    setValor={valor => updateArrayItem('dependentes', idx, { ...dep, cartorio: valor })}
                                    label="Cartório"
                                    disabled={!!dep.id}
                                />
                                <CampoTexto
                                    name={`nroregistro-${idx}`}
                                    valor={dep.nroregistro || ''}
                                    setValor={valor => updateArrayItem('dependentes', idx, { ...dep, nroregistro: valor })}
                                    label="Número do Registro"
                                    disabled={!!dep.id}
                                />
                                <CampoTexto
                                    name={`nrolivro-${idx}`}
                                    valor={dep.nrolivro || ''}
                                    setValor={valor => updateArrayItem('dependentes', idx, { ...dep, nrolivro: valor })}
                                    label="Número do Livro"
                                    disabled={!!dep.id}
                                />
                                <CampoTexto
                                    name={`nrofolha-${idx}`}
                                    valor={dep.nrofolha || ''}
                                    setValor={valor => updateArrayItem('dependentes', idx, { ...dep, nrofolha: valor })}
                                    label="Número da Folha"
                                    disabled={!!dep.id}
                                />
                                <CampoTexto
                                    name={`cartao_vacina-${idx}`}
                                    valor={dep.cartao_vacina || ''}
                                    setValor={valor => updateArrayItem('dependentes', idx, { ...dep, cartao_vacina: valor })}
                                    label="Cartão de Vacina"
                                    disabled={!!dep.id}
                                />
                                <CampoTexto
                                    name={`nrosus-${idx}`}
                                    valor={dep.nrosus || ''}
                                    setValor={valor => updateArrayItem('dependentes', idx, { ...dep, nrosus: valor })}
                                    label="Número SUS"
                                    disabled={!!dep.id}
                                />
                                <CampoTexto
                                    name={`nronascidovivo-${idx}`}
                                    valor={dep.nronascidovivo || ''}
                                    setValor={valor => updateArrayItem('dependentes', idx, { ...dep, nronascidovivo: valor })}
                                    label="Número Nascido Vivo"
                                    disabled={!!dep.id}
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