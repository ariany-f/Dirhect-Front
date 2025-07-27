import React, { useRef, useEffect, useMemo, useState } from 'react';
import { useCandidatoContext } from '@contexts/Candidato';
import CampoTexto from '@components/CampoTexto';
import DropdownItens from '@components/DropdownItens';
import SwitchInput from '@components/SwitchInput';
import axios from 'axios';
import styled from 'styled-components';

const GridContainer = styled.div`
    padding: 0 24px 24px 24px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px 24px;
    box-sizing: border-box;
    width: 100%;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 12px 0;
    }
`;

const Separator = styled.hr`
    grid-column: 1 / -1;
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 20px 0;
    width: 100%;
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

const StepDadosPessoais = ({ classError, estados, modoLeitura = false, opcoesDominio = {} }) => {
    const { candidato, setCampo } = useCandidatoContext();
    const lastCepRef = useRef('');
    const [cidades, setCidades] = useState([]);
    const [loadingCidades, setLoadingCidades] = useState(false);

    const formatarOpcoesDominio = useMemo(() => {
        return (opcoes) => {
            if (!Array.isArray(opcoes)) return [];
            return opcoes.map(opcao => ({
                name: opcao.descricao,
                code: opcao.id_origem || opcao.codigo
            }));
        };
    }, []);

    const getValorSelecionadoFromCandidato = useMemo(() => {
        return (campo, lista) => {
            if (!Array.isArray(lista) || !candidato) return '';
            
            if (!candidato[campo]) return '';
            
            // Verifica se o valor é um objeto (como genero, estado_civil, etc.)
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

    const opcoesGenero = useMemo(() => formatarOpcoesDominio(opcoesDominio.genero), [opcoesDominio.genero, formatarOpcoesDominio]);
    const opcoesCorRaca = useMemo(() => formatarOpcoesDominio(opcoesDominio.cor_raca), [opcoesDominio.cor_raca, formatarOpcoesDominio]);
    const opcoesEstadoCivil = useMemo(() => formatarOpcoesDominio(opcoesDominio.estado_civil), [opcoesDominio.estado_civil, formatarOpcoesDominio]);
    const opcoesNacionalidade = useMemo(() => formatarOpcoesDominio(opcoesDominio.nacionalidade), [opcoesDominio.nacionalidade, formatarOpcoesDominio]);

    console.log(candidato)

    // Verifica se o nome do pai é "DESCONHECIDO" e ativa o switch automaticamente
    useEffect(() => {
        // Só atualiza se o nome do pai for "DESCONHECIDO" mas o switch não estiver ativo
        // E se os dados já foram carregados (para evitar execução na primeira renderização)
        if (candidato?.nome_pai === 'DESCONHECIDO' && 
            candidato?.pai_desconhecido !== true && 
            candidato?.nome) { // Verifica se os dados já foram carregados
            setCampo('pai_desconhecido', true);
        }
    }, [candidato?.nome_pai, candidato?.pai_desconhecido, candidato?.nome, setCampo]);

    // Função para buscar cidades do estado natal
    const buscarCidades = async (estado) => {
        if (!estado) {
            setCidades([]);
            return;
        }
        
        setLoadingCidades(true);
        try {
            const response = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`);
            if (response.data && Array.isArray(response.data)) {
                const cidadesFormatadas = response.data.map(cidade => ({
                    name: cidade.nome,
                    code: cidade.nome
                }));
                setCidades(cidadesFormatadas);
            } else {
                setCidades([]);
            }
        } catch (error) {
            console.error('Erro ao buscar cidades:', error);
            setCidades([]);
        } finally {
            setLoadingCidades(false);
        }
    };

    // Carrega cidades quando o estado natal muda
    useEffect(() => {
        if (candidato?.estado_natal) {
            buscarCidades(candidato.estado_natal);
        } else {
            setCidades([]);
        }
    }, [candidato?.estado_natal]);

    // Função para buscar endereço pelo CEP
    const handleCepChange = async (valor) => {
        // Atualiza o campo CEP normalmente
        setCampo('cep', valor);
        const cepLimpo = valor.replace(/\D/g, '');
        // Só busca se for 8 dígitos e diferente do último buscado
        if (cepLimpo.length === 8 && lastCepRef.current !== cepLimpo) {
            lastCepRef.current = cepLimpo;
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json`);
                if (response.data) {
                    setCampo('rua', response.data.logradouro || '');
                    setCampo('bairro', response.data.bairro || '');
                    setCampo('cidade', response.data.localidade || '');
                    setCampo('estado', response.data.uf || '');
                }
            } catch (e) {
                // Silencia erro de CEP inválido
            }
        }
        // Se o usuário apagar o CEP, reseta o lastCepRef
        if (cepLimpo.length < 8) {
            lastCepRef.current = '';
        }
    };

    // Função para obter o estado formatado
    const getEstadoFormatado = (campo = 'estado') => {
        if (!candidato?.[campo]) return '';
        const estadoEncontrado = estados.find(e => e.code === candidato[campo]);
        return estadoEncontrado || '';
    };

    // Função para obter a naturalidade formatada
    const getNaturalidadeFormatada = () => {
        if (!candidato?.naturalidade) return '';
        const naturalidadeEncontrada = cidades.find(c => c.code === candidato.naturalidade);
        return naturalidadeEncontrada || '';
    };

    return (
        <GridContainer data-tour="panel-step-1">
            <CampoTexto
                camposVazios={classError}
                name="nome"
                valor={candidato?.nome ?? ''}
                setValor={valor => setCampo('nome', valor)}
                type="text"
                label="Nome"
                placeholder="Digite o nome"
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={classError}
                name="cpf"
                valor={candidato?.cpf ?? ''}
                setValor={valor => setCampo('cpf', valor)}
                patternMask="999.999.999-99"
                label="CPF"
                placeholder="Digite o CPF"
                disabled={modoLeitura || (candidato?.cpf && candidato.cpf.trim() !== '')}
            />
            <CampoTexto
                camposVazios={classError}
                name="email"
                valor={candidato?.email ?? ''}
                setValor={valor => setCampo('email', valor)}
                type="text"
                label="E-mail"
                placeholder="Digite o email"
                disabled={modoLeitura}
            />
            <CampoTexto
                name="telefone"
                valor={candidato?.telefone ?? ''}
                setValor={valor => setCampo('telefone', valor)}
                label="Telefone"
                disabled={modoLeitura}
            />
            <CampoTexto
                name="dt_nascimento"
                valor={candidato?.dt_nascimento ?? ''}
                setValor={valor => setCampo('dt_nascimento', valor)}
                label="Data de Nascimento"
                type="date"
                disabled={modoLeitura}
            />
            <DropdownItens
                name="genero"
                label="Gênero"
                valor={getValorSelecionadoFromCandidato('genero', opcoesGenero)}
                setValor={(valor) => setCampo('genero', valor.code)}
                options={opcoesGenero}
                disabled={modoLeitura}
            />
            <DropdownItens
                name="cor_raca"
                label="Cor/Raça"
                valor={getValorSelecionadoFromCandidato('cor_raca', opcoesCorRaca)}
                setValor={(valor) => setCampo('cor_raca', valor.code)}
                options={opcoesCorRaca}
                disabled={modoLeitura}
            />
            <DropdownItens
                name="estado_civil"
                label="Estado Civil"
                valor={getValorSelecionadoFromCandidato('estado_civil', opcoesEstadoCivil)}
                setValor={(valor) => setCampo('estado_civil', valor.code)}
                options={opcoesEstadoCivil}
                disabled={modoLeitura}
            />
            <DropdownItens
                name="nacionalidade"
                label="Nacionalidade"
                valor={getValorSelecionadoFromCandidato('nacionalidade', opcoesNacionalidade)}
                setValor={(valor) => setCampo('nacionalidade', valor.code)}
                options={opcoesNacionalidade}
                disabled={modoLeitura}
                filter
            />
            <DropdownItens
                name="estado_natal"
                label="Estado Natal"
                valor={getEstadoFormatado('estado_natal')}
                setValor={valor => setCampo('estado_natal', valor.code)}
                options={estados}
                placeholder="Selecione o estado natal"
                disabled={modoLeitura}
                filter
            />
            <DropdownItens
                name="naturalidade"
                label="Naturalidade"
                valor={getNaturalidadeFormatada()}
                setValor={valor => setCampo('naturalidade', valor.code)}
                options={cidades}
                placeholder={loadingCidades ? "Carregando cidades..." : "Selecione a naturalidade"}
                disabled={modoLeitura || !candidato?.estado_natal || loadingCidades}
                filter
            />
            
            <SectionTitle>Filiação</SectionTitle>
            
            {/* Mãe - Obrigatório */}
            <CampoTexto
                camposVazios={classError}
                name="nome_mae"
                valor={candidato?.nome_mae ?? ''}
                setValor={valor => setCampo('nome_mae', valor)}
                type="text"
                label="Nome da Mãe *"
                placeholder="Digite o nome da mãe"
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={classError}
                name="sobrenome_mae"
                valor={candidato?.sobrenome_mae ?? ''}
                setValor={valor => setCampo('sobrenome_mae', valor)}
                type="text"
                label="Sobrenome da Mãe *"
                placeholder="Digite o sobrenome da mãe"
                disabled={modoLeitura}
            />
            
            {/* Pai - Com switch para desconhecido */}
            <div style={{ 
                gridColumn: '1 / -1', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                marginBottom: '8px'
            }}>
                <SwitchInput
                    checked={candidato?.pai_desconhecido ?? false}
                    onChange={(value) => {
                        setCampo('pai_desconhecido', value);
                        if (value) {
                            setCampo('nome_pai', 'DESCONHECIDO');
                            setCampo('sobrenome_pai', 'DESCONHECIDO');
                        } else {
                            setCampo('nome_pai', '');
                            setCampo('sobrenome_pai', '');
                        }
                    }}
                    disabled={modoLeitura}
                />
                <label style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: 'var(--text-color)',
                    cursor: modoLeitura ? 'not-allowed' : 'pointer'
                }}>
                    Pai desconhecido
                </label>
            </div>
            
            <CampoTexto
                name="nome_pai"
                valor={candidato?.nome_pai ?? ''}
                setValor={valor => setCampo('nome_pai', valor)}
                type="text"
                label="Nome do Pai"
                placeholder="Digite o nome do pai"
                disabled={modoLeitura || candidato?.pai_desconhecido}
            />
            <CampoTexto
                name="sobrenome_pai"
                valor={candidato?.sobrenome_pai ?? ''}
                setValor={valor => setCampo('sobrenome_pai', valor)}
                type="text"
                label="Sobrenome do Pai"
                placeholder="Digite o sobrenome do pai"
                disabled={modoLeitura || candidato?.pai_desconhecido}
            />
            
            <SectionTitle>Endereço</SectionTitle>
            
            <CampoTexto
                name="cep"
                patternMask="99999-999"
                valor={candidato?.cep ?? ''}
                setValor={handleCepChange}
                label="CEP"
                disabled={modoLeitura}
            />
            <CampoTexto
                name="rua"
                valor={candidato?.rua ?? ''}
                setValor={valor => setCampo('rua', valor)}
                label="Logradouro"
                disabled={modoLeitura}
            />
            <CampoTexto
                name="bairro"
                valor={candidato?.bairro ?? ''}
                setValor={valor => setCampo('bairro', valor)}
                label="Bairro"
                disabled={modoLeitura}
            />
            <CampoTexto
                name="numero"
                valor={candidato?.numero ?? ''}
                setValor={valor => setCampo('numero', valor)}
                label="Número"
                disabled={modoLeitura}
            />
            <CampoTexto
                name="complemento"
                valor={candidato?.complemento ?? ''}
                setValor={valor => setCampo('complemento', valor)}
                label="Complemento"
                disabled={modoLeitura}
            />
            <CampoTexto
                name="cidade"
                valor={candidato?.cidade ?? ''}
                setValor={valor => setCampo('cidade', valor)}
                label="Cidade"
                disabled={modoLeitura}
            />
            <DropdownItens
                $margin={'10px'}
                valor={getEstadoFormatado('estado')}
                setValor={valor => setCampo('estado', valor.code)}
                options={estados}
                name="state"
                label="Estado"
                placeholder="Selecione o estado"
                disabled={modoLeitura}
                filter
            />
        </GridContainer>
    );
};

export default StepDadosPessoais; 