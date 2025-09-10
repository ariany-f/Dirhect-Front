import { createContext, useContext, useState } from 'react';

const candidatoInicial = {
    id: null,
    tarefas: [],
    log_tarefas: [],
    documentos_status: {
        total: 0,
        enviados: 0
    },
    documentos: [],
    dados_vaga: {
        id: null,
        total_candidatos: 0,
        filial_nome: '',
        filial_id: null,
        departamento_nome: '',
        departamento_id: null,
        cargo_nome: '',
        cargo_id: null,
        funcao_nome: '',
        funcao_id: null,
        centro_custo_nome: '',
        centro_custo_id: null,
        centro_custo: null,
        secao_nome: '',
        secao_id: null,
        horario_id: null,
        sindicato_id: null,
        candidatos_aprovados: 0,
        titulo: '',
        descricao: '',
        dt_abertura: '',
        dt_encerramento: '',
        deficiencia: false,
        periculosidade: '',
        insalubridade: '',
        inclusao: false,
        inclusao_para: null,
        qtd_vaga: 0,
        status: '',
        salario: '',
        horario_nome: null,
        sindicato_nome: null
    },
    vagas_configurado: [],
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    dt_nascimento: '',
    dt_exame_medico: '',
    dt_inicio: '',
    observacao: '',
    created_at: '',
    updated_at: '',
    chapa: null,
    codigo_ficha_registro: null,
    tipo_admissao: null,
    dt_admissao: '',
    status: '',
    aceite_lgpd: false,
    salario: '',
    codigo_jornada: null,
    agencia: null,
    conta_corrente: null,
    pix: null,
    estado_natal: null,
    naturalidade: null,
    apelido: null,
    sexo: null,
    nacionalidade: null,
    rua: null,
    numero: null,
    complemento: null,
    bairro: null,
    tipo_rua: null,
    tipo_bairro: null,
    estado: null,
    cidade: null,
    cep: null,
    pais: null,
    perc_adiantamento: null,
    ajuda_custo: null,
    arredondamento: null,
    media_sal_maternidade: null,
    registro_profissional: null,
    imagem_id: null,
    telefone1: null,
    telefone2: null,
    uf_identidade: null,
    orgao_emissor_ident: null,
    data_emissao_ident: null,
    titulo_eleitor: null,
    zona_titulo_eleitor: null,
    secao_titulo_eleitor: null,
    carteira_trabalho: null,
    serie_carteira_trab: null,
    uf_carteira_trab: null,
    data_emissao_ctps: null,
    nit: null,
    carteira_motorista: null,
    tipo_carteira_habilit: null,
    data_venc_habilit: null,
    identidade: null,
    certificado_reservista: null,
    naturalizado: false,
    data_venc_ctps: null,
    tipo_visto: null,
    email_pessoal: null,
    cor_raca: null,
    deficiente_fisico: false,
    numero_passaporte: null,
    pais_origem: null,
    data_emissao_passaporte: null,
    data_validade_passaporte: null,
    observacoes_pessoa: null,
    codigo_municipio: null,
    circunscricao_militar: null,
    orgao_expedicao: null,
    regiao_militar: null,
    situacao_militar: null,
    data_titulo_eleitor: null,
    estado_emissor_tit_eleitor: null,
    tipo_sanguineo: null,
    id_biometria: null,
    imagem: null,
    primeiro_nome: null,
    nome_mae: null,
    nome_pai: null,
    uf_registro_profissional: null,
    data_emissao_cnh: null,
    data_naturalizacao: null,
    id_pais: null,
    nome_social: null,
    pispasep: null,
    dt_opcao_fgts: null,
    conta_operacao: null,
    codigo_situacao_fgts: null,
    numero_cartao_sus: null,
    candidato: null,
    vaga: null,
    processo: null,
    funcionario: null,
    centro_custo: null,
    filial: null,
    departamento: null,
    id_secao: null,
    id_funcao: null,
    id_horario: null,
    tipo_funcionario: null,
    tipo_situacao: null,
    banco: null,
    estado_civil: null,
    genero: null,
    funcao_emprego_cargoacumulavel: false,
    confianca: false,
    funcao_confianca: null,
    mensal: false,
    calcula_inss: false,
    calcula_irrf: false,
    educacao: [],
    habilidades: [],
    experiencia: [],
    dependentes: [],
    anotacoes: ''
};

