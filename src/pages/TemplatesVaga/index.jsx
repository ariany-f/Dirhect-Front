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
            // TODO: Quando a API estiver pronta, substituir por:
            // const response = await http.get('/template_vaga/?format=json');
            // setTemplates(response);
            
            // Por enquanto, usar mockup
            setTemplates(templatesData);
        } catch (error) {
            console.error('Erro ao buscar templates:', error);
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
                    // TODO: Quando a API estiver pronta, substituir por:
                    // await http.delete(`/template_vaga/${template.id}/`);
                    
                    // Por enquanto, apenas simular exclusão
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

