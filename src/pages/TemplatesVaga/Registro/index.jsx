import React, { useState, useEffect, useRef, useMemo } from 'react';
import CampoTexto from '@components/CampoTexto';
import CampoTags from '@components/CampoTags';
import BotaoVoltar from '@components/BotaoVoltar';
import Container from '@components/Container';
import Botao from '@components/Botao';
import BotaoGrupo from '@components/BotaoGrupo';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave } from 'react-icons/fa';
import Frame from '@components/Frame';
import DropdownItens from '@components/DropdownItens';
import http from '@http';
import styled from 'styled-components';
import SwitchInput from '@components/SwitchInput';
import { Toast } from 'primereact/toast';
import templatesData from '@json/templates_vaga.json';

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 10px;
`

const Col6 = styled.div`
    flex: 1 1 calc(50% - 10px);
    margin-bottom: 16px;
`

const TemplatesVagaRegistro = () => {
    const { id } = useParams();
    const navegar = useNavigate();
    const toast = useRef(null);
    const [classError, setClassError] = useState([]);
    
    // Estados dos campos
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [jornada, setJornada] = useState('');
    const [salario, setSalario] = useState('');
    const [confianca, setConfianca] = useState(false);
    const [funcaoConfianca, setFuncaoConfianca] = useState(null);
    const [calculaInss, setCalculaInss] = useState(true);
    const [calculaIrrf, setCalculaIrrf] = useState(true);
    const [funcaoEmpregoCargoAcumulavel, setFuncaoEmpregoCargoAcumulavel] = useState(false);
    
    // Estados para dropdowns
    const [funcoes_confianca, setFuncoesConfianca] = useState([]);
    const [opcoesDominio, setOpcoesDominio] = useState({});
    const [availableDominioTables, setAvailableDominioTables] = useState([]);
    const [carregandoDados, setCarregandoDados] = useState(true);
    
    // Estados dos campos de seleção
    const [indicativoAdmissao, setIndicativoAdmissao] = useState(null);
    const [tipoAdmissao, setTipoAdmissao] = useState(null);
    const [motivoAdmissao, setMotivoAdmissao] = useState(null);
    const [tipoSituacao, setTipoSituacao] = useState(null);
    const [tipoFuncionario, setTipoFuncionario] = useState(null);
    const [tipoRegimeTrabalhista, setTipoRegimeTrabalhista] = useState(null);
    const [tipoRegimePrevidenciario, setTipoRegimePrevidenciario] = useState(null);
    const [tipoRecebimento, setTipoRecebimento] = useState(null);
    const [tipoRegimeJornada, setTipoRegimeJornada] = useState(null);
    const [codigoSituacaoFgts, setCodigoSituacaoFgts] = useState(null);
    const [codigoOcorrenciaSefip, setCodigoOcorrenciaSefip] = useState(null);
    const [codigoCategoriaSefip, setCodigoCategoriaSefip] = useState(null);
    const [contratoTempoParcial, setContratoTempoParcial] = useState(null);
    const [tipoContratoPrazoDeterminado, setTipoContratoPrazoDeterminado] = useState(null);
    const [tipoContratoTrabalho, setTipoContratoTrabalho] = useState(null);
    const [codigoCategoriaEsocial, setCodigoCategoriaEsocial] = useState(null);
    const [naturezaAtividadeEsocial, setNaturezaAtividadeEsocial] = useState(null);
    
    // Campos de valores monetários
    const [percAdiantamento, setPercAdiantamento] = useState('');
    const [ajudaCusto, setAjudaCusto] = useState('');
    const [arredondamento, setArredondamento] = useState('');
    const [mediaSalMaternidade, setMediaSalMaternidade] = useState('');
    
    // Estados para tags
    const [tags, setTags] = useState([]);
    const [tagsDisponiveis, setTagsDisponiveis] = useState([]);
    const [loadingTag, setLoadingTag] = useState(false);
    const processingTagRef = useRef(false);
    const tempTagCodeRef = useRef(null);

    // Carregar dados ao montar
    useEffect(() => {
        carregarDados();
    }, []);

    // Carregar template quando as opções de domínio estiverem prontas (se estiver editando)
    useEffect(() => {
        if (id && Object.keys(opcoesDominio).length > 0) {
            carregarTemplate(id);
        }
    }, [id, opcoesDominio]);

    const carregarDados = async () => {
        setCarregandoDados(true);
        try {
            // Carregar funções de confiança
            const funcoesResp = await http.get('funcao/?format=json&confianca=true');
            setFuncoesConfianca(funcoesResp);
            
            // Carregar tags disponíveis
            try {
                const tagsResp = await http.get('/documento_requerido_tag/');
                const tagsFormatadas = tagsResp.map(tag => ({
                    name: tag.nome,
                    code: tag.id.toString(),
                    id: tag.id
                }));
                setTagsDisponiveis(tagsFormatadas);
            } catch (error) {
                console.error('Erro ao buscar tags:', error);
            }
            
            // Carregar tabelas de domínio
            const response = await http.get('tabela_dominio/');
            const availableTables = response?.tabelas_disponiveis || [];
            setAvailableDominioTables(availableTables);

            if (availableTables.length > 0) {
                const promisesDominio = availableTables.map(async (tabela) => {
                    try {
                        const res = await http.get(`tabela_dominio/${tabela}/`);
                        return { [tabela]: res?.registros || [] };
                    } catch (error) {
                        console.error(`Erro ao buscar tabela_dominio/${tabela}/`, error);
                        return { [tabela]: [] };
                    }
                });

                const resultados = await Promise.all(promisesDominio);
                const novasOpcoes = resultados.reduce((acc, curr) => ({ ...acc, ...curr }), {});
                console.log('Opções de domínio carregadas:', novasOpcoes);
                setOpcoesDominio(novasOpcoes);
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao carregar dados das tabelas de domínio',
                life: 3000
            });
        } finally {
            setCarregandoDados(false);
        }
    };

    const carregarTemplate = async (templateId) => {
        try {
            // Buscar da API
            const template = await http.get(`/admissao_template/${templateId}/`);
            
            if (template) {
                setNome(template.nome || '');
                setDescricao(template.descricao || '');
                setJornada(template.jornada || '');
                setSalario(template.salario || '');
                setConfianca(template.confianca || false);
                setCalculaInss(template.calcula_inss ?? true);
                setCalculaIrrf(template.calcula_irrf ?? true);
                setFuncaoEmpregoCargoAcumulavel(template.funcao_emprego_cargoacumulavel || false);
                setPercAdiantamento(template.perc_adiantamento || '');
                setAjudaCusto(template.ajuda_custo || '');
                setArredondamento(template.arredondamento || '');
                setMediaSalMaternidade(template.media_sal_maternidade || '');
                
                // Carregar os valores dos dropdowns de choices
                if (template.indicativo_admissao) {
                    const opcao = opcoesIndicativoAdmissao.find(o => o.code === template.indicativo_admissao);
                    if (opcao) setIndicativoAdmissao(opcao);
                }
                if (template.tipo_regime_trabalhista) {
                    const opcao = opcoesTipoRegimeTrabalhista.find(o => o.code === template.tipo_regime_trabalhista);
                    if (opcao) setTipoRegimeTrabalhista(opcao);
                }
                if (template.tipo_regime_previdenciario) {
                    const opcao = opcoesTipoRegimePrevidenciario.find(o => o.code === template.tipo_regime_previdenciario);
                    if (opcao) setTipoRegimePrevidenciario(opcao);
                }
                if (template.tipo_regime_jornada) {
                    const opcao = opcoesTipoRegimeJornada.find(o => o.code === template.tipo_regime_jornada);
                    if (opcao) setTipoRegimeJornada(opcao);
                }
                if (template.contrato_tempo_parcial) {
                    const opcao = opcoesContratoTempoParcial.find(o => o.code === template.contrato_tempo_parcial);
                    if (opcao) setContratoTempoParcial(opcao);
                }
                if (template.tipo_contrato_prazo_determinado) {
                    const opcao = opcoesTipoContratoPrazoDeterminado.find(o => o.code === template.tipo_contrato_prazo_determinado);
                    if (opcao) setTipoContratoPrazoDeterminado(opcao);
                }
                if (template.tipo_contrato_trabalho) {
                    const opcao = opcoesTipoContratoTrabalho.find(o => o.code === template.tipo_contrato_trabalho);
                    if (opcao) setTipoContratoTrabalho(opcao);
                }
                if (template.natureza_atividade_esocial) {
                    const opcao = opcoesNaturezaAtividadeESocial.find(o => o.code === template.natureza_atividade_esocial);
                    if (opcao) setNaturezaAtividadeEsocial(opcao);
                }
                
                // Carregar valores dos dropdowns de domínio (podem precisar de um delay para garantir que as opções foram formatadas)
                setTimeout(() => {
                    if (template.tipo_admissao && opcoesTipoAdmissao.length > 0) {
                        const opcao = opcoesTipoAdmissao.find(o => o.id === template.tipo_admissao);
                        if (opcao) setTipoAdmissao(opcao);
                    }
                    if (template.motivo_admissao && opcoesMotivoAdmissao.length > 0) {
                        const opcao = opcoesMotivoAdmissao.find(o => o.id === template.motivo_admissao);
                        if (opcao) setMotivoAdmissao(opcao);
                    }
                    if (template.tipo_situacao && opcoesTipoSituacao.length > 0) {
                        const opcao = opcoesTipoSituacao.find(o => o.id === template.tipo_situacao);
                        if (opcao) setTipoSituacao(opcao);
                    }
                    if (template.tipo_funcionario && opcoesTipoFuncionario.length > 0) {
                        const opcao = opcoesTipoFuncionario.find(o => o.id === template.tipo_funcionario);
                        if (opcao) setTipoFuncionario(opcao);
                    }
                    if (template.tipo_recebimento && opcoesTipoRecebimento.length > 0) {
                        const opcao = opcoesTipoRecebimento.find(o => o.id === template.tipo_recebimento);
                        if (opcao) setTipoRecebimento(opcao);
                    }
                    if (template.codigo_situacao_fgts && opcoesSituacaoFgts.length > 0) {
                        const opcao = opcoesSituacaoFgts.find(o => o.id === template.codigo_situacao_fgts);
                        if (opcao) setCodigoSituacaoFgts(opcao);
                    }
                    if (template.codigo_ocorrencia_sefip && opcoesCodigoOcorrenciaSefip.length > 0) {
                        const opcao = opcoesCodigoOcorrenciaSefip.find(o => o.id === template.codigo_ocorrencia_sefip);
                        if (opcao) setCodigoOcorrenciaSefip(opcao);
                    }
                    if (template.codigo_categoria_sefip && opcoesCodigoCategoriaSefip.length > 0) {
                        const opcao = opcoesCodigoCategoriaSefip.find(o => o.id === template.codigo_categoria_sefip);
                        if (opcao) setCodigoCategoriaSefip(opcao);
                    }
                    if (template.codigo_categoria_esocial && opcoesCodigoCategoriaESocial.length > 0) {
                        const opcao = opcoesCodigoCategoriaESocial.find(o => o.id === template.codigo_categoria_esocial);
                        if (opcao) setCodigoCategoriaEsocial(opcao);
                    }
                    if (template.funcao_confianca && opcoesFuncaoConfianca.length > 0) {
                        const opcao = opcoesFuncaoConfianca.find(o => o.code === template.funcao_confianca);
                        if (opcao) setFuncaoConfianca(opcao);
                    }
                    
                    // Carregar tags se existirem
                    if (template.tags && Array.isArray(template.tags) && tagsDisponiveis.length > 0) {
                        const tagsArray = template.tags.map(tagId => {
                            const opcao = tagsDisponiveis.find(opt => opt.id === tagId);
                            return opcao || { name: `Tag ${tagId}`, code: tagId.toString(), id: tagId };
                        });
                        setTags(tagsArray);
                    }
                }, 500);
            }
        } catch (error) {
            console.error('Erro ao carregar template:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao carregar template',
                life: 3000
            });
        }
    };

    // Funções para formatar opções
    const formatarOpcoesDominio = (opcoes) => {
        if (!Array.isArray(opcoes)) return [];
        return opcoes.map(opcao => ({
            name: opcao.id_origem ? `${opcao.id_origem} - ${opcao.nome || opcao.descricao}` : opcao.nome || opcao.descricao,
            code: opcao.id_origem || opcao.codigo,
            id: opcao.id
        }));
    };

    const formatarOpcoesChoices = (choices) => {
        if (!choices || typeof choices !== 'object') return [];
        return Object.entries(choices).map(([code, name]) => ({
            name: (name === 'Null') ? 'Nenhum' : name,
            code: code
        }));
    };

    // Opções formatadas
    const opcoesTipoAdmissao = useMemo(() => {
        const opcoes = formatarOpcoesDominio(opcoesDominio.tipo_admissao);
        console.log('opcoesTipoAdmissao:', opcoes.length);
        return opcoes;
    }, [opcoesDominio.tipo_admissao]);
    
    const opcoesMotivoAdmissao = useMemo(() => formatarOpcoesDominio(opcoesDominio.motivo_admissao), [opcoesDominio.motivo_admissao]);
    const opcoesSituacaoFgts = useMemo(() => formatarOpcoesDominio(opcoesDominio.codigo_situacao_fgts), [opcoesDominio.codigo_situacao_fgts]);
    const opcoesTipoFuncionario = useMemo(() => formatarOpcoesDominio(opcoesDominio.tipo_funcionario), [opcoesDominio.tipo_funcionario]);
    const opcoesCodigoCategoriaESocial = useMemo(() => formatarOpcoesDominio(opcoesDominio.codigo_categoria_esocial), [opcoesDominio.codigo_categoria_esocial]);
    const opcoesTipoSituacao = useMemo(() => formatarOpcoesDominio(opcoesDominio.tipo_situacao), [opcoesDominio.tipo_situacao]);
    const opcoesTipoRecebimento = useMemo(() => formatarOpcoesDominio(opcoesDominio.tipo_recebimento), [opcoesDominio.tipo_recebimento]);
    const opcoesCodigoOcorrenciaSefip = useMemo(() => formatarOpcoesDominio(opcoesDominio.codigo_ocorrencia_sefip), [opcoesDominio.codigo_ocorrencia_sefip]);
    const opcoesCodigoCategoriaSefip = useMemo(() => formatarOpcoesDominio(opcoesDominio.codigo_categoria_sefip), [opcoesDominio.codigo_categoria_sefip]);
    
    const opcoesFuncaoConfianca = useMemo(() => {
        if (!Array.isArray(funcoes_confianca)) return [];
        return funcoes_confianca.map(opcao => ({
            name: opcao.nome,
            code: opcao.id
        }));
    }, [funcoes_confianca]);

    // Choices estáticas
    const opcoesIndicativoAdmissao = useMemo(() => formatarOpcoesChoices({
        "0": "Null",
        "1": "Normal",
        "2": "Decorrente de Ação Fiscal",
        "3": "Decorrente de Ação Judicial"
    }), []);

    const opcoesTipoRegimeTrabalhista = useMemo(() => formatarOpcoesChoices({
        "0": "Null",
        "1": "CLT - Consolidação das Leis de Trabalho",
        "2": "Estatuário/Legislações Específicas"
    }), []);

    const opcoesTipoRegimePrevidenciario = useMemo(() => formatarOpcoesChoices({
        "0": "Null",
        "1": "Regime Geral da Previdência Social - RGPS",
        "2": "RPPS, Regime dos Parlamentares e Sistema de Proteção dos Militares do Estado/DF",
        "3": "Regime de Previdência Social no Exterior"
    }), []);

    const opcoesTipoRegimeJornada = useMemo(() => formatarOpcoesChoices({
        "1": "Submetidos a Horario de Trabalho (Cap. II da CLT)",
        "2": "Atividade Externa Especificada no inciso I do Art. 62 da CLT",
        "3": "Funcções específicada no inciso II do Art. 62 da CLT",
        "4": "Teletrabalho, Previsto no inciso III do Art. 62 da CLT"
    }), []);

    const opcoesContratoTempoParcial = useMemo(() => formatarOpcoesChoices({
        "0": "Não é contrato em tempo parcial",
        "1": "Limitado a 25 horas semanais",
        "2": "Limitado a 30 horas semanais",
        "3": "Limitado a 26 horas semanais"
    }), []);

    const opcoesTipoContratoPrazoDeterminado = useMemo(() => formatarOpcoesChoices({
        "2": "Definido em dias",
        "3": "Vinculado à ocorrência de um fato"
    }), []);

    const opcoesTipoContratoTrabalho = useMemo(() => formatarOpcoesChoices({
        "D": "Prazo Determinado",
        "E": "Experiência"
    }), []);

    const opcoesNaturezaAtividadeESocial = useMemo(() => formatarOpcoesChoices({
        "1": "Trabalho Urbano",
        "2": "Trabalho Rural"
    }), []);

    const handleTagsChange = async (value) => {
        console.log('handleTagsChange chamado com:', value);
        console.log('tags atuais:', tags);
        
        // Se a última tag adicionada não existe nas opções (é nova)
        if (value.length > tags.length) {
            const novaTag = value[value.length - 1];
            
            // Verificar se a tag já existe nas opções disponíveis
            const tagExiste = tagsDisponiveis.some(t => 
                t.name.toLowerCase() === novaTag.name.toLowerCase() ||
                (t.id && novaTag.id && t.id === novaTag.id)
            );
            
            if (!tagExiste && (!novaTag.id || novaTag.id === novaTag.name)) {
                // Verificar se já está processando para evitar duplicação
                if (processingTagRef.current) {
                    console.log('Já está processando uma tag, ignorando...');
                    return;
                }
                
                // É uma tag nova que precisa ser criada na API
                processingTagRef.current = true;
                
                // 🚀 OPTIMISTIC UPDATE: Adiciona a tag temporária IMEDIATAMENTE
                const tempCode = `temp_${Date.now()}`;
                tempTagCodeRef.current = tempCode; // Salva referência
                
                const tagTemporaria = {
                    name: novaTag.name,
                    code: tempCode,
                    id: tempCode,
                    _isLoading: true // Flag para indicar que está carregando
                };
                
                console.log('Tag temporária criada:', tagTemporaria);
                
                const tagsComTemporaria = [...tags, tagTemporaria];
                setTags(tagsComTemporaria);
                setLoadingTag(true);
                
                try {
                    console.log('Criando nova tag:', novaTag.name);
                    
                    // Criar nova tag na API
                    const response = await http.post('/documento_requerido_tag/', {
                        nome: novaTag.name
                    });
                    
                    console.log('Tag criada com sucesso:', response);
                    
                    // Criar tag formatada com dados da API
                    const novaTagFormatada = {
                        name: response.nome,
                        code: response.id.toString(),
                        id: response.id
                    };
                    
                    // Adicionar a nova tag às opções disponíveis
                    setTagsDisponiveis(prev => [...prev, novaTagFormatada]);
                    
                    // 🎯 Substituir a tag temporária pela tag real
                    const tempCodeToReplace = tempTagCodeRef.current;
                    
                    setTags(currentTags => {
                        const tagsAtualizadas = currentTags.map(t => {
                            const ehTemporaria = t.code === tempCodeToReplace;
                            return ehTemporaria ? novaTagFormatada : t;
                        });
                        
                        tempTagCodeRef.current = null;
                        return tagsAtualizadas;
                    });
                    
                } catch (error) {
                    console.error('Erro ao criar nova tag:', error);
                    
                    // ❌ ROLLBACK: Remove a tag temporária em caso de erro
                    setTags(currentTags => {
                        const tagsSemTemporaria = currentTags.filter(t => !t._isLoading);
                        return tagsSemTemporaria;
                    });
                    
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Erro ao criar nova tag',
                        life: 3000
                    });
                } finally {
                    setLoadingTag(false);
                    processingTagRef.current = false;
                }
            } else {
                // Tag já existe ou foi selecionada das opções
                console.log('Tag já existe, atualizando estado com:', value);
                setTags(value);
            }
        } else {
            // Tag foi removida
            console.log('Tag removida, atualizando estado com:', value);
            setTags(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação básica
        const camposObrigatorios = [];
        if (!nome.trim()) camposObrigatorios.push('Nome');
        if (!jornada.trim()) camposObrigatorios.push('Jornada');
        if (!tipoAdmissao) camposObrigatorios.push('Tipo de Admissão');
        if (!motivoAdmissao) camposObrigatorios.push('Motivo da Admissão');
        if (!tipoSituacao) camposObrigatorios.push('Situação');
        if (!tipoFuncionario) camposObrigatorios.push('Tipo de Funcionário');
        if (!tipoRecebimento) camposObrigatorios.push('Tipo de Recebimento');
        if (!codigoSituacaoFgts) camposObrigatorios.push('Situação FGTS');
        if (!codigoCategoriaEsocial) camposObrigatorios.push('Código Categoria eSocial');
        if (!naturezaAtividadeEsocial) camposObrigatorios.push('Natureza da Atividade eSocial');

        if (camposObrigatorios.length > 0) {
            toast.current.show({
                severity: 'error',
                summary: 'Campos obrigatórios',
                detail: `Preencha: ${camposObrigatorios.join(', ')}`,
                life: 3000
            });
            return;
        }

        // Função para limpar formatação de moeda
        const limparFormatacaoMonetaria = (valor) => {
            if (!valor) return '0.00';
            // Remove R$, espaços, pontos de milhar e substitui vírgula por ponto
            return valor.toString()
                .replace('R$', '')
                .replace(/\s/g, '')
                .replace(/\./g, '')
                .replace(',', '.');
        };

        // Função para limpar formatação de percentual
        const limparFormatacaoPercentual = (valor) => {
            if (!valor) return '0.00';
            // Remove %, espaços e substitui vírgula por ponto
            return valor.toString()
                .replace('%', '')
                .replace(/\s/g, '')
                .replace(',', '.');
        };

        // Converter tags para array de IDs
        const tagsIds = tags.map(tag => tag.id);

        // Montar payload para a API
        const payload = {
            nome,
            descricao,
            jornada,
            salario: limparFormatacaoMonetaria(salario || '0.00'),
            confianca,
            funcao_confianca: funcaoConfianca?.code || null,
            calcula_inss: calculaInss,
            calcula_irrf: calculaIrrf,
            funcao_emprego_cargoacumulavel: funcaoEmpregoCargoAcumulavel,
            perc_adiantamento: limparFormatacaoPercentual(percAdiantamento),
            ajuda_custo: limparFormatacaoMonetaria(ajudaCusto),
            arredondamento: limparFormatacaoMonetaria(arredondamento),
            media_sal_maternidade: limparFormatacaoMonetaria(mediaSalMaternidade),
            indicativo_admissao: indicativoAdmissao?.code || null,
            tipo_admissao: tipoAdmissao?.id,
            motivo_admissao: motivoAdmissao?.id,
            tipo_situacao: tipoSituacao?.id,
            tipo_funcionario: tipoFuncionario?.id,
            tipo_regime_trabalhista: tipoRegimeTrabalhista?.code || null,
            tipo_regime_previdenciario: tipoRegimePrevidenciario?.code || null,
            tipo_recebimento: tipoRecebimento?.id,
            tipo_regime_jornada: tipoRegimeJornada?.code || null,
            codigo_situacao_fgts: codigoSituacaoFgts?.id,
            codigo_ocorrencia_sefip: codigoOcorrenciaSefip?.id || null,
            codigo_categoria_sefip: codigoCategoriaSefip?.id || null,
            contrato_tempo_parcial: contratoTempoParcial?.code || '0',
            tipo_contrato_prazo_determinado: tipoContratoPrazoDeterminado?.code || null,
            tipo_contrato_trabalho: tipoContratoTrabalho?.code || null,
            codigo_categoria_esocial: codigoCategoriaEsocial?.id,
            natureza_atividade_esocial: naturezaAtividadeEsocial?.code,
            tags: tagsIds
        };

        try {
            if (id) {
                // Atualizar template existente
                await http.put(`/admissao_template/${id}/`, payload);
                toast.current.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Template atualizado com sucesso!',
                    life: 3000
                });
            } else {
                // Criar novo template
                await http.post('/admissao_template/', payload);
                toast.current.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Template criado com sucesso!',
                    life: 3000
                });
            }

            setTimeout(() => {
                navegar('/templates-vaga');
            }, 1000);
        } catch (error) {
            console.error('Erro ao salvar template:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: error.response?.data?.detail || 'Erro ao salvar template. Verifique os dados e tente novamente.',
                life: 5000
            });
        }
    };

    return (
        <Frame gap="10px">
            <Toast ref={toast} />
            <BotaoVoltar linkFixo="/templates-vaga" />
            <br />
            <h4>{id ? (nome ? `Editar Template: ${nome}` : 'Editar Template de Vaga') : 'Novo Template de Vaga'}</h4>
            <br />
            <form onSubmit={handleSubmit}>
                <Col12>
                    <Col6>
                        <CampoTexto
                            camposVazios={classError}
                            name="nome"
                            valor={nome}
                            setValor={setNome}
                            type="text"
                            label="Nome do Template"
                            placeholder="Digite o nome do template"
                            required={true}
                        />
                    </Col6>
                    <Col6>
                        <CampoTexto
                            name="descricao"
                            valor={descricao}
                            setValor={setDescricao}
                            type="text"
                            label="Descrição"
                            placeholder="Digite uma descrição"
                        />
                    </Col6>
                </Col12>

                <Col12>
                    <Col6>
                        <CampoTags
                            name="tags"
                            value={tags}
                            onChange={handleTagsChange}
                            options={tagsDisponiveis}
                            label="Tags"
                            placeholder={loadingTag ? "Criando tag..." : "Digite para buscar ou criar tags..."}
                            allowCustomTags={true}
                            disabled={loadingTag}
                        />
                        <small style={{ color: loadingTag ? '#0ea5e9' : '#6c757d', marginTop: '4px', display: 'block', fontWeight: loadingTag ? 600 : 400 }}>
                            {loadingTag ? '⏳ Criando tag na API...' : 'Selecione tags ou crie novas (pressione Enter).'}
                        </small>
                    </Col6>
                </Col12>

                <Col12>
                    <Col6>
                        <DropdownItens
                            name="indicativo_admissao"
                            label="Indicativo de Admissão"
                            valor={indicativoAdmissao}
                            setValor={setIndicativoAdmissao}
                            options={opcoesIndicativoAdmissao}
                            disabled={carregandoDados}
                            placeholder={carregandoDados ? "Carregando..." : "Selecione"}
                        />
                    </Col6>
                    <Col6>
                        <DropdownItens
                            camposVazios={classError}
                            name="tipo_admissao"
                            required={true}
                            label="Tipo de Admissão"
                            valor={tipoAdmissao}
                            setValor={setTipoAdmissao}
                            options={opcoesTipoAdmissao}
                            disabled={carregandoDados}
                            placeholder={carregandoDados ? "Carregando..." : "Selecione"}
                        />
                    </Col6>
                </Col12>

                <Col12>
                    <Col6>
                        <DropdownItens
                            camposVazios={classError}
                            name="motivo_admissao"
                            required={true}
                            label="Motivo da Admissão"
                            valor={motivoAdmissao}
                            setValor={setMotivoAdmissao}
                            options={opcoesMotivoAdmissao}
                            disabled={carregandoDados}
                            placeholder={carregandoDados ? "Carregando..." : "Selecione"}
                        />
                    </Col6>
                    <Col6>
                        <DropdownItens
                            camposVazios={classError}
                            name="tipo_situacao"
                            required={true}
                            label="Situação"
                            valor={tipoSituacao}
                            setValor={setTipoSituacao}
                            options={opcoesTipoSituacao}
                            filter
                            disabled={carregandoDados}
                            placeholder={carregandoDados ? "Carregando..." : "Selecione"}
                        />
                    </Col6>
                </Col12>

                <Col12>
                    <Col6>
                        <DropdownItens
                            name="tipo_regime_trabalhista"
                            label="Tipo de Regime Trabalhista"
                            valor={tipoRegimeTrabalhista}
                            setValor={setTipoRegimeTrabalhista}
                            options={opcoesTipoRegimeTrabalhista}
                            disabled={carregandoDados}
                            placeholder={carregandoDados ? "Carregando..." : "Selecione"}
                        />
                    </Col6>
                    <Col6>
                        <DropdownItens
                            camposVazios={classError}
                            name="tipo_funcionario"
                            required={true}
                            label="Tipo de Funcionário"
                            valor={tipoFuncionario}
                            setValor={setTipoFuncionario}
                            options={opcoesTipoFuncionario}
                            filter
                            disabled={carregandoDados}
                            placeholder={carregandoDados ? "Carregando..." : "Selecione"}
                        />
                    </Col6>
                </Col12>

                <Col12>
                    <Col6>
                        <DropdownItens
                            name="tipo_regime_previdenciario"
                            label="Tipo de Regime Previdenciário"
                            valor={tipoRegimePrevidenciario}
                            setValor={setTipoRegimePrevidenciario}
                            options={opcoesTipoRegimePrevidenciario}
                            disabled={carregandoDados}
                            placeholder={carregandoDados ? "Carregando..." : "Selecione"}
                        />
                    </Col6>
                    <Col6>
                        <DropdownItens
                            camposVazios={classError}
                            name="tipo_recebimento"
                            required={true}
                            label="Tipo de Recebimento"
                            valor={tipoRecebimento}
                            setValor={setTipoRecebimento}
                            options={opcoesTipoRecebimento}
                            disabled={carregandoDados}
                            placeholder={carregandoDados ? "Carregando..." : "Selecione"}
                        />
                    </Col6>
                </Col12>

                <Col12>
                    <Col6>
                        <DropdownItens
                            name="tipo_regime_jornada"
                            label="Tipo de Regime da Jornada"
                            valor={tipoRegimeJornada}
                            setValor={setTipoRegimeJornada}
                            options={opcoesTipoRegimeJornada}
                            disabled={carregandoDados}
                            placeholder={carregandoDados ? "Carregando..." : "Selecione"}
                        />
                    </Col6>
                    <Col6>
                        <CampoTexto
                            camposVazios={classError}
                            name="jornada"
                            required={true}
                            label="Jornada (HHH:MM)"
                            valor={jornada}
                            setValor={setJornada}
                            patternMask="999:99"
                            maskReverse={true}
                            placeholder="Ex: 220:30"
                        />
                    </Col6>
                </Col12>

                <Col12>
                    <Col6>
                        <CampoTexto
                            camposVazios={classError}
                            name="salario"
                            label="Salário"
                            valor={salario}
                            setValor={setSalario}
                            patternMask="BRL"
                            placeholder="Ex: 1.000,00"
                        />
                    </Col6>
                    <Col6>
                        <DropdownItens
                            camposVazios={classError}
                            name="codigo_situacao_fgts"
                            required={true}
                            label="Situação FGTS"
                            valor={codigoSituacaoFgts}
                            setValor={setCodigoSituacaoFgts}
                            options={opcoesSituacaoFgts}
                            disabled={carregandoDados}
                            placeholder={carregandoDados ? "Carregando..." : "Selecione"}
                        />
                    </Col6>
                </Col12>

                <Col12>
                    <Col6>
                        <DropdownItens
                            name="codigo_ocorrencia_sefip"
                            label="Código Ocorrência SEFIP"
                            valor={codigoOcorrenciaSefip}
                            setValor={setCodigoOcorrenciaSefip}
                            options={opcoesCodigoOcorrenciaSefip}
                            filter
                            disabled={carregandoDados}
                            placeholder={carregandoDados ? "Carregando..." : "Selecione"}
                        />
                    </Col6>
                    <Col6>
                        <DropdownItens
                            name="codigo_categoria_sefip"
                            label="Código Categoria SEFIP"
                            valor={codigoCategoriaSefip}
                            setValor={setCodigoCategoriaSefip}
                            options={opcoesCodigoCategoriaSefip}
                            filter
                            disabled={carregandoDados}
                            placeholder={carregandoDados ? "Carregando..." : "Selecione"}
                        />
                    </Col6>
                </Col12>

                <Col12>
                    <Col6>
                        <DropdownItens
                            name="contrato_tempo_parcial"
                            label="Contrato de Trabalho em Tempo Parcial"
                            valor={contratoTempoParcial}
                            setValor={setContratoTempoParcial}
                            options={opcoesContratoTempoParcial}
                            disabled={carregandoDados}
                            placeholder={carregandoDados ? "Carregando..." : "Selecione"}
                        />
                    </Col6>
                    <Col6>
                        <DropdownItens
                            name="tipo_contrato_prazo_determinado"
                            label="Tipo de Contrato Prazo Determinado"
                            valor={tipoContratoPrazoDeterminado}
                            setValor={setTipoContratoPrazoDeterminado}
                            options={opcoesTipoContratoPrazoDeterminado}
                            disabled={carregandoDados}
                            placeholder={carregandoDados ? "Carregando..." : "Selecione"}
                        />
                    </Col6>
                </Col12>

                <Col12>
                    <Col6>
                        <DropdownItens
                            name="tipo_contrato_trabalho"
                            label="Tipo de Contrato de Trabalho"
                            valor={tipoContratoTrabalho}
                            setValor={setTipoContratoTrabalho}
                            options={opcoesTipoContratoTrabalho}
                            disabled={carregandoDados}
                            placeholder={carregandoDados ? "Carregando..." : "Selecione"}
                        />
                    </Col6>
                    <Col6>
                        <DropdownItens
                            camposVazios={classError}
                            name="codigo_categoria_esocial"
                            required={true}
                            label="Código Categoria eSocial"
                            valor={codigoCategoriaEsocial}
                            setValor={setCodigoCategoriaEsocial}
                            options={opcoesCodigoCategoriaESocial}
                            filter
                            disabled={carregandoDados}
                            placeholder={carregandoDados ? "Carregando..." : "Selecione"}
                        />
                    </Col6>
                </Col12>

                <Col12>
                    <Col6>
                        <DropdownItens
                            camposVazios={classError}
                            name="natureza_atividade_esocial"
                            required={true}
                            label="Natureza da Atividade eSocial"
                            valor={naturezaAtividadeEsocial}
                            setValor={setNaturezaAtividadeEsocial}
                            options={opcoesNaturezaAtividadeESocial}
                            disabled={carregandoDados}
                            placeholder={carregandoDados ? "Carregando..." : "Selecione"}
                        />
                    </Col6>
                    <Col6>
                        <CampoTexto
                            name="perc_adiantamento"
                            valor={percAdiantamento}
                            setValor={setPercAdiantamento}
                            label="Percentual de Adiantamento"
                            placeholder="Ex: 50"
                            patternMask="PERCENT"
                        />
                    </Col6>
                </Col12>

                <Col12>
                    <Col6>
                        <CampoTexto
                            name="ajuda_custo"
                            valor={ajudaCusto}
                            setValor={setAjudaCusto}
                            label="Ajuda de Custo"
                            patternMask="BRL"
                            placeholder="Digite o valor"
                        />
                    </Col6>
                    <Col6>
                        <CampoTexto
                            name="arredondamento"
                            valor={arredondamento}
                            setValor={setArredondamento}
                            label="Arredondamento"
                            patternMask="BRL"
                            placeholder="Digite o valor"
                        />
                    </Col6>
                </Col12>

                <Col12>
                    <Col6>
                        <CampoTexto
                            name="media_sal_maternidade"
                            valor={mediaSalMaternidade}
                            setValor={setMediaSalMaternidade}
                            label="Média Salário Maternidade"
                            patternMask="BRL"
                            placeholder="Digite o valor"
                        />
                    </Col6>
                </Col12>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '12px 0' }}>
                    <label style={{ fontWeight: 600 }}>Considerar Como Função/Emprego/Cargo Acumulável</label>
                    <SwitchInput checked={funcaoEmpregoCargoAcumulavel} onChange={setFuncaoEmpregoCargoAcumulavel} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '12px 0' }}>
                    <label style={{ fontWeight: 600 }}>Calcula INSS</label>
                    <SwitchInput checked={calculaInss} onChange={setCalculaInss} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '12px 0' }}>
                    <label style={{ fontWeight: 600 }}>Calcula IRRF</label>
                    <SwitchInput checked={calculaIrrf} onChange={setCalculaIrrf} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '12px 0' }}>
                    <label style={{ fontWeight: 600 }}>Possui Função de Confiança/Cargo em Comissão</label>
                    <SwitchInput checked={confianca} onChange={setConfianca} />
                </div>

                {confianca && (
                    <Col12>
                        <Col6>
                            <DropdownItens
                                camposVazios={classError}
                                name="funcao_confianca"
                                required={true}
                                label="Função de Confiança/Cargo em Comissão"
                                valor={funcaoConfianca}
                                setValor={setFuncaoConfianca}
                                options={opcoesFuncaoConfianca}
                                disabled={carregandoDados}
                                placeholder={carregandoDados ? "Carregando..." : "Selecione"}
                            />
                        </Col6>
                    </Col12>
                )}
                <BotaoGrupo align="end">
                    <BotaoGrupo align="end" style={{ marginTop: '24px' }}>
                        <Botao size="small" aoClicar={handleSubmit}>
                            <FaSave fill="var(--secundaria)" /> {id ? 'Atualizar Template' : 'Criar Template'}
                        </Botao>
                    </BotaoGrupo>
                </BotaoGrupo>
            </form>
        </Frame>
    );
};

export default TemplatesVagaRegistro;

