import React, { useEffect, useState, useRef } from 'react';
import CampoTags from '@components/CampoTags';
import Botao from '@components/Botao';
import http from '@http';
import Frame from "@components/Frame";
import Titulo from "@components/Titulo";
import { RiCloseFill } from 'react-icons/ri';
import styled from "styled-components";
import { Overlay, DialogEstilizado } from '@components/Modal/styles';
import { Toast } from 'primereact/toast';

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 16px;
    padding: 16px;
    width: 100%;
`;

const DropdownContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Label = styled.label`
    font-size: 12px;
    font-weight: 700;
    color: var(--neutro-600);
    margin-bottom: 4px;
    display: block;
`;

function ModalTags({ opened = false, aoFechar, aoSalvar, tagsSelecionadas = [] }) {
    const [tagsDisponiveis, setTagsDisponiveis] = useState([]);
    const [tagsSelecionadasAtual, setTagsSelecionadasAtual] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingTag, setLoadingTag] = useState(false);
    const toast = useRef(null);
    const processingTagRef = useRef(false);
    const tempTagCodeRef = useRef(null);

    useEffect(() => {
        if (opened) {
            setLoading(true);
            // Buscar tags disponíveis
            http.get('/documento_requerido_tag/')
                .then(response => {
                    const tagsFormatadas = response.map(tag => ({
                        name: tag.nome,
                        code: tag.id.toString(),
                        id: tag.id
                    }));
                    setTagsDisponiveis(tagsFormatadas);
                    
                    // Se há tags já selecionadas, define elas
                    if (tagsSelecionadas && tagsSelecionadas.length > 0) {
                        const tagsEncontradas = tagsSelecionadas.map(tagId => {
                            const tagEncontrada = tagsFormatadas.find(t => t.id === tagId);
                            return tagEncontrada;
                        }).filter(t => t !== undefined);
                        console.log('Tags pré-selecionadas encontradas:', tagsEncontradas);
                        setTagsSelecionadasAtual(tagsEncontradas);
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar tags:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [opened, tagsSelecionadas]);

    useEffect(() => {
        if (!opened) {
            setTagsSelecionadasAtual([]);
        }
    }, [opened]);

    const handleTagsChange = async (value) => {
        // Se a última tag adicionada não existe nas opções (é nova)
        if (value.length > tagsSelecionadasAtual.length) {
            const novaTag = value[value.length - 1];
            
            // Verificar se a tag já existe nas opções disponíveis
            const tagExiste = tagsDisponiveis.some(t => 
                t.name.toLowerCase() === novaTag.name.toLowerCase() ||
                (t.id && novaTag.id && t.id === novaTag.id)
            );
            
            if (!tagExiste && (!novaTag.id || novaTag.id === novaTag.name)) {
                // Verificar se já está processando para evitar duplicação
                if (processingTagRef.current) {
                    return;
                }
                
                // É uma tag nova que precisa ser criada na API
                processingTagRef.current = true;
                
                // OPTIMISTIC UPDATE
                const tempCode = `temp_${Date.now()}`;
                tempTagCodeRef.current = tempCode;
                
                const tagTemporaria = {
                    name: novaTag.name,
                    code: tempCode,
                    id: tempCode,
                    _isLoading: true
                };
                
                const tagsComTemporaria = [...tagsSelecionadasAtual, tagTemporaria];
                setTagsSelecionadasAtual(tagsComTemporaria);
                setLoadingTag(true);
                
                try {
                    // Criar nova tag na API
                    const response = await http.post('/documento_requerido_tag/', {
                        nome: novaTag.name
                    });
                    
                    // Criar tag formatada com dados da API
                    const novaTagFormatada = {
                        name: response.nome,
                        code: response.id.toString(),
                        id: response.id
                    };
                    
                    // Adicionar a nova tag às opções disponíveis
                    setTagsDisponiveis(prev => [...prev, novaTagFormatada]);
                    
                    // Substituir a tag temporária pela tag real
                    const tempCodeToReplace = tempTagCodeRef.current;
                    
                    setTagsSelecionadasAtual(currentTags => {
                        const tagsAtualizadas = currentTags.map(t => {
                            const ehTemporaria = t.code === tempCodeToReplace;
                            return ehTemporaria ? novaTagFormatada : t;
                        });
                        
                        tempTagCodeRef.current = null;
                        return tagsAtualizadas;
                    });
                    
                } catch (error) {
                    console.error('Erro ao criar nova tag:', error);
                    
                    // ROLLBACK
                    setTagsSelecionadasAtual(currentTags => {
                        const tagsSemTemporaria = currentTags.filter(t => !t._isLoading);
                        return tagsSemTemporaria;
                    });
                    
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Erro ao criar nova tag',
                        life: 3000
                    });
                } finally {
                    setLoadingTag(false);
                    processingTagRef.current = false;
                }
            } else {
                setTagsSelecionadasAtual(value);
            }
        } else {
            setTagsSelecionadasAtual(value);
        }
    };

    const handleSalvar = () => {
        const tagsIds = tagsSelecionadasAtual.map(tag => tag.id);
        aoSalvar(tagsIds);
    };

    return (
        <>
            <Toast ref={toast} />
            {opened && (
                <Overlay>
                    <DialogEstilizado open={opened} $width="600px">
                        <Frame>
                            <Titulo>
                                <button className="close" onClick={aoFechar}>
                                    <RiCloseFill size={20} className="fechar" />  
                                </button>
                                <h6>Selecionar Tags</h6>
                            </Titulo>
                        </Frame>
                        
                        <Frame padding="12px 0px">
                            <Col12>
                                <DropdownContainer>
                                    <CampoTags
                                        name="tags"
                                        value={tagsSelecionadasAtual}
                                        onChange={handleTagsChange}
                                        options={tagsDisponiveis}
                                        label="Tags"
                                        placeholder={loadingTag ? "Criando tag..." : loading ? "Carregando tags..." : "Digite para buscar ou criar tags..."}
                                        allowCustomTags={true}
                                        disabled={loading || loadingTag}
                                    />
                                    <small style={{ color: loadingTag ? '#0ea5e9' : '#6c757d', marginTop: '4px', display: 'block', fontWeight: loadingTag ? 600 : 400 }}>
                                        {loadingTag ? '⏳ Criando tag na API...' : 'Selecione tags para preencher automaticamente os documentos requeridos da vaga.'}
                                    </small>
                                </DropdownContainer>
                            </Col12>
                        </Frame>
                        
                        <div style={{ padding: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <Botao 
                                aoClicar={aoFechar} 
                                estilo="neutro" 
                                size="medium"
                            >
                                Cancelar
                            </Botao>
                            <Botao 
                                aoClicar={handleSalvar} 
                                estilo="vermilion" 
                                size="medium" 
                                filled
                                disabled={loadingTag}
                            >
                                Confirmar
                            </Botao>
                        </div>
                    </DialogEstilizado>
                </Overlay>
            )}
        </>
    );
}

export default ModalTags;

