import styled from "styled-components"
import { useOutletContext } from "react-router-dom"
import React, { useState, useEffect, useRef } from 'react';
import Frame from '@components/Frame'
import Container from '@components/Container'
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import http from '@http';
import { FaInbox, FaSpinner, FaTimes, FaUserPlus, FaSignOutAlt, FaUmbrellaBeach, FaFileInvoiceDollar } from 'react-icons/fa';
import { Toast } from 'primereact/toast';

const KanbanLayout = styled.div`
    display: flex;
    gap: 0px;
    height: calc(100vh - 140px);
`

const VerticalMenu = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0px;
    min-width: 200px;
    background: white;
    padding: 2px 0px 48px 0px;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    justify-content: space-between;
`

const MenuItem = styled.button`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 14px;
    border: none;
    background: ${props => props.$active ? 'linear-gradient(to left, #0c004c, #5d0b62)' : 'transparent'};
    color: ${props => props.$active ? 'white' : '#374151'};
    border-radius: 8px 0 0 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    width: 100%;
    text-align: left;
    transition: all 0.2s;

    svg * {
        color: ${props => props.$active ? 'white' : '#374151'};
        fill: ${props => props.$active ? 'white' : '#374151'};
        stroke: ${props => props.$active ? 'white' : '#374151'};
    }

    &:hover {
        background: ${props => props.$active ? 'linear-gradient(to left, #0c004c, #5d0b62)' : '#f3f4f6'};
    }

    .count {
        margin-left: auto;
        background: ${props => props.$active ? 'rgba(255, 255, 255, 0.63)' : '#e5e7eb'};
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
    }
`

const KanbanContainer = styled.div`
    display: flex;
    gap: 16px;
    padding: 4px 0px;
    overflow-x: auto;
    background: #f0f2f5;
    border-radius: 0px 12px 12px 0px;
    flex: 1;

    &::-webkit-scrollbar {
        height: 8px;
    }

    &::-webkit-scrollbar-track {
        background: #e5e7eb;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: #9ca3af;
        border-radius: 4px;
    }
`

const KanbanGroup = styled.div`
    display: flex;
    gap: 16px;
    position: relative;
    padding: 16px;
    background: rgba(0,0,0,0.02);
    border-radius: 12px;
    border: 1px dashed #e5e7eb;

    &:not(:last-child)::after {
        content: '→';
        position: absolute;
        right: -18px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 20px;
        color: #9ca3af;
        z-index: 1;
    }
`

const Column = styled.div`
    background: white;
    border-radius: 12px;
    min-width: 300px;
    width: 300px;
    display: flex;
    flex-direction: column;
    max-height: 100%;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border: 1px solid #e5e7eb;

    .column-header {
        padding: 12px 16px;
        border-bottom: 1px solid #E5E7EB;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #ffffff;
        border-radius: 12px 12px 0 0;

        .title {
            font-weight: 500;
            color: #374151;
            font-size: 14px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            position: relative;

            &::after {
                content: '';
                position: absolute;
                bottom: -8px;
                left: 0;
                width: 100%;
                height: 3px;
                border-radius: 2px;
                background: ${props => {
                    switch(props.$status) {
                        case 'pendente': return '#dc3545';
                        case 'aprovada': return '#1a73e8';
                        case 'em_andamento': return '#ffa000';
                        case 'concluida': return '#28a745';
                        default: return '#666';
                    }
                }};
            }
        }

        .count {
            background: #f3f4f6;
            color: #374151;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
        }
    }

    .cards-container {
        padding: 12px;
        overflow-y: auto;
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 12px;
        min-height: 100px;
        background: #ffffff;
        border-radius: 0 0 12px 12px;

        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-track {
            background: #f3f4f6;
            border-radius: 3px;
        }

        &::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 3px;
        }
    }
