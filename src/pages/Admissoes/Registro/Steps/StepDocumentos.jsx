import React from 'react';
import { useCandidatoContext } from '@contexts/Candidato';
import CampoArquivo from '@components/CampoArquivo';
import BotaoSemBorda from '@components/BotaoSemBorda';
import styled from 'styled-components';
import http from '@http';
import { useRef } from 'react';
import { FaCheck, FaFile, FaEye } from 'react-icons/fa';
import Texto from '@components/Texto';
import { ArmazenadorToken } from '@utils';

const DocumentoContainer = styled.div`
    border: 1px solid var(--surface-border);
    border-radius: 8px;
    margin-bottom: 16px;
    padding: 16px;
`;

const DocumentoHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
`;

const DocumentoTitulo = styled.h4`
    margin: 0;
    color: var(--text-color);
    font-size: 16px;
    font-weight: 600;
`;

const ObrigatorioTag = styled.span`
    background-color: ${props => props.isObrigatorio ? 'var(--error-100)' : 'var(--surface-100)'};
    color: ${props => props.isObrigatorio ? 'var(--error-600)' : 'var(--text-color-secondary)'};
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
`;

const Instrucao = styled.div`
    margin: 8px 0;
    color: var(--text-color-secondary);
    font-size: 14px;
    font-style: italic;
`;

const FormatosAceitos = styled.div`
    font-size: 12px;
    color: var(--text-color-secondary);
    margin-top: 4px;
`;

const ItensContainer = styled.div`
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
`;

const ArquivoEnviado = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    padding: 8px;
    background-color: var(--surface-100);
    border-radius: 4px;
`;

const ArquivoNome = styled.span`
    font-size: 14px;
    color: var(--text-color);
    flex: 1;
`;

const ArquivoStatus = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
`;

const ArquivoAcoes = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const StepDocumentos = ({ toast }) => {
    const { candidato, updateArrayItem } = useCandidatoContext();

    const handleUpload = async (documentoId, itemIndex, arquivo) => {
        console.log(arquivo);
        if (!arquivo || !candidato.id) return;

        const documento = candidato.documentos.find(doc => doc.id === documentoId);
        if (!documento) return;

        try {
            const formData = new FormData();
            formData.append('arquivo', arquivo);
            formData.append('documento_requerido_id', documento.id);
            
            if (documento.frente_verso) {
                formData.append('item', itemIndex + 1);
            }

            const response = await http.post(`admissao/${candidato.id}/upload_documento/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${ArmazenadorToken.AccessToken}`
                }
            });

            const novosItens = [...documento.itens];
            novosItens[itemIndex] = {
                ...novosItens[itemIndex],
                arquivo: response.arquivo,
                upload_feito: true
            };

            const todosUploadFeitos = novosItens.every(item => item.upload_feito);

            const novoDocumento = {
                ...documento,
                itens: novosItens,
                upload_feito: todosUploadFeitos
            };

            const index = candidato.documentos.findIndex(doc => doc.id === documentoId);
            updateArrayItem('documentos', index, novoDocumento);

            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Documento enviado com sucesso!',
                life: 3000
            });

        } catch (error) {
            console.error('Erro ao fazer upload:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao enviar o documento. Tente novamente.',
                life: 3000
            });
        }
    };

    const getArquivoNome = (arquivo) => {
        if (!arquivo) return '';
        
        // Se for um objeto File (novo upload)
        if (arquivo instanceof File) {
            return arquivo.name;
        }
        
        // Se for uma string (URL do arquivo existente)
        if (typeof arquivo === 'string') {
            const partes = arquivo.split('/');
            return decodeURIComponent(partes[partes.length - 1]);
        }

        return '';
    };

    const getExtensaoAceita = (documento) => {
        if (!documento.ext_permitidas) return '.pdf,.jpg,.jpeg,.png';
        return documento.ext_permitidas.split(',').map(ext => `.${ext.trim()}`).join(',');
    };

    const getArquivoUrl = (arquivo) => {
        if (!arquivo) return '';
        if (arquivo instanceof File) return '';
        
        // Se já contém a URL completa, retorna como está
        if (arquivo.includes('dirhect.net')) {
            return arquivo;
        }
        
        // Remove a primeira barra se existir
        const caminhoLimpo = arquivo.startsWith('/') ? arquivo.substring(1) : arquivo;
        return `https://geral.dirhect.net/${caminhoLimpo}`;
    };

    return (
        <div data-tour="panel-step-0">
            {(candidato?.documentos && candidato?.documentos.length > 0) ?
                <div>
                    {candidato?.documentos?.map((documento) => (
                        <DocumentoContainer key={documento.id}>
                            <DocumentoHeader>
                                <DocumentoTitulo>{documento.nome}</DocumentoTitulo>
                                <ObrigatorioTag isObrigatorio={documento.obrigatorio}>
                                    {documento.obrigatorio ? 'Obrigatório' : 'Opcional'}
                                </ObrigatorioTag>
                            </DocumentoHeader>
                            
                            {documento.instrucao && (
                                <Instrucao>
                                    <span>{documento.instrucao}</span>
                                    <FormatosAceitos>
                                        Formatos aceitos: {documento.ext_permitidas || 'PDF, JPG, JPEG, PNG'}
                                    </FormatosAceitos>
                                </Instrucao>
                            )}

                            <ItensContainer>
                                {documento.itens.map((item, idx) => (
                                    <div key={`${documento.id}-${idx}`} style={{ flex: 1 }}>
                                        <CampoArquivo
                                            nome={documento.frente_verso ? (idx === 0 ? 'Frente' : 'Verso') : documento.nome}
                                            valor={item.arquivo}
                                            onFileChange={(arquivo) => handleUpload(documento.id, idx, arquivo)}
                                            label={documento.frente_verso ? (idx === 0 ? 'Frente do documento' : 'Verso do documento') : 'Arquivo'}
                                            accept={getExtensaoAceita(documento)}
                                        />
                                        {item.upload_feito && item.arquivo && (
                                            <ArquivoEnviado>
                                                <FaFile />
                                                <ArquivoNome>{getArquivoNome(item.arquivo)}</ArquivoNome>
                                                <ArquivoAcoes>
                                                    <ArquivoStatus>
                                                        <FaCheck /> Enviado
                                                    </ArquivoStatus>
                                                    <BotaoSemBorda 
                                                        aoClicar={() => window.open(getArquivoUrl(item.arquivo), '_blank')}
                                                        color="var(--primary-color)"
                                                    >
                                                        <FaEye /> Visualizar
                                                    </BotaoSemBorda>
                                                </ArquivoAcoes>
                                            </ArquivoEnviado>
                                        )}
                                    </div>
                                ))}
                            </ItensContainer>
                        </DocumentoContainer>
                    ))}
                </div>
            : 
                <div>
                    <Texto>Nenhum documento requerido cadastrado</Texto>
                </div>
            }
        </div>
    );
};

export default StepDocumentos; 