import React, { useEffect, useRef, useState } from 'react';
import { useVagasContext } from '@contexts/VagasContext'; // Importando o contexto
import ContainerHorizontal from '@components/ContainerHorizontal'; // Importando o componente ContainerHorizontal
import CampoArquivo from '@components/CampoArquivo'; // Importando o componente BotaoGrupo
import BotaoGrupo from '@components/BotaoGrupo'; // Importando o componente BotaoGrupo
import Titulo from '@components/Titulo'; // Importando o componente Titulo
import CampoTexto from '@components/CampoTexto'; // Importando o componente CampoTexto
import DropdownItens from '@components/DropdownItens'; // Importando o componente DropdownItens
import Container from '@components/Container'; // Importando o componente Container
import Frame from '@components/Frame'; // Importando o componente Frame
import Botao from '@components/Botao'; // Importando o componente Container
import { useNavigate, useParams } from 'react-router-dom';
import styled from "styled-components"
import http from '@http'
import axios from "axios"
import styles from './../Candidatos.module.css'
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { ScrollPanel } from 'primereact/scrollpanel';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import { FaTrash, FaSave, FaEye, FaUpload } from 'react-icons/fa';
import { CiCirclePlus } from 'react-icons/ci';
import SwitchInput from '@components/SwitchInput';
import { Toast } from 'primereact/toast';
import { CandidatoProvider, useCandidatoContext } from '@contexts/Candidato';
import StepDocumentos from './Steps/StepDocumentos';
import StepDadosPessoais from './Steps/StepDadosPessoais';
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
    gap: 24px;
    width: 100%;
    position: relative;
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
                agencia: candidato.agencia,
                conta_corrente: candidato.conta_corrente,
                pix: candidato.pix,
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
    };

    return (
        <ConteudoFrame>
            <Toast ref={toast} style={{ zIndex: 9999 }} />
            <ConfirmDialog />
            <Stepper headerPosition="top" ref={stepperRef} style={{ flexBasis: '50rem', maxHeight: '85vh', overflow: 'auto' }}>
                <StepperPanel header="Documentos Pessoais">
                    <ScrollPanel style={{ width: '100%', height: '380px'}}>
                        <StepDocumentos toast={toast} />
                    </ScrollPanel>
                    <Frame padding="30px" alinhamento="end">
                        <BotaoGrupo>
                            <Botao label="Next" iconPos="right" aoClicar={handleSalvarEContinuar}><HiArrowRight fill="white"/> Salvar e Continuar</Botao>
                        </BotaoGrupo>
                    </Frame>
                </StepperPanel>
                <StepperPanel header="Dados Pessoais">
                    <Container padding={'30px 0 0 0'} gap="10px">
                        <div className={styles.containerDadosPessoais} style={{ position: 'relative' }}>
                            <ScrollPanel style={{ width: '100%', height: '390px', marginBottom: 10 }}>
                                <StepDadosPessoais classError={classError} estados={estados} />
                            </ScrollPanel>
                        </div>
                    </Container>
                    <Frame padding="30px" estilo="spaced">
                        <BotaoGrupo>
                            <Botao estilo="neutro" aoClicar={() => stepperRef.current.prevCallback()}><HiArrowLeft/> Voltar</Botao>
                        </BotaoGrupo>
                        <BotaoGrupo>
                            <Botao iconPos="right" aoClicar={handleSalvarAdmissao}><FaSave fill="white"/> Salvar</Botao>
                            <Botao label="Next" iconPos="right" aoClicar={handleSalvarEContinuar}><HiArrowRight fill="white"/> Salvar e Continuar</Botao>
                        </BotaoGrupo>
                    </Frame>
                </StepperPanel>
                {!self && (
                  <StepperPanel header="Vaga">
                    <Container padding={'30px 0 30px 0'}>
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
                    </Container>
                    <Frame padding="30px" estilo="spaced">
                        <BotaoGrupo>
                            <Botao estilo="neutro" aoClicar={() => stepperRef.current.prevCallback()}><HiArrowLeft/> Voltar</Botao>
                        </BotaoGrupo>
                        <BotaoGrupo>
                            <Botao iconPos="right" aoClicar={handleSalvarAdmissao}><FaSave fill="white"/> Salvar</Botao>
                            <Botao label="Next" iconPos="right" aoClicar={handleSalvarEContinuar}><HiArrowRight fill="white"/> Salvar e Continuar</Botao>
                        </BotaoGrupo>
                    </Frame>
                  </StepperPanel>
                )}
                <StepperPanel header="Educação">
                    <ScrollPanel style={{ width: '100%', height: '380px'}}>
                        <StepEducacao />
                    </ScrollPanel>
                    <Frame padding="30px" estilo="spaced">
                        <BotaoGrupo>
                            <Botao estilo="neutro" aoClicar={() => stepperRef.current.prevCallback()}><HiArrowLeft/> Voltar</Botao>
                        </BotaoGrupo>
                        <BotaoGrupo wrap={false}>
                            <Botao iconPos="right" aoClicar={handleSalvarAdmissao}><FaSave fill="white"/> Salvar</Botao>
                            <Botao flex={false} label="Next" iconPos="right" aoClicar={handleSalvarEContinuar}><HiArrowRight fill="white"/> Salvar e Continuar</Botao>
                        </BotaoGrupo>
                    </Frame>
                </StepperPanel>
                <StepperPanel header="Habilidades">
                    <ScrollPanel style={{ width: '100%', height: '380px'}}>
                        <StepHabilidades />
                    </ScrollPanel>
                    <Frame padding="30px" estilo="spaced">
                        <BotaoGrupo>
                            <Botao estilo="neutro" aoClicar={() => stepperRef.current.prevCallback()}><HiArrowLeft/> Voltar</Botao>
                        </BotaoGrupo>
                        <BotaoGrupo>
                            <Botao iconPos="right" aoClicar={handleSalvarAdmissao}><FaSave fill="white"/> Salvar</Botao>
                            <Botao flex={false} label="Next" iconPos="right" aoClicar={handleSalvarEContinuar}><HiArrowRight fill="white"/> Salvar e Continuar</Botao>
                        </BotaoGrupo>
                    </Frame>
                </StepperPanel>
                <StepperPanel header="Experiência Profissional">
                    <ScrollPanel style={{ width: '100%', height: '380px'}}>
                        <StepExperiencia />
                    </ScrollPanel>
                    <Frame padding="30px" estilo="spaced">
                        <BotaoGrupo>
                            <Botao estilo="neutro" aoClicar={() => stepperRef.current.prevCallback()}><HiArrowLeft/> Voltar</Botao>
                        </BotaoGrupo>
                        <BotaoGrupo>
                            <Botao iconPos="right" aoClicar={handleSalvarAdmissao}><FaSave fill="white"/> Salvar</Botao>
                             {self ? (
                                <Botao label="Next" iconPos="right" aoClicar={handleSalvarEContinuar}><HiArrowRight fill="white"/> Salvar e Continuar</Botao>
                            ) : (
                                <Botao label="Next" iconPos="right" aoClicar={handleFinalizarDocumentos}><RiExchangeFill fill="white"/> Finalizar</Botao>
                            )}
                        </BotaoGrupo>
                    </Frame>
                </StepperPanel>
                {self && (
                  <StepperPanel header="LGPD">
                    <ScrollPanel style={{ width: '100%', height: '380px',  textAlign: 'center'}}>
                        <StepLGPD />
                    </ScrollPanel>
                    <Frame padding="30px" estilo="spaced">
                        <BotaoGrupo>
                            <Botao estilo="neutro" aoClicar={() => stepperRef.current.prevCallback()}><HiArrowLeft/> Voltar</Botao>
                        </BotaoGrupo>
                        <BotaoGrupo>
                            <Botao 
                                iconPos="right" 
                                aoClicar={handleAceitarLGPD}
                                disabled={candidato.aceite_lgpd}
                            >
                                <FaSave fill="white"/> {candidato.aceite_lgpd ? 'Termo Aceito' : 'Aceitar e Salvar'}
                            </Botao>
                        </BotaoGrupo>
                    </Frame>
                  </StepperPanel>
                )}
            </Stepper>
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