`

const CardWrapper = styled.div`
    background: ${props => props.$isDragging ? '#ffffff' : '#f8fafc'};
    border-radius: 8px;
    padding: 16px;
    box-shadow: ${props => props.$isDragging 
        ? '0 8px 16px rgba(0,0,0,0.1)' 
        : '0 2px 4px rgba(0,0,0,0.05)'};
    border: 1px solid ${props => props.$isDragging ? '#e2e8f0' : '#f0f0f0'};
    cursor: grab;
    transition: all 0.2s;
    margin-bottom: ${props => props.$isDragging ? '24px' : '0'};
    position: relative;
    
    ${props => props.$isDragging && `
        transform: rotate(2deg) scale(1.02);
    `}

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        background: #ffffff;
        border-color: #e2e8f0;
    }

    &:active {
        cursor: grabbing;
    }

    .card-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 12px;
        gap: 12px;
    }

    .tipo-tag {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        color: white;
    }

    .prioridade-tag {
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .descricao {
        font-size: 14px;
        color: #374151;
        margin-bottom: 12px;
        font-weight: 500;
    }

    .meta-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        color: #6B7280;

        .sla-info {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .sla-status {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 500;
            }

            .sla-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                box-shadow: 0 0 4px currentColor;
            }

            .dias-aberto {
                font-size: 11px;
                color: #666;
            }
        }
    }
