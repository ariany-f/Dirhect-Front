import React, { useEffect, useState, useRef } from 'react';
import { GrAddCircle } from 'react-icons/gr';
import Botao from '@components/Botao';
import BotaoGrupo from '@components/BotaoGrupo';
import DataTableDocumentosRequeridos from '@components/DataTableDocumentosRequeridos';
import ModalDocumentoRequerido from '@components/ModalDocumentoRequerido';
import http from '@http';
import styled from 'styled-components';
import Frame from '@components/Frame';
import BotaoVoltar from '@components/BotaoVoltar';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { addLocale } from 'primereact/api';
import { ArmazenadorToken } from '@utils';

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

function DocumentosConfiguracoes() {
    const [documentos, setDocumentos] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [documentoEditando, setDocumentoEditando] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        fetchDocumentos();
    }, []);

    addLocale('pt', {
        accept: 'Sim',
        reject: 'Não',
    });

    const fetchDocumentos = async () => {
        try {
            const response = await http.get('/documento_requerido/?format=json');
            setDocumentos(response);
        } catch (error) {
            console.error('Erro ao buscar documentos:', error);
        }
    };

    const handleSalvar = async (documento) => {
        try {
            if (documentoEditando) {
                await http.put(`/documento_requerido/${documentoEditando.id}/`, documento);
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Documento atualizado com sucesso!', life: 3000 });
            } else {
                await http.post('/documento_requerido/', documento);
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Documento criado com sucesso!', life: 3000 });
            }
            fetchDocumentos();
            setModalAberto(false);
        } catch (error) {
            console.error('Erro ao salvar documento:', error);
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao salvar documento.', life: 3000 });
        }
    };

    const handleDelete = async (documento) => {
        confirmDialog({
            message: `Você tem certeza que quer excluir o documento "${documento.nome}"?`,
            header: 'Confirmação de Exclusão',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim, Excluir',
            rejectLabel: 'Cancelar',
            accept: async () => {
                try {
                    await http.delete(`/documento_requerido/${documento.id}/`);
                    fetchDocumentos();
                    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Documento excluído com sucesso!', life: 3000 });
                } catch (error) {
                    console.error('Erro ao deletar documento:', error);
                    toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Não foi possível excluir o documento.', life: 3000 });
                }
            },
        });
    };

    return (
        <Frame gap="16px">
            <Toast ref={toast} />
            <ConfirmDialog />
            <BotaoVoltar />
            <Container>
                <Header>
                    <h3>Configurações de Documentos</h3>

                    {ArmazenadorToken.hasPermission('add_documentorequerido') && 
                    
                        <BotaoGrupo>
                            <Botao size="small" aoClicar={() => { setDocumentoEditando(null); setModalAberto(true); }}>
                                <GrAddCircle stroke="white" /> Novo Documento
                            </Botao>
                        </BotaoGrupo>
                    }
                </Header>
                <DataTableDocumentosRequeridos
                    documentos={documentos}
                    onEdit={doc => { setDocumentoEditando(doc); setModalAberto(true); }}
                    onDelete={handleDelete}
                />
                <ModalDocumentoRequerido
                    opened={modalAberto}
                    documento={documentoEditando}
                    aoFechar={() => setModalAberto(false)}
                    aoSalvar={handleSalvar}
                />
            </Container>
        </Frame>
    );
}

export default DocumentosConfiguracoes;
