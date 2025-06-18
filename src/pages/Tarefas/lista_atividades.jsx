import styled from "styled-components"
import { Link, Outlet, useLocation, useOutlet, useOutletContext } from "react-router-dom"
import React, { createContext, useContext, useState } from 'react';
import DataTableAtividades from '@components/DataTableAtividades'
import Frame from '@components/Frame'
import Container from '@components/Container'

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
    border-radius: 8px;
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

    .titulo {
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 8px;
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
        return context.filter(tarefa => {
            // Conta apenas tarefas não concluídas
            if (tarefa.status === 'concluida') return false;
            return tarefa.entidade_tipo === tipo;
        }).length;
    };

    const tarefasFiltradas = filtroAtivo 
        ? context?.filter(tarefa => tarefa.entidade_tipo === filtroAtivo)
        : context;

    return (
        <Frame>
            <Container gap="32px">
                <CardContainer>
                    <Card 
                        tipo="admissao"
                        active={filtroAtivo === 'admissao'} 
                        onClick={() => setFiltroAtivo(filtroAtivo === 'admissao' ? null : 'admissao')}
                    >
                        <div className="titulo">Admissões</div>
                        <div className="quantidade">{contarTarefasPorTipo('admissao')}</div>
                    </Card>
                    <Card 
                        tipo="demissao"
                        active={filtroAtivo === 'demissao'} 
                        onClick={() => setFiltroAtivo(filtroAtivo === 'demissao' ? null : 'demissao')}
                    >
                        <div className="titulo">Rescisões</div>
                        <div className="quantidade">{contarTarefasPorTipo('demissao')}</div>
                    </Card>
                    <Card 
                        tipo="ferias"
                        active={filtroAtivo === 'ferias'} 
                        onClick={() => setFiltroAtivo(filtroAtivo === 'ferias' ? null : 'ferias')}
                    >
                        <div className="titulo">Férias</div>
                        <div className="quantidade">{contarTarefasPorTipo('ferias')}</div>
                    </Card>
                    <Card 
                        tipo="envio_variaveis"
                        active={filtroAtivo === 'envio_variaveis'} 
                        onClick={() => setFiltroAtivo(filtroAtivo === 'envio_variaveis' ? null : 'envio_variaveis')}
                    >
                        <div className="titulo">Envio Variáveis</div>
                        <div className="quantidade">{contarTarefasPorTipo('envio_variaveis')}</div>
                    </Card>
                </CardContainer>
                
                <DataTableAtividades tarefas={tarefasFiltradas} />
            </Container>
        </Frame>
    );
};

export default AtividadesLista; 