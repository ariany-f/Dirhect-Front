import React, { useEffect, useState } from 'react';
import { GrAddCircle } from 'react-icons/gr';
import Botao from '@components/Botao';
import BotaoGrupo from '@components/BotaoGrupo';
import DataTableDocumentosRequeridos from '@components/DataTableDocumentosRequeridos';
import ModalDocumentoRequerido from '@components/ModalDocumentoRequerido';
import http from '@http';
import styled from 'styled-components';
import Frame from '@components/Frame';
import BotaoVoltar from '@components/BotaoVoltar';

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

    useEffect(() => {
        fetchDocumentos();
    }, []);

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
            } else {
                await http.post('/documento_requerido/', documento);
            }
            fetchDocumentos();
            setModalAberto(false);
        } catch (error) {
            console.error('Erro ao salvar documento:', error);
        }
    };

    const handleDelete = async (documento) => {
        try {
            await http.delete(`/documento_requerido/${documento.id}/`);
            fetchDocumentos();
        } catch (error) {
            console.error('Erro ao deletar documento:', error);
        }
    };

    return (
        <Frame gap="16px">
            <BotaoVoltar />
            <Container>
                <Header>
                    <h3>Configurações de Documentos</h3>
                    <BotaoGrupo>
                        <Botao size="small" aoClicar={() => { setDocumentoEditando(null); setModalAberto(true); }}>
                            <GrAddCircle stroke="white" /> Novo Documento
                        </Botao>
                    </BotaoGrupo>
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
