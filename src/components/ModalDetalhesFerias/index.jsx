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
import { ArmazenadorToken } from '@utils';
import { Tooltip } from 'primereact/tooltip';

// Helper function to parse dates and avoid timezone issues
function parseDateAsLocal(dateString) {
    if (!dateString) return null;
    // For YYYY-MM-DD or ISO strings, which JS can treat as UTC.
    // We parse them manually to treat them as local dates.
    if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
        const [datePart] = dateString.split('T');
        const [year, month, day] = datePart.split('-').map(Number);
        // new Date(year, monthIndex, day)
        return new Date(year, month - 1, day);
    }
    // For other formats or existing Date objects
    return new Date(dateString);
}

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
    if ($type === 'marcada') return 'linear-gradient(to right, #20c997, #17a2b8)';
    if ($type === 'aprovada') return 'linear-gradient(to left, var(--black), var(--gradient-secundaria))';
    if ($type === 'acontecendo') return 'linear-gradient(to right,rgb(45, 126, 219),rgb(18, 37, 130))';
    if ($type === 'passada') return 'linear-gradient(to right, #bdbdbd, #757575)';
    return 'linear-gradient(to left, var(--black), var(--gradient-secundaria))';
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
  marcada: <FaCalendarAlt fill='white' size={14}/>,
};

