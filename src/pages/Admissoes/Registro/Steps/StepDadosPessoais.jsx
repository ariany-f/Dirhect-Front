import React, { useRef, useEffect, useMemo, useState } from 'react';
import { useCandidatoContext } from '@contexts/Candidato';
import CampoTexto from '@components/CampoTexto';
import DropdownItens from '@components/DropdownItens';
import SwitchInput from '@components/SwitchInput';
import axios from 'axios';
import http from '@http';
import styled from 'styled-components';
import { Dropdown } from 'primereact/dropdown';

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

const StepDadosPessoais = ({ classError = [], setClassError, classInvalid = [], setClassInvalid, paises = [], modoLeitura = false, opcoesDominio = {}, nacionalidades = [] }) => {

    const { candidato, setCampo } = useCandidatoContext();
    const lastCepRef = useRef('');
    
    // Estados existentes (manter)
    const [estados, setEstados] = useState([]);
    const [loadingEstados, setLoadingEstados] = useState(false);
    const [cidades, setCidades] = useState([]);
    const [loadingCidades, setLoadingCidades] = useState(false);
    const [estadosFiltrados, setEstadosFiltrados] = useState([]);

    // Novos estados separados
    const [estadosEndereco, setEstadosEndereco] = useState([]);
    const [loadingEstadosEndereco, setLoadingEstadosEndereco] = useState(false);
    const [estadosNatal, setEstadosNatal] = useState([]);
    const [loadingEstadosNatal, setLoadingEstadosNatal] = useState(false);

    const formatarOpcoesDominio = useMemo(() => {
        return (opcoes) => {
            if (!Array.isArray(opcoes)) return [];
            let opcoesFormatadas = opcoes.map(opcao => ({
                name: opcao.descricao,
                code: opcao.id_origem || opcao.codigo
            }));
            
            return opcoesFormatadas;
        };
    }, []);

    const formatarOpcoesDdi = useMemo(() => {
        return (opcoes) => {
            if (!Array.isArray(opcoes)) return [];
            return opcoes.map(opcao => ({
                name: opcao.descricao,
                code: opcao.id || opcao.codigo
            }));
        };
    }, []);

    const formatarOpcoesTipoBairro = useMemo(() => {
        return (opcoes) => {
            if (!Array.isArray(opcoes)) return [];
            return opcoes.map(opcao => ({
                name: opcao.descricao,
                code: opcao.id || opcao.codigo
            }));
        };
    }, []);

    const formatarOpcoesTipoRua = useMemo(() => {
        return (opcoes) => {
            if (!Array.isArray(opcoes)) return [];
            return opcoes.map(opcao => ({
                name: opcao.descricao,
                code: opcao.id || opcao.codigo
            }));
        };
    }, []);

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

    const getValorSelecionadoFromCandidato = useMemo(() => {
        return (campo, lista) => {
            if (!Array.isArray(lista) || !candidato) return null;
            
            if (!candidato[campo] || candidato[campo] === '') return null;
            
            // Verifica se o valor é um objeto (como genero, estado_civil, etc.)
            if (typeof candidato[campo] === 'object' && candidato[campo] !== null) {
                return {
                    name: candidato[campo].descricao,
                    code: candidato[campo].id_origem || candidato[campo].id
                };
            }
            
            const code = String(candidato[campo]);
            const item = lista.find(item => String(item.code) === code);
            
            // Verificação de segurança adicional
            if (!item) {
                console.warn(`Item não encontrado para campo ${campo} com código ${code}`);
                return null;
            }
            
            return { name: item.name, code: item.code };
        };
    }, [candidato]);

    const ddi = [
        { name: "Afeganistão", code: "93", flag: "🇦🇫" },
        { name: "África do Sul", code: "27", flag: "🇿🇦" },
        { name: "Albânia", code: "355", flag: "🇦🇱" },
        { name: "Alemanha", code: "49", flag: "🇩🇪" },
        { name: "Andorra", code: "376", flag: "🇦🇩" },
        { name: "Angola", code: "244", flag: "🇦🇴" },
        { name: "Anguilla", code: "1-264", flag: "🇦🇮" },
        { name: "Antígua e Barbuda", code: "1-268", flag: "🇦🇬" },
        { name: "Arábia Saudita", code: "966", flag: "🇸🇦" },
        { name: "Argélia", code: "213", flag: "🇩🇿" },
        { name: "Argentina", code: "54", flag: "🇦🇷" },
        { name: "Armênia", code: "374", flag: "🇦🇲" },
        { name: "Aruba", code: "297", flag: "🇦🇼" },
        { name: "Austrália", code: "61", flag: "🇦🇺" },
        { name: "Áustria", code: "43", flag: "🇦🇹" },
        { name: "Azerbaijão", code: "994", flag: "🇦🇿" },
        { name: "Bahamas", code: "1-242", flag: "🇧🇸" },
        { name: "Bahrein", code: "973", flag: "🇧🇭" },
        { name: "Bangladesh", code: "880", flag: "🇧🇩" },
        { name: "Barbados", code: "1-246", flag: "🇧🇧" },
        { name: "Bélgica", code: "32", flag: "🇧🇪" },
        { name: "Belize", code: "501", flag: "🇧🇿" },
        { name: "Benin", code: "229", flag: "🇧🇯" },
        { name: "Bermudas", code: "1-441", flag: "🇧🇲" },
        { name: "Bolívia", code: "591", flag: "🇧🇴" },
        { name: "Bósnia e Herzegovina", code: "387", flag: "🇧🇦" },
        { name: "Botswana", code: "267", flag: "🇧🇼" },
        { name: "Brasil", code: "55", flag: "🇧🇷" },
        { name: "Brunei", code: "673", flag: "🇧🇳" },
        { name: "Bulgária", code: "359", flag: "🇧🇬" },
        { name: "Burkina Faso", code: "226", flag: "🇧🇫" },
        { name: "Burundi", code: "257", flag: "🇧🇮" },
        { name: "Cabo Verde", code: "238", flag: "🇨🇻" },
        { name: "Camarões", code: "237", flag: "🇨🇲" },
        { name: "Camboja", code: "855", flag: "🇰🇭" },
        { name: "Canadá", code: "1", flag: "🇨🇦" },
        { name: "Catar", code: "974", flag: "🇶🇦" },
        { name: "Chile", code: "56", flag: "🇨🇱" },
        { name: "China", code: "86", flag: "🇨🇳" },
        { name: "Chipre", code: "357", flag: "🇨🇾" },
        { name: "Colômbia", code: "57", flag: "🇨🇴" },
        { name: "Comores", code: "269", flag: "🇰🇲" },
        { name: "Congo", code: "242", flag: "🇨🇬" },
        { name: "Coreia do Norte", code: "850", flag: "🇰🇵" },
        { name: "Coreia do Sul", code: "82", flag: "🇰🇷" },
        { name: "Costa do Marfim", code: "225", flag: "🇨🇮" },
        { name: "Costa Rica", code: "506", flag: "🇨🇷" },
        { name: "Croácia", code: "385", flag: "🇭🇷" },
        { name: "Cuba", code: "53", flag: "🇨🇺" },
        { name: "Dinamarca", code: "45", flag: "🇩🇰" },
        { name: "Djibuti", code: "253", flag: "🇩🇯" },
        { name: "Dominica", code: "1-767", flag: "🇩🇲" },
        { name: "Egito", code: "20", flag: "🇪🇬" },
        { name: "El Salvador", code: "503", flag: "🇸🇻" },
        { name: "Emirados Árabes Unidos", code: "971", flag: "🇦🇪" },
        { name: "Equador", code: "593", flag: "🇪🇨" },
        { name: "Eritreia", code: "291", flag: "🇪🇷" },
        { name: "Eslováquia", code: "421", flag: "🇸🇰" },
        { name: "Eslovênia", code: "386", flag: "🇸🇮" },
        { name: "Espanha", code: "34", flag: "🇪🇸" },
        { name: "Estados Unidos", code: "1", flag: "🇺🇸" },
        { name: "Estônia", code: "372", flag: "🇪🇪" },
        { name: "Etiópia", code: "251", flag: "🇪🇹" },
        { name: "Filipinas", code: "63", flag: "🇵🇭" },
        { name: "Finlândia", code: "358", flag: "🇫🇮" },
        { name: "França", code: "33", flag: "🇫🇷" },
        { name: "Gabão", code: "241", flag: "🇬🇦" },
        { name: "Gâmbia", code: "220", flag: "🇬🇲" },
        { name: "Gana", code: "233", flag: "🇬🇭" },
        { name: "Geórgia", code: "995", flag: "🇬🇪" },
        { name: "Grécia", code: "30", flag: "🇬🇷" },
        { name: "Granada", code: "1-473", flag: "🇬🇩" },
        { name: "Groenlândia", code: "299", flag: "🇬🇱" },
        { name: "Guadalupe", code: "590", flag: "🇬🇵" },
        { name: "Guam", code: "1-671", flag: "🇬🇺" },
        { name: "Guatemala", code: "502", flag: "🇬🇹" },
        { name: "Guiana", code: "592", flag: "🇬🇾" },
        { name: "Guiana Francesa", code: "594", flag: "🇬🇫" },
        { name: "Guiné", code: "224", flag: "🇬🇳" },
        { name: "Guiné-Bissau", code: "245", flag: "🇬🇼" },
        { name: "Guiné Equatorial", code: "240", flag: "🇬🇶" },
        { name: "Haiti", code: "509", flag: "🇭🇹" },
        { name: "Holanda", code: "31", flag: "🇳🇱" },
        { name: "Honduras", code: "504", flag: "🇭🇳" },
        { name: "Hong Kong", code: "852", flag: "🇭🇰" },
        { name: "Hungria", code: "36", flag: "🇭🇺" },
        { name: "Índia", code: "91", flag: "🇮🇳" },
        { name: "Indonésia", code: "62", flag: "🇮🇩" },
        { name: "Irã", code: "98", flag: "🇮🇷" },
        { name: "Iraque", code: "964", flag: "🇮🇶" },
        { name: "Irlanda", code: "353", flag: "🇮🇪" },
        { name: "Islândia", code: "354", flag: "🇮🇸" },
        { name: "Israel", code: "972", flag: "🇮🇱" },
        { name: "Itália", code: "39", flag: "🇮🇹" },
        { name: "Jamaica", code: "1-876", flag: "🇯🇲" },
        { name: "Japão", code: "81", flag: "🇯🇵" },
        { name: "Jordânia", code: "962", flag: "🇯🇴" },
        { name: "Kuwait", code: "965", flag: "🇰🇼" },
        { name: "Líbano", code: "961", flag: "🇱🇧" },
        { name: "Líbia", code: "218", flag: "🇱🇾" },
        { name: "Luxemburgo", code: "352", flag: "🇱🇺" },
        { name: "Macau", code: "853", flag: "🇲🇴" },
        { name: "Macedônia", code: "389", flag: "🇲🇰" },
        { name: "Madagascar", code: "261", flag: "🇲🇬" },
        { name: "Malásia", code: "60", flag: "🇲🇾" },
        { name: "Malawi", code: "265", flag: "🇲🇼" },
        { name: "Maldivas", code: "960", flag: "🇲🇻" },
        { name: "Mali", code: "223", flag: "🇲🇱" },
        { name: "Malta", code: "356", flag: "🇲🇹" },
        { name: "Marrocos", code: "212", flag: "🇲🇦" },
        { name: "Martinica", code: "596", flag: "🇲🇶" },
        { name: "Maurício", code: "230", flag: "🇲🇺" },
        { name: "Mauritânia", code: "222", flag: "🇲🇷" },
        { name: "México", code: "52", flag: "🇲🇽" },
        { name: "Moçambique", code: "258", flag: "🇲🇿" },
        { name: "Moldávia", code: "373", flag: "🇲🇩" },
        { name: "Mônaco", code: "377", flag: "🇲🇨" },
        { name: "Mongólia", code: "976", flag: "🇲🇳" },
        { name: "Montenegro", code: "382", flag: "🇲🇪" },
        { name: "Namíbia", code: "264", flag: "🇳🇦" },
        { name: "Nepal", code: "977", flag: "🇳🇵" },
        { name: "Nicarágua", code: "505", flag: "🇳🇮" },
        { name: "Nigéria", code: "234", flag: "🇳🇬" },
        { name: "Noruega", code: "47", flag: "🇳🇴" },
        { name: "Nova Zelândia", code: "64", flag: "🇳🇿" },
        { name: "Omã", code: "968", flag: "🇴🇲" },
        { name: "Panamá", code: "507", flag: "🇵🇦" },
        { name: "Papua Nova Guiné", code: "675", flag: "🇵🇬" },
        { name: "Paquistão", code: "92", flag: "🇵🇰" },
        { name: "Paraguai", code: "595", flag: "🇵🇾" },
        { name: "Peru", code: "51", flag: "🇵🇪" },
        { name: "Polônia", code: "48", flag: "🇵🇱" },
        { name: "Portugal", code: "351", flag: "🇵🇹" },
        { name: "Porto Rico", code: "1-787", flag: "🇵🇷" },
        { name: "Quênia", code: "254", flag: "🇰🇪" },
        { name: "Quirguistão", code: "996", flag: "🇰🇬" },
        { name: "Reino Unido", code: "44", flag: "🇬🇧" },
        { name: "República Centro-Africana", code: "236", flag: "🇨🇫" },
        { name: "República Dominicana", code: "1-809", flag: "🇩🇴" },
        { name: "República Tcheca", code: "420", flag: "🇨🇿" },
        { name: "Romênia", code: "40", flag: "🇷🇴" },
        { name: "Rússia", code: "7", flag: "🇷🇺" },
        { name: "Ruanda", code: "250", flag: "🇷🇼" },
        { name: "Senegal", code: "221", flag: "🇸🇳" },
        { name: "Serra Leoa", code: "232", flag: "🇸🇱" },
        { name: "Sérvia", code: "381", flag: "🇷🇸" },
        { name: "Síria", code: "963", flag: "🇸🇾" },
        { name: "Somália", code: "252", flag: "🇸🇴" },
        { name: "Sri Lanka", code: "94", flag: "🇱🇰" },
        { name: "Suazilândia", code: "268", flag: "🇸🇿" },
        { name: "Sudão", code: "249", flag: "🇸🇩" },
        { name: "Suécia", code: "46", flag: "🇸🇪" },
        { name: "Suíça", code: "41", flag: "🇨🇭" },
        { name: "Suriname", code: "597", flag: "🇸🇷" },
        { name: "Tailândia", code: "66", flag: "🇹🇭" },
        { name: "Taiwan", code: "886", flag: "🇹🇼" },
        { name: "Tanzânia", code: "255", flag: "🇹🇿" },
        { name: "Togo", code: "228", flag: "🇹🇬" },
        { name: "Trinidad e Tobago", code: "1-868", flag: "🇹🇹" },
        { name: "Tunísia", code: "216", flag: "🇹🇳" },
        { name: "Turquia", code: "90", flag: "🇹🇷" },
        { name: "Ucrânia", code: "380", flag: "🇺🇦" },
        { name: "Uganda", code: "256", flag: "🇺🇬" },
        { name: "Uruguai", code: "598", flag: "🇺🇾" },
        { name: "Uzbequistão", code: "998", flag: "🇺🇿" },
        { name: "Vaticano", code: "379", flag: "🇻🇦" },
        { name: "Venezuela", code: "58", flag: "🇻🇪" },
        { name: "Vietnã", code: "84", flag: "🇻🇳" },
        { name: "Zâmbia", code: "260", flag: "🇿🇲" },
        { name: "Zimbábue", code: "263", flag: "🇿🇼" }
    ];
      

    const opcoesGenero = useMemo(() => formatarOpcoesDominio(opcoesDominio.genero), [opcoesDominio.genero, formatarOpcoesDominio]);
    const opcoesCorRaca = useMemo(() => formatarOpcoesDominio(opcoesDominio.cor_raca), [opcoesDominio.cor_raca, formatarOpcoesDominio]);
    const opcoesEstadoCivil = useMemo(() => formatarOpcoesDominio(opcoesDominio.estado_civil), [opcoesDominio.estado_civil, formatarOpcoesDominio]);
    const opcoesTipoRua = useMemo(() => formatarOpcoesTipoRua(opcoesDominio.tipo_rua), [opcoesDominio.tipo_rua, formatarOpcoesTipoRua]);
    const opcoesTipoBairro = useMemo(() => formatarOpcoesTipoBairro(opcoesDominio.tipo_bairro), [opcoesDominio.tipo_bairro, formatarOpcoesTipoBairro]);
    const opcoesDdi = useMemo(() => formatarOpcoesDdi(ddi), [ddi, formatarOpcoesDdi]);

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


    const isCampoInvalido = useMemo(() => {
        return (campo) => {
            return classInvalid.includes(campo);
        };
    }, [classInvalid]);

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
            const response = await http.get(`municipio/?format=json&estado=${estado}`);
            
            // Verifica se a resposta tem a estrutura esperada
            let dados = response;
            if (response && response.results && Array.isArray(response.results)) {
                dados = response.results;
            } else if (response && Array.isArray(response)) {
                dados = response;
            } else {
                dados = [];
            }
            
            if (dados.length > 0) {
                const cidadesFormatadas = dados.map(cidade => ({
                    name: cidade.nome || cidade.descricao,
                    code: cidade.nome || cidade.descricao
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



    // Função para buscar estados por país
    const buscarEstadosPorPais = async (paisId) => {
        if (!paisId) {
            setEstadosEndereco([]);
            return;
        }
        
        const paisSelecionado = paises.find(p => p.code == paisId);
        const isBrasil = paisSelecionado && (paisSelecionado.name === 'Brasil' || paisSelecionado.name === 'Brazil');
        
        if (isBrasil) {
            setLoadingEstadosEndereco(true);
            try {
                const response = await http.get('estado/?format=json');
                
                let dados = response;
                if (response && response.results && Array.isArray(response.results)) {
                    dados = response.results;
                } else if (response && Array.isArray(response)) {
                    dados = response;
                } else {
                    dados = [];
                }
                
                if (dados.length > 0) {
                    const estadosFormatados = dados.map(estado => ({
                        name: estado.nome || estado.descricao,
                        code: estado.sigla || estado.codigo
                    }));
                    setEstadosEndereco(estadosFormatados);
                } else {
                    setEstadosEndereco([]);
                }
            } catch (error) {
                console.error('Erro ao buscar estados para endereço:', error);
                setEstadosEndereco([]);
            } finally {
                setLoadingEstadosEndereco(false);
            }
        } else {
            setEstadosEndereco([]);
        }
    };

    const buscarEstadosParaDocumentos = async () => {
        const response = await http.get('estado/?format=json');
        let dados = response;
        if (response && response.results && Array.isArray(response.results)) {
            dados = response.results;
        } else if (response && Array.isArray(response)) {
            dados = response;
        } else {
            dados = [];
        }

        if (dados.length > 0) {
            const estadosFormatados = dados.map(estado => ({
                name: estado.nome || estado.descricao,
                code: estado.sigla || estado.codigo
            }));
            setEstados(estadosFormatados);
        } else {
            setEstados([]);
        }
    }

    // Função para estados de endereço (baseado no país)
    const buscarEstadosPorPaisEndereco = async (paisId) => {
        if (!paisId) {
            setEstadosEndereco([]);
            return;
        }
        
        const paisSelecionado = paises.find(p => p.code === paisId);
        const isBrasil = paisSelecionado && (paisSelecionado.name === 'Brasil' || paisSelecionado.name === 'Brazil');

        if (isBrasil) {
            setLoadingEstadosEndereco(true);
            try {
                const response = await http.get('estado/?format=json');
                
                let dados = response;
                if (response && response.results && Array.isArray(response.results)) {
                    dados = response.results;
                } else if (response && Array.isArray(response)) {
                    dados = response;
                } else {
                    dados = [];
                }
                
                if (dados.length > 0) {
                    const estadosFormatados = dados.map(estado => ({
                        name: estado.nome || estado.descricao,
                        code: estado.sigla || estado.codigo
                    }));
                    setEstadosEndereco(estadosFormatados);
                } else {
                    setEstadosEndereco([]);
                }
            } catch (error) {
                console.error('Erro ao buscar estados para endereço:', error);
                setEstadosEndereco([]);
            } finally {
                setLoadingEstadosEndereco(false);
            }
        } else {
            setEstadosEndereco([]);
        }
    };

    // Função para estados natal (baseado na nacionalidade)
    const buscarEstadosPorNacionalidade = async (nacionalidadeId) => {
        if (!nacionalidadeId) {
            setEstadosNatal([]);
            return;
        }
        
        const nacionalidadeSelecionada = nacionalidades.find(n => n.code === nacionalidadeId);
        const isBrasil = nacionalidadeSelecionada && (nacionalidadeSelecionada.name === 'Brasil' || nacionalidadeSelecionada.name === 'Brazil');

        if (isBrasil) {
            setLoadingEstadosNatal(true);
            try {
                const response = await http.get('estado/?format=json');
                
                let dados = response;
                if (response && response.results && Array.isArray(response.results)) {
                    dados = response.results;
                } else if (response && Array.isArray(response)) {
                    dados = response;
                } else {
                    dados = [];
                }
                
                if (dados.length > 0) {
                    const estadosFormatados = dados.map(estado => ({
                        name: estado.nome || estado.descricao,
                        code: estado.sigla || estado.codigo
                    }));
                    setEstadosNatal(estadosFormatados);
                } else {
                    setEstadosNatal([]);
                }
            } catch (error) {
                console.error('Erro ao buscar estados para estado natal:', error);
                setEstadosNatal([]);
            } finally {
                setLoadingEstadosNatal(false);
            }
        } else {
            setEstadosNatal([]);
        }
    };

    // Carrega cidades quando o estado natal muda
    useEffect(() => {
        // Verifica se a nacionalidade é Brasil
        const nacionalidadeSelecionada = nacionalidades.find(n => n.code === candidato?.nacionalidade);
        const isBrasil = nacionalidadeSelecionada && (nacionalidadeSelecionada.name === 'Brasil' || nacionalidadeSelecionada.name === 'Brazil');
        
        if (isBrasil && candidato?.estado_natal) {
            buscarCidades(candidato.estado_natal);
        } else {
            setCidades([]);
        }


    }, [candidato?.estado_natal, candidato?.nacionalidade, nacionalidades]);


    // useEffect para carregar estados para documentos quando a tela carregar
    useEffect(() => {
        buscarEstadosParaDocumentos();
    }, []);


    // Filtra estados quando o país muda
    useEffect(() => {
        if (candidato?.pais) {
            buscarEstadosPorPais(candidato.pais);
        } else {
            setEstadosFiltrados([]);
        }
    }, [candidato?.pais]);

    // useEffect para estados de endereço (baseado no país)
    useEffect(() => {
        if (candidato?.pais) {
            buscarEstadosPorPais(candidato.pais);
        } else {
            setEstadosEndereco([]);
        }
    }, [candidato?.pais, paises]);

    // useEffect para estados natal (baseado na nacionalidade)
    useEffect(() => {
        if (candidato?.nacionalidade) {
            buscarEstadosPorNacionalidade(candidato.nacionalidade);
        } else {
            setEstadosNatal([]);
        }
    }, [candidato?.nacionalidade, nacionalidades]);

    // Função para buscar endereço pelo CEP
    const handleCepChange = async (valor) => {
        // Atualiza o campo CEP normalmente
        setCampo('cep', valor);
        removerErroCampo('cep', valor);
        
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
        
        // Campos de UF sempre usam estados brasileiros (independente da nacionalidade)
        const camposUF = ['uf_identidade', 'uf_carteira_trab', 'estado_emissor_tit_eleitor'];
        if (camposUF.includes(campo)) {
            const estadoEncontrado = estados.find(e => e.code === candidato[campo]);
            return estadoEncontrado || '';
        }
        
        // Verifica se a nacionalidade é Brasil
        const nacionalidadeSelecionada = nacionalidades.find(n => n.code === candidato?.nacionalidade);
        const isBrasil = nacionalidadeSelecionada && (nacionalidadeSelecionada.name === 'Brasil' || nacionalidadeSelecionada.name === 'Brazil');
        
        if (isBrasil) {
            // Se for Brasil, busca na lista de estados filtrados ou na lista completa
            const estadoEncontrado = estadosFiltrados.find(e => e.code === candidato[campo]) || 
                                   estados.find(e => e.code === candidato[campo]);
            return estadoEncontrado || '';
        } else {
            // Para outros países, retorna o valor como texto
            return { name: candidato[campo], code: candidato[campo] };
        }
    };

    // Função para obter o país formatado
    const getPaisFormatado = () => {
        if (!candidato?.pais) return '';
        const paisEncontrado = paises.find(p => p.code == candidato.pais);
        return paisEncontrado || '';
    };

    // Função para obter a naturalidade formatada
    const getNaturalidadeFormatada = () => {
        if (!candidato?.naturalidade) return '';
        
        // Verifica se a nacionalidade é Brasil
        const nacionalidadeSelecionada = nacionalidades.find(n => n.code === candidato?.nacionalidade);
        const isBrasil = nacionalidadeSelecionada && (nacionalidadeSelecionada.name === 'Brasil' || nacionalidadeSelecionada.name === 'Brazil');
        
        if (isBrasil) {
            // Se for Brasil, busca na lista de cidades
            const naturalidadeEncontrada = cidades.find(c => c.code === candidato.naturalidade);
            return naturalidadeEncontrada || '';
        } else {
            // Para outros países, retorna o valor como texto
            return { name: candidato.naturalidade, code: candidato.naturalidade };
        }
    };

    // Função para obter estado de endereço formatado
    const getEstadoEnderecoFormatado = () => {
        if (!candidato?.estado) return '';
        const estadoEncontrado = estadosEndereco.find(e => e.code === candidato.estado);
        return estadoEncontrado || '';
    };

    // Função para obter estado natal formatado
    const getEstadoNatalFormatado = () => {
        if (!candidato?.estado_natal) return '';
        const estadoEncontrado = estadosNatal.find(e => e.code === candidato.estado_natal);
        return estadoEncontrado || '';
    };

    // StyledDropdown para DDI (baseado no LanguageSelector)
    const StyledDDIDropdown = styled(Dropdown)`
        border-radius: 4px;
        border: 1px solid var(--neutro-400);
        background: var(--background-label);
        padding: 12px 16px;
        outline: none;
        display: flex;
        align-items: center;
        text-align: left;
        align-self: stretch;
        font-weight: 700;
        font-size: 14px;
        width: 100%;
        height: 46px;
        max-width: 100%;
        margin-bottom: 0px;
        ${props => props.$hasError && `
            border: 1px solid #dc2626;
            outline: none;
        `}

        & .p-dropdown-label {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .p-dropdown-panel {
            background: var(--white) !important;
            .p-dropdown-items {
                padding: 0.5rem;

                .p-dropdown-item {
                    &:hover {
                        background-color: var(--neutro-100) !important;
                    }

                    &.p-highlight {
                        background-color: var(--primaria-50) !important;
                        color: var(--primaria) !important;
                    }
                }
            }
        }
    `;

    // Template para o valor selecionado do DDI
    const ddiValueTemplate = (option) => {
        if (!option) return null;
        
        return (
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '6px',
                lineHeight: '14px',
                fontSize: '14px'
            }}>
                <span style={{ fontSize: '16px' }}>{option.flag}</span>
                <span style={{ 
                    fontSize: '14px',
                    fontWeight: '600',
                    marginTop: '2px',
                    color: 'var(--primaria)'
                }}>
                    +{option.code}
                </span>
            </div>
        );
    };

    // Template para os itens da lista do DDI
    const ddiItemTemplate = (option) => {
        if (!option) return null;
        
        return (
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                fontSize: '14px',
                padding: '8px 12px'
            }}>
                <span style={{ fontSize: '18px' }}>{option.flag}</span>
                <span style={{ 
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'var(--primaria)',
                    minWidth: '30px'
                }}>
                    +{option.code}
                </span>
                <span style={{ 
                    color: 'var(--neutro-600)',
                    fontSize: '14px'
                }}>
                    {option.name}
                </span>
            </div>
        );
    };

    // Definir Brasil (55) como DDI padrão se não houver DDI selecionado
    useEffect(() => {
        if (!candidato?.ddi && !modoLeitura) {
            setCampo('ddi', '55');
        }
    }, [candidato?.ddi, modoLeitura, setCampo]);

    return (
        <GridContainer data-tour="panel-step-1">

            <SectionTitle>Identificação</SectionTitle>

            <CampoTexto
                camposVazios={isCampoEmErro('nome') ? ['nome'] : []}
                name="nome"
                required={true}
                valor={candidato?.nome ?? ''}
                                        setValor={valor => {
                            setCampo('nome', valor);
                            removerErroCampo('nome', valor);
                        }}
                type="text"
                label="Nome"
                placeholder="Digite o nome"
                disabled={modoLeitura}
                maxCaracteres={100}
            />
            <CampoTexto
                camposVazios={isCampoEmErro('cpf') ? ['cpf'] : []}
                required={true}
                name="cpf"
                valor={candidato?.cpf ?? ''}
                                        setValor={valor => {
                            setCampo('cpf', valor);
                            removerErroCampo('cpf', valor);
                        }}
                patternMask="999.999.999-99"
                label="CPF"
                placeholder="Digite o CPF"
                disabled={modoLeitura || (candidato?.cpf && candidato.cpf.trim() !== '')}
            />
            <CampoTexto
                camposVazios={classError}
                name="email"
                required={true}
                valor={candidato?.email ?? ''}
                setValor={valor => {
                    setCampo('email', valor);
                    removerErroCampo('email', valor);
                }}
                type="text"
                label="E-mail"
                placeholder="Digite o email"
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={classError}
                name="email_pessoal"
                valor={candidato?.email_pessoal ?? ''}
                setValor={valor => {
                    setCampo('email_pessoal', valor);
                    removerErroCampo('email_pessoal', valor);
                }}
                type="text"
                label="E-mail Pessoal"
                placeholder="Digite o email pessoal"
                disabled={modoLeitura}
            />
            {/* Campos de telefone organizados em uma linha */}
            <div style={{ 
                display: 'flex', 
                gap: '12px', 
                alignItems: 'flex-start'
            }}>
                <div style={{ flex: '0 0 120px' }}>
                    <div style={{ width: '100%', maxWidth: '100%', minWidth: 0, overflow: 'hidden', flexShrink: 1, flexGrow: 0, boxSizing: 'border-box'}}>
                        <div style={{ marginBottom: '4px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--neutro-700)', marginBottom: '4px' }}>
                                DDI<span style={{color: 'var(--error)'}}> *</span>
                            </label>
                        </div>
                        <StyledDDIDropdown
                            value={(() => {
                                if (!candidato?.ddi) {
                                    // Se não há DDI selecionado, retorna Brasil (55) como padrão
                                    return ddi.find(ddi => ddi.code === "55") || null;
                                }
                                const ddiSelecionado = ddi.find(ddi => String(ddi.code) === String(candidato.ddi));
                                return ddiSelecionado || null;
                            })()}
                            options={ddi}
                            onChange={(e) => {
                                setCampo('ddi', e.value.code);
                                removerErroCampo('ddi', e.value);
                            }}
                            optionLabel="name"
                            valueTemplate={ddiValueTemplate}
                            itemTemplate={ddiItemTemplate}
                            placeholder="DDI"
                            disabled={modoLeitura}
                            $hasError={isCampoEmErro('ddi')}
                            filter
                            filterBy="name,code"
                            showClear={false}
                        />
                        {isCampoEmErro('ddi') && (
                            <p style={{ color: 'var(--error)', fontSize: '12px', margin: '4px 0 0 0' }}>
                                Você deve preencher esse campo
                            </p>
                        )}
                    </div>
                </div>
                <div style={{ flex: '0 0 80px' }}>
                    <CampoTexto
                        camposVazios={classError}
                        name="ddd"
                        required={true}
                        valor={candidato?.ddd ?? ''}
                        setValor={valor => {
                            setCampo('ddd', valor);
                            removerErroCampo('ddd', valor);
                        }}
                        type="text"
                        label="DDD"
                        placeholder="DDD"
                        disabled={modoLeitura}
                    />
                </div>
                <div style={{ flex: '1' }}>
                    <CampoTexto
                        name="telefone"
                        required={true}
                        valor={candidato?.telefone ?? ''}
                        setValor={valor => {
                            setCampo('telefone', valor);
                            removerErroCampo('telefone', valor);
                        }}
                        label="Telefone"
                        placeholder="Número do telefone"
                        disabled={modoLeitura}
                    />
                </div>
            </div>
            <CampoTexto
                camposVazios={isCampoEmErro('dt_nascimento') ? ['dt_nascimento'] : []}
                name="dt_nascimento"
                required={true}
                valor={candidato?.dt_nascimento ?? ''}
                                        setValor={valor => {
                            setCampo('dt_nascimento', valor);
                            removerErroCampo('dt_nascimento', valor);
                        }}
                label="Data de Nascimento"
                type="date"
                disabled={modoLeitura}
            />
            <DropdownItens
                camposVazios={isCampoEmErro('genero') ? ['genero'] : []}
                name="genero"
                required={true}
                label="Gênero"
                valor={getValorSelecionadoFromCandidato('genero', opcoesGenero)}
                setValor={(valor) => {
                            setCampo('genero', valor.code);
                            removerErroCampo('genero', valor);
                        }}
                options={opcoesGenero}
                disabled={modoLeitura}
            />
            <DropdownItens
                camposVazios={isCampoEmErro('cor_raca') ? ['cor_raca'] : []}
                name="cor_raca"
                required={true}
                label="Cor/Raça"
                valor={getValorSelecionadoFromCandidato('cor_raca', opcoesCorRaca)}
                                        setValor={(valor) => {
                            setCampo('cor_raca', valor.code);
                            removerErroCampo('cor_raca', valor);
                        }}
                options={opcoesCorRaca}
                disabled={modoLeitura}
            />
            <DropdownItens
                camposVazios={isCampoEmErro('estado_civil') ? ['estado_civil'] : []}
                name="estado_civil"
                required={true}
                label="Estado Civil"
                valor={getValorSelecionadoFromCandidato('estado_civil', opcoesEstadoCivil)}
                                        setValor={(valor) => {
                            setCampo('estado_civil', valor.code);
                            removerErroCampo('estado_civil', valor);
                        }}
                options={opcoesEstadoCivil}
                disabled={modoLeitura}
            />
            <DropdownItens
                name="nacionalidade"
                label="Nacionalidade"
                required={true}
                valor={getValorSelecionadoFromCandidato('nacionalidade', nacionalidades)}
                setValor={(valor) => setCampo('nacionalidade', valor.code)}
                options={nacionalidades}
                disabled={modoLeitura}
                filter
            />
            {(() => {
                const nacionalidadeSelecionada = nacionalidades.find(n => n.code === candidato?.nacionalidade);
                const isBrasil = nacionalidadeSelecionada && (nacionalidadeSelecionada.name === 'Brasil' || nacionalidadeSelecionada.name === 'Brazil');
                
                return isBrasil ? (
                    <DropdownItens
                        camposVazios={isCampoEmErro('estado_natal') ? ['estado_natal'] : []}
                        name="estado_natal"
                        required={true}
                        label="Estado Natal"
                        valor={getEstadoNatalFormatado()}
                        setValor={valor => {
                            setCampo('estado_natal', valor.code);
                            removerErroCampo('estado_natal', valor);
                        }}
                        options={estadosNatal}
                        placeholder={loadingEstadosNatal ? "Carregando estados..." : "Selecione o estado natal"}
                        disabled={modoLeitura || !candidato?.nacionalidade || loadingEstadosNatal}
                        filter
                    />
                ) : (
                    <CampoTexto
                        camposVazios={isCampoEmErro('estado_natal') ? ['estado_natal'] : []}
                        name="estado_natal"
                        maxCaracteres={2}
                        required={true}
                        valor={candidato?.estado_natal ?? ''}
                        setValor={valor => setCampo('estado_natal', valor)}
                        label="Estado Natal"
                        placeholder="Digite o estado natal"
                        disabled={modoLeitura || !candidato?.nacionalidade}
                    />
                );
            })()}
            {(() => {
                const nacionalidadeSelecionada = nacionalidades.find(n => n.code === candidato?.nacionalidade);
                const isBrasil = nacionalidadeSelecionada && (nacionalidadeSelecionada.name === 'Brasil' || nacionalidadeSelecionada.name === 'Brazil');
                
                return isBrasil ? (
                    <DropdownItens
                        camposVazios={isCampoEmErro('naturalidade') ? ['naturalidade'] : []}
                        name="naturalidade"
                        required={true}
                        label="Naturalidade"
                        valor={getNaturalidadeFormatada()}
                        setValor={valor => {
                            setCampo('naturalidade', valor.code);
                            removerErroCampo('naturalidade', valor);
                        }}
                        options={cidades}
                        placeholder={loadingCidades ? "Carregando cidades..." : "Selecione a naturalidade"}
                        disabled={modoLeitura || !candidato?.estado_natal || loadingCidades}
                        filter
                    />
                ) : (
                    <CampoTexto
                        camposVazios={isCampoEmErro('naturalidade') ? ['naturalidade'] : []}
                        name="naturalidade"
                        required={true}
                        valor={candidato?.naturalidade ?? ''}
                        setValor={valor => setCampo('naturalidade', valor)}
                        label="Naturalidade"
                        placeholder="Digite a naturalidade"
                        disabled={modoLeitura || !candidato?.nacionalidade}
                    />
                );
            })()}
            <CampoTexto
                name="pispasep"
                valor={candidato?.pispasep ?? ''}
                maxCaracteres={12}
                setValor={valor => setCampo('pispasep', valor)}
                label="PIS/PASEP"
                placeholder="Digite o PIS/PASEP"
                disabled={modoLeitura}
                camposInvalidos={isCampoInvalido('pispasep') ? ['pispasep'] : []}
                camposVazios={isCampoEmErro('pispasep') ? ['pispasep'] : []}
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
                setValor={valor => {
                    setCampo('carteira_trabalho', valor);
                    removerErroCampo('carteira_trabalho', valor);
                }}
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
                setValor={valor => {
                    setCampo('serie_carteira_trab', valor);
                    removerErroCampo('serie_carteira_trab', valor);
                }}
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
                setValor={valor => {
                    setCampo('uf_carteira_trab', valor.code);
                    removerErroCampo('uf_carteira_trab', valor);
                }}
                options={estados}
                placeholder="Selecione a UF"
                disabled={modoLeitura}
                filter
            />
            <CampoTexto
                camposVazios={isCampoObrigatorio('data_emissao_ctps') && isCampoEmErro('data_emissao_ctps') ? ['data_emissao_ctps'] : []}
                name="data_emissao_ctps"
                valor={candidato?.data_emissao_ctps ?? ''}
                setValor={valor => {
                    setCampo('data_emissao_ctps', valor);
                    removerErroCampo('data_emissao_ctps', valor);
                }}
                type="date"
                label={`Data de Emissão da CTPS${isCampoObrigatorio('data_emissao_ctps') ? '*' : ''}`}
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={isCampoObrigatorio('data_venc_ctps') && isCampoEmErro('data_venc_ctps') ? ['data_venc_ctps'] : []}
                name="data_venc_ctps"
                valor={candidato?.data_venc_ctps ?? ''}
                setValor={valor => {
                    setCampo('data_venc_ctps', valor);
                    removerErroCampo('data_venc_ctps', valor);
                }}
                type="date"
                label={`Data de Vencimento da CTPS${isCampoObrigatorio('data_venc_ctps') ? '*' : ''}`}
                disabled={modoLeitura}
            />
            
            <SectionTitle>CNH</SectionTitle>
            
            <CampoTexto
                camposVazios={isCampoObrigatorio('carteira_motorista') && isCampoEmErro('carteira_motorista') ? ['carteira_motorista'] : []}
                name="carteira_motorista"
                valor={candidato?.carteira_motorista ?? ''}
                setValor={valor => {
                    setCampo('carteira_motorista', valor);
                    removerErroCampo('carteira_motorista', valor);
                }}
                patternMask="99999999999"
                label={`Número da CNH${isCampoObrigatorio('carteira_motorista') ? '*' : ''}`}
                placeholder="Digite o número da CNH"
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={isCampoObrigatorio('data_emissao_cnh') && isCampoEmErro('data_emissao_cnh') ? ['data_emissao_cnh'] : []}
                name="data_emissao_cnh"
                valor={candidato?.data_emissao_cnh ?? ''}
                setValor={valor => {
                    setCampo('data_emissao_cnh', valor);
                    removerErroCampo('data_emissao_cnh', valor);
                }}
                type="date"
                label={`Data de Emissão da CNH${isCampoObrigatorio('data_emissao_cnh') ? '*' : ''}`}
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={isCampoObrigatorio('tipo_carteira_habilit') && isCampoEmErro('tipo_carteira_habilit') ? ['tipo_carteira_habilit'] : []}
                name="tipo_carteira_habilit"
                valor={candidato?.tipo_carteira_habilit ?? ''}
                setValor={valor => {
                    setCampo('tipo_carteira_habilit', valor);
                    removerErroCampo('tipo_carteira_habilit', valor);
                }}
                label={`Tipo da CNH${isCampoObrigatorio('tipo_carteira_habilit') ? '*' : ''}`}
                placeholder="Ex: A, B, C, D, E"
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={isCampoObrigatorio('data_venc_habilit') && isCampoEmErro('data_venc_habilit') ? ['data_venc_habilit'] : []}
                name="data_venc_habilit"
                valor={candidato?.data_venc_habilit ?? ''}
                setValor={valor => {
                    setCampo('data_venc_habilit', valor);
                    removerErroCampo('data_venc_habilit', valor);
                }}
                type="date"
                label={`Data de Vencimento da CNH${isCampoObrigatorio('data_venc_habilit') ? '*' : ''}`}
                disabled={modoLeitura}
            />
            
            <SectionTitle>RG</SectionTitle>

            <CampoTexto
                camposVazios={isCampoObrigatorio('identidade') && isCampoEmErro('identidade') ? ['identidade'] : []}
                name="identidade"
                valor={candidato?.identidade ?? ''}
                setValor={valor => {
                    setCampo('identidade', valor);
                    removerErroCampo('identidade', valor);
                }}
                //patternMask="99999999S"
                maxCaracteres={15}
                label={`Identidade (RG)${isCampoObrigatorio('identidade') ? '*' : ''}`}
                placeholder="Digite o número do RG"
                disabled={modoLeitura}
            />
            <DropdownItens
                camposVazios={isCampoObrigatorio('uf_identidade') && isCampoEmErro('uf_identidade') ? ['uf_identidade'] : []}
                name="uf_identidade"
                label={`UF da Identidade${isCampoObrigatorio('uf_identidade') ? '*' : ''}`}
                valor={getEstadoFormatado('uf_identidade')}
                setValor={valor => {
                    setCampo('uf_identidade', valor.code);
                    removerErroCampo('uf_identidade', valor);
                }}
                options={estados}
                placeholder="Selecione a UF"
                disabled={modoLeitura}
                filter
            />
            <CampoTexto
                camposVazios={isCampoObrigatorio('orgao_emissor_ident') && isCampoEmErro('orgao_emissor_ident') ? ['orgao_emissor_ident'] : []}
                name="orgao_emissor_ident"
                valor={candidato?.orgao_emissor_ident ?? ''}
                setValor={valor => {
                    setCampo('orgao_emissor_ident', valor);
                    removerErroCampo('orgao_emissor_ident', valor);
                }}
                label={`Órgão Emissor da Identidade${isCampoObrigatorio('orgao_emissor_ident') ? '*' : ''}`}
                placeholder="Ex: SSP, DETRAN"
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={isCampoObrigatorio('data_emissao_ident') && isCampoEmErro('data_emissao_ident') ? ['data_emissao_ident'] : []}
                name="data_emissao_ident"
                valor={candidato?.data_emissao_ident ?? ''}
                setValor={valor => {
                    setCampo('data_emissao_ident', valor);
                    removerErroCampo('data_emissao_ident', valor);
                }}
                type="date"
                label={`Data de Emissão da Identidade${isCampoObrigatorio('data_emissao_ident') ? '*' : ''}`}
                disabled={modoLeitura}
            />

            <SectionTitle>Título de Eleitor</SectionTitle>

            <CampoTexto
                camposVazios={isCampoObrigatorio('titulo_eleitor') && isCampoEmErro('titulo_eleitor') ? ['titulo_eleitor'] : []}
                name="titulo_eleitor"
                valor={candidato?.titulo_eleitor ?? ''}
                setValor={valor => {
                    setCampo('titulo_eleitor', valor);
                    removerErroCampo('titulo_eleitor', valor);
                }}
                patternMask="999999999999"
                label={`Título de Eleitor${isCampoObrigatorio('titulo_eleitor') ? '*' : ''}`}
                placeholder="Digite o número do título"
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={isCampoObrigatorio('zona_titulo_eleitor') && isCampoEmErro('zona_titulo_eleitor') ? ['zona_titulo_eleitor'] : []}
                name="zona_titulo_eleitor"
                valor={candidato?.zona_titulo_eleitor ?? ''}
                setValor={valor => {
                    setCampo('zona_titulo_eleitor', valor);
                    removerErroCampo('zona_titulo_eleitor', valor);
                }}
                patternMask="999"
                label={`Zona do Título${isCampoObrigatorio('zona_titulo_eleitor') ? '*' : ''}`}
                placeholder="Digite a zona"
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={isCampoObrigatorio('secao_titulo_eleitor') && isCampoEmErro('secao_titulo_eleitor') ? ['secao_titulo_eleitor'] : []}
                name="secao_titulo_eleitor"
                valor={candidato?.secao_titulo_eleitor ?? ''}
                setValor={valor => {
                    setCampo('secao_titulo_eleitor', valor);
                    removerErroCampo('secao_titulo_eleitor', valor);
                }}
                patternMask="9999"
                label={`Seção do Título${isCampoObrigatorio('secao_titulo_eleitor') ? '*' : ''}`}
                placeholder="Digite a seção"
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={isCampoObrigatorio('data_titulo_eleitor') && isCampoEmErro('data_titulo_eleitor') ? ['data_titulo_eleitor'] : []}
                name="data_titulo_eleitor"
                valor={candidato?.data_titulo_eleitor ?? ''}
                setValor={valor => {
                    setCampo('data_titulo_eleitor', valor);
                    removerErroCampo('data_titulo_eleitor', valor);
                }}
                type="date"
                label={`Data do Título${isCampoObrigatorio('data_titulo_eleitor') ? '*' : ''}`}
                disabled={modoLeitura}
            />
            <DropdownItens
                camposVazios={isCampoObrigatorio('estado_emissor_tit_eleitor') && isCampoEmErro('estado_emissor_tit_eleitor') ? ['estado_emissor_tit_eleitor'] : []}
                name="estado_emissor_tit_eleitor"
                label={`Estado Emissor do Título${isCampoObrigatorio('estado_emissor_tit_eleitor') ? '*' : ''}`}
                valor={getEstadoFormatado('estado_emissor_tit_eleitor')}
                setValor={valor => {
                    setCampo('estado_emissor_tit_eleitor', valor.code);
                    removerErroCampo('estado_emissor_tit_eleitor', valor);
                }}
                options={estados}
                placeholder="Selecione o estado"
                disabled={modoLeitura}
                filter
            />
            
            <SectionTitle>Passaporte</SectionTitle>

            <CampoTexto
                camposVazios={isCampoObrigatorio('numero_passaporte') && isCampoEmErro('numero_passaporte') ? ['numero_passaporte'] : []}
                name="numero_passaporte"
                valor={candidato?.numero_passaporte ?? ''}
                setValor={valor => {
                    setCampo('numero_passaporte', valor);
                    removerErroCampo('numero_passaporte', valor);
                }}
                label={`Número do Passaporte${isCampoObrigatorio('numero_passaporte') ? '*' : ''}`}
                placeholder="Digite o número do passaporte"
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={isCampoObrigatorio('pais_origem') && isCampoEmErro('pais_origem') ? ['pais_origem'] : []}
                name="pais_origem"
                valor={candidato?.pais_origem ?? ''}
                setValor={valor => {
                    setCampo('pais_origem', valor);
                    removerErroCampo('pais_origem', valor);
                }}
                label={`País de Origem${isCampoObrigatorio('pais_origem') ? '*' : ''}`}
                placeholder="Digite o nome do país de origem"
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={isCampoObrigatorio('data_emissao_passaporte') && isCampoEmErro('data_emissao_passaporte') ? ['data_emissao_passaporte'] : []}
                name="data_emissao_passaporte"
                valor={candidato?.data_emissao_passaporte ?? ''}
                setValor={valor => {
                    setCampo('data_emissao_passaporte', valor);
                    removerErroCampo('data_emissao_passaporte', valor);
                }}
                type="date"
                label={`Data de Emissão do Passaporte${isCampoObrigatorio('data_emissao_passaporte') ? '*' : ''}`}
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={isCampoObrigatorio('data_validade_passaporte') && isCampoEmErro('data_validade_passaporte') ? ['data_validade_passaporte'] : []}
                name="data_validade_passaporte"
                valor={candidato?.data_validade_passaporte ?? ''}
                setValor={valor => {
                    setCampo('data_validade_passaporte', valor);
                    removerErroCampo('data_validade_passaporte', valor);
                }}
                type="date"
                label={`Data de Validade do Passaporte${isCampoObrigatorio('data_validade_passaporte') ? '*' : ''}`}
                disabled={modoLeitura}
            />

            <SectionTitle>Documento Estrangeiro/RNM</SectionTitle>

            <CampoTexto
                camposVazios={isCampoObrigatorio('rnm') && isCampoEmErro('rnm') ? ['rnm'] : []}
                name="rnm"
                valor={candidato?.rnm ?? ''}
                setValor={valor => {
                    setCampo('rnm', valor);
                    removerErroCampo('rnm', valor);
                }}
                label={`Número do RNM${isCampoObrigatorio('rnm') ? '*' : ''}`}
                placeholder="Digite o número do rnm"
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={isCampoObrigatorio('decreto_imigracao') && isCampoEmErro('decreto_imigracao') ? ['decreto_imigracao'] : []}
                name="decreto_imigracao"
                valor={candidato?.decreto_imigracao ?? ''}
                setValor={valor => {
                    setCampo('decreto_imigracao', valor);
                    removerErroCampo('decreto_imigracao', valor);
                }}
                label={`Decreto de Imigração${isCampoObrigatorio('decreto_imigracao') ? '*' : ''}`}
                placeholder="Digite o número do decreto de imigração"
                disabled={modoLeitura}
            />
            <DropdownItens
                camposVazios={isCampoObrigatorio('uf_emissor_rnm') && isCampoEmErro('uf_emissor_rnm') ? ['uf_emissor_rnm'] : []}
                name="uf_emissor_rnm"
                label={`UF Emissor do RNM${isCampoObrigatorio('uf_emissor_rnm') ? '*' : ''}`}
                valor={getEstadoFormatado('uf_emissor_rnm')}
                setValor={valor => {
                    setCampo('uf_emissor_rnm', valor.code);
                    removerErroCampo('uf_emissor_rnm', valor);
                }}
                options={estados}
                placeholder="Selecione o estado"
                disabled={modoLeitura}
                filter
            />
            <CampoTexto
                camposVazios={isCampoObrigatorio('data_emissao_rnm') && isCampoEmErro('data_emissao_rnm') ? ['data_emissao_rnm'] : []}
                name="data_emissao_rnm"
                valor={candidato?.data_emissao_rnm ?? ''}
                setValor={valor => {
                    setCampo('data_emissao_rnm', valor);
                    removerErroCampo('data_emissao_rnm', valor);
                }}
                type="date"
                label={`Data de Emissão do RNM${isCampoObrigatorio('data_emissao_rnm') ? '*' : ''}`}
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={isCampoObrigatorio('data_vencimento_rnm') && isCampoEmErro('data_vencimento_rnm') ? ['data_vencimento_rnm'] : []}
                name="data_vencimento_rnm"
                valor={candidato?.data_vencimento_rnm ?? ''}
                setValor={valor => {
                    setCampo('data_vencimento_rnm', valor);
                    removerErroCampo('data_vencimento_rnm', valor);
                }}
                type="date"
                label={`Data de Vencimento do RNM${isCampoObrigatorio('data_vencimento_rnm') ? '*' : ''}`}
                disabled={modoLeitura}
            />

            
            <SectionTitle>Endereço</SectionTitle>
            
            <DropdownItens
                name="pais"
                label="País"
                valor={getPaisFormatado()}
                setValor={valor => {
                    setCampo('pais', valor.code);
                    // Limpa o estado quando muda o país
                    setCampo('estado', '');
                }}
                options={paises}
                placeholder="Selecione o país"
                disabled={modoLeitura}
                filter
            />
            <CampoTexto
                camposVazios={isCampoEmErro('cep') ? ['cep'] : []}
                name="cep"
                required={true}
                patternMask="99999-999"
                valor={candidato?.cep ?? ''}
                setValor={handleCepChange}
                label="CEP"
                disabled={modoLeitura}
            />
            <DropdownItens
                camposVazios={isCampoEmErro('tipo_rua') ? ['tipo_rua'] : []}
                name="tipo_rua"
                required={true}
                label="Tipo de Logradouro"
                valor={(() => {
                    if (!candidato?.tipo_rua) return null;
                    const code = typeof candidato.tipo_rua === 'object'
                        ? candidato.tipo_rua.id
                        : candidato.tipo_rua;
                    return opcoesTipoRua.find(item => String(item.code) === String(code)) || null;
                })()}
                setValor={(valor) => {
                    setCampo('tipo_rua', valor.id_origem || valor.code);
                    removerErroCampo('tipo_rua', valor);
                }}
                options={opcoesTipoRua}
                placeholder="Selecione o tipo"
                disabled={modoLeitura}
                filter
            />
            <CampoTexto
                camposVazios={isCampoEmErro('rua') ? ['rua'] : []}
                name="rua"
                required={true}
                valor={candidato?.rua ?? ''}
                setValor={valor => {
                    setCampo('rua', valor);
                    removerErroCampo('rua', valor);
                }}
                label="Logradouro"
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={isCampoEmErro('numero') ? ['numero'] : []}
                name="numero"
                required={true}
                valor={candidato?.numero ?? ''}
                setValor={valor => {
                    setCampo('numero', valor);
                    removerErroCampo('numero', valor);
                }}
                label="Número"
                disabled={modoLeitura}
            />
            <CampoTexto
                camposVazios={isCampoEmErro('bairro') ? ['bairro'] : []}
                name="bairro"
                required={true}
                valor={candidato?.bairro ?? ''}
                setValor={valor => {
                    setCampo('bairro', valor);
                    removerErroCampo('bairro', valor);
                }}
                label="Bairro"
                disabled={modoLeitura}
            />
            <DropdownItens
                camposVazios={isCampoEmErro('tipo_bairro') ? ['tipo_bairro'] : []}
                name="tipo_bairro"
                required={true}
                label="Tipo de Bairro"
                valor={(() => {
                    if (!candidato?.tipo_bairro) return null;
                    const code = typeof candidato.tipo_bairro === 'object'
                        ? candidato.tipo_bairro.id
                        : candidato.tipo_bairro;
                    return opcoesTipoBairro.find(item => String(item.code) === String(code)) || null;
                })()}
                setValor={(valor) => {
                    setCampo('tipo_bairro', valor.id_origem || valor.code);
                    removerErroCampo('tipo_bairro', valor);
                }}
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
                camposVazios={isCampoEmErro('cidade') ? ['cidade'] : []}
                name="cidade"
                required={true}
                valor={candidato?.cidade ?? ''}
                setValor={valor => {
                    setCampo('cidade', valor);
                    removerErroCampo('cidade', valor);
                }}
                label="Cidade"
                disabled={modoLeitura}
            />
            {(() => {
                const paisSelecionado = paises.find(p => p.code == candidato?.pais);
                const isBrasil = paisSelecionado && (paisSelecionado.name === 'Brasil' || paisSelecionado.name === 'Brazil');
                return isBrasil;
            })() ? (
                <DropdownItens
                    camposVazios={isCampoEmErro('estado') ? ['estado'] : []}
                    $margin={'10px'}
                    required={true}
                    valor={getEstadoEnderecoFormatado()}
                    setValor={valor => {
                        setCampo('estado', valor.code);
                        removerErroCampo('estado', valor);
                    }}
                    options={estadosEndereco}
                    name="state"
                    label="Estado"
                    placeholder={loadingEstadosEndereco ? "Carregando estados..." : "Selecione o estado"}
                    disabled={modoLeitura || !candidato?.pais || loadingEstadosEndereco}
                    filter
                />
            ) : (
                <CampoTexto
                    camposVazios={isCampoEmErro('estado') ? ['estado'] : []}
                    name="estado"
                    required={true}
                    valor={candidato?.estado ?? ''}
                    setValor={valor => {
                        setCampo('estado', valor);
                        removerErroCampo('estado', valor);
                    }}
                    label="Estado/Província"
                    placeholder="Digite o estado ou província"
                    disabled={modoLeitura || !candidato?.pais}
                />
            )}
        </GridContainer>
    );
};

export default StepDadosPessoais; 