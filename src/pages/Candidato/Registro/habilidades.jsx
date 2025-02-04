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
import ContainerHorizontal from "@components/ContainerHorizontal"


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

const CandidatoRegistroHabilidades = () => {
    const [classError, setClassError] = useState([]);
    const { vagas, setVagas } = useVagasContext();
    const context = useOutletContext();
    const [candidato, setCandidato] = useState(null)
    const navegar = useNavigate()

    const [habilidades, setHabilidades] = useState([
        { id: 1, nivel: '', descricao: ''},
    ]);
    
    useEffect(() => {
        if ((context) && (!candidato)) {
            setCandidato(context)
            setHabilidades(context.habilidades)
        }
    }, [context])
    
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

    const handleSubmit = (e) => {
        e.preventDefault();

        setCandidatoHabilidades()

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
            <h3>Habilidades</h3>
            <form onSubmit={handleSubmit}>
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

                <Frame alinhamento="end">
                    <ArquivoBotao onClick={setCandidatoHabilidades} type="submit" style={{ marginTop: '20px' }}>
                        Salvar habilidades
                    </ArquivoBotao>
                </Frame>
            </form>
        </Container>
    );
};

export default CandidatoRegistroHabilidades;