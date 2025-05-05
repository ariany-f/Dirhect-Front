import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { format, addMonths, startOfMonth, endOfMonth, addDays, isMonday, getMonth, getYear, differenceInCalendarDays, isAfter, isBefore, isWithinInterval, format as formatDateFns } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaExclamationCircle, FaRegClock, FaCheckCircle, FaSun, FaCalendarCheck, FaThLarge, FaThList } from 'react-icons/fa';
import { Dialog } from 'primereact/dialog';
import { Tooltip } from 'primereact/tooltip';

const GRADIENT = 'linear-gradient(to left, #0c004c, #5d0b62)';

const CalendarContainer = styled.div`
    width: 100%;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    user-select: none;
`;

const CalendarHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

const MonthTitle = styled.h2`
    font-size: 18px;
    color: #333;
    margin: 0;
`;

const CalendarGrid = styled.div`
    min-width: ${({ totalDays, dayWidth }) => totalDays * dayWidth + 200}px;
`;

const WeekDaysRow = styled.div`
    display: grid;
    grid-template-columns: 200px repeat(${({ totalDays }) => totalDays}, 1fr);
    min-width: 100%;
`;

const WeekDayNameRow = styled.div`
    display: grid;
    grid-template-columns: 200px repeat(${({ totalDays }) => totalDays}, 1fr);
    min-width: 100%;
`;

const WeekDayNameCell = styled.div`
    text-align: center;
    font-size: 13px;
    font-weight: 500;
    color: black;
    padding: 4px 0 0 0;
`;

const WeekDay = styled.div`
    text-align: center;
    font-weight: 400;
    color: #333;
    font-size: 14px;
    padding: 8px 0;
    &.weekend {
        background: #f3f3f8;
    }
`;

const EmployeeCell = styled.div`
    display: flex;
    align-items: center;
    font-weight: bold;
    color: #333;
    font-size: 14px;
    padding-left: 8px;
    background: #f5f5f5;
    border: 1px solid #eee;
    min-height: 44px;
    position: sticky;
    left: 0;
    z-index: 2;
`;

const EmployeeRow = styled.div`
    display: grid;
    grid-template-columns: 200px 1fr;
    align-items: center;
    min-height: 44px;
    margin: 0;
    padding: 0;
    border-bottom: none;
`;

const DaysBar = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
    background: #fff;
    border: 1px solid #eee;
    margin: 0!important;
`;

const EventBar = styled.div`
    position: absolute;
    left: ${({ startPercent }) => startPercent}%;
    width: ${({ widthPercent }) => widthPercent}%;
    top: 6px;
    height: 28px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 8px rgba(44, 0, 80, 0.13);
    border-radius: 4px;
    font-weight: 400;
    font-size: 14px;
    padding: 0 24px 0 12px;
    z-index: 2;
    overflow: hidden;
    white-space: nowrap;
    color: #fff;
    background: ${({ type }) => {
        if (type === 'aSolicitar') return 'linear-gradient(to right, #ff5ca7, #ffb6c1)';
        if (type === 'solicitada') return 'linear-gradient(to right, #fbb034,rgb(211, 186, 22))';
        if (type === 'aprovada') return GRADIENT;
        if (type === 'acontecendo') return 'linear-gradient(to right,rgb(45, 126, 219),rgb(18, 37, 130))';
        if (type === 'passada') return 'linear-gradient(to right, #bdbdbd, #757575)';
        return GRADIENT;
    }};
    border: ${({ type }) => type === 'aSolicitar' ? '2px dashed #fff' : 'none'};
    box-shadow: ${({ type }) => type === 'acontecendo' ? '0 0 16px 2pxrgba(44, 95, 206, 0.33)' : '0 2px 8px rgba(21, 0, 80, 0.13)'};
`;

const IconWrapper = styled.span`
    display: flex;
    align-items: center;
    margin-right: 12px;
    font-size: 14px;
    color: ${({ fill }) => fill};
