import React, { useState } from 'react';
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
import { FaExclamationCircle, FaRegClock, FaCheckCircle, FaSun, FaCalendarCheck, FaCalendarAlt, FaCalculator, FaTimesCircle, FaPaperPlane, FaBan } from 'react-icons/fa';
import http from '@http';
import SwitchInput from '@components/SwitchInput';

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
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
`;

const NomeStatusContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
`;

const Linha = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    text-align: left;
    width: 100%;
`;

const Label = styled.span`
    font-size: 12px;
    font-weight: 500;
    color: #6c757d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const Valor = styled.span`
    font-size: 15px;
    font-weight: 600;
    word-break: break-word;
    color: #343a40;

    a {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 600;
        &:hover {
            text-decoration: underline;
        }
    }
`;

const StatusTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  padding: 4px 12px;
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
  margin-bottom: 24px;
`;

const AlertaAviso = styled.div`
    background: #fffbeb;
    color: #664d03;
    border-left: 4px solid #ffc107;
    border-radius: 4px;
    padding: 16px;
    font-size: 14px;
    margin-top: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
`;

const BlocoDatas = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin: 12px 0 0 0;
  width: 100%;
`;

const BlocoData = styled.div`
    display: flex;
    gap: 12px;
    align-items: center;
    background-color: #f8f9fa;
    padding: 16px;
    border-radius: 12px;
    border: 1px solid #f1f3f5;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0,0,0,0.08);
    }
`;

const BlocoDataIcone = styled.div`
    color: var(--primary-color);
`;

const BlocoDataTexto = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const DataTitulo = styled.span`
  font-size: 10px;
  font-weight: 500;
  color: #6c757d;
  text-transform: uppercase;
`;

const DataValor = styled.span`
  color: #212529;
  font-size: 14px;
  font-weight: 700;
`;

const DataDiaSemana = styled.span`
  color: #888;
  font-size: 13px;
  margin-top: 2px;
`;

const DataInput = styled.input`
    font-size: 15px;
    padding: 10px 12px;
    border-radius: 6px;
    border: 1px solid #ced4da;
    background: #fff;
    margin-top: 4px;
    width: 100%;
    &:focus {
        border-color: var(--primary-color);
        outline: none;
        box-shadow: 0 0 0 2px var(--primary-100);
    }
`;

const DetalhesTitulo = styled.h4`
    font-size: 16px;
    font-weight: 600;
    color: #343a40;
    margin: 16px 0 8px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid #e9ecef;
    width: 100%;
    text-align: left;
`;

const ConteudoContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: flex-start;
    flex-wrap: wrap;
    width: 100%;
`;

const DetalhesContainer = styled.div`
    flex: 1 1 50%;
    min-width: calc(50% - 24px);
    max-width: calc(50% - 24px);
    & > ${DetalhesCard} > ${DetalhesTitulo}:first-child {
        margin-top: 0;
    }
`;

const AcoesContainer = styled.div`
    flex: 1 1 50%;
    position: sticky;
    top: 24px;
    min-width: calc(50% - 24px);
    max-width: calc(50% - 24px);
    & > ${Frame} {
        background-color: #fff;
        border: 1px solid #dee2e6;
        box-shadow: 0 8px 16px rgba(0,0,0,0.05);
        border-radius: 12px;
        padding: 24px;
    }
`;

