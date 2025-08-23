import React from 'react';
import { useCandidatoContext } from '@contexts/Candidato';
import CampoArquivo from '@components/CampoArquivo';
import BotaoSemBorda from '@components/BotaoSemBorda';
import styled from 'styled-components';
import http from '@http';
import { useRef, useState } from 'react';
import { FaCheck, FaFile, FaEye, FaUser, FaUpload, FaTrash } from 'react-icons/fa';
import Texto from '@components/Texto';
import { buscarDadosOCR } from '@utils/ocr';
import { useMemo } from 'react';
import { ArmazenadorToken } from '@utils';
import imageCompression from 'browser-image-compression';
import { RiUpload2Fill } from 'react-icons/ri';

const DocumentoContainer = styled.div`
    border: 1px solid var(--surface-border);
    border-radius: 6px;
    margin-bottom: 13px;
    padding: 13px;
`;

const DocumentoHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 10px;
`;

const DocumentoTitulo = styled.h4`
    margin: 0;
    color: var(--text-color);
    font-size: 13px;
    font-weight: 600;
`;

const ObrigatorioTag = styled.span`
    background-color: ${props => props['data-isobrigatorio'] === 'true' ? 'var(--error-100)' : 'var(--surface-100)'};
    color: ${props => props['data-isobrigatorio'] === 'true' ? 'var(--error-600)' : 'var(--text-color-secondary)'};
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 10px;
    font-weight: 500;
`;

const Instrucao = styled.div`
    margin: 6px 0;
    color: var(--text-color-secondary);
    font-size: 11px;
    font-style: italic;
`;

const FormatosAceitos = styled.div`
    font-size: 10px;
    color: var(--text-color-secondary);
    margin-top: 3px;
`;

const ItensContainer = styled.div`
    display: flex;
    gap: 13px;
    flex-wrap: wrap;
`;

const ArquivoEnviado = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
    padding: 6px;
    background-color: var(--surface-100);
    border-radius: 3px;
`;

const ArquivoNome = styled.span`
    font-size: 11px;
    color: var(--text-color);
    flex: 1;
`;

const ArquivoStatus = styled.div`
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 10px;
`;

const ArquivoAcoes = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const FotoContainer = styled.div`
    border: 1px solid var(--surface-border);
    border-radius: 6px;
    margin-bottom: 13px;
    padding: 13px;
    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
`;

const FotoHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 10px;
`;

const FotoTitulo = styled.h4`
    margin: 0;
    color: var(--text-color);
    font-size: 13px;
    font-weight: 600;
`;

const FotoPreview = styled.div`
    display: flex;
    align-items: center;
    gap: 13px;
    margin-top: 10px;
`;

const FotoImagem = styled.img`
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--surface-border);
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        transform: scale(1.05);
        border-color: var(--primary-color);
    }
`;

const FotoInfo = styled.div`
    flex: 1;
`;

const FotoNome = styled.div`
    font-size: 11px;
    color: var(--text-color);
    font-weight: 500;
    margin-bottom: 3px;
`;

const FotoStatus = styled.div`
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 10px;
    color: var(--text-color-secondary);
`;

const FotoAcoes = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
`;

const UploadArea = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border: 2px dashed var(--primary-color);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.1);
    
    &:hover {
        border-color: var(--primary-600);
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.05);
    }
`;

const UploadIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-color);
    
    svg {
        font-size: 19px;
    }
`;