`;

const DraggableCard = ({ tarefa, index, moveCard, columnId }) => {
    const ref = useRef(null);
    
    const [{ isDragging }, drag] = useDrag({
        type: 'CARD',
        item: { id: tarefa.id, index, columnId, originalColumnId: columnId },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'CARD',
        hover(item, monitor) {
            if (!ref.current) return;
            
            const dragIndex = item.index;
            const hoverIndex = index;
            const sourceColumnId = item.columnId;
            const targetColumnId = columnId;

            if (dragIndex === hoverIndex && sourceColumnId === targetColumnId) return;

            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

            // Apenas reordena na mesma coluna durante o hover
            if (sourceColumnId === targetColumnId) {
                moveCard(dragIndex, hoverIndex, sourceColumnId, targetColumnId);
                item.index = hoverIndex;
            }
        },
    });

    const getTipoStyle = (tipo) => {
        switch(tipo) {
            case 'admissao':
                return { background: '#1a73e8' };
            case 'demissao':
                return { background: '#dc3545' };
            case 'ferias':
                return { background: '#ffa000' };
            case 'envio_variaveis':
                return { background: '#28a745' };
            default:
                return { background: '#666' };
        }
    };

    const getPrioridadeStyle = (prioridade) => {
        switch(prioridade) {
            case 1:
                return { 
                    color: '#dc3545',
                    background: '#ffebeb',
                    icon: 'pi pi-arrow-up'
                };
            case 2:
                return { 
                    color: '#ffa000',
                    background: '#fff8e1',
                    icon: 'circle'
                };
            case 3:
                return { 
                    color: '#28a745',
                    background: '#e8f5e9',
                    icon: 'pi pi-arrow-down'
                };
            default:
                return { 
                    color: '#666',
                    background: '#f4f4f4',
                    icon: 'circle'
                };
        }
    };

    const getPrioridadeText = (prioridade) => {
        switch(prioridade) {
            case 1: return 'Alta';
            case 2: return 'Média';
            case 3: return 'Baixa';
            default: return 'Normal';
        }
    };

    const getTipoText = (tipo) => {
        switch(tipo) {
            case 'admissao': return 'Admissão';
            case 'demissao': return 'Rescisão';
            case 'ferias': return 'Férias';
            case 'envio_variaveis': return 'Envio Variáveis';
            default: return tipo;
        }
    };

    const getSLAInfo = () => {
        const dataInicio = new Date(tarefa.criado_em);
        const dataAgendada = new Date(tarefa.agendado_para);
        const hoje = new Date();
        const diasEmAberto = Math.ceil((hoje - dataInicio) / (1000 * 60 * 60 * 24));
        
        let cor = '';
        let texto = '';
        
        if (tarefa.status === 'concluida') {
            cor = '#28a745';
            texto = 'Concluída';
        } else {
            const diasAteEntrega = Math.ceil((dataAgendada - hoje) / (1000 * 60 * 60 * 24));
            if (diasAteEntrega >= 2) {
                cor = '#28a745';
                texto = 'Dentro do prazo';
            } else if (diasAteEntrega > 0) {
                cor = '#ffa000';
                texto = 'Próximo do prazo';
            } else {
                cor = '#dc3545';
                texto = 'Em atraso';
            }
        }
        
        return { cor, texto, diasEmAberto };
    };

    const getTipoIcon = (tipo) => {
        switch(tipo) {
            case 'admissao': return <FaUserPlus fill="var(--white)" stroke="var(--white)" color="#fff" size={14} />;
            case 'demissao': return <FaSignOutAlt fill="var(--white)" stroke="var(--white)" color="#fff" size={14} />;
            case 'ferias': return <FaUmbrellaBeach fill="var(--white)" stroke="var(--white)" color="#fff" size={14} />;
            case 'envio_variaveis': return <FaFileInvoiceDollar fill="var(--white)" stroke="var(--white)" color="#fff" size={14} />;
            default: return null;
        }
    };

    drag(drop(ref));

    const slaInfo = getSLAInfo();

    return (
        <CardWrapper
            ref={ref}
            $isDragging={isDragging}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
            }}
        >
            <div className="card-header">
                <div 
                    className="tipo-tag"
                    style={getTipoStyle(tarefa.entidade_tipo)}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--white)' }}>
                        {getTipoIcon(tarefa.entidade_tipo)}
                        {getTipoText(tarefa.entidade_tipo)}
                    </div>
                </div>
                <div 
                    className="prioridade-tag"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                    {getPrioridadeStyle(tarefa.prioridade).icon === 'circle' ? (
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: getPrioridadeStyle(tarefa.prioridade).color
                        }}></div>
                    ) : (
                        <i className={getPrioridadeStyle(tarefa.prioridade).icon} style={{ 
                            fontSize: '12px', 
                            color: getPrioridadeStyle(tarefa.prioridade).color,
                            width: '8px',
                            height: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}></i>
                    )}
                    <div style={{
                        backgroundColor: getPrioridadeStyle(tarefa.prioridade).background,
                        color: getPrioridadeStyle(tarefa.prioridade).color,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '400'
                    }}>
                        {getPrioridadeText(tarefa.prioridade)}
                    </div>
                </div>
            </div>
            <div className="descricao">
                {tarefa.descricao}
            </div>
            <div className="meta-info">
                <div className="sla-info">
                    <div className="sla-status">
                        <div 
                            className="sla-dot" 
                            style={{ backgroundColor: slaInfo.cor }}
                        />
                        <div style={{ color: slaInfo.cor }}>{slaInfo.texto}</div>
                    </div>
                    <div className="dias-aberto">
                        {slaInfo.diasEmAberto} dia(s) em aberto
                    </div>
                </div>
            </div>
        </CardWrapper>
    );
};

const DroppableColumn = ({ status, children, onDrop }) => {
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: 'CARD',
        canDrop: (item) => {
            const sourceStatus = item.originalColumnId; // Usa a coluna original
            
            // Define o fluxo permitido
            const allowedTransitions = {
                'pendente': ['aprovada'],
                'aprovada': ['pendente'],
                'em_andamento': ['concluida'],
                'concluida': ['em_andamento']
            };

            return allowedTransitions[sourceStatus]?.includes(status) || false;
        },
        drop: (item) => {
            if (item.originalColumnId !== status) { // Só processa se for uma coluna diferente
                onDrop(item, status);
            }
        },
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    const backgroundColor = isOver 
        ? (canDrop ? '#f0fdf4' : '#fef2f2')
        : '#ffffff';

    return (
        <div 
            ref={drop} 
            className="cards-container"
            style={{
                backgroundColor,
                transition: 'background-color 0.2s ease',
                border: isOver ? `2px dashed ${canDrop ? '#86efac' : '#fca5a5'}` : '2px dashed transparent'
            }}
        >
            {children}
        </div>
    );
};

const FilterContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0px;
    padding: 0px;
    margin-top: 8px;
`

const FilterButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border: none;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    background: ${props => props.$active ? `linear-gradient(to left, ${props.$color}, ${props.$bgColor})` : 'transparent'};
    color: ${props => props.$active ? 'white' : '#374151'};
    width: 100%;
    text-align: left;

    & span {
        color: ${props => props.$active ? 'white' : '#374151'};
    }

    .filter-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    & svg * {
        color: ${props => props.$active ? '#fff' : props.$color};
        fill: ${props => props.$active ? '#fff' : props.$color};
    }

    &:hover {
        background: ${props => props.$active ? `linear-gradient(to left, ${props.$color}, ${props.$bgColor})` : '#f3f4f6'};
    }

    .remove-icon {
        display: flex;
        align-items: center;
        opacity: 0.7;
        
        svg * {
            color: ${props => props.$active ? '#fff' : props.$color};
        }
    }
`

const FilterLabel = styled.div`
    color: #64748b;
    font-size: 12px;
    padding: 8px 8px 4px;
    text-align: left;
    font-weight: 500;
    margin-top: 16px;
`

const AtividadesKanban = () => {
    const tarefas = useOutletContext();
    const toast = useRef(null);
    const [columns, setColumns] = useState({
        pendente: [],
        aprovada: [],
        em_andamento: [],
        concluida: []
    });
    const [activeSection, setActiveSection] = useState('novas');
    const [selectedTypes, setSelectedTypes] = useState([]);

    const tiposAtividade = [
        { 
            tipo: 'admissao', 
            label: 'Admissão',
            bgColor: '#1a73e8',
            color: '#4285f4',
            icon: <FaUserPlus size={14} />
        },
        { 
            tipo: 'demissao', 
            label: 'Rescisão',
            bgColor: '#dc3545',
            color: '#e4606d',
            icon: <FaSignOutAlt size={14} />
        },
        { 
            tipo: 'ferias', 
            label: 'Férias',
            bgColor: '#ffa000',
            color: '#ffb333',
            icon: <FaUmbrellaBeach size={14} />
        },
        { 
            tipo: 'envio_variaveis', 
            label: 'Envio Variáveis',
            bgColor: '#28a745',
            color: '#34ce57',
            icon: <FaFileInvoiceDollar size={14} />
        }
    ];

    useEffect(() => {
        if (tarefas && Array.isArray(tarefas)) {
            const newColumns = {
                pendente: [],
                aprovada: [],
                em_andamento: [],
                concluida: []
            };

            tarefas.forEach(tarefa => {
                // Se não houver filtros selecionados, mostra todas as tarefas
                if (selectedTypes.length === 0 || selectedTypes.includes(tarefa.entidade_tipo)) {
                    const status = tarefa.status || 'pendente';
                    if (newColumns[status]) {
                        newColumns[status].push(tarefa);
                    } else {
                        newColumns.pendente.push(tarefa);
                    }
                }
            });

            setColumns(newColumns);
        }
    }, [tarefas, selectedTypes]);

    const toggleTipoFilter = (tipo) => {
        setSelectedTypes(prev => {
            if (prev.includes(tipo)) {
                return prev.filter(t => t !== tipo);
            }
            return [...prev, tipo];
        });
    };

    const moveCard = async (fromIndex, toIndex, sourceColumnId, targetColumnId) => {
        // Define o fluxo permitido
        const allowedTransitions = {
            'pendente': ['aprovada'],
            'aprovada': ['pendente'],
            'em_andamento': ['concluida'],
            'concluida': ['em_andamento']
        };

        if (!allowedTransitions[sourceColumnId]?.includes(targetColumnId)) {
            return;
        }

        // Salva o estado anterior antes do movimento otimista
        const previousColumns = JSON.parse(JSON.stringify(columns));

        const sourceCards = Array.from(columns[sourceColumnId]);
        const targetCards = sourceColumnId === targetColumnId 
            ? sourceCards 
            : Array.from(columns[targetColumnId]);

        const [movedCard] = sourceCards.splice(fromIndex, 1);
        const originalStatus = movedCard.status;
        movedCard.status = targetColumnId;
        targetCards.splice(toIndex, 0, movedCard);

        // Atualiza o estado imediatamente (movimento otimista)
        const newColumns = {
            ...columns,
            [sourceColumnId]: sourceCards,
            [targetColumnId]: targetCards,
        };
        setColumns(newColumns);

        try {
            let endpoint = '';
            switch (targetColumnId) {
                case 'aprovada':
                    endpoint = `/tarefas/${movedCard.id}/aprovar/`;
                    break;
                case 'em_andamento':
                    endpoint = `/tarefas/${movedCard.id}/iniciar/`;
                    break;
                case 'concluida':
                    endpoint = `/tarefas/${movedCard.id}/concluir/`;
                    break;
                case 'pendente':
                    endpoint = `/tarefas/${movedCard.id}/reprovar/`;
                    break;
                default:
                    return;
            }

            await http.post(endpoint);
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            // Exibe o toast de erro
            toast.current.show({
                severity: 'error',
                summary: 'Erro ao atualizar status',
                detail: 'Não foi possível atualizar o status da tarefa. A operação foi revertida.',
                life: 5000
            });
            // Restaura o estado anterior
            setColumns(previousColumns);
        }
    };

    const sections = {
        novas: {
            title: 'Novas Tarefas',
            icon: <FaInbox size={16} />,
            columns: ['pendente', 'aprovada'],
            count: (columns['pendente']?.length || 0) + (columns['aprovada']?.length || 0)
        },
        andamento: {
            title: 'Em Progresso',
            icon: <FaSpinner size={16} />,
            columns: ['em_andamento', 'concluida'],
            count: (columns['em_andamento']?.length || 0) + (columns['concluida']?.length || 0)
        }
    };

    return (
        <Frame>
            <Container>
                <Toast ref={toast} />
                <KanbanLayout>
                    <VerticalMenu>
                        <div>
                        {Object.entries(sections).map(([key, section]) => (
                            <MenuItem
                                key={key}
                                $active={activeSection === key}
                                onClick={() => setActiveSection(key)}
                            >
                                {section.icon}
                                {section.title}
                                <span className="count">{section.count}</span>
                            </MenuItem>
                        ))}
                        </div>
                        <div>
                            <FilterLabel>Filtrar por Tipo</FilterLabel>
                            <FilterContainer>
                                {tiposAtividade.map(({ tipo, label, color, bgColor, icon }) => (
                                    <FilterButton
                                        key={tipo}
                                        $active={selectedTypes.includes(tipo)}
                                        $color={color}
                                        $bgColor={bgColor}
                                        onClick={() => toggleTipoFilter(tipo)}
                                    >
                                        <div className="filter-content">
                                            {icon}
                                            <span>{label}</span>
                                        </div>
                                        {selectedTypes.includes(tipo) && (
                                            <div className="remove-icon">
                                                <FaTimes size={10} />
                                            </div>
                                        )}
                                    </FilterButton>
                                ))}
                            </FilterContainer>
                        </div>
                    </VerticalMenu>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <DndProvider backend={HTML5Backend}>
                            <KanbanContainer>
                                <KanbanGroup>
                                    {sections[activeSection].columns.map(status => (
                                        <Column key={status} $status={status}>
                                            <div className="column-header">
                                                <div className="title">
                                                    {status === 'pendente' && 'Pendente'}
                                                    {status === 'aprovada' && 'Aprovada'}
                                                    {status === 'em_andamento' && 'Em Andamento'}
                                                    {status === 'concluida' && 'Concluída'}
                                                </div>
                                                <div className="count">
                                                    {(columns[status] || []).length}
                                                </div>
                                            </div>
                                            <DroppableColumn 
                                                status={status}
                                                onDrop={(item, targetStatus) => {
                                                    const sourceStatus = item.columnId;
                                                    const sourceIndex = item.index;
                                                    const targetIndex = columns[targetStatus].length;
                                                    moveCard(sourceIndex, targetIndex, sourceStatus, targetStatus);
                                                }}
                                            >
                                                {(columns[status] || []).map((tarefa, index) => (
                                                    <DraggableCard
                                                        key={tarefa.id}
                                                        tarefa={tarefa}
                                                        index={index}
                                                        columnId={status}
                                                        moveCard={moveCard}
                                                    />
                                                ))}
                                            </DroppableColumn>
                                        </Column>
                                    ))}
                                </KanbanGroup>
                            </KanbanContainer>
                        </DndProvider>
                    </div>
                </KanbanLayout>
            </Container>
        </Frame>
    );
};

export default AtividadesKanban; 