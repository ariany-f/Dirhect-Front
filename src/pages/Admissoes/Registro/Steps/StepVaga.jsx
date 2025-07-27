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

const StepVaga = ({ filiais, departamentos, secoes, cargos, centros_custo, horarios, funcoes, sindicatos, modoLeitura = false, opcoesDominio = {}, availableDominioTables = [] }) => {
    
    
    const { candidato, setCampo, vaga } = useCandidatoContext();
    const [jornadaDateError, setJornadaDateError] = useState('');

    useEffect(() => {
        setCampo('dt_mudanca_jornada', candidato.dt_admissao);
        setCampo('dt_mudanca_situacao', candidato.dt_admissao);
        setCampo('dt_mudanca_funcao', candidato.dt_admissao);
        setCampo('dt_mudanca_salario', candidato.dt_admissao);
        setCampo('dt_mudanca_categoria', candidato.dt_admissao);
        setCampo('dt_mudanca_tipo_funcionario', candidato.dt_admissao);
        setCampo('dt_mudanca_recebimento', candidato.dt_admissao);
        setCampo('dt_mudanca_horario', candidato.dt_admissao);
        setCampo('dt_mudanca_jornada', candidato.dt_admissao);
    }, [candidato.dt_admissao, setCampo]);

    useEffect(() => {
        if (candidato.dt_mudanca_jornada && candidato.dt_admissao && candidato.dt_mudanca_jornada !== candidato.dt_admissao) {
            setJornadaDateError('A data de opção deve ser igual à data de admissão');
        } else {
            setJornadaDateError('');
        }
    }, [candidato.dt_mudanca_jornada, candidato.dt_admissao]);

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
            if (!Array.isArray(lista) || !candidato || !candidato[campo]) return '';
            
            const code = candidato[campo];
            const item = lista.find(item => (item.id_origem || item.codigo) === code);
            
            return item ? { name: item.descricao, code: (item.id_origem || item.codigo) } : '';
        };
    }, [candidato]);

    // Função para obter o salário (prioriza dados_candidato)
    const getSalario = useMemo(() => {
        if (candidato?.salario) {
            return candidato.salario;
        }
        return candidato?.dados_vaga?.salario || '';
    }, [candidato?.salario, candidato?.dados_vaga?.salario]);

    // Função para atualizar o salário
    const setSalario = (valor) => {
        // Se já existe salário no dados_candidato, atualiza lá
        if (candidato?.salario) {
            setCampo('salario', valor);
        } else {
            // Se não existe, atualiza no dados_vaga
            setCampo('dados_vaga', { 
                ...candidato.dados_vaga, 
                salario: valor 
            });
        }
    };

    // Memoizar as opções formatadas para evitar recriações desnecessárias
    const opcoesFiliais = useMemo(() => formatarOpcoes(filiais), [filiais, formatarOpcoes]);
    const opcoesDepartamentos = useMemo(() => formatarOpcoes(departamentos), [departamentos, formatarOpcoes]);
    const opcoesSecoes = useMemo(() => formatarOpcoes(secoes), [secoes, formatarOpcoes]);
    const opcoesCargos = useMemo(() => formatarOpcoes(cargos), [cargos, formatarOpcoes]);
    const opcoesCentrosCusto = useMemo(() => formatarOpcoes(centros_custo), [centros_custo, formatarOpcoes]);
    const opcoesHorarios = useMemo(() => formatarOpcoes(horarios, true), [horarios, formatarOpcoes]);
    const opcoesFuncoes = useMemo(() => formatarOpcoes(funcoes), [funcoes, formatarOpcoes]);
    const opcoesSindicatos = useMemo(() => formatarOpcoes(sindicatos, true), [sindicatos, formatarOpcoes]);

    // Memoizar as opções de domínio formatadas
    const opcoesTipoAdmissao = useMemo(() => formatarOpcoesDominio(opcoesDominio.tipo_admissao), [opcoesDominio.tipo_admissao, formatarOpcoesDominio]);
    const opcoesMotivoAdmissao = useMemo(() => formatarOpcoesDominio(opcoesDominio.motivo_admissao), [opcoesDominio.motivo_admissao, formatarOpcoesDominio]);
    const opcoesTipoFuncionario = useMemo(() => formatarOpcoesDominio(opcoesDominio.tipo_funcionario), [opcoesDominio.tipo_funcionario, formatarOpcoesDominio]);
    const opcoesCodigoCategoriaESocial = useMemo(() => formatarOpcoesDominio(opcoesDominio.codigo_categoria_esocial), [opcoesDominio.codigo_categoria_esocial, formatarOpcoesDominio]);
    const opcoesTipoRecebimento = useMemo(() => formatarOpcoesDominio(opcoesDominio.tipo_recebimento), [opcoesDominio.tipo_recebimento, formatarOpcoesDominio]);
    const opcoesTipoSituacao = useMemo(() => formatarOpcoesDominio(opcoesDominio.tipo_situacao), [opcoesDominio.tipo_situacao, formatarOpcoesDominio]);
    const opcoesCodigoOcorrenciaSefip = useMemo(() => formatarOpcoesDominio(opcoesDominio.codigo_ocorrencia_sefip), [opcoesDominio.codigo_ocorrencia_sefip, formatarOpcoesDominio]);
    const opcoesCodigoCategoriaSefip = useMemo(() => formatarOpcoesDominio(opcoesDominio.codigo_categoria_sefip), [opcoesDominio.codigo_categoria_sefip, formatarOpcoesDominio]);
    const opcoesContratoTempoParcial = useMemo(() => formatarOpcoesDominio(opcoesDominio.contrato_tempo_parcial), [opcoesDominio.contrato_tempo_parcial, formatarOpcoesDominio]);
    const opcoesIndicativoAdmissao = useMemo(() => formatarOpcoesDominio(opcoesDominio.indicativo_admissao), [opcoesDominio.indicativo_admissao, formatarOpcoesDominio]);
    const opcoesTipoRegimeTrabalhista = useMemo(() => formatarOpcoesDominio(opcoesDominio.tipo_regime_trabalhista), [opcoesDominio.tipo_regime_trabalhista, formatarOpcoesDominio]);
    const opcoesFaixaSalarial = useMemo(() => formatarOpcoesDominio(opcoesDominio.faixa_salarial), [opcoesDominio.faixa_salarial, formatarOpcoesDominio]);
    const opcoesMotivoMudancaFuncao = useMemo(() => formatarOpcoesDominio(opcoesDominio.motivo_mudanca_funcao), [opcoesDominio.motivo_mudanca_funcao, formatarOpcoesDominio]);
    const opcoesMotivoMudancaSalario = useMemo(() => formatarOpcoesDominio(opcoesDominio.motivo_mudanca_salario), [opcoesDominio.motivo_mudanca_salario, formatarOpcoesDominio]);
    const opcoesTipoRegimeJornada = useMemo(() => formatarOpcoesDominio(opcoesDominio.tipo_regime_jornada), [opcoesDominio.tipo_regime_jornada, formatarOpcoesDominio]);
    const opcoesMotivoMudancaSituacao = useMemo(() => formatarOpcoesDominio(opcoesDominio.motivo_mudanca_situacao), [opcoesDominio.motivo_mudanca_situacao, formatarOpcoesDominio]);
    const opcoesTipoRegimePrevidenciario = useMemo(() => formatarOpcoesDominio(opcoesDominio.tipo_regime_previdenciario), [opcoesDominio.tipo_regime_previdenciario, formatarOpcoesDominio]);
    
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
                name="cargo"
                valor={getValorSelecionado('cargo_id', cargos)}
                setValor={valor => {
                    setCampo('dados_vaga', { 
                        ...candidato.dados_vaga, 
                        cargo_id: valor.code,
                        cargo_nome: valor.name
                    });
                }}
                options={opcoesCargos}
                label="Cargo"
                required={isCampoObrigatorio(cargos)}
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
                valor={getValorSelecionadoFromCandidato('tipo_admissao', opcoesDominio.tipo_admissao)}
                setValor={(valor) => setCampo('tipo_admissao', valor.code)}
                options={opcoesTipoAdmissao} 
                disabled={modoLeitura}
            />
            <DropdownItens
                name="motivo_admissao"
                label="Motivo da Admissão"
                valor={getValorSelecionadoFromCandidato('motivo_admissao', opcoesDominio.motivo_admissao)}
                setValor={(valor) => setCampo('motivo_admissao', valor.code)}
                options={opcoesMotivoAdmissao} 
                disabled={modoLeitura}
            />

            {availableDominioTables.includes('indicativo_admissao') ? (
                <DropdownItens
                    name="indicativo_admissao"
                    label="Indicativo de Admissão"
                    valor={getValorSelecionadoFromCandidato('indicativo_admissao', opcoesDominio.indicativo_admissao)}
                    setValor={(valor) => setCampo('indicativo_admissao', valor.code)}
                    options={opcoesIndicativoAdmissao}
                    disabled={modoLeitura}
                />
            ) : (
                <CampoTexto
                    name="indicativo_admissao"
                    label="Indicativo de Admissão"
                    valor={candidato.indicativo_admissao || ''}
                    setValor={(valor) => setCampo('indicativo_admissao', valor)}
                    disabled={modoLeitura}
                />
            )}

            <DropdownItens
                name="tipo_funcionario"
                label="Tipo de Funcionário"
                valor={getValorSelecionadoFromCandidato('tipo_funcionario', opcoesDominio.tipo_funcionario)}
                setValor={(valor) => setCampo('tipo_funcionario', valor.code)}
                options={opcoesTipoFuncionario} 
                disabled={modoLeitura}
            />
            <DropdownItens
                name="codigo_categoria_esocial"
                label="Código Categoria eSocial"
                valor={getValorSelecionadoFromCandidato('codigo_categoria_esocial', opcoesDominio.codigo_categoria_esocial)}
                setValor={(valor) => setCampo('codigo_categoria_esocial', valor.code)}
                options={opcoesCodigoCategoriaESocial}
                disabled={modoLeitura}
            />

            {availableDominioTables.includes('tipo_regime_trabalhista') ? (
                <DropdownItens
                    name="tipo_regime_trabalhista"
                    label="Tipo de Regime Trabalhista"
                    valor={getValorSelecionadoFromCandidato('tipo_regime_trabalhista', opcoesDominio.tipo_regime_trabalhista)}
                    setValor={(valor) => setCampo('tipo_regime_trabalhista', valor.code)}
                    options={opcoesTipoRegimeTrabalhista}
                    disabled={modoLeitura}
                />
            ) : (
                <CampoTexto
                    name="tipo_regime_trabalhista"
                    label="Tipo de Regime Trabalhista"
                    valor={candidato.tipo_regime_trabalhista || ''}
                    setValor={(valor) => setCampo('tipo_regime_trabalhista', valor)}
                    disabled={modoLeitura}
                />
            )}
            
            {availableDominioTables.includes('faixa_salarial') ? (
                <DropdownItens
                    name="faixa_salarial"
                    label="Faixa Salarial"
                    valor={getValorSelecionadoFromCandidato('faixa_salarial', opcoesDominio.faixa_salarial)}
                    setValor={(valor) => setCampo('faixa_salarial', valor.code)}
                    options={opcoesFaixaSalarial}
                    disabled={modoLeitura}
                />
            ) : (
                <CampoTexto
                    name="faixa_salarial"
                    label="Faixa Salarial"
                    valor={candidato.faixa_salarial || ''}
                    setValor={(valor) => setCampo('faixa_salarial', valor)}
                    disabled={modoLeitura}
                />
            )}

            {availableDominioTables.includes('motivo_mudanca_funcao') ? (
                <DropdownItens
                    name="motivo_mudanca_funcao"
                    label="Motivo da Mudança de Função"
                    valor={getValorSelecionadoFromCandidato('motivo_mudanca_funcao', opcoesDominio.motivo_mudanca_funcao)}
                    setValor={(valor) => setCampo('motivo_mudanca_funcao', valor.code)}
                    options={opcoesMotivoMudancaFuncao}
                    disabled={modoLeitura}
                />
            ) : (
                <CampoTexto
                    name="motivo_mudanca_funcao"
                    label="Motivo da Mudança de Função"
                    valor={candidato.motivo_mudanca_funcao || ''}
                    setValor={(valor) => setCampo('motivo_mudanca_funcao', valor)}
                    disabled={modoLeitura}
                />
            )}

            <DropdownItens
                name="tipo_recebimento"
                label="Tipo de Recebimento"
                valor={getValorSelecionadoFromCandidato('tipo_recebimento', opcoesDominio.tipo_recebimento)}
                setValor={(valor) => setCampo('tipo_recebimento', valor.code)}
                options={opcoesTipoRecebimento}
                disabled={modoLeitura}
            />

            {availableDominioTables.includes('motivo_mudanca_salario') ? (
                <DropdownItens
                    name="motivo_mudanca_salario"
                    label="Motivo da Mudança de Salário"
                    valor={getValorSelecionadoFromCandidato('motivo_mudanca_salario', opcoesDominio.motivo_mudanca_salario)}
                    setValor={(valor) => setCampo('motivo_mudanca_salario', valor.code)}
                    options={opcoesMotivoMudancaSalario}
                    disabled={modoLeitura}
                />
            ) : (
                <CampoTexto
                    name="motivo_mudanca_salario"
                    label="Motivo da Mudança de Salário"
                    valor={candidato.motivo_mudanca_salario || ''}
                    setValor={(valor) => setCampo('motivo_mudanca_salario', valor)}
                    disabled={modoLeitura}
                />
            )}

            <DropdownItens
                name="tipo_situacao"
                label="Situação"
                valor={getValorSelecionadoFromCandidato('tipo_situacao', opcoesDominio.tipo_situacao)}
                setValor={(valor) => setCampo('tipo_situacao', valor.code)}
                options={opcoesTipoSituacao}
                disabled={modoLeitura}
            />

            {availableDominioTables.includes('motivo_mudanca_situacao') ? (
                <DropdownItens
                    name="motivo_mudanca_situacao"
                    label="Motivo da Mudança de Situação"
                    valor={getValorSelecionadoFromCandidato('motivo_mudanca_situacao', opcoesDominio.motivo_mudanca_situacao)}
                    setValor={(valor) => setCampo('motivo_mudanca_situacao', valor.code)}
                    options={opcoesMotivoMudancaSituacao}
                    disabled={modoLeitura}
                />
            ) : (
                <CampoTexto
                    name="motivo_mudanca_situacao"
                    label="Motivo da Mudança de Situação"
                    valor={candidato.motivo_mudanca_situacao || ''}
                    setValor={(valor) => setCampo('motivo_mudanca_situacao', valor)}
                    disabled={modoLeitura}
                />
            )}

            <DropdownItens
                name="codigo_ocorrencia_sefip"
                label="Código Ocorrência SEFIP"
                valor={getValorSelecionadoFromCandidato('codigo_ocorrencia_sefip', opcoesDominio.codigo_ocorrencia_sefip)}
                setValor={(valor) => setCampo('codigo_ocorrencia_sefip', valor.code)}
                options={opcoesCodigoOcorrenciaSefip}
                disabled={modoLeitura}
            />
            <DropdownItens
                name="codigo_categoria_sefip"
                label="Código Categoria SEFIP"
                valor={getValorSelecionadoFromCandidato('codigo_categoria_sefip', opcoesDominio.codigo_categoria_sefip)}
                setValor={(valor) => setCampo('codigo_categoria_sefip', valor.code)}
                options={opcoesCodigoCategoriaSefip}
                disabled={modoLeitura}
            />
            
            {availableDominioTables.includes('tipo_regime_jornada') ? (
                 <DropdownItens
                    name="tipo_regime_jornada"
                    label="Tipo de Regime da Jornada"
                    valor={getValorSelecionadoFromCandidato('tipo_regime_jornada', opcoesDominio.tipo_regime_jornada)}
                    setValor={(valor) => setCampo('tipo_regime_jornada', valor.code)}
                    options={opcoesTipoRegimeJornada}
                    disabled={modoLeitura}
                />
            ) : (
                <CampoTexto
                    name="tipo_regime_jornada"
                    label="Tipo de Regime da Jornada"
                    valor={candidato.tipo_regime_jornada || ''}
                    setValor={(valor) => setCampo('tipo_regime_jornada', valor)}
                    disabled={modoLeitura}
                />
            )}

            {availableDominioTables.includes('tipo_regime_previdenciario') ? (
                <DropdownItens
                    name="tipo_regime_previdenciario"
                    label="Tipo de Regime Previdenciário"
                    valor={getValorSelecionadoFromCandidato('tipo_regime_previdenciario', opcoesDominio.tipo_regime_previdenciario)}
                    setValor={(valor) => setCampo('tipo_regime_previdenciario', valor.code)}
                    options={opcoesTipoRegimePrevidenciario}
                    disabled={modoLeitura}
                />
            ) : (
                <CampoTexto
                    name="tipo_regime_previdenciario"
                    label="Tipo de Regime Previdenciário"
                    valor={candidato.tipo_regime_previdenciario || ''}
                    setValor={(valor) => setCampo('tipo_regime_previdenciario', valor)}
                    disabled={modoLeitura}
                />
            )}
            
            {availableDominioTables.includes('contrato_tempo_parcial') ? (
                <DropdownItens
                    name="contrato_tempo_parcial"
                    label="Contrato de Trabalho em Tempo Parcial"
                    valor={getValorSelecionadoFromCandidato('contrato_tempo_parcial', opcoesDominio.contrato_tempo_parcial)}
                    setValor={(valor) => setCampo('contrato_tempo_parcial', valor.code)}
                    options={opcoesContratoTempoParcial}
                    disabled={modoLeitura}
                />
            ) : (
                <CampoTexto
                    name="contrato_tempo_parcial"
                    label="Contrato de Trabalho em Tempo Parcial"
                    valor={candidato.contrato_tempo_parcial || ''}
                    setValor={(valor) => setCampo('contrato_tempo_parcial', valor)}
                    disabled={modoLeitura}
                />
            )}
            <div />

            {/* Todos os Campos de Texto agrupados */}
            <CampoTexto
                patternMask={'BRL'}
                name="salario"
                valor={getSalario}
                setValor={setSalario}
                label="Salário"
                disabled={modoLeitura}
            />
            <CampoTexto
                name="letra"
                label="Letra"
                valor={candidato.letra || ''}
                setValor={(valor) => setCampo('letra', valor)}
                disabled={modoLeitura}
            />
            <CampoTexto
                type="date"
                name="dt_admissao"
                label="Data de Admissão"
                valor={candidato.dt_admissao || ''}
                setValor={(valor) => setCampo('dt_admissao', valor)}
                disabled={modoLeitura}
            />
            <CampoTexto
                type="date"
                name="dt_transferencia"
                label="Data de Transferência"
                valor={candidato.dt_transferencia || ''}
                setValor={(valor) => setCampo('dt_transferencia', valor)}
                disabled={modoLeitura}
            />
            <CampoTexto
                type="date"
                name="dt_mudanca_tipo_funcionario"
                label="Data da Mudança do Tipo de Funcionário"
                valor={candidato.dt_mudanca_tipo_funcionario || ''}
                setValor={(valor) => setCampo('dt_mudanca_tipo_funcionario', valor)}
                disabled={modoLeitura}
            />
            <CampoTexto
                type="date"
                name="dt_mudanca_categoria"
                label="Data Mudança Categoria"
                valor={candidato.dt_mudanca_categoria || ''}
                setValor={(valor) => setCampo('dt_mudanca_categoria', valor)}
                disabled={modoLeitura}
            />
            <CampoTexto
                type="date"
                name="dt_mudanca_funcao"
                label="Data Mudança de Função"
                valor={candidato.dt_mudanca_funcao || ''}
                setValor={(valor) => setCampo('dt_mudanca_funcao', valor)}
                disabled={modoLeitura}
            />
            <CampoTexto
                type="date"
                name="dt_mudanca_salario"
                label="Data Mudança Salário"
                valor={candidato.dt_mudanca_salario || ''}
                setValor={(valor) => setCampo('dt_mudanca_salario', valor)}
                disabled={modoLeitura}
            />
            <CampoTexto
                type="date"
                name="dt_mudanca_recebimento"
                label="Data Mudança Recebimento"
                valor={candidato.dt_mudanca_recebimento || ''}
                setValor={(valor) => setCampo('dt_mudanca_recebimento', valor)}
                disabled={modoLeitura}
            />
            <CampoTexto
                type="date"
                name="dt_mudanca_horario"
                label="Data Mudança Horário"
                valor={candidato.dt_mudanca_horario || ''}
                setValor={(valor) => setCampo('dt_mudanca_horario', valor)}
                disabled={modoLeitura}
            />
            <CampoTexto
                type="date"
                name="dt_mudanca_jornada"
                label="Data da Mudança (Regime Jornada)"
                valor={candidato.dt_mudanca_jornada || ''}
                setValor={(valor) => setCampo('dt_mudanca_jornada', valor)}
                disabled={modoLeitura}
                errorMessage={jornadaDateError}
            />
            <CampoTexto
                type="date"
                name="dt_mudanca_situacao"
                label="Data Mudança Situação"
                valor={candidato.dt_mudanca_situacao || ''}
                setValor={(valor) => setCampo('dt_mudanca_situacao', valor)}
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