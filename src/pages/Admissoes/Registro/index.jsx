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

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 10px;
`

const Col6 = styled.div`
    flex: 1 1 calc(50% - 10px);
`
const CardSelecao = styled.div`
    border: 1px solid var(--neutro-200);
    border-radius: 16px;
    padding: 20px;
    gap: 5vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

const AdicionarBotao = styled.div`
    font-size: 14px;
    font-weight: 700;
    color: var(--primaria);
    padding: 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
`

const ArquivoContainer = styled.div`
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const ArquivoHeader = styled(ContainerHorizontal)`
    width: 100%;
    justify-content: space-between;
`;


const CandidatoRegistro = () => {

    let { id, self = false } = useParams()
    const [candidato, setCandidato] = useState(null)
    const [classError, setClassError] = useState([])
    const stepperRef = useRef(null);
    const [educacao, setEducacao] = useState([
        { id: 1, nivel: '', instituicao: '', curso: '', dataInicio: '', dataConclusao: '', isLocked: false },
    ]);
    const [habilidades, setHabilidades] = useState([
        { id: 1, nivel: '', descricao: ''},
    ]); 
    const [experiencia, setExperiencia] = useState([
        { id: 1, cargo: '', empresa: '', descricao: '', dataInicio: '', dataSaida: '', isLocked: false },
    ]);
    const [estados, setEstados] = useState([]);
    const navegar = useNavigate()

    // Adicione um estado para controlar o modo de substituição de cada documento
    const [editandoDocumento, setEditandoDocumento] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();        
    };
  
    const setCandidatoEndereco = (field, value) => {
        setCandidato((estadoAnterior) => ({
            ...estadoAnterior,
            endereco: {
                ...estadoAnterior.endereco,
                [field]: value,
            },
        }));
    };

    const setCandidatoVaga = (field, value) => {
        setCandidato((estadoAnterior) => ({
            ...estadoAnterior,
            vaga: {
                ...estadoAnterior.vaga,
                [field]: value,
            },
        }));
    };

    const setCandidatoBanco = (field, value) => {
        setCandidato((estadoAnterior) => ({
            ...estadoAnterior,
            banco: {
                ...estadoAnterior.banco,
                [field]: value,
            },
        }));
    };

    const setStreet = (street) => setCandidatoEndereco("street", street);
    const setCep = (cep) => setCandidatoEndereco("cep", cep);
    const setDistrict = (district) => setCandidatoEndereco("district", district);
    const setComplemento = (complement) => setCandidatoEndereco("complement", complement);
    const setState = (state) => setCandidatoEndereco("state", state);
    const setCity = (city) => setCandidatoEndereco("city", city);
    const setNumber = (number) => setCandidatoEndereco("number", number);
    const setFilial = (filial) => setCandidatoVaga("filial", filial);
    const setCentroCusto = (centroCusto) => setCandidatoVaga("centroCusto", centroCusto);
    const setDepartamento = (departamento) => setCandidatoVaga("departamento", departamento);
    const setSecao = (secao) => setCandidatoVaga("secao", secao);
    const setCargo = (cargo) => setCandidatoVaga("cargo", cargo);
    const setHorario = (horario) => setCandidatoVaga("horario", horario);
    const setFuncao = (funcao) => setCandidatoVaga("funcao", funcao);
    const setSindicato = (sindicato) => setCandidatoVaga("sindicato", sindicato);
    const setVaga = (vaga) => setCandidatoVaga("vaga", vaga);
    

    const setBankNumber = (bankNumber) => setCandidatoBanco("bankNumber", bankNumber);
    const setBankAgency = (bankAgency) => setCandidatoBanco("agency", bankAgency);
    const setBankAccount = (bankAccount) => setCandidatoBanco("account", bankAccount);
    const setBankAccountDigit = (bankAccountDigit) => setCandidatoBanco("bankAccountDigit", bankAccountDigit);
    const setBankAgencyDigit = (bankAgencyDigit) => setCandidatoBanco("bankAgencyDigit", bankAgencyDigit);

    const [filiais, setFiliais] = useState([]);
    const [centros_custo, setCentrosCusto] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [secoes, setSecoes] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [funcoes, setFuncoes] = useState([]);
    const [sindicatos, setSindicatos] = useState([]);

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

    const setDataNascimento = (dataNascimento) => {
        setCandidato(estadoAnterior => {
            return {
                ...estadoAnterior,
                dataNascimento
            }
        })
    }

    const setName = (nome) => {
        setCandidato(estadoAnterior => {
            return {
                ...estadoAnterior,
                nome
            }
        })
    }

    const setEmail = (email) => {
        setCandidato(estadoAnterior => {
            return {
                ...estadoAnterior,
                email
            }
        })
    }

    const setCpf = (cpf) => {
        setCandidato(estadoAnterior => {
            return {
                ...estadoAnterior,
                cpf
            }
        })
    }

    useEffect(() => {
        if(!estados.length)
        {
            http.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => {
                    response.map((item) => {
                        let obj = {
                            name: item.nome,
                            code: item.sigla
                        }
                        if(!estados.includes(obj))
                        {
                            setEstados(estadoAnterior => [...estadoAnterior, obj]);
                        }
                    })
                })
        }

        http.get('filial/?format=json')
            .then(response => {
                setFiliais(response)
            })
            .catch(erro => {
                
            })
            .finally(function() {
                // setLoading(false)
            })

            http.get('departamento/?format=json')
            .then(response => {
                setDepartamentos(response)
            })
            .catch(erro => {
                
            })
            .finally(function() {
                // setLoading(false)
            })

            http.get('secao/?format=json')
            .then(response => {
                setSecoes(response)
            })
            .catch(erro => {
                
            })
            .finally(function() {
                // setLoading(false)
            })

            http.get('cargo/?format=json')
            .then(response => {
                setCargos(response)
            })
            .catch(erro => {
                
            })
            .finally(function() {
                // setLoading(false)
            })

            http.get('centro_custo/?format=json')
            .then(response => {
                setCentrosCusto(response)
                
            })
            .catch(erro => {
                
            })
            .finally(function() {
                // setLoading(false)
            })

            http.get('sindicato/?format=json')
            .then(response => {
                setSindicatos(response)
                
            })
            .catch(erro => {
                
            })
            .finally(function() {
                // setLoading(false)
            })
            
            http.get('horario/?format=json')
            .then(response => {
                setHorarios(response)
                
            })
            .catch(erro => {
                
            })
            .finally(function() {
                // setLoading(false)
            })

            http.get('funcao/?format=json')
            .then(response => {
                setFuncoes(response)
                
            })
            .catch(erro => {
                
            })
            .finally(function() {
                // setLoading(false)
            })
        
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

    const handleUpload = async (arquivoId, file) => {
        if (!file) return;
    
        try {
            // Converte o arquivo para Base64
            const base64 = await convertToBase64(file);
    
            // Atualiza a interface com o nome do arquivo antes do upload
            setCandidato((prev) =>
                prev.map((arquivo) =>
                    arquivo.id === arquivoId ? { ...arquivo, caminho: file.name } : arquivo
                )
            );
    
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
    
            // Atualiza a lista com o caminho retornado pela API
            setCandidato((prev) =>
                prev.map((arquivo) =>
                    arquivo.id === arquivoId ? { ...arquivo, caminho: response.data.caminho } : arquivo
                )
            );
    
            // Preenche os dados do candidato com as informações do OCR
            preencherDadosCandidato(response.data);
    
        } catch (error) {
            console.error('Erro ao enviar arquivo:', error);
        }
    };
    
    // Função para converter um arquivo para Base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]); // Pega apenas o Base64 puro
            reader.onerror = (error) => reject(error);
        });
    };
    const setCandidatoEducacao = () => {
        setCandidato((estadoAnterior) => ({
            ...estadoAnterior,
            educacao
        }));
    };

    // Atualiza os valores de uma educação específica
    const atualizarCampoEducacao = (id, campo, valor) => {
        setEducacao((prev) =>
            prev.map((educacao) =>
                educacao.id === id ? { ...educacao, [campo]: valor } : educacao
            )
        );
    };

    // Remove uma educação específica
    const removerEducacao = (id) => {
        setEducacao((prev) => prev.filter((educacao) => educacao.id !== id));
    };

    // Função para adicionar um novo grupo de campos de educação
    const adicionarEducacao = () => {
        const novaEducacao = {
            id: educacao.length + 1,
            nivel: '',
            instituicao: '',
            curso: '',
            dataInicio: '',
            dataConclusao: '',
        };
        setEducacao([...educacao, novaEducacao]);
    };
    const setCandidatoHabilidades = () => {
        setCandidato((estadoAnterior) => ({
            ...estadoAnterior,
            habilidades
        }));
    };

    // Atualiza os valores de uma habilidade específica
    const atualizarCampoHabilidades = (id, campo, valor) => {
        setHabilidades((prev) =>
            prev.map((habilidades) =>
                habilidades.id === id ? { ...habilidades, [campo]: valor } : habilidades
            )
        );
    };

    // Remove uma habilidade específica
    const removerHabilidade = (id) => {
        setHabilidades((prev) => prev.filter((habilidades) => habilidades.id !== id));
    };

    // Função para adicionar um novo grupo de campos de educação
    const adicionarHabilidade = () => {
        const novaHabilidade = {
            id: habilidades.length + 1,
            nivel: '',
            descricao: ''
        };
        setHabilidades([...habilidades, novaHabilidade]);
    };

    const setCandidatoExperiencia = () => {
        setCandidato((estadoAnterior) => ({
            ...estadoAnterior,
            experiencia
        }));
    };

    // Atualiza os valores de uma experiência específica
    const atualizarCampoExperiencia = (id, campo, valor) => {
        setExperiencia((prev) =>
            prev.map((experiencia) =>
                experiencia.id === id ? { ...experiencia, [campo]: valor } : experiencia
            )
        );
    };

    // Remove uma experiência específica
    const removerExperiencia = (id) => {
        setExperiencia((prev) => prev.filter((experiencia) => experiencia.id !== id));
    };

    // Função para adicionar um novo grupo de campos de experiência
    const adicionarExperiencia = () => {
        const novaExperiencia = {
            id: experiencia.length + 1,
            cargo: '',
            empresa: '',
            descricao: '',
            dataInicio: '',
            dataSaida: '',
        };
        setExperiencia([...experiencia, novaExperiencia]);
    };


    const preencherDadosCandidato = (ocrData) => {
        const extraction = ocrData.data[0].extraction;
        const enhanced = ocrData.data[0].enhanced;
        const taxData = ocrData.data[0].taxData;
    
        setCandidato((estadoAnterior) => {
            const novoEstado = { ...estadoAnterior };
    
            // Preenche o nome se estiver vazio
            if (!novoEstado.nome && enhanced.person.name) {
                novoEstado.nome = enhanced.person.name;
            }
    
            // Preenche o CPF se estiver vazio
            if (!novoEstado.cpf && taxData.taxId) {
                novoEstado.cpf = taxData.taxId;
            }
    
            // Preenche a data de nascimento se estiver vazia
            if (!novoEstado.dataNascimento && taxData.birthdate) {
                novoEstado.dataNascimento = taxData.birthdate;
            }
    
            // Preenche o nome da mãe se estiver vazio
            if (!novoEstado.nomeMae && taxData.mothersName) {
                novoEstado.nomeMae = taxData.mothersName;
            }
    
            // Preenche o nome do pai se estiver vazio
            if (!novoEstado.nomePai && extraction.person.parentage) {
                const parentage = extraction.person.parentage.split('\n');
                if (parentage.length > 1) {
                    novoEstado.nomePai = parentage[0].trim();
                }
            }
    
            // Preenche a naturalidade se estiver vazia
            if (!novoEstado.naturalidade && enhanced.otherFields.naturalnessCity) {
                novoEstado.naturalidade = `${enhanced.otherFields.naturalnessCity} - ${enhanced.otherFields.naturalnessState}`;
            }
    
            return novoEstado;
        });
    };

    const { 
        vagas,
        setVagas
    } = useVagasContext()

    useEffect(() => {
        if(id)
        {
            if(!candidato){
                const obj = vagas;

                // Procurar o candidato nas vagas abertas e canceladas
                // Percorrer as vagas abertas
                for (let vaga of obj) {
                    const candidatoEncontrado = vaga.candidatos.find(c => c.id == id);
                    
                    if (candidatoEncontrado) {
                        setCandidato(candidatoEncontrado);
                        setExperiencia(candidatoEncontrado.experiencia);
                        setEducacao(candidatoEncontrado.educacao);
                        setHabilidades(candidatoEncontrado.habilidades);
                        setVaga(vaga);
                        break;  // Sai do loop assim que encontrar o candidato
                    }
                }
            }
        }
    }, [])

    // Função para obter os documentos requeridos da vaga
    const getDocumentosRequeridos = () => {
        if (!candidato || !candidato.vaga || !candidato.vaga?.vaga?.documentos_requeridos) return [];
        return candidato.vaga.vaga.documentos_requeridos;
    };

    // Função para obter o arquivo já enviado pelo candidato para um documento requerido
    const getArquivoCandidato = (idRequerido) => {
        if (!candidato || !candidato.documentos) return null;
        const doc = candidato.documentos.find(d => d.id_requerido === idRequerido);
        return doc ? doc.arquivo : null;
    };

    // Função para atualizar o arquivo do candidato para um documento requerido
    const handleUploadDocumento = async (idRequerido, file) => {
        if (!file) return;
        try {
            // Converte o arquivo para Base64
            const base64 = await convertToBase64(file);
            // Aqui você pode fazer o upload para a API, se necessário
            // Simulação: salva o nome do arquivo no candidato.documentos
            setCandidato((prev) => {
                let docs = prev.documentos ? [...prev.documentos] : [];
                const idx = docs.findIndex(d => d.id_requerido === idRequerido);
                if (idx !== -1) {
                    docs[idx] = { ...docs[idx], arquivo: file.name };
                } else {
                    docs.push({ id: docs.length + 1, id_requerido: idRequerido, arquivo: file.name });
                }
                return { ...prev, documentos: docs };
            });
        } catch (error) {
            console.error('Erro ao enviar arquivo:', error);
        }
    };

    return (
        <ConteudoFrame>
            <form onSubmit={handleSubmit}>
            <Stepper headerPosition="top" ref={stepperRef} style={{ flexBasis: '50rem' }}>
                <StepperPanel header="Documentos Pessoais">
                    <ScrollPanel style={{ width: '100%', height: '380px'}}>
                        <Col12>
                            {getDocumentosRequeridos().map((doc) => {
                                const arquivo = getArquivoCandidato(doc.id);
                                const editando = !!editandoDocumento[doc.id];
                                return (
                                    <Col6 key={doc.id} style={{ marginTop: 10, marginBottom: 5 }}>
                                        <div>
                                            <p>{doc.nome}</p>
                                            {arquivo && !editando ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '12px 10px', marginBottom: 18, border: '1px solid var(--neutro-200)', borderRadius: 16, borderStyle: 'dashed', marginTop: 2 }}>
                                                    <span style={{ fontSize: 13, color: 'var(--neutro-800)', fontWeight: 500 }}>{arquivo}</span>
                                                    <button type="button" style={{ fontSize: 12, display: 'flex', background: 'transparent', alignItems: 'center', gap: 4, marginLeft: 8, borderRadius: 4, padding: '5px 2px',  color: 'var(--neutro-800)', cursor: 'pointer', border: 'none' }} onClick={() => window.open(arquivo, '_blank')}><FaEye size={14}/> </button>
                                                    <button type="button" style={{ fontSize: 12, display: 'flex', background: 'transparent', alignItems: 'center', gap: 4, marginLeft: 8, borderRadius: 4, padding: '5px 2px',  color: 'var(--neutro-800)', cursor: 'pointer', border: 'none' }} onClick={() => setEditandoDocumento(prev => ({ ...prev, [doc.id]: true }))}><FaUpload size={12}/> </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <CampoArquivo
                                                        onFileChange={(file) => { handleUploadDocumento(doc.id, file); setEditandoDocumento(prev => ({ ...prev, [doc.id]: false })); }}
                                                        accept={doc.tipoArquivo ? doc.tipoArquivo.split(',').map(t => '.' + t.trim()).join(',') : '.pdf, .jpg, .png'}
                                                        id={`arquivo-${doc.id}`}
                                                        name={`arquivo-${doc.id}`}
                                                    />
                                                    {arquivo && (
                                                        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                                                            <button type="button" style={{ marginTop: 2, fontSize: 12, color: 'var(--vermilion-400)', cursor: 'pointer', border: 'none', textDecoration: 'underline', backgroundColor: 'transparent', padding: '5px 10px' }} onClick={() => setEditandoDocumento(prev => ({ ...prev, [doc.id]: false }))}>Cancelar</button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </Col6>
                                );
                            })}
                        </Col12>
                    </ScrollPanel>
                    <Frame padding="30px" alinhamento="end">
                        <BotaoGrupo>
                            <Botao iconPos="right" aoClicar={() => true}><FaSave fill="white"/> Salvar</Botao>
                            <Botao label="Next" iconPos="right" aoClicar={() => stepperRef.current.nextCallback()}><HiArrowRight fill="white"/> Continuar</Botao>
                        </BotaoGrupo>
                    </Frame>
                </StepperPanel>
                <StepperPanel header="Dados Pessoais">
                    <Container padding={'30px 0 0 0'} gap="10px">
                        <div className={styles.containerDadosPessoais} style={{ position: 'relative' }}>
                            <ScrollPanel style={{ width: '100%', height: '390px', marginBottom: 10 }}>
                                <Col12 style={{padding:'0 10px'}}>
                                    <Col6>
                                        <CampoTexto 
                                            camposVazios={classError}
                                            name="nome" 
                                            valor={candidato?.nome ?? ''} 
                                            setValor={setName} 
                                            type="text" 
                                            label="Nome" 
                                            placeholder="Digite o nome" 
                                            disabled={!!self}
                                        />
                                    </Col6>
                                    <Col6>
                                        <CampoTexto 
                                            camposVazios={classError}
                                            name="email" 
                                            valor={candidato?.email ?? ''} 
                                            setValor={setEmail} 
                                            type="text" 
                                            label="E-mail" 
                                            placeholder="Digite o email" />
                                    </Col6>
                                </Col12>
                                <Col12 style={{padding:'0 10px'}}>
                                    <Col6>
                                        <CampoTexto 
                                            type="date" 
                                            valor={candidato?.dataNascimento} 
                                            setValor={setDataNascimento}
                                            label="Data de Nascimento"  />
                                    </Col6>
                                    <Col6>
                                        <CampoTexto 
                                            camposVazios={classError} 
                                            patternMask={['999.999.999-99', '99.999.999/9999-99']} 
                                            name="cpf" 
                                            valor={candidato?.cpf} 
                                            setValor={setCpf} 
                                            type="text" 
                                            label="CPF" 
                                            placeholder="Digite p CPF" 
                                            disabled={!!self}
                                        />
                                    </Col6>
                                </Col12>
                                <Col12 style={{padding:'0 10px'}}>
                                    <Col6>
                                        <div style={{ marginBottom: 8, fontWeight: 600 }}>Mãe conhecida?</div>
                                        <SwitchInput
                                            checked={candidato?.maeConhecida ?? true}
                                            onChange={valor => setCandidato(estadoAnterior => ({ ...estadoAnterior, maeConhecida: valor }))}
                                        />
                                        <CampoTexto 
                                            camposVazios={classError}
                                            name="nomeMae" 
                                            valor={candidato?.nomeMae ?? ''} 
                                            setValor={valor => setCandidato(estadoAnterior => ({ ...estadoAnterior, nomeMae: valor }))} 
                                            type="text" 
                                            label="Nome da Mãe" 
                                            placeholder="Digite o nome da mãe"
                                            disabled={candidato?.maeConhecida === false}
                                        />
                                        <CampoTexto 
                                            camposVazios={classError}
                                            name="cpfMae" 
                                            valor={candidato?.cpfMae ?? ''} 
                                            setValor={valor => setCandidato(estadoAnterior => ({ ...estadoAnterior, cpfMae: valor }))} 
                                            type="text" 
                                            label="CPF da Mãe" 
                                            patternMask={["999.999.999-99"]}
                                            placeholder="Digite o CPF da mãe"
                                            disabled={candidato?.maeConhecida === false}
                                        />
                                        <CampoTexto 
                                            camposVazios={classError}
                                            name="dataNascimentoMae" 
                                            valor={candidato?.dataNascimentoMae ?? ''} 
                                            setValor={valor => setCandidato(estadoAnterior => ({ ...estadoAnterior, dataNascimentoMae: valor }))} 
                                            type="date" 
                                            label="Data de Nascimento da Mãe" 
                                            placeholder="Data de nascimento"
                                            disabled={candidato?.maeConhecida === false}
                                        />
                                    </Col6>
                                    <Col6>
                                        <div style={{ marginBottom: 8, fontWeight: 600 }}>Pai conhecido?</div>
                                        <SwitchInput
                                            checked={candidato?.paiConhecido ?? true}
                                            onChange={valor => setCandidato(estadoAnterior => ({ ...estadoAnterior, paiConhecido: valor }))}
                                        />
                                        <CampoTexto 
                                            camposVazios={classError}
                                            name="nomePai" 
                                            valor={candidato?.nomePai ?? ''} 
                                            setValor={valor => setCandidato(estadoAnterior => ({ ...estadoAnterior, nomePai: valor }))} 
                                            type="text" 
                                            label="Nome do Pai" 
                                            placeholder="Digite o nome do pai"
                                            disabled={candidato?.paiConhecido === false}
                                        />
                                        <CampoTexto 
                                            camposVazios={classError}
                                            name="cpfPai" 
                                            valor={candidato?.cpfPai ?? ''} 
                                            setValor={valor => setCandidato(estadoAnterior => ({ ...estadoAnterior, cpfPai: valor }))} 
                                            type="text" 
                                            label="CPF do Pai" 
                                            patternMask={["999.999.999-99"]}
                                            placeholder="Digite o CPF do pai"
                                            disabled={candidato?.paiConhecido === false}
                                        />
                                        <CampoTexto 
                                            camposVazios={classError}
                                            name="dataNascimentoPai" 
                                            valor={candidato?.dataNascimentoPai ?? ''} 
                                            setValor={valor => setCandidato(estadoAnterior => ({ ...estadoAnterior, dataNascimentoPai: valor }))} 
                                            type="date" 
                                            label="Data de Nascimento do Pai" 
                                            placeholder="Data de nascimento"
                                            disabled={candidato?.paiConhecido === false}
                                        />
                                    </Col6>
                                </Col12>
                                <Col12 style={{padding:'0 10px'}}>
                                    <Col6>
                                        <div style={{ marginBottom: 8, fontWeight: 600 }}>Possui deficiência?</div>
                                        <SwitchInput
                                            checked={!!candidato?.possuiDeficiencia}
                                            onChange={valor => setCandidato(estadoAnterior => ({ ...estadoAnterior, possuiDeficiencia: valor }))}
                                        />
                                        {candidato?.possuiDeficiencia && (
                                            <CampoTexto 
                                                camposVazios={classError}
                                                name="deficiencia" 
                                                valor={candidato?.deficiencia ?? ''} 
                                                setValor={valor => setCandidato(estadoAnterior => ({ ...estadoAnterior, deficiencia: valor }))} 
                                                type="text" 
                                                label="Qual deficiência?" 
                                                placeholder="Descreva a deficiência" />
                                        )}
                                    </Col6>
                                </Col12>
                                <Frame padding="24px 10px">
                                    <Titulo>
                                        <h5>Dados Bancários</h5>
                                    </Titulo>
                                
                                    <Col12>
                                        <Col6>
                                        <CampoTexto 
                                                camposVazios={classError} 
                                                name="bank.number" 
                                                valor={candidato?.bank?.number} 
                                                setValor={setBankNumber} 
                                                type="text" 
                                                label="Banco" 
                                                placeholder="Banco" />
                                        </Col6>
                                        <Col6>
                                            <CampoTexto 
                                                camposVazios={classError} 
                                                name="bank.account" 
                                                valor={candidato?.bank?.account} 
                                                setValor={setBankAccount} 
                                                type="text" 
                                                label="Conta Corrente" 
                                                placeholder="Conta Corrente" />
                                        </Col6>
                                        <Col6>
                                            <CampoTexto 
                                                camposVazios={classError} 
                                                name="bank.account.digit" 
                                                width={'100%'}
                                                valor={candidato?.bank?.account.digit} 
                                                setValor={setBankAccountDigit} 
                                                type="text" 
                                                label="Digito CC" 
                                                placeholder="Digito CC" />
                                        </Col6>
                                        <Col6>
                                            <CampoTexto 
                                                camposVazios={classError} 
                                                name="bank.agency" 
                                                valor={candidato?.bank?.agency} 
                                                setValor={setBankAgency} 
                                                type="text" 
                                                label="Agência" 
                                                placeholder="Digite a agência" />
                                        </Col6>
                                        <Col6>
                                            <CampoTexto 
                                                camposVazios={classError}
                                                name="bank.agency.digit" 
                                                valor={candidato?.bank?.agency.digit} 
                                                setValor={setBankAgencyDigit} 
                                                type="text" 
                                                label="Digito Agência" 
                                                placeholder="Digite o digito da agência" />
                                        </Col6>
                                    </Col12>
                                </Frame>
                                <Frame padding="24px 10px">
                                    <Titulo>
                                        <h5>Endereço</h5>
                                    </Titulo>
                                
                                    <Col12>
                                        <Col6>
                                            <CampoTexto 
                                                camposVazios={classError} 
                                                patternMask={['99999-999']} 
                                                name="cep" 
                                                width={'100%'}
                                                valor={candidato?.endereco?.cep} 
                                                setValor={ChangeCep} 
                                                type="text" 
                                                label="CEP" 
                                                placeholder="Digite o CEP" />
                                        </Col6>
                                        <Col6>
                                            <CampoTexto 
                                                camposVazios={classError} 
                                                name="street" 
                                                valor={candidato?.endereco?.street} 
                                                setValor={setStreet} 
                                                type="text" 
                                                label="Logradouro" 
                                                placeholder="Digite o logradouro" />
                                        </Col6>
                                        <Col6>
                                            <CampoTexto 
                                                camposVazios={classError} 
                                                name="district" 
                                                width={'100%'}
                                                valor={candidato?.endereco?.district} 
                                                setValor={setDistrict} 
                                                type="text" 
                                                label="Bairro" 
                                                placeholder="Digite o Bairro" />
                                        </Col6>
                                        <Col6>
                                            <CampoTexto 
                                                camposVazios={classError} 
                                                name="number" 
                                                valor={candidato?.endereco?.number} 
                                                setValor={setNumber} 
                                                type="text" 
                                                label="Número" 
                                                placeholder="Digite o número" />
                                        </Col6>
                                        <Col6>
                                            <CampoTexto 
                                                name="complement" 
                                                valor={candidato?.endereco?.complement} 
                                                setValor={setComplemento} 
                                                type="text" 
                                                label="Complemento (opcional)" 
                                                placeholder="Digite o complemento" />
                                        </Col6>
                                        <Col6>
                                            <CampoTexto 
                                                camposVazios={classError} 
                                                name="city" 
                                                valor={candidato?.endereco?.city} 
                                                setValor={setCity} 
                                                type="text" 
                                                label="Cidade" 
                                                placeholder="Digite a cidade" />
                                        </Col6>
                                        <Col6>
                                            <DropdownItens 
                                                camposVazios={classError} 
                                                valor={candidato?.endereco?.state} 
                                                setValor={setState} 
                                                options={estados} 
                                                name="state" 
                                                placeholder="Digite a UF"/>
                                        </Col6>
                                    </Col12>
                                </Frame>
                                <div style={{
                                    position: 'sticky',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '40px',
                                    marginBottom: '-8px',
                                    borderRadius: '0px 0px 12px 12px',
                                    background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 100%)',
                                    pointerEvents: 'none',
                                    zIndex: 2
                                }}/>
                            </ScrollPanel>
                        </div>
                    </Container>
                    <Frame padding="30px" estilo="spaced">
                        <BotaoGrupo>
                            <Botao estilo="neutro" aoClicar={() => stepperRef.current.prevCallback()}><HiArrowLeft/> Voltar</Botao>
                        </BotaoGrupo>
                        <BotaoGrupo>
                            <Botao iconPos="right" aoClicar={() => true}><FaSave fill="white"/> Salvar</Botao>
                            <Botao label="Next" iconPos="right" aoClicar={() => stepperRef.current.nextCallback()}><HiArrowRight fill="white"/> Continuar</Botao>
                        </BotaoGrupo>
                    </Frame>
                </StepperPanel>
                {!self && (
                  <StepperPanel header="Vaga">
                    <Container padding={'30px 0 30px 0'}>
                        <Col12>
                            <Col6>
                                <DropdownItens 
                                    camposVazios={classError}
                                    valor={candidato?.vaga?.filial} 
                                    setValor={setFilial} 
                                    options={filiais.map(filial => ({
                                        name: filial.nome,
                                        code: filial.id
                                    }))} 
                                    name="filial" 
                                    placeholder="Filial" />
                            </Col6>
                            <Col6>
                                <DropdownItens 
                                    camposVazios={classError}
                                    name="centro_custo" 
                                    valor={candidato?.vaga?.centroCusto}
                                    setValor={setCentroCusto} 
                                    options={centros_custo.map(cc => ({
                                        name: cc.nome,
                                        code: cc.id
                                    }))} 
                                    placeholder="Centro de Custo" />
                            </Col6>
                        </Col12>
                        <Col12>
                            <Col6>
                                <DropdownItens 
                                    camposVazios={classError}
                                    name="departamento" 
                                    valor={candidato?.vaga?.departamento}
                                    setValor={setDepartamento} 
                                    options={departamentos.map(dep => ({
                                        name: dep.nome,
                                        code: dep.id
                                    }))} 
                                    placeholder="Departamento" />
                            </Col6>
                            <Col6>
                                <DropdownItens 
                                    camposVazios={classError}
                                    name="secao" 
                                    valor={candidato?.vaga?.secao}
                                    setValor={setSecao} 
                                    options={secoes.map(sec => ({
                                        name: sec.nome,
                                        code: sec.id
                                    }))} 
                                    placeholder="Seção" />
                            </Col6>
                        </Col12>
                        <Col12>
                            <Col6>
                                <DropdownItens 
                                    camposVazios={classError}
                                    name="cargo" 
                                    valor={candidato?.vaga?.cargo}
                                    setValor={setCargo} 
                                    options={cargos.map(cargo => ({
                                        name: cargo.nome,
                                        code: cargo.id
                                    }))} 
                                    placeholder="Cargo" />
                            </Col6>
                            <Col6>
                                <DropdownItens 
                                    camposVazios={classError}
                                    name="horario" 
                                    valor={candidato?.vaga?.horario}
                                    setValor={setHorario} 
                                    options={horarios.map(horario => ({
                                        name: `${horario.codigo} - ${horario.descricao}`,
                                        code: horario.id
                                    }))} 
                                    placeholder="Horário" />
                            </Col6>
                        </Col12>
                        <Col12>
                            <Col6>
                                <DropdownItens 
                                    camposVazios={classError}
                                    name="funcao" 
                                    valor={candidato?.vaga?.funcao}
                                    setValor={setFuncao} 
                                    options={funcoes.map(funcao => ({
                                        name: funcao.nome,
                                        code: funcao.id
                                    }))} 
                                    placeholder="Função" />
                            </Col6>
                            <Col6>
                                <DropdownItens 
                                    camposVazios={classError}
                                    name="sindicato" 
                                    valor={candidato?.vaga?.sindicato}
                                    setValor={setSindicato} 
                                    options={sindicatos.map(sindicato => ({
                                        name: `${sindicato.codigo} - ${sindicato.descricao}`,
                                        code: sindicato.id
                                    }))} 
                                    placeholder="Sindicato" />
                            </Col6>
                        </Col12>
                        <Col12>
                            <Col6>
                                <DropdownItens 
                                    camposVazios={classError}
                                    name="periculosidade"
                                    valor={candidato?.vaga?.periculosidade || candidato?.periculosidade}
                                    setValor={valor => setCandidatoVaga('periculosidade', valor)}
                                    options={listaPericulosidades}
                                    placeholder="Periculosidade" />
                            </Col6>
                            <Col6>
                                <DropdownItens 
                                    camposVazios={classError}
                                    name="insalubridade"
                                    valor={candidato?.vaga?.insalubridade || candidato?.insalubridade}
                                    setValor={valor => setCandidatoVaga('insalubridade', valor)}
                                    options={listaInsalubridades}
                                    placeholder="Insalubridade" />
                            </Col6>
                            <Col6>
                                <div style={{ marginTop: '5px'}} >
                                <CampoTexto
                                    camposVazios={classError}
                                    name="salario"
                                    valor={candidato?.vaga?.salario || candidato?.salario || ''}
                                    setValor={valor => setCandidatoVaga('salario', valor)}
                                    type="number"
                                    label="Salário"
                                    placeholder="Digite o salário" />
                                </div>
                            </Col6>
                        </Col12>
                    </Container>
                    <Frame padding="30px" estilo="spaced">
                        <BotaoGrupo>
                            <Botao estilo="neutro" aoClicar={() => stepperRef.current.prevCallback()}><HiArrowLeft/> Voltar</Botao>
                        </BotaoGrupo>
                        <BotaoGrupo>
                            <Botao iconPos="right" aoClicar={() => true}><FaSave fill="white"/> Salvar</Botao>
                            <Botao label="Next" iconPos="right" aoClicar={() => stepperRef.current.nextCallback()}><HiArrowRight fill="white"/> Continuar</Botao>
                        </BotaoGrupo>
                    </Frame>
                  </StepperPanel>
                )}
                {self && (
                  <StepperPanel header="Vaga">
                    <Container padding={'30px 0 30px 0'}>
                        <Col12>
                            <Col6>
                                <DropdownItens 
                                    camposVazios={classError}
                                    valor={candidato?.vaga?.filial} 
                                    setValor={setFilial} 
                                    options={filiais.map(filial => ({
                                        name: filial.nome,
                                        code: filial.id
                                    }))} 
                                    name="filial" 
                                    placeholder="Filial"
                                    disabled={!!self}
                                />
                            </Col6>
                            <Col6>
                                <DropdownItens 
                                    camposVazios={classError}
                                    name="centro_custo" 
                                    valor={candidato?.vaga?.centroCusto}
                                    setValor={setCentroCusto} 
                                    options={centros_custo.map(cc => ({
                                        name: cc.nome,
                                        code: cc.id
                                    }))} 
                                    placeholder="Centro de Custo"
                                    disabled={!!self}
                                />
                            </Col6>
                        </Col12>
                        <Col12>
                            <Col6>
                                <DropdownItens 
                                    camposVazios={classError}
                                    name="departamento" 
                                    valor={candidato?.vaga?.departamento}
                                    setValor={setDepartamento} 
                                    options={departamentos.map(dep => ({
                                        name: dep.nome,
                                        code: dep.id
                                    }))} 
                                    placeholder="Departamento"
                                    disabled={!!self}
                                />
                            </Col6>
                            <Col6>
                                <DropdownItens 
                                    camposVazios={classError}
                                    name="secao" 
                                    valor={candidato?.vaga?.secao}
                                    setValor={setSecao} 
                                    options={secoes.map(sec => ({
                                        name: sec.nome,
                                        code: sec.id
                                    }))} 
                                    placeholder="Seção"
                                    disabled={!!self}
                                />
                            </Col6>
                        </Col12>
                        <Col12>
                            <Col6>
                                <DropdownItens 
                                    camposVazios={classError}
                                    name="cargo" 
                                    valor={candidato?.vaga?.cargo}
                                    setValor={setCargo} 
                                    options={cargos.map(cargo => ({
                                        name: cargo.nome,
                                        code: cargo.id
                                    }))} 
                                    placeholder="Cargo"
                                    disabled={!!self}
                                />
                            </Col6>
                            <Col6>
                                <DropdownItens 
                                    camposVazios={classError}
                                    name="horario" 
                                    valor={candidato?.vaga?.horario}
                                    setValor={setHorario} 
                                    options={horarios.map(horario => ({
                                        name: `${horario.codigo} - ${horario.descricao}`,
                                        code: horario.id
                                    }))} 
                                    placeholder="Horário"
                                    disabled={!!self}
                                />
                            </Col6>
                        </Col12>
                        <Col12>
                            <Col6>
                                <DropdownItens 
                                    camposVazios={classError}
                                    name="funcao" 
                                    valor={candidato?.vaga?.funcao}
                                    setValor={setFuncao} 
                                    options={funcoes.map(funcao => ({
                                        name: funcao.nome,
                                        code: funcao.id
                                    }))} 
                                    placeholder="Função"
                                    disabled={!!self}
                                />
                            </Col6>
                            <Col6>
                                <DropdownItens 
                                    camposVazios={classError}
                                    name="sindicato" 
                                    valor={candidato?.vaga?.sindicato}
                                    setValor={setSindicato} 
                                    options={sindicatos.map(sindicato => ({
                                        name: `${sindicato.codigo} - ${sindicato.descricao}`,
                                        code: sindicato.id
                                    }))} 
                                    placeholder="Sindicato"
                                    disabled={!!self}
                                />
                            </Col6>
                        </Col12>
                        <Col12>
                            <Col6>
                                <DropdownItens 
                                    camposVazios={classError}
                                    name="periculosidade"
                                    valor={candidato?.vaga?.periculosidade || candidato?.periculosidade}
                                    setValor={valor => setCandidatoVaga('periculosidade', valor)}
                                    options={listaPericulosidades}
                                    placeholder="Periculosidade"
                                    disabled={!!self}
                                />
                            </Col6>
                            <Col6>
                                <DropdownItens 
                                    camposVazios={classError}
                                    name="insalubridade"
                                    valor={candidato?.vaga?.insalubridade || candidato?.insalubridade}
                                    setValor={valor => setCandidatoVaga('insalubridade', valor)}
                                    options={listaInsalubridades}
                                    placeholder="Insalubridade"
                                    disabled={!!self}
                                />
                            </Col6>
                            <Col6>
                                <div style={{ marginTop: '5px'}} >
                                <CampoTexto
                                    camposVazios={classError}
                                    name="salario"
                                    valor={candidato?.vaga?.salario || candidato?.salario || ''}
                                    setValor={valor => setCandidatoVaga('salario', valor)}
                                    type="number"
                                    label="Salário"
                                    placeholder="Digite o salário"
                                    disabled={!!self}
                                />
                                </div>
                            </Col6>
                        </Col12>
                    </Container>
                    <Frame padding="30px" estilo="spaced">
                        <BotaoGrupo>
                            <Botao estilo="neutro" aoClicar={() => stepperRef.current.prevCallback()}><HiArrowLeft/> Voltar</Botao>
                        </BotaoGrupo>
                        <BotaoGrupo>
                            <Botao iconPos="right" aoClicar={() => true}><FaSave fill="white"/> Salvar</Botao>
                            <Botao label="Next" iconPos="right" aoClicar={() => stepperRef.current.nextCallback()}><HiArrowRight fill="white"/> Continuar</Botao>
                        </BotaoGrupo>
                    </Frame>
                  </StepperPanel>
                )}
                <StepperPanel header="Educação">
                    <ScrollPanel style={{ width: '100%', height: '380px'}}>
                        {educacao.map((educacao) => (
                            <ArquivoContainer
                                key={educacao.id}
                                style={{
                                    marginBottom: '20px',
                                    padding: '15px',
                                    borderRadius: '5px',
                                    opacity: educacao.isLocked ? 0.5 : 1, // Aplica um estilo para campos bloqueados
                                }}
                            >
                                
                                {educacao.id &&
                                    <ArquivoHeader>
                                        <div></div>
                                        <FaTrash style={{ cursor: 'pointer' }} onClick={() => removerEducacao(educacao.id)} />
                                    </ArquivoHeader>
                                }
                                <Col12>
                                    <Col6>
                                        <CampoTexto
                                            camposVazios={classError}
                                            name={`nivel-${educacao.id}`}
                                            valor={educacao.nivel}
                                            setValor={(valor) => !educacao.isLocked && atualizarCampoEducacao(educacao.id, 'nivel', valor)}
                                            type="text"
                                            label="Nível de Educação"
                                            placeholder="Ex: Ensino Médio, Faculdade"
                                            disabled={educacao.isLocked} // Desabilita os campos se estiver bloqueado
                                        />
                                    </Col6>
                                    <Col6>
                                        <CampoTexto
                                            camposVazios={classError}
                                            name={`instituicao-${educacao.id}`}
                                            valor={educacao.instituicao}
                                            setValor={(valor) => !educacao.isLocked && atualizarCampoEducacao(educacao.id, 'instituicao', valor)}
                                            type="text"
                                            label="Instituição"
                                            placeholder="Ex: Nome da escola ou universidade"
                                            disabled={educacao.isLocked}
                                        />
                                    </Col6>
                                </Col12>
                                <CampoTexto
                                    camposVazios={classError}
                                    name={`curso-${educacao.id}`}
                                    valor={educacao.curso}
                                    setValor={(valor) => !educacao.isLocked && atualizarCampoEducacao(educacao.id, 'curso', valor)}
                                    type="text"
                                    label="Curso"
                                    placeholder="Ex: Engenharia, Administração"
                                    disabled={educacao.isLocked}
                                />
                                <Col12>
                                    <Col6>
                                        <CampoTexto
                                            name={`dataInicio-${educacao.id}`}
                                            valor={educacao.dataInicio}
                                            setValor={(valor) => !educacao.isLocked && atualizarCampoEducacao(educacao.id, 'dataInicio', valor)}
                                            type="date"
                                            label="Data de Início"
                                            disabled={educacao.isLocked}
                                        />
                                    </Col6>
                                    <Col6>
                                        <CampoTexto
                                            name={`dataConclusao-${educacao.id}`}
                                            valor={educacao.dataConclusao}
                                            setValor={(valor) => !educacao.isLocked && atualizarCampoEducacao(educacao.id, 'dataConclusao', valor)}
                                            type="date"
                                            label="Data de Conclusão"
                                            disabled={educacao.isLocked}
                                        />
                                    </Col6>
                                </Col12>
                            </ArquivoContainer>
                        ))}

                        <Frame alinhamento="center">
                            <AdicionarBotao onClick={adicionarEducacao}>
                                <CiCirclePlus size={20} color="var(--vermilion-400)" className={styles.icon} />
                                Adicionar educação
                            </AdicionarBotao>
                        </Frame>
                    </ScrollPanel>
                    <Frame padding="30px" estilo="spaced">
                        <BotaoGrupo>
                            <Botao estilo="neutro" aoClicar={() => stepperRef.current.prevCallback()}><HiArrowLeft/> Voltar</Botao>
                        </BotaoGrupo>
                        <BotaoGrupo>
                            <Botao iconPos="right" aoClicar={() => true}>
                                <FaSave fill="white"/> Salvar
                            </Botao>
                            <Botao label="Next" iconPos="right" aoClicar={() => stepperRef.current.nextCallback()}>
                                <HiArrowRight fill="white"/> Continuar
                            </Botao>
                        </BotaoGrupo>
                    </Frame>
                </StepperPanel>
                <StepperPanel header="Habilidades">
                    <ScrollPanel style={{ width: '100%', height: '380px'}}>
                        {habilidades.map((habilidade) => (
                            <ArquivoContainer key={habilidade.id}>
                                <ArquivoHeader>
                                    <div></div>
                                    <FaTrash 
                                            style={{ cursor: 'pointer' }} 
                                            onClick={() => removerHabilidade(habilidade.id)} 
                                        />
                                </ArquivoHeader>
                                <CampoTexto
                                    camposVazios={classError}
                                    name={`descricao-${habilidade.id}`}
                                    valor={habilidade.descricao}
                                    setValor={(valor) => atualizarCampoHabilidades(habilidade.id, 'descricao', valor)}
                                    type="text"
                                    label="Descrição"
                                    placeholder="Ex: css"
                                />

                                <CampoTexto
                                    camposVazios={classError}
                                    name={`nivel-${habilidade.id}`}
                                    valor={habilidade.nivel}
                                    setValor={(valor) => atualizarCampoHabilidades(habilidade.id, 'nivel', valor)}
                                    type="text"
                                    label="Nível de Habilidade"
                                    placeholder="Ex: avançado"
                                />
                            </ArquivoContainer>
                        ))}

                        <Frame alinhamento="center">
                            <AdicionarBotao onClick={adicionarHabilidade}><CiCirclePlus size={20} color="var(--vermilion-400)" className={styles.icon} />Adicionar nova habilidade</AdicionarBotao>
                        </Frame>
                    </ScrollPanel>
                    <Frame padding="30px" estilo="spaced">
                        <BotaoGrupo>
                            <Botao estilo="neutro" aoClicar={() => stepperRef.current.prevCallback()}><HiArrowLeft/> Voltar</Botao>
                        </BotaoGrupo>
                        <BotaoGrupo>
                            <Botao iconPos="right" aoClicar={() => true}><FaSave fill="white"/> Salvar</Botao>
                            <Botao label="Next" iconPos="right" aoClicar={() => stepperRef.current.nextCallback()}><HiArrowRight fill="white"/> Continuar</Botao>
                        </BotaoGrupo>
                    </Frame>
                </StepperPanel>
                <StepperPanel header="Experiência Profissional">
                    <ScrollPanel style={{ width: '100%', height: '380px'}}>
                        {experiencia.map((experiencia) => (
                            <ArquivoContainer
                                key={experiencia.id}
                                style={{
                                    marginBottom: '20px',
                                    padding: '15px',
                                    borderRadius: '5px',
                                    opacity: experiencia.isLocked ? 0.5 : 1, // Aplica um estilo para campos bloqueados
                                }}
                            > 
                                {experiencia.id &&
                                    <ArquivoHeader>
                                        <div></div>
                                        <FaTrash style={{ cursor: 'pointer' }} onClick={() => removerExperiencia(experiencia.id)} />
                                    </ArquivoHeader>
                                }
                                <Col12>
                                    <Col6>
                                        <CampoTexto
                                            camposVazios={classError}
                                            name={`cargo-${experiencia.id}`}
                                            valor={experiencia.cargo}
                                            setValor={(valor) => !experiencia.isLocked && atualizarCampoExperiencia(experiencia.id, 'cargo', valor)}
                                            type="text"
                                            label="Cargo"
                                            placeholder="Ex: Desenvolvedor, Analista"
                                            disabled={experiencia.isLocked} // Desabilita os campos se estiver bloqueado
                                        />
                                    </Col6>
                                    <Col6>
                                        <CampoTexto
                                            camposVazios={classError}
                                            name={`empresa-${experiencia.id}`}
                                            valor={experiencia.empresa}
                                            setValor={(valor) => !experiencia.isLocked && atualizarCampoExperiencia(experiencia.id, 'empresa', valor)}
                                            type="text"
                                            label="Empresa"
                                            placeholder="Ex: Nome da empresa"
                                            disabled={experiencia.isLocked}
                                        />
                                    </Col6>
                                </Col12>
                                <CampoTexto
                                    camposVazios={classError}
                                    name={`descricao-${experiencia.id}`}
                                    valor={experiencia.descricao}
                                    setValor={(valor) => !experiencia.isLocked && atualizarCampoExperiencia(experiencia.id, 'descricao', valor)}
                                    type="text"
                                    label="Descrição"
                                    placeholder="Ex: Responsabilidades"
                                    disabled={experiencia.isLocked}
                                />
                                <Col12>
                                    <Col6>
                                        <CampoTexto
                                            name={`dataInicio-${experiencia.id}`}
                                            valor={experiencia.dataInicio}
                                            setValor={(valor) => !experiencia.isLocked && atualizarCampoExperiencia(experiencia.id, 'dataInicio', valor)}
                                            type="date"
                                            label="Data de Início"
                                            disabled={experiencia.isLocked}
                                        />
                                    </Col6>
                                    <Col6>
                                        <CampoTexto
                                            name={`dataSaida-${experiencia.id}`}
                                            valor={experiencia.dataSaida}
                                            setValor={(valor) => !experiencia.isLocked && atualizarCampoExperiencia(experiencia.id, 'dataSaida', valor)}
                                            type="date"
                                            label="Data de Saída"
                                            disabled={experiencia.isLocked}
                                        />
                                    </Col6>
                                </Col12>
                            </ArquivoContainer>
                        ))}

                        <Frame alinhamento="center">
                            <AdicionarBotao onClick={adicionarExperiencia}><CiCirclePlus size={20} color="var(--vermilion-400)" className={styles.icon} />Adicionar nova experiência</AdicionarBotao>
                        </Frame>
                    </ScrollPanel>
                    <Frame padding="30px" estilo="spaced">
                        <BotaoGrupo>
                            <Botao estilo="neutro" aoClicar={() => stepperRef.current.prevCallback()}><HiArrowLeft/> Voltar</Botao>
                        </BotaoGrupo>
                        <BotaoGrupo>
                            <Botao iconPos="right" aoClicar={() => true}><FaSave fill="white"/> Salvar</Botao>
                            <Botao label="Next" iconPos="right" aoClicar={() => stepperRef.current.nextCallback()}><HiArrowRight fill="white"/> Continuar</Botao>
                        </BotaoGrupo>
                    </Frame>
                </StepperPanel>
                {self && (
                  <StepperPanel header="LGPD">
                    <ScrollPanel style={{ width: '100%', height: '380px',  textAlign: 'center'}}>
                            <h4>Termo de Consentimento LGPD</h4>
                            <p style={{textAlign: 'justify', marginTop: '20px'}}>
                              Declaro, para os devidos fins, que li e estou ciente de que, ao me candidatar a uma vaga nesta empresa, meus dados pessoais, incluindo, mas não se limitando a nome, CPF, endereço, telefone, e-mail, dados profissionais, acadêmicos, documentos, exames médicos e demais informações fornecidas, serão coletados, tratados e armazenados pela empresa exclusivamente para fins de recrutamento, seleção, análise de perfil, eventual contratação e cumprimento de obrigações legais e regulatórias.<br/><br/>
                              Estou ciente de que meus dados poderão ser compartilhados com prestadores de serviço, parceiros e órgãos públicos, sempre observando a finalidade descrita acima e em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 – LGPD).<br/><br/>
                              Tenho ciência de que poderei, a qualquer momento, solicitar informações sobre o tratamento dos meus dados, bem como requerer a atualização, correção ou exclusão destes, conforme previsto na legislação vigente, por meio dos canais de contato disponibilizados pela empresa.<br/><br/>
                              Ao prosseguir, declaro que li, compreendi e concordo com o tratamento dos meus dados pessoais para os fins acima descritos.
                            </p>
                      </ScrollPanel>
                    
                    <Frame padding="30px" estilo="spaced">
                        <BotaoGrupo>
                            <Botao estilo="neutro" aoClicar={() => stepperRef.current.prevCallback()}><HiArrowLeft/> Voltar</Botao>
                        </BotaoGrupo>
                        <BotaoGrupo>
                            <Botao iconPos="right" aoClicar={() => true}><FaSave fill="white"/> Aceitar e Salvar</Botao>
                        </BotaoGrupo>
                    </Frame>
                  </StepperPanel>
                )}
            </Stepper>
            </form>
        </ConteudoFrame>
    );
};

export default CandidatoRegistro;