export const CandidatoContext = createContext({
    candidato: candidatoInicial,
    setCandidato: () => null,
    limparCandidato: () => null,
    setCampo: () => null,
    setEndereco: () => null,
    setExperiencia: () => null,
    setHabilidades: () => null,
    setEducacao: () => null,
    setArray: () => null,
    addArrayItem: () => null,
    updateArrayItem: () => null,
    removeArrayItem: () => null,
    admissao: null,
    setAdmissao: () => null,
    vaga: null,
    setVaga: () => null,
});

export const useCandidatoContext = () => useContext(CandidatoContext);

export const CandidatoProvider = ({ children }) => {
    const [candidato, setCandidato] = useState(candidatoInicial);
    const [admissao, setAdmissao] = useState(null);
    const [vaga, setVaga] = useState(null);

    const limparCandidato = () => setCandidato(candidatoInicial);

    // Atualiza campo simples
    const setCampo = (campo, valor) => setCandidato(prev => ({ ...prev, [campo]: valor }));

    // Atualiza campo de dados da vaga
    const setDadosVaga = (campo, valor) => setCandidato(prev => ({
        ...prev,
        dados_vaga: { ...prev.dados_vaga, [campo]: valor }
    }));

    // Atualiza campo de dados do candidato
    const setDadosCandidato = (campo, valor) => setCandidato(prev => ({
        ...prev,
        dados_candidato: { ...prev.dados_candidato, [campo]: valor }
    }));

    // Atualiza campo de documentos status
    const setDocumentosStatus = (campo, valor) => setCandidato(prev => ({
        ...prev,
        documentos_status: { ...prev.documentos_status, [campo]: valor }
    }));

    // Atualiza array inteiro (educacao, habilidades, experiencia, documentos)
    const setArray = (arrayName, arr) => setCandidato(prev => ({
        ...prev,
        [arrayName]: arr
    }));

    // Adiciona item a um array
    const addArrayItem = (arrayName, item) => setCandidato(prev => ({
        ...prev,
        [arrayName]: [...(prev[arrayName] || []), item]
    }));

    // Atualiza item de um array pelo índice
    const updateArrayItem = (arrayName, idx, newItem) => setCandidato(prev => ({
        ...prev,
        [arrayName]: prev[arrayName].map((item, i) => i === idx ? newItem : item)
    }));

    // Remove item de um array pelo índice
    const removeArrayItem = (arrayName, idx) => setCandidato(prev => ({
        ...prev,
        [arrayName]: prev[arrayName].filter((_, i) => i !== idx)
    }));

    // Atualiza log de tarefas
    const addLogTarefa = (log) => setCandidato(prev => ({
        ...prev,
        log_tarefas: [...prev.log_tarefas, log]
    }));

    const setExperiencia = (experiencia) => setCandidato(prev => ({
        ...prev,
        experiencia: experiencia
    }));

    const setHabilidades = (habilidades) => setCandidato(prev => ({
        ...prev,
        habilidades: habilidades
    }));

    const setEducacao = (educacao) => setCandidato(prev => ({
        ...prev,
        educacao: educacao
    }));
    
    return (
        <CandidatoContext.Provider value={{
            candidato,
            setCandidato,
            limparCandidato,
            setCampo,
            setDadosVaga,
            setDadosCandidato,
            setDocumentosStatus,
            setExperiencia,
            setHabilidades,
            setEducacao,
            setArray,
            addArrayItem,
            updateArrayItem,
            removeArrayItem,
            addLogTarefa,
            admissao,
            setAdmissao,
            vaga,
            setVaga
        }}>
            {children}
        </CandidatoContext.Provider>
    );
};
