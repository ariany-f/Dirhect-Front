import React, { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import Botao from '@components/Botao';
import Frame from "@components/Frame";
import Titulo from "@components/Titulo";
import { RiCloseFill } from 'react-icons/ri';
import styled from "styled-components";
import { Overlay, DialogEstilizado } from '@components/Modal/styles';
import templatesData from '@json/templates_vaga.json';

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

    useEffect(() => {
        if (opened) {
            // Buscar templates disponíveis do mockup
            // TODO: Quando a API estiver pronta, substituir por:
            // http.get('/template_vaga/')
            const templatesFormatados = templatesData.map(template => ({
                label: template.nome,
                value: template.id,
                descricao: template.descricao
            }));
            setTemplates(templatesFormatados);
            
            // Se há um template já selecionado, define ele
            if (templateSelecionado) {
                const templateEncontrado = templatesFormatados.find(t => t.value === templateSelecionado);
                setTemplateAtual(templateEncontrado || null);
            }
        }
    }, [opened, templateSelecionado]);

    useEffect(() => {
        if (!opened) {
            setTemplateAtual(null);
        }
    }, [opened]);

    const handleSalvar = () => {
        aoSalvar(templateAtual?.value || null);
    };

    const templateTemplate = (option) => {
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
                                    <Label>Template de Admissão</Label>
                                    <Dropdown
                                        value={templateAtual}
                                        onChange={(e) => setTemplateAtual(e.value)}
                                        options={templates}
                                        optionLabel="label"
                                        itemTemplate={templateTemplate}
                                        placeholder="Selecione um template"
                                        filter
                                        showClear
                                        style={{ width: '100%' }}
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