function mapStatusToType(status, data_inicio, data_fim) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const isAcontecendo = () => {
        if (!data_inicio || !data_fim) return false;
        const inicio = parseDateAsLocal(data_inicio);
        inicio.setHours(0, 0, 0, 0);
        const fim = parseDateAsLocal(data_fim);
        fim.setHours(0, 0, 0, 0);
        return hoje >= inicio && hoje <= fim;
    };

    switch (status) {
        case 'A':
            return isAcontecendo() ? 'acontecendo' : 'aprovada';
        case 'M':
            return isAcontecendo() ? 'acontecendo' : 'marcada';
        case 'S':
        case 'I':
        case 'G':
        case 'D':
        case 'E':
            return 'solicitada';
        case 'C':
            return 'passada';
        case 'R':
            return 'rejeitada';
        default:
            return 'aprovada';
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

const BotaoAprovarCustom = styled(Botao)`
    background: #e6f7f2 !important;
    color: #007a5a !important;
    border: none !important;

    &:hover:not(:disabled) {
        background: #d1f0e8 !important;
    }

    svg {
        fill: #007a5a !important;
    }
`;

const BotaoReprovarCustom = styled(Botao)`
    background: #fff1f0 !important;
    color: #d92d20 !important;
    border: none !important;

    &:hover:not(:disabled) {
        background: #ffe2e0 !important;
    }

    svg {
        fill: #d92d20 !important;
    }
`;

export default function ModalDetalhesFerias({ opened, evento, aoFechar }) {

    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [numeroDiasFerias, setNumeroDiasFerias] = useState('');
    const [adiantarDecimoTerceiro, setAdiantarDecimoTerceiro] = useState(false);
    const [numeroDiasAbono, setNumeroDiasAbono] = useState('');
    const [dataPagamento, setDataPagamento] = useState('');
    const [mostrarErro45Dias, setMostrarErro45Dias] = useState(false);
    const [mostrarErroDatas, setMostrarErroDatas] = useState(false);
    const [mostrarErroDiasMinimos, setMostrarErroDiasMinimos] = useState(false);
    const [mostrarErroSaldoDias, setMostrarErroSaldoDias] = useState(false);
    const [mostrarErroAbono, setMostrarErroAbono] = useState(false);
    const [botaoEnviarDesabilitado, setBotaoEnviarDesabilitado] = useState(false);

    const userPerfil = ArmazenadorToken.UserProfile;
    const perfisEspeciais = ['analista', 'supervisor', 'gestor'];
    const isPerfilEspecial = perfisEspeciais.includes(userPerfil);
    const isAnalistaTenant = userPerfil === 'analista_tenant';
    const podeAnalistaTenantAprovar = import.meta.env.VITE_OPTIONS_ACESSO_COLABORADOR !== 'false';

    const perfisQueAprovam = ['analista', 'supervisor', 'gestor'];
    if (podeAnalistaTenantAprovar) {
        perfisQueAprovam.push('analista_tenant');
    }
    
    const temPermissaoParaVerBotao = perfisQueAprovam.includes(userPerfil);

    const verificar45Dias = (novaData) => {
        if (!novaData) {
            setMostrarErro45Dias(false);
            setBotaoEnviarDesabilitado(false);
            return;
        }

        const inicio = parseDateAsLocal(novaData);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const diffTime = inicio - hoje;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 45) {
            setMostrarErro45Dias(true);
            // Só desabilita o botão para perfis não especiais
            setBotaoEnviarDesabilitado(!isPerfilEspecial);
        } else {
            setMostrarErro45Dias(false);
            setBotaoEnviarDesabilitado(false);
        }
    };

    const validarDatas = (inicio, fim) => {
        if (!inicio || !fim) return;

        const dataInicio = parseDateAsLocal(inicio);
        const dataFim = parseDateAsLocal(fim);

        // Validar ordem das datas
        const datasInvalidas = dataInicio > dataFim;
        setMostrarErroDatas(datasInvalidas);

        // Validar quantidade mínima de dias usando numeroDiasFerias
        const diasSolicitados = parseInt(numeroDiasFerias) || 0;
        const diasInsuficientes = diasSolicitados < 5;
        setMostrarErroDiasMinimos(diasInsuficientes);

        // Validar saldo de dias disponíveis
        const saldoDisponivel = eventoCompletado?.evento?.saldo_dias ?? 30;
        const excedeSaldo = diasSolicitados > saldoDisponivel;
        setMostrarErroSaldoDias(excedeSaldo);

        // Validar dias de abono
        const abonoDias = parseInt(numeroDiasAbono) || 0;
        const maxAbono = Math.min(10, diasSolicitados, saldoDisponivel);
        const abonoInvalido = abonoDias > maxAbono;
        setMostrarErroAbono(abonoInvalido);

        // Desabilitar botão se houver qualquer erro
        setBotaoEnviarDesabilitado(
            datasInvalidas || 
            diasInsuficientes || 
            excedeSaldo || 
            abonoInvalido ||
            (mostrarErro45Dias && !isPerfilEspecial)
        );
    };

    const calcularDataFim = (dataInicio, diasSolicitados) => {
        if (!dataInicio || !diasSolicitados) return '';
        
        const inicio = parseDateAsLocal(dataInicio);
        const fim = new Date(inicio);
        fim.setDate(fim.getDate() + diasSolicitados - 1); // -1 porque inclui o dia inicial
        
        return fim.toISOString().split('T')[0];
    };

    const calcularDataPagamento = (dataInicio) => {
        if (!dataInicio) return '';
        
        const inicio = parseDateAsLocal(dataInicio);
        const dataPagamento = new Date(inicio);
        
        // Subtrai 2 dias úteis (segunda a sexta)
        let diasSubtraidos = 0;
        let diasParaSubtrair = 2;
        
        while (diasSubtraidos < diasParaSubtrair) {
            dataPagamento.setDate(dataPagamento.getDate() - 1);
            
            // Verifica se é dia útil (segunda = 1, terça = 2, ..., sexta = 5)
            const diaSemana = dataPagamento.getDay();
            if (diaSemana >= 1 && diaSemana <= 5) {
                diasSubtraidos++;
            }
        }
        
        return dataPagamento.toISOString().split('T')[0];
    };

    const handleDataInicioChange = (e) => {
        const novaData = e.target.value;
        setDataInicio(novaData);
        verificar45Dias(novaData);
        
        // Auto-preenche a data de fim baseada no número de dias de férias
        if (novaData && numeroDiasFerias) {
            const dataFimCalculada = calcularDataFim(novaData, parseInt(numeroDiasFerias));
            setDataFim(dataFimCalculada);
            validarDatas(novaData, dataFimCalculada);
        } else {
            setDataFim('');
            validarDatas('', dataFim);
        }
        
        // Sugere data de pagamento como 2 dias úteis antes do início
        if (novaData && !dataPagamento) {
            const dataPagamentoSugerida = calcularDataPagamento(novaData);
            setDataPagamento(dataPagamentoSugerida);
        }
    };

    const handleDataFimChange = (e) => {
        const novaData = e.target.value;
        setDataFim(novaData);
        validarDatas(dataInicio, novaData);
    };

    const handleNumeroDiasFeriasChange = (e) => {
        const novoNumero = e.target.value;
        setNumeroDiasFerias(novoNumero);
        
        // Recalcula a data de fim se já tiver data de início
        if (dataInicio && novoNumero) {
            const dataFimCalculada = calcularDataFim(dataInicio, parseInt(novoNumero));
            setDataFim(dataFimCalculada);
            validarDatas(dataInicio, dataFimCalculada);
        }
    };

    const handleAbonoChange = (e) => {
        const novoAbono = e.target.value;
        setNumeroDiasAbono(novoAbono);
        
        // Validar abono
        const abonoDias = parseInt(novoAbono) || 0;
        const saldoDisponivel = eventoCompletado?.evento?.saldo_dias ?? 30;
        const diasSolicitados = parseInt(numeroDiasFerias) || 0;
        const maxAbono = Math.min(10, diasSolicitados, saldoDisponivel);
        
        const abonoInvalido = abonoDias > maxAbono;
        setMostrarErroAbono(abonoInvalido);
        
        setBotaoEnviarDesabilitado(
            mostrarErroDatas || 
            mostrarErroDiasMinimos || 
            mostrarErroSaldoDias || 
            abonoInvalido ||
            (mostrarErro45Dias && !isPerfilEspecial)
        );
    };

    // Inicializar numeroDiasFerias com o saldo disponível quando o modal abrir
    React.useEffect(() => {
        if (opened && evento) {
            const saldoDisponivel = evento?.evento?.saldo_dias ?? evento?.evento?.nrodiasferias ?? 30;
            setNumeroDiasFerias(saldoDisponivel.toString());
        }
    }, [opened, evento]);

    if (!evento) return null;

    const eventoNormalizado = {
        ...evento,
        evento: {
            ...evento.evento,
            data_inicio: evento.evento?.dt_inicio || evento.evento?.data_inicio,
            data_fim: evento.evento?.dt_fim || evento.evento?.data_fim,
        }
    };

    const statusType = eventoNormalizado.tipo || mapStatusToType(eventoNormalizado.evento?.status, eventoNormalizado.evento?.data_inicio, eventoNormalizado.evento?.data_fim);

    let totalDias = null;
    if (eventoNormalizado.evento?.data_inicio && eventoNormalizado.evento?.data_fim) {
        const inicio = parseDateAsLocal(eventoNormalizado.evento.data_inicio);
        const fim = parseDateAsLocal(eventoNormalizado.evento.data_fim);
        totalDias = Math.floor((fim - inicio) / (1000 * 60 * 60 * 24)) + 1;
    }

    const saldoBase = 30;
    let saldoFinal = eventoNormalizado.evento?.saldo_dias ?? eventoNormalizado.evento?.nrodiasferias ?? saldoBase;
    if ((statusType === 'passada' || statusType === 'finalizada' || statusType === 'acontecendo') && totalDias !== null) {
        saldoFinal = saldoBase - totalDias;
    }
    
    const eventoCompletado = {
        ...eventoNormalizado,
        evento: {
            ...eventoNormalizado.evento,
            periodo_aquisitivo_inicio: eventoNormalizado.evento?.periodo_aquisitivo_inicio,
            periodo_aquisitivo_fim: eventoNormalizado.evento?.periodo_aquisitivo_fim,
            saldo_dias: saldoFinal,
            data_solicitacao: eventoNormalizado.evento?.data_solicitacao || eventoNormalizado.evento?.criado_em
        }
    };

    const gestor = eventoCompletado.colab?.gestor;
    const hoje = new Date();
    const diaDoMes = hoje.getDate();

    const isStatusPendente = eventoCompletado.evento?.status === 'E' || eventoCompletado.evento?.status === 'S';
    const podeAprovar = isStatusPendente && temPermissaoParaVerBotao;

    const aprovarFerias = async () => {
        
        const tarefaPendente = eventoCompletado.evento?.tarefas?.find(
            t => t.status === 'pendente' && t.tipo_codigo == 'aprovar_ferias'
        );

        if (!tarefaPendente) {
            return aoFechar({ erro: true, mensagem: 'Nenhuma tarefa pendente encontrada para aprovação.' });
        }

        try {
            await http.post(`/tarefas/${tarefaPendente.id}/aprovar/`);
            aoFechar({ sucesso: true, mensagem: 'Férias aprovadas com sucesso!' });
        } catch (error) {
            console.error("Erro ao aprovar tarefa de férias", error);
            const errorMessage = error.response?.data?.detail || 'Não foi possível aprovar a solicitação.';
            aoFechar({ erro: true, mensagem: errorMessage });
        }
    };
    const reprovarFerias = async () => {
        const tarefaPendente = eventoCompletado.evento?.tarefas?.find(
            t => t.status === 'pendente' && t.tipo_codigo == 'aprovar_ferias'
        );

        if (!tarefaPendente) {
            return aoFechar({ erro: true, mensagem: 'Nenhuma tarefa pendente encontrada para rejeição.' });
        }

        try {
            await http.post(`/tarefas/${tarefaPendente.id}/rejeitar/`);
            aoFechar({ sucesso: true, mensagem: 'Solicitação de férias reprovada.' });
        } catch (error) {
            console.error("Erro ao reprovar férias", error);
            const errorMessage = error.response?.data?.detail || 'Não foi possível reprovar a solicitação.';
            aoFechar({ erro: true, mensagem: errorMessage });
        }
    };
    
    let statusLabel = '';
    switch (statusType) {
      case 'aSolicitar': statusLabel = 'Recesso a vencer'; break;
      case 'solicitada': statusLabel = 'Aprovação pendente'; break;
      case 'marcada': statusLabel = 'Férias Marcadas'; break;
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
            Os dias de descanso gozados após o período legal de concessão deverão ser remunerados em dobro. O colaborador deve solicitar as férias até <b>{format(parseDateAsLocal(eventoCompletado.evento.limite), 'dd/MM/yyyy')}</b>
          </span>
        </AlertaAviso>
      );
    }
    const temPermissaoAddFerias = ArmazenadorToken.hasPermission('add_ferias');
    const podeSolicitar = statusType === 'aSolicitar' && temPermissaoAddFerias;
    const solicitarFerias = async () => {
        if (!dataInicio || !dataFim || !numeroDiasFerias) {
            aoFechar({ aviso: true, mensagem: 'Por favor, preencha as datas de início e fim e o número de dias.' });
            return;
        }
        if (new Date(dataInicio) > new Date(dataFim)) {
            aoFechar({ aviso: true, mensagem: 'A data de início não pode ser posterior à data de fim.' });
            return;
        }

        const diasSolicitados = parseInt(numeroDiasFerias);
        const saldoDisponivel = eventoCompletado.evento.saldo_dias;

        if (diasSolicitados > saldoDisponivel) {
            aoFechar({ aviso: true, mensagem: `Você pode solicitar no máximo ${saldoDisponivel} dias de férias.` });
            return;
        }

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const inicio = parseDateAsLocal(dataInicio);
        const diffTime = inicio - hoje;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 45) {
            const perfisEspeciais = ['analista', 'supervisor', 'gestor'];
            if (perfisEspeciais.includes(userPerfil)) {
                // Para perfis especiais, apenas avisa mas permite continuar
                aoFechar({ aviso: true, mensagem: 'A data de início das férias está a menos de 45 dias do dia de hoje. A solicitação será processada mesmo assim.' });
                return;
            } else {
                aoFechar({ aviso: true, mensagem: 'A solicitação de férias deve ser feita com no mínimo 45 dias de antecedência.' });
                return;
            }
        }
        
        try {
            await http.post(`/funcionario/${eventoCompletado.colab.id}/solicita_ferias/`, {
                data_inicio: dataInicio,
                data_fim: dataFim,
                adiantar_13: adiantarDecimoTerceiro,
                nrodiasabono: parseInt(numeroDiasAbono, 10) || 0,
                data_pagamento: dataPagamento || null
            });
            aoFechar({ sucesso: true, mensagem: 'Solicitação de férias enviada com sucesso!' });
        } catch (error) {
            console.error("Erro ao solicitar férias", error);
            const errorMessage = error.response?.data?.detail || 'Erro ao solicitar férias. Por favor, tente novamente.';
            aoFechar({ erro: true, mensagem: errorMessage });
        }
    };

    const tituloPeriodo = (statusType === 'acontecendo' || statusType === 'passada' || statusType === 'aprovada' || statusType === 'finalizada' || statusType === 'solicitada' || statusType === 'marcada') ? 'Período de Férias' : 'Período Solicitado';

    return (
        <OverlayRight $opened={opened} onClick={() => aoFechar()}>
            <DialogEstilizadoRight $align="flex-end" open={opened} $opened={opened} onClick={e => e.stopPropagation()}>
                <Frame style={{padding: '24px 32px'}}>
                    <CabecalhoFlex>
                        <StatusTag $type={statusType}>
                            {statusIcons[statusType]} {statusLabel}
                        </StatusTag>
                        <BotaoFechar onClick={() => aoFechar()} formMethod="dialog">
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
                                            <DataValor>{format(parseDateAsLocal(eventoCompletado.evento.periodo_aquisitivo_inicio), 'dd/MM/yyyy')}</DataValor>
                                        </BlocoDataTexto>
                                    </BlocoData>
                                    <BlocoData>
                                        <BlocoDataIcone><FaCalendarAlt size={20}/></BlocoDataIcone>
                                        <BlocoDataTexto>
                                            <DataTitulo>Fim</DataTitulo>
                                            <DataValor>{format(parseDateAsLocal(eventoCompletado.evento.periodo_aquisitivo_fim), 'dd/MM/yyyy')}</DataValor>
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
                                                <Link to={`/colaborador/detalhes/${eventoCompletado.colab?.id}`}>
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
                                                {format(parseDateAsLocal(eventoCompletado.evento.data_solicitacao), "dd/MM/yyyy 'às' HH:mm")}
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
                                    <BlocoDatas>
                                        {eventoCompletado.evento?.data_inicio && (
                                            <BlocoData>
                                                <BlocoDataIcone><FaCalendarCheck size={20}/></BlocoDataIcone>
                                                <BlocoDataTexto>
                                                    <DataTitulo>Início</DataTitulo>
                                                    <DataValor>{format(parseDateAsLocal(eventoCompletado.evento.data_inicio), 'dd/MM/yyyy')}</DataValor>
                                                    <DataDiaSemana>{format(parseDateAsLocal(eventoCompletado.evento.data_inicio), 'EEEE', { locale: ptBR })}</DataDiaSemana>
                                                </BlocoDataTexto>
                                            </BlocoData>
                                        )}
                                        {eventoCompletado.evento?.data_fim && (
                                            <BlocoData>
                                                <BlocoDataIcone><FaCalendarCheck size={20}/></BlocoDataIcone>
                                                <BlocoDataTexto>
                                                    <DataTitulo>Fim</DataTitulo>
                                                    <DataValor>{format(parseDateAsLocal(eventoCompletado.evento.data_fim), 'dd/MM/yyyy')}</DataValor>
                                                    <DataDiaSemana>{format(parseDateAsLocal(eventoCompletado.evento.data_fim), 'EEEE', { locale: ptBR })}</DataDiaSemana>
                                                </BlocoDataTexto>
                                            </BlocoData>
                                        )}
                                        {totalDias && (
                                            <BlocoData>
                                                <BlocoDataIcone><FaCalculator size={20}/></BlocoDataIcone>
                                                <BlocoDataTexto>
                                                    <DataTitulo>Total de dias</DataTitulo>
                                                    <DataValor>{totalDias} dias</DataValor>
                                                </BlocoDataTexto>
                                            </BlocoData>
                                        )}
                                    </BlocoDatas>
                                </Frame>
                            )}
                            
                            {statusType === 'aSolicitar' && !temPermissaoAddFerias && (
                                <Frame>
                                    <DetalhesTitulo style={{ marginTop: 0 }}>Solicitar Período</DetalhesTitulo>
                                    <AlertaAviso>
                                        <FaExclamationCircle size={20} style={{ color: '#ffc107', flexShrink: 0 }}/>
                                        <span>
                                            Você não tem permissão para solicitar férias. Entre em contato com o seu gestor ou RH.
                                        </span>
                                    </AlertaAviso>
                                </Frame>
                            )}
                            {podeSolicitar && (
                                <Frame>
                                    <DetalhesTitulo style={{ marginTop: 0 }}>Solicitar Período</DetalhesTitulo>
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '12px', width: '100%'}}>
                                        <div style={{display: 'flex', gap: 16}}>
                                            <Linha style={{flex: 2}}>
                                                <Label>Data de Início</Label>
                                                <DataInput 
                                                    type="date" 
                                                    value={dataInicio} 
                                                    onChange={handleDataInicioChange}
                                                />
                                            </Linha>
                                            <Linha style={{flex: 1}}>
                                                <Label>Dias de férias</Label>
                                                <DataInput
                                                    type="number"
                                                    value={numeroDiasFerias}
                                                    onChange={handleNumeroDiasFeriasChange}
                                                    placeholder="0"
                                                    min="1"
                                                    max={eventoCompletado?.evento?.saldo_dias ?? 30}
                                                />
                                            </Linha>
                                            <Linha style={{flex: 2}}>
                                                <Label>Data de Fim</Label>
                                                <DataInput 
                                                    type="date" 
                                                    value={dataFim} 
                                                    onChange={handleDataFimChange}
                                                />
                                            </Linha>
                                        </div>

                                        {mostrarErroDatas && (
                                            <AlertaAviso>
                                                <FaExclamationCircle size={20} style={{ color: '#ffc107', flexShrink: 0 }}/>
                                                <span>
                                                    A data de início não pode ser posterior à data de fim das férias.
                                                </span>
                                            </AlertaAviso>
                                        )}

                                        {mostrarErroDiasMinimos && (
                                            <AlertaAviso>
                                                <FaExclamationCircle size={20} style={{ color: '#ffc107', flexShrink: 0 }}/>
                                                <span>
                                                    O período de férias deve ter no mínimo 5 dias.
                                                </span>
                                            </AlertaAviso>
                                        )}

                                        {mostrarErroSaldoDias && (
                                            <AlertaAviso>
                                                <FaExclamationCircle size={20} style={{ color: '#ffc107', flexShrink: 0 }}/>
                                                <span>
                                                    O período selecionado excede o saldo de dias disponíveis ({eventoCompletado?.evento?.saldo_dias ?? 30} dias).
                                                </span>
                                            </AlertaAviso>
                                        )}

                                        {mostrarErroAbono && (
                                            <AlertaAviso>
                                                <FaExclamationCircle size={20} style={{ color: '#ffc107', flexShrink: 0 }}/>
                                                <span>
                                                    O número de dias de abono não pode ser maior que o número de dias solicitados ou o saldo disponível.
                                                </span>
                                            </AlertaAviso>
                                        )}

                                        {mostrarErro45Dias && (
                                            <AlertaAviso>
                                                <FaExclamationCircle size={20} style={{ color: '#ffc107', flexShrink: 0 }}/>
                                                <span>
                                                    A solicitação de férias deve ser feita com no mínimo 45 dias de antecedência. 
                                                    {!isPerfilEspecial 
                                                        ? " Entre em contato com o seu gestor ou RH para solicitar uma exceção."
                                                        : " Você tem permissão para prosseguir com a solicitação mesmo assim."}
                                                </span>
                                            </AlertaAviso>
                                        )}

                                        <Linha>
                                            <Label>Número de dias de Abono</Label>
                                            <DataInput
                                                type="number"
                                                value={numeroDiasAbono}
                                                onChange={handleAbonoChange}
                                                placeholder="0"
                                                min="0"
                                                max="10"
                                            />
                                        </Linha>
                                        <Linha>
                                            <Label>Data de Pagamento (opcional)</Label>
                                            <DataInput
                                                type="date"
                                                value={dataPagamento}
                                                onChange={e => setDataPagamento(e.target.value)}
                                                placeholder="Selecione a data"
                                            />
                                        </Linha>
                                        
                                        {dataPagamento && (
                                            <AlertaAviso>
                                                <FaExclamationCircle size={20} style={{ color: '#ffc107', flexShrink: 0 }}/>
                                                <span>
                                                    A data de pagamento foi sugerida como <strong>2 dias úteis antes do início das férias</strong>. 
                                                    Você pode alterar esta data conforme necessário. <strong>Valide se há feriados ou outros impedimentos na data sugerida.</strong>
                                                </span>
                                            </AlertaAviso>
                                        )}

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
                                            <Botao 
                                                estilo="vermilion" 
                                                size="small" 
                                                aoClicar={solicitarFerias}
                                                disabled={botaoEnviarDesabilitado}
                                            >
                                                <FaPaperPlane fill="var(--secundaria)" /> Enviar Solicitação
                                            </Botao>
                                        </BotaoGrupo>
                                    </div>
                                </Frame>
                            )}
                            {podeAprovar && (
                                <Frame estilo="end" padding={'20px 20px 0px 0px'}>
                                    <BotaoGrupo style={{ marginTop: '12px' }}>
                                        <BotaoAprovarCustom size="small" aoClicar={aprovarFerias} largura="100%">
                                            <FaCheckCircle /> Aprovar
                                        </BotaoAprovarCustom>
                                        <BotaoReprovarCustom size="small" aoClicar={reprovarFerias} largura="100%">
                                            <FaTimesCircle /> Reprovar
                                        </BotaoReprovarCustom>
                                    </BotaoGrupo>
                                </Frame>
                            )}
                        </AcoesContainer>
                    </ConteudoContainer>
                </Frame>
            </DialogEstilizadoRight>
        </OverlayRight>
    );
}
