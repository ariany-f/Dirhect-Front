import React, { useEffect, useState } from 'react';
import { useVagasContext } from '@contexts/VagasContext';
import CampoTexto from '@components/CampoTexto';
import Container from '@components/Container';
import ContainerHorizontal from '@components/ContainerHorizontal';
import Botao from '@components/Botao';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FaMinusCircle, FaPlusCircle, FaTrash } from 'react-icons/fa';
import styles from './Registro.module.css'
import styled from 'styled-components';
import { CiCirclePlus } from 'react-icons/ci';
import Frame from "@components/Frame"

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



const CandidatoRegistroProfissional = () => {
    const [classError, setClassError] = useState([]);
    const { vagas, setVagas } = useVagasContext();
    const context = useOutletContext();
    const [candidato, setCandidato] = useState(null);
    const navegar = useNavigate();

    const [experiencia, setExperiencia] = useState([
        { id: 1, cargo: '', empresa: '', descricao: '', dataInicio: '', dataSaida: '', isLocked: false },
    ]);
    
    useEffect(() => {
        if ((context) && (!candidato)) {
            setCandidato(context)
            setExperiencia(context.experiencia)
        }
    }, [context]);
    
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

    const handleSubmit = (e) => {
        e.preventDefault();

        setCandidatoExperiencia();

        if (!candidato) {
            alert('Erro: Nenhum candidato selecionado.');
            return;
        }

        // Resetar o estado de erros
        setClassError([]);

        console.log(candidato);
    };

    return (
        <Container>
            <h3>Experiência Profissional</h3>
            <form onSubmit={handleSubmit}>
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

                <Frame alinhamento="end">
                    <ArquivoBotao  aoClicar={setCandidatoExperiencia} type="submit" style={{ marginTop: '20px' }}>
                        Salvar experiências
                    </ArquivoBotao>
                </Frame>
            </form>
        </Container>
    );
};

export default CandidatoRegistroProfissional;
