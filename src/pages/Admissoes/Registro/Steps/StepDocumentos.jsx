import React from 'react';
import { useCandidatoContext } from '@contexts/Candidato';
import CampoArquivo from '@components/CampoArquivo';
import BotaoSemBorda from '@components/BotaoSemBorda';
import styled from 'styled-components';
import http from '@http';
import { useRef } from 'react';
import { FaCheck, FaFile, FaEye } from 'react-icons/fa';
import Texto from '@components/Texto';
import { buscarDadosOCR } from '@utils/ocr';
import { useMemo } from 'react';

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
    background-color: ${props => props['data-isobrigatorio'] === 'true' ? 'var(--error-100)' : 'var(--surface-100)'};
    color: ${props => props['data-isobrigatorio'] === 'true' ? 'var(--error-600)' : 'var(--text-color-secondary)'};
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
    const { candidato, updateArrayItem, setCampo } = useCandidatoContext();

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
            if (import.meta.env.VITE_BUSCAR_DADOS_OCR === 'true') {
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

    return (
        <div data-tour="panel-step-0">
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
    );
};

export default StepDocumentos; 