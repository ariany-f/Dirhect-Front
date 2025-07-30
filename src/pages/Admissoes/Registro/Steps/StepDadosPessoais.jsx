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
    gap: 8px 24px;
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

const StepDadosPessoais = ({ classError = [], estados, modoLeitura = false, opcoesDominio = {} }) => {
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
    const opcoesTipoRua = useMemo(() => formatarOpcoesDominio(opcoesDominio.tipo_rua), [opcoesDominio.tipo_rua, formatarOpcoesDominio]);
    const opcoesTipoBairro = useMemo(() => formatarOpcoesDominio(opcoesDominio.tipo_bairro), [opcoesDominio.tipo_bairro, formatarOpcoesDominio]);

    // Função para verificar se um campo é obrigatório baseado nos documentos
    const isCampoObrigatorio = useMemo(() => {
        return (campo) => {
            if (!candidato?.documentos || !Array.isArray(candidato.documentos)) {
                return false;
            }
            
            return candidato.documentos.some(documento => {
                // Só considera campos requeridos se o documento for obrigatório
                if (!documento.obrigatorio || !documento.campos_requeridos) return false;
                
                // Se for string, tenta fazer parse
                let camposObj = documento.campos_requeridos;
                if (typeof camposObj === 'string') {
                    try {
                        camposObj = JSON.parse(camposObj);
                    } catch (error) {
                        return false;
                    }
                }
                
                return camposObj[campo] === true;
            });
        };
    }, [candidato?.documentos]);

    // Função para verificar se um campo está em erro
    const isCampoEmErro = useMemo(() => {
        return (campo) => {
            return classError.includes(campo);
        };
    }, [classError]);

    useEffect(() => {

        if(candidato.dt_admissao && candidato.dt_admissao !== '' && (!candidato.dt_opcao_fgts || candidato.dt_opcao_fgts === ''))
        {
            setCampo('dt_opcao_fgts', candidato.dt_admissao)
        }
    }, [candidato.dt_admissao])

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

            <SectionTitle>Identificação</SectionTitle>
            
            <CampoTexto
                camposVazios={classError}
                name="nome"
                valor={candidato?.nome ?? ''}
                setValor={valor => setCampo('nome', valor)}
                type="text"
                label="Nome"
                placeholder="Digite o nome"
                disabled={modoLeitura}
                maxCaracteres={100}
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
            <CampoTexto
                name="pispasep"
                valor={candidato?.pispasep ?? ''}
                setValor={valor => setCampo('pispasep', valor)}
                patternMask="999.99999.99-9"
                label="PIS/PASEP"
                placeholder="Digite o PIS/PASEP"
                disabled={modoLeitura}
            />

            <CampoTexto
                name="numero_cartao_sus"
                valor={candidato?.numero_cartao_sus ?? ''}
                setValor={valor => setCampo('numero_cartao_sus', valor)}
                patternMask="999999999999999"
                label="Número do Cartão SUS"
                placeholder="Digite o número do cartão SUS"
                disabled={modoLeitura}
            />
            
            <SectionTitle>CTPS</SectionTitle>

            <CampoTexto
                camposVazios={isCampoObrigatorio('carteira_trabalho') && isCampoEmErro('carteira_trabalho') ? ['carteira_trabalho'] : []}
                name="carteira_trabalho"
                valor={candidato?.carteira_trabalho ?? ''}
                setValor={valor => setCampo('carteira_trabalho', valor)}
                patternMask="9999999"
                label={`CTPS${isCampoObrigatorio('carteira_trabalho') ? '*' : ''}`}
                placeholder="Digite o número da carteira"
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={isCampoObrigatorio('serie_carteira_trab') && isCampoEmErro('serie_carteira_trab') ? ['serie_carteira_trab'] : []}
                name="serie_carteira_trab"
                maxCaracteres={5}
                valor={candidato?.serie_carteira_trab ?? ''}
                setValor={valor => setCampo('serie_carteira_trab', valor)}
                patternMask="999999"
                label={`Série da CTPS${isCampoObrigatorio('serie_carteira_trab') ? '*' : ''}`}
                placeholder="Digite a série"
                disabled={modoLeitura}
            />
            <DropdownItens
                camposVazios={isCampoObrigatorio('uf_carteira_trab') && isCampoEmErro('uf_carteira_trab') ? ['uf_carteira_trab'] : []}
                name="uf_carteira_trab"
                label={`UF da CTPS${isCampoObrigatorio('uf_carteira_trab') ? '*' : ''}`}
                valor={getEstadoFormatado('uf_carteira_trab')}
                setValor={valor => setCampo('uf_carteira_trab', valor.code)}
                options={estados}
                placeholder="Selecione a UF"
                disabled={modoLeitura}
                filter
            />
            <CampoTexto
                camposVazios={isCampoObrigatorio('data_emissao_ctps') && isCampoEmErro('data_emissao_ctps') ? ['data_emissao_ctps'] : []}
                name="data_emissao_ctps"
                valor={candidato?.data_emissao_ctps ?? ''}
                setValor={valor => setCampo('data_emissao_ctps', valor)}
                type="date"
                label={`Data de Emissão da CTPS${isCampoObrigatorio('data_emissao_ctps') ? '*' : ''}`}
                disabled={modoLeitura}
            />
            
            <SectionTitle>CNH</SectionTitle>
            
            <CampoTexto
                camposVazios={isCampoObrigatorio('carteira_motorista') && isCampoEmErro('carteira_motorista') ? ['carteira_motorista'] : []}
                name="carteira_motorista"
                valor={candidato?.carteira_motorista ?? ''}
                setValor={valor => setCampo('carteira_motorista', valor)}
                patternMask="99999999999"
                label={`Número da CNH${isCampoObrigatorio('carteira_motorista') ? '*' : ''}`}
                placeholder="Digite o número da CNH"
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={isCampoObrigatorio('data_emissao_cnh') && isCampoEmErro('data_emissao_cnh') ? ['data_emissao_cnh'] : []}
                name="data_emissao_cnh"
                valor={candidato?.data_emissao_cnh ?? ''}
                setValor={valor => setCampo('data_emissao_cnh', valor)}
                type="date"
                label={`Data de Emissão da CNH${isCampoObrigatorio('data_emissao_cnh') ? '*' : ''}`}
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={isCampoObrigatorio('tipo_carteira_habilit') && isCampoEmErro('tipo_carteira_habilit') ? ['tipo_carteira_habilit'] : []}
                name="tipo_carteira_habilit"
                valor={candidato?.tipo_carteira_habilit ?? ''}
                setValor={valor => setCampo('tipo_carteira_habilit', valor)}
                label={`Tipo da CNH${isCampoObrigatorio('tipo_carteira_habilit') ? '*' : ''}`}
                placeholder="Ex: A, B, C, D, E"
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={isCampoObrigatorio('data_venc_habilit') && isCampoEmErro('data_venc_habilit') ? ['data_venc_habilit'] : []}
                name="data_venc_habilit"
                valor={candidato?.data_venc_habilit ?? ''}
                setValor={valor => setCampo('data_venc_habilit', valor)}
                type="date"
                label={`Data de Vencimento da CNH${isCampoObrigatorio('data_venc_habilit') ? '*' : ''}`}
                disabled={modoLeitura}
            />
            
            <SectionTitle>RG</SectionTitle>

            <CampoTexto
                camposVazios={isCampoObrigatorio('identidade') && isCampoEmErro('identidade') ? ['identidade'] : []}
                name="identidade"
                valor={candidato?.identidade ?? ''}
                setValor={valor => setCampo('identidade', valor)}
                patternMask="999999999"
                label={`Identidade (RG)${isCampoObrigatorio('identidade') ? '*' : ''}`}
                placeholder="Digite o número do RG"
                disabled={modoLeitura}
            />
            <DropdownItens
                camposVazios={isCampoObrigatorio('uf_identidade') && isCampoEmErro('uf_identidade') ? ['uf_identidade'] : []}
                name="uf_identidade"
                label={`UF da Identidade${isCampoObrigatorio('uf_identidade') ? '*' : ''}`}
                valor={getEstadoFormatado('uf_identidade')}
                setValor={valor => setCampo('uf_identidade', valor.code)}
                options={estados}
                placeholder="Selecione a UF"
                disabled={modoLeitura}
                filter
            />
            <CampoTexto
                camposVazios={isCampoObrigatorio('orgao_emissor_ident') && isCampoEmErro('orgao_emissor_ident') ? ['orgao_emissor_ident'] : []}
                name="orgao_emissor_ident"
                valor={candidato?.orgao_emissor_ident ?? ''}
                setValor={valor => setCampo('orgao_emissor_ident', valor)}
                label={`Órgão Emissor da Identidade${isCampoObrigatorio('orgao_emissor_ident') ? '*' : ''}`}
                placeholder="Ex: SSP, DETRAN"
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={isCampoObrigatorio('data_emissao_ident') && isCampoEmErro('data_emissao_ident') ? ['data_emissao_ident'] : []}
                name="data_emissao_ident"
                valor={candidato?.data_emissao_ident ?? ''}
                setValor={valor => setCampo('data_emissao_ident', valor)}
                type="date"
                label={`Data de Emissão da Identidade${isCampoObrigatorio('data_emissao_ident') ? '*' : ''}`}
                disabled={modoLeitura}
            />

            <SectionTitle>Título de Eleitor</SectionTitle>

            <CampoTexto
                camposVazios={isCampoObrigatorio('titulo_eleitor') && isCampoEmErro('titulo_eleitor') ? ['titulo_eleitor'] : []}
                name="titulo_eleitor"
                valor={candidato?.titulo_eleitor ?? ''}
                setValor={valor => setCampo('titulo_eleitor', valor)}
                patternMask="999999999999"
                label={`Título de Eleitor${isCampoObrigatorio('titulo_eleitor') ? '*' : ''}`}
                placeholder="Digite o número do título"
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={isCampoObrigatorio('zona_titulo_eleitor') && isCampoEmErro('zona_titulo_eleitor') ? ['zona_titulo_eleitor'] : []}
                name="zona_titulo_eleitor"
                valor={candidato?.zona_titulo_eleitor ?? ''}
                setValor={valor => setCampo('zona_titulo_eleitor', valor)}
                patternMask="999"
                label={`Zona do Título${isCampoObrigatorio('zona_titulo_eleitor') ? '*' : ''}`}
                placeholder="Digite a zona"
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={isCampoObrigatorio('secao_titulo_eleitor') && isCampoEmErro('secao_titulo_eleitor') ? ['secao_titulo_eleitor'] : []}
                name="secao_titulo_eleitor"
                valor={candidato?.secao_titulo_eleitor ?? ''}
                setValor={valor => setCampo('secao_titulo_eleitor', valor)}
                patternMask="9999"
                label={`Seção do Título${isCampoObrigatorio('secao_titulo_eleitor') ? '*' : ''}`}
                placeholder="Digite a seção"
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={isCampoObrigatorio('data_titulo_eleitor') && isCampoEmErro('data_titulo_eleitor') ? ['data_titulo_eleitor'] : []}
                name="data_titulo_eleitor"
                valor={candidato?.data_titulo_eleitor ?? ''}
                setValor={valor => setCampo('data_titulo_eleitor', valor)}
                type="date"
                label={`Data do Título${isCampoObrigatorio('data_titulo_eleitor') ? '*' : ''}`}
                disabled={modoLeitura}
            />
            <DropdownItens
                camposVazios={isCampoObrigatorio('estado_emissor_tit_eleitor') && isCampoEmErro('estado_emissor_tit_eleitor') ? ['estado_emissor_tit_eleitor'] : []}
                name="estado_emissor_tit_eleitor"
                label={`Estado Emissor do Título${isCampoObrigatorio('estado_emissor_tit_eleitor') ? '*' : ''}`}
                valor={getEstadoFormatado('estado_emissor_tit_eleitor')}
                setValor={valor => setCampo('estado_emissor_tit_eleitor', valor.code)}
                options={estados}
                placeholder="Selecione o estado"
                disabled={modoLeitura}
                filter
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
            <DropdownItens
                name="tipo_rua"
                label="Tipo de Logradouro"
                valor={getValorSelecionadoFromCandidato('tipo_rua', opcoesTipoRua)}
                setValor={(valor) => setCampo('tipo_rua', valor.code)}
                options={opcoesTipoRua}
                placeholder="Selecione o tipo"
                disabled={modoLeitura}
                filter
            />
            <CampoTexto
                name="rua"
                valor={candidato?.rua ?? ''}
                setValor={valor => setCampo('rua', valor)}
                label="Logradouro"
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
                name="bairro"
                valor={candidato?.bairro ?? ''}
                setValor={valor => setCampo('bairro', valor)}
                label="Bairro"
                disabled={modoLeitura}
            />
            <DropdownItens
                name="tipo_bairro"
                label="Tipo de Bairro"
                valor={getValorSelecionadoFromCandidato('tipo_bairro', opcoesTipoBairro)}
                setValor={(valor) => setCampo('tipo_bairro', valor.code)}
                options={opcoesTipoBairro}
                placeholder="Selecione o tipo"
                disabled={modoLeitura}
                filter
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