import React from 'react';
import styled from 'styled-components';
import { Overlay, DialogEstilizado } from '@components/Modal/styles';
import Frame from '@components/Frame';
import Titulo from '@components/Titulo';
import { RiCloseFill } from 'react-icons/ri';
import Botao from '@components/Botao';
import BotaoGrupo from '@components/BotaoGrupo';
import Texto from '@components/Texto';

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
    // Dados fake para o histórico
    const historico = [
        {
            data: '2024-03-15 14:30',
            titulo: 'Oferta enviada',
            descricao: 'Email de oferta enviado para o candidato',
            status: 'success'
        },
        {
            data: '2024-03-16 10:15',
            titulo: 'Oferta aceita',
            descricao: 'Candidato aceitou a oferta de emprego',
            status: 'success'
        },
        {
            data: '2024-03-16 12:00',
            titulo: 'LGPD Aceita',
            descricao: 'Candidato aceitou compartilhar seus dados com a empresa',
            status: 'success'
        },
        {
            data: '2024-03-17 09:00',
            titulo: 'Agendamento de exame médico',
            descricao: 'Exame médico agendado para 25/03/2024',
            status: 'success'
        },
        {
            data: '2024-03-20 15:45',
            titulo: 'Email de instruções enviado',
            descricao: 'Email com instruções para o exame médico foi enviado',
            status: 'success'
        },
        {
            data: '2024-03-25 11:30',
            titulo: 'Exame médico realizado',
            descricao: 'Candidato realizou o exame médico',
            status: 'success'
        },
        {
            data: '2024-03-26 16:20',
            titulo: 'Exame médico anexado',
            descricao: 'Resultado do exame médico foi anexado ao processo',
            status: 'success'
        },
        {
            data: '2024-03-27 13:00',
            titulo: 'Aguardando documentação',
            descricao: 'Aguardando anexo dos documentos pendentes',
            status: 'pending'
        }
    ];

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
                    {historico.map((item, index) => (
                        <TimelineItem key={index} status={item.status}>
                            <TimelineDate>
                                {new Date(item.data).toLocaleString('pt-BR')}
                            </TimelineDate>
                            <TimelineTitle>
                                <Texto weight={600}>{item.titulo}</Texto>
                            </TimelineTitle>
                            <TimelineDescription>
                                {item.descricao}
                            </TimelineDescription>
                        </TimelineItem>
                    ))}
                </TimelineContainer>
            </DialogEstilizado>
        </Overlay>
    );
}

export default ModalHistoricoAdmissao;
