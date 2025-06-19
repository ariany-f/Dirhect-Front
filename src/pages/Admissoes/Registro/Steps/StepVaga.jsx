import React from 'react';
import { useCandidatoContext } from '@contexts/Candidato';
import CampoTexto from '@components/CampoTexto';
import DropdownItens from '@components/DropdownItens';

const StepVaga = ({ filiais, departamentos, secoes, cargos, centros_custo, horarios, funcoes, sindicatos }) => {
    const { candidato, setCampo, vaga } = useCandidatoContext();

    // Formata as opções para o formato esperado pelo DropdownItens
    const formatarOpcoes = (opcoes, useDescription = false) => {
        return opcoes.map(opcao => ({
            name: useDescription ? opcao.descricao : opcao.nome,
            code: opcao.id
        }));
    };

    // Função para obter o valor selecionado no formato {name, code}
    const getValorSelecionado = (campo, lista) => {
        // Primeiro tenta pegar do dados_vaga
        const id = candidato?.dados_vaga?.[campo];
        if (id) {
            const item = lista.find(item => item.id === id);
            if (item) {
                return {
                    name: item.nome,
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
                    name: item.nome,
                    code: item.id
                };
            }
        }

        return '';
    };

    // Função para obter o salário (prioriza dados_candidato)
    const getSalario = () => {
        if (candidato?.dados_candidato?.salario) {
            return candidato.dados_candidato.salario;
        }
        return candidato?.dados_vaga?.salario || '';
    };

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

    return (
        <div>
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
                options={formatarOpcoes(filiais)}
                label="Filial"
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
                options={formatarOpcoes(departamentos)}
                label="Departamento"
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
                options={formatarOpcoes(secoes)}
                label="Seção"
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
                options={formatarOpcoes(cargos)}
                label="Cargo"
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
                options={formatarOpcoes(centros_custo)}
                label="Centro de Custo"
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
                options={formatarOpcoes(horarios, true)}
                label="Horário"
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
                options={formatarOpcoes(funcoes)}
                label="Função"
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
                options={formatarOpcoes(sindicatos, true)}
                label="Sindicato"
            />
            <CampoTexto
                patternMask={'BRL'}
                name="salario"
                valor={getSalario()}
                setValor={setSalario}
                label="Salário"
            />
        </div>
    );
};

export default StepVaga; 