export default function ModalDetalhesFerias({ opened, evento, aoFechar }) {
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [adiantarDecimoTerceiro, setAdiantarDecimoTerceiro] = useState(false);

    if (!evento) return null;

    const statusType = evento.tipo || mapStatusToType(evento.evento?.status);

    let totalDias = null;
    if (evento.evento?.data_inicio && evento.evento?.data_fim) {
        const inicio = new Date(evento.evento.data_inicio);
        const fim = new Date(evento.evento.data_fim);
        totalDias = Math.floor((fim - inicio) / (1000 * 60 * 60 * 24)) + 1;
    }

    const saldoBase = 30;
    let saldoFinal = evento.evento?.saldo_dias ?? saldoBase;
    if ((statusType === 'passada' || statusType === 'finalizada' || statusType === 'acontecendo') && totalDias !== null) {
        saldoFinal = saldoBase - totalDias;
    }
    
    const eventoCompletado = {
        ...evento,
        evento: {
            ...evento.evento,
            periodo_aquisitivo_inicio: evento.evento?.periodo_aquisitivo_inicio || '2023-01-01',
            periodo_aquisitivo_fim: evento.evento?.periodo_aquisitivo_fim || '2023-12-31',
            saldo_dias: saldoFinal,
            data_solicitacao: evento.evento?.data_solicitacao || '2024-05-20T10:00:00Z'
        }
    };

    const gestor = eventoCompletado.colab?.gestor;
    const podeAprovar = eventoCompletado.evento?.status === 'S';
    const aprovarFerias = () => {
        alert('Férias aprovadas!');
    };
    const reprovarFerias = () => {
        alert('Férias reprovadas!');
    };
    const cancelarSolicitacao = async () => {
        if (!eventoCompletado.evento?.id) {
            alert('ID do evento de férias não encontrado.');
            return;
        }
    
        if (window.confirm('Tem certeza que deseja cancelar esta solicitação de férias?')) {
            try {
                await http.post(`/ferias/${eventoCompletado.evento.id}/cancelar/`);
                alert('Solicitação de férias cancelada com sucesso!');
                aoFechar();
            } catch (error) {
                console.error("Erro ao cancelar solicitação de férias", error);
                const errorMessage = error.response?.data?.detail || 'Não foi possível cancelar a solicitação. Tente novamente.';
                alert(errorMessage);
            }
        }
    };
    
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
    if (eventoCompletado.evento?.limite) {
      alerta = (
        <AlertaAviso>
          <FaExclamationCircle size={20} style={{ color: '#ffc107', flexShrink: 0 }}/>
          <span>
            Os dias de descanso gozados após o período legal de concessão deverão ser remunerados em dobro. O colaborador deve solicitar as férias até <b>{format(new Date(eventoCompletado.evento.limite), 'dd/MM/yyyy')}</b>
          </span>
        </AlertaAviso>
      );
    }
    const podeSolicitar = statusType === 'aSolicitar';
    const solicitarFerias = async () => {
        if (!dataInicio || !dataFim) {
            alert('Por favor, preencha as datas de início e fim.');
            return;
        }
        if (new Date(dataInicio) > new Date(dataFim)) {
            alert('A data de início não pode ser posterior à data de fim.');
            return;
        }

        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);
        const diasSolicitados = Math.floor((fim - inicio) / (1000 * 60 * 60 * 24)) + 1;
        const saldoDisponivel = eventoCompletado.evento.saldo_dias;

        if (diasSolicitados > saldoDisponivel) {
            alert(`Você pode solicitar no máximo ${saldoDisponivel} dias de férias.`);
            return;
        }
        
        try {
            await http.post(`/funcionario/${eventoCompletado.colab.id}/solicitar_ferias/`, {
                data_inicio: dataInicio,
                data_fim: dataFim,
                adiantar_13: adiantarDecimoTerceiro
            });
            alert('Solicitação de férias enviada com sucesso!');
            aoFechar();
        } catch (error) {
            console.error("Erro ao solicitar férias", error);
            const errorMessage = error.response?.data?.detail || 'Erro ao solicitar férias. Por favor, tente novamente.';
            alert(errorMessage);
        }
    };

    const tituloPeriodo = (statusType === 'acontecendo' || statusType === 'passada' || statusType === 'aprovada' || statusType === 'finalizada') ? 'Período de Férias' : 'Período Solicitado';

    return (
        <OverlayRight $opened={opened} onClick={aoFechar}>
            <DialogEstilizadoRight $align="flex-end" open={opened} $opened={opened} onClick={e => e.stopPropagation()}>
                <Frame style={{padding: '24px 32px'}}>
                    <CabecalhoFlex>
                        <StatusTag $type={statusType}>
                            {statusIcons[statusType]} {statusLabel}
                        </StatusTag>
                        <BotaoFechar onClick={aoFechar} formMethod="dialog">
                            <RiCloseFill size={22} className="fechar" />
                        </BotaoFechar>
                    </CabecalhoFlex>
                    <ConteudoContainer>
                        <DetalhesContainer>
                            <DetalhesCard>
                                <DetalhesTitulo>Detalhes do Período Aquisitivo</DetalhesTitulo>
                                <BlocoDatas>
                                    <BlocoData>
                                        <BlocoDataIcone><FaCalendarAlt size={20}/></BlocoDataIcone>
                                        <BlocoDataTexto>
                                            <DataTitulo>Início</DataTitulo>
                                            <DataValor>{format(new Date(eventoCompletado.evento.periodo_aquisitivo_inicio), 'dd/MM/yyyy')}</DataValor>
                                        </BlocoDataTexto>
                                    </BlocoData>
                                    <BlocoData>
                                        <BlocoDataIcone><FaCalendarAlt size={20}/></BlocoDataIcone>
                                        <BlocoDataTexto>
                                            <DataTitulo>Fim</DataTitulo>
                                            <DataValor>{format(new Date(eventoCompletado.evento.periodo_aquisitivo_fim), 'dd/MM/yyyy')}</DataValor>
                                        </BlocoDataTexto>
                                    </BlocoData>
                                    <BlocoData>
                                        <BlocoDataIcone><FaCalculator size={20}/></BlocoDataIcone>
                                        <BlocoDataTexto>
                                            <DataTitulo>Saldo</DataTitulo>
                                            <DataValor>{eventoCompletado.evento.saldo_dias} dias</DataValor>
                                        </BlocoDataTexto>
                                    </BlocoData>
                                </BlocoDatas>
                                
                                <div style={{display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', marginTop: '16px'}}>
                                    <Linha>
                                        <Label>Colaborador</Label>
                                        <NomeStatusContainer>
                                            <Valor>
                                                <Link to={`/colaboradores/detalhes/${eventoCompletado.colab?.id}`}>
                                                    {eventoCompletado.colab?.nome}
                                                </Link>
                                            </Valor>
                                            <StatusTag $type={statusType}>
                                                {statusIcons[statusType]} {statusType.charAt(0).toUpperCase() + statusType.slice(1)}
                                            </StatusTag>
                                        </NomeStatusContainer>
                                    </Linha>
                                    {gestor && (
                                        <Linha>
                                            <Label>Gestor</Label>
                                            <Valor>{gestor}</Valor>
                                        </Linha>
                                    )}
                                    {statusType === 'solicitada' && eventoCompletado.evento.data_solicitacao && (
                                        <Linha>
                                            <Label>Data da Solicitação</Label>
                                            <Valor>
                                                {format(new Date(eventoCompletado.evento.data_solicitacao), "dd/MM/yyyy 'às' HH:mm")}
                                            </Valor>
                                        </Linha>
                                    )}
                                </div>
                            </DetalhesCard>
                            {alerta}
                        </DetalhesContainer>

                        <AcoesContainer>
                            {(eventoCompletado.evento?.data_inicio || totalDias) && (
                                <Frame>
                                    <DetalhesTitulo style={{ marginTop: 0 }}>{tituloPeriodo}</DetalhesTitulo>
                                    <div style={{display: 'flex', gap: '12px', marginTop: '12px'}}>
                                        {eventoCompletado.evento?.data_inicio && (
                                            <BlocoData style={{flex: 1}}>
                                                <BlocoDataIcone><FaCalendarCheck size={20}/></BlocoDataIcone>
                                                <BlocoDataTexto>
                                                    <DataTitulo>Início</DataTitulo>
                                                    <DataValor>{format(new Date(eventoCompletado.evento.data_inicio), 'dd/MM/yyyy')}</DataValor>
                                                    <DataDiaSemana>{format(new Date(eventoCompletado.evento.data_inicio), 'EEEE', { locale: ptBR })}</DataDiaSemana>
                                                </BlocoDataTexto>
                                            </BlocoData>
                                        )}
                                        {eventoCompletado.evento?.data_fim && (
                                            <BlocoData style={{flex: 1}}>
                                                <BlocoDataIcone><FaCalendarCheck size={20}/></BlocoDataIcone>
                                                <BlocoDataTexto>
                                                    <DataTitulo>Fim</DataTitulo>
                                                    <DataValor>{format(new Date(eventoCompletado.evento.data_fim), 'dd/MM/yyyy')}</DataValor>
                                                    <DataDiaSemana>{format(new Date(eventoCompletado.evento.data_fim), 'EEEE', { locale: ptBR })}</DataDiaSemana>
                                                </BlocoDataTexto>
                                            </BlocoData>
                                        )}
                                        {totalDias && (
                                            <BlocoData style={{flex: 1}}>
                                                <BlocoDataIcone><FaCalculator size={20}/></BlocoDataIcone>
                                                <BlocoDataTexto>
                                                    <DataTitulo>Total de dias</DataTitulo>
                                                    <DataValor>{totalDias} dias</DataValor>
                                                </BlocoDataTexto>
                                            </BlocoData>
                                        )}
                                    </div>
                                </Frame>
                            )}
                            
                            {podeSolicitar && (
                                <Frame>
                                    <DetalhesTitulo style={{ marginTop: 0 }}>Solicitar Período</DetalhesTitulo>
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '12px', width: '100%'}}>
                                        <div style={{display: 'flex', gap: 16}}>
                                            <Linha style={{flex: 1}}>
                                                <Label>Data de Início</Label>
                                                <DataInput 
                                                    type="date" 
                                                    value={dataInicio} 
                                                    onChange={e => setDataInicio(e.target.value)} 
                                                />
                                            </Linha>
                                            <Linha style={{flex: 1}}>
                                                <Label>Data de Fim</Label>
                                                <DataInput 
                                                    type="date" 
                                                    value={dataFim} 
                                                    onChange={e => setDataFim(e.target.value)} 
                                                />
                                            </Linha>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <SwitchInput 
                                                id="adiantar13"
                                                checked={adiantarDecimoTerceiro} 
                                                onChange={() => setAdiantarDecimoTerceiro(!adiantarDecimoTerceiro)}
                                            />
                                            <label htmlFor="adiantar13" style={{ cursor: 'pointer', fontWeight: 500, color: '#495057', fontSize: '14px' }}>
                                                Deseja adiantar o 13º salário?
                                            </label>
                                        </div>
                                        <BotaoGrupo align="end">
                                            <Botao estilo="vermilion" size="small" aoClicar={solicitarFerias}>
                                                <FaPaperPlane fill="white" /> Enviar Solicitação
                                            </Botao>
                                        </BotaoGrupo>
                                    </div>
                                </Frame>
                            )}
                            {podeAprovar && (
                                <Frame estilo="end" padding={'20px 20px 0px 0px'}>
                                    <BotaoGrupo style={{ marginTop: '12px' }}>
                                        <Botao estilo="success" size="small" aoClicar={aprovarFerias} largura="100%">
                                            <FaCheckCircle /> Aprovar
                                        </Botao>
                                        <Botao estilo="danger" size="small" aoClicar={reprovarFerias} largura="100%">
                                            <FaTimesCircle /> Reprovar
                                        </Botao>
                                    </BotaoGrupo>
                                    <div style={{borderTop: '1px solid #e9ecef', margin: '20px 0 16px'}}></div>
                                    <Botao estilo="cinza" size="small" aoClicar={cancelarSolicitacao} largura="100%">
                                        <FaBan /> Cancelar Solicitação
                                    </Botao>
                                </Frame>
                            )}
                        </AcoesContainer>
                    </ConteudoContainer>
                </Frame>
            </DialogEstilizadoRight>
        </OverlayRight>
    );
}
