import React, { useEffect, useState } from 'react';
import { useVagasContext } from '@contexts/VagasContext';
import CampoTexto from '@components/CampoTexto';
import Container from '@components/Container';
import Botao from '@components/Botao';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';

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
                    <div
                        key={educacao.id}
                        style={{
                            marginBottom: '20px',
                            padding: '15px',
                            borderRadius: '5px',
                            opacity: educacao.isLocked ? 0.5 : 1, // Aplica um estilo para campos bloqueados
                        }}
                    >
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

                        <CampoTexto
                            name={`dataInicio-${educacao.id}`}
                            valor={educacao.dataInicio}
                            setValor={(valor) => !educacao.isLocked && atualizarCampoEducacao(educacao.id, 'dataInicio', valor)}
                            type="date"
                            label="Data de Início"
                            disabled={educacao.isLocked}
                        />

                        <CampoTexto
                            name={`dataConclusao-${educacao.id}`}
                            valor={educacao.dataConclusao}
                            setValor={(valor) => !educacao.isLocked && atualizarCampoEducacao(educacao.id, 'dataConclusao', valor)}
                            type="date"
                            label="Data de Conclusão"
                            disabled={educacao.isLocked}
                        />

                        {educacao.id && !educacao.isLocked &&
                            <Botao
                                type="button"
                                aoClicar={() => removerEducacao(educacao.id)}
                                style={{ marginTop: '10px' }}>
                                <FaMinusCircle size="16" fill="white" />
                            </Botao>
                        }
                    </div>
                ))}

                <Botao aoClicar={adicionarEducacao} style={{ marginTop: '20px' }}>
                   <FaPlusCircle size="16" fill="white"/>
                </Botao>

                <br/>

                <Botao onClick={setCandidatoEducacao} type="submit" style={{ marginTop: '20px' }}>
                    Salvar
                </Botao>
            </form>
        </Container>
    );
};

export default CandidatoRegistroEducacao;