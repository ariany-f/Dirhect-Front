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
    if ($type === 'finalizada') return 'linear-gradient(to right, #6c757d, #495057)';
    if ($type === 'paga') return 'linear-gradient(to right, #28a745, #20c997)';
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
  finalizada: <FaCheckCircle fill='white' size={14}/>,
  paga: <FaCheckCircle fill='white' size={14}/>,
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
        case 'F':
            return 'finalizada';
        case 'P':
            return 'paga';
        case 'X':
            return 'finalizada';
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
            return isAcontecendo() ? 'acontecendo' : 'aprovada';
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

const AlertaErro = styled.div`
    background: #fef2f2;
    color: #dc2626;
    border-left: 4px solid #dc2626;
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
    flex-direction: row;
    gap: 24px;
    align-items: flex-start;
    width: 100%;
    max-height: 75vh;
    overflow-y: auto;
    padding-right: 8px;
    flex: 1;
    
    /* Estilização da scrollbar */
    &::-webkit-scrollbar {
        width: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 10px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }
`;

const DetalhesContainer = styled.div`
    flex: 1 1 50%;
    min-width: calc(50% - 12px);
    max-width: calc(50% - 12px);
    max-height: 100%;
    overflow-y: auto;
    
    /* Estilização da scrollbar */
    &::-webkit-scrollbar {
        width: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 10px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }
    
    & > ${DetalhesCard} > ${DetalhesTitulo}:first-child {
        margin-top: 0;
    }
`;