`;

const ToggleButton = styled.button`
    background: #7c3aed;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 8px 18px;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    margin-left: 12px;
    transition: background 0.2s;
    &:hover {
        background: #5b21b6;
    }
`;

const ViewToggleBar = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    justify-content: flex-end;
`;

const ViewToggleSwitch = styled.div`
    display: flex;
    background: #f5f5f5;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px #5d0b6210;
`;

const ViewToggleOption = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    background: ${({ active }) => active ? 'linear-gradient(to left, #0c004c, #5d0b62)' : 'transparent'};
    color: ${({ active }) => active ? '#fff' : '#333'};
    border: none;
    font-size: 15px;
    font-weight: 600;
    padding: 8px 18px;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    outline: none;
    border-radius: 0;
    box-shadow: none;
    &:first-child {
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
    }
    &:last-child {
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
    }
`;

const StickyHeader = styled.div`
    position: sticky;
    top: 0;
    z-index: 10;
    background: #fff;
    overflow-x: auto;
    width: 100%;
`;

const DAY_WIDTH_MENSAL = 90;
const DAY_WIDTH_TRIMESTRAL = 40;
const DAYS_IN_YEAR = 365;

const CalendarScrollArea = styled.div`
    width: 100%;
    overflow: auto;
    position: relative;
    border-radius: 8px;
    background: #fff;
    scrollbar-width: thin;
    scrollbar-color: #d1d5db #f5f5f5;
    user-select: none;
    &::-webkit-scrollbar {
        height: 8px;
        width: 8px;
        background: #f5f5f5;
        border-radius: 8px;
    }
    &::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 8px;
    }
    &::-webkit-scrollbar-thumb:hover {
        background: #b0b7c3;
    }
    &::-webkit-scrollbar-button {
        display: none;
        width: 0;
        height: 0;
    }
`;

const TrimestreHeader = styled.div`
    display: grid;
    grid-template-columns: 200px repeat(${({ totalDays }) => totalDays}, 1fr);
    margin-bottom: 0px;
    min-width: 100%;
`;

const TrimestreMonthCell = styled.div`
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    padding: 8px 0 0 0;
    grid-column: ${({ start, end }) => `${start} / ${end}`};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const DaysBackgroundGrid = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(${({ totalDays }) => totalDays}, 1fr);
    z-index: 0;
`;

const DayBgCell = styled.div`
    background: ${({ isWeekend }) => isWeekend ? '#f3f3f8' : '#fafbfc'};
    border-right: 1px solid #f0f0f0;
    height: 100%;
`;

const MonthSeparator = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: #5d0b62;
    z-index: 3;
    pointer-events: none;
`;

