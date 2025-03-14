import React, { useEffect, useState } from 'react';
import { useVagasContext } from '@contexts/VagasContext';
import CampoTexto from '@components/CampoTexto';
import Container from '@components/Container';
import Botao from '@components/Botao';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FaMinusCircle, FaPlusCircle, FaTrash } from 'react-icons/fa';
import styles from './Registro.module.css'
import styled from 'styled-components';
import { CiCirclePlus } from 'react-icons/ci';
import Frame from "@components/Frame"
import ContainerHorizontal from '@components/ContainerHorizontal';

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
const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
`

const Col6 = styled.div`
    padding: 10px;
    flex: 1 1 50%;
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


const CandidatoRegistroEducacao = () => {
    const [classError, setClassError] = useState([]);
    const { vagas, setVagas } = useVagasContext();
    const context = useOutletContext();
    const [candidato, setCandidato] = useState(null)
    const navegar = useNavigate()

    const [educacao, setEducacao] = useState([
        { id: 1, nivel: '', instituicao: '', curso: '', dataInicio: '', dataConclusao: '', isLocked: false },
    ]);
    
    useEffect(() => {
        if ((context) && (!candidato)) {
            setCandidato(context)
            setEducacao(context.educacao)
        }
    }, [context])
    
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

    const handleSubmit = (e) => {
        e.preventDefault();

        setCandidatoEducacao()

        if (!candidato) {
            alert('Erro: Nenhum candidato selecionado.');
            return;
        }

        // Resetar o estado de erros
        setClassError([]);

        console.log(candidato)
    };

    return (
        <Container>
            <h3>Educação</h3>
            <form onSubmit={handleSubmit}>
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

                <Frame alinhamento="end">
                    <ArquivoBotao  aoClicar={setCandidatoEducacao} type="submit" style={{ marginTop: '20px' }}>
                        Salvar educação
                    </ArquivoBotao>
                </Frame>
            </form>
        </Container>
    );
};

export default CandidatoRegistroEducacao;