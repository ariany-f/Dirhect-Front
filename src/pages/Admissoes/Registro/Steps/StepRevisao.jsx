import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import { Badge } from 'primereact/badge';
import { ScrollPanel } from 'primereact/scrollpanel';
import { FaCheck, FaTimes, FaUser, FaBuilding, FaGraduationCap, FaFileAlt, FaShieldAlt, FaPhone, FaEnvelope, FaMapMarkerAlt, FaIdCard, FaCalendarAlt, FaMoneyBillWave, FaUsers, FaBookOpen, FaClipboardList } from 'react-icons/fa';
import http from '@http';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;
    width: 100%;
    padding: 0 32px;
`;

const SectionCard = styled(Card)`
    border-radius: 0;
    box-shadow: none;
    border: none;
    background: transparent;
    
    .p-card-body {
        padding: 24px 0;
    }
    
    .p-card-content {
        padding: 0;
    }
`;

const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid var(--primaria-100);
    
    h6 {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
        color: var(--text-color);
        letter-spacing: 0.5px;
    }
    
    .icon {
        color: var(--primaria);
        font-size: 20px;
        padding: 8px;
        background: var(--primaria-50);
        border-radius: 8px;
    }
`;

const FieldRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 12px 0;
    border-bottom: 1px solid var(--surface-border);
    transition: background-color 0.2s ease;
    
    &:hover {
        background-color: var(--surface-50);
        border-radius: 6px;
        padding: 12px 8px;
        margin: 0 -8px;
    }
    
    &:last-child {
        border-bottom: none;
    }
`;

const FieldLabel = styled.span`
    font-weight: 600;
    color: var(--text-color-secondary);
    min-width: 220px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    
    .field-icon {
        color: var(--primaria-400);
        font-size: 12px;
    }
`;

const FieldValue = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    justify-content: flex-end;
    text-align: right;
    font-weight: 500;
    color: var(--text-color);
    font-size: 14px;
    line-height: 1.4;
`;

const StatusTag = styled(Tag)`
    font-size: 11px;
    padding: 6px 12px;
    border-radius: 20px;
    font-weight: 600;
    letter-spacing: 0.5px;
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 32px 20px;
    color: var(--text-color-secondary);
    font-style: italic;
    background: var(--surface-50);
    border-radius: 8px;
    border: 2px dashed var(--surface-border);
`;

const DependenteCard = styled.div`
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 1px solid var(--surface-border);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    transition: all 0.3s ease;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    &:last-child {
        margin-bottom: 0;
    }
`;

const EducacaoCard = styled.div`
    background: linear-gradient(135deg, #fef7ff 0%, #f3e8ff 100%);
    border: 1px solid var(--surface-border);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    transition: all 0.3s ease;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    &:last-child {
        margin-bottom: 0;
    }
`;

const DocumentoCard = styled.div`
    background: ${props => props.upload_feito ? 
        'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' : 
        'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'
    };
    border: 2px solid ${props => props.upload_feito ? '#0ea5e9' : '#f87171'};
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    transition: all 0.3s ease;
    
    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    &:last-child {
        margin-bottom: 0;
    }
`;

const SectionTitle = styled.div`
    font-size: 16px;
    font-weight: 700;
    color: var(--primaria);
    margin: 24px 0 16px 0;
    padding: 12px 16px;
    background: var(--primaria-50);
    border-radius: 8px;
    border-left: 4px solid var(--primaria);
`;

const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 16px;
    margin-top: 16px;
`;

const HighlightValue = styled.span`
    background: var(--primaria-100);
    color: var(--primaria-700);
    padding: 4px 8px;
    border-radius: 6px;
    font-weight: 600;
    font-size: 13px;
`;

const SectionDivider = styled.hr`
    border: none;
    height: 2px;
    background: var(--primaria);
    margin: 32px 0;
    opacity: 0.3;
