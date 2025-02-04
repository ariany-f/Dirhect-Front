import React, { useEffect, useRef, useState } from 'react';
import { useVagasContext } from '@contexts/VagasContext';
import CampoTexto from '@components/CampoTexto';
import Frame from "@components/Frame"
import ContainerHorizontal from "@components/ContainerHorizontal"
import Texto from "@components/Texto"
import Container from '@components/Container';
import { FaTrash, FaUpload } from "react-icons/fa";
import Loading from '@components/Loading'
import Botao from '@components/Botao';
import { useOutletContext } from 'react-router-dom';
import styled from 'styled-components';
import { CiCirclePlus } from 'react-icons/ci';
import styles from './Registro.module.css'
import { FaPlusCircle } from 'react-icons/fa';
import { BiUpload } from 'react-icons/bi';
import { MdUploadFile } from 'react-icons/md';

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

const ArquivoNome = styled(Texto)`
    font-weight: bold;
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
            isLocked: false
        };
        setArquivos((prev) => [...prev, novoArquivo]);
        console.log(arquivos)
    };

    // Função para tratar o envio do formulário
    const handleSubmit = (e) => {
        e.preventDefault();
        // Resetar o estado de erros
        setClassError([]);
    };

    return (
        <Container>
            <Loading opened={loading} />
            <h3>Arquivos</h3>
            <form onSubmit={handleSubmit}>
                {arquivos.map((arquivo) => (
                    <ArquivoContainer key={arquivo.id}>
                        <CampoTexto
                            label="Nome do Arquivo"
                            type="text"
                            valor={arquivo.nome}
                            setValor={(e) => !arquivo.isLocked && atualizarCampoArquivo(arquivo.id, 'nome', e.target.value)}
                            disabled={arquivo.isLocked}
                            placeholder="Ex: Curriculum, Certificado"
                        />
                        <ArquivoHeader>
                            <div>
                                
                                <CampoTexto
                                    type="file"
                                    reference={ref}
                                    name={`arquivo-${arquivo.id}`}
                                    setValor={(e) => !arquivo.isLocked && atualizarCampoArquivo(arquivo.id, 'caminho', e.target.files[0])}
                                    disabled={arquivo.isLocked}
                                />
                                <ArquivoBotao aoClicar={submeterPlanilha} estilo="vermilion" size="medium" filled>
                                    <Texto color="white" weight="600"><FaUpload size={14}/>&nbsp;&nbsp;Selecionar arquivo</Texto>
                                </ArquivoBotao>
                                <br/>
                                {arquivo.caminho &&
                                    <Texto>{arquivo.caminho || 'Arquivo carregado'}</Texto>
                                }
                            </div>
                            <FaTrash 
                                style={{ cursor: 'pointer' }} 
                                onClick={() => removerArquivo(arquivo.id)} 
                            />
                        </ArquivoHeader>
                    </ArquivoContainer>
                ))}
                <Frame alinhamento="center">
                    <AdicionarBotao onClick={adicionarArquivo}><CiCirclePlus size={20} color="var(--vermilion-400)" className={styles.icon} />Adicionar novo arquivo</AdicionarBotao>
                </Frame>
                
                <Frame alinhamento="end">
                    <ArquivoBotao type="submit" style={{ marginTop: '20px' }}>
                        Salvar arquivos
                    </ArquivoBotao>
                </Frame>
            </form>
        </Container>
    );
};

export default CandidatoRegistroArquivos;
