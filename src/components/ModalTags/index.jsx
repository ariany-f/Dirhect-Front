import React, { useEffect, useState } from 'react';
import DropdownItens from '@components/DropdownItens';
import Botao from '@components/Botao';
import http from '@http';
import Frame from "@components/Frame";
import Titulo from "@components/Titulo";
import { RiCloseFill } from 'react-icons/ri';
import styled from "styled-components";
import { Overlay, DialogEstilizado } from '@components/Modal/styles';

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

function ModalTags({ opened = false, aoFechar, aoSalvar, tagSelecionada = null }) {
    const [tags, setTags] = useState([]);
    const [tagAtual, setTagAtual] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (opened) {
            setLoading(true);
            // Buscar tags disponíveis
            http.get('/documento_requerido_tag/')
                .then(response => {
                    const tagsFormatadas = response.map(tag => ({
                        name: tag.nome,
                        code: tag.id
                    }));
                    setTags(tagsFormatadas);
                    
                    // Se há uma tag já selecionada, define ela
                    if (tagSelecionada) {
                        const tagEncontrada = tagsFormatadas.find(t => t.code === tagSelecionada);
                        console.log('Tag pré-selecionada encontrada:', tagEncontrada);
                        setTagAtual(tagEncontrada || null);
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar tags:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [opened, tagSelecionada]);

    useEffect(() => {
        if (!opened) {
            setTagAtual(null);
        }
    }, [opened]);

    const handleSalvar = () => {
        aoSalvar(tagAtual?.code || null);
    };

    return (
        <>
            {opened && (
                <Overlay>
                    <DialogEstilizado open={opened} $width="500px">
                        <Frame>
                            <Titulo>
                                <button className="close" onClick={aoFechar}>
                                    <RiCloseFill size={20} className="fechar" />  
                                </button>
                                <h6>Selecionar Tag</h6>
                            </Titulo>
                        </Frame>
                        
                        <Frame padding="12px 0px">
                            <Col12>
                                <DropdownContainer>
                                    <DropdownItens
                                        name="tag"
                                        label="Tag"
                                        valor={tagAtual}
                                        setValor={setTagAtual}
                                        options={tags}
                                        placeholder={loading ? "Carregando tags..." : "Selecione uma tag"}
                                        filter
                                        disabled={loading}
                                    />
                                    <small style={{ color: '#6c757d', marginTop: '4px', display: 'block' }}>
                                        Selecione uma tag para preencher automaticamente os documentos requeridos da vaga.
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

