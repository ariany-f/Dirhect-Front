import React, { useEffect, useState } from 'react';
import DropdownItens from '@components/DropdownItens';
import Botao from '@components/Botao';
import Frame from "@components/Frame";
import Titulo from "@components/Titulo";
import { RiCloseFill } from 'react-icons/ri';
import styled from "styled-components";
import { Overlay, DialogEstilizado } from '@components/Modal/styles';
import templatesData from '@json/templates_vaga.json';
import http from '@http';

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

const InfoBox = styled.div`
    background: #f0f9ff;
    border: 1px solid #0ea5e9;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 16px;
    
    h6 {
        margin: 0 0 8px 0;
        color: #0369a1;
        font-size: 14px;
        font-weight: 600;
    }
    
    p {
        margin: 4px 0;
        color: #0c4a6e;
        font-size: 13px;
        line-height: 1.5;
    }
`;

function ModalTemplateVaga({ opened = false, aoFechar, aoSalvar, templateSelecionado = null }) {
    const [templates, setTemplates] = useState([]);
    const [templateAtual, setTemplateAtual] = useState(null);
    const [loading, setLoading] = useState(false);
    const [templatesCarregados, setTemplatesCarregados] = useState(false);

    // Carregar templates quando o modal abre
    useEffect(() => {
        if (opened && !templatesCarregados) {
            fetchTemplates();
        }
    }, [opened, templatesCarregados]);

    // Selecionar template pré-selecionado após templates carregados
    useEffect(() => {
        if (templates.length > 0 && opened) {
            if (templateSelecionado) {
                console.log('Buscando template selecionado:', templateSelecionado);
                console.log('Templates disponíveis:', templates);
                const templateEncontrado = templates.find(t => t.value === templateSelecionado);
                console.log('Template encontrado:', templateEncontrado);
                if (templateEncontrado) {
                    setTemplateAtual(templateEncontrado);
                }
            } else {
                // Se não há template selecionado, limpa
                setTemplateAtual(null);
            }
        }
    }, [templates, templateSelecionado, opened]);


    const fetchTemplates = async (forceReload = false) => {
        // Se já carregou e não é reload forçado, não busca novamente
        if (templatesCarregados && !forceReload) {
            return;
        }

        setLoading(true);
        let templatesFormatados = [];
        
        try {
            // Tentar buscar da API primeiro
            const response = await http.get('/admissao_template/?format=json');
            templatesFormatados = response.map(template => ({
                label: template.nome,
                value: template.id,
                descricao: template.descricao
            }));
        } catch (error) {
            console.warn('API não disponível, usando dados mockup:', error);
            // Fallback para mockup se API não estiver disponível
            templatesFormatados = templatesData.map(template => ({
                label: template.nome,
                value: template.id,
                descricao: template.descricao
            }));
            
            // Selecionar automaticamente a primeira opção quando usar fallback
            if (templatesFormatados.length > 0 && !templateSelecionado) {
                setTemplateAtual(templatesFormatados[0]);
            }
        }
        
        setTemplates(templatesFormatados);
        setTemplatesCarregados(true);
        setLoading(false);
    };

    useEffect(() => {
        if (!opened) {
            setTemplateAtual(null);
            setLoading(false);
        }
    }, [opened]);

    const handleSalvar = () => {
        console.log('handleSalvar - templateAtual:', templateAtual);
        console.log('handleSalvar - enviando value:', templateAtual);
        aoSalvar(templateAtual || null);
    };

    const templateTemplate = (option) => {
        if (!option) return null;
        
        return (
            <div>
                <div style={{ fontWeight: 600 }}>{option.label}</div>
                {option.descricao && (
                    <div style={{ fontSize: '12px', color: '#6c757d' }}>{option.descricao}</div>
                )}
            </div>
        );
    };

    return (
        <>
            {opened && (
                <Overlay>
                    <DialogEstilizado open={opened} $width="600px">
                        <Frame>
                            <Titulo>
                                <button className="close" onClick={aoFechar}>
                                    <RiCloseFill size={20} className="fechar" />  
                                </button>
                                <h6>Vincular Template de Admissão</h6>
                            </Titulo>
                        </Frame>
                        
                        <Frame padding="12px 0px">
                            <Col12>
                                <InfoBox>
                                    <h6>ℹ️ Como funciona?</h6>
                                    <p><strong>O que é:</strong> Templates de Admissão são configurações pré-definidas que serão aplicadas automaticamente aos candidatos aprovados desta vaga.</p>
                                    <p><strong>Quando usar:</strong> Vincule um template quando você deseja que todos os candidatos desta vaga sigam as mesmas configurações contratuais (tipo de admissão, regime, FGTS, etc).</p>
                                    <p><strong>Benefício:</strong> Economiza tempo ao padronizar o processo de admissão e garante consistência nos dados contratuais.</p>
                                </InfoBox>
                                
                                <DropdownContainer>
                                    <DropdownItens
                                        name="template_admissao"
                                        label="Template de Admissão"
                                        valor={templateAtual}
                                        setValor={setTemplateAtual}
                                        options={templates}
                                        optionLabel="label"
                                        optionTemplate={templateTemplate}
                                        placeholder={
                                            loading ? "Carregando templates..." : 
                                            templates.length === 0 ? "Nenhum template disponível" :
                                            "Selecione um template"
                                        }
                                        filter
                                        disabled={loading}
                                    />
                                    <small style={{ color: '#6c757d', marginTop: '4px', display: 'block' }}>
                                        Selecione o template que será aplicado aos candidatos aprovados desta vaga.
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

export default ModalTemplateVaga;

