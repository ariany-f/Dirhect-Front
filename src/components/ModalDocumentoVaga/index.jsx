import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import CampoTexto from '@components/CampoTexto';
import { Dropdown } from 'primereact/dropdown';
import SwitchInput from '@components/SwitchInput';
import Botao from '@components/Botao';
import { FaSave } from 'react-icons/fa';
import http from '@http';
import Frame from "@components/Frame"
import Titulo from "@components/Titulo"
import { RiCloseFill } from 'react-icons/ri'
import styled from "styled-components"
import styles from './ModalDocumentoVaga.module.css'
import { Overlay, DialogEstilizado } from '@components/Modal/styles'

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 16px;
    padding: 16px;
    width: 100%;
`

const Col6 = styled.div`
    flex: 1 1 calc(50% - 8px);
`

const Col6Centered = styled.div`
    display: flex;
    flex: 1 1 calc(50% - 8px);
    justify-content: start;
    padding-top: 14px;
    align-items: center;
`

function ModalDocumentoVaga({ opened = false, aoFechar, aoSalvar, documento = null }) {
    const [classError, setClassError] = useState([]);
    const [documentoNome, setDocumentoNome] = useState('');
    const [obrigatorio, setObrigatorio] = useState(true);
    const [documentoSelecionado, setDocumentoSelecionado] = useState(null);
    const [documentosRequeridos, setDocumentosRequeridos] = useState([]);

    useEffect(() => {
        if (opened) {
            http.get('/documento_requerido/?format=json')
                .then(response => {
                    setDocumentosRequeridos(response);
                })
                .catch(error => {
                    console.error('Erro ao buscar documentos requeridos:', error);
                });
        }
    }, [opened]);

    useEffect(() => {
        if (documento && opened) {
            setDocumentoNome(documento.documento_nome || '');
            setObrigatorio(!!documento.obrigatorio);
            setDocumentoSelecionado(documento.documento || null);
        } else if (!opened) {
            setDocumentoNome('');
            setObrigatorio(true);
            setDocumentoSelecionado(null);
            setClassError([]);
        }
    }, [documento, opened]);

    const validarESalvar = () => {
        let errors = [];
        if (!documentoNome) errors.push('documento_nome');
        if (!documentoSelecionado) errors.push('documento');
        
        if (errors.length > 0) {
            setClassError(errors);
            return;
        }

        aoSalvar(
            documentoNome, 
            obrigatorio, 
            documentoSelecionado 
        );
    };

    return (
        <>
            {opened && (
                <Overlay>
                    <DialogEstilizado open={opened}>
                        <Frame>
                            <Titulo>
                                <button className="close" onClick={aoFechar}>
                                    <RiCloseFill size={20} className="fechar" />  
                                </button>
                                <h6>{documento ? 'Editar Documento' : 'Novo Documento'}</h6>
                            </Titulo>
                        </Frame>
                        
                        <Frame padding="12px 0px">
                            <Col12>
                                <Col12>
                                    <Col6>
                                        <CampoTexto
                                            camposVazios={classError.includes('documento_nome') ? ['documento_nome'] : []}
                                            name="documento_nome"
                                            valor={documentoNome}
                                            setValor={setDocumentoNome}
                                            type="text"
                                            label="Nome do Documento*"
                                            placeholder="Digite o nome do documento"
                                        />
                                    </Col6>
                                    <Col6>
                                        <div>
                                            <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Documento*</label>
                                            <Dropdown 
                                                value={documentoSelecionado} 
                                                options={documentosRequeridos} 
                                                onChange={e => setDocumentoSelecionado(e.value)} 
                                                optionLabel="nome"
                                                placeholder="Selecione o documento" 
                                                style={{ width: '100%' }} 
                                                className={classError.includes('documento') ? 'p-invalid' : ''}
                                            />
                                        </div>
                                    </Col6>
                                </Col12>
                                <Col12>
                                    <Col6Centered>
                                        <label style={{ fontWeight: 600, marginRight: 8 }}>Obrigatório</label>
                                        <SwitchInput checked={obrigatorio} onChange={e => setObrigatorio(e.value)} />
                                    </Col6Centered>
                                </Col12>
                            </Col12>
                        </Frame>
                        
                        <div className={styles.containerBottom}>
                            <Botao 
                                aoClicar={validarESalvar} 
                                estilo="vermilion" 
                                size="medium" 
                                filled
                            >
                                {documento ? 'Atualizar' : 'Confirmar'}
                            </Botao>
                        </div>
                    </DialogEstilizado>
                </Overlay>
            )}
        </>
    );
}

export default ModalDocumentoVaga; 