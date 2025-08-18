import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useCandidatoContext } from '@contexts/Candidato';
import CampoTexto from '@components/CampoTexto';
import DropdownItens from '@components/DropdownItens';
import styled from 'styled-components';
import SwitchInput from '@components/SwitchInput';
import http from '@http';

const GridContainer = styled.div`
    padding: 0 24px 24px 24px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 24px;
    box-sizing: border-box;
    width: 100%;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 12px 0;
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

const StepVaga = ({ filiais, departamentos, secoes, centros_custo, horarios, funcoes, funcoes_confianca, sindicatos, modoLeitura = false, opcoesDominio = {}, availableDominioTables = [], classError = [], setClassError, marcarCampoSelecionado, buscarSecoesPorFilial }) => {
    
    
    const { candidato, setCampo, vaga } = useCandidatoContext();
    
    // Formata as opções para o formato esperado pelo DropdownItens
    const formatarOpcoes = useMemo(() => {
        return (opcoes, useDescription = false) => {
            if (!Array.isArray(opcoes)) return [];
            return opcoes.map(opcao => ({
                name: useDescription ? opcao.descricao : opcao.nome,
                code: opcao.id
            }));
        };
    }, []);

    const formatarOpcoesDominio = useMemo(() => {
        return (opcoes) => {
            if (!Array.isArray(opcoes)) return [];
            return opcoes.map(opcao => ({
                name: opcao.id_origem ? `${opcao.id_origem} - ${opcao.nome || opcao.descricao}` : opcao.nome || opcao.descricao,
                code: opcao.id_origem || opcao.codigo,
                id: opcao.id // Incluir o ID para facilitar a busca
            }));
        };
    }, []);

    const formatarOpcoesChoices = useMemo(() => {
        return (choices, campo = '') => {
            if (!choices || typeof choices !== 'object') return [];
            return Object.entries(choices).map(([code, name]) => ({
                name: (name === 'Null') ? 'Nenhum' : name,
                code: code
            }));
        };
    }, []);

    // Função para verificar se um campo é obrigatório baseado na lista
    const isCampoObrigatorio = useMemo(() => {
        return (lista) => {
            // Campo só é obrigatório se houver dados disponíveis na lista
            return lista && Array.isArray(lista) && lista.length > 0;
        };
    }, []);

    // Função para verificar se um campo está em erro
    const isCampoEmErro = useMemo(() => {
        return (campo) => {
            return classError.includes(campo);
        };
    }, [classError]);

    // Função para remover erro de um campo quando ele é preenchido
    const removerErroCampo = (campo, valor) => {
        if (!setClassError) return;
        
        // Para strings, verifica se não está vazio após trim
        // Para objetos (dropdowns), verifica se tem valor
        // Para outros tipos, verifica se tem valor
        const campoPreenchido = valor && (
            typeof valor === 'string' ? valor.trim() !== '' : 
            typeof valor === 'object' ? (valor.id || valor.code) : 
            valor
        );
        
        if (campoPreenchido) {
            setClassError(prev => prev.filter(erro => erro !== campo));
        }
    };

    // Função para obter o valor selecionado no formato {name, code}
    const getValorSelecionado = useMemo(() => {
        return (campo, lista) => {
            if (!Array.isArray(lista)) return '';
            
            // Para filial, prioriza o campo direto do candidato
            if (campo === 'filial_id') {
                // Primeiro tenta pegar do candidato.filial (campo direto)
                const filialCandidato = candidato?.filial;
                
                if (filialCandidato) {
                    // Tenta encontrar por ID exato (comparação numérica e string)
                    let item = lista.find(item => item.id === filialCandidato || item.id === Number(filialCandidato) || String(item.id) === String(filialCandidato));
                    
                    // Se não encontrar por ID, tenta por id_origem
                    if (!item) {
                        item = lista.find(item => item.id_origem === filialCandidato || item.id_origem === String(filialCandidato) || String(item.id_origem) === String(filialCandidato));
                    }
                    
                    if (item) {
                        return {
                            name: item.nome || item.descricao,
                            code: item.id
                        };
                    }
                }
                
                // Se não encontrar no candidato.filial, tenta pegar do dados_vaga.filial_id
                const filialDadosVaga = candidato?.dados_vaga?.filial_id;
                
                if (filialDadosVaga) {
                    // Tenta encontrar por ID exato (comparação numérica e string)
                    let item = lista.find(item => item.id === filialDadosVaga || item.id === Number(filialDadosVaga) || String(item.id) === String(filialDadosVaga));
                    
                    // Se não encontrar por ID, tenta por id_origem
                    if (!item) {
                        item = lista.find(item => item.id_origem === filialDadosVaga || item.id_origem === String(filialDadosVaga) || String(item.id_origem) === String(filialDadosVaga));
                    }
                    
                    if (item) {
                        return {
                            name: item.nome || item.descricao,
                            code: item.id
                        };
                    }
                }
                
                // Se não encontrar em nenhum lugar, retorna vazio
                return '';
            }
            
            // Para seção, prioriza o campo direto do candidato
            if (campo === 'secao_id') {
                // Primeiro tenta pegar do candidato.id_secao (campo direto)
                const secaoCandidato = candidato?.id_secao;
                
                if (secaoCandidato) {
                    // Tenta encontrar por ID exato (comparação numérica e string)
                    let item = lista.find(item => item.id === secaoCandidato || item.id === Number(secaoCandidato) || String(item.id) === String(secaoCandidato));
                    
                    // Se não encontrar por ID, tenta por id_origem
                    if (!item) {
                        item = lista.find(item => item.id_origem == secaoCandidato || item.id_origem === String(secaoCandidato) || String(item.id_origem) === String(secaoCandidato));
                    }
                    
                    if (item) {
                        return {
                            name: item.nome || item.descricao,
                            code: item.id
                        };
                    }
                }
                
                // Se não encontrar no candidato.secao_id_origem, tenta pegar do dados_vaga.secao_id
                const secaoDadosVaga = candidato?.dados_vaga?.secao_id;
                
                if (secaoDadosVaga) {
                    // Tenta encontrar por ID exato (comparação numérica e string)
                    let item = lista.find(item => item.id === secaoDadosVaga || item.id === Number(secaoDadosVaga) || String(item.id) === String(secaoDadosVaga));
                    
                    // Se não encontrar por ID, tenta por id_origem
                    if (!item) {
                        item = lista.find(item => item.id_origem === secaoDadosVaga || item.id_origem === String(secaoDadosVaga) || String(item.id_origem) === String(secaoDadosVaga));
                    }
                    
                    if (item) {
                        return {
                            name: item.nome || item.descricao,
                            code: item.id
                        };
                    }
                }
                
                // Se não encontrar em nenhum lugar, retorna vazio
                return '';
            }
            
            // Para função, prioriza o campo direto do candidato
            if (campo === 'funcao_id') {
                // Primeiro tenta pegar do candidato.id_funcao (campo direto)
                const funcaoCandidato = candidato?.id_funcao;
                
                if (funcaoCandidato) {
                    // Tenta encontrar por ID exato (comparação numérica e string)
                    let item = lista.find(item => item.id === funcaoCandidato || item.id === Number(funcaoCandidato) || String(item.id) === String(funcaoCandidato));
                    
                    // Se não encontrar por ID, tenta por id_origem
                    if (!item) {
                        item = lista.find(item => item.id_origem === funcaoCandidato || item.id_origem === String(funcaoCandidato) || String(item.id_origem) === String(funcaoCandidato));
                    }
                    
                    if (item) {
                        return {
                            name: item.nome || item.descricao,
                            code: item.id
                        };
                    }
                }
                
                // Se não encontrar no candidato.id_funcao, tenta pegar do dados_vaga.funcao_id
                const funcaoDadosVaga = candidato?.dados_vaga?.funcao_id;
                
                if (funcaoDadosVaga) {
                    // Tenta encontrar por ID exato (comparação numérica e string)
                    let item = lista.find(item => item.id === funcaoDadosVaga || item.id === Number(funcaoDadosVaga) || String(item.id) === String(funcaoDadosVaga));
                    
                    // Se não encontrar por ID, tenta por id_origem
                    if (!item) {
                        item = lista.find(item => item.id_origem === funcaoDadosVaga || item.id_origem === String(funcaoDadosVaga) || String(item.id_origem) === String(funcaoDadosVaga));
                    }
                    
                    if (item) {
                        return {
                            name: item.nome || item.descricao,
                            code: item.id
                        };
                    }
                }
                
                // Se não encontrar em nenhum lugar, retorna vazio
                return '';
            }
            
            // Para horário, prioriza o campo direto do candidato
            if (campo === 'horario_id') {
                // Primeiro tenta pegar do candidato.id_horario (campo direto)
                const horarioCandidato = candidato?.id_horario;
                
                if (horarioCandidato) {
                    // Tenta encontrar por ID exato (comparação numérica e string)
                    let item = lista.find(item => item.id === horarioCandidato || item.id === Number(horarioCandidato) || String(item.id) === String(horarioCandidato));
                    
                    // Se não encontrar por ID, tenta por id_origem
                    if (!item) {
                        item = lista.find(item => item.id_origem === horarioCandidato || item.id_origem === String(horarioCandidato) || String(item.id_origem) === String(horarioCandidato));
                    }
                    
                    if (item) {
                        return {
                            name: item.nome || item.descricao,
                            code: item.id
                        };
                    }
                }
                
                // Se não encontrar no candidato.id_horario, tenta pegar do dados_vaga.horario_id
                const horarioDadosVaga = candidato?.dados_vaga?.horario_id;
                
                if (horarioDadosVaga) {
                    // Tenta encontrar por ID exato (comparação numérica e string)
                    let item = lista.find(item => item.id === horarioDadosVaga || item.id === Number(horarioDadosVaga) || String(item.id) === String(horarioDadosVaga));
                    
                    // Se não encontrar por ID, tenta por id_origem
                    if (!item) {
                        item = lista.find(item => item.id_origem === horarioDadosVaga || item.id_origem === String(horarioDadosVaga) || String(item.id_origem) === String(horarioDadosVaga));
                    }
                    
                    if (item) {
                        return {
                            name: item.nome || item.descricao,
                            code: item.id
                        };
                    }
                }
                
                // Se não encontrar em nenhum lugar, retorna vazio
                return '';
            }
            
            // Para centro de custo, prioriza o campo direto do candidato
            if (campo === 'centro_custo_id') {
                // Primeiro tenta pegar do candidato.centro_custo (campo direto)
                const centroCustoCandidato = candidato?.centro_custo;
                
                if (centroCustoCandidato) {
                    // Tenta encontrar por ID exato (comparação numérica e string)
                    let item = lista.find(item => item.id === centroCustoCandidato || item.id === Number(centroCustoCandidato) || String(item.id) === String(centroCustoCandidato));
                    
                    // Se não encontrar por ID, tenta por id_origem
                    if (!item) {
                        item = lista.find(item => item.id_origem === centroCustoCandidato || item.id_origem === String(centroCustoCandidato) || String(item.id_origem) === String(centroCustoCandidato));
                    }
                    
                    if (item) {
                        return {
                            name: item.nome || item.descricao,
                            code: item.id
                        };
                    }
                }
                
                // Se não encontrar no candidato.centro_custo, tenta pegar do dados_vaga.centro_custo_id
                const centroCustoDadosVaga = candidato?.dados_vaga?.centro_custo_id;
                
                if (centroCustoDadosVaga) {
                    // Tenta encontrar por ID exato (comparação numérica e string)
                    let item = lista.find(item => item.id === centroCustoDadosVaga || item.id === Number(centroCustoDadosVaga) || String(item.id) === String(centroCustoDadosVaga));
                    
                    // Se não encontrar por ID, tenta por id_origem
                    if (!item) {
                        item = lista.find(item => item.id_origem === centroCustoDadosVaga || item.id_origem === String(centroCustoDadosVaga) || String(item.id_origem) === String(centroCustoDadosVaga));
                    }
                    
                    if (item) {
                        return {
                            name: item.nome || item.descricao,
                            code: item.id
                        };
                    }
                }
                
                // Se não encontrar em nenhum lugar, retorna vazio
                return '';
            }
            
            // Para outros campos, mantém a lógica original
            // Primeiro tenta pegar do dados_vaga
            const id = candidato?.dados_vaga?.[campo];
            
            if (id) {
                // Tenta encontrar por ID exato (comparação numérica e string)
                let item = lista.find(item => item.id === id || item.id === Number(id) || String(item.id) === String(id));
                
                // Se não encontrar por ID, tenta por id_origem
                if (!item) {
                    item = lista.find(item => item.id_origem === id || item.id_origem === String(id) || String(item.id_origem) === String(id));
                }
                
                if (item) {
                    return {
                        name: item.nome || item.descricao,
                        code: item.id
                    };
                }
            }
            
            // Se não encontrar no dados_vaga, tenta pegar da vaga
            const vagaId = vaga?.[campo.replace('_id', '')];
            
            if (vagaId) {
                // Tenta encontrar por ID exato (comparação numérica e string)
                let item = lista.find(item => item.id === vagaId || item.id === Number(vagaId) || String(item.id) === String(vagaId));
                
                // Se não encontrar por ID, tenta por id_origem
                if (!item) {
                    item = lista.find(item => item.id_origem === vagaId || item.id_origem === String(vagaId) || String(item.id_origem) === String(vagaId));
                }
                
                if (item) {
                    return {
                        name: item.nome || item.descricao,
                        code: item.id
                    };
                }
            }

            return '';
        };
    }, [candidato?.dados_vaga, candidato?.filial, candidato?.id_secao, candidato?.id_funcao, candidato?.id_horario, candidato?.centro_custo, candidato?.dados_vaga?.filial_id, vaga]);

    // Função para obter o valor selecionado no formato {name, code} para tabelas de domínio
    const getValorSelecionadoFromCandidato = useMemo(() => {
        return (campo, lista) => {
            if (!Array.isArray(lista) || !candidato) return '';
            
            // Se o valor for null, retorna "Nenhum" para campos específicos
            if (candidato[campo] && candidato[campo].descricao === 'Null') {
                return { name: 'Nenhum', code: candidato[campo].id || 'null' };
            }
            
            if (!candidato[campo]) return '';
            
            // Verifica se o valor é um objeto (como estado_civil, genero, etc.)
            if (typeof candidato[campo] === 'object' && candidato[campo] !== null) {
                // Busca na lista por id_origem primeiro
                const itemEncontrado = lista.find(item => item.code === candidato[campo].id_origem);
                if (itemEncontrado) {
                    return itemEncontrado; // Retorna o item exato da lista
                }
                
                // Se não encontrar por id_origem, tenta por id
                const itemEncontradoPorId = lista.find(item => item.id === candidato[campo].id);
                if (itemEncontradoPorId) {
                    return itemEncontradoPorId; // Retorna o item exato da lista
                }
                
                // Fallback: cria um objeto com a estrutura esperada
                const result = {
                    name: candidato[campo].descricao,
                    code: candidato[campo].id_origem || candidato[campo].id
                };
                
                return result;
            }
            
            // Se o valor é um número (ID), tenta encontrar na lista por ID
            if (typeof candidato[campo] === 'number') {
                // Primeiro tenta encontrar por ID (para casos onde a lista tem o ID completo)
                const itemById = lista.find(item => item.id === candidato[campo]);
                if (itemById) {
                    return itemById; // Retorna o item exato da lista
                }
                
                // Se não encontrar por ID, tenta por code (id_origem)
                const itemByCode = lista.find(item => String(item.code) === String(candidato[campo]));
                if (itemByCode) {
                    return itemByCode; // Retorna o item exato da lista
                }
            }
            
            // Fallback: tenta encontrar por code como string
            const code = String(candidato[campo]);
            const item = lista.find(item => String(item.code) === code);
            
            const result = item ? item : ''; // Retorna o item exato da lista se encontrado
            return result;
        };
    }, [candidato]);

    // Memoizar as opções formatadas para evitar recriações desnecessárias
    const opcoesFiliais = useMemo(() => formatarOpcoes(filiais), [filiais, formatarOpcoes]);
    const opcoesSecoes = useMemo(() => formatarOpcoes(secoes), [secoes, formatarOpcoes]);
    const opcoesCentrosCusto = useMemo(() => formatarOpcoes(centros_custo), [centros_custo, formatarOpcoes]);
    const opcoesHorarios = useMemo(() => formatarOpcoes(horarios, true), [horarios, formatarOpcoes]);
    const opcoesFuncoes = useMemo(() => formatarOpcoes(funcoes), [funcoes, formatarOpcoes]);
    const opcoesFuncaoConfianca = useMemo(() => formatarOpcoes(funcoes_confianca), [funcoes_confianca, formatarOpcoes]);
    const opcoesSindicatos = useMemo(() => formatarOpcoes(sindicatos, true), [sindicatos, formatarOpcoes]);

    // Memoizar as opções de domínio formatadas
    const opcoesTipoAdmissao = useMemo(() => formatarOpcoesDominio(opcoesDominio.tipo_admissao), [opcoesDominio.tipo_admissao, formatarOpcoesDominio]);
    const opcoesMotivoAdmissao = useMemo(() => formatarOpcoesDominio(opcoesDominio.motivo_admissao), [opcoesDominio.motivo_admissao, formatarOpcoesDominio]);
    const opcoesLetra = useMemo(() => formatarOpcoesDominio(opcoesDominio.letra), [opcoesDominio.letra, formatarOpcoesDominio]);
    const opcoesSituacaoFgts = useMemo(() => {
        return formatarOpcoesDominio(opcoesDominio.codigo_situacao_fgts);
    }, [opcoesDominio.codigo_situacao_fgts, formatarOpcoesDominio]);
    
    // Usando _choices do payload para os campos especificados
    const opcoesContratoTempoParcial = useMemo(() => formatarOpcoesChoices(candidato.contrato_tempo_parcial_choices), [candidato, formatarOpcoesChoices]);
    const opcoesIndicativoAdmissao = useMemo(() => formatarOpcoesChoices(candidato.indicativo_admissao_choices, 'indicativo_admissao'), [candidato, formatarOpcoesChoices]);
    const opcoesTipoRegimeTrabalhista = useMemo(() => formatarOpcoesChoices(candidato.tipo_regime_trabalhista_choices, 'tipo_regime_trabalhista'), [candidato, formatarOpcoesChoices]);
    const opcoesTipoRegimeJornada = useMemo(() => formatarOpcoesChoices(candidato.tipo_regime_jornada_choices), [candidato, formatarOpcoesChoices]);
    const opcoesTipoRegimePrevidenciario = useMemo(() => formatarOpcoesChoices(candidato.tipo_regime_previdenciario_choices), [candidato, formatarOpcoesChoices]);
    const opcoesTipoContratoPrazoDeterminado = useMemo(() => formatarOpcoesChoices(candidato.tipo_contrato_prazo_determinado_choices), [candidato, formatarOpcoesChoices]);
    const opcoesTipoContratoTrabalho = useMemo(() => formatarOpcoesChoices(candidato.tipo_contrato_trabalho_choices), [candidato, formatarOpcoesChoices]);
    const opcoesNaturezaAtividadeESocial = useMemo(() => formatarOpcoesChoices(candidato.natureza_atividade_esocial_choices), [candidato, formatarOpcoesChoices]);
    

    
    // Campos que vêm como objetos mas não têm _choices, então usam tabela de domínio
    const opcoesTipoFuncionario = useMemo(() => formatarOpcoesDominio(opcoesDominio.tipo_funcionario), [opcoesDominio.tipo_funcionario, formatarOpcoesDominio]);
    const opcoesCodigoCategoriaESocial = useMemo(() => formatarOpcoesDominio(opcoesDominio.codigo_categoria_esocial), [opcoesDominio.codigo_categoria_esocial, formatarOpcoesDominio]);
    
    // Campos que vêm como strings mas têm _choices disponíveis
    const opcoesTipoRecebimento = useMemo(() => {
        if (candidato.tipo_recebimento_choices) {
            return formatarOpcoesChoices(candidato.tipo_recebimento_choices);
        }
        return formatarOpcoesDominio(opcoesDominio.tipo_recebimento);
    }, [candidato.tipo_recebimento_choices, opcoesDominio.tipo_recebimento, formatarOpcoesChoices, formatarOpcoesDominio]);
    
    const opcoesTipoSituacao = useMemo(() => {
        return formatarOpcoesDominio(opcoesDominio.tipo_situacao);
    }, [opcoesDominio.tipo_situacao, formatarOpcoesDominio]);

    // Função para obter o valor padrão do tipo_situacao
    const getTipoSituacaoPadrao = useMemo(() => {
        return () => {
            if (!candidato?.tipo_situacao && opcoesTipoSituacao.length > 0) {
                // Procura pela opção "A" na lista
                const opcaoA = opcoesTipoSituacao.find(opcao => opcao.code === 'A');
                if (opcaoA) {
                    return opcaoA;
                }
            }
            return '';
        };
    }, [candidato?.tipo_situacao, opcoesTipoSituacao]);

    // Define o valor padrão para tipo_situacao quando não há valor selecionado
    useEffect(() => {
        if (!candidato?.tipo_situacao && opcoesTipoSituacao.length > 0) {
            const opcaoA = opcoesTipoSituacao.find(opcao => opcao.code === 'A');
            if (opcaoA) {
                setCampo('tipo_situacao', opcaoA.code);
            }
        }
    }, [candidato?.tipo_situacao, opcoesTipoSituacao, setCampo]);

    // Define valores padrão para calcula_inss e calcula_irrf
    useEffect(() => {
        if (candidato.calcula_inss === undefined) {
            setCampo('calcula_inss', true);
        }
        if (candidato.calcula_irrf === undefined) {
            setCampo('calcula_irrf', true);
        }
    }, [candidato.calcula_inss, candidato.calcula_irrf, setCampo]);
    
    // Carregar seções automaticamente quando a filial for carregada (apenas uma vez)
    useEffect(() => {
        // Verifica se há uma filial selecionada (prioriza candidato.filial sobre dados_vaga.filial_id)
        const filialSelecionada = candidato?.filial || candidato?.dados_vaga?.filial_id;
        
        if (filialSelecionada && buscarSecoesPorFilial) {
            buscarSecoesPorFilial(filialSelecionada);
        }

        if (candidato?.dados_vaga) {
            const dv = candidato.dados_vaga;
            if (!candidato.filial && dv.filial_id) setCampo('filial', dv.filial_id);
            if (!candidato.id_secao && dv.secao_id) setCampo('id_secao', dv.secao_id);
            if (!candidato.id_funcao && dv.funcao_id) setCampo('id_funcao', dv.funcao_id);
            if (!candidato.centro_custo && dv.centro_custo_id) setCampo('centro_custo', dv.centro_custo_id);
            if (!candidato.id_horario && dv.horario_id) setCampo('id_horario', dv.horario_id);
        }
    }, []); // Executa apenas uma vez na montagem do componente
    
    const opcoesCodigoOcorrenciaSefip = useMemo(() => {
        if (candidato.codigo_ocorrencia_sefip_choices) {
            return formatarOpcoesChoices(candidato.codigo_ocorrencia_sefip_choices);
        }
        return formatarOpcoesDominio(opcoesDominio.codigo_ocorrencia_sefip);
    }, [candidato.codigo_ocorrencia_sefip_choices, opcoesDominio.codigo_ocorrencia_sefip, formatarOpcoesChoices, formatarOpcoesDominio]);
    
    const opcoesCodigoCategoriaSefip = useMemo(() => {
        if (candidato.codigo_categoria_sefip_choices) {
            return formatarOpcoesChoices(candidato.codigo_categoria_sefip_choices);
        }
        return formatarOpcoesDominio(opcoesDominio.codigo_categoria_sefip);
    }, [candidato.codigo_categoria_sefip_choices, opcoesDominio.codigo_categoria_sefip, formatarOpcoesChoices, formatarOpcoesDominio]);
    
    const [opcoesLetraHorario, setOpcoesLetraHorario] = useState([]);

    // Buscar letras/índices do horário selecionado (manual)
    const handleHorarioChange = async (valor) => {
        setCampo('id_horario', valor.code);
        setCampo('dados_vaga', { 
            ...candidato.dados_vaga, 
            horario_id: valor.code,
            horario_nome: valor.name
        });
        try {
            const detalhesHorario = await http.get(`horario_indice/?id_horario=${valor.code}`);
            // Montar opções para o dropdown de letra
            const opcoes = (detalhesHorario || []).map(item => ({
                code: item.id,
                name: item.descricao_letra ? `${item.indice} - ${item.descricao_letra}` : `${item.indice}`
            }));
            setOpcoesLetraHorario(opcoes);
        } catch (err) {
            setOpcoesLetraHorario([]);
            console.error('Erro ao buscar detalhes do horário:', err);
        }
    };

    // Buscar letras/índices do horário selecionado (carregamento automático)
    useEffect(() => {
        const horarioId = candidato?.id_horario || candidato?.dados_vaga?.horario_id;
        if (horarioId) {
            (async () => {
                try {
                    const detalhesHorario = await http.get(`horario_indice/?id_horario=${horarioId}`);
                    const opcoes = (detalhesHorario || []).map(item => ({
                        code: item.id,
                        name: item.descricao_letra ? `${item.indice} - ${item.descricao_letra}` : `${item.indice}`
                    }));
                    setOpcoesLetraHorario(opcoes);
                } catch (err) {
                    setOpcoesLetraHorario([]);
                    console.error('Erro ao buscar detalhes do horário (carregamento automático):', err);
                }
            })();
        } else {
            setOpcoesLetraHorario([]);
        }
    }, [candidato?.id_horario, candidato?.dados_vaga?.horario_id]);
    
    
    return (
        <>
        <GridContainer>
            <SectionTitle>Estrutura Organizacional</SectionTitle>
            {/* Todos os Dropdowns agrupados */}
            <DropdownItens
                name="filial"
                valor={getValorSelecionado('filial_id', filiais)}
                setValor={valor => {
                    // Salvar tanto no campo direto quanto no dados_vaga para garantir consistência
                    setCampo('filial', valor.code);
                    setCampo('dados_vaga', { 
                        ...candidato.dados_vaga, 
                        filial_id: valor.code,
                        filial_nome: valor.name,
                        secao_id: null,
                        secao_nome: null
                    });
                    
                    // Buscar seções da filial selecionada
                    buscarSecoesPorFilial(valor.code);
                }}
                options={opcoesFiliais}
                label="Filial"
                required={isCampoObrigatorio(filiais)}
                search
                filter
                disabled={modoLeitura}
            />
            <DropdownItens
                name="secao"
                valor={getValorSelecionado('secao_id', secoes)}
                setValor={valor => {
                    // Salvar tanto no campo direto quanto no dados_vaga para garantir consistência
                    setCampo('id_secao', valor.code);
                    setCampo('dados_vaga', { 
                        ...candidato.dados_vaga, 
                        secao_id: valor.code,
                        secao_nome: valor.name
                    });
                }}
                options={opcoesSecoes}
                label="Seção"
                required={isCampoObrigatorio(secoes)}
                search
                filter
                disabled={modoLeitura || !(candidato?.filial || candidato?.dados_vaga?.filial_id)}
                placeholder={!(candidato?.filial || candidato?.dados_vaga?.filial_id) ? "Selecione uma filial primeiro" : "Selecione a seção"}
            />
            <DropdownItens
                name="funcao"
                valor={getValorSelecionado('funcao_id', funcoes)}
                setValor={valor => {
                    // Salvar tanto no campo direto quanto no dados_vaga para garantir consistência
                    setCampo('id_funcao', valor.code);
                    setCampo('dados_vaga', { 
                        ...candidato.dados_vaga, 
                        funcao_id: valor.code,
                        funcao_nome: valor.name
                    });
                }}
                options={opcoesFuncoes}
                label="Função"
                required={isCampoObrigatorio(funcoes)}
                search
                filter
                disabled={modoLeitura}
            />
            <DropdownItens
                name="centro_custo"
                valor={getValorSelecionado('centro_custo_id', centros_custo)}
                setValor={valor => {
                    // Salvar tanto no campo direto quanto no dados_vaga para garantir consistência
                    setCampo('centro_custo', valor.code);
                    setCampo('dados_vaga', { 
                        ...candidato.dados_vaga, 
                        centro_custo_id: valor.code,
                        centro_custo_nome: valor.name
                    });
                }}
                options={opcoesCentrosCusto}
                label="Centro de Custo"
                required={isCampoObrigatorio(centros_custo)}
                search
                filter
                disabled={modoLeitura}
            />
            <DropdownItens
                name="horario"
                valor={getValorSelecionado('horario_id', horarios)}
                setValor={async valor => {
                    // Salvar tanto no campo direto quanto no dados_vaga para garantir consistência
                    setCampo('id_horario', valor.code);
                    setCampo('dados_vaga', { 
                        ...candidato.dados_vaga, 
                        horario_id: valor.code,
                        horario_nome: valor.name
                    });
                    // Buscar detalhes do horário
                    try {
                        const detalhesHorario = await http.get(`horario_indice/?id_horario=${valor.code}`);
                        console.log('Detalhes do horário:', detalhesHorario);
                    } catch (err) {
                        console.error('Erro ao buscar detalhes do horário:', err);
                    }
                }}
                options={opcoesHorarios}
                label="Horário"
                required={isCampoObrigatorio(horarios)}
                search
                filter
                disabled={modoLeitura}
            />
            <DropdownItens
                name="sindicato"
                valor={getValorSelecionado('sindicato_id', sindicatos)}
                setValor={valor => {
                    setCampo('dados_vaga', { 
                        ...candidato.dados_vaga, 
                        sindicato_id: valor.code,
                        sindicato_nome: valor.name
                    });
                }}
                options={opcoesSindicatos}
                label="Sindicato"
                required={isCampoObrigatorio(sindicatos)}
                search
                filter
                disabled={modoLeitura}
            />
            <DropdownItens
                camposVazios={isCampoEmErro('letra') ? ['letra'] : []}
                name="letra"
                required={true}
                label="Letra"
                valor={opcoesLetraHorario.find(l => l.code === candidato.letra) || null}
                setValor={valor => setCampo('letra', valor.code)}
                options={opcoesLetraHorario}
                disabled={modoLeitura || opcoesLetraHorario.length === 0}
            />
            
            <SectionTitle>Admissão</SectionTitle>

            <CampoTexto
                camposVazios={isCampoEmErro('dt_admissao') ? ['dt_admissao'] : []}
                type="date"
                name="dt_admissao"
                required={true}
                label="Data de Admissão"
                valor={candidato.dt_admissao || ''}
                setValor={(valor) => {
                    setCampo('dt_admissao', valor);
                    removerErroCampo('dt_admissao', valor);
                }}
                disabled={modoLeitura}
            />
            <DropdownItens
                name="indicativo_admissao"
                label="Indicativo de Admissão"
                valor={getValorSelecionadoFromCandidato('indicativo_admissao', opcoesIndicativoAdmissao)}
                setValor={(valor) => setCampo('indicativo_admissao', valor.code)}
                options={opcoesIndicativoAdmissao}
                disabled={modoLeitura}
            />
            <DropdownItens
                camposVazios={isCampoEmErro('tipo_admissao') ? ['tipo_admissao'] : []}
                name="tipo_admissao"
                required={true}
                label="Tipo de Admissão"
                valor={getValorSelecionadoFromCandidato('tipo_admissao', opcoesTipoAdmissao)}
                setValor={(valor) => {
                    setCampo('tipo_admissao', valor.code);
                    removerErroCampo('tipo_admissao', valor);
                }}
                options={opcoesTipoAdmissao} 
                disabled={modoLeitura}
            />
            <DropdownItens
                camposVazios={isCampoEmErro('motivo_admissao') ? ['motivo_admissao'] : []}
                name="motivo_admissao"
                required={true}
                label="Motivo da Admissão"
                valor={getValorSelecionadoFromCandidato('motivo_admissao', opcoesMotivoAdmissao)}
                setValor={(valor) => {
                    setCampo('motivo_admissao', valor.code);
                    removerErroCampo('motivo_admissao', valor);
                }}
                options={opcoesMotivoAdmissao} 
                disabled={modoLeitura}
            />

            <SectionTitle>Características</SectionTitle>

            <DropdownItens
                camposVazios={isCampoEmErro('tipo_situacao') ? ['tipo_situacao'] : []}
                name="tipo_situacao"
                required={true}
                label="Situação"
                valor={getValorSelecionadoFromCandidato('tipo_situacao', opcoesTipoSituacao) || getTipoSituacaoPadrao()}
                setValor={(valor) => {
                    setCampo('tipo_situacao', valor.code);
                    marcarCampoSelecionado('tipo_situacao');
                    removerErroCampo('tipo_situacao', valor);
                }}
                options={opcoesTipoSituacao}
                disabled={modoLeitura}
                filter
            />
            <DropdownItens
                name="tipo_regime_trabalhista"
                label="Tipo de Regime Trabalhista"
                valor={getValorSelecionadoFromCandidato('tipo_regime_trabalhista', opcoesTipoRegimeTrabalhista)}
                setValor={(valor) => setCampo('tipo_regime_trabalhista', valor.code)}
                options={opcoesTipoRegimeTrabalhista}
                disabled={modoLeitura}
            />
            <DropdownItens
                camposVazios={isCampoEmErro('tipo_funcionario') ? ['tipo_funcionario'] : []}
                name="tipo_funcionario"
                required={true}
                label="Tipo de Funcionário"
                valor={getValorSelecionadoFromCandidato('tipo_funcionario', opcoesTipoFuncionario)}
                setValor={(valor) => {
                    setCampo('tipo_funcionario', valor.code);
                    marcarCampoSelecionado('tipo_funcionario');
                    removerErroCampo('tipo_funcionario', valor);
                }}
                options={opcoesTipoFuncionario} 
                disabled={modoLeitura}
                filter
            /> 
            <DropdownItens
                name="tipo_regime_previdenciario"
                label="Tipo de Regime Previdenciário"
                valor={getValorSelecionadoFromCandidato('tipo_regime_previdenciario', opcoesTipoRegimePrevidenciario)}
                setValor={(valor) => setCampo('tipo_regime_previdenciario', valor.code)}
                options={opcoesTipoRegimePrevidenciario}
                disabled={modoLeitura}
            />
            <DropdownItens
                camposVazios={isCampoEmErro('tipo_recebimento') ? ['tipo_recebimento'] : []}
                name="tipo_recebimento"
                required={true}
                label="Tipo de Recebimento"
                valor={getValorSelecionadoFromCandidato('tipo_recebimento', opcoesTipoRecebimento)}
                setValor={(valor) => {
                    setCampo('tipo_recebimento', valor.code);
                    marcarCampoSelecionado('tipo_recebimento');
                    removerErroCampo('tipo_recebimento', valor);
                }}
                options={opcoesTipoRecebimento}
                disabled={modoLeitura}
            />
            <DropdownItens
                name="tipo_regime_jornada"
                label="Tipo de Regime da Jornada"
                valor={getValorSelecionadoFromCandidato('tipo_regime_jornada', opcoesTipoRegimeJornada)}
                setValor={(valor) => setCampo('tipo_regime_jornada', valor.code)}
                options={opcoesTipoRegimeJornada}
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={isCampoEmErro('jornada') ? ['jornada'] : []}
                name="jornada"
                required={true}
                label="Jornada (HHH:mm)"
                valor={candidato.jornada || ''}
                setValor={(valor) => {
                    setCampo('jornada', valor);
                    removerErroCampo('jornada', valor);
                }}
                patternMask="999:99"
                maskReverse={true}
                placeholder="Ex: 220:30"
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={isCampoEmErro('salario') ? ['salario'] : []}
                name="salario"
                required={true}
                label="Salário"
                valor={candidato.salario || ''}
                setValor={(valor) => {
                    setCampo('salario', valor);
                    removerErroCampo('salario', valor);
                }}
                patternMask="BRL"
                placeholder="Ex: 1.000,00"
                disabled={modoLeitura}
            />
            <div style={{display: 'flex',  gap: '12px', flexWrap: 'wrap', alignItems: 'space-between', width: '100%'}}>
                {/* Todos os Switches agrupados */}
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0'}}>
                    <SwitchInput
                        checked={candidato.funcao_emprego_cargoacumulavel || false}
                        onChange={(valor) => setCampo('funcao_emprego_cargoacumulavel', valor)}
                    />
                    <span style={{fontSize: '14px', color: '#374151'}}>Considerar Como Função/Emprego/Cargo Acumulável</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0'}}>
                    <SwitchInput
                        checked={candidato.calcula_inss !== undefined ? candidato.calcula_inss : true}
                        onChange={(valor) => setCampo('calcula_inss', valor)}
                    />
                    <span style={{fontSize: '14px', color: '#374151'}}>Calcula INSS</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0'}}>
                    <SwitchInput
                        checked={candidato.calcula_irrf !== undefined ? candidato.calcula_irrf : true}
                        onChange={(valor) => setCampo('calcula_irrf', valor)}
                    />
                    <span style={{fontSize: '14px', color: '#374151'}}>Calcula IRRF</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0'}}>
                    <SwitchInput
                        checked={candidato.confianca || false}
                        onChange={(valor) => setCampo('confianca', valor)}
                    />
                    <span style={{fontSize: '14px', color: '#374151'}}>Possui Função de Confiança/Cargo em Comissão</span>
                </div>
            </div>
            {Boolean(candidato.confianca) && (
                <DropdownItens
                    camposVazios={isCampoEmErro('funcao_confianca') ? ['funcao_confianca'] : []}
                    name="funcao_confianca"
                    required={true}
                    label="Função de Confiança/Cargo em Comissão"
                    valor={getValorSelecionadoFromCandidato('funcao_confianca', opcoesFuncaoConfianca)}
                    setValor={(valor) => {
                        setCampo('funcao_confianca', valor.code);
                        removerErroCampo('funcao_confianca', valor);
                    }}
                    options={opcoesFuncaoConfianca}
                    disabled={modoLeitura}
                />
            )}
        </GridContainer>
        <GridContainer>
            <SectionTitle>FGTS</SectionTitle>

            <DropdownItens
                camposVazios={isCampoEmErro('codigo_situacao_fgts') ? ['codigo_situacao_fgts'] : []}
                name="codigo_situacao_fgts"
                required={true}
                label="Situação FGTS"
                valor={getValorSelecionadoFromCandidato('codigo_situacao_fgts', opcoesSituacaoFgts)}
                setValor={(valor) => {
                    setCampo('codigo_situacao_fgts', valor.code);
                    removerErroCampo('codigo_situacao_fgts', valor);
                }}
                options={opcoesSituacaoFgts}
                disabled={modoLeitura}
            />
            <CampoTexto
                type="date"
                name="dt_opcao_fgts"
                label="Data de Opção FGTS"
                valor={candidato.dt_opcao_fgts || ''}
                setValor={(valor) => setCampo('dt_opcao_fgts', valor)}
                disabled={modoLeitura}
            />
            <DropdownItens
                name="codigo_ocorrencia_sefip"
                label="Código Ocorrência SEFIP"
                valor={getValorSelecionadoFromCandidato('codigo_ocorrencia_sefip', opcoesCodigoOcorrenciaSefip)}
                setValor={(valor) => {
                    setCampo('codigo_ocorrencia_sefip', valor.code);
                }}
                options={opcoesCodigoOcorrenciaSefip}
                disabled={modoLeitura}
                filter
            />
            <DropdownItens
                name="codigo_categoria_sefip"
                label="Código Categoria SEFIP"
                valor={getValorSelecionadoFromCandidato('codigo_categoria_sefip', opcoesCodigoCategoriaSefip)}
                setValor={(valor) => {
                    setCampo('codigo_categoria_sefip', valor.code);
                }}
                options={opcoesCodigoCategoriaSefip}
                disabled={modoLeitura}
                filter
            />

            <SectionTitle>Contrato</SectionTitle>
            
            <DropdownItens
                name="contrato_tempo_parcial"
                label="Contrato de Trabalho em Tempo Parcial"
                valor={getValorSelecionadoFromCandidato('contrato_tempo_parcial', opcoesContratoTempoParcial)}
                setValor={(valor) => setCampo('contrato_tempo_parcial', valor.code)}
                options={opcoesContratoTempoParcial}
                disabled={modoLeitura}
            />
            <DropdownItens
                name="tipo_contrato_prazo_determinado"
                label="Tipo de Contrato Prazo Determinado"
                valor={getValorSelecionadoFromCandidato('tipo_contrato_prazo_determinado', opcoesTipoContratoPrazoDeterminado)}
                setValor={(valor) => setCampo('tipo_contrato_prazo_determinado', valor.code)}
                options={opcoesTipoContratoPrazoDeterminado}
                disabled={modoLeitura}
            />
            <DropdownItens
                name="tipo_contrato_trabalho"
                label="Tipo de Contrato de Trabalho"
                valor={getValorSelecionadoFromCandidato('tipo_contrato_trabalho', opcoesTipoContratoTrabalho)}
                setValor={(valor) => setCampo('tipo_contrato_trabalho', valor.code)}
                options={opcoesTipoContratoTrabalho}
                disabled={modoLeitura}
            />

            <SectionTitle>eSocial</SectionTitle>
            
            <DropdownItens
                camposVazios={isCampoEmErro('codigo_categoria_esocial') ? ['codigo_categoria_esocial'] : []}
                name="codigo_categoria_esocial"
                required={true}
                label="Código Categoria eSocial"
                valor={getValorSelecionadoFromCandidato('codigo_categoria_esocial', opcoesCodigoCategoriaESocial)}
                setValor={(valor) => {
                    setCampo('codigo_categoria_esocial', valor.code);
                    marcarCampoSelecionado('codigo_categoria_esocial');
                    removerErroCampo('codigo_categoria_esocial', valor);
                }}
                options={opcoesCodigoCategoriaESocial}
                disabled={modoLeitura}
                filter
            />
            <DropdownItens
                camposVazios={isCampoEmErro('natureza_atividade_esocial') ? ['natureza_atividade_esocial'] : []}
                name="natureza_atividade_esocial"
                required={true}
                label="Natureza da Atividade eSocial"
                valor={getValorSelecionadoFromCandidato('natureza_atividade_esocial', opcoesNaturezaAtividadeESocial)}
                setValor={(valor) => {
                    setCampo('natureza_atividade_esocial', valor.code);
                    removerErroCampo('natureza_atividade_esocial', valor);
                }}
                options={opcoesNaturezaAtividadeESocial}
                disabled={modoLeitura}
            />
            
            <SectionTitle>Dados Adicionais</SectionTitle>
            
            <CampoTexto
                name="perc_adiantamento"
                valor={(() => {
                    const valor = candidato?.perc_adiantamento;
                    if (!valor) return '';
                    
                    // Se é string, verifica se já tem formatação
                    if (typeof valor === 'string' && valor.includes('%')) {
                        return valor;
                    }
                    
                    // Se é número ou string numérica, converte para percentual
                    const numero = parseFloat(valor);
                    if (!isNaN(numero)) {
                        // O valor já está em percentual, só formata
                        return numero.toFixed(2).replace('.', ',') + '%';
                    }
                    
                    return valor;
                })()}
                setValor={valor => setCampo('perc_adiantamento', valor)}
                label="Percentual de Adiantamento"
                placeholder="Ex: 50"
                patternMask="PERCENT"
                disabled={modoLeitura}
            />
            <CampoTexto
                name="ajuda_custo"
                valor={candidato?.ajuda_custo ?? ''}
                setValor={valor => setCampo('ajuda_custo', valor)}
                label="Ajuda de Custo"
                patternMask="BRL"
                placeholder="Digite o valor"
                disabled={modoLeitura}
            />
            <CampoTexto
                name="arredondamento"
                valor={candidato?.arredondamento ?? ''}
                setValor={valor => setCampo('arredondamento', valor)}
                label="Arredondamento"
                patternMask="BRL"
                placeholder="Digite o valor"
                disabled={modoLeitura}
            />
            <CampoTexto
                name="media_sal_maternidade"
                valor={candidato?.media_sal_maternidade ?? ''}
                setValor={valor => setCampo('media_sal_maternidade', valor)}
                label="Média Salário Maternidade"
                patternMask="BRL"
                placeholder="Digite o valor"
                disabled={modoLeitura}
            />
        </GridContainer>
        </>
    );
};

export default StepVaga; 