import React, { useEffect, useState } from 'react';
import { useVagasContext } from '@contexts/VagasContext';
import CampoTexto from '@components/CampoTexto';
import Container from '@components/Container';
import Botao from '@components/Botao';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';

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
            id: educacao.length + 1,
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
                    <div
                        key={habilidade.id}
                        style={{
                            marginBottom: '20px',
                            padding: '15px',
                            borderRadius: '5px'
                        }}
                    >

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

                        {habilidade.id &&
                            <Botao
                                type="button"
                                aoClicar={() => removerHabilidade(habilidade.id)}
                                style={{ marginTop: '10px' }}>
                                <FaMinusCircle size="16" fill="white" />
                            </Botao>
                        }
                    </div>
                ))}

                <Botao aoClicar={adicionarHabilidade} style={{ marginTop: '20px' }}>
                   <FaPlusCircle size="16" fill="white"/>
                </Botao>

                <br/>

                <Botao onClick={setCandidatoHabilidades} type="submit" style={{ marginTop: '20px' }}>
                    Salvar
                </Botao>
            </form>
        </Container>
    );
};

export default CandidatoRegistroHabilidades;