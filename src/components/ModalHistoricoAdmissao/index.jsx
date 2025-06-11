import React from 'react';
import styled from 'styled-components';
import { Overlay, DialogEstilizado } from '@components/Modal/styles';
import Frame from '@components/Frame';
import Titulo from '@components/Titulo';
import { RiCloseFill } from 'react-icons/ri';
import Botao from '@components/Botao';
import BotaoGrupo from '@components/BotaoGrupo';
import Texto from '@components/Texto';
import { FaRegPaperPlane } from 'react-icons/fa';

const TimelineContainer = styled.div`
    padding: 12px 16px;
    max-height: 70vh;
    overflow-y: auto;
`;

const TimelineItem = styled.div`
    position: relative;
    padding-left: 30px;
    padding-bottom: 30px;
    border-left: 2px solid var(--neutro-200);

    &:last-child {
        border-left: none;
    }

    &:before {
        content: '';
        position: absolute;
        left: -8px;
        top: 0;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background-color: ${props => props.status === 'success' ? 'var(--green-500)' : 
                                 props.status === 'error' ? 'var(--error)' : 
                                 'var(--primaria)'};
    }
`;

const TimelineDate = styled.div`
    color: var(--neutro-500);
    font-size: 12px;
    margin-bottom: 4px;
`;

const TimelineTitle = styled.div`
    font-weight: 600;
    margin-bottom: 4px;
`;

const TimelineDescription = styled.div`
    color: var(--neutro-600);
    font-size: 14px;
`;

function ModalHistoricoAdmissao({ opened = false, aoFechar, candidato }) {
    const handleReenviar = (item) => {
        alert(`Reenviar: ${item.mensagem}`);
        // Aqui você pode implementar a lógica real de reenvio
    };

    const getStatusColor = (tipo) => {
        switch (tipo) {
            case 'sistema':
                return 'var(--primaria)';
            case 'usuario':
                return 'var(--green-500)';
            case 'erro':
                return 'var(--error)';
            default:
                return 'var(--primaria)';
        }
    };

    return (
        opened &&
        <Overlay>
            <DialogEstilizado $width="480px" open={opened}>
                <Frame padding="12px 0 0 0">
                    <Titulo>
                        <button className="close" onClick={aoFechar}>
                            <RiCloseFill size={20} className="fechar" />
                        </button>
                        <h6>Histórico do Processo</h6>
                    </Titulo>
                </Frame>
                <TimelineContainer>
                    {candidato?.log_tarefas?.map((item, index) => (
                        <TimelineItem 
                            key={index} 
                            status={item.sucesso ? 'success' : 'error'}
                            style={{
                                '&:before': {
                                    backgroundColor: getStatusColor(item.tipo)
                                }
                            }}
                        >
                            <TimelineDate>
                                {new Date(item.criado_em).toLocaleString('pt-BR')}
                            </TimelineDate>
                            <TimelineTitle style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Texto weight={600}>{item.tipo_display}</Texto>
                                {item.tipo === 'sistema' && item.mensagem.toLowerCase().includes('email') && (
                                    <button
                                        style={{
                                            background: 'var(--primaria)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: 6,
                                            padding: '4px 10px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 4,
                                            fontSize: 11
                                        }}
                                        onClick={() => handleReenviar(item)}
                                    >
                                        <FaRegPaperPlane fill="white" size={8} /> Reenviar
                                    </button>
                                )}
                            </TimelineTitle>
                            <TimelineDescription>
                                {item.mensagem}
                            </TimelineDescription>
                        </TimelineItem>
                    ))}
                </TimelineContainer>
            </DialogEstilizado>
        </Overlay>
    );
}

export default ModalHistoricoAdmissao;
