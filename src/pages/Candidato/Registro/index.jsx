import React, { useEffect, useRef, useState } from 'react';
import { useVagasContext } from '@contexts/VagasContext'; // Importando o contexto
import ContainerHorizontal from '@components/ContainerHorizontal'; // Importando o componente ContainerHorizontal
import CampoArquivo from '@components/CampoArquivo'; // Importando o componente BotaoGrupo
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
import { FaTrash } from 'react-icons/fa';
import { CiCirclePlus } from 'react-icons/ci';

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const ContainerButton = styled.div`
    display: flex;
    width: 100%;
    padding: 20px;
    justify-content: space-between;
    & button {
        width: initial;
    }
`

const LadoALado = styled.div`
    display: flex;
    gap: 24px;
    & span {
        display: flex;
        align-items: center;
    }
`

const CardText = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 10px 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 8px;
    border:  ${ props => props.$border ?  props.$border : 'none'};
    background: ${ props => props.$background ?  props.$background : 'var(--neutro-100)'};
`

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
`

const Col6 = styled.div`
    padding: 10px;
    flex: 1 1 50%;
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

const ArquivoBotao = styled(Botao)`
    margin-top: 10px;
`;

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

    let { id } = useParams()
    const [candidato, setCandidato] = useState(null)
    const [classError, setClassError] = useState([])
    const stepperRef = useRef(null);
    const [arquivos, setArquivos] = useState([
        { id: 1, nome: 'RG', caminho: null },
        { id: 2, nome: 'Comprovante de Residência', caminho: null }
    ]);
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

    const setStreet = (street) => setCandidatoEndereco("street", street);
    const setCep = (cep) => setCandidatoEndereco("cep", cep);
    const setDistrict = (district) => setCandidatoEndereco("district", district);
    const setComplemento = (complement) => setCandidatoEndereco("complement", complement);
    const setState = (state) => setCandidatoEndereco("state", state);
    const setCity = (city) => setCandidatoEndereco("city", city);
    const setNumber = (number) => setCandidatoEndereco("number", number);

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
            setArquivos((prev) =>
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
            setArquivos((prev) =>
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
                const obj = vagas.vagas;

                // Procurar o candidato nas vagas abertas e canceladas
                // Percorrer as vagas abertas
                for (let vaga of obj.abertas) {
                    const candidatoEncontrado = vaga.candidatos.find(c => c.id == id);
                    
                    if (candidatoEncontrado) {
                        setCandidato(candidatoEncontrado);
                        setExperiencia(candidatoEncontrado.experiencia);
                        setEducacao(candidatoEncontrado.educacao);
                        setHabilidades(candidatoEncontrado.habilidades);
                        break;  // Sai do loop assim que encontrar o candidato
                    }
                }
            
                // Caso o candidato não tenha sido encontrado nas vagas abertas, procurar nas vagas canceladas
                if (!candidato) {
                    for (let vaga of obj.canceladas) {
                        const candidatoEncontrado = vaga.candidatos.find(c => c.id == id);
            
                        if (candidatoEncontrado) {
                            setCandidato(candidatoEncontrado);
                            setExperiencia(candidatoEncontrado.experiencia);
                            setEducacao(candidatoEncontrado.educacao);
                            setHabilidades(candidatoEncontrado.habilidades);
                            break;  // Sai do loop assim que encontrar o candidato
                        }
                    }
                }
            }
        }
    }, [])


    return (
        <ConteudoFrame>
            <form onSubmit={handleSubmit}>
            <Stepper headerPosition="top" ref={stepperRef} style={{ flexBasis: '50rem' }}>
                <StepperPanel header="Dados Pessoais">
                        <Container padding={'30px 0 0 0'}>
                            <CampoTexto 
                                camposVazios={classError}
                                name="nome" 
                                valor={candidato?.nome ?? ''} 
                                setValor={setName} 
                                type="text" 
                                label="Nome" 
                                placeholder="Digite o nome" />

                            <CampoTexto 
                                camposVazios={classError}
                                name="email" 
                                valor={candidato?.email ?? ''} 
                                setValor={setEmail} 
                                type="text" 
                                label="E-mail" 
                                placeholder="Digite o email" />
                                
                            <CampoTexto 
                                type="date" 
                                valor={candidato?.dataNascimento} 
                                setValor={setDataNascimento}
                                label="Data de Nascimento"  />
                            
                            <CampoTexto 
                                camposVazios={classError} 
                                patternMask={['999.999.999-99', '99.999.999/9999-99']} 
                                name="cpf" 
                                valor={candidato?.cpf} 
                                setValor={setCpf} 
                                type="text" 
                                label="CPF" 
                                placeholder="Digite p CPF" />

                            <Frame padding="24px 0px">
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
                        </Container>
                    <Frame padding="30px" alinhamento="start">
                        <Botao label="Next" iconPos="right" aoClicar={() => {stepperRef.current.nextCallback()}}><HiArrowRight fill="white"/> Continuar</Botao>
                    </Frame>
                </StepperPanel>
                <StepperPanel header="Educação">
                    <ScrollPanel style={{ width: '100%', height: '400px'}}>
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
                            <AdicionarBotao onClick={adicionarEducacao}><CiCirclePlus size={20} color="var(--vermilion-400)" className={styles.icon} />Adicionar educação</AdicionarBotao>
                        </Frame>
                    </ScrollPanel>
                    <Frame padding="30px" estilo="spaced">
                        <Botao estilo="neutro" aoClicar={() => stepperRef.current.prevCallback()}><HiArrowLeft/> Voltar</Botao>
                        <Botao label="Next" iconPos="right" aoClicar={() => stepperRef.current.nextCallback()}><HiArrowRight fill="white"/> Continuar</Botao>
                    </Frame>
                </StepperPanel>
                <StepperPanel header="Habilidades">
                    <ScrollPanel style={{ width: '100%', height: '400px'}}>
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
                        <Botao estilo="neutro" aoClicar={() => stepperRef.current.prevCallback()}><HiArrowLeft/> Voltar</Botao>
                        <Botao label="Next" iconPos="right" aoClicar={() => stepperRef.current.nextCallback()}><HiArrowRight fill="white"/> Continuar</Botao>
                    </Frame>
                </StepperPanel>
                <StepperPanel header="Experiência Profissional">
                    <ScrollPanel style={{ width: '100%', height: '400px'}}>
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
                        <Botao estilo="neutro" aoClicar={() => stepperRef.current.prevCallback()}><HiArrowLeft/> Voltar</Botao>
                        <Botao label="Next" iconPos="right" aoClicar={() => stepperRef.current.nextCallback()}><HiArrowRight fill="white"/> Continuar</Botao>
                    </Frame>
                </StepperPanel>
                <StepperPanel header="Arquivos">
                    <ScrollPanel style={{ width: '100%', height: '400px'}}>
                        {arquivos.map((arquivo) => (
                            <div key={arquivo.id}>
                                <p>{arquivo.nome}</p>
                                <CampoArquivo
                                    onFileChange={(file) => handleUpload(arquivo.id, file)}
                                    accept=".pdf, .jpg, .png"
                                    id={`arquivo-${arquivo.id}`}
                                    name={`arquivo-${arquivo.id}`}
                                />
                                {arquivo.caminho && <p>Arquivo selecionado: {arquivo.caminho}</p>}
                            </div>
                        ))}
                    </ScrollPanel>
                    <Frame padding="30px" estilo="spaced">
                        <Botao estilo="neutro" aoClicar={() => stepperRef.current.prevCallback()}><HiArrowLeft/> Voltar</Botao>
                        {/* <Botao label="Next" iconPos="right" aoClicar={() => stepperRef.current.nextCallback()}><HiArrowRight fill="white"/> Continuar</Botao> */}
                    </Frame>
                </StepperPanel>
            </Stepper>
            

{/* 
                            <Frame alinhamento="end">
                                <ArquivoBotao  aoClicar={setCandidato} type="submit" style={{ marginTop: '20px' }}>
                                    Salvar dados
                                </ArquivoBotao>
                            </Frame> */}
            </form>
        </ConteudoFrame>
    );
};

export default CandidatoRegistro;
