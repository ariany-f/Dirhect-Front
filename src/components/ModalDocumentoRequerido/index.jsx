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
import styles from './ModalDocumentoRequerido.module.css'
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

function ModalDocumentoRequerido({ opened = false, aoFechar, aoSalvar, documento = null }) {
    const [classError, setClassError] = useState([]);
    const [nome, setNome] = useState('');
    const [extPermitidas, setExtPermitidas] = useState('');
    const [frenteVerso, setFrenteVerso] = useState(false);
    const [instrucao, setInstrucao] = useState('');
    const [descricao, setDescricao] = useState('');
    const [obrigatorio, setObrigatorio] = useState(true);
    const [documentosRequeridos, setDocumentosRequeridos] = useState([]);
    const [documentoSelecionado, setDocumentoSelecionado] = useState(null);

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
            setNome(documento.nome || '');
            setExtPermitidas(documento.ext_permitidas || '');
            setFrenteVerso(!!documento.frente_verso);
            setInstrucao(documento.instrucao || '');
            setDescricao(documento.descricao || '');
            setObrigatorio(!!documento.obrigatorio);
            setDocumentoSelecionado(documento);
        } else if (!opened) {
            setNome('');
            setExtPermitidas('');
            setFrenteVerso(false);
            setInstrucao('');
            setDescricao('');
            setObrigatorio(true);
            setDocumentoSelecionado(null);
            setClassError([]);
        }
    }, [documento, opened]);

    const validarESalvar = () => {
        let errors = [];
        if (!nome) errors.push('nome');
        if (!extPermitidas) errors.push('ext_permitidas');
        if (!instrucao) errors.push('instrucao');
        
        if (errors.length > 0) {
            setClassError(errors);
            return;
        }

        aoSalvar({ 
            nome,
            ext_permitidas: extPermitidas,
            frente_verso: frenteVerso,
            instrucao,
            descricao,
            obrigatorio
        });
    };

    const handleFrenteVersoChange = (value) => {
        setFrenteVerso(value);
    };

    const handleObrigatorioChange = (value) => {
        setObrigatorio(value);
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
                                            camposVazios={classError.includes('nome') ? ['nome'] : []}
                                            name="nome"
                                            valor={nome}
                                            setValor={setNome}
                                            type="text"
                                            label="Nome*"
                                            placeholder="Digite o nome do documento"
                                        />
                                    </Col6>
                                    <Col6>
                                        <CampoTexto
                                            camposVazios={classError.includes('ext_permitidas') ? ['ext_permitidas'] : []}
                                            name="ext_permitidas"
                                            valor={extPermitidas}
                                            setValor={setExtPermitidas}
                                            type="text"
                                            label="Extensões Permitidas*"
                                            placeholder="Digite as extensões permitidas"
                                        />
                                    </Col6>
                                </Col12>
                                <Col12>
                                    <Col6>
                                        <CampoTexto
                                            camposVazios={classError.includes('instrucao') ? ['instrucao'] : []}
                                            name="instrucao"
                                            valor={instrucao}
                                            setValor={setInstrucao}
                                            type="text"
                                            label="Instrução*"
                                            placeholder="Digite a instrução"
                                        />
                                    </Col6>
                                    <Col6>
                                        <CampoTexto
                                            name="descricao"
                                            valor={descricao}
                                            setValor={setDescricao}
                                            type="text"
                                            label="Descrição"
                                            placeholder="Digite a descrição"
                                        />
                                    </Col6>
                                </Col12>
                                <Col12>
                                    <Col6Centered>
                                        <label style={{ fontWeight: 600, marginRight: 8 }}>Frente e Verso</label>
                                        <SwitchInput 
                                            checked={frenteVerso} 
                                            onChange={handleFrenteVersoChange}
                                        />
                                    </Col6Centered>
                                    <Col6Centered>
                                        <label style={{ fontWeight: 600, marginRight: 8 }}>Obrigatório</label>
                                        <SwitchInput 
                                            checked={obrigatorio} 
                                            onChange={handleObrigatorioChange}
                                        />
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

export default ModalDocumentoRequerido;
