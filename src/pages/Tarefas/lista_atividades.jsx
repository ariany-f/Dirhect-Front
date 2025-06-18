import styled from "styled-components"
import { Link, Outlet, useLocation, useOutlet, useOutletContext } from "react-router-dom"
import React, { createContext, useContext, useState } from 'react';
import DataTableAtividades from '@components/DataTableAtividades'
import Frame from '@components/Frame'
import Container from '@components/Container'
import { FaUserPlus, FaUserMinus, FaUmbrellaBeach, FaFileInvoiceDollar, FaTasks } from 'react-icons/fa'
import { Dropdown } from 'primereact/dropdown';

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

const CardContainer = styled.div`
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    margin-bottom: 32px;
    width: 100%;
`

const Card = styled.div`
    background: ${props => {
        if (props.tipo === 'admissao') return '#F8FAFF';
        if (props.tipo === 'demissao') return '#FFF5F5';
        if (props.tipo === 'ferias') return '#FFFDF5';
        if (props.tipo === 'envio_variaveis') return '#F5FFF8';
        if (props.tipo === 'total') return '#F8F9FA';
        return '#fff';
    }};
    padding: 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    flex: 1;
    min-width: 200px;
    box-shadow: ${props => props.active ? '0 4px 12px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)'};
    border: 1px solid ${props => {
        if (!props.active) return '#E5E7EB';
        if (props.tipo === 'admissao') return '#1a73e8';
        if (props.tipo === 'demissao') return '#dc3545';
        if (props.tipo === 'ferias') return '#ffa000';
        if (props.tipo === 'envio_variaveis') return '#28a745';
        if (props.tipo === 'total') return 'var(--black)';
        return '#E5E7EB';
    }};

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    .header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
    }

    .icon {
        font-size: 16px;
        color: ${props => {
            if (props.tipo === 'admissao') return '#1a73e8';
            if (props.tipo === 'demissao') return '#dc3545';
            if (props.tipo === 'ferias') return '#ffa000';
            if (props.tipo === 'envio_variaveis') return '#28a745';
            if (props.tipo === 'total') return 'var(--black)';
            return '#222';
        }};
        & svg * {
            fill: ${props => {
                if (props.tipo === 'admissao') return '#1a73e8';
                if (props.tipo === 'demissao') return '#dc3545';
                if (props.tipo === 'ferias') return '#ffa000';
                if (props.tipo === 'envio_variaveis') return '#28a745';
                if (props.tipo === 'total') return 'var(--black)';
                return '#222';
            }};
        }
    }

    .titulo {
        font-size: 14px;
        font-weight: 500;
        color: ${props => {
            if (props.tipo === 'admissao') return '#1a73e8';
            if (props.tipo === 'demissao') return '#dc3545';
            if (props.tipo === 'ferias') return '#ffa000';
            if (props.tipo === 'envio_variaveis') return '#28a745';
            if (props.tipo === 'total') return 'var(--black)';
            return '#222';
        }};
    }

    .quantidade {
        font-size: 28px;
        font-weight: 700;
        color: ${props => {
            if (props.tipo === 'admissao') return '#1a73e8';
            if (props.tipo === 'demissao') return '#dc3545';
            if (props.tipo === 'ferias') return '#ffa000';
            if (props.tipo === 'envio_variaveis') return '#28a745';
            if (props.tipo === 'total') return 'var(--black)';
            return '#222';
        }};
    }
`

const AtividadesLista = () => {
    const location = useLocation();
    const context = useOutletContext();
    const [filtroAtivo, setFiltroAtivo] = useState('total');

    const contarTarefasPorTipo = (tipo) => {
        if (!context) return 0;
        return context.filter(tarefa => tarefa.entidade_tipo === tipo).length;
    };

    const contarConcluidasPorTipo = (tipo) => {
        if (!context) return 0;
        return context.filter(tarefa => tarefa.entidade_tipo === tipo && tarefa.status === 'concluida').length;
    };

    const contarTotalConcluidas = () => {
        if (!context) return 0;
        return context.filter(tarefa => tarefa.status === 'concluida').length;
    };

    const getSLAInfo = (tarefa) => {
        const dataInicio = new Date(tarefa.criado_em);
        const dataAgendada = new Date(tarefa.agendado_para);
        const hoje = new Date();
        const diasEmAberto = Math.ceil((hoje - dataInicio) / (1000 * 60 * 60 * 24));
        
        if (tarefa.status === 'concluida') {
            return 'concluido';
        }
        
        const diasAteEntrega = Math.ceil((dataAgendada - hoje) / (1000 * 60 * 60 * 24));
        if (diasAteEntrega >= 2) {
            return 'dentro_prazo';
        } else if (diasAteEntrega > 0) {
            return 'proximo_prazo';
        } else {
            return 'atrasado';
        }
    };

    const cardConfig = {
        total: {
            icon: <FaTasks />,
            titulo: 'Total',
            tipo: 'total'
        },
        admissao: {
            icon: <FaUserPlus />,
            titulo: 'Admissões',
            tipo: 'admissao'
        },
        demissao: {
            icon: <FaUserMinus />,
            titulo: 'Rescisões',
            tipo: 'demissao'
        },
        ferias: {
            icon: <FaUmbrellaBeach />,
            titulo: 'Férias',
            tipo: 'ferias'
        },
        envio_variaveis: {
            icon: <FaFileInvoiceDollar />,
            titulo: 'Envio Variáveis',
            tipo: 'envio_variaveis'
        }
    };

    const tarefasFiltradas = context?.filter(tarefa => {
        // Filtro por tipo
        if (filtroAtivo !== 'total' && tarefa.entidade_tipo !== filtroAtivo) {
            return false;
        }

        return true;
    });

    const handleFiltroChange = (tipo) => {
        if (filtroAtivo === tipo) {
            setFiltroAtivo('total');
        } else {
            setFiltroAtivo(tipo);
        }
    };

    return (
        <Frame gap="12px">
            <Container gap="12px">
                <CardContainer>
                    {Object.entries(cardConfig).map(([tipo, config]) => {
                        const total = tipo === 'total' 
                            ? (context?.length || 0)
                            : contarTarefasPorTipo(tipo);
                        const concluidas = tipo === 'total'
                            ? contarTotalConcluidas()
                            : contarConcluidasPorTipo(tipo);
                        return (
                            <Card 
                                key={tipo}
                                tipo={config.tipo}
                                active={filtroAtivo === tipo}
                                onClick={() => handleFiltroChange(tipo)}
                            >
                                <div className="header">
                                    <div className="icon">
                                        {config.icon}
                                    </div>
                                    <div className="titulo">{config.titulo}</div>
                                </div>
                                <div className="quantidade">{total}</div>
                                {concluidas > 0 && (
                                    <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>
                                        {concluidas} concluída{concluidas > 1 ? 's' : ''}
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </CardContainer>
                
                <DataTableAtividades tarefas={tarefasFiltradas} />
            </Container>
        </Frame>
    );
};

export default AtividadesLista;