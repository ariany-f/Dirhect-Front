import React, { useEffect, useRef, useState } from 'react';
import { useVagasContext } from '@contexts/VagasContext';
import CampoTexto from '@components/CampoTexto';
import ContainerHorizontal from "@components/ContainerHorizontal"
import Texto from "@components/Texto"
import Container from '@components/Container';
import { FaTrash } from "react-icons/fa";
import Loading from '@components/Loading'
import Botao from '@components/Botao';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';

const CandidatoRegistroArquivos = () => {
    const [classError, setClassError] = useState([]);
    const { vagas, setVagas } = useVagasContext();

    const context = useOutletContext();
    const [loading, setLoading] = useState(false)
    const [planilha, setPlanilha] = useState(null)
    const [candidato, setCandidato] = useState(null)
    const [arquivos, setArquivos] = useState([
        { id: 1, caminho: null, nome: '', isLocked: false },
    ]);

    useEffect(() => {
        if ((context) && (!candidato)) {
            setCandidato(context)
            setArquivos(context.arquivos)
        }
    }, [context])
    
    const ref = useRef(planilha)

    const submeterPlanilha = () => {
        
        if(planilha)
        {
            setLoading(true)
            const body = new FormData();
            body.append('spreadsheet', planilha);
        
            http.post('api/dashboard/collaborator/import', body)
            .then((response) => {
                
                setLoading(false)
                return response
            })
            .catch(erro => {
                setLoading(false)
                return erro.response.data
            })
        }
        else
        {
            ref.current.value = null
            ref.current.click()
        }
    }

    // Função para atualizar o campo de arquivo
    const atualizarCampoArquivo = (id, campo, valor) => {
        setArquivos((prev) =>
            prev.map((arquivo) =>
                arquivo.id === id ? { ...arquivo, [campo]: valor } : arquivo
            )
        );
    };

    // Remove um arquivo específico
    const removerArquivo = (id) => {
        setArquivos((prev) => prev.filter((arquivo) => arquivo.id !== id));
    };

    // Função para adicionar um novo campo de anexo
    const adicionarArquivo = () => {
        const novoArquivo = {
            id: arquivos.length + 1,
            caminho: null,
            nome: '',
        };
        setArquivos([...arquivos, novoArquivo]);
    };

    // Função para tratar o envio do formulário
    const handleSubmit = (e) => {
        e.preventDefault();

        // Resetar o estado de erros
        setClassError([]);

        console.log('Arquivos enviados:', arquivos);
    };

    return (
        <Container>
            <Loading opened={loading} />
            <h3>Arquivos</h3>
            <form onSubmit={handleSubmit}>
                {arquivos.map((arquivo) => (
                    <div
                        key={arquivo.id}
                        style={{
                            marginBottom: '20px',
                            padding: '15px',
                            borderRadius: '5px',
                            opacity: arquivo.isLocked ? 0.5 : 1, // Aplica um estilo para campos bloqueados
                        }}
                    >
                            {arquivo && arquivo.nome &&
                                <ContainerHorizontal>
                                    <Texto>{arquivo?.nome}</Texto>
                                    <FaTrash style={{cursor: 'pointer'}} onClick={() => setPlanilha(null)} />
                                </ContainerHorizontal>
                            }
                            <CampoTexto
                                label="Arquivo"
                                type="file"
                                reference={ref}
                                name={`arquivo-${arquivo.id}`}
                                setValor={(e) => !arquivo.isLocked && atualizarCampoArquivo(arquivo.id, 'caminho', e.target.files[0])}
                                disabled={arquivo.isLocked}
                            />
                            <Botao aoClicar={submeterPlanilha} estilo="vermilion" size="medium" filled>{!arquivo.caminho ? 'Selecionar' : 'Enviar'} arquivo</Botao>
                            <br/>
                            <CampoTexto
                                label="Nome do Arquivo"
                                type="text"
                                valor={arquivo.nome}
                                setValor={(e) => !arquivo.isLocked && atualizarCampoArquivo(arquivo.id, 'nome', e.target.value)}
                                disabled={arquivo.isLocked}
                                placeholder="Ex: Curriculum, Certificado"
                            />

                        {arquivo.id && !arquivo.isLocked && (
                            <Botao
                                type="button"
                                aoClicar={() => removerArquivo(arquivo.id)}
                                style={{ marginTop: '10px' }}
                            >
                                <FaMinusCircle size="16" fill="white" />
                            </Botao>
                        )}
                    </div>
                ))}

                <Botao aoClicar={adicionarArquivo} style={{ marginTop: '20px' }}>
                    <FaPlusCircle size="16" fill="white" />
                </Botao>

                <br />

                <Botao type="submit" style={{ marginTop: '20px' }}>
                    Finalizar Registro
                </Botao>
            </form>
        </Container>
    );
};

export default CandidatoRegistroArquivos;
