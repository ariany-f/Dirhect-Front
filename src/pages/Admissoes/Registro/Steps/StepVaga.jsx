import React, { useMemo, useState, useEffect } from 'react';
import { useCandidatoContext } from '@contexts/Candidato';
import CampoTexto from '@components/CampoTexto';
import DropdownItens from '@components/DropdownItens';
import styled from 'styled-components';
import CheckboxContainer from '@components/CheckboxContainer';

const GridContainer = styled.div`
    padding: 20px 10px 10px 10px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    align-items: start;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 16px;
    }
`;

const StepVaga = ({ filiais, departamentos, secoes, centros_custo, horarios, funcoes, sindicatos, modoLeitura = false, opcoesDominio = {}, availableDominioTables = [] }) => {
    
    
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
                name: opcao.descricao,
                code: opcao.id_origem || opcao.codigo
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

    // Função para obter o valor selecionado no formato {name, code}
    const getValorSelecionado = useMemo(() => {
        return (campo, lista) => {
            if (!Array.isArray(lista)) return '';
            
            // Primeiro tenta pegar do dados_vaga
            const id = candidato?.dados_vaga?.[campo];
            if (id) {
                const item = lista.find(item => item.id === id);
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
                const item = lista.find(item => item.id === vagaId);
                if (item) {
                    return {
                        name: item.nome || item.descricao,
                        code: item.id
                    };
                }
            }

            return '';
        };
    }, [candidato?.dados_vaga, vaga]);

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
                return {
                    name: candidato[campo].descricao,
                    code: candidato[campo].id_origem || candidato[campo].id
                };
            }
            
            const code = String(candidato[campo]);
            const item = lista.find(item => String(item.code) === code);
            
            return item ? { name: item.name, code: item.code } : '';
        };
    }, [candidato]);

    // Memoizar as opções formatadas para evitar recriações desnecessárias
    const opcoesFiliais = useMemo(() => formatarOpcoes(filiais), [filiais, formatarOpcoes]);
    const opcoesDepartamentos = useMemo(() => formatarOpcoes(departamentos), [departamentos, formatarOpcoes]);
    const opcoesSecoes = useMemo(() => formatarOpcoes(secoes), [secoes, formatarOpcoes]);
    const opcoesCentrosCusto = useMemo(() => formatarOpcoes(centros_custo), [centros_custo, formatarOpcoes]);
    const opcoesHorarios = useMemo(() => formatarOpcoes(horarios, true), [horarios, formatarOpcoes]);
    const opcoesFuncoes = useMemo(() => formatarOpcoes(funcoes), [funcoes, formatarOpcoes]);
    const opcoesSindicatos = useMemo(() => formatarOpcoes(sindicatos, true), [sindicatos, formatarOpcoes]);

    // Memoizar as opções de domínio formatadas
    const opcoesTipoAdmissao = useMemo(() => formatarOpcoesDominio(opcoesDominio.tipo_admissao), [opcoesDominio.tipo_admissao, formatarOpcoesDominio]);
    const opcoesMotivoAdmissao = useMemo(() => formatarOpcoesDominio(opcoesDominio.motivo_admissao), [opcoesDominio.motivo_admissao, formatarOpcoesDominio]);
    const opcoesLetra = useMemo(() => formatarOpcoesDominio(opcoesDominio.letra), [opcoesDominio.letra, formatarOpcoesDominio]);
    
    // Usando _choices do payload para os campos especificados
    const opcoesContratoTempoParcial = useMemo(() => formatarOpcoesChoices(candidato.contrato_tempo_parcial_choices), [candidato, formatarOpcoesChoices]);
    const opcoesIndicativoAdmissao = useMemo(() => formatarOpcoesChoices(candidato.indicativo_admissao_choices, 'indicativo_admissao'), [candidato, formatarOpcoesChoices]);
    const opcoesTipoRegimeTrabalhista = useMemo(() => formatarOpcoesChoices(candidato.tipo_regime_trabalhista_choices, 'tipo_regime_trabalhista'), [candidato, formatarOpcoesChoices]);
    const opcoesTipoRegimeJornada = useMemo(() => formatarOpcoesChoices(candidato.tipo_regime_jornada_choices), [candidato, formatarOpcoesChoices]);
    const opcoesTipoRegimePrevidenciario = useMemo(() => formatarOpcoesChoices(candidato.tipo_regime_previdenciario_choices), [candidato, formatarOpcoesChoices]);
    

    
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
    
    return (
        <GridContainer>
            {/* Todos os Dropdowns agrupados */}
            <DropdownItens
                name="filial"
                valor={getValorSelecionado('filial_id', filiais)}
                setValor={valor => {
                    setCampo('dados_vaga', { 
                        ...candidato.dados_vaga, 
                        filial_id: valor.code,
                        filial_nome: valor.name
                    });
                }}
                options={opcoesFiliais}
                label="Filial"
                required={isCampoObrigatorio(filiais)}
                search
                filter
                disabled={modoLeitura}
            />
            <DropdownItens
                name="funcao"
                valor={getValorSelecionado('funcao_id', funcoes)}
                setValor={valor => {
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
                name="departamento"
                valor={getValorSelecionado('departamento_id', departamentos)}
                setValor={valor => {
                    setCampo('dados_vaga', { 
                        ...candidato.dados_vaga, 
                        departamento_id: valor.code,
                        departamento_nome: valor.name
                    });
                }}
                options={opcoesDepartamentos}
                label="Departamento"
                required={isCampoObrigatorio(departamentos)}
                search
                filter
                disabled={modoLeitura}
            />
            <DropdownItens
                name="secao"
                valor={getValorSelecionado('secao_id', secoes)}
                setValor={valor => {
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
                disabled={modoLeitura}
            />
            <DropdownItens
                name="centro_custo"
                valor={getValorSelecionado('centro_custo_id', centros_custo)}
                setValor={valor => {
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
                setValor={valor => {
                    setCampo('dados_vaga', { 
                        ...candidato.dados_vaga, 
                        horario_id: valor.code,
                        horario_nome: valor.name
                    });
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
                name="tipo_admissao"
                label="Tipo de Admissão"
                valor={getValorSelecionadoFromCandidato('tipo_admissao', opcoesTipoAdmissao)}
                setValor={(valor) => setCampo('tipo_admissao', valor.code)}
                options={opcoesTipoAdmissao} 
                disabled={modoLeitura}
            />
            <DropdownItens
                name="motivo_admissao"
                label="Motivo da Admissão"
                valor={getValorSelecionadoFromCandidato('motivo_admissao', opcoesMotivoAdmissao)}
                setValor={(valor) => setCampo('motivo_admissao', valor.code)}
                options={opcoesMotivoAdmissao} 
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
                name="tipo_funcionario"
                label="Tipo de Funcionário"
                valor={getValorSelecionadoFromCandidato('tipo_funcionario', opcoesTipoFuncionario)}
                setValor={(valor) => setCampo('tipo_funcionario', valor.code)}
                options={opcoesTipoFuncionario} 
                disabled={modoLeitura}
            />
            <DropdownItens
                name="codigo_categoria_esocial"
                label="Código Categoria eSocial"
                valor={getValorSelecionadoFromCandidato('codigo_categoria_esocial', opcoesCodigoCategoriaESocial)}
                setValor={(valor) => setCampo('codigo_categoria_esocial', valor.code)}
                options={opcoesCodigoCategoriaESocial}
                disabled={modoLeitura}
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
                name="tipo_recebimento"
                label="Tipo de Recebimento"
                valor={getValorSelecionadoFromCandidato('tipo_recebimento', opcoesTipoRecebimento)}
                setValor={(valor) => setCampo('tipo_recebimento', valor.code)}
                options={opcoesTipoRecebimento}
                disabled={modoLeitura}
            />

            <DropdownItens
                name="tipo_situacao"
                label="Situação"
                valor={getValorSelecionadoFromCandidato('tipo_situacao', opcoesTipoSituacao)}
                setValor={(valor) => setCampo('tipo_situacao', valor.code)}
                options={opcoesTipoSituacao}
                disabled={modoLeitura}
            />

            <DropdownItens
                name="codigo_ocorrencia_sefip"
                label="Código Ocorrência SEFIP"
                valor={getValorSelecionadoFromCandidato('codigo_ocorrencia_sefip', opcoesCodigoOcorrenciaSefip)}
                setValor={(valor) => setCampo('codigo_ocorrencia_sefip', valor.code)}
                options={opcoesCodigoOcorrenciaSefip}
                disabled={modoLeitura}
            />
            <DropdownItens
                name="codigo_categoria_sefip"
                label="Código Categoria SEFIP"
                valor={getValorSelecionadoFromCandidato('codigo_categoria_sefip', opcoesCodigoCategoriaSefip)}
                setValor={(valor) => setCampo('codigo_categoria_sefip', valor.code)}
                options={opcoesCodigoCategoriaSefip}
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

            <DropdownItens
                name="tipo_regime_previdenciario"
                label="Tipo de Regime Previdenciário"
                valor={getValorSelecionadoFromCandidato('tipo_regime_previdenciario', opcoesTipoRegimePrevidenciario)}
                setValor={(valor) => setCampo('tipo_regime_previdenciario', valor.code)}
                options={opcoesTipoRegimePrevidenciario}
                disabled={modoLeitura}
            />
            
            <DropdownItens
                name="contrato_tempo_parcial"
                label="Contrato de Trabalho em Tempo Parcial"
                valor={getValorSelecionadoFromCandidato('contrato_tempo_parcial', opcoesContratoTempoParcial)}
                setValor={(valor) => setCampo('contrato_tempo_parcial', valor.code)}
                options={opcoesContratoTempoParcial}
                disabled={modoLeitura}
            />

            {/* Todos os Campos de Texto agrupados */}
            <CampoTexto
                type="date"
                name="dt_admissao"
                label="Data de Admissão"
                valor={candidato.dt_admissao || ''}
                setValor={(valor) => setCampo('dt_admissao', valor)}
                disabled={modoLeitura}
            />
            <DropdownItens
                name="letra"
                label="Letra"
                valor={getValorSelecionadoFromCandidato('letra', opcoesLetra)}
                setValor={(valor) => setCampo('letra', valor.code)}
                options={opcoesLetra}
                disabled={modoLeitura}
            />

            {/* Todos os Checkboxes agrupados */}
            <CheckboxContainer
                label="Função/Emprego/Cargo Acumulável"
                checked={candidato.funcao_emprego_cargoacumulavel || false}
                onChange={(e) => setCampo('funcao_emprego_cargoacumulavel', e.target.checked)}
                disabled={modoLeitura}
            />
            <CheckboxContainer
                label="Mensal"
                checked={candidato.mensal || false}
                onChange={(e) => setCampo('mensal', e.target.checked)}
                disabled={modoLeitura}
            />
        </GridContainer>
    );
};

export default StepVaga; 