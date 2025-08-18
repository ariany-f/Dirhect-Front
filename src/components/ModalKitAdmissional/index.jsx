import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import Texto from "@components/Texto"
import CustomImage from "@components/CustomImage"
import DropdownItens from "@components/DropdownItens"
import { RiCloseFill } from 'react-icons/ri'
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import http from "@http"
import styled from "styled-components"
import styles from './ModalAdicionarDepartamento.module.css'
import { OverlayRight, DialogEstilizadoRight } from '@components/Modal/styles'
import SwitchInput from '@components/SwitchInput';

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

function ModalKitAdmissional({ opened = false, aoFechar, aoSalvar, contrato = null }) {
    const [classError, setClassError] = useState([]);
    const [nome, setNome] = useState('');
    const [tipo, setTipo] = useState('');
    const [observacao, setObservacao] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dt_inicio, setDataInicio] = useState('');
    const [dt_fim, setDataFim] = useState('');
    const [status, setStatus] = useState(true);

    useEffect(() => {
        if (contrato && opened) {
            setNome(contrato.nome || '');
            setTipo(contrato.tipo || '');
            setObservacao(contrato.observacao || '');
            setDescricao(contrato.descricao || '');
            setDataInicio(contrato.dt_inicio || '');
            setDataFim(contrato.dt_fim || '');
            setStatus(contrato.status === 'A');
        } else if (!opened) {
            setNome('');
            setTipo('');
            setObservacao('');
            setDescricao('');
            setDataInicio('');
            setDataFim('');
            setStatus(true);
            setClassError([]);
        }
    }, [contrato, opened]);

    const validarESalvar = () => {
        let errors = [];
        if (!nome) errors.push('nome');
        if (errors.length > 0) {
            setClassError(errors);
            return;
        }
        aoSalvar({
            nome,
            tipo,
            observacao,
            descricao,
            dt_inicio,
            dt_fim,
            status: status ? 'A' : 'I',
        });
    };

    return (
        <OverlayRight $opened={opened}>
            <DialogEstilizadoRight $width="40vw" open={opened} $opened={opened}>
                <Frame>
                    <Titulo>
                        <button className="close" onClick={aoFechar}>
                            <RiCloseFill size={20} className="fechar" />  
                        </button>
                        <h6>{contrato ? 'Editar Kit Admissional' : 'Novo Kit Admissional'}</h6>
                    </Titulo>
                </Frame>
                <Frame padding="12px 0px">
                    <Col12>
                        <Col6 style={{ width: '100%' }}>
                            <CampoTexto
                                camposVazios={classError.includes('nome') ? ['nome'] : []}
                                name="nome"
                                valor={nome}
                                setValor={setNome}
                                type="text"
                                label="Nome do Kit*"
                                placeholder="Digite o nome do kit admissional"
                            />
                        </Col6>
                        <Col6 style={{ width: '100%' }}>
                            <CampoTexto
                                name="tipo"
                                valor={tipo}
                                setValor={setTipo}
                                type="text"
                                label="Tipo"
                                placeholder="Ex: Contrato, Termo LGPD, etc."
                            />
                        </Col6>
                        <Col6 style={{ width: '100%' }}>
                            <CampoTexto
                                name="observacao"
                                valor={observacao}
                                setValor={setObservacao}
                                type="text"
                                label="Observação"
                                placeholder="Observação sobre o kit"
                            />
                        </Col6>
                        <Col6 style={{ width: '100%' }}>
                            <CampoTexto
                                name="descricao"
                                valor={descricao}
                                setValor={setDescricao}
                                type="text"
                                label="Descrição"
                                placeholder="Descrição detalhada do kit (opcional)"
                            />
                        </Col6>
                        <Col6 style={{ width: '100%' }}>
                            <CampoTexto
                                name="dt_inicio"
                                valor={dt_inicio}
                                setValor={setDataInicio}
                                type="date"
                                label="Data Início"
                                placeholder="Data de início"
                            />
                        </Col6>
                        <Col6 style={{ width: '100%' }}>
                            <CampoTexto
                                name="dt_fim"
                                valor={dt_fim}
                                setValor={setDataFim}
                                type="date"
                                label="Data Fim"
                                placeholder="Data de fim"
                            />
                        </Col6>
                        <Col6Centered>
                            <span style={{ fontWeight: 500, marginRight: 12 }}>Status</span>
                            <SwitchInput checked={status} onChange={() => setStatus(!status)} />
                            <span style={{ marginLeft: 8 }}>{status ? 'Ativo' : 'Inativo'}</span>
                        </Col6Centered>
                    </Col12>
                </Frame>
                <div className={styles.containerBottom}>
                    <Botao 
                        aoClicar={aoFechar} 
                        estilo="neutro" 
                        size="medium" 
                        filled
                    >
                        Voltar
                    </Botao>
                    <Botao 
                        aoClicar={validarESalvar} 
                        estilo="vermilion" 
                        size="medium" 
                        filled
                        disabled={!nome}
                    >
                        {contrato ? 'Atualizar' : 'Confirmar'}
                    </Botao>
                </div>
            </DialogEstilizadoRight>
        </OverlayRight>
    );
}

export default ModalKitAdmissional;