import React, { useEffect, useState } from 'react';
import { useVagasContext } from '@contexts/VagasContext';
import CampoTexto from '@components/CampoTexto';
import Container from '@components/Container';
import Botao from '@components/Botao';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';

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
                    <div
                        key={experiencia.id}
                        style={{
                            marginBottom: '20px',
                            padding: '15px',
                            borderRadius: '5px',
                            opacity: experiencia.isLocked ? 0.5 : 1, // Aplica um estilo para campos bloqueados
                        }}
                    >
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

                        <CampoTexto
                            name={`dataInicio-${experiencia.id}`}
                            valor={experiencia.dataInicio}
                            setValor={(valor) => !experiencia.isLocked && atualizarCampoExperiencia(experiencia.id, 'dataInicio', valor)}
                            type="date"
                            label="Data de Início"
                            disabled={experiencia.isLocked}
                        />

                        <CampoTexto
                            name={`dataSaida-${experiencia.id}`}
                            valor={experiencia.dataSaida}
                            setValor={(valor) => !experiencia.isLocked && atualizarCampoExperiencia(experiencia.id, 'dataSaida', valor)}
                            type="date"
                            label="Data de Saída"
                            disabled={experiencia.isLocked}
                        />

                        {experiencia.id && !experiencia.isLocked &&
                            <Botao
                                type="button"
                                aoClicar={() => removerExperiencia(experiencia.id)}
                                style={{ marginTop: '10px' }}>
                                <FaMinusCircle size="16" fill="white" />
                            </Botao>
                        }
                    </div>
                ))}

                <Botao aoClicar={adicionarExperiencia} style={{ marginTop: '20px' }}>
                   <FaPlusCircle size="16" fill="white"/>
                </Botao>

                <br/>

                <Botao onClick={setCandidatoExperiencia} type="submit" style={{ marginTop: '20px' }}>
                    Salvar
                </Botao>
            </form>
        </Container>
    );
};

export default CandidatoRegistroProfissional;
