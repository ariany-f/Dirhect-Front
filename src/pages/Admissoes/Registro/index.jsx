import React, { useEffect, useRef, useState } from 'react';
import { useVagasContext } from '@contexts/VagasContext'; // Importando o contexto
import Container from '@components/Container'; // Importando o componente Container
import Botao from '@components/Botao'; // Importando o componente Container
import { useNavigate, useParams } from 'react-router-dom';
import styled from "styled-components"
import http from '@http'
import axios from "axios"
import BotaoVoltar from "@components/BotaoVoltar"
import styles from './../Candidatos.module.css'
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { ScrollPanel } from 'primereact/scrollpanel';
import { HiArrowLeft, HiArrowRight, HiEye } from 'react-icons/hi';
import { FaTrash, FaSave, FaEye, FaUpload } from 'react-icons/fa';
import { Toast } from 'primereact/toast';
import { CandidatoProvider, useCandidatoContext } from '@contexts/Candidato';
import StepDocumentos from './Steps/StepDocumentos';
import StepDadosPessoais from './Steps/StepDadosPessoais';
import StepDadosBancarios from './Steps/StepDadosBancarios';
import StepVaga from './Steps/StepVaga';
import StepEducacao from './Steps/StepEducacao';
import StepHabilidades from './Steps/StepHabilidades';
import StepExperiencia from './Steps/StepExperiencia';
import StepLGPD from './Steps/StepLGPD';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { RiExchangeFill } from 'react-icons/ri';

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    position: relative;

    .custom-stepper {
        display: flex;
        flex-direction: column;
        height: 500px; /* Altura fixa menor */
        min-height: 400px; /* Altura mínima */
    }

    .custom-stepper .p-stepper-header {
        padding-top: 8px !important;
        padding-bottom: 8px !important;
        flex-shrink: 0; /* Impede que o header encolha */
        min-height: auto !important;
    }

    .custom-stepper .p-stepper-content {
        padding-top: 10px !important;
        flex: 1; /* Permite que o conteúdo use o espaço restante */
        overflow: hidden; /* Evita overflow que pode esconder o header */
    }

    .custom-stepper .p-stepper-panels {
        flex: 1;
        overflow: hidden;
    }

    .custom-stepper .p-stepper-panel {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    /* Altura responsiva para o ScrollPanel principal */
    .responsive-scroll-panel {
        width: 100%;
        height: 380px; /* Altura fixa menor */
        min-height: 300px;
        max-height: 380px;
    }

    /* Altura responsiva para ScrollPanels internos */
    .responsive-inner-scroll {
        width: 100%;
        height: 340px; /* Altura fixa menor */
        min-height: 260px;
        max-height: 340px;
        margin-bottom: 10px;
    }

    /* Media query específica para detectar zoom/escala do Windows */
    @media (min-resolution: 120dpi), (min-resolution: 1.25dppx) {
        .custom-stepper {
            height: 450px; /* Altura menor para zoom 125% */
        }
        .responsive-scroll-panel {
            height: 330px; /* Altura menor para zoom 125% */
            min-height: 280px;
            max-height: 330px;
        }
        .responsive-inner-scroll {
            height: 290px;
            min-height: 240px;
            max-height: 290px;
        }
    }

    /* Para zoom ainda maior (150%+) */
    @media (min-resolution: 144dpi), (min-resolution: 1.5dppx) {
        .custom-stepper {
            height: 400px;
        }
        .responsive-scroll-panel {
            height: 280px;
            min-height: 250px;
            max-height: 280px;
        }
        .responsive-inner-scroll {
            height: 240px;
            min-height: 210px;
            max-height: 240px;
        }
    }

    /* Para telas muito pequenas */
    @media (max-height: 600px) {
        .custom-stepper {
            height: 350px;
        }
        .responsive-scroll-panel {
            height: 250px;
            min-height: 200px;
        }
        .responsive-inner-scroll {
            height: 210px;
            min-height: 170px;
        }
    }
`

const CandidatoRegistro = () => {

    let { id, self = false } = useParams()
    const { candidato, setCandidato, admissao, setAdmissao, vaga, setVaga } = useCandidatoContext()
    const [classError, setClassError] = useState([])
    const stepperRef = useRef(null);
    const navegar = useNavigate()
 
    const [filiais, setFiliais] = useState([]);
    const [centros_custo, setCentrosCusto] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [secoes, setSecoes] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [funcoes, setFuncoes] = useState([]);
    const [sindicatos, setSindicatos] = useState([]);
    const [estados, setEstados] = useState([]);
    const toast = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const [listaPericulosidades, setListaPericulosidades] = useState([
        { code: 'QC', name: 'Trabalho com Substâncias Químicas Perigosas' },
        { code: 'MP', name: 'Atividades com Máquinas e Equipamentos Pesados' },
        { code: 'HA', name: 'Trabalho em Altura' },
        { code: 'RA', name: 'Exposição a Radiação' },
        { code: 'TE', name: 'Trabalho com Energia Elétrica' },
        { code: 'CE', name: 'Exposição ao Calor Excessivo' },
        { code: 'PE', name: 'Atividades com Produtos Explosivos' },
        { code: 'CA', name: 'Trabalho em Ambientes Confinedos' },
        { code: 'SA', name: 'Atividades Subaquáticas' },
        { code: 'RAU', name: 'Exposição a Ruídos Altos' },
        { code: 'PB', name: 'Perigos Biológicos' },
        { code: 'TE', name: 'Exposição a Temperaturas Extremas' },
        { code: 'DA', name: 'Trabalho em Áreas de Desastres ou Emergências' },
        { code: 'MC', name: 'Manipulação de Materiais Cortantes' },
        { code: 'SC', name: 'Exposição a Substâncias Cancerígenas' }
    ]);

    const [listaInsalubridades, setListaInsalubridades] = useState([
        { code: '30%', name: '30%' },
        { code: '40%', name: '40%' },
        { code: '50%', name: '50%' },
        { code: '60%', name: '60%' },
        { code: '70%', name: '70%' },   
    ]);

    useEffect(() => {
        if (!estados.length) {
            http.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
                .then(response => {
                    response.map((item) => {
                        let obj = {
                            name: item.nome,
                            code: item.sigla
                        }
                        if (!estados.includes(obj)) {
                            setEstados(estadoAnterior => [...estadoAnterior, obj]);
                        }
                    })
                })
        }

        // Refatoração: array de endpoints e setters
        const listasAuxiliares = [
            { endpoint: 'filial/?format=json', setter: setFiliais },
            { endpoint: 'departamento/?format=json', setter: setDepartamentos },
            { endpoint: 'secao/?format=json', setter: setSecoes },
            { endpoint: 'cargo/?format=json', setter: setCargos },
            { endpoint: 'centro_custo/?format=json', setter: setCentrosCusto },
            { endpoint: 'sindicato/?format=json', setter: setSindicatos },
            { endpoint: 'horario/?format=json', setter: setHorarios },
            { endpoint: 'funcao/?format=json', setter: setFuncoes },
        ];

        listasAuxiliares.forEach(({ endpoint, setter }) => {
            http.get(endpoint)
                .then(response => setter(response))
                .catch(() => {})
                .finally(() => {});
        });
    }, [])

    const ChangeCep = (value) => 
    {
        setCep(value)
        if(value.length > 8)
        {
            axios.get(`https://viacep.com.br/ws/${value.replace('-', '')}/json`)
            .then((response) => {
                if(response.data)
                {
                    setStreet(response.data.logradouro)
                    setDistrict(response.data.bairro)
                    setCity(response.data.localidade)
                    setState(response.data.uf)
                }
            })
        }
    }

    // Função utilitária para buscar e processar dados do OCR
    async function buscarDadosOCR(file) {
        if (!file) return null;
        // Converte o arquivo para Base64
        const base64 = await convertToBase64(file);
        // Monta o JSON para a API
        const payload = {
            base64: {
                fileName: base64, // Envia o Base64 no formato correto
            },
        };
        // Faz a requisição para a API
        const response = await axios.post('https://api-homolog.nxcd.app/full-ocr/v4', payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'ApiKey 67af9caf49a98cd56801648b:m98bx4uYC3MbutgRlBN_l-k3',
            },
        });
        return response.data;
    }
    
    // Função para converter um arquivo para Base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]); // Pega apenas o Base64 puro
            reader.onerror = (error) => reject(error);
        });
    };

    const { 
        vagas,
        setVagas
    } = useVagasContext()

    useEffect(() => {
        if (id) {
            http.get(`admissao/${id}/`)
                .then((data) => {
                    // Atualiza o candidato com todos os dados
                    setCandidato({
                        ...data,
                        educacao: data.educacao || [],
                        habilidades: data.habilidades || [],
                        experiencia: data.experiencia || []
                    });
                    setVaga(data.dados_vaga || {});
                    setAdmissao(data);
                })
                .catch((err) => {
                    console.error('Erro ao buscar admissão:', err);
                });
        }
    }, []);

    const handleSalvarAdmissao = async () => {
       
        if (!admissao?.id) return;
        try {
            // Função para remover a máscara BRL do salário
            const removerMascaraBRL = (valor) => {
                if (!valor) return '';
                return valor.replace(/[R$\s.]/g, '').replace(',', '.');
            };

            // Monta o payload com todos os dados da admissão, sincronizando campos duplicados
            const dadosCandidato = candidato.dados_candidato || {};
            const dadosVaga = candidato.dados_vaga || {};
            const payload = {
                id: candidato.id,
                tarefas: candidato.tarefas,
                log_tarefas: candidato.log_tarefas,
                documentos_status: candidato.documentos_status,
                documentos: candidato.documentos,
                dados_vaga: candidato.dados_vaga,
                dados_candidato: dadosCandidato,
                created_at: candidato.created_at,
                updated_at: candidato.updated_at,
                chapa: candidato.chapa,
                codigo_ficha_registro: candidato.codigo_ficha_registro,
                tipo_admissao: candidato.tipo_admissao,
                dt_admissao: candidato.dt_admissao,
                status: candidato.status,
                aceite_lgpd: candidato.aceite_lgpd,
                salario: removerMascaraBRL(dadosCandidato?.salario ? dadosCandidato.salario : (dadosVaga?.salario ? dadosVaga.salario : candidato.salario)),
                codigo_jornada: candidato.codigo_jornada,
                pix: candidato.pix,
                pix_tipo: candidato.pix_tipo,
                estado_natal: candidato.estado_natal,
                naturalidade: candidato.naturalidade,
                apelido: candidato.apelido,
                sexo: candidato.sexo,
                nacionalidade: candidato.nacionalidade,
                rua: candidato.rua,
                numero: candidato.numero,
                complemento: candidato.complemento,
                bairro: candidato.bairro,
                estado: candidato.estado,
                cidade: candidato.cidade,
                cep: candidato.cep,
                pais: candidato.pais,
                registro_profissional: candidato.registro_profissional,
                imagem_id: candidato.imagem_id,
                telefone1: dadosCandidato?.telefone ? dadosCandidato.telefone : candidato.telefone1,
                telefone2: dadosCandidato?.telefone ? dadosCandidato.telefone : candidato.telefone2,
                identidade: candidato.identidade,
                uf_identidade: candidato.uf_identidade,
                orgao_emissor_ident: candidato.orgao_emissor_ident,
                data_emissao_ident: candidato.data_emissao_ident,
                titulo_eleitor: candidato.titulo_eleitor,
                zona_titulo_eleitor: candidato.zona_titulo_eleitor,
                secao_titulo_eleitor: candidato.secao_titulo_eleitor,
                carteira_trabalho: candidato.carteira_trabalho,
                serie_carteira_trab: candidato.serie_carteira_trab,
                uf_carteira_trab: candidato.uf_carteira_trab,
                data_emissao_ctps: candidato.data_emissao_ctps,
                nit: candidato.nit,
                carteira_motorista: candidato.carteira_motorista,
                tipo_carteira_habilit: candidato.tipo_carteira_habilit,
                data_venc_habilit: candidato.data_venc_habilit,
                certificado_reservista: candidato.certificado_reservista,
                naturalizado: candidato.naturalizado,
                data_venc_ctps: candidato.data_venc_ctps,
                tipo_visto: candidato.tipo_visto,
                email_pessoal: dadosCandidato?.email ? dadosCandidato.email : candidato.email_pessoal,
                cor_raca: candidato.cor_raca,
                deficiente_fisico: candidato.deficiente_fisico,
                numero_passaporte: candidato.numero_passaporte,
                pais_origem: candidato.pais_origem,
                data_emissao_passaporte: candidato.data_emissao_passaporte,
                data_validade_passaporte: candidato.data_validade_passaporte,
                observacoes_pessoa: candidato.observacoes_pessoa,
                codigo_municipio: candidato.codigo_municipio,
                circunscricao_militar: candidato.circunscricao_militar,
                orgao_expedicao: candidato.orgao_expedicao,
                regiao_militar: candidato.regiao_militar,
                situacao_militar: candidato.situacao_militar,
                data_titulo_eleitor: candidato.data_titulo_eleitor,
                estado_emissor_tit_eleitor: candidato.estado_emissor_tit_eleitor,
                tipo_sanguineo: candidato.tipo_sanguineo,
                id_biometria: candidato.id_biometria,
                imagem: candidato.imagem,
                primeiro_nome: dadosCandidato.nome.split(' ')[0], // Sincroniza com dados_candidato
                sobrenome_pai: candidato.sobrenome_pai,
                sobrenome_mae: candidato.sobrenome_mae,
                nome: dadosCandidato.nome,
                cpf: dadosCandidato.cpf,
                email: dadosCandidato.email,
                telefone: dadosCandidato.telefone,
                dt_nascimento: dadosCandidato.dt_nascimento,
                uf_registro_profissional: candidato.uf_registro_profissional,
                data_emissao_cnh: candidato.data_emissao_cnh,
                data_naturalizacao: candidato.data_naturalizacao,
                id_pais: candidato.id_pais,
                nome_social: candidato.nome_social,
                candidato: candidato.candidato,
                vaga: candidato.vaga,
                processo: candidato.processo,
                funcionario: candidato.funcionario,
                centro_custo: dadosVaga?.centro_custo_id ? dadosVaga.centro_custo_id : candidato.centro_custo,
                filial: dadosVaga?.filial_id ? dadosVaga.filial_id : candidato.filial,
                departamento: dadosVaga?.departamento_id ? dadosVaga.departamento_id : candidato.departamento,
                id_secao: dadosVaga?.secao_id ? dadosVaga.secao_id : candidato.id_secao,
                id_funcao: dadosVaga?.funcao_id ? dadosVaga.funcao_id : candidato.id_funcao,
                tipo_funcionario: candidato.tipo_funcionario,
                tipo_situacao: candidato.tipo_situacao,
                banco: candidato.banco,
                agencia: candidato.agencia,
                conta_corrente: candidato.conta_corrente,
                tipo_conta: candidato.tipo_conta,
                operacao: candidato.operacao,
                estado_civil: candidato.estado_civil,
                genero: candidato.genero,
                educacao: candidato.educacao,
                habilidades: candidato.habilidades,
                experiencia: candidato.experiencia
            };

            await http.put(`admissao/${admissao.id}/`, payload);
            if (toast && toast.current) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Admissão atualizada',
                    detail: 'Dados salvos com sucesso!',
                    life: 3000
                });
            }
        } catch (error) {
            if (toast && toast.current) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro ao salvar',
                    detail: 'Não foi possível salvar os dados.',
                    life: 4000
                });
            }
            console.error('Erro ao salvar admissão:', error);
        }
    };

    const concluirTarefa = async (tipoCodigo) => {
        try {
            const tarefa = candidato?.tarefas?.find(t => t.tipo_codigo === tipoCodigo);
            if (!tarefa) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Tarefa não encontrada',
                    life: 3000
                });
                return;
            }

            await http.post(`tarefas/${tarefa.id}/concluir/`);
            
            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Tarefa concluída com sucesso!',
                life: 3000
            });

            // Atualiza o estado local da tarefa
            const novasTarefas = candidato.tarefas.map(t => {
                if (t.id === tarefa.id) {
                    return {
                        ...t,
                        status: 'concluida',
                        status_display: 'Concluída',
                        concluido_em: new Date().toISOString()
                    };
                }
                return t;
            });

            setCandidato(prev => ({
                ...prev,
                tarefas: novasTarefas
            }));

        } catch (error) {
            console.error('Erro ao concluir tarefa:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao concluir a tarefa',
                life: 3000
            });
        }
    };

    const validarDocumentos = () => {
        const documentosObrigatoriosPendentes = candidato.documentos
            .filter(doc => doc.obrigatorio && !doc.upload_feito)
            .map(doc => doc.nome);

        if (documentosObrigatoriosPendentes.length > 0) {
            toast.current.show({
                severity: 'error',
                summary: 'Documentos obrigatórios pendentes',
                detail: `Os seguintes documentos obrigatórios não foram enviados: ${documentosObrigatoriosPendentes.join(', ')}`,
                life: 5000
            });
            return false;
        }

        const documentosNaoObrigatoriosPendentes = candidato.documentos
            .filter(doc => !doc.obrigatorio && !doc.upload_feito)
            .map(doc => doc.nome);

        if (documentosNaoObrigatoriosPendentes.length > 0) {
            return new Promise((resolve) => {
                confirmDialog({
                    message: `Os seguintes documentos não obrigatórios estão pendentes: ${documentosNaoObrigatoriosPendentes.join(', ')}. Deseja continuar mesmo assim?`,
                    header: 'Confirmação',
                    icon: 'pi pi-exclamation-triangle',
                    acceptLabel: 'Sim, continuar',
                    rejectLabel: 'Não, voltar',
                    accept: () => resolve(true),
                    reject: () => resolve(false)
                });
            });
        }

        return true;
    };

    const handleFinalizarDocumentos = async () => {
        const validacao = await validarDocumentos();
        if (!validacao) return;

        await handleSalvarAdmissao();
        await concluirTarefa('documentos_pendentes');
    };

    const handleAceitarLGPD = async () => {
        try {
            // Atualiza o estado local
            await setCandidato(prev => ({
                ...prev,
                aceite_lgpd: true
            }));

            // Faz o upload do aceite na admissão
            await http.put(`admissao/${admissao.id}/`, {
                ...candidato,
                aceite_lgpd: true
            });

            // Após confirmar que o aceite foi salvo, conclui a tarefa
            await concluirTarefa('aceite_lgpd');
            
            // Atualiza o contexto com a tarefa concluída
            const tarefaLGPD = candidato.tarefas.find(t => t.tipo_codigo === 'aceite_lgpd');
            if (tarefaLGPD) {
                const novasTarefas = candidato.tarefas.map(t => {
                    if (t.id === tarefaLGPD.id) {
                        return {
                            ...t,
                            status: 'concluida',
                            status_display: 'Concluída',
                            concluido_em: new Date().toISOString()
                        };
                    }
                    return t;
                });

                setCandidato(prev => ({
                    ...prev,
                    tarefas: novasTarefas
                }));
            }

            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Termo LGPD aceito com sucesso!',
                life: 3000
            });
        } catch (error) {
            // Em caso de erro, reverte o estado local
            setCandidato(prev => ({
                ...prev,
                aceite_lgpd: false
            }));

            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao salvar o aceite da LGPD.',
                life: 3000
            });
        }
    };

    const handleSalvarEContinuar = async () => {
        await handleSalvarAdmissao();
        stepperRef.current.nextCallback();
        setActiveIndex(prev => prev + 1);
    };

    const handleVoltar = () => {
        stepperRef.current.prevCallback();
        setActiveIndex(prev => prev - 1);
    };

    const handleAvancar = () => {
        stepperRef.current.nextCallback();
        setActiveIndex(prev => prev + 1);
    };

    // Função para renderizar os botões baseado no step atual
    const renderFooterButtons = () => {
        const isFirstStep = activeIndex === 0;
        // Ajustado para o novo step de dados bancários
        const isLastStep = (self && activeIndex === 7) || (!self && activeIndex === 6);
        
        return (
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: '248px', // Ajustado para não sobrepor a sidebar (assumindo largura padrão de sidebar)
                right: 0,
                background: '#fff',
                borderTop: '1px solid #e0e0e0',
                padding: '16px 24px',
                boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', gap: 12 }}>
                    {/* Botão Voltar - em todos os steps exceto o primeiro */}
                    {!isFirstStep && (
                        <Botao size="small" estilo="neutro" aoClicar={handleVoltar}>
                            <HiArrowLeft/> Voltar
                        </Botao>
                    )}
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                    {/* Botões específicos por step */}
                    {activeIndex === 0 && (
                        <Botao size="small" label="Next" iconPos="right" aoClicar={handleAvancar}>
                            <HiArrowRight fill="white"/> Continuar
                        </Botao>
                    )}
                    
                    {/* Steps intermediários com salvar (Dados Pessoais, Dados Bancários, Vaga, Educação, Habilidades) */}
                    {(activeIndex >= 1 && activeIndex <= (self ? 5 : 5)) && (
                        <>
                            <Botao size="small" iconPos="right" aoClicar={handleSalvarAdmissao}>
                                <FaSave fill="white"/> Salvar
                            </Botao>
                            <Botao size="small" label="Next" iconPos="right" aoClicar={handleSalvarEContinuar}>
                                <HiArrowRight fill="white"/> Salvar e Continuar
                            </Botao>
                        </>
                    )}
                    
                    {/* Step Experiência - último step antes da finalização */}
                    {activeIndex === (self ? 6 : 6) && (
                        <>
                            <Botao size="small" iconPos="right" aoClicar={handleSalvarAdmissao}>
                                <FaSave fill="white"/> Salvar
                            </Botao>
                            {self ? (
                                <Botao size="small" label="Next" iconPos="right" aoClicar={handleSalvarEContinuar}>
                                    <HiArrowRight fill="white"/> Salvar e Continuar
                                </Botao>
                            ) : (
                                <Botao size="small" label="Next" iconPos="right" aoClicar={handleFinalizarDocumentos}>
                                    <RiExchangeFill fill="white"/> Finalizar
                                </Botao>
                            )}
                        </>
                    )}
                    
                    {/* Step LGPD - só para candidatos */}
                    {self && activeIndex === 7 && (
                        <Botao 
                            iconPos="right" 
                            aoClicar={handleAceitarLGPD}
                            disabled={candidato.aceite_lgpd}
                        >
                            <FaSave fill="white"/> {candidato.aceite_lgpd ? 'Termo Aceito' : 'Aceitar e Finalizar'}
                        </Botao>
                    )}
                </div>
            </div>
        );
    };

    // Detectar cliques nos headers do stepper
    useEffect(() => {
        const stepperElement = stepperRef.current?.getElement?.();
        if (!stepperElement) return;

        const handleStepHeaderClick = (event) => {
            const stepHeader = event.target.closest('.p-stepper-header');
            if (stepHeader) {
                const stepIndex = Array.from(stepHeader.parentElement.children).indexOf(stepHeader);
                console.log('Header clicado, step:', stepIndex);
                setActiveIndex(stepIndex);
            }
        };

        stepperElement.addEventListener('click', handleStepHeaderClick);
        
        // Fallback: usar MutationObserver para detectar mudanças no stepper
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const activeHeader = stepperElement.querySelector('.p-stepper-header.p-highlight');
                    if (activeHeader) {
                        const stepIndex = Array.from(activeHeader.parentElement.children).indexOf(activeHeader);
                        console.log('MutationObserver detectou step ativo:', stepIndex);
                        setActiveIndex(stepIndex);
                    }
                }
            });
        });

        // Observar mudanças nos headers
        const headers = stepperElement.querySelectorAll('.p-stepper-header');
        headers.forEach(header => {
            observer.observe(header, { attributes: true, attributeFilter: ['class'] });
        });
        
        return () => {
            stepperElement.removeEventListener('click', handleStepHeaderClick);
            observer.disconnect();
        };
    }, []);

    const formatarCPF = (cpf) => {
        if (!cpf) return 'CPF não informado';
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    return (
        <ConteudoFrame>
            <Toast ref={toast} style={{ zIndex: 9999 }} />
            <ConfirmDialog />
            
            {/* Botão Voltar */}
            {candidato?.dados_candidato?.nome && (
                <BotaoVoltar />
            )}
            
            {/* Header com informações do candidato */}
            {candidato?.dados_candidato && (
                <div style={{
                    background: 'linear-gradient(to bottom, var(--primaria), var(--gradient-secundaria))',
                    borderRadius: 8,
                    padding: '12px 16px',
                    marginBottom: 0,
                    color: '#fff',
                    boxShadow: '0 2px 8px rgba(12, 0, 76, 0.3)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 5
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 10
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10
                        }}>
                            <div style={{
                                width: 36,
                                height: 36,
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 16,
                                fontWeight: 500,
                                color: '#fff'
                            }}>
                                {candidato.dados_candidato.nome?.charAt(0)?.toUpperCase() || 'C'}
                            </div>
                            <div>
                                <h2 style={{
                                    margin: 0,
                                    fontSize: 16,
                                    fontWeight: 700,
                                    color: '#fff',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                }}>
                                    {candidato.dados_candidato.nome || 'Nome não informado'}
                                </h2>
                                <p style={{
                                    margin: 0,
                                    fontSize: 12,
                                    color: '#fff',
                                    opacity: 0.9,
                                    fontWeight: 400
                                }}>
                                    CPF: {formatarCPF(candidato.dados_candidato.cpf) || 'CPF não informado'}
                                </p>
                            </div>
                        </div>
                        
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                background: 'rgba(255, 255, 255, 0.15)',
                                padding: '4px 10px',
                                borderRadius: 6,
                                backdropFilter: 'blur(10px)'
                            }}>
                                <span style={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: '#fff',
                                    opacity: 0.9
                                }}>
                                    Vaga:
                                </span>
                                <span style={{
                                    background: '#333',
                                    color: '#fff',
                                    padding: '4px 8px',
                                    borderRadius: 12,
                                    fontSize: 11,
                                    fontWeight: 400,
                                    textTransform: 'capitalize'
                                }}>
                                    {candidato?.dados_vaga?.titulo || 'Vaga não informada'}
                                </span>
                            </div>
                            
                            {/* Botão Visão do Candidato/Empresa movido para o header */}
                            {!self ? 
                                (import.meta.env.MODE === 'development' && (
                                    <button
                                        onClick={() => navegar(`/admissao/registro/${id}/true`)}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.2)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            borderRadius: 6,
                                            padding: '6px 12px',
                                            color: '#fff',
                                            fontSize: 12,
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 4,
                                            transition: 'all 0.2s ease',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                        }}
                                    >
                                        <HiEye fill="white" size={14}/> Visão do Candidato
                                    </button>
                                ))
                                :
                                (import.meta.env.MODE === 'development' && (
                                    <button
                                        onClick={() => navegar(`/admissao/registro/${id}`)}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.2)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            borderRadius: 6,
                                            padding: '6px 12px',
                                            color: '#fff',
                                            fontSize: 12,
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 4,
                                            transition: 'all 0.2s ease',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                        }}
                                    >
                                        <HiEye fill="white" size={14}/> Visão da Empresa
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                </div>
            )}

            <div style={{ paddingBottom: '80px' }}> {/* Espaço para o footer fixo */}
                <Stepper 
                    headerPosition="top" 
                    ref={stepperRef} 
                    className="custom-stepper"
                >
                    <StepperPanel header="Documentos Pessoais">
                        <Container padding={'0'} gap="10px">
                            <div className={styles.containerDadosPessoais} style={{ position: 'relative' }}>
                                <ScrollPanel className="responsive-scroll-panel">
                                    <StepDocumentos toast={toast} />
                                </ScrollPanel>
                            </div>
                        </Container>
                    </StepperPanel>
                    
                    <StepperPanel header="Dados Pessoais">
                        <Container padding={'0'} gap="10px">
                            <div className={styles.containerDadosPessoais} style={{ position: 'relative' }}>
                                <ScrollPanel className="responsive-scroll-panel" style={{ marginBottom: 10 }}>
                                    <StepDadosPessoais classError={classError} estados={estados} />
                                </ScrollPanel>
                            </div>
                        </Container>
                    </StepperPanel>
                    
                    <StepperPanel header="Dados Bancários">
                        <Container padding={'0'} gap="10px">
                            <div className={styles.containerDadosPessoais} style={{ position: 'relative' }}>
                                <ScrollPanel className="responsive-scroll-panel" style={{ marginBottom: 10 }}>
                                    <StepDadosBancarios />
                                </ScrollPanel>
                            </div>
                        </Container>
                    </StepperPanel>
                    
                    {!self && (
                        <StepperPanel header="Dados Cadastrais">
                            <Container padding={'0'}>
                                <div className={styles.containerDadosPessoais} style={{ position: 'relative' }}>
                                    <ScrollPanel className="responsive-scroll-panel" style={{ marginBottom: 10 }}>
                                        <StepVaga 
                                            filiais={filiais}
                                            departamentos={departamentos}
                                            secoes={secoes}
                                            cargos={cargos}
                                            centros_custo={centros_custo}
                                            horarios={horarios}
                                            funcoes={funcoes}
                                            sindicatos={sindicatos}
                                        />
                                    </ScrollPanel>
                                </div>
                            </Container>
                        </StepperPanel>
                    )}
                    
                    <StepperPanel header="Educação">
                        <ScrollPanel className="responsive-scroll-panel">
                            <div style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 10}}>
                                <ScrollPanel className="responsive-inner-scroll">
                                    <StepEducacao />
                                </ScrollPanel>
                            </div>
                        </ScrollPanel>
                    </StepperPanel>
                    
                    <StepperPanel header="Habilidades">
                        <ScrollPanel className="responsive-scroll-panel">
                            <div style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 10}}>
                                <ScrollPanel className="responsive-inner-scroll">
                                    <StepHabilidades />
                                </ScrollPanel>
                            </div>
                        </ScrollPanel>
                    </StepperPanel>
                    
                    <StepperPanel header="Experiência Profissional">
                        <ScrollPanel className="responsive-scroll-panel">
                            <div style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 10}}>
                                <ScrollPanel className="responsive-inner-scroll">
                                    <StepExperiencia />
                                </ScrollPanel>
                            </div>
                        </ScrollPanel>
                    </StepperPanel>
                    
                    {self && (
                        <StepperPanel header="LGPD">
                            <ScrollPanel className="responsive-scroll-panel" style={{ textAlign: 'center' }}>
                                <StepLGPD />
                            </ScrollPanel>
                        </StepperPanel>
                    )}
                </Stepper>
            </div>

            {/* Footer fixo com botões */}
            {renderFooterButtons()}
        </ConteudoFrame>
    );
};

export default function Wrapper() {
    return (
        <CandidatoProvider>
            <CandidatoRegistro />
        </CandidatoProvider>
    );
}
