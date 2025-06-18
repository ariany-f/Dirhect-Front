import styled from "styled-components"
import { Link, Outlet, useLocation, useOutlet, useOutletContext } from "react-router-dom"
import React, { createContext, useContext, useState } from 'react';
import DataTableAtividades from '@components/DataTableAtividades'
import Frame from '@components/Frame'
import Container from '@components/Container'
import { FaUserPlus, FaUserMinus, FaUmbrellaBeach, FaFileInvoiceDollar } from 'react-icons/fa'

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
            return '#222';
        }};
        & svg * {
            fill: ${props => {
                if (props.tipo === 'admissao') return '#1a73e8';
                if (props.tipo === 'demissao') return '#dc3545';
                if (props.tipo === 'ferias') return '#ffa000';
                if (props.tipo === 'envio_variaveis') return '#28a745';
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
            return '#222';
        }};
    }
`

const AtividadesLista = () => {
    const location = useLocation();
    const context = useOutletContext();
    const [filtroAtivo, setFiltroAtivo] = useState('admissao');

    const contarTarefasPorTipo = (tipo) => {
        if (!context) return 0;
        return context.filter(tarefa => tarefa.entidade_tipo === tipo).length;
    };

    const contarConcluidasPorTipo = (tipo) => {
        if (!context) return 0;
        return context.filter(tarefa => tarefa.entidade_tipo === tipo && tarefa.status === 'concluida').length;
    };

    const cardConfig = {
        admissao: {
            icon: <FaUserPlus />,
            titulo: 'Admissões'
        },
        demissao: {
            icon: <FaUserMinus />,
            titulo: 'Rescisões'
        },
        ferias: {
            icon: <FaUmbrellaBeach />,
            titulo: 'Férias'
        },
        envio_variaveis: {
            icon: <FaFileInvoiceDollar />,
            titulo: 'Envio Variáveis'
        }
    };

    const tarefasFiltradas = filtroAtivo 
        ? context?.filter(tarefa => tarefa.entidade_tipo === filtroAtivo)
        : context;

    return (
        <Frame gap="12px">
            <Container gap="12px">
                <CardContainer>
                    {Object.entries(cardConfig).map(([tipo, config]) => {
                        const total = contarTarefasPorTipo(tipo);
                        const concluidas = contarConcluidasPorTipo(tipo);
                        return (
                            <Card 
                                key={tipo}
                                tipo={tipo}
                                active={filtroAtivo === tipo}
                                onClick={() => setFiltroAtivo(filtroAtivo === tipo ? null : tipo)}
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