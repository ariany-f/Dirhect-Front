import React, { useEffect, useState, useMemo } from 'react';
import { Dialog } from 'primereact/dialog';
import CampoTexto from '@components/CampoTexto';
import CampoTags from '@components/CampoTags';
import { Dropdown } from 'primereact/dropdown';
import SwitchInput from '@components/SwitchInput';
import Botao from '@components/Botao';
import { FaSave } from 'react-icons/fa';
import http from '@http';
import Frame from "@components/Frame"
import Titulo from "@components/Titulo"
import { RiCloseFill } from 'react-icons/ri'
import styled from "styled-components"
import styles from './ModalDocumentoRequerido.module.css'
import { Overlay, DialogEstilizado } from '@components/Modal/styles'

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 16px;
    padding: 16px;
    width: 100%;
`

const Col6 = styled.div`
    flex: 1 1 calc(50% - 8px);
`

const Col6Centered = styled.div`
    display: flex;
    flex: 1 1 calc(50% - 8px);
    justify-content: start;
    padding-top: 14px;
    align-items: center;
`

const Col4 = styled.div`
    flex: 1 1 calc(33.333% - 11px);
`

const Col3 = styled.div`
    flex: 1 1 calc(33.333% - 11px);
`

function ModalDocumentoRequerido({ opened = false, aoFechar, aoSalvar, documento = null }) {
    const [classError, setClassError] = useState([]);
    const [nome, setNome] = useState('');
    const [extPermitidas, setExtPermitidas] = useState('');
    const [extTags, setExtTags] = useState([]);
    const [camposRequeridosTags, setCamposRequeridosTags] = useState([]);
    const [frenteVerso, setFrenteVerso] = useState(false);
    const [instrucao, setInstrucao] = useState('');
    const [descricao, setDescricao] = useState('');
    const [obrigatorio, setObrigatorio] = useState(true);
    const [documentosRequeridos, setDocumentosRequeridos] = useState([]);
    const [documentoSelecionado, setDocumentoSelecionado] = useState(null);
    const [tags, setTags] = useState([]);
    const [tagsDisponiveis, setTagsDisponiveis] = useState([]);

    // Opções de extensões comuns
    const extensoesComuns = useMemo(() => [
        { name: 'PDF', code: 'pdf' },
        { name: 'PNG', code: 'png' },
        { name: 'JPG', code: 'jpg' },
        { name: 'JPEG', code: 'jpeg' },
        { name: 'GIF', code: 'gif' },
        { name: 'BMP', code: 'bmp' },
        { name: 'TIFF', code: 'tiff' },
        { name: 'DOC', code: 'doc' },
        { name: 'DOCX', code: 'docx' },
        { name: 'XLS', code: 'xls' },
        { name: 'XLSX', code: 'xlsx' },
        { name: 'PPT', code: 'ppt' },
        { name: 'PPTX', code: 'pptx' },
        { name: 'TXT', code: 'txt' },
        { name: 'RTF', code: 'rtf' },
        { name: 'ZIP', code: 'zip' },
        { name: 'RAR', code: 'rar' },
        { name: '7Z', code: '7z' }
    ], []);

    // Opções de campos requeridos organizados por categoria
    const camposRequeridos = useMemo(() => [
        // FGTS
        { name: 'Data de Opção FGTS', code: 'dt_opcao_fgts', categoria: 'FGTS' },
        { name: 'Código Situação FGTS', code: 'codigo_situacao_fgts', categoria: 'FGTS' },
        
        // CNH
        { name: 'Carteira de Motorista', code: 'carteira_motorista', categoria: 'CNH' },
        { name: 'Tipo Carteira Habilitação', code: 'tipo_carteira_habilit', categoria: 'CNH' },
        { name: 'Data Vencimento Habilitação', code: 'data_venc_habilit', categoria: 'CNH' },
        { name: 'Data Emissão CNH', code: 'data_emissao_cnh', categoria: 'CNH' },
        
        // CTPS
        { name: 'Carteira de Trabalho', code: 'carteira_trabalho', categoria: 'CTPS' },
        { name: 'Série Carteira Trabalho', code: 'serie_carteira_trab', categoria: 'CTPS' },
        { name: 'UF Carteira Trabalho', code: 'uf_carteira_trab', categoria: 'CTPS' },
        { name: 'Data Emissão CTPS', code: 'data_emissao_ctps', categoria: 'CTPS' },
        { name: 'Data Vencimento CTPS', code: 'data_venc_ctps', categoria: 'CTPS' },
        
        // TÍTULO DE ELEITOR
        { name: 'Título de Eleitor', code: 'titulo_eleitor', categoria: 'TÍTULO DE ELEITOR' },
        { name: 'Zona Título Eleitor', code: 'zona_titulo_eleitor', categoria: 'TÍTULO DE ELEITOR' },
        { name: 'Data Título Eleitor', code: 'data_titulo_eleitor', categoria: 'TÍTULO DE ELEITOR' },
        { name: 'Seção Título Eleitor', code: 'secao_titulo_eleitor', categoria: 'TÍTULO DE ELEITOR' },
        { name: 'Estado Emissor Título Eleitor', code: 'estado_emissor_tit_eleitor', categoria: 'TÍTULO DE ELEITOR' },
        
        // RG
        { name: 'Identidade', code: 'identidade', categoria: 'RG' },
        { name: 'UF Identidade', code: 'uf_identidade', categoria: 'RG' },
        { name: 'Órgão Emissor Identidade', code: 'orgao_emissor_ident', categoria: 'RG' },
        { name: 'Data Emissão Identidade', code: 'data_emissao_ident', categoria: 'RG' }
    ], []);

    useEffect(() => {
        if (opened) {
            http.get('/documento_requerido/')
                .then(response => {
                    setDocumentosRequeridos(response);
                })
                .catch(error => {
                    console.error('Erro ao buscar documentos requeridos:', error);
                });
            
            // Buscar tags disponíveis
            http.get('/documento_requerido_tag/')
                .then(response => {
                    const tagsFormatadas = response.map(tag => ({
                        name: tag.nome,
                        code: tag.id.toString(),
                        id: tag.id
                    }));
                    setTagsDisponiveis(tagsFormatadas);
                })
                .catch(error => {
                    console.error('Erro ao buscar tags:', error);
                });
        }
    }, [opened]);

    useEffect(() => {
        if (documento && opened) {
            // Converter string de extensões para array de tags
            let extTagsArray = [];
            if (documento.ext_permitidas) {
                const extensoes = documento.ext_permitidas.split(',').map(ext => ext.trim().toLowerCase());
                extTagsArray = extensoes.map(ext => {
                    const opcao = extensoesComuns.find(opt => opt.code === ext);
                    return opcao || { name: ext.toUpperCase(), code: ext };
                });
            }
            
            // Converter campos requeridos para array de tags
            let camposTagsArray = [];
            if (documento.campos_requeridos) {
                try {
                    const camposObj = typeof documento.campos_requeridos === 'string' 
                        ? JSON.parse(documento.campos_requeridos) 
                        : documento.campos_requeridos;
                    
                    const camposArray = Object.keys(camposObj).filter(key => camposObj[key] === true);
                    camposTagsArray = camposArray.map(campo => {
                        const opcao = camposRequeridos.find(opt => opt.code === campo);
                        return opcao || { name: campo, code: campo };
                    });
                } catch (error) {
                    console.error('Erro ao parsear campos_requeridos:', error);
                }
            }

            // Converter tags para array
            let tagsArray = [];
            if (documento.tags) {
                try {
                    const tagsData = typeof documento.tags === 'string' 
                        ? JSON.parse(documento.tags) 
                        : documento.tags;
                    
                    if (Array.isArray(tagsData)) {
                        tagsArray = tagsData.map(tagId => {
                            const opcao = tagsDisponiveis.find(opt => opt.id === tagId);
                            return opcao || { name: `Tag ${tagId}`, code: tagId.toString(), id: tagId };
                        });
                    }
                } catch (error) {
                    console.error('Erro ao parsear tags:', error);
                }
            }
            
            // Atualizar todos os estados de uma vez
            setNome(documento.nome || '');
            setExtPermitidas(documento.ext_permitidas || '');
            setExtTags(extTagsArray);
            setCamposRequeridosTags(camposTagsArray);
            setTags(tagsArray);
            setFrenteVerso(!!documento.frente_verso);
            setInstrucao(documento.instrucao || '');
            setDescricao(documento.descricao || '');
            setObrigatorio(!!documento.obrigatorio);
            setDocumentoSelecionado(documento);
        } else if (!opened) {
            // Resetar todos os estados de uma vez
            setNome('');
            setExtPermitidas('');
            setExtTags([]);
            setCamposRequeridosTags([]);
            setTags([]);
            setFrenteVerso(false);
            setInstrucao('');
            setDescricao('');
            setObrigatorio(true);
            setDocumentoSelecionado(null);
            setClassError([]);
        }
    }, [documento, opened, extensoesComuns, camposRequeridos, tagsDisponiveis]);

    const validarESalvar = () => {
        let errors = [];
        if (!nome) errors.push('nome');
        if (extTags.length === 0) errors.push('ext_permitidas');
        if (!instrucao) errors.push('instrucao');
        
        if (errors.length > 0) {
            setClassError(errors);
            return;
        }

        // Converter tags para string separada por vírgula
        const extPermitidasString = extTags.map(tag => tag.code).join(',');

        // Converter campos requeridos para objeto
        const camposRequeridosObj = {};
        camposRequeridos.forEach(campo => {
            camposRequeridosObj[campo.code] = camposRequeridosTags.some(tag => tag.code === campo.code);
        });

        // Converter tags para array de IDs
        const tagsIds = tags.map(tag => tag.id);

        aoSalvar({ 
            nome,
            ext_permitidas: extPermitidasString,
            campos_requeridos: camposRequeridosObj,
            tags: tagsIds,
            frente_verso: frenteVerso,
            instrucao,
            descricao
        });
    };

    const handleFrenteVersoChange = (value) => {
        setFrenteVerso(value);
    };

    const handleObrigatorioChange = (value) => {
        setObrigatorio(value);
    };

    const handleTagsChange = async (value) => {
        // Se a última tag adicionada não existe nas opções (é nova)
        if (value.length > tags.length) {
            const novaTag = value[value.length - 1];
            
            // Verificar se a tag já existe nas opções disponíveis
            const tagExiste = tagsDisponiveis.some(t => 
                t.name.toLowerCase() === novaTag.name.toLowerCase()
            );
            
            if (!tagExiste) {
                try {
                    // Criar nova tag na API
                    const response = await http.post('/documento_requerido_tag/', {
                        nome: novaTag.name
                    });
                    
                    // Adicionar a nova tag às opções disponíveis
                    const novaTagFormatada = {
                        name: response.nome,
                        code: response.id.toString(),
                        id: response.id
                    };
                    
                    setTagsDisponiveis(prev => [...prev, novaTagFormatada]);
                    
                    // Atualizar o valor com a tag formatada
                    const novasTagsAtualizadas = [...value];
                    novasTagsAtualizadas[value.length - 1] = novaTagFormatada;
                    setTags(novasTagsAtualizadas);
                } catch (error) {
                    console.error('Erro ao criar nova tag:', error);
                    // Em caso de erro, manter a tag como está
                    setTags(value);
                }
            } else {
                setTags(value);
            }
        } else {
            setTags(value);
        }
    };

    return (
        <>
            {opened && (
                <Overlay>
                    <DialogEstilizado open={opened} $width="90vw">
                        <Frame>
                            <Titulo>
                                <button className="close" onClick={aoFechar}>
                                    <RiCloseFill size={20} className="fechar" />  
                                </button>
                                <h6>{documento ? 'Editar Documento' : 'Novo Documento'}</h6>
                            </Titulo>
                        </Frame>
                        
                        <Frame padding="12px 0px">
                            {/* Primeira linha: Nome, Instrução e Descrição */}
                            <Col12>
                                <Col3>
                                    <CampoTexto
                                        camposVazios={classError.includes('nome') ? ['nome'] : []}
                                        name="nome"
                                        valor={nome}
                                        setValor={setNome}
                                        type="text"
                                        label="Nome*"
                                        placeholder="Digite o nome do documento"
                                    />
                                </Col3>
                                <Col3>
                                    <CampoTexto
                                        camposVazios={classError.includes('instrucao') ? ['instrucao'] : []}
                                        name="instrucao"
                                        valor={instrucao}
                                        setValor={setInstrucao}
                                        type="text"
                                        label="Instrução*"
                                        placeholder="Digite a instrução"
                                    />
                                </Col3>
                                <Col3>
                                    <CampoTexto
                                        name="descricao"
                                        valor={descricao}
                                        setValor={setDescricao}
                                        type="text"
                                        label="Descrição"
                                        placeholder="Digite a descrição"
                                    />
                                </Col3>
                            </Col12>
                            
                            {/* Segunda linha: Extensões Permitidas, Campos Requeridos e Tags */}
                            <Col12>
                                <Col3>
                                    <CampoTags
                                        camposVazios={classError.includes('ext_permitidas') ? ['ext_permitidas'] : []}
                                        name="ext_permitidas"
                                        value={extTags}
                                        onChange={setExtTags}
                                        options={extensoesComuns}
                                        label="Extensões Permitidas*"
                                        placeholder="Digite para buscar extensões..."
                                        required={true}
                                    />
                                    <small style={{ color: '#6c757d', marginTop: '4px', display: 'block' }}>
                                        Selecione as extensões de arquivo permitidas.
                                    </small>
                                </Col3>
                                <Col3>
                                    <CampoTags
                                        name="campos_requeridos"
                                        value={camposRequeridosTags}
                                        onChange={setCamposRequeridosTags}
                                        options={camposRequeridos}
                                        label="Campos Requeridos"
                                        placeholder="Digite para buscar campos..."
                                    />
                                    <small style={{ color: '#6c757d', marginTop: '4px', display: 'block' }}>
                                        Campos que devem ser preenchidos.
                                    </small>
                                </Col3>
                                <Col3>
                                    <CampoTags
                                        name="tags"
                                        value={tags}
                                        onChange={handleTagsChange}
                                        options={tagsDisponiveis}
                                        label="Tags"
                                        placeholder="Digite para buscar ou criar tags..."
                                        allowCustomTags={true}
                                    />
                                    <small style={{ color: '#6c757d', marginTop: '4px', display: 'block' }}>
                                        Tags ou crie novas (pressione Enter).
                                    </small>
                                </Col3>
                            </Col12>
                            
                            {/* Terceira linha: Frente e Verso */}
                            <Col12>
                                <Col6Centered>
                                    <label style={{ fontWeight: 600, marginRight: 8 }}>Frente e Verso</label>
                                    <SwitchInput 
                                        checked={frenteVerso} 
                                        onChange={handleFrenteVersoChange}
                                    />
                                </Col6Centered>
                            </Col12>
                        </Frame>
                        
                        <div className={styles.containerBottom}>
                            <Botao 
                                aoClicar={validarESalvar} 
                                estilo="vermilion" 
                                size="medium" 
                                filled
                            >
                                {documento ? 'Atualizar' : 'Confirmar'}
                            </Botao>
                        </div>
                    </DialogEstilizado>
                </Overlay>
            )}
        </>
    );
}

export default ModalDocumentoRequerido;
