import React from 'react';
import { OverlayRight, DialogEstilizadoRight } from '@components/Modal/styles';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RiCloseFill } from 'react-icons/ri';
import styled from 'styled-components';
import BotaoGrupo from '@components/BotaoGrupo';
import Titulo from '@components/Titulo';
import Frame from '@components/Frame';
import { Col12, Col6 } from '@components/Colunas';
import Botao from '@components/Botao';
import { Link } from 'react-router-dom';
import { FaExclamationCircle, FaRegClock, FaCheckCircle, FaSun, FaCalendarCheck } from 'react-icons/fa';

const BotaoFechar = styled.button`
    background: none;
    border: none;
    color: #757575;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0 8px;
    transition: color 0.2s;
    &:hover {
        color: #f44336;
    }
`;

const DetalhesCard = styled.div`
    border-radius: 12px;
    padding: 28px 24px 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    align-items: flex-start;
`;

const Linha = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const Label = styled.span`
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
`;

const Valor = styled.span`
    font-size: 16px;
    font-weight: 500;
    word-break: break-word;
    color: black;
`;

const StatusTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  padding: 4px 12px;
  margin-left: 0;
  margin-bottom: 2px;
  background: ${({ $type }) => {
    if ($type === 'aSolicitar') return 'linear-gradient(to right, #ff5ca7, #ffb6c1)';
    if ($type === 'solicitada') return 'linear-gradient(to right, #fbb034,rgb(211, 186, 22))';
    if ($type === 'aprovada') return 'linear-gradient(to left, #0c004c, #5d0b62)';
    if ($type === 'acontecendo') return 'linear-gradient(to right,rgb(45, 126, 219),rgb(18, 37, 130))';
    if ($type === 'passada') return 'linear-gradient(to right, #bdbdbd, #757575)';
    return 'linear-gradient(to left, #0c004c, #5d0b62)';
  }};
  color: #fff;
  border: none;
`;

const statusIcons = {
  aSolicitar: <FaExclamationCircle fill='white' size={14} />,
  solicitada: <FaRegClock fill='white' size={14}/>,
  aprovada: <FaCalendarCheck fill='white' size={14}/>,
  acontecendo: <FaSun fill='white' size={14}/>,
  passada: <FaCheckCircle fill='white' size={14}/>,
};

function mapStatusToType(status) {
  switch (status) {
    case 'A': return 'aprovada';
    case 'S': return 'solicitada';
    case 'C': return 'passada';
    case 'E': return 'acontecendo';
    case 'R': return 'rejeitada';
    default: return 'aprovada';
  }
}

const CabecalhoFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 18px;
`;

const AlertaAviso = styled.div`
  background: #fff7e0;
  color: #a67c00;
  border-radius: 8px;
  padding: 14px 18px;
  font-size: 15px;
  font-weight: 500;
  margin: 18px 0 0 0;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  box-shadow: 0 2px 8px #fbb03422;
`;

const BlocoDatas = styled.div`
  display: flex;
  gap: 32px;
  margin: 18px 0 0 0;
  flex-wrap: wrap;
`;

const BlocoData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 120px;
`;

const DataTitulo = styled.span`
  font-size: 13px;
  font-weight: 600;
`;

const DataValor = styled.span`
  color: #222;
  font-size: 18px;
  font-weight: 700;
`;

const DataDiaSemana = styled.span`
  color: #888;
  font-size: 13px;