// Dados fake de colaboradores e férias
const colaboradoresFake = [
    {
        nome: 'MARISA MONTE',
        ausencias: [
            // Férias concluídas (passadas)
            {
                data_inicio: '2025-01-10',
                data_fim: '2025-01-25',
                status: 'C',
            },
        ],
        feriasARequisitar: [
            {
                limite: '2025-09-15',
            },
        ],
    },
    {
        nome: 'CAROL SHAW',
        ausencias: [
            // Férias solicitadas (aguardando aprovação)
            {
                data_inicio: '2025-05-05',
                data_fim: '2025-05-20',
                status: 'S',
            },
        ],
        feriasARequisitar: [],
    },
    {
        nome: 'FRANCES ALLEN',
        ausencias: [
            // Férias aprovadas (futuras)
            {
                data_inicio: '2025-12-01',
                data_fim: '2025-12-16',
                status: 'A',
            },
        ],
        feriasARequisitar: [],
    },
    {
        nome: 'GRACE HOPPER',
        ausencias: [
            // Férias em curso (agora)
            {
                data_inicio: '2025-06-01',
                data_fim: '2025-06-20',
                status: 'E',
            },
        ],
        feriasARequisitar: [],
    },
    {
        nome: 'ADA LOVELACE',
        ausencias: [
            // Férias concluídas (passadas)
            {
                data_inicio: '2025-03-15',
                data_fim: '2025-03-30',
                status: 'C',
            },
        ],
        feriasARequisitar: [],
    },
    {
        nome: 'ALAN TURING',
        ausencias: [
            // Férias solicitadas (aguardando aprovação)
            {
                data_inicio: '2025-07-05',
                data_fim: '2025-07-20',
                status: 'S',
            },
        ],
        feriasARequisitar: [],
    },
    {
        nome: 'KATHERINE JOHNSON',
        ausencias: [
            // Férias aprovadas (futuras)
            {
                data_inicio: '2025-09-10',
                data_fim: '2025-09-25',
                status: 'A',
            },
        ],
        feriasARequisitar: [],
    },
    {
        nome: 'JOHN VON NEUMANN',
        ausencias: [
            // Férias rejeitadas (não exibidas, mas útil para lógica)
            {
                data_inicio: '2025-04-01',
                data_fim: '2025-04-16',
                status: 'R',
            },
        ],
        feriasARequisitar: [],
    },
    {
        nome: 'DONNA DUBINSKY',
        ausencias: [
            // Férias em curso (agora)
            {
                data_inicio: '2025-06-10',
                data_fim: '2025-06-25',
                status: 'E',
            },
        ],
        feriasARequisitar: [],
    },
    {
        nome: 'TIM BERNERS-LEE',
        ausencias: [
            // Férias aprovadas (futuras)
            {
                data_inicio: '2025-11-10',
                data_fim: '2025-11-25',
                status: 'A',
            },
        ],
        feriasARequisitar: [],
    },
];

function getDaysArray(start, end) {
    const arr = [];
    let dt = new Date(start);
    while (dt <= end) {
        arr.push(new Date(dt));
        dt = addDays(dt, 1);
    }
    return arr;
}

function getMondaysArray(start, end) {
    const arr = [];
    let dt = new Date(start);
    while (dt <= end) {
        if (isMonday(dt)) arr.push(new Date(dt));
        dt = addDays(dt, 1);
    }
    return arr;
}

function getMonthsInRange(start, end) {
    const months = [];
    let dt = new Date(start.getFullYear(), start.getMonth(), 1);
    while (dt <= end) {
        months.push({
            month: getMonth(dt),
            year: getYear(dt),
            start: new Date(dt),
            end: endOfMonth(dt)
        });
        dt = addMonths(dt, 1);
    }
    return months;
}

// Determina o status do evento de férias
function getFeriasStatus({ data_inicio, data_fim }, hoje = new Date()) {
    const inicio = new Date(data_inicio);
    const fim = new Date(data_fim);
    if (isAfter(inicio, hoje)) return 'aprovada'; // futura
    if (isWithinInterval(hoje, { start: inicio, end: fim })) return 'acontecendo';
    if (isBefore(fim, hoje)) return 'passada';
    return 'solicitada'; // fallback
}

const statusIcons = {
    aSolicitar: <FaExclamationCircle fill='white' />,
    solicitada: <FaRegClock fill='white'/>,
    aprovada: <FaCalendarCheck fill='white'/>,
    acontecendo: <FaSun fill='white' />,
    passada: <FaCheckCircle fill='white' />,
};

const INITIAL_DAYS = 365; // Começa com 1 ano
const DAYS_BATCH = 30; // Carrega mais 1 mês por vez
const INITIAL_COLABS = 3;
const COLABS_BATCH = 2;

