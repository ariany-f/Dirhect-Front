import React, { useState } from 'react';
import styled from 'styled-components';
import BotaoVoltar from '@components/BotaoVoltar';
import Frame from '@components/Frame';
import Botao from '@components/Botao';
import BotaoGrupo from '@components/BotaoGrupo';
import { FaPlus } from 'react-icons/fa';
import DataTableEmails from '@components/DataTableEmails';
import ModalEmail from '@components/ModalEmail';
import { GrAddCircle } from 'react-icons/gr';

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

function ConfiguracoesVagas() {
    const [emails, setEmails] = useState([
        {
            id: 1,
            nome: 'Email de Abertura de Vaga',
            assunto: 'Nova vaga aberta: {cargo}',
            corpo: 'Prezado(a) {nome},\n\nInformamos que uma nova vaga foi aberta para o cargo de {cargo}.\n\nAtenciosamente,\nEquipe de RH',
            gatilho: 'ABERTA',
        },
        {
            id: 2,
            nome: 'Email de Candidatura',
            assunto: 'Candidatura recebida - {cargo}',
            corpo: 'Prezado(a) {nome},\n\nRecebemos sua candidatura para a vaga de {cargo}.\n\nAtenciosamente,\nEquipe de RH',
            gatilho: 'CANDIDATURA',
        },
        {
            id: 3,
            nome: 'Email de Contratação',
            assunto: 'Parabéns! Você foi contratado(a)',
            corpo: 'Prezado(a) {nome},\n\nÉ com grande satisfação que informamos que você foi contratado(a) para a vaga de {cargo}.\n\nAtenciosamente,\nEquipe de RH',
            gatilho: 'CONTRATADO',
        },
        {
            id: 4,
            nome: 'Exame Médico',
            assunto: 'Exame Médico - {cargo}',
            corpo: 'Prezado(a) {nome},\n\nÉ com grande satisfação que informamos que você foi contratado(a) para a vaga de {cargo}.\n\nAtenciosamente,\nEquipe de RH',
            gatilho: 'ANEXAR EXAME MÉDICO',
        },
        {
            id: 5,
            nome: 'Oferta de Emprego',
            assunto: 'Oferta de Emprego - {cargo}',
            corpo: 'Prezado(a) {nome},\n\nÉ com grande satisfação que informamos que você foi contratado(a) para a vaga de {cargo}.\n\nAtenciosamente,\nEquipe de RH',
            gatilho: 'ENCAMINHADA',
        }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingEmail, setEditingEmail] = useState(null);
    const [isViewMode, setIsViewMode] = useState(false);

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

    const handleSave = (emailData) => {
        if (emailData.id) {
            setEmails(emails.map(email => 
                email.id === emailData.id ? emailData : email
            ));
        } else {
            setEmails([...emails, { ...emailData, id: Date.now() }]);
        }
        handleCloseModal();
    };

    const handleDelete = (email) => {
        if (window.confirm('Tem certeza que deseja excluir este email?')) {
            setEmails(emails.filter(e => e.id !== email.id));
        }
    };

    return (
        <Frame gap="16px">
            <BotaoVoltar linkFixo="/vagas" />
            <Container>
                <Header>
                    <h3>Configurações de Emails</h3>
                    <BotaoGrupo>
                        <Botao size="small" aoClicar={() => handleOpenModal()}>
                            <GrAddCircle stroke="white" /> Novo Email
                        </Botao>
                    </BotaoGrupo>
                </Header>

                <DataTableEmails
                    emails={emails}
                    onEdit={(email) => handleOpenModal(email, false)}
                    onDelete={handleDelete}
                    onView={(email) => handleOpenModal(email, true)}
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

export default ConfiguracoesVagas;