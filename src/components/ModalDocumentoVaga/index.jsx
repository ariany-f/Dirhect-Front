import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import CampoTexto from '@components/CampoTexto';
import { Dropdown } from 'primereact/dropdown';
import SwitchInput from '@components/SwitchInput';
import Botao from '@components/Botao';
import BotaoSemBorda from '@components/BotaoSemBorda';
import { FaSave } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import http from '@http';
import Frame from "@components/Frame"
import Titulo from "@components/Titulo"
import { RiCloseFill } from 'react-icons/ri'
import styled from "styled-components"
import styles from './ModalDocumentoVaga.module.css'
import { Overlay, DialogEstilizado } from '@components/Modal/styles'
import { useNavigate } from 'react-router-dom';

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

function ModalDocumentoVaga({ opened = false, vaga = null, aoFechar, aoSalvar, documento = null }) {
    const navigate = useNavigate();
    const [classError, setClassError] = useState([]);
    const [documentoNome, setDocumentoNome] = useState('');
    const [obrigatorio, setObrigatorio] = useState(true);
    const [documentoSelecionado, setDocumentoSelecionado] = useState(null);
    const [documentosRequeridos, setDocumentosRequeridos] = useState([]);

    const vagaTransferida = vaga?.status === 'T';

    const handleCriarNovo = () => {
        aoFechar(); // Fecha o modal atual
        navigate('/documentos/configuracoes'); // Redireciona para a página de configurações
    };

    useEffect(() => {
        if (opened) {
            http.get('/documento_requerido/?format=json')
                .then(response => {
                    setDocumentosRequeridos(response);
                    // Se estiver editando um documento, preenche os campos
                    if (documento) {
                        // O nome pode ser um override específico para a vaga, ou o nome do documento padrão
                        setDocumentoNome(documento.documento_nome || documento.documento_detalhes?.nome || '');
                        setObrigatorio(!!documento.obrigatorio);
                        // Encontra o objeto completo do documento para o Dropdown usando o ID de documento_detalhes
                        const docCompleto = response.find(d => d.id === documento.documento_detalhes?.id);
                        setDocumentoSelecionado(docCompleto || null);
                    } else {
                        // Se for um novo documento, reseta os campos
                        setDocumentoNome('');
                        setObrigatorio(true);
                        setDocumentoSelecionado(null);
                        setClassError([]);
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar documentos requeridos:', error);
                });
        } else {
            // Limpa o estado quando o modal é fechado
            setDocumentoNome('');
            setObrigatorio(true);
            setDocumentoSelecionado(null);
            setClassError([]);
        }
    }, [documento, opened]);

    const validarESalvar = () => {
        if (vagaTransferida) {
            return;
        }

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
                                <h6>{documento ? 'Editar Documento Requerido para a Vaga' : 'Novo Documento Requerido para a Vaga'}</h6>
                            </Titulo>
                        </Frame>
                        
                        <Frame padding="12px 0px">
                            {vagaTransferida && (
                                <div style={{ 
                                    backgroundColor: 'var(--blue-100)', 
                                    border: '1px solid var(--blue-500)', 
                                    borderRadius: '8px', 
                                    padding: '12px', 
                                    margin: '16px',
                                    color: 'var(--blue-700)',
                                    fontStyle: 'italic'
                                }}>
                                    Esta vaga foi transferida para outra empresa. Não é possível modificar documentos requeridos.
                                </div>
                            )}
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
                                            disabled={vagaTransferida}
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
                                                disabled={vagaTransferida}
                                            />
                                            <div style={{ marginTop: '8px' }}>
                                                <BotaoSemBorda 
                                                    aoClicar={handleCriarNovo}
                                                    color="var(--primaria)"
                                                >
                                                    <FaPlus size={12} />
                                                    Criar Novo Padrão
                                                </BotaoSemBorda>
                                            </div>
                                        </div>
                                    </Col6>
                                </Col12>
                                <Col12>
                                    <Col6Centered>
                                        <label style={{ fontWeight: 600, marginRight: 8 }}>Obrigatório</label>
                                        <SwitchInput 
                                            checked={obrigatorio} 
                                            onChange={valor => setObrigatorio(valor)} 
                                            disabled={vagaTransferida}
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
                                disabled={vagaTransferida}
                                title={vagaTransferida ? "Não é possível modificar documentos de vagas transferidas" : ""}
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