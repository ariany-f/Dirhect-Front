import React, { useMemo } from 'react';
import { useCandidatoContext } from '@contexts/Candidato';
import CampoTexto from '@components/CampoTexto';
import DropdownItens from '@components/DropdownItens';
import styled from 'styled-components';

const GridContainer = styled.div`
    padding: 20px 10px 10px 10px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 16px;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 0;
    }
`;

const StepVaga = ({ filiais, departamentos, secoes, cargos, centros_custo, horarios, funcoes, sindicatos, modoLeitura = false }) => {
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

    // Função para obter o salário (prioriza dados_candidato)
    const getSalario = useMemo(() => {
        if (candidato?.dados_candidato?.salario) {
            return candidato.dados_candidato.salario;
        }
        return candidato?.dados_vaga?.salario || '';
    }, [candidato?.dados_candidato?.salario, candidato?.dados_vaga?.salario]);

    // Função para atualizar o salário
    const setSalario = (valor) => {
        // Se já existe salário no dados_candidato, atualiza lá
        if (candidato?.dados_candidato?.salario) {
            setCampo('dados_candidato', { 
                ...candidato.dados_candidato, 
                salario: valor 
            });
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

    return (
        <GridContainer>
            <DropdownItens
                name="filial"
                $margin={'15px'}
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
                $margin={'15px'}
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
                $margin={'15px'}
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
                $margin={'15px'}
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
                $margin={'15px'}
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
                $margin={'15px'}
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
                $margin={'15px'}
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
                $margin={'15px'}
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
            <CampoTexto
                patternMask={'BRL'}
                name="salario"
                valor={getSalario}
                setValor={setSalario}
                label="Salário"
                disabled={modoLeitura}
            />
        </GridContainer>
    );
};

export default StepVaga; 