`;

export default function ModalDetalhesFerias({ opened, evento, aoFechar }) {
    if (!evento) return null;
    console.log(evento);
    const gestor = evento.colab?.gestor;
    let totalDias = null;
    if (evento.evento?.data_inicio && evento.evento?.data_fim) {
        const inicio = new Date(evento.evento.data_inicio);
        const fim = new Date(evento.evento.data_fim);
        totalDias = Math.floor((fim - inicio) / (1000 * 60 * 60 * 24)) + 1;
    }
    const podeAprovar = evento.evento?.status === 'S';
    const aprovarFerias = () => {
        alert('Férias aprovadas!');
    };
    const reprovarFerias = () => {
        alert('Férias reprovadas!');
    };
    let statusType = mapStatusToType(evento.evento?.status);
    if (evento.tipo) {
        statusType = evento.tipo;
    }
    let statusLabel = '';
    switch (statusType) {
      case 'aSolicitar': statusLabel = 'Recesso a vencer'; break;
      case 'solicitada': statusLabel = 'Aprovação pendente'; break;
      case 'aprovada': statusLabel = 'Férias aprovadas'; break;
      case 'acontecendo': statusLabel = 'Em férias'; break;
      case 'passada': statusLabel = 'Férias concluídas'; break;
      default: statusLabel = 'Férias';
    }
    let alerta = null;
    if (evento.evento?.limite) {
      alerta = (
        <AlertaAviso>
          <FaExclamationCircle style={{marginTop:2, color:'#a67c00'}}/>
          <span>
            Os dias de descanso gozados após o período legal de concessão deverão ser remunerados em dobro. O colaborador deve solicitar as férias até <b>{format(new Date(evento.evento.limite), 'dd/MM/yyyy')}</b>
          </span>
        </AlertaAviso>
      );
    }
    const podeSolicitar = statusType === 'aSolicitar';
    const solicitarFerias = () => {
        alert('Solicitação de férias iniciada!');
    };
    return (
        <OverlayRight $opened={opened} onClick={aoFechar}>
            <DialogEstilizadoRight $align="flex-end" open={opened} $opened={opened} onClick={e => e.stopPropagation()}>
                <Frame>
                    <CabecalhoFlex>
                        <StatusTag $type={statusType}>
                            {statusIcons[statusType]} {statusLabel}
                        </StatusTag>
                        <BotaoFechar onClick={aoFechar} formMethod="dialog">
                            <RiCloseFill size={22} className="fechar" />
                        </BotaoFechar>
                    </CabecalhoFlex>
                    <DetalhesCard style={{minWidth: 320, marginTop:0}}>
                        <Linha>
                            <Label>Colaborador</Label>
                            <Valor>
                                <Link to={`/colaboradores/detalhes/${evento.colab?.id}`}>
                                    {evento.colab?.nome}
                                </Link>
                            </Valor>
                        </Linha>
                        {gestor && (
                            <Linha>
                                <Label>Gestor</Label>
                                <Valor>{gestor}</Valor>
                            </Linha>
                        )}
                        <Linha>
                            <Label>Status</Label>
                            <StatusTag $type={statusType}>
                                {statusIcons[statusType]} {statusType.charAt(0).toUpperCase() + statusType.slice(1)}
                            </StatusTag>
                        </Linha>
                        <BlocoDatas>
                            {evento.evento?.data_inicio && (
                                <BlocoData>
                                <DataTitulo>Início</DataTitulo>
                                <DataValor>{format(new Date(evento.evento.data_inicio), 'dd/MM/yyyy')}</DataValor>
                                <DataDiaSemana>{format(new Date(evento.evento.data_inicio), 'EEEE', { locale: ptBR })}</DataDiaSemana>
                                </BlocoData>
                            )}
                            {evento.evento?.data_fim && (
                                <BlocoData>
                                <DataTitulo>Fim</DataTitulo>
                                <DataValor>{format(new Date(evento.evento.data_fim), 'dd/MM/yyyy')}</DataValor>
                                <DataDiaSemana>{format(new Date(evento.evento.data_fim), 'EEEE', { locale: ptBR })}</DataDiaSemana>
                                </BlocoData>
                            )}
                            {totalDias && (
                                <BlocoData>
                                <DataTitulo>Total de dias</DataTitulo>
                                <DataValor>{totalDias} dias</DataValor>
                                </BlocoData>
                            )}
                        </BlocoDatas>
                    </DetalhesCard>
                    {alerta}
                </Frame>
                {podeSolicitar ? (
                    <BotaoGrupo align="end">
                        <Botao estilo="primario" size="medium" aoClicar={solicitarFerias}>
                            Solicitar Férias
                        </Botao>
                    </BotaoGrupo>
                ) : podeAprovar && (
                    <BotaoGrupo align="end">
                        <Botao estilo="cinza" size="medium" aoClicar={reprovarFerias}>
                            Reprovar
                        </Botao>
                        <Botao estilo="vermilion" size="medium" aoClicar={aprovarFerias}>
                            Aprovar
                        </Botao>
                    </BotaoGrupo>
                )}
            </DialogEstilizadoRight>
        </OverlayRight>
    );
}
