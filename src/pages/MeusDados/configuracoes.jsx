import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import BotaoVoltar from '@components/BotaoVoltar';
import Frame from '@components/Frame';
import Botao from '@components/Botao';
import BotaoGrupo from '@components/BotaoGrupo';
import { FaPlus } from 'react-icons/fa';
import DataTableEmails from '@components/DataTableEmails';
import ModalEmail from '@components/ModalEmail';
import { GrAddCircle } from 'react-icons/gr';
import http from '@http';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

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

function ConfiguracoesEmails() {
    const toast = useRef(null);
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editingEmail, setEditingEmail] = useState(null);
    const [isViewMode, setIsViewMode] = useState(false);
    const [emailToDelete, setEmailToDelete] = useState(null);

    const showSuccess = (message) => {
        toast.current.show({
            severity: 'success',
            summary: 'Sucesso',
            detail: message,
            life: 3000
        });
    };

    const showError = (message) => {
        toast.current.show({
            severity: 'error',
            summary: 'Erro',
            detail: message,
            life: 5000
        });
    };

    const showInfo = (message) => {
        toast.current.show({
            severity: 'info',
            summary: 'Informação',
            detail: message,
            life: 3000
        });
    };

    const fetchEmails = async () => {
        try {
            setLoading(true);
            const response = await http.get('email_templates/');
            if (response && Array.isArray(response)) {
                setEmails(response);
            }
        } catch (error) {
            console.error('Erro ao buscar templates de email:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmails();
    }, []);

    const handleOpenModal = (email = null, viewMode = false) => {
        setEditingEmail(email);
        setIsViewMode(viewMode);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingEmail(null);
        setIsViewMode(false);
    };

    const handleSave = async (emailData) => {
        try {
            const templateData = {
                name: emailData.name,
                subject: emailData.subject,
                body_html: emailData.body_html,
                body_text: emailData.body_text || null,
                is_active: emailData.is_active
            };

            console.log('Dados do template:', templateData);
            console.log('ID do template:', emailData.id);

            if (emailData.id) {
                // Atualizar email existente
                console.log('Atualizando template existente...');
                const response = await http.put(`email_templates/${emailData.id}/`, templateData);
                console.log('Resposta do PUT:', response);
                showSuccess('Template de email atualizado com sucesso!');
            } else {
                // Criar novo email
                console.log('Criando novo template...');
                const response = await http.post('email_templates/', templateData);
                console.log('Resposta do POST:', response);
                showSuccess('Template de email criado com sucesso!');
            }
            
            // Recarregar a lista após salvar
            await fetchEmails();
            handleCloseModal();
        } catch (error) {
            console.error('Erro detalhado ao salvar template de email:', error);
            console.error('Response data:', error.response?.data);
            console.error('Response status:', error.response?.status);
            
            let errorMessage = 'Erro ao salvar template de email';
            if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            showError(errorMessage);
        }
    };

    const handleDelete = async (email) => {
        setEmailToDelete(email);
        
        let message = `Tem certeza que deseja excluir o template "${email.name}"?`;
        if (email.is_active) {
            message += '\n\n⚠️ Este template está ativo. A exclusão pode afetar emails em uso.';
        }
        
        confirmDialog({
            message: message,
            header: 'Confirmar Exclusão',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => confirmDelete(),
            reject: () => setEmailToDelete(null)
        });
    };

    const confirmDelete = async () => {
        if (!emailToDelete) return;
        
        try {
            console.log('Excluindo template:', emailToDelete);
            const response = await http.delete(`email_templates/${emailToDelete.id}/`);
            console.log('Resposta do DELETE:', response);
            
            // Recarregar a lista após deletar
            await fetchEmails();
            showSuccess(`Template "${emailToDelete.name}" excluído com sucesso!`);
        } catch (error) {
            console.error('Erro detalhado ao excluir template de email:', error);
            console.error('Response data:', error.response?.data);
            console.error('Response status:', error.response?.status);
            
            let errorMessage = 'Erro ao excluir template de email';
            if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            showError(errorMessage);
        } finally {
            setEmailToDelete(null);
        }
    };

    return (
        <Frame gap="16px">
            <Toast ref={toast} />
            <ConfirmDialog />
            <Container>
                <Header>
                    <h3>Configurações de Emails</h3>
                    <BotaoGrupo>
                        <Botao size="small" aoClicar={() => handleOpenModal()}>
                            <GrAddCircle stroke="var(--secundaria)" /> Novo Modelo de Email
                        </Botao>
                    </BotaoGrupo>
                </Header>

                <DataTableEmails
                    emails={emails}
                    onEdit={(email) => handleOpenModal(email, false)}
                    onDelete={handleDelete}
                    onView={(email) => handleOpenModal(email, true)}
                    loading={loading}
                />

                <ModalEmail
                    opened={showModal}
                    aoFechar={handleCloseModal}
                    aoSalvar={handleSave}
                    email={editingEmail}
                    viewMode={isViewMode}
                />
            </Container>
        </Frame>
    );
}

export default ConfiguracoesEmails;