`;

const StepRevisao = ({ 
    candidato, 
    dependentes, 
    documentos, 
    educacao, 
    anotacoes,
    lgpdAceito,
    opcoesDominio = {},
    opcoesLetraHorario = [],
    paises = [],
    sindicatos = [],
    filiais = [],
    secoes = [],
    funcoes = [],
    centros_custo = [],
    horarios = [],
    self = false
}) => {
    const { t } = useTranslation('common');
    
    // Estados para carregar nomes de bancos e agências
    const [nomeBanco, setNomeBanco] = useState('');
    const [nomeAgencia, setNomeAgencia] = useState('');
    const [carregandoBanco, setCarregandoBanco] = useState(false);
    const [carregandoAgencia, setCarregandoAgencia] = useState(false);

    // Função para carregar nome do banco
    const carregarNomeBanco = async (bancoId) => {
        if (!bancoId || typeof bancoId !== 'string') return;
        
        setCarregandoBanco(true);
        try {
            const response = await http.get(`banco/${bancoId}/`);
            setNomeBanco(response.nome_completo || response.nome || `Banco ${bancoId}`);
        } catch (error) {
            console.error('Erro ao carregar nome do banco:', error);
            setNomeBanco(`Banco ${bancoId}`);
        } finally {
            setCarregandoBanco(false);
        }
    };

    // Função para carregar nome da agência
    const carregarNomeAgencia = async (agenciaId, bancoId) => {
        if (!agenciaId || !bancoId) return;
        
        setCarregandoAgencia(true);
        try {
            // Busca a agência usando o ID da agência
            const response = await http.get(`agencia/${agenciaId}/`);
            const nome = response.nome || 'Agência';
            const numAgencia = response.num_agencia || agenciaId;
            setNomeAgencia(`${numAgencia} - ${nome}`);
        } catch (error) {
            console.error('Erro ao carregar nome da agência:', error);
            setNomeAgencia(`Agência ${agenciaId}`);
        } finally {
            setCarregandoAgencia(false);
        }
    };

    // useEffect para carregar nome do banco quando o candidato muda
    useEffect(() => {
        if (candidato?.banco && typeof candidato.banco === 'string') {
            carregarNomeBanco(candidato.banco);
        } else {
            setNomeBanco('');
        }
    }, [candidato?.banco]);

    // useEffect para carregar nome da agência quando o candidato muda
    useEffect(() => {
        if (candidato?.agencia && candidato?.banco) {
            // Converte para string se necessário
            const agenciaId = String(candidato.agencia);
            const bancoId = String(candidato.banco);
            carregarNomeAgencia(agenciaId, bancoId);
        } else {
            setNomeAgencia('');
        }
    }, [candidato?.agencia, candidato?.banco]);

    const formatarData = (data) => {
        if (!data) return '-';
        return new Date(data).toLocaleDateString('pt-BR');
    };

    const formatarCPF = (cpf) => {
        if (!cpf) return '-';
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const formatarTelefone = (telefone) => {
        if (!telefone) return '-';
        return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    };

    const formatarCEP = (cep) => {
        if (!cep) return '-';
        return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
    };

    const formatarValorMonetario = (valor) => {
        if (!valor) return '-';
        
        // Se já é uma string formatada (ex: "1500.00"), converte diretamente
        let valorNumerico;
        if (typeof valor === 'string') {
            // Remove formatação se existir
            const valorLimpo = valor.replace(/[R$\s]/g, '').replace(/\./g, '').replace(',', '.');
            valorNumerico = parseFloat(valorLimpo);
        } else {
            valorNumerico = parseFloat(valor);
        }
        
        if (isNaN(valorNumerico) || valorNumerico <= 0) return '-';
        
        return `R$ ${valorNumerico.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    };

    const getStatusIcon = (status) => {
        return status ? <FaCheck color="var(--green-500)" /> : <FaTimes color="var(--red-500)" />;
    };

    const getStatusTag = (status) => {
        return status ? 
            <StatusTag value="Sim" severity="success" /> : 
            <StatusTag value="Não" severity="info" />;
    };

    // Função para buscar descrição de campo por código
    const getDescricaoPorCodigo = (codigo, opcoes) => {
        if (!codigo || !Array.isArray(opcoes)) return '-';
        const opcao = opcoes.find(op => String(op.id_origem || op.codigo) === String(codigo));
        return opcao?.descricao || '-';
    };

    // Função para buscar descrição de cor/raça
    const getDescricaoCorRaca = (codigo) => {
        return getDescricaoPorCodigo(codigo, opcoesDominio.cor_raca || []);
    };

    // Função para buscar descrição de nacionalidade
    const getDescricaoNacionalidade = (codigo) => {
        return getDescricaoPorCodigo(codigo, opcoesDominio.nacionalidade || []);
    };

    // Função para buscar descrição de estado civil
    const getDescricaoEstadoCivil = (codigo) => {
        return getDescricaoPorCodigo(codigo, opcoesDominio.estado_civil || []);
    };

    // Função para buscar descrição de gênero
    const getDescricaoGenero = (codigo) => {
        return getDescricaoPorCodigo(codigo, opcoesDominio.genero || []);
    };

    // Função para buscar descrição de tipo de admissão
    const getDescricaoTipoAdmissao = (codigo) => {
        return getDescricaoPorCodigo(codigo, opcoesDominio.tipo_admissao || []);
    };

    // Função para buscar descrição de motivo de admissão
    const getDescricaoMotivoAdmissao = (codigo) => {
        return getDescricaoPorCodigo(codigo, opcoesDominio.motivo_admissao || []);
    };

    // Função para buscar descrição de tipo de situação
    const getDescricaoTipoSituacao = (codigo) => {
        return getDescricaoPorCodigo(codigo, opcoesDominio.tipo_situacao || []);
    };

    // Função para buscar descrição de tipo de funcionário
    const getDescricaoTipoFuncionario = (codigo) => {
        return getDescricaoPorCodigo(codigo, opcoesDominio.tipo_funcionario || []);
    };

    // Função para buscar descrição de tipo de recebimento
    const getDescricaoTipoRecebimento = (codigo) => {
        if (!codigo) return '-';
        // Se já é um objeto com descrição, retorna a descrição
        if (typeof codigo === 'object' && codigo.descricao) {
            return codigo.descricao;
        }
        // Busca nas choices do candidato primeiro
        if (candidato?.tipo_recebimento_choices && candidato.tipo_recebimento_choices[codigo]) {
            return candidato.tipo_recebimento_choices[codigo] === 'Null' ? 'Nenhum' : candidato.tipo_recebimento_choices[codigo];
        }
        // Fallback: busca nas opções de domínio
        return getDescricaoPorCodigo(codigo, opcoesDominio.tipo_recebimento || []);
    };

    // Função para buscar descrição de código categoria eSocial
    const getDescricaoCodigoCategoriaEsocial = (codigo) => {
        return getDescricaoPorCodigo(codigo, opcoesDominio.codigo_categoria_esocial || []);
    };

    // Função para buscar descrição de natureza atividade eSocial
    const getDescricaoNaturezaAtividadeEsocial = (codigo) => {
        if (!codigo) return '-';
        // Se já é um objeto com descrição, retorna a descrição
        if (typeof codigo === 'object' && codigo.descricao) {
            return codigo.descricao;
        }
        // Busca nas choices do candidato primeiro
        if (candidato?.natureza_atividade_esocial_choices && candidato.natureza_atividade_esocial_choices[codigo]) {
            return candidato.natureza_atividade_esocial_choices[codigo] === 'Null' ? 'Nenhum' : candidato.natureza_atividade_esocial_choices[codigo];
        }
        // Fallback: busca nas opções de domínio
        return getDescricaoPorCodigo(codigo, opcoesDominio.natureza_atividade_esocial || []);
    };

    // Função para buscar descrição de código situação FGTS
    const getDescricaoCodigoSituacaoFgts = (codigo) => {
        return getDescricaoPorCodigo(codigo, opcoesDominio.codigo_situacao_fgts || []);
    };

    // Função para buscar descrição de código ocorrência SEFIP
    const getDescricaoCodigoOcorrenciaSefip = (codigo) => {
        if (!codigo) return '-';
        // Se já é um objeto com descrição, retorna a descrição
        if (typeof codigo === 'object' && codigo.descricao) {
            return codigo.descricao;
        }
        // Busca nas choices do candidato primeiro
        if (candidato?.codigo_ocorrencia_sefip_choices && candidato.codigo_ocorrencia_sefip_choices[codigo]) {
            return candidato.codigo_ocorrencia_sefip_choices[codigo] === 'Null' ? 'Nenhum' : candidato.codigo_ocorrencia_sefip_choices[codigo];
        }
        // Fallback: busca nas opções de domínio
        return getDescricaoPorCodigo(codigo, opcoesDominio.codigo_ocorrencia_sefip || []);
    };

    // Função para buscar descrição de código categoria SEFIP
    const getDescricaoCodigoCategoriaSefip = (codigo) => {
        if (!codigo) return '-';
        // Se já é um objeto com descrição, retorna a descrição
        if (typeof codigo === 'object' && codigo.descricao) {
            return codigo.descricao;
        }
        // Busca nas choices do candidato primeiro
        if (candidato?.codigo_categoria_sefip_choices && candidato.codigo_categoria_sefip_choices[codigo]) {
            return candidato.codigo_categoria_sefip_choices[codigo] === 'Null' ? 'Nenhum' : candidato.codigo_categoria_sefip_choices[codigo];
        }
        // Fallback: busca nas opções de domínio
        return getDescricaoPorCodigo(codigo, opcoesDominio.codigo_categoria_sefip || []);
    };

    // Função para buscar descrição de grau de parentesco
    const getDescricaoGrauParentesco = (codigo) => {
        if (!codigo || !Array.isArray(opcoesDominio.grau_parentesco)) return '-';
        const opcao = opcoesDominio.grau_parentesco.find(op => String(op.id_origem) === String(codigo));
        return opcao?.descricao || '-';
    };

    // Função para buscar descrição de nível educacional
    const getDescricaoNivel = (codigo) => {
        return getDescricaoPorCodigo(codigo, opcoesDominio.nivel || []);
    };

    // Função para buscar descrição de status educacional
    const getDescricaoStatus = (codigo) => {
        return getDescricaoPorCodigo(codigo, opcoesDominio.status || []);
    };

    // Função para buscar descrição de país
    const getDescricaoPais = (codigo) => {
        if (!codigo) return '-';
        // Se já é um objeto com descrição, retorna a descrição
        if (typeof codigo === 'object' && codigo.descricao) {
            return codigo.descricao;
        }
        // Se é um código, busca na lista de países
        if (paises && Array.isArray(paises)) {
            const pais = paises.find(p => String(p.code) === String(codigo));
            return pais?.name || codigo;
        }
        // Fallback: retorna o código se não encontrar
        return codigo;
    };

    // Função para buscar descrição de letra
    const getDescricaoLetra = (codigo) => {
        if (!codigo) return '-';
        // Se já é um objeto com descrição, retorna a descrição
        if (typeof codigo === 'object' && codigo.descricao) {
            return codigo.descricao;
        }
        // Busca nas opções de letra do horário
        if (opcoesLetraHorario && opcoesLetraHorario.length > 0) {
            const opcao = opcoesLetraHorario.find(op => String(op.code) === String(codigo));
            if (opcao) {
                return opcao.name;
            }
        }
        // Fallback: busca nas opções de domínio
        return getDescricaoPorCodigo(codigo, opcoesDominio.letra || []);
    };

    // Função para buscar descrição de indicativo de admissão
    const getDescricaoIndicativoAdmissao = (codigo) => {
        if (!codigo) return '-';
        // Se já é um objeto com descrição, retorna a descrição
        if (typeof codigo === 'object' && codigo.descricao) {
            return codigo.descricao;
        }
        // Busca nas choices do candidato
        if (candidato?.indicativo_admissao_choices && candidato.indicativo_admissao_choices[codigo]) {
            return candidato.indicativo_admissao_choices[codigo] === 'Null' ? 'Nenhum' : candidato.indicativo_admissao_choices[codigo];
        }
        return codigo;
    };

    // Função para buscar descrição de tipo de regime trabalhista
    const getDescricaoTipoRegimeTrabalhista = (codigo) => {
        if (!codigo) return '-';
        // Se já é um objeto com descrição, retorna a descrição
        if (typeof codigo === 'object' && codigo.descricao) {
            return codigo.descricao;
        }
        // Busca nas choices do candidato
        if (candidato?.tipo_regime_trabalhista_choices && candidato.tipo_regime_trabalhista_choices[codigo]) {
            return candidato.tipo_regime_trabalhista_choices[codigo] === 'Null' ? 'Nenhum' : candidato.tipo_regime_trabalhista_choices[codigo];
        }
        return codigo;
    };

    // Função para buscar descrição de tipo de regime previdenciário
    const getDescricaoTipoRegimePrevidenciario = (codigo) => {
        if (!codigo) return '-';
        // Se já é um objeto com descrição, retorna a descrição
        if (typeof codigo === 'object' && codigo.descricao) {
            return codigo.descricao;
        }
        // Busca nas choices do candidato
        if (candidato?.tipo_regime_previdenciario_choices && candidato.tipo_regime_previdenciario_choices[codigo]) {
            return candidato.tipo_regime_previdenciario_choices[codigo] === 'Null' ? 'Nenhum' : candidato.tipo_regime_previdenciario_choices[codigo];
        }
        return codigo;
    };

    // Função para buscar descrição de tipo de regime da jornada
    const getDescricaoTipoRegimeJornada = (codigo) => {
        if (!codigo) return '-';
        // Se já é um objeto com descrição, retorna a descrição
        if (typeof codigo === 'object' && codigo.descricao) {
            return codigo.descricao;
        }
        // Busca nas choices do candidato
        if (candidato?.tipo_regime_jornada_choices && candidato.tipo_regime_jornada_choices[codigo]) {
            return candidato.tipo_regime_jornada_choices[codigo] === 'Null' ? 'Nenhum' : candidato.tipo_regime_jornada_choices[codigo];
        }
        return codigo;
    };

    // Função para buscar descrição de contrato tempo parcial
    const getDescricaoContratoTempoParcial = (codigo) => {
        if (!codigo) return '-';
        // Se já é um objeto com descrição, retorna a descrição
        if (typeof codigo === 'object' && codigo.descricao) {
            return codigo.descricao;
        }
        // Busca nas choices do candidato
        if (candidato?.contrato_tempo_parcial_choices && candidato.contrato_tempo_parcial_choices[codigo]) {
            return candidato.contrato_tempo_parcial_choices[codigo] === 'Null' ? 'Nenhum' : candidato.contrato_tempo_parcial_choices[codigo];
        }
        return codigo;
    };

    // Função para buscar descrição de tipo de contrato prazo determinado
    const getDescricaoTipoContratoPrazoDeterminado = (codigo) => {
        if (!codigo) return '-';
        // Se já é um objeto com descrição, retorna a descrição
        if (typeof codigo === 'object' && codigo.descricao) {
            return codigo.descricao;
        }
        // Busca nas choices do candidato
        if (candidato?.tipo_contrato_prazo_determinado_choices && candidato.tipo_contrato_prazo_determinado_choices[codigo]) {
            return candidato.tipo_contrato_prazo_determinado_choices[codigo] === 'Null' ? 'Nenhum' : candidato.tipo_contrato_prazo_determinado_choices[codigo];
        }
        return codigo;
    };

    // Função para buscar descrição de tipo de contrato de trabalho
    const getDescricaoTipoContratoTrabalho = (codigo) => {
        if (!codigo) return '-';
        // Se já é um objeto com descrição, retorna a descrição
        if (typeof codigo === 'object' && codigo.descricao) {
            return codigo.descricao;
        }
        // Busca nas choices do candidato
        if (candidato?.tipo_contrato_trabalho_choices && candidato.tipo_contrato_trabalho_choices[codigo]) {
            return candidato.tipo_contrato_trabalho_choices[codigo] === 'Null' ? 'Nenhum' : candidato.tipo_contrato_trabalho_choices[codigo];
        }
        return codigo;
    };

    // Função para buscar descrição do sindicato
    const getDescricaoSindicato = (codigo) => {
        if (!codigo) return '-';
        // Se já é um objeto com nome, retorna o nome
        if (typeof codigo === 'object' && codigo.nome) {
            return codigo.nome;
        }
        // Busca na lista de sindicatos
        if (sindicatos && Array.isArray(sindicatos)) {
            const sindicato = sindicatos.find(s => s.id === codigo || s.id === Number(codigo) || String(s.id) === String(codigo));
            if (sindicato) {
                return sindicato.nome || sindicato.descricao;
            }
        }
        // Fallback: retorna o código se não encontrar
        return codigo;
    };

    // Função para buscar descrição da filial
    const getDescricaoFilial = (codigo) => {
        if (!codigo) return '-';
        // Se já é um objeto com nome, retorna o nome
        if (typeof codigo === 'object' && codigo.nome) {
            return codigo.nome;
        }
        // Busca na lista de filiais
        if (filiais && Array.isArray(filiais)) {
            const filial = filiais.find(f => f.id === codigo || f.id === Number(codigo) || String(f.id) === String(codigo));
            if (filial) {
                return filial.nome || filial.descricao;
            }
        }
        // Fallback: retorna o código se não encontrar
        return codigo;
    };

    // Função para buscar descrição da seção
    const getDescricaoSecao = (codigo) => {
        if (!codigo) return '-';
        // Se já é um objeto com nome, retorna o nome
        if (typeof codigo === 'object' && codigo.nome) {
            return codigo.nome;
        }
        // Busca na lista de seções
        if (secoes && Array.isArray(secoes)) {
            const secao = secoes.find(s => s.id === codigo || s.id === Number(codigo) || String(s.id) === String(codigo));
            if (secao) {
                return secao.nome || secao.descricao;
            }
        }
        // Fallback: retorna o código se não encontrar
        return codigo;
    };

    // Função para buscar descrição da função
    const getDescricaoFuncao = (codigo) => {
        if (!codigo) return '-';
        // Se já é um objeto com nome, retorna o nome
        if (typeof codigo === 'object' && codigo.nome) {
            return codigo.nome;
        }
        // Busca na lista de funções
        if (funcoes && Array.isArray(funcoes)) {
            const funcao = funcoes.find(f => f.id === codigo || f.id === Number(codigo) || String(f.id) === String(codigo));
            if (funcao) {
                return funcao.nome || funcao.descricao;
            }
        }
        // Fallback: retorna o código se não encontrar
        return codigo;
    };

    // Função para buscar descrição do centro de custo
    const getDescricaoCentroCusto = (codigo) => {
        if (!codigo) return '-';
        // Se já é um objeto com nome, retorna o nome
        if (typeof codigo === 'object' && codigo.nome) {
            return codigo.nome;
        }
        // Busca na lista de centros de custo
        if (centros_custo && Array.isArray(centros_custo)) {
            const centro = centros_custo.find(c => c.id === codigo || c.id === Number(codigo) || String(c.id) === String(codigo));
            if (centro) {
                return centro.nome || centro.descricao;
            }
        }
        // Fallback: retorna o código se não encontrar
        return codigo;
    };

    // Função para buscar descrição do horário
    const getDescricaoHorario = (codigo) => {
        if (!codigo) return '-';
        // Se já é um objeto com descrição, retorna a descrição
        if (typeof codigo === 'object' && codigo.descricao) {
            return codigo.descricao;
        }
        // Busca na lista de horários
        if (horarios && Array.isArray(horarios)) {
            const horario = horarios.find(h => h.id === codigo || h.id === Number(codigo) || String(h.id) === String(codigo));
            if (horario) {
                return horario.descricao || horario.nome;
            }
        }
        // Fallback: retorna o código se não encontrar
        return codigo;
    };

    return (
        <Container>
            <SectionCard>
                <SectionHeader>
                    <FaUser fill="var(--primaria)" />
                    <h6>Dados Pessoais</h6>
                </SectionHeader>
                
                <InfoGrid>
                    <div>
                        <FieldRow>
                            <FieldLabel>
                                <FaUser className="field-icon" />
                                Nome Completo:
                            </FieldLabel>
                            <FieldValue>
                                <HighlightValue>{candidato?.nome || '-'}</HighlightValue>
                            </FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaIdCard className="field-icon" />
                                CPF:
                            </FieldLabel>
                            <FieldValue>{formatarCPF(candidato?.cpf)}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaCalendarAlt className="field-icon" />
                                Data de Nascimento:
                            </FieldLabel>
                            <FieldValue>{formatarData(candidato?.dt_nascimento)}</FieldValue>
                        </FieldRow>
                    </div>
                    
                    <div>
                        <FieldRow>
                            <FieldLabel>
                                <FaPhone className="field-icon" />
                                Telefone:
                            </FieldLabel>
                            <FieldValue>
                                {candidato?.ddi && candidato?.ddd && candidato?.telefone ? 
                                    `+${candidato.ddi} (${candidato.ddd}) ${candidato.telefone}` : 
                                    '-'
                                }
                            </FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaEnvelope className="field-icon" />
                                E-mail Corporativo:
                            </FieldLabel>
                            <FieldValue>{candidato?.email || '-'}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaEnvelope className="field-icon" />
                                E-mail Pessoal:
                            </FieldLabel>
                            <FieldValue>{candidato?.email_pessoal || '-'}</FieldValue>
                        </FieldRow>
                    </div>
                </InfoGrid>
                
                <SectionTitle>Informações Pessoais</SectionTitle>
                
                <InfoGrid>
                    <div>
                        <FieldRow>
                            <FieldLabel>
                                <FaUser className="field-icon" />
                                Cor/Raça:
                            </FieldLabel>
                            <FieldValue>{candidato?.cor_raca?.descricao || getDescricaoCorRaca(candidato?.cor_raca) || '-'}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaUser className="field-icon" />
                                Gênero:
                            </FieldLabel>
                            <FieldValue>{candidato?.genero?.descricao || getDescricaoGenero(candidato?.genero) || '-'}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaUser className="field-icon" />
                                Estado Civil:
                            </FieldLabel>
                            <FieldValue>{candidato?.estado_civil?.descricao || getDescricaoEstadoCivil(candidato?.estado_civil) || '-'}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaUser className="field-icon" />
                                Nacionalidade:
                            </FieldLabel>
                            <FieldValue>{candidato?.nacionalidade?.descricao || getDescricaoNacionalidade(candidato?.nacionalidade) || '-'}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaUser className="field-icon" />
                                Naturalidade:
                            </FieldLabel>
                            <FieldValue>{candidato?.naturalidade || '-'}</FieldValue>
                        </FieldRow>
                    </div>
                    
                    <div>
                        <FieldRow>
                            <FieldLabel>
                                <FaMapMarkerAlt className="field-icon" />
                                Endereço:
                            </FieldLabel>
                            <FieldValue>
                                {candidato?.rua && candidato?.numero && candidato?.bairro ? 
                                    `${candidato.rua}, ${candidato.numero} - ${candidato.bairro}` : 
                                    '-'
                                }
                            </FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaMapMarkerAlt className="field-icon" />
                                Cidade/Estado:
                            </FieldLabel>
                            <FieldValue>
                                {candidato?.cidade && candidato?.estado ? 
                                    `${candidato.cidade}/${candidato.estado}` : 
                                    '-'
                                }
                            </FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaMapMarkerAlt className="field-icon" />
                                CEP:
                            </FieldLabel>
                            <FieldValue>{formatarCEP(candidato?.cep)}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaMapMarkerAlt className="field-icon" />
                                Tipo de Logradouro:
                            </FieldLabel>
                            <FieldValue>{candidato?.tipo_rua?.descricao || '-'}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaMapMarkerAlt className="field-icon" />
                                Complemento:
                            </FieldLabel>
                            <FieldValue>{candidato?.complemento || '-'}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaMapMarkerAlt className="field-icon" />
                                Tipo de Bairro:
                            </FieldLabel>
                            <FieldValue>{candidato?.tipo_bairro?.descricao || '-'}</FieldValue>
                        </FieldRow>
                    </div>
                </InfoGrid>
                
                <SectionTitle>Documentos Pessoais</SectionTitle>
                
                <InfoGrid>
                    <div>
                        <FieldRow>
                            <FieldLabel>
                                <FaIdCard className="field-icon" />
                                PIS/PASEP:
                            </FieldLabel>
                            <FieldValue>{candidato?.pispasep || '-'}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaIdCard className="field-icon" />
                                Cartão SUS:
                            </FieldLabel>
                            <FieldValue>{candidato?.numero_cartao_sus || '-'}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaIdCard className="field-icon" />
                                CTPS:
                            </FieldLabel>
                            <FieldValue>{candidato?.carteira_trabalho || '-'}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaIdCard className="field-icon" />
                                Série CTPS:
                            </FieldLabel>
                            <FieldValue>{candidato?.serie_carteira_trab || '-'}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaIdCard className="field-icon" />
                                UF CTPS:
                            </FieldLabel>
                            <FieldValue>{candidato?.uf_carteira_trab || '-'}</FieldValue>
                        </FieldRow>
                    </div>
                    
                    <div>
                        <FieldRow>
                            <FieldLabel>
                                <FaIdCard className="field-icon" />
                                CNH:
                            </FieldLabel>
                            <FieldValue>{candidato?.carteira_motorista || '-'}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaIdCard className="field-icon" />
                                Tipo CNH:
                            </FieldLabel>
                            <FieldValue>{candidato?.tipo_carteira_habilit || '-'}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaIdCard className="field-icon" />
                                RG:
                            </FieldLabel>
                            <FieldValue>{candidato?.identidade || '-'}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaIdCard className="field-icon" />
                                UF RG:
                            </FieldLabel>
                            <FieldValue>{candidato?.uf_identidade || '-'}</FieldValue>
                        </FieldRow>
                    </div>
                </InfoGrid>
                
                <SectionTitle>Título de Eleitor</SectionTitle>
                
                <InfoGrid>
                    <div>
                        <FieldRow>
                            <FieldLabel>
                                <FaIdCard className="field-icon" />
                                Título de Eleitor:
                            </FieldLabel>
                            <FieldValue>{candidato?.titulo_eleitor || '-'}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaIdCard className="field-icon" />
                                Zona do Título:
                            </FieldLabel>
                            <FieldValue>{candidato?.zona_titulo_eleitor || '-'}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaIdCard className="field-icon" />
                                Seção do Título:
                            </FieldLabel>
                            <FieldValue>{candidato?.secao_titulo_eleitor || '-'}</FieldValue>
                        </FieldRow>
                    </div>
                    
                    <div>
                        <FieldRow>
                            <FieldLabel>
                                <FaCalendarAlt className="field-icon" />
                                Data do Título:
                            </FieldLabel>
                            <FieldValue>{formatarData(candidato?.data_titulo_eleitor)}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaIdCard className="field-icon" />
                                Estado Emissor do Título:
                            </FieldLabel>
                            <FieldValue>{candidato?.estado_emissor_tit_eleitor || '-'}</FieldValue>
                        </FieldRow>
                    </div>
                </InfoGrid>
                
                <SectionTitle>Passaporte</SectionTitle>
                
                <InfoGrid>
                    <div>
                        <FieldRow>
                            <FieldLabel>
                                <FaIdCard className="field-icon" />
                                Número do Passaporte:
                            </FieldLabel>
                            <FieldValue>{candidato?.numero_passaporte || '-'}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaMapMarkerAlt className="field-icon" />
                                País de Origem:
                            </FieldLabel>
                            <FieldValue>{candidato?.pais_origem || '-'}</FieldValue>
                        </FieldRow>
                    </div>
                    
                    <div>
                        <FieldRow>
                            <FieldLabel>
                                <FaCalendarAlt className="field-icon" />
                                Data de Emissão do Passaporte:
                            </FieldLabel>
                            <FieldValue>{formatarData(candidato?.data_emissao_passaporte)}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaCalendarAlt className="field-icon" />
                                Data de Validade do Passaporte:
                            </FieldLabel>
                            <FieldValue>{formatarData(candidato?.data_validade_passaporte)}</FieldValue>
                        </FieldRow>
                    </div>
                </InfoGrid>
                
                <SectionTitle>Documento Estrangeiro/RNM</SectionTitle>
                
                <InfoGrid>
                    <div>
                        <FieldRow>
                            <FieldLabel>
                                <FaIdCard className="field-icon" />
                                Número do RNM:
                            </FieldLabel>
                            <FieldValue>{candidato?.rnm || '-'}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaIdCard className="field-icon" />
                                Decreto de Imigração:
                            </FieldLabel>
                            <FieldValue>{candidato?.decreto_imigracao || '-'}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaIdCard className="field-icon" />
                                UF Emissor do RNM:
                            </FieldLabel>
                            <FieldValue>{candidato?.uf_emissor_rnm || '-'}</FieldValue>
                        </FieldRow>
                    </div>
                    
                    <div>
                        <FieldRow>
                            <FieldLabel>
                                <FaCalendarAlt className="field-icon" />
                                Data de Emissão do RNM:
                            </FieldLabel>
                            <FieldValue>{formatarData(candidato?.data_emissao_rnm)}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaCalendarAlt className="field-icon" />
                                Data de Vencimento do RNM:
                            </FieldLabel>
                            <FieldValue>{formatarData(candidato?.data_vencimento_rnm)}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaMapMarkerAlt className="field-icon" />
                                País:
                            </FieldLabel>
                            <FieldValue>{getDescricaoPais(candidato?.pais)}</FieldValue>
                        </FieldRow>
                    </div>
                </InfoGrid>
            </SectionCard>

            <SectionDivider />

            <SectionCard>
                <SectionHeader>
                    <FaBuilding fill="var(--primaria)" />
                    <h6>Dados Contratuais</h6>
                </SectionHeader>
                
                <InfoGrid>
                    <div>
                        <FieldRow>
                            <FieldLabel>
                                <FaCalendarAlt className="field-icon" />
                                Data de Admissão:
                            </FieldLabel>
                            <FieldValue>
                                <HighlightValue>{formatarData(candidato?.dt_admissao)}</HighlightValue>
                            </FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaBuilding className="field-icon" />
                                Filial:
                            </FieldLabel>
                            <FieldValue>{getDescricaoFilial(candidato?.filial)}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaBuilding className="field-icon" />
                                Seção:
                            </FieldLabel>
                            <FieldValue>{getDescricaoSecao(candidato?.id_secao)}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaUser className="field-icon" />
                                Função:
                            </FieldLabel>
                            <FieldValue>{getDescricaoFuncao(candidato?.id_funcao)}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaBuilding className="field-icon" />
                                Centro de Custo:
                            </FieldLabel>
                            <FieldValue>{getDescricaoCentroCusto(candidato?.centro_custo)}</FieldValue>
                        </FieldRow>
                    </div>
                    
                    <div>
                        <FieldRow>
                            <FieldLabel>
                                <FaCalendarAlt className="field-icon" />
                                Horário:
                            </FieldLabel>
                            <FieldValue>{getDescricaoHorario(candidato?.id_horario)}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaBuilding className="field-icon" />
                                Sindicato:
                            </FieldLabel>
                            <FieldValue>
                                {getDescricaoSindicato(candidato?.sindicato)}
                            </FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaUser className="field-icon" />
                                Tipo de Admissão:
                            </FieldLabel>
                            <FieldValue>{candidato?.tipo_admissao?.descricao || getDescricaoTipoAdmissao(candidato?.tipo_admissao) || '-'}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaUser className="field-icon" />
                                Motivo da Admissão:
                            </FieldLabel>
                            <FieldValue>{candidato?.motivo_admissao?.descricao || getDescricaoMotivoAdmissao(candidato?.motivo_admissao) || '-'}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaUser className="field-icon" />
                                Situação:
                            </FieldLabel>
                            <FieldValue>{candidato?.tipo_situacao?.descricao || getDescricaoTipoSituacao(candidato?.tipo_situacao) || '-'}</FieldValue>
                        </FieldRow>
                    </div>
                </InfoGrid>
                
                <SectionTitle>Informações Financeiras</SectionTitle>
                
                <InfoGrid>
                    <div>
                        <FieldRow>
                            <FieldLabel>
                                <FaMoneyBillWave className="field-icon" />
                                Salário:
                            </FieldLabel>
                            <FieldValue>
                                {candidato?.salario ? 
                                    <HighlightValue>{formatarValorMonetario(candidato.salario)}</HighlightValue> : 
                                    '-'
                                }
                            </FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaCalendarAlt className="field-icon" />
                                Jornada:
                            </FieldLabel>
                            <FieldValue>{candidato?.jornada || '-'}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaMoneyBillWave className="field-icon" />
                                Tipo de Recebimento:
                            </FieldLabel>
                            <FieldValue>{candidato?.tipo_recebimento?.descricao || getDescricaoTipoRecebimento(candidato?.tipo_recebimento) || '-'}</FieldValue>
                        </FieldRow>
                    </div>
                    
                    <div>
                        <FieldRow>
                            <FieldLabel>
                                <FaUser className="field-icon" />
                                Tipo de Funcionário:
                            </FieldLabel>
                            <FieldValue>{candidato?.tipo_funcionario?.descricao || getDescricaoTipoFuncionario(candidato?.tipo_funcionario) || '-'}</FieldValue>
                        </FieldRow>
                    </div>
                </InfoGrid>
                
                <FieldRow>
                    <FieldLabel>Calcula INSS:</FieldLabel>
                    <FieldValue>
                        {getStatusIcon(candidato?.calcula_inss)}
                        {getStatusTag(candidato?.calcula_inss)}
                    </FieldValue>
                </FieldRow>
                
                <FieldRow>
                    <FieldLabel>Calcula IRRF:</FieldLabel>
                    <FieldValue>
                        {getStatusIcon(candidato?.calcula_irrf)}
                        {getStatusTag(candidato?.calcula_irrf)}
                    </FieldValue>
                </FieldRow>
                
                <FieldRow>
                    <FieldLabel>Função de Confiança:</FieldLabel>
                    <FieldValue>
                        {getStatusIcon(candidato?.confianca)}
                        {getStatusTag(candidato?.confianca)}
                    </FieldValue>
                </FieldRow>
                
                {candidato?.confianca && (
                    <FieldRow>
                        <FieldLabel>Função de Confiança/Cargo:</FieldLabel>
                        <FieldValue>{candidato?.funcao_confianca?.nome || '-'}</FieldValue>
                    </FieldRow>
                )}
                
                <FieldRow>
                    <FieldLabel>Letra:</FieldLabel>
                    <FieldValue>{getDescricaoLetra(candidato?.letra)}</FieldValue>
                </FieldRow>
                
                <FieldRow>
                    <FieldLabel>Indicativo de Admissão:</FieldLabel>
                    <FieldValue>{getDescricaoIndicativoAdmissao(candidato?.indicativo_admissao)}</FieldValue>
                </FieldRow>
                
                <FieldRow>
                    <FieldLabel>Tipo de Regime Trabalhista:</FieldLabel>
                    <FieldValue>{getDescricaoTipoRegimeTrabalhista(candidato?.tipo_regime_trabalhista)}</FieldValue>
                </FieldRow>
                
                <FieldRow>
                    <FieldLabel>Tipo de Regime Previdenciário:</FieldLabel>
                    <FieldValue>{getDescricaoTipoRegimePrevidenciario(candidato?.tipo_regime_previdenciario)}</FieldValue>
                </FieldRow>
                
                <FieldRow>
                    <FieldLabel>Tipo de Regime da Jornada:</FieldLabel>
                    <FieldValue>{getDescricaoTipoRegimeJornada(candidato?.tipo_regime_jornada)}</FieldValue>
                </FieldRow>
                
                <FieldRow>
                    <FieldLabel>Função/Emprego/Cargo Acumulável:</FieldLabel>
                    <FieldValue>
                        {getStatusIcon(candidato?.funcao_emprego_cargoacumulavel)}
                        {getStatusTag(candidato?.funcao_emprego_cargoacumulavel)}
                    </FieldValue>
                </FieldRow>
            </SectionCard>

            <SectionDivider />

            <SectionCard>
                <SectionHeader>
                    <FaBuilding fill="var(--primaria)" />
                    <h6>Dados Bancários</h6>
                </SectionHeader>
                
                <SectionTitle>Informações Bancárias</SectionTitle>
                
                <InfoGrid>
                    <div>
                        <FieldRow>
                            <FieldLabel>
                                <FaBuilding className="field-icon" />
                                Banco:
                            </FieldLabel>
                            <FieldValue>
                                {candidato?.banco?.nome || 
                                 (carregandoBanco ? 'Carregando...' : nomeBanco) || 
                                 (candidato?.banco && typeof candidato.banco === 'string' ? 
                                  `Banco ${candidato.banco}` : 
                                  '-')
                                }
                            </FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaBuilding className="field-icon" />
                                Agência:
                            </FieldLabel>
                            <FieldValue>
                                {candidato?.agencia?.nome || 
                                 (carregandoAgencia ? 'Carregando...' : nomeAgencia) || 
                                 (candidato?.agencia ? `Agência ${candidato.agencia}` : 
                                  candidato?.agencia_nova ? `Nova Agência: ${candidato.agencia_nova}` : 
                                  '-')
                                }
                            </FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaMoneyBillWave className="field-icon" />
                                Conta:
                            </FieldLabel>
                            <FieldValue>{candidato?.conta_corrente || '-'}</FieldValue>
                        </FieldRow>
                        
                    </div>
                    
                    <div>                        
                        <FieldRow>
                            <FieldLabel>
                                <FaMoneyBillWave className="field-icon" />
                                Conta Corrente:
                            </FieldLabel>
                            <FieldValue>{candidato?.conta_corrente || '-'}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaMoneyBillWave className="field-icon" />
                                Conta Operação:
                            </FieldLabel>
                            <FieldValue>{candidato?.conta_operacao || '-'}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaMoneyBillWave className="field-icon" />
                                PIX:
                            </FieldLabel>
                            <FieldValue>{candidato?.pix || '-'}</FieldValue>
                        </FieldRow>
                    </div>
                </InfoGrid>
            </SectionCard>

            {dependentes && dependentes.length > 0 && (
                <>
                    <SectionDivider />
                    <SectionCard>
                        <SectionHeader>
                            <FaUsers fill="var(--primaria)" />
                            <h6>Dependentes ({dependentes.length})</h6>
                        </SectionHeader>
                    
                    {dependentes.map((dependente, index) => (
                        <DependenteCard key={index}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <div style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '50%', 
                                    background: 'var(--primaria-100)', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    color: 'var(--primaria)',
                                    fontSize: '16px',
                                    fontWeight: '600'
                                }}>
                                    {index + 1}
                                </div>
                                <div>
                                    <h6 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'var(--text-color)' }}>
                                        {dependente.nome_depend || 'Dependente'}
                                    </h6>
                                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-color-secondary)' }}>
                                        {dependente.grau_parentesco?.descricao || getDescricaoGrauParentesco(dependente.grau_parentesco_id_origem) || 'Parentesco não informado'}
                                    </p>
                                </div>
                            </div>
                            
                            <InfoGrid>
                                <div>
                                    <FieldRow>
                                        <FieldLabel>
                                            <FaIdCard className="field-icon" />
                                            Número do Dependente:
                                        </FieldLabel>
                                        <FieldValue>{dependente.nrodepend || '-'}</FieldValue>
                                    </FieldRow>
                                    
                                    <FieldRow>
                                        <FieldLabel>
                                            <FaCalendarAlt className="field-icon" />
                                            Data de Nascimento:
                                        </FieldLabel>
                                        <FieldValue>{formatarData(dependente.dt_nascimento)}</FieldValue>
                                    </FieldRow>
                                    
                                    <FieldRow>
                                        <FieldLabel>
                                            <FaIdCard className="field-icon" />
                                            CPF:
                                        </FieldLabel>
                                        <FieldValue>{formatarCPF(dependente.cpf)}</FieldValue>
                                    </FieldRow>
                                    
                                    <FieldRow>
                                        <FieldLabel>
                                            <FaUser className="field-icon" />
                                            Gênero:
                                        </FieldLabel>
                                        <FieldValue>
                                            {dependente.genero?.descricao || getDescricaoPorCodigo(dependente.genero_id_origem, opcoesDominio.genero || []) || '-'}
                                        </FieldValue>
                                    </FieldRow>
                                    
                                    <FieldRow>
                                        <FieldLabel>
                                            <FaUser className="field-icon" />
                                            Estado Civil:
                                        </FieldLabel>
                                        <FieldValue>
                                            {dependente.estado_civil?.descricao || getDescricaoPorCodigo(dependente.estado_civil_id_origem, opcoesDominio.estado_civil || []) || '-'}
                                        </FieldValue>
                                    </FieldRow>
                                    
                                    <FieldRow>
                                        <FieldLabel>
                                            <FaUser className="field-icon" />
                                            Nome da Mãe:
                                        </FieldLabel>
                                        <FieldValue>{dependente.nome_mae || '-'}</FieldValue>
                                    </FieldRow>
                                </div>
                                
                                <div>
                                    <FieldRow>
                                        <FieldLabel>
                                            <FaBuilding className="field-icon" />
                                            Cartório:
                                        </FieldLabel>
                                        <FieldValue>{dependente.cartorio || '-'}</FieldValue>
                                    </FieldRow>
                                    
                                    <FieldRow>
                                        <FieldLabel>
                                            <FaIdCard className="field-icon" />
                                            Número do Registro:
                                        </FieldLabel>
                                        <FieldValue>{dependente.nroregistro || '-'}</FieldValue>
                                    </FieldRow>
                                    
                                    <FieldRow>
                                        <FieldLabel>
                                            <FaIdCard className="field-icon" />
                                            Número do Livro:
                                        </FieldLabel>
                                        <FieldValue>{dependente.nrolivro || '-'}</FieldValue>
                                    </FieldRow>
                                    
                                    <FieldRow>
                                        <FieldLabel>
                                            <FaIdCard className="field-icon" />
                                            Número da Folha:
                                        </FieldLabel>
                                        <FieldValue>{dependente.nrofolha || '-'}</FieldValue>
                                    </FieldRow>
                                    
                                    <FieldRow>
                                        <FieldLabel>
                                            <FaIdCard className="field-icon" />
                                            Número SUS:
                                        </FieldLabel>
                                        <FieldValue>{dependente.nrosus || '-'}</FieldValue>
                                    </FieldRow>
                                    
                                    <FieldRow>
                                        <FieldLabel>
                                            <FaIdCard className="field-icon" />
                                            Número Nascido Vivo:
                                        </FieldLabel>
                                        <FieldValue>{dependente.nronascidovivo || '-'}</FieldValue>
                                    </FieldRow>
                                </div>
                            </InfoGrid>
                            
                            <SectionTitle>Incidências</SectionTitle>
                            
                            <InfoGrid>
                                <div>
                                    <FieldRow>
                                        <FieldLabel>
                                            <FaMoneyBillWave className="field-icon" />
                                            Incidência IRRF:
                                        </FieldLabel>
                                        <FieldValue>
                                            {getStatusIcon(dependente.incidencia_irrf)}
                                            {getStatusTag(dependente.incidencia_irrf)}
                                        </FieldValue>
                                    </FieldRow>
                                    
                                    <FieldRow>
                                        <FieldLabel>
                                            <FaMoneyBillWave className="field-icon" />
                                            Incidência INSS:
                                        </FieldLabel>
                                        <FieldValue>
                                            {getStatusIcon(dependente.incidencia_inss)}
                                            {getStatusTag(dependente.incidencia_inss)}
                                        </FieldValue>
                                    </FieldRow>
                                    
                                    <FieldRow>
                                        <FieldLabel>
                                            <FaMoneyBillWave className="field-icon" />
                                            Incidência Assistência Médica:
                                        </FieldLabel>
                                        <FieldValue>
                                            {getStatusIcon(dependente.incidencia_assist_medica)}
                                            {getStatusTag(dependente.incidencia_assist_medica)}
                                        </FieldValue>
                                    </FieldRow>
                                </div>
                                
                                <div>
                                    <FieldRow>
                                        <FieldLabel>
                                            <FaMoneyBillWave className="field-icon" />
                                            Incidência Assistência Odontológica:
                                        </FieldLabel>
                                        <FieldValue>
                                            {getStatusIcon(dependente.incidencia_assist_odonto)}
                                            {getStatusTag(dependente.incidencia_assist_odonto)}
                                        </FieldValue>
                                    </FieldRow>
                                    
                                    <FieldRow>
                                        <FieldLabel>
                                            <FaMoneyBillWave className="field-icon" />
                                            Incidência Pensão:
                                        </FieldLabel>
                                        <FieldValue>
                                            {getStatusIcon(dependente.incidencia_pensao)}
                                            {getStatusTag(dependente.incidencia_pensao)}
                                        </FieldValue>
                                    </FieldRow>
                                    
                                    <FieldRow>
                                        <FieldLabel>
                                            <FaMoneyBillWave className="field-icon" />
                                            Incidência Salário Família:
                                        </FieldLabel>
                                        <FieldValue>
                                            {getStatusIcon(dependente.incidencia_sal_familia)}
                                            {getStatusTag(dependente.incidencia_sal_familia)}
                                        </FieldValue>
                                    </FieldRow>
                                </div>
                            </InfoGrid>
                            
                            <FieldRow>
                                <FieldLabel>
                                    <FaIdCard className="field-icon" />
                                    Cartão de Vacina:
                                </FieldLabel>
                                <FieldValue>
                                    {getStatusIcon(dependente.cartao_vacina)}
                                    {getStatusTag(dependente.cartao_vacina)}
                                </FieldValue>
                            </FieldRow>
                        </DependenteCard>
                    ))}
                    </SectionCard>
                </>
            )}

            <SectionDivider />

            <SectionCard>
                <SectionHeader>
                    <FaGraduationCap fill="var(--primaria)" />
                    <h6>Formação Acadêmica</h6>
                </SectionHeader>
                
                <FieldRow>
                    <FieldLabel>
                        <FaGraduationCap className="field-icon" />
                        Grau de Instrução:
                    </FieldLabel>
                    <FieldValue>
                        <HighlightValue>{candidato?.grau_instrucao?.descricao || '-'}</HighlightValue>
                    </FieldValue>
                </FieldRow>
                
                {educacao && educacao.length > 0 && (
                    <>
                        <SectionTitle>Formações Adicionais ({educacao.length})</SectionTitle>
                    
                        {educacao.map((formacao, index) => (
                            <EducacaoCard key={index}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <div style={{ 
                                        width: '40px', 
                                        height: '40px', 
                                        borderRadius: '50%', 
                                        background: 'var(--primaria-100)', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        color: 'var(--primaria)',
                                        fontSize: '16px',
                                        fontWeight: '600'
                                    }}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h6 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'var(--text-color)' }}>
                                            {formacao.curso || 'Curso não informado'}
                                        </h6>
                                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-color-secondary)' }}>
                                            {formacao.instituicao || 'Instituição não informada'}
                                        </p>
                                    </div>
                                </div>
                                
                                <InfoGrid>
                                    <div>
                                        <FieldRow>
                                            <FieldLabel>
                                                <FaGraduationCap className="field-icon" />
                                                Nível:
                                            </FieldLabel>
                                            <FieldValue>{formacao.nivel?.descricao || getDescricaoNivel(formacao.nivel) || '-'}</FieldValue>
                                        </FieldRow>
                                        
                                        <FieldRow>
                                            <FieldLabel>
                                                <FaCalendarAlt className="field-icon" />
                                                Data de Conclusão:
                                            </FieldLabel>
                                            <FieldValue>{formatarData(formacao.dt_conclusao)}</FieldValue>
                                        </FieldRow>
                                    </div>
                                    
                                    <div>
                                        <FieldRow>
                                            <FieldLabel>
                                                <FaCheck className="field-icon" />
                                                Status:
                                            </FieldLabel>
                                            <FieldValue>{formacao.status?.descricao || getDescricaoStatus(formacao.status) || '-'}</FieldValue>
                                        </FieldRow>
                                    </div>
                                </InfoGrid>
                            </EducacaoCard>
                        ))}
                    </>
                )}
                
                {(!educacao || educacao.length === 0) && (
                    <EmptyState>Nenhuma formação adicional cadastrada</EmptyState>
                )}
            </SectionCard>

            <SectionDivider />

            <SectionCard>
                <SectionHeader>
                    <FaFileAlt fill="var(--primaria)" />
                    <h6>Documentos</h6>
                </SectionHeader>
                
                {documentos && documentos.length > 0 ? (
                    documentos.map((doc, index) => (
                        <DocumentoCard key={index} upload_feito={doc.upload_feito}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <div style={{ 
                                    width: '32px', 
                                    height: '32px', 
                                    borderRadius: '50%', 
                                    background: doc.upload_feito ? 'var(--green-100)' : 'var(--red-100)', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    color: doc.upload_feito ? 'var(--green-600)' : 'var(--red-600)',
                                    fontSize: '14px'
                                }}>
                                    {doc.upload_feito ? <FaCheck /> : <FaTimes />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h6 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'var(--text-color)' }}>
                                        {doc.nome}
                                    </h6>
                                    {doc.obrigatorio && (
                                        <StatusTag value="Obrigatório" severity="warning" style={{ fontSize: '10px', padding: '2px 6px' }} />
                                    )}
                                </div>
                                <div>
                                    {getStatusTag(doc.upload_feito)}
                                </div>
                            </div>
                            
                            {doc.itens && doc.itens.length > 0 && (
                                <div style={{ marginTop: '12px', padding: '8px', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '6px' }}>
                                    <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-color-secondary)', marginBottom: '8px' }}>
                                        Itens do documento:
                                    </div>
                                    {doc.itens.map((item, itemIndex) => (
                                        <div key={itemIndex} style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '8px', 
                                            marginBottom: '4px',
                                            fontSize: '12px',
                                            color: 'var(--text-color-secondary)'
                                        }}>
                                            <span style={{ 
                                                color: item.upload_feito ? 'var(--green-600)' : 'var(--red-600)',
                                                fontSize: '10px'
                                            }}>
                                                {item.upload_feito ? '✓' : '✗'}
                                            </span>
                                            <span>{item.nome}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </DocumentoCard>
                    ))
                ) : (
                    <EmptyState>Nenhum documento obrigatório</EmptyState>
                )}
            </SectionCard>

            <SectionDivider />

            <SectionCard>
                <SectionHeader>
                    <FaFileAlt fill="var(--primaria)" />
                    <h6>Dados Adicionais</h6>
                </SectionHeader>
                
                <SectionTitle>Informações FGTS</SectionTitle>
                
                <InfoGrid>
                    <div>
                        <FieldRow>
                            <FieldLabel>
                                <FaMoneyBillWave className="field-icon" />
                                FGTS - Situação:
                            </FieldLabel>
                            <FieldValue>{candidato?.codigo_situacao_fgts?.descricao || getDescricaoCodigoSituacaoFgts(candidato?.codigo_situacao_fgts) || '-'}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaCalendarAlt className="field-icon" />
                                Data Opção FGTS:
                            </FieldLabel>
                            <FieldValue>{formatarData(candidato?.dt_opcao_fgts)}</FieldValue>
                        </FieldRow>
                    </div>
                </InfoGrid>
                
                <SectionTitle>Informações eSocial</SectionTitle>
                
                <InfoGrid>
                    <div>
                        <FieldRow>
                            <FieldLabel>
                                <FaFileAlt className="field-icon" />
                                Código Categoria eSocial:
                            </FieldLabel>
                            <FieldValue>{candidato?.codigo_categoria_esocial?.descricao || getDescricaoCodigoCategoriaEsocial(candidato?.codigo_categoria_esocial) || '-'}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaFileAlt className="field-icon" />
                                Natureza Atividade eSocial:
                            </FieldLabel>
                            <FieldValue>{candidato?.natureza_atividade_esocial?.descricao || getDescricaoNaturezaAtividadeEsocial(candidato?.natureza_atividade_esocial) || '-'}</FieldValue>
                        </FieldRow>
                    </div>
                </InfoGrid>
                
                <SectionTitle>Informações SEFIP</SectionTitle>
                
                <InfoGrid>
                    <div>
                        <FieldRow>
                            <FieldLabel>
                                <FaFileAlt className="field-icon" />
                                Código Ocorrência SEFIP:
                            </FieldLabel>
                            <FieldValue>{getDescricaoCodigoOcorrenciaSefip(candidato?.codigo_ocorrencia_sefip)}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaFileAlt className="field-icon" />
                                Código Categoria SEFIP:
                            </FieldLabel>
                            <FieldValue>{getDescricaoCodigoCategoriaSefip(candidato?.codigo_categoria_sefip)}</FieldValue>
                        </FieldRow>
                    </div>
                </InfoGrid>
                
                <SectionTitle>Informações Financeiras Adicionais</SectionTitle>
                
                <InfoGrid>
                    <div>
                        <FieldRow>
                            <FieldLabel>
                                <FaMoneyBillWave className="field-icon" />
                                Percentual Adiantamento:
                            </FieldLabel>
                            <FieldValue>{candidato?.perc_adiantamento || '-'}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaMoneyBillWave className="field-icon" />
                                Ajuda de Custo:
                            </FieldLabel>
                            <FieldValue>
                                {formatarValorMonetario(candidato?.ajuda_custo)}
                            </FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaMoneyBillWave className="field-icon" />
                                Arredondamento:
                            </FieldLabel>
                            <FieldValue>
                                {formatarValorMonetario(candidato?.arredondamento)}
                            </FieldValue>
                        </FieldRow>
                    </div>
                    
                    <div>
                        <FieldRow>
                            <FieldLabel>
                                <FaMoneyBillWave className="field-icon" />
                                Média Salário Maternidade:
                            </FieldLabel>
                            <FieldValue>
                                {formatarValorMonetario(candidato?.media_sal_maternidade)}
                            </FieldValue>
                        </FieldRow>
                    </div>
                </InfoGrid>
                
                <SectionTitle>Informações Contratuais</SectionTitle>
                
                <InfoGrid>
                    <div>
                        <FieldRow>
                            <FieldLabel>
                                <FaFileAlt className="field-icon" />
                                Contrato de Trabalho em Tempo Parcial:
                            </FieldLabel>
                            <FieldValue>{getDescricaoContratoTempoParcial(candidato?.contrato_tempo_parcial)}</FieldValue>
                        </FieldRow>
                        
                        <FieldRow>
                            <FieldLabel>
                                <FaFileAlt className="field-icon" />
                                Tipo de Contrato Prazo Determinado:
                            </FieldLabel>
                            <FieldValue>{getDescricaoTipoContratoPrazoDeterminado(candidato?.tipo_contrato_prazo_determinado)}</FieldValue>
                        </FieldRow>
                    </div>
                    
                    <div>
                        <FieldRow>
                            <FieldLabel>
                                <FaFileAlt className="field-icon" />
                                Tipo de Contrato de Trabalho:
                            </FieldLabel>
                            <FieldValue>{getDescricaoTipoContratoTrabalho(candidato?.tipo_contrato_trabalho)}</FieldValue>
                        </FieldRow>
                    </div>
                </InfoGrid>
            </SectionCard>

            {anotacoes && (
                <>
                    <SectionDivider />
                    <SectionCard>
                        <SectionHeader>
                            <FaClipboardList fill="var(--primaria)" />
                            <h6>Anotações</h6>
                        </SectionHeader>
                    
                    <div style={{ 
                        background: 'var(--surface-50)', 
                        border: '1px solid var(--surface-border)', 
                        borderRadius: '8px', 
                        padding: '16px',
                        marginTop: '8px'
                    }}>
                        <div style={{ 
                            fontSize: '14px', 
                            lineHeight: '1.6', 
                            color: 'var(--text-color)',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                        }}>
                            {anotacoes || '-'}
                        </div>
                    </div>
                    </SectionCard>
                </>
            )}

            {self && lgpdAceito !== undefined && (
                <>
                    <SectionDivider />
                    <SectionCard>
                        <SectionHeader>
                            <FaShieldAlt fill="var(--primaria)" />
                            <h6>LGPD</h6>
                        </SectionHeader>
                    
                    <FieldRow>
                        <FieldLabel>Termo de Consentimento:</FieldLabel>
                        <FieldValue>
                            {getStatusIcon(lgpdAceito)}
                            {getStatusTag(lgpdAceito)}
                        </FieldValue>
                    </FieldRow>
                    </SectionCard>
                </>
            )}

        </Container>
    );
};

export default StepRevisao;