// Estilo para animação de carregamento
const LoadingSpinner = styled.div`
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

const StepDocumentos = ({ toast, modoLeitura }) => {
    const { candidato, updateArrayItem, setCampo } = useCandidatoContext();
    const [uploadingFoto, setUploadingFoto] = useState(false);
    const fileInputRef = useRef(null);

    // Opções de campos requeridos organizados por categoria
    const camposPrincipais = useMemo(() => [
        // CNH
        { name: 'Carteira de Motorista', code: 'carteira_motorista', fieldType:'driversLicense', categoria: 'CNH' },
        
        // CTPS
        { name: 'Carteira de Trabalho', code: 'carteira_trabalho', categoria: 'CTPS' },
        { name: 'Série Carteira Trabalho', code: 'serie_carteira_trab', categoria: 'CTPS' },
        
        // TÍTULO DE ELEITOR
        { name: 'Título de Eleitor', code: 'titulo_eleitor', categoria: 'TÍTULO DE ELEITOR' },
        { name: 'Zona Título Eleitor', code: 'zona_titulo_eleitor', categoria: 'TÍTULO DE ELEITOR' },
        { name: 'Seção Título Eleitor', code: 'secao_titulo_eleitor', categoria: 'TÍTULO DE ELEITOR' },
        
        // RG
        { name: 'Identidade', code: 'identidade', fieldType:'federalID', categoria: 'RG' },
    ], []);

    // Mapeamento entre campos do sistema e campos do OCR
    const mapeamentoCamposOCR = {
        carteira_motorista: 'registerNumber', // CNH
        carteira_trabalho: 'workCardNumber', // Exemplo, ajustar conforme resposta real
        serie_carteira_trab: 'workCardSeries', // Exemplo, ajustar conforme resposta real
        titulo_eleitor: 'registrationNumber', // Título de Eleitor
        zona_titulo_eleitor: 'electoralWard', // Título de Eleitor
        secao_titulo_eleitor: 'pollingStation', // Título de Eleitor
        identidade: 'documentId', // RG
        uf_identidade: 'headerState', // RG
        orgao_emissor_ident: 'orgaoEmissor', // RG (ajustar conforme resposta real do OCR)
        data_emissao_ident: 'issuedAt', // RG
        // Adicione outros campos conforme necessário
    };

    const handleUpload = async (documentoId, itemIndex, arquivo) => {
        
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

            const response = await http.post(`admissao/${candidato.id}/upload_documento/`, formData);

            // Validação do response
            if (!response || !response.arquivo) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao receber confirmação do upload. Tente novamente.',
                    life: 3000
                });
                return;
            }

            // Atualiza o item enviado
            const novosItens = documento.itens.map((item, idx) => {
                if (idx === itemIndex) {
                    return {
                        ...item,
                        arquivo: response.arquivo,
                        upload_feito: true
                    };
                }
                return item;
            });

            // Atualiza o status do documento
            const todosUploadFeitos = novosItens.every(item => item.upload_feito);
            const novoDocumento = {
                ...documento,
                itens: novosItens,
                upload_feito: todosUploadFeitos
            };

            // Atualiza o array de documentos do candidato
            const index = candidato.documentos.findIndex(doc => doc.id === documentoId);
            updateArrayItem('documentos', index, novoDocumento);

            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Documento enviado com sucesso!',
                life: 3000
            });

            // --- INTEGRAÇÃO OCR ---
            if (import.meta.env.VITE_OPTIONS_BUSCAR_DADOS_OCR === 'true') {
                try {
                    const ocrResult = await buscarDadosOCR(arquivo);
                    const enhanced = ocrResult?.data?.[0]?.enhanced;
                    // Normaliza camposRequeridos para array de obrigatórios
                    let camposRequeridos = documento.campos_requeridos;
                    if (!camposRequeridos) {
                        camposRequeridos = [];
                    } else if (typeof camposRequeridos === 'string') {
                        try {
                            const parsed = JSON.parse(camposRequeridos);
                            if (Array.isArray(parsed)) {
                                camposRequeridos = parsed;
                            } else if (typeof parsed === 'object' && parsed !== null) {
                                camposRequeridos = Object.keys(parsed).filter(key => parsed[key] === true);
                            } else {
                                camposRequeridos = [];
                            }
                        } catch (e) {
                            camposRequeridos = [];
                        }
                    } else if (typeof camposRequeridos === 'object' && camposRequeridos !== null && !Array.isArray(camposRequeridos)) {
                        camposRequeridos = Object.keys(camposRequeridos).filter(key => camposRequeridos[key]);
                    } else if (!Array.isArray(camposRequeridos)) {
                        camposRequeridos = [];
                    }
                    console.log('camposRequeridos', camposRequeridos);
                    let camposPreenchidos = {};
                    camposRequeridos.forEach((campo) => {
                        const campoInfo = camposPrincipais.find(c => c.code === campo);
                        console.log('campoInfo', campoInfo);
                        if (campoInfo && enhanced && (campoInfo.fieldType && enhanced.schemaName == campoInfo.fieldType)) {
                            // Busca o nome do campo no OCR
                            const nomeCampoOCR = mapeamentoCamposOCR[campo] || campo;
                            console.log('nomeCampoOCR', nomeCampoOCR);
                            let valor = null;
                            if (enhanced.person && enhanced.person[nomeCampoOCR]) {
                                valor = enhanced.person[nomeCampoOCR];
                            } else if (enhanced.otherFields && enhanced.otherFields[nomeCampoOCR]) {
                                valor = enhanced.otherFields[nomeCampoOCR];
                            }
                            console.log('valor', valor);
                            if (valor) {
                                camposPreenchidos[campo] = valor;
                                setCampo(campo, valor);
                            }
                        }
                    });

                    console.log('camposPreenchidos', camposPreenchidos);
                    // Atualiza o documento do candidato com os campos preenchidos
                    if (Object.keys(camposPreenchidos).length > 0) {
                        const novosItensPreenchidos = documento.itens.map((item, idx) => {
                            if (idx === itemIndex) {
                                return {
                                    ...item,
                                    ...camposPreenchidos
                                };
                            }
                            return item;
                        });
                        const novoDocumentoPreenchido = {
                            ...documento,
                            itens: novosItensPreenchidos
                        };
                        console.log('novoDocumentoPreenchido', novoDocumentoPreenchido);
                        const indexDoc = candidato.documentos.findIndex(doc => doc.id === documentoId);
                        updateArrayItem('documentos', indexDoc, novoDocumentoPreenchido);
                    }
                    // Exemplo de exibição: alert, console.log ou toast
                    console.log('Campos requeridos:', documento.campos_requeridos);
                    console.log('Resultado OCR:', ocrResult);

                } catch (ocrError) {
                    console.error('Erro ao buscar dados OCR:', ocrError);
                    toast.current.show({
                        severity: 'warn',
                        summary: 'OCR',
                        detail: 'Não foi possível processar o OCR deste documento.',
                        life: 3000
                    });
                }
            }
            // --- FIM INTEGRAÇÃO OCR ---
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
        if (arquivo.includes(import.meta.env.VITE_API_BASE_DOMAIN)) {
            return arquivo;
        }
        
        // Remove a primeira barra se existir
        const caminhoLimpo = arquivo.startsWith('/') ? arquivo.substring(1) : arquivo;
        return `https://dirhect.${import.meta.env.VITE_API_BASE_DOMAIN}/${caminhoLimpo}`;
    };

    const compressImage = async (file) => {
        try {
            const options = {
                maxSizeMB: 2,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                fileType: file.name.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg',
                quality: 0.8
            };
            
            console.log('Compactando imagem...', {
                originalSize: (file.size / 1024 / 1024).toFixed(2) + 'MB',
                originalName: file.name
            });
            
            const compressedFile = await imageCompression(file, options);
            
            const finalFile = new File([compressedFile], file.name, {
                type: compressedFile.type,
                lastModified: Date.now(),
            });
            
            console.log('Imagem compactada:', {
                originalSize: (file.size / 1024 / 1024).toFixed(2) + 'MB',
                compressedSize: (finalFile.size / 1024 / 1024).toFixed(2) + 'MB',
                reduction: ((1 - finalFile.size / file.size) * 100).toFixed(1) + '%',
                fileName: finalFile.name,
                fileType: finalFile.type
            });
            
            return finalFile;
        } catch (error) {
            console.error('Erro ao compactar imagem:', error);
            return file;
        }
    };

    const handleFotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.match('image.*')) {
            toast.current.show({ 
                severity: 'warn', 
                summary: 'Atenção', 
                detail: 'Por favor, selecione um arquivo de imagem válido.', 
                life: 3000 
            });
            return;
        }

        // Usar o modal de corte do componente pai (index.jsx)
        if (window.handleImageUploadFromStep) {
            window.handleImageUploadFromStep(file);
        } else {
            // Fallback: abrir modal de corte local
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
                setShowCropModal(true);
                setShowCropSelection(false);
                setIsCropped(false);
                setCroppedImageSrc('');
                setHasCropChanged(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveFoto = async () => {
        if (!candidato.id) return;

        try {
            const formData = new FormData();
            formData.append('imagem', '');
            
            await http.put(`admissao/${candidato.id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            setCampo('imagem', null);
            toast.current.show({ 
                severity: 'success', 
                summary: 'Sucesso', 
                detail: 'Foto removida com sucesso!', 
                life: 3000 
            });
        } catch (erro) {
            console.error("Erro ao remover foto:", erro);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Erro', 
                detail: 'Falha ao remover a foto.', 
                life: 3000 
            });
        }
    };

    const getFotoNome = (imagem) => {
        if (!imagem) return '';
        
        if (imagem instanceof File) {
            return imagem.name;
        }
        
        if (typeof imagem === 'string') {
            const partes = imagem.split('/');
            return decodeURIComponent(partes[partes.length - 1]);
        }

        return '';
    };

    const getFotoUrl = (imagem) => {
        if (!imagem) return '';
        if (imagem instanceof File) return '';
        
        if (imagem.includes(import.meta.env.VITE_API_BASE_DOMAIN)) {
            return imagem;
        }
        
        const caminhoLimpo = imagem.startsWith('/') ? imagem.substring(1) : imagem;
        return `https://dirhect.${import.meta.env.VITE_API_BASE_DOMAIN}/${caminhoLimpo}`;
    };





    return (
        <>
        <div data-tour="panel-step-0">
            {/* Campo de Upload da Foto */}
            <FotoContainer>
                <FotoHeader>
                    <FaUser style={{ color: 'var(--primary-color)' }} />
                    <FotoTitulo>Foto do Candidato</FotoTitulo>
                </FotoHeader>
                
                <div style={{ fontSize: '11px', color: 'var(--text-color-secondary)', marginBottom: '10px' }}>
                    Faça upload de uma foto de perfil para o candidato. Formatos aceitos: JPG, JPEG, PNG
                </div>

                <FotoPreview>
                    {candidato.imagem ? (
                        <>
                            <FotoImagem 
                                src={getFotoUrl(candidato.imagem)}
                                alt={`Foto de ${candidato?.nome || 'Candidato'}`}
                                onClick={() => {
                                    if (window.handleShowImageModal) {
                                        window.handleShowImageModal();
                                    }
                                }}
                            />
                            <FotoInfo>
                                <FotoNome>{getFotoNome(candidato.imagem)}</FotoNome>
                                <FotoStatus>
                                    <FaCheck style={{ color: 'var(--success-color)' }} /> 
                                    Foto enviada
                                </FotoStatus>
                            </FotoInfo>
                            <FotoAcoes>
                                {ArmazenadorToken.hasPermission('change_admissao') && !modoLeitura && (
                                    <>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFotoUpload}
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            id="candidato-foto-upload"
                                        />
                                        <BotaoSemBorda 
                                            aoClicar={() => fileInputRef.current.click()}
                                            color="var(--primary-color)"
                                            disabled={uploadingFoto}
                                        >
                                            {uploadingFoto ? (
                                                                                            <div style={{
                                                border: '2px solid var(--primary-color)',
                                                borderTop: '2px solid transparent',
                                                borderRadius: '50%',
                                                width: '13px',
                                                height: '13px',
                                                animation: 'spin 1s linear infinite'
                                            }}></div>
                                            ) : (
                                                <FaUpload />
                                            )}
                                        </BotaoSemBorda>
                                        <BotaoSemBorda 
                                            aoClicar={handleRemoveFoto}
                                            color="var(--error-color)"
                                        >
                                            <FaTrash />
                                        </BotaoSemBorda>
                                    </>
                                )}
                                <BotaoSemBorda 
                                    aoClicar={() => {
                                        if (window.handleShowImageModal) {
                                            window.handleShowImageModal();
                                        }
                                    }}
                                    color="var(--primary-color)"
                                >
                                    <FaEye />
                                </BotaoSemBorda>
                            </FotoAcoes>
                        </>
                    ) : (
                        <>
                            {ArmazenadorToken.hasPermission('change_admissao') && !modoLeitura ? (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFotoUpload}
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        id="candidato-foto-upload"
                                    />
                                    <UploadArea onClick={() => fileInputRef.current.click()}>
                                        {uploadingFoto ? (
                                            <div style={{
                                                border: '2px solid var(--primary-color)',
                                                borderTop: '2px solid transparent',
                                                borderRadius: '50%',
                                                width: '19px',
                                                height: '19px',
                                                animation: 'spin 1s linear infinite'
                                            }}></div>
                                        ) : (
                                            <UploadIcon>
                                                <RiUpload2Fill />
                                            </UploadIcon>
                                        )}
                                    </UploadArea>
                                </>
                            ) : (
                                <div style={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: '50%',
                                    background: 'var(--surface-200)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 19,
                                    color: 'var(--text-color-secondary)'
                                }}>
                                    <FaUser />
                                </div>
                            )}
                            <FotoInfo>
                                <FotoNome>Nenhuma foto enviada</FotoNome>
                                <FotoStatus>Clique para fazer upload</FotoStatus>
                            </FotoInfo>
                        </>
                    )}
                </FotoPreview>
            </FotoContainer>

            {/* Documentos Requeridos */}
            {(candidato?.documentos && candidato?.documentos.length > 0) ?
                <div>
                    {candidato?.documentos?.map((documento) => (
                        <DocumentoContainer key={documento.id}>
                            <DocumentoHeader>
                                <DocumentoTitulo>{documento.nome}</DocumentoTitulo>
                                <ObrigatorioTag data-isobrigatorio={documento.obrigatorio.toString()}>
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
    
        </>
    );
};

export default StepDocumentos; 