const CalendarFerias = ({ colaboradores }) => {
    const [visualizacao, setVisualizacao] = useState('trimestral'); // 'mensal' ou 'trimestral'
    const [modalEvento, setModalEvento] = useState(null); // {colab, evento, tipo}
    const [isDragging, setIsDragging] = useState(false);
    const dragStartX = useRef(0);
    const dragScrollLeft = useRef(0);
    const scrollRef = useRef();
    const containerRef = useRef();
    const [containerWidth, setContainerWidth] = useState(1200);

    useEffect(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.offsetWidth);
        }
        const handleResize = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Sempre 1 ano de dados
    const currentDate = new Date();
    const startDate = startOfMonth(currentDate);
    const endDate = addDays(startDate, DAYS_IN_YEAR - 1);
    const daysArray = getDaysArray(startDate, endDate);
    const totalDays = daysArray.length;
    const monthsArray = getMonthsInRange(startDate, endDate);
    const allColabs = colaboradores || colaboradoresFake;

    // Zoom dinâmico: calcula a largura do dia conforme a visualização e o tamanho do container
    let dayWidth = 40;
    if (visualizacao === 'mensal') {
        dayWidth = Math.max(24, Math.floor(containerWidth / 20) * 0.8); // 20% menor
    } else {
        dayWidth = Math.max(12, Math.floor(containerWidth / 120)); // 4 meses (120 dias) visíveis
    }

    // Drag-to-scroll horizontal
    const handleMouseDown = (e) => {
        if (e.target.closest('.event-bar')) return;
        setIsDragging(true);
        dragStartX.current = e.pageX;
        dragScrollLeft.current = scrollRef.current.scrollLeft;
    };
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const dx = e.pageX - dragStartX.current;
        scrollRef.current.scrollLeft = dragScrollLeft.current - dx;
    };
    const handleMouseUp = () => {
        setIsDragging(false);
    };
    useEffect(() => {
        if (!scrollRef.current) return;
        const ref = scrollRef.current;
        ref.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            ref.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    });

    // Função para calcular a posição e largura da barra
    const getBarPosition = (start, end, startDate, totalDays) => {
        const startDay = Math.max(0, Math.floor((new Date(start) - startDate) / (1000 * 60 * 60 * 24)));
        const endDay = Math.min(totalDays - 1, Math.floor((new Date(end) - startDate) / (1000 * 60 * 60 * 24)));
        const startPercent = (startDay / totalDays) * 100;
        const widthPercent = ((endDay - startDay + 1) / totalDays) * 100;
        return { startPercent, widthPercent };
    };

    // Modal evento
    const handleEventClick = (colab, evento, tipo) => {
        setModalEvento({ colab, evento, tipo });
    };
    const handleCloseModal = () => setModalEvento(null);

    // Função para mapear status para tipo de cor/ícone
    function mapStatusToType(status) {
        switch (status) {
            case 'A': return 'aprovada';
            case 'S': return 'solicitada';
            case 'C': return 'passada';
            case 'E': return 'acontecendo';
            case 'R': return 'rejeitada'; // pode ser ignorado ou adicionar cor especial
            default: return 'aprovada';
        }
    }

    return (
        <CalendarContainer ref={containerRef}>
            <Tooltip target=".event-bar" />
            <ViewToggleBar>
                <ViewToggleSwitch>
                    <ViewToggleOption
                        active={visualizacao === 'mensal'}
                        onClick={() => setVisualizacao('mensal')}
                        title="Visualização mensal"
                    >
                        <FaThLarge fill={visualizacao === 'mensal' ? 'white' : 'black'} /> Mensal
                    </ViewToggleOption>
                    <ViewToggleOption
                        active={visualizacao === 'trimestral'}
                        onClick={() => setVisualizacao('trimestral')}
                        title="Visualização trimestral"
                    >
                        <FaThList fill={visualizacao === 'trimestral' ? 'white' : 'black'} /> Trimestral
                    </ViewToggleOption>
                </ViewToggleSwitch>
            </ViewToggleBar>
            <CalendarScrollArea ref={scrollRef} style={{ cursor: isDragging ? 'grabbing' : 'auto' }}>
                <CalendarGrid totalDays={totalDays} dayWidth={dayWidth} style={{position: 'relative'}}>
                    {/* Linhas roxas de separação dos meses */}
                    {monthsArray.map((m, idx) => {
                        if (idx === 0) return null; // não desenha antes do primeiro mês
                        const startIdx = differenceInCalendarDays(m.start, startDate);
                        return (
                            <MonthSeparator
                                key={idx}
                                style={{ left: `calc(${(startIdx / totalDays) * 100}% + 200px)` }}
                            />
                        );
                    })}
                    <TrimestreHeader totalDays={totalDays}>
                        <div></div>
                        {monthsArray.map((m, idx) => {
                            const startIdx = differenceInCalendarDays(m.start, startDate) + 1;
                            const endIdx = differenceInCalendarDays(m.end, startDate) + 2;
                            return (
                                <TrimestreMonthCell
                                    key={idx}
                                    start={startIdx}
                                    end={endIdx}
                                    style={{ gridColumn: `${startIdx} / ${endIdx}` }}
                                >
                                    {format(m.start, 'MMMM yyyy', { locale: ptBR }).toUpperCase()}
                                </TrimestreMonthCell>
                            );
                        })}
                    </TrimestreHeader>
                    {visualizacao === 'mensal' && (
                        <WeekDayNameRow totalDays={totalDays}>
                            <div></div>
                            {daysArray.map((date, idx) => (
                                <WeekDayNameCell key={idx}>
                                    {['DOM','SEG','TER','QUA','QUI','SEX','SAB'][date.getDay()]}
                                </WeekDayNameCell>
                            ))}
                        </WeekDayNameRow>
                    )}
                    {visualizacao === 'trimestral' ? (
                        <WeekDaysRow totalDays={totalDays}>
                            <div></div>
                            {daysArray.map((date, idx) => (
                                isMonday(date) ? (
                                    <WeekDay key={idx}>SEG. {date.getDate()}</WeekDay>
                                ) : (
                                    <div key={idx}></div>
                                )
                            ))}
                        </WeekDaysRow>
                    ) : (
                        <WeekDaysRow totalDays={totalDays}>
                            <div></div>
                            {daysArray.map((date, idx) => (
                                <WeekDay
                                    key={idx}
                                    className={date.getDay() === 0 || date.getDay() === 6 ? 'weekend' : ''}
                                >
                                    {date.getDate()}
                                </WeekDay>
                            ))}
                        </WeekDaysRow>
                    )}
                    {allColabs.map((colab, idx) => (
                        <EmployeeRow key={colab.nome}>
                            <EmployeeCell>{colab.nome}</EmployeeCell>
                            <DaysBar style={{ minWidth: '100%', position: 'relative' }}>
                                {/* Background grid */}
                                <DaysBackgroundGrid totalDays={totalDays}>
                                    {daysArray.map((date, i) => (
                                        <DayBgCell key={i} isWeekend={date.getDay() === 0 || date.getDay() === 6} />
                                    ))}
                                </DaysBackgroundGrid>
                                {/* Eventos */}
                                {colab.ausencias
                                    .filter(aus => {
                                        // Só mostra eventos que têm pelo menos um dia dentro do range do calendário
                                        const eventStart = new Date(aus.data_inicio);
                                        const eventEnd = new Date(aus.data_fim);
                                        return eventEnd >= startDate && eventStart <= endDate;
                                    })
                                    .map((aus, i) => {
                                        const status = getFeriasStatus(aus, currentDate);
                                        const type = mapStatusToType(aus.status);
                                        const { startPercent, widthPercent } = getBarPosition(aus.data_inicio, aus.data_fim, startDate, totalDays);
                                        let label = '';
                                        if (type === 'aprovada' || type === 'passada') label = `${format(new Date(aus.data_inicio), 'dd/MM/yyyy')} até ${format(new Date(aus.data_fim), 'dd/MM/yyyy')}`;
                                        if (type === 'acontecendo' || type === 'solicitada') label = `${format(new Date(aus.data_inicio), 'dd/MM/yyyy')} até ${format(new Date(aus.data_fim), 'dd/MM/yyyy')}`;
                                        if (type === 'rejeitada') return null; // não exibe
                                        let tooltip = `Início: ${format(new Date(aus.data_inicio), 'dd/MM/yyyy')}\nFim: ${format(new Date(aus.data_fim), 'dd/MM/yyyy')}`;
                                        if (type === 'solicitada') tooltip = 'Solicitada';
                                        if (type === 'acontecendo') tooltip = 'Em curso';
                                        if (type === 'aprovada') tooltip = 'Aprovada';
                                        if (type === 'passada') tooltip = 'Concluída';
                                        return (
                                            <EventBar
                                                key={i}
                                                startPercent={startPercent}
                                                widthPercent={widthPercent}
                                                type={type}
                                                className="event-bar"
                                                onClick={() => handleEventClick(colab, aus, type)}
                                                style={{ cursor: 'pointer', position: 'relative', zIndex: 1 }}
                                                data-pr-tooltip={tooltip}
                                            >
                                                <IconWrapper fill='white'>{statusIcons[type]}</IconWrapper>
                                                {label}
                                            </EventBar>
                                        );
                                    })}
                                {colab.feriasARequisitar.map((feria, i) => {
                                    const dataFim = new Date(feria.limite);
                                    const dataInicio = addDays(dataFim, -29);
                                    const { startPercent, widthPercent } = getBarPosition(dataInicio, dataFim, startDate, totalDays);
                                    const tooltip = `Limite: ${format(new Date(feria.limite), 'dd/MM/yyyy')}`;
                                    return (
                                        <EventBar
                                            key={i}
                                            startPercent={startPercent}
                                            widthPercent={widthPercent}
                                            type="aSolicitar"
                                            className="event-bar"
                                            onClick={() => handleEventClick(colab, feria, 'aSolicitar')}
                                            style={{ cursor: 'pointer' }}
                                            data-pr-tooltip={tooltip}
                                        >
                                            <IconWrapper fill='white'>{statusIcons['aSolicitar']}</IconWrapper>
                                            A solicitar até {format(new Date(feria.limite), 'dd/MM/yyyy')}
                                            <span style={{marginLeft:8, color:'#fff', fontWeight:400, fontSize:13}}>(30 dias)</span>
                                        </EventBar>
                                    );
                                })}
                            </DaysBar>
                        </EmployeeRow>
                    ))}
                </CalendarGrid>
            </CalendarScrollArea>
            <Dialog
                header="Detalhes do Evento"
                visible={!!modalEvento}
                onHide={handleCloseModal}
                style={{ width: '400px' }}
                breakpoints={{ '960px': '90vw', '640px': '100vw' }}
                footer={<button onClick={handleCloseModal} style={{marginTop: 8, padding: '8px 24px', borderRadius: 8, background: '#5d0b62', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer'}}>Fechar</button>}
            >
                {modalEvento && (
                    <div style={{textAlign: 'center'}}>
                        <p><b>Colaborador:</b> {modalEvento.colab.nome}</p>
                        <p><b>Tipo:</b> {modalEvento.tipo}</p>
                        {modalEvento.evento.data_inicio && (
                            <p>
                                <b>Início:</b> {format(new Date(modalEvento.evento.data_inicio), 'dd/MM/yyyy')}<br/>
                                <span style={{color:'#888', fontSize:13}}>
                                    {formatDateFns(new Date(modalEvento.evento.data_inicio), 'EEEE', { locale: ptBR })}
                                </span>
                            </p>
                        )}
                        {modalEvento.evento.data_fim && (
                            <p>
                                <b>Fim:</b> {format(new Date(modalEvento.evento.data_fim), 'dd/MM/yyyy')}<br/>
                                <span style={{color:'#888', fontSize:13}}>
                                    {formatDateFns(new Date(modalEvento.evento.data_fim), 'EEEE', { locale: ptBR })}
                                </span>
                            </p>
                        )}
                        {modalEvento.evento.limite && <p><b>Limite:</b> {format(new Date(modalEvento.evento.limite), 'dd/MM/yyyy')}</p>}
                    </div>
                )}
            </Dialog>
        </CalendarContainer>
    );
};

export default CalendarFerias; 