const AcoesContainer = styled.div`
    flex: 1 1 50%;
    min-width: calc(50% - 12px);
    max-width: calc(50% - 12px);
    max-height: 100%;
    overflow-y: auto;
    
    /* Estilização da scrollbar */
    &::-webkit-scrollbar {
        width: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 10px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
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

export default function ModalDetalhesFerias({ opened, evento, aoFechar, isDemitido = false }) {

    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [numeroDiasFerias, setNumeroDiasFerias] = useState('');
    const [adiantarDecimoTerceiro, setAdiantarDecimoTerceiro] = useState(false);
    const [numeroDiasAbono, setNumeroDiasAbono] = useState('');
    const [dataPagamento, setDataPagamento] = useState('');
    const [avisoFerias, setAvisoFerias] = useState('');
    const [abonoPecuniario, setAbonoPecuniario] = useState(false);
    const [feriasColetivas, setFeriasColetivas] = useState(false);
    const [mostrarErroAntecedencia, setMostrarErro45Dias] = useState(false);
    const [mostrarErroDatas, setMostrarErroDatas] = useState(false);
    const [mostrarErroDiasMinimos, setMostrarErroDiasMinimos] = useState(false);
    const [mostrarErroSaldoDias, setMostrarErroSaldoDias] = useState(false);
    const [mostrarErroAbono, setMostrarErroAbono] = useState(false);
    const [mostrarErroSaldoTotal, setMostrarErroSaldoTotal] = useState(false);
    const [mostrarErroAdiantamento13, setMostrarErroAdiantamento13] = useState(false);
    const [botaoEnviarDesabilitado, setBotaoEnviarDesabilitado] = useState(false);
    const [parametrosFerias, setParametrosFerias] = useState({});
    const [podeAnalistaTenantAprovar, setPodeAnalistaTenantAprovar] = useState(false); // Default false - sem acesso até confirmar

    const userPerfil = ArmazenadorToken.UserProfile;
    const perfisEspeciais = ['analista', 'supervisor', 'gestor'];
    const isAnalistaTenant = userPerfil === 'analista_tenant';
    
    // Perfis especiais que podem ignorar a validação de dias de antecedência
    const isPerfilEspecial = perfisEspeciais.includes(userPerfil);

    // Perfis que podem aprovar férias (inclui analista_tenant se tiver permissão)
    const perfisQueAprovam = ['analista', 'supervisor', 'gestor'];
    if (podeAnalistaTenantAprovar) {
        perfisQueAprovam.push('analista_tenant');
    }
    
    const temPermissaoParaVerBotao = perfisQueAprovam.includes(userPerfil);

    const verificarDiasAntecedencia = (novaData) => {
        if (!novaData) {
            setMostrarErro45Dias(false);
            setBotaoEnviarDesabilitado(false);
            return;
        }

        const diasMinimosAntecedencia = parseInt(parametrosFerias.DIAS_MINIMOS_ANTECEDENCIA) || 45; // Fallback para 45 se não houver parâmetro

        const inicio = parseDateAsLocal(novaData);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const diffTime = inicio - hoje;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        console.log('Debug verificarDiasAntecedencia:', {
            userPerfil,
            isPerfilEspecial,
            diffDays,
            diasMinimosAntecedencia,
            podeAnalistaTenantAprovar
        });

        if (diffDays < (diasMinimosAntecedencia+1)) {
            setMostrarErro45Dias(true);
            // Desabilita o botão se não for perfil especial (analista, supervisor, gestor)
            setBotaoEnviarDesabilitado(!isPerfilEspecial);
        } else {
            setMostrarErro45Dias(false);
            setBotaoEnviarDesabilitado(false);
        }
    };

    const validarDatas = (inicio, fim, diasFerias = null) => {
        if (!inicio || !fim) return;

        const dataInicio = parseDateAsLocal(inicio);
        const dataFim = parseDateAsLocal(fim);

        // Validar ordem das datas
        const datasInvalidas = dataInicio > dataFim;
        setMostrarErroDatas(datasInvalidas);

        // Validar quantidade mínima de dias usando o parâmetro diasFerias ou numeroDiasFerias
        const diasSolicitados = diasFerias !== null ? parseInt(diasFerias) || 0 : parseInt(numeroDiasFerias) || 0;
        console.log('Debug validarDatas:', { diasFerias, numeroDiasFerias, diasSolicitados });
        const diasInsuficientes = diasSolicitados < 5;
        setMostrarErroDiasMinimos(diasInsuficientes);

        // Validar saldo de dias disponíveis
        const saldoDisponivel = evento?.evento?.saldo_dias ?? evento?.evento?.nrodiasferias ?? 30;
        const excedeSaldo = diasSolicitados > saldoDisponivel;
        setMostrarErroSaldoDias(excedeSaldo);

        // Validar dias de abono individualmente
        const abonoDias = parseInt(numeroDiasAbono) || 0;
        // Abono não pode exceder 10 dias
        const abonoExcede10 = abonoPecuniario && abonoDias > 10;
        setMostrarErroAbono(abonoExcede10);

        // Nova validação: soma de abono + férias não pode ultrapassar saldo
        const somaTotal = diasSolicitados + (abonoPecuniario ? abonoDias : 0);
        const excedeSaldoTotal = somaTotal > saldoDisponivel;
        setMostrarErroSaldoTotal(excedeSaldoTotal);

        // Validar adiantamento do 13º salário
        const mesInicio = dataInicio.getMonth() + 1; // getMonth() retorna 0-11, então +1 para 1-12
        const adiantamentoInvalido = adiantarDecimoTerceiro && (mesInicio === 1 || mesInicio === 12);
        setMostrarErroAdiantamento13(adiantamentoInvalido);

        // Validar dias de antecedência diretamente aqui
        const diasMinimosAntecedencia = parseInt(parametrosFerias.DIAS_MINIMOS_ANTECEDENCIA) || 45;
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const diffTime = dataInicio - hoje;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const erroAntecedencia = diffDays < (diasMinimosAntecedencia + 1);

        // Desabilitar botão se houver qualquer erro
        setBotaoEnviarDesabilitado(
            datasInvalidas || 
            diasInsuficientes || 
            excedeSaldo || 
            abonoExcede10 ||
            excedeSaldoTotal ||
            adiantamentoInvalido ||
            (erroAntecedencia && !isPerfilEspecial)
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

    const calcularDataAvisoFerias = (dataInicio) => {
        if (!dataInicio) return '';
        
        const inicio = parseDateAsLocal(dataInicio);
        const dataAviso = new Date(inicio);
        
        // Subtrai 30 dias corridos
        dataAviso.setDate(dataAviso.getDate() - 30);
        
        return dataAviso.toISOString().split('T')[0];
    };

    const handleDataInicioChange = (e) => {
        const novaData = e.target.value;
        setDataInicio(novaData);
        verificarDiasAntecedencia(novaData);
        
        // Auto-preenche a data de fim baseada no número de dias de férias
        if (novaData && numeroDiasFerias) {
            const dataFimCalculada = calcularDataFim(novaData, parseInt(numeroDiasFerias));
            setDataFim(dataFimCalculada);
            validarDatas(novaData, dataFimCalculada);
        } else {
            setDataFim('');
            validarDatas('', dataFim);
        }
        
        // Recalcula data de pagamento como 2 dias úteis antes do início
        if (novaData) {
            const dataPagamentoSugerida = calcularDataPagamento(novaData);
            setDataPagamento(dataPagamentoSugerida);
        } else {
            setDataPagamento('');
        }
        
        // Recalcula data de aviso de férias como 30 dias corridos antes do início
        if (novaData) {
            const dataAvisoSugerida = calcularDataAvisoFerias(novaData);
            setAvisoFerias(dataAvisoSugerida);
        } else {
            setAvisoFerias('');
        }
        
        // Validar adiantamento do 13º salário quando a data de início muda
        if (novaData && adiantarDecimoTerceiro) {
            const dataInicio = parseDateAsLocal(novaData);
            const mesInicio = dataInicio.getMonth() + 1;
            const adiantamentoInvalido = mesInicio === 1 || mesInicio === 12;
            setMostrarErroAdiantamento13(adiantamentoInvalido);
        } else {
            setMostrarErroAdiantamento13(false);
        }
    };

    const handleDataFimChange = (e) => {
        const novaData = e.target.value;
        setDataFim(novaData);
        
        // Calcular automaticamente os dias de férias baseado nas datas
        if (dataInicio && novaData) {
            const inicio = parseDateAsLocal(dataInicio);
            const fim = parseDateAsLocal(novaData);
            
            if (fim >= inicio) {
                const diasCalculados = Math.floor((fim - inicio) / (1000 * 60 * 60 * 24)) + 1;
                setNumeroDiasFerias(diasCalculados.toString());
                validarDatas(dataInicio, novaData, diasCalculados.toString());
            } else {
                validarDatas(dataInicio, novaData, numeroDiasFerias);
            }
        } else {
            validarDatas(dataInicio, novaData, numeroDiasFerias);
        }
    };

    const handleNumeroDiasFeriasChange = (e) => {
        const novoNumero = e.target.value;
        console.log('Debug handleNumeroDiasFeriasChange:', { novoNumero, numeroDiasFerias });
        
        // Validar se é um número válido e não negativo
        const numeroInt = parseInt(novoNumero);
        if (novoNumero !== '' && (isNaN(numeroInt) || numeroInt < 0)) {
            return; // Não atualiza o estado se for inválido
        }
        
        setNumeroDiasFerias(novoNumero);
        
        // Recalcula a data de fim se já tiver data de início
        if (dataInicio && novoNumero) {
            const dataFimCalculada = calcularDataFim(dataInicio, parseInt(novoNumero));
            setDataFim(dataFimCalculada);
            validarDatas(dataInicio, dataFimCalculada, novoNumero);
        } else {
            // Valida usando o novo valor digitado
            if (novoNumero) {
                const diasSolicitados = parseInt(novoNumero) || 0;
                console.log('Debug validação direta:', { diasSolicitados });
                const diasInsuficientes = diasSolicitados < 5;
                setMostrarErroDiasMinimos(diasInsuficientes);
                
                const saldoDisponivel = evento?.evento?.saldo_dias ?? 30;
                const excedeSaldo = diasSolicitados > saldoDisponivel;
                setMostrarErroSaldoDias(excedeSaldo);
                
                // Validar soma total usando o novo valor
                const abonoDias = parseInt(numeroDiasAbono) || 0;
                const somaTotal = diasSolicitados + (abonoPecuniario ? abonoDias : 0);
                const excedeSaldoTotal = somaTotal > saldoDisponivel;
                setMostrarErroSaldoTotal(excedeSaldoTotal);
                
                // Validar dias de antecedência se tiver data de início
                let erroAntecedencia = false;
                if (dataInicio) {
                    const diasMinimosAntecedencia = parseInt(parametrosFerias.DIAS_MINIMOS_ANTECEDENCIA) || 45;
                    const hoje = new Date();
                    hoje.setHours(0, 0, 0, 0);
                    const inicio = parseDateAsLocal(dataInicio);
                    const diffTime = inicio - hoje;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    erroAntecedencia = diffDays < (diasMinimosAntecedencia + 1);
                }
                
                // Atualizar estado do botão
                setBotaoEnviarDesabilitado(
                    diasInsuficientes || 
                    excedeSaldo || 
                    excedeSaldoTotal ||
                    (erroAntecedencia && !isPerfilEspecial)
                );
            } else {
                // Se campo vazio, limpar erros
                setMostrarErroDiasMinimos(false);
                setMostrarErroSaldoDias(false);
                setMostrarErroSaldoTotal(false);
                setBotaoEnviarDesabilitado(false);
            }
        }
    };

    const handleAbonoChange = (e) => {
        const novoAbono = e.target.value;
        
        // Validar se é um número válido e não negativo
        const numeroInt = parseInt(novoAbono);
        if (novoAbono !== '' && (isNaN(numeroInt) || numeroInt < 0)) {
            return; // Não atualiza o estado se for inválido
        }
        
        setNumeroDiasAbono(novoAbono);
        
        // Validar abono
        const abonoDias = parseInt(novoAbono) || 0;
        const saldoDisponivel = evento?.evento?.saldo_dias ?? evento?.evento?.nrodiasferias ?? 30;
        const diasSolicitados = parseInt(numeroDiasFerias) || 0;
        
        console.log('Debug handleAbonoChange:', { 
            novoAbono, 
            abonoDias, 
            diasSolicitados, 
            saldoDisponivel, 
            abonoPecuniario,
            somaTotal: diasSolicitados + (abonoPecuniario ? abonoDias : 0)
        });
        
        // Abono não pode exceder 10 dias
        const abonoExcede10 = abonoPecuniario && abonoDias > 10;
        setMostrarErroAbono(abonoExcede10);
        
        // Nova validação: soma de abono + férias não pode ultrapassar saldo
        const somaTotal = diasSolicitados + (abonoPecuniario ? abonoDias : 0);
        const excedeSaldoTotal = somaTotal > saldoDisponivel;
        setMostrarErroSaldoTotal(excedeSaldoTotal);
        
        // Validar dias de antecedência se tiver data de início
        let erroAntecedencia = false;
        if (dataInicio) {
            const diasMinimosAntecedencia = parseInt(parametrosFerias.DIAS_MINIMOS_ANTECEDENCIA) || 45;
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            const inicio = parseDateAsLocal(dataInicio);
            const diffTime = inicio - hoje;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            erroAntecedencia = diffDays < (diasMinimosAntecedencia + 1);
        }
        
        setBotaoEnviarDesabilitado(
            mostrarErroDatas || 
            mostrarErroDiasMinimos || 
            mostrarErroSaldoDias || 
            abonoExcede10 ||
            excedeSaldoTotal ||
            (erroAntecedencia && !isPerfilEspecial)
        );
    };

    // Inicializar numeroDiasFerias com o saldo disponível quando o modal abrir
    React.useEffect(() => {
        if (opened && evento) {
            const saldoDisponivel = evento?.evento?.saldo_dias ?? evento?.evento?.nrodiasferias ?? 30;
            setNumeroDiasFerias(saldoDisponivel.toString());
            const rawMin = evento?.evento?.data_minima_solicitacao;
            // Limpar a data de início - não preencher automaticamente
            setDataInicio('');

            // Buscar parâmetros de férias quando o modal abrir
            http.get('parametros/por-assunto/?assunto=FERIAS')
                .then(response => {
                    console.log('Parâmetros de férias:', response);
                    setParametrosFerias(response.parametros || {});
                })
                .catch(error => console.log('Erro ao buscar parâmetros de férias:', error));

            // Buscar parâmetros de acessos
            if(!ArmazenadorToken.UserCompanyPublicId) {
                http.get('shared/parametros/por-assunto/?assunto=ACESSOS')
                    .then(response => {
                        const parametrosAcessos = response.parametros || {};
                        // Se COLABORADOR não existir ou for true, então pode aprovar
                        const colaboradorParam = parametrosAcessos.COLABORADOR;
                        const podeAprovar = colaboradorParam === true;
                        setPodeAnalistaTenantAprovar(podeAprovar);
                    })
                    .catch(error => {
                        console.log('Erro ao buscar parâmetros de acessos:', error);
                        // Em caso de erro ou sem resposta, assume que não tem acesso
                        setPodeAnalistaTenantAprovar(false);
                    });
            }
        }
    }, [opened, evento]);

    // Limpar campo de abono quando abonoPecuniario for false e revalidar quando ativar
    React.useEffect(() => {
        if (!abonoPecuniario) {
            setNumeroDiasAbono('');
            setMostrarErroSaldoTotal(false);
            setMostrarErroAbono(false);
        } else {
            // Revalidar quando ativar abono pecuniário
            const diasSolicitados = parseInt(numeroDiasFerias) || 0;
            const abonoDias = parseInt(numeroDiasAbono) || 0;
            const saldoDisponivel = evento?.evento?.saldo_dias ?? evento?.evento?.nrodiasferias ?? 30;
            
            console.log('Debug useEffect abono:', { 
                abonoPecuniario, 
                diasSolicitados, 
                abonoDias, 
                saldoDisponivel, 
                somaTotal: diasSolicitados + abonoDias 
            });
            
            // Validar abono não exceder 10 dias
            const abonoExcede10 = abonoDias > 10;
            setMostrarErroAbono(abonoExcede10);
            
            // Validar soma total
            const somaTotal = diasSolicitados + abonoDias;
            const excedeSaldoTotal = somaTotal > saldoDisponivel;
            setMostrarErroSaldoTotal(excedeSaldoTotal);
            
            // Validar dias de antecedência se tiver data de início
            let erroAntecedencia = false;
            if (dataInicio) {
                const diasMinimosAntecedencia = parseInt(parametrosFerias.DIAS_MINIMOS_ANTECEDENCIA) || 45;
                const hoje = new Date();
                hoje.setHours(0, 0, 0, 0);
                const inicio = parseDateAsLocal(dataInicio);
                const diffTime = inicio - hoje;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                erroAntecedencia = diffDays < (diasMinimosAntecedencia + 1);
            }
            
            // Atualizar estado do botão
            setBotaoEnviarDesabilitado(
                mostrarErroDatas || 
                mostrarErroDiasMinimos || 
                mostrarErroSaldoDias || 
                abonoExcede10 ||
                excedeSaldoTotal ||
                (erroAntecedencia && !isPerfilEspecial)
            );
        }
    }, [abonoPecuniario, numeroDiasFerias, numeroDiasAbono, evento?.evento?.saldo_dias, evento?.evento?.nrodiasferias, mostrarErroDatas, mostrarErroDiasMinimos, mostrarErroSaldoDias, mostrarErroAntecedencia, isPerfilEspecial, podeAnalistaTenantAprovar, dataInicio, parametrosFerias]);

    if (!evento) return null;

    const eventoNormalizado = {
        ...evento,
        evento: {
            ...evento.evento,
            data_pagamento: evento.evento?.data_pagamento || evento.evento?.datapagamento,
            aviso_ferias: evento.evento?.aviso_ferias,
            nrodiasabono: evento.evento?.nrodiasabono,
            ferias_coletivas: evento.evento?.ferias_coletivas,
            adiantar_13: evento.evento?.adiantar_13,
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
            data_pagamento: eventoNormalizado.evento?.data_pagamento,
            aviso_ferias: eventoNormalizado.evento?.aviso_ferias,
            nrodiasabono: eventoNormalizado.evento?.nrodiasabono,
            ferias_coletivas: eventoNormalizado.evento?.ferias_coletivas,
            adiantar_13: eventoNormalizado.evento?.adiantar_13,
            data_solicitacao: eventoNormalizado.evento?.data_solicitacao || eventoNormalizado.evento?.criado_em
        }
    };

    const gestor = eventoCompletado.colab?.gestor;
    const hoje = new Date();
    const diaDoMes = hoje.getDate();

    const isStatusPendente = eventoCompletado.evento?.status === 'E';
    
    // Verificar se existe uma tarefa pendente com tipo aprovar_ferias
    const temTarefaPendenteAprovarFerias = eventoCompletado.evento?.tarefas?.some(
        t => t.status === 'pendente' && t.tipo_codigo === 'aprovar_ferias'
    );
    
    const podeAprovar = isStatusPendente && temPermissaoParaVerBotao && temTarefaPendenteAprovarFerias;

    const limparDados = () => {
        setDataInicio('');
        setDataFim('');
        setNumeroDiasFerias('');
        setAdiantarDecimoTerceiro(false);
        setNumeroDiasAbono('');
        setDataPagamento('');
        setAvisoFerias('');
        setAbonoPecuniario(false);
        setFeriasColetivas(false);
        
        // Limpar todos os estados de erro
        setMostrarErro45Dias(false);
        setMostrarErroDatas(false);
        setMostrarErroDiasMinimos(false);
        setMostrarErroSaldoDias(false);
        setMostrarErroAbono(false);
        setMostrarErroSaldoTotal(false);
        setMostrarErroAdiantamento13(false);
        setBotaoEnviarDesabilitado(false);
    };

    const fecharComLimpeza = (resultado) => {
        limparDados();
        aoFechar(resultado);
    };

    const aprovarFerias = async () => {
        
        const tarefaPendente = eventoCompletado.evento?.tarefas?.find(
            t => t.status === 'pendente' && t.tipo_codigo == 'aprovar_ferias'
        );

        if (!tarefaPendente) {
            return fecharComLimpeza({ erro: true, mensagem: 'Nenhuma tarefa pendente encontrada para aprovação.' });
        }

        try {
            await http.post(`/tarefas/${tarefaPendente.id}/aprovar/`);
            fecharComLimpeza({ sucesso: true, mensagem: 'Férias aprovadas com sucesso!' });
        } catch (error) {
            console.error("Erro ao aprovar tarefa de férias", error);
            const errorMessage = error.response?.data?.detail || 'Não foi possível aprovar a solicitação.';
            fecharComLimpeza({ erro: true, mensagem: errorMessage });
        }
    };
    const reprovarFerias = async () => {
        const tarefaPendente = eventoCompletado.evento?.tarefas?.find(
            t => t.status === 'pendente' && t.tipo_codigo == 'aprovar_ferias'
        );

        if (!tarefaPendente) {
            return fecharComLimpeza({ erro: true, mensagem: 'Nenhuma tarefa pendente encontrada para rejeição.' });
        }

        try {
            await http.post(`/tarefas/${tarefaPendente.id}/rejeitar/`);
            fecharComLimpeza({ sucesso: true, mensagem: 'Solicitação de férias reprovada.' });
        } catch (error) {
            console.error("Erro ao reprovar férias", error);
            const errorMessage = error.response?.data?.detail || 'Não foi possível reprovar a solicitação.';
            fecharComLimpeza({ erro: true, mensagem: errorMessage });
        }
    };
    
    let statusLabel = '';
    switch (statusType) {
      case 'aSolicitar': statusLabel = 'Recesso a vencer'; break;
      case 'solicitada': statusLabel = 'Aprovação pendente'; break;
      case 'marcada': statusLabel = 'Férias Marcadas'; break;
      case 'aprovada': statusLabel = 'Férias aprovadas'; break;
      case 'finalizada': statusLabel = 'Férias finalizadas'; break;
      case 'paga': statusLabel = 'Férias pagas'; break;
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
    const podeSolicitar = statusType === 'aSolicitar' && temPermissaoAddFerias && !isDemitido;
    const solicitarFerias = async () => {
        if (!dataInicio || !dataFim || !numeroDiasFerias) {
            fecharComLimpeza({ aviso: true, mensagem: 'Por favor, preencha as datas de início e fim e o número de dias.' });
            return;
        }
        if (new Date(dataInicio) > new Date(dataFim)) {
            fecharComLimpeza({ aviso: true, mensagem: 'A data de início não pode ser posterior à data de fim.' });
            return;
        }

        const diasSolicitados = parseInt(numeroDiasFerias);
        const saldoDisponivel = eventoCompletado.evento.saldo_dias;
        const abonoDias = parseInt(numeroDiasAbono) || 0;

        if (diasSolicitados > saldoDisponivel) {
            fecharComLimpeza({ aviso: true, mensagem: `Você pode solicitar no máximo ${saldoDisponivel} dias de férias.` });
            return;
        }

        // Nova validação: soma de abono + férias não pode ultrapassar saldo
        const somaTotal = diasSolicitados + (abonoPecuniario ? abonoDias : 0);
        if (somaTotal > saldoDisponivel) {
            fecharComLimpeza({ aviso: true, mensagem: `A soma dos dias de férias e abono pecuniário (${somaTotal}) não pode exceder o saldo disponível (${saldoDisponivel} dias).` });
            return;
        }

        // Validação adicional: abono não pode exceder 10 dias
        if (abonoPecuniario && abonoDias > 10) {
            fecharComLimpeza({ aviso: true, mensagem: 'O abono pecuniário não pode exceder 10 dias.' });
            return;
        }

        // Validação do adiantamento do 13º salário
        if (adiantarDecimoTerceiro) {
            const dataInicioObj = parseDateAsLocal(dataInicio);
            const mesInicio = dataInicioObj.getMonth() + 1;
            if (mesInicio === 1 || mesInicio === 12) {
                fecharComLimpeza({ aviso: true, mensagem: 'O adiantamento do 13º salário não é permitido para férias em janeiro ou dezembro, conforme a Lei nº 4.749/65.' });
                return;
            }
        }

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const inicio = parseDateAsLocal(dataInicio);
        const diffTime = inicio - hoje;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const diasMinimosAntecedencia = parseInt(parametrosFerias.DIAS_MINIMOS_ANTECEDENCIA) || 45; // Fallback para 45 se não houver parâmetro
        
      
        if (diffDays < (diasMinimosAntecedencia + 1)) {
            if (!isPerfilEspecial) {
                // Calcular a data mínima permitida
                const dataMinima = new Date();
                dataMinima.setDate(dataMinima.getDate() + diasMinimosAntecedencia);
                const dataMinimaFormatada = dataMinima.toLocaleDateString('pt-BR');
                
                fecharComLimpeza({ 
                    aviso: true, 
                    mensagem: `A solicitação de férias deve ser feita com no mínimo ${diasMinimosAntecedencia} dias de antecedência. Data mínima permitida: ${dataMinimaFormatada}` 
                });
                return;
            }
        }
        
        try {
            await http.post(`/funcionario/${eventoCompletado.colab.id}/solicita_ferias_novo/`, {
                data_inicio: dataInicio,
                data_fim: dataFim,
                adiantar_13: adiantarDecimoTerceiro,
                nrodiasabono: abonoPecuniario ? (parseInt(numeroDiasAbono, 10) || 0) : 0,
                data_pagamento: dataPagamento || null,
                aviso_ferias: avisoFerias || null,
                abono_pecuniario: abonoPecuniario,
                ferias_coletivas: feriasColetivas
            });
            fecharComLimpeza({ sucesso: true, mensagem: 'Solicitação de férias enviada com sucesso!' });
        } catch (error) {
            console.error("Erro ao solicitar férias", error);
            console.log("Estrutura completa do erro:", {
                response: error.response,
                data: error.response?.data,
                status: error.response?.status
            });
            
            let errorMessage = 'Erro ao solicitar férias. Por favor, tente novamente.';
            
            // Verificar diferentes formatos de erro da API
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (typeof error.response?.data === 'string') {
                errorMessage = error.response.data;
            } else if (error?.error) {
                errorMessage = error.error;
            }
            
            console.log("Mensagem de erro final:", errorMessage);
            fecharComLimpeza({ erro: true, mensagem: errorMessage });
        }
    };

    const tituloPeriodo = (statusType === 'acontecendo' || statusType === 'passada' || statusType === 'aprovada' || statusType === 'finalizada' || statusType === 'solicitada' || statusType === 'marcada') ? 'Período de Férias' : 'Período Solicitado';

    return (
        <OverlayRight $opened={opened} onClick={() => fecharComLimpeza()}>
            <DialogEstilizadoRight $width={'80vw'} $align="flex-end" open={opened} $opened={opened} onClick={e => e.stopPropagation()}>
                <Frame style={{padding: '24px 32px', maxHeight: '90vh', display: 'flex', flexDirection: 'column'}}>
                    <CabecalhoFlex>
                        <StatusTag $type={statusType}>
                            {statusIcons[statusType]} {statusLabel}
                        </StatusTag>
                        <BotaoFechar onClick={() => fecharComLimpeza()} formMethod="dialog">
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
                                            <DataTitulo>{statusType === 'finalizada' ? 'Saldo Remanescente' : 'Saldo'}</DataTitulo>
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
                                
                                {/* Infobox de alerta movido para cá */}
                                {alerta}
                                {/* Infoboxes de avisos */}
                                {mostrarErroDatas && (
                                    <AlertaErro>
                                        <FaExclamationCircle size={20} style={{ color: '#dc2626', flexShrink: 0 }}/>
                                        <span>
                                            A data de início não pode ser posterior à data de fim das férias.
                                        </span>
                                    </AlertaErro>
                                )}
                                {mostrarErroDiasMinimos && (
                                    <AlertaErro>
                                        <FaExclamationCircle size={20} style={{ color: '#dc2626', flexShrink: 0 }}/>
                                        <span>
                                            O período de férias deve ter no mínimo 5 dias.
                                        </span>
                                    </AlertaErro>
                                )}
                                {mostrarErroSaldoDias && (
                                    <AlertaErro>
                                        <FaExclamationCircle size={20} style={{ color: '#dc2626', flexShrink: 0 }}/>
                                        <span>
                                            O período selecionado excede o saldo de dias disponíveis ({evento?.evento?.saldo_dias ?? evento?.evento?.nrodiasferias ?? 30} dias).
                                        </span>
                                    </AlertaErro>
                                )}
                                {mostrarErroAbono && (
                                    <AlertaErro>
                                        <FaExclamationCircle size={20} style={{ color: '#dc2626', flexShrink: 0 }}/>
                                        <span>
                                            O abono pecuniário não pode exceder 10 dias.
                                        </span>
                                    </AlertaErro>
                                )}
                                {mostrarErroSaldoTotal && (
                                    <AlertaErro>
                                        <FaExclamationCircle size={20} style={{ color: '#dc2626', flexShrink: 0 }}/>
                                        <span>
                                            A soma dos dias de férias e abono pecuniário não pode exceder o saldo disponível. O abono reduz os dias disponíveis para férias.
                                        </span>
                                    </AlertaErro>
                                )}
                                {mostrarErroAdiantamento13 && (
                                    <AlertaErro>
                                        <FaExclamationCircle size={20} style={{ color: '#dc2626', flexShrink: 0 }}/>
                                        <span>
                                            O adiantamento do 13º salário não é permitido para férias em janeiro ou dezembro, conforme a Lei nº 4.749/65. O adiantamento só pode ser feito entre fevereiro e novembro.
                                        </span>
                                    </AlertaErro>
                                )}
                                {mostrarErroAntecedencia && (
                                    !isPerfilEspecial ? (
                                        <AlertaErro>
                                            <FaExclamationCircle size={20} style={{ color: '#dc2626', flexShrink: 0 }}/>
                                            <span>
                                                A solicitação de férias deve ser feita com no mínimo {parseInt(parametrosFerias.DIAS_MINIMOS_ANTECEDENCIA) || 45} dias de antecedência. 
                                                Entre em contato com o seu gestor ou RH para solicitar uma exceção.
                                            </span>
                                        </AlertaErro>
                                    ) : (
                                        <AlertaAviso>
                                            <FaExclamationCircle size={20} style={{ color: '#ffc107', flexShrink: 0 }}/>
                                            <span>
                                                A solicitação de férias deve ser feita com no mínimo {parseInt(parametrosFerias.DIAS_MINIMOS_ANTECEDENCIA) || 45} dias de antecedência. 
                                                Você tem permissão para prosseguir com a solicitação mesmo assim.
                                            </span>
                                        </AlertaAviso>
                                    )
                                )}
                            </DetalhesCard>
                        </DetalhesContainer>

                        <AcoesContainer>
                            {(eventoCompletado.evento?.data_inicio || totalDias) && (
                                <Frame style={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #dee2e6',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
                                    borderRadius: '12px',
                                    padding: '24px',
                                    marginBottom: '16px'
                                }}>
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
                            
                            {/* Seção de detalhes adicionais para férias finalizadas, aprovadas ou marcadas */}
                            {(statusType === 'finalizada' || statusType === 'aprovada' || statusType === 'marcada' || statusType === 'passada' || statusType === 'acontecendo' || statusType === 'paga' || statusType === 'solicitada' || isDemitido) && (
                                <Frame style={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #dee2e6',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
                                    borderRadius: '12px',
                                    padding: '24px',
                                    marginBottom: '16px'
                                }}>
                                    <DetalhesTitulo style={{ marginTop: 0 }}>Detalhes Adicionais</DetalhesTitulo>
                                    <BlocoDatas>
                                        {/* Datas importantes */}
                                        <BlocoData>
                                            <BlocoDataTexto>
                                                <DataTitulo>Data de Pagamento</DataTitulo>
                                                <DataValor>
                                                    {eventoCompletado.evento?.data_pagamento 
                                                        ? format(parseDateAsLocal(eventoCompletado.evento.data_pagamento), 'dd/MM/yyyy')
                                                        : 'Não informada'
                                                    }
                                                </DataValor>
                                            </BlocoDataTexto>
                                        </BlocoData>
                                        <BlocoData>
                                            <BlocoDataTexto>
                                                <DataTitulo>Data do Aviso</DataTitulo>
                                                <DataValor>
                                                    {eventoCompletado.evento?.aviso_ferias 
                                                        ? format(parseDateAsLocal(eventoCompletado.evento.aviso_ferias), 'dd/MM/yyyy')
                                                        : 'Não informada'
                                                    }
                                                </DataValor>
                                            </BlocoDataTexto>
                                        </BlocoData>
                                        {/* Abono pecuniário */}
                                        <BlocoData>
                                            <BlocoDataTexto>
                                                <DataTitulo>Abono Pecuniário</DataTitulo>
                                                <DataValor>
                                                    {eventoCompletado.evento?.abono_pecuniario 
                                                        ? `${eventoCompletado?.evento?.nrodiasabono ?? 0} dias`
                                                        : 'Não solicitado'
                                                    }
                                                </DataValor>
                                            </BlocoDataTexto>
                                        </BlocoData>
                                        {/* Benefícios */}
                                        <BlocoData>
                                            <BlocoDataTexto>
                                                <DataTitulo>Adiantamento 13º</DataTitulo>
                                                <DataValor>
                                                    {eventoCompletado.evento?.adiantar_13 ? 'Sim' : 'Não'}
                                                </DataValor>
                                            </BlocoDataTexto>
                                        </BlocoData>
                                        <BlocoData>
                                            <BlocoDataTexto>
                                                <DataTitulo>Férias Coletivas</DataTitulo>
                                                <DataValor>
                                                    {eventoCompletado.evento?.ferias_coletivas ? 'Sim' : 'Não'}
                                                </DataValor>
                                            </BlocoDataTexto>
                                        </BlocoData>
                                    </BlocoDatas>
                                </Frame>
                            )}
                            {/* Não renderiza formulário de solicitação se isDemitido for true */}
                            {(!isDemitido && statusType === 'aSolicitar' && !temPermissaoAddFerias) && (
                                <Frame style={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #dee2e6',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
                                    borderRadius: '12px',
                                    padding: '24px',
                                    marginBottom: '16px'
                                }}>
                                    <DetalhesTitulo style={{ marginTop: 0 }}>Solicitar Período</DetalhesTitulo>
                                    <AlertaAviso>
                                        <FaExclamationCircle size={20} style={{ color: '#ffc107', flexShrink: 0 }}/>
                                        <span>
                                            Você não tem permissão para solicitar férias. Entre em contato com o seu gestor ou RH.
                                        </span>
                                    </AlertaAviso>
                                </Frame>
                            )}
                            {(!isDemitido && podeSolicitar) && (
                                <Frame style={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #dee2e6',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
                                    borderRadius: '12px',
                                    padding: '24px',
                                    marginBottom: '16px'
                                }}>
                                    <DetalhesTitulo style={{ marginTop: 0 }}>Solicitar Período</DetalhesTitulo>
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '12px', width: '100%'}}>
                                        <div style={{display: 'flex', gap: 16}}>
                                            <Linha style={{flex: 2}}>
                                                <Label>Data de Início</Label>
                                                <DataInput 
                                                    type="date" 
                                                    value={dataInicio} 
                                                    onChange={handleDataInicioChange}
                                                    min={(() => {
                                                        
                                                        const raw = evento?.evento?.data_minima_solicitacao;
                                                        if (raw) {
                                                            // Se já está no formato yyyy-MM-dd, retorna direto
                                                            if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
                                                            // Se vier em outro formato, tenta converter
                                                            const d = new Date(raw);
                                                            if (!isNaN(d)) return d.toISOString().split('T')[0];
                                                        }
                                                        return new Date().toISOString().split('T')[0];
                                                    })()}
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
                                                    max={evento?.evento?.saldo_dias ?? evento?.evento?.nrodiasferias ?? 30}
                                                    onKeyPress={(e) => {
                                                        // Impedir digitação de hífen (números negativos)
                                                        if (e.key === '-') {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />
                                            </Linha>
                                            <Linha style={{flex: 2}}>
                                                <Label>Data de Fim</Label>
                                                <DataInput 
                                                    type="date" 
                                                    value={dataFim} 
                                                    onChange={handleDataFimChange}
                                                    min={dataInicio || new Date().toISOString().split('T')[0]}
                                                />
                                            </Linha>
                                        </div>

                                        <div style={{display: 'flex', gap: 16}}>
                                            <Linha style={{flex: 2, display: 'flex', alignItems: 'flex-start', paddingBottom: '8px'}}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '12px', marginTop: '24px' }}>
                                                    <SwitchInput 
                                                        id="abonoPecuniario"
                                                        checked={abonoPecuniario} 
                                                        onChange={() => setAbonoPecuniario(!abonoPecuniario)}
                                                    />
                                                    <label htmlFor="abonoPecuniario" style={{ cursor: 'pointer', fontWeight: 500, color: '#495057', fontSize: '14px' }}>
                                                        Abono Pecuniário?
                                                    </label>
                                                </div>
                                            </Linha>
                                            <Linha style={{flex: 3}}>
                                                <Label>Número de dias de Abono</Label>
                                                <DataInput
                                                    type="number"
                                                    value={numeroDiasAbono}
                                                    onChange={handleAbonoChange}
                                                    placeholder="0"
                                                    min="0"
                                                    max="10"
                                                    readOnly={!abonoPecuniario}
                                                    onKeyPress={(e) => {
                                                        // Impedir digitação de hífen (números negativos)
                                                        if (e.key === '-') {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    style={{
                                                        backgroundColor: !abonoPecuniario ? '#f8f9fa' : '#fff',
                                                        color: !abonoPecuniario ? '#6c757d' : '#212529',
                                                        cursor: !abonoPecuniario ? 'not-allowed' : 'text'
                                                    }}
                                                />
                                            </Linha>
                                        </div>

                                        <div style={{display: 'flex', gap: 16}}>
                                            <Linha style={{flex: 1}}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <SwitchInput 
                                                        id="adiantar13"
                                                        checked={adiantarDecimoTerceiro} 
                                                        onChange={() => {
                                                            const novoValor = !adiantarDecimoTerceiro;
                                                            setAdiantarDecimoTerceiro(novoValor);
                                                            
                                                            // Validar adiantamento quando o switch é ativado
                                                            if (novoValor && dataInicio) {
                                                                const dataInicio = parseDateAsLocal(dataInicio);
                                                                const mesInicio = dataInicio.getMonth() + 1;
                                                                const adiantamentoInvalido = mesInicio === 1 || mesInicio === 12;
                                                                setMostrarErroAdiantamento13(adiantamentoInvalido);
                                                            } else {
                                                                setMostrarErroAdiantamento13(false);
                                                            }
                                                            
                                                            // Revalidar todas as condições para atualizar o estado do botão
                                                            if (dataInicio && dataFim) {
                                                                const dataInicioObj = parseDateAsLocal(dataInicio);
                                                                const dataFimObj = parseDateAsLocal(dataFim);
                                                                
                                                                // Validar ordem das datas
                                                                const datasInvalidas = dataInicioObj > dataFimObj;
                                                                
                                                                // Validar quantidade mínima de dias
                                                                const diasSolicitados = parseInt(numeroDiasFerias) || 0;
                                                                const diasInsuficientes = diasSolicitados < 5;
                                                                
                                                                // Validar saldo de dias disponíveis
                                                                const saldoDisponivel = evento?.evento?.saldo_dias ?? evento?.evento?.nrodiasferias ?? 30;
                                                                const excedeSaldo = diasSolicitados > saldoDisponivel;
                                                                
                                                                // Validar dias de abono
                                                                const abonoDias = parseInt(numeroDiasAbono) || 0;
                                                                const abonoExcede10 = abonoPecuniario && abonoDias > 10;
                                                                
                                                                // Validar soma total
                                                                const somaTotal = diasSolicitados + (abonoPecuniario ? abonoDias : 0);
                                                                const excedeSaldoTotal = somaTotal > saldoDisponivel;
                                                                
                                                                // Validar adiantamento do 13º salário
                                                                const mesInicio = dataInicioObj.getMonth() + 1;
                                                                const adiantamentoInvalido = novoValor && (mesInicio === 1 || mesInicio === 12);
                                                                
                                                                // Validar dias de antecedência
                                                                const diasMinimosAntecedencia = parseInt(parametrosFerias.DIAS_MINIMOS_ANTECEDENCIA) || 45;
                                                                const hoje = new Date();
                                                                hoje.setHours(0, 0, 0, 0);
                                                                const diffTime = dataInicioObj - hoje;
                                                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                                const erroAntecedencia = diffDays < (diasMinimosAntecedencia + 1);
                                                                
                                                                // Atualizar estado do botão
                                                                setBotaoEnviarDesabilitado(
                                                                    datasInvalidas || 
                                                                    diasInsuficientes || 
                                                                    excedeSaldo || 
                                                                    abonoExcede10 ||
                                                                    excedeSaldoTotal ||
                                                                    adiantamentoInvalido ||
                                                                    (erroAntecedencia && !isPerfilEspecial)
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    <label htmlFor="adiantar13" style={{ cursor: 'pointer', fontWeight: 500, color: '#495057', fontSize: '14px' }}>
                                                        Deseja adiantar o 13º salário?
                                                    </label>
                                                </div>
                                            </Linha>
                                            <Linha style={{flex: 1}}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <SwitchInput 
                                                        id="feriasColetivas"
                                                        checked={feriasColetivas} 
                                                        onChange={() => setFeriasColetivas(!feriasColetivas)}
                                                    />
                                                    <label htmlFor="feriasColetivas" style={{ cursor: 'pointer', fontWeight: 500, color: '#495057', fontSize: '14px' }}>
                                                        Férias Coletivas?
                                                    </label>
                                                </div>
                                            </Linha>
                                        </div>

                                        <div style={{display: 'flex', gap: 16}}>
                                            <Linha style={{flex: 1}}>
                                                <Label>Data de Pagamento</Label>
                                                <DataInput
                                                    type="date"
                                                    value={dataPagamento}
                                                    onChange={e => setDataPagamento(e.target.value)}
                                                    placeholder="Selecione a data"
                                                    min={new Date().toISOString().split('T')[0]}
                                                />
                                            </Linha>
                                            <Linha style={{flex: 1}}>
                                                <AlertaAviso style={{margin: 0, padding: '12px', fontSize: '12px'}}>
                                                    <FaExclamationCircle size={16} style={{ color: '#ffc107', flexShrink: 0 }}/>
                                                    <span>
                                                        <strong>Dias úteis:</strong> Consideramos apenas sábado e domingo como não úteis. 
                                                        <strong>Valide se há feriados na data sugerida e corrija se necessário.</strong>
                                                    </span>
                                                </AlertaAviso>
                                            </Linha>
                                        </div>
                                        
                                        <div style={{display: 'flex', gap: 16}}>
                                            <Linha style={{flex: 1}}>
                                                <Label>Aviso de Férias</Label>
                                                <DataInput
                                                    type="date"
                                                    value={avisoFerias}
                                                    onChange={e => setAvisoFerias(e.target.value)}
                                                    placeholder="Selecione a data"
                                                    min={new Date().toISOString().split('T')[0]}
                                                />
                                            </Linha>
                                            <Linha style={{flex: 1}}>
                                                <AlertaAviso style={{margin: 0, padding: '12px', fontSize: '12px'}}>
                                                    <FaExclamationCircle size={16} style={{ color: '#ffc107', flexShrink: 0 }}/>
                                                    <span>
                                                        <strong>Aviso de férias:</strong> Sugerido como <strong>30 dias corridos</strong> antes do início das férias. 
                                                        <strong>Valide se a data sugerida é adequada.</strong>
                                                    </span>
                                                </AlertaAviso>
                                            </Linha>
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
                                <div style={{
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    padding: '20px 20px 0px 0px',
                                    marginBottom: '16px',
                                    marginTop: '16px'
                                }}>
                                    <BotaoGrupo>
                                        <BotaoAprovarCustom size="medium" aoClicar={aprovarFerias} largura="100%">
                                            <FaCheckCircle fill="var(--secundaria)" /> Aprovar
                                        </BotaoAprovarCustom>
                                        <BotaoReprovarCustom size="medium" estilo="neutro" aoClicar={reprovarFerias} largura="100%">
                                            <FaTimesCircle fill="var(--secundaria)" /> Reprovar
                                        </BotaoReprovarCustom>
                                    </BotaoGrupo>
                                </div>
                            )}
                        </AcoesContainer>
                    </ConteudoContainer>
                </Frame>
            </DialogEstilizadoRight>
        </OverlayRight>
    );
}

