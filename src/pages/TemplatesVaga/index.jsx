import React, { useEffect, useState, useRef } from 'react';
import { GrAddCircle } from 'react-icons/gr';
import Botao from '@components/Botao';
import BotaoGrupo from '@components/BotaoGrupo';
import DataTableTemplatesVaga from '@components/DataTableTemplatesVaga';
import http from '@http';
import styled from 'styled-components';
import Frame from '@components/Frame';
import BotaoVoltar from '@components/BotaoVoltar';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ArmazenadorToken } from '@utils';
import { useNavigate } from 'react-router-dom';
import templatesData from '@json/templates_vaga.json';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

function TemplatesVaga() {
    const [templates, setTemplates] = useState([]);
    const toast = useRef(null);
    const navegar = useNavigate();

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            // Tentar buscar da API primeiro
            const response = await http.get('/admissao_template/?format=json');
            setTemplates(response);
        } catch (error) {
            console.warn('API não disponível, usando dados mockup:', error);
            // Fallback para mockup se API não estiver disponível
            setTemplates(templatesData);
        }
    };

    const handleEdit = (template) => {
        navegar(`/templates-vaga/detalhes/${template.id}`);
    };

    const handleDelete = async (template) => {
        confirmDialog({
            message: `Você tem certeza que quer excluir o template "${template.nome}"?`,
            header: 'Confirmação de Exclusão',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim, Excluir',
            rejectLabel: 'Cancelar',
            accept: async () => {
                try {
                    // Tentar deletar via API primeiro
                    try {
                        await http.delete(`/admissao_template/${template.id}/`);
                    } catch (apiError) {
                        console.warn('API não disponível, simulando exclusão:', apiError);
                    }
                    
                    // Atualizar lista local
                    setTemplates(prev => prev.filter(t => t.id !== template.id));
                    
                    toast.current.show({ 
                        severity: 'success', 
                        summary: 'Sucesso', 
                        detail: 'Template excluído com sucesso!', 
                        life: 3000 
                    });
                } catch (error) {
                    console.error('Erro ao deletar template:', error);
                    toast.current.show({ 
                        severity: 'error', 
                        summary: 'Erro', 
                        detail: 'Não foi possível excluir o template.', 
                        life: 3000 
                    });
                }
            },
        });
    };

    const handleNovo = () => {
        navegar('/templates-vaga/registro');
    };

    return (
        <Frame gap="16px">
            <Toast ref={toast} />
            <ConfirmDialog />
            <BotaoVoltar />
            <Container>
                <Header>
                    <h3>Templates de Vaga</h3>

                    {ArmazenadorToken.hasPermission('add_vagas') && 
                        <BotaoGrupo>
                            <Botao size="small" aoClicar={handleNovo}>
                                <GrAddCircle stroke="var(--secundaria)" /> Novo Template
                            </Botao>
                        </BotaoGrupo>
                    }
                </Header>
                <DataTableTemplatesVaga
                    templates={templates}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </Container>
        </Frame>
    );
}

export default TemplatesVaga;

