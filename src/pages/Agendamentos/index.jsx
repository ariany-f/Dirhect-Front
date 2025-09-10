import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useRef } from 'react';
import { FaPlus, FaClock, FaSync, FaTrash, FaSave, FaPen } from 'react-icons/fa';
import Botao from '@components/Botao';
import Loading from '@components/Loading';
import Frame from '@components/Frame';
import Container from '@components/Container';
import DataTableAgendamentosN8N from '@components/DataTableAgendamentosN8N';
import ModalAgendamentoN8N from '@components/ModalAgendamentoN8N';
import http from '@http';

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    overflow-x: hidden;
`;

const ContainerSemRegistro = styled.div`
    display: flex;
    padding: 96px 12px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 48px;
    width: 100%;
    text-align: center;
    & p {
        margin: 0 auto;
        max-width: 400px;
    }

    & h6 {
        max-width: 500px;
        margin: 0 auto;
    }
`;

const CardContainer = styled.div`
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    margin-bottom: 32px;
    width: 100%;
    overflow-x: hidden;
    
    @media (max-width: 768px) {
        gap: 16px;
    }
    
    @media (max-width: 480px) {
        gap: 12px;
        flex-direction: column;
    }
`;

const Card = styled.div`
    background: ${props => {
        if (props.tipo === 'atestados') return '#F8FAFF';
        if (props.tipo === 'funcionarios') return '#FFF5F5';
        if (props.tipo === 'estrutura') return '#F5FFF8';
        if (props.tipo === 'total') return '#F8F9FA';
        return '#fff';
    }};
    padding: 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    flex: 1;
    min-width: 180px;
    
    @media (max-width: 768px) {
        min-width: 150px;
    }
    box-shadow: ${props => props.active ? '0 4px 12px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)'};
    border: 1px solid ${props => {
        if (!props.active) return '#E5E7EB';
        if (props.tipo === 'atestados') return '#1a73e8';
        if (props.tipo === 'funcionarios') return '#dc3545';
        if (props.tipo === 'estrutura') return '#28a745';
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
            if (props.tipo === 'atestados') return '#1a73e8';
            if (props.tipo === 'funcionarios') return '#dc3545';
            if (props.tipo === 'estrutura') return '#28a745';
            if (props.tipo === 'total') return 'var(--black)';
            return '#222';
        }};
    }

    .titulo {
        font-size: 14px;
        font-weight: 500;
        color: ${props => {
            if (props.tipo === 'atestados') return '#1a73e8';
            if (props.tipo === 'funcionarios') return '#dc3545';
            if (props.tipo === 'estrutura') return '#28a745';
            if (props.tipo === 'total') return 'var(--black)';
            return '#222';
        }};
    }

    .quantidade {
        font-size: 28px;
        font-weight: 700;
        color: ${props => {
            if (props.tipo === 'atestados') return '#1a73e8';
            if (props.tipo === 'funcionarios') return '#dc3545';
            if (props.tipo === 'estrutura') return '#28a745';
            if (props.tipo === 'total') return 'var(--black)';
            return '#222';
        }};
    }
`;

const RefreshButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    color: #333;
    border: none;
    border-radius: 8px;
    width: 40px;
    height: 40px;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
    outline: none;
    
    &:hover {
        background: #ececec;
        transform: scale(1.05);
    }
    
    &:active {
        transform: scale(0.95);
    }

    svg {
        width: 16px;
        height: 16px;
    }
    
    &.loading {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;





function Agendamentos() {
    const [agendamentos, setAgendamentos] = useState([]);
    const [agrupamentoPorTipo, setAgrupamentoPorTipo] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({
        count: 0,
        total_pages: 0,
        current_page: 1,
        page_size: 10,
        next: null,
        previous: null
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [editingAgendamento, setEditingAgendamento] = useState(null);
    const [loading, setLoading] = useState(false);
    const [savingAgendamento, setSavingAgendamento] = useState(false);
    const [filtroAtivo, setFiltroAtivo] = useState('total');
    const toast = useRef(null);

    // Carregar agendamentos com paginação
    const fetchDados = async (page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            
            // Carregar agendamentos paginados com agrupamento
            const response = await http.get(`/schedule_n8n/?page=${page}&page_size=${pageSize}`);
            const data = response;
            
            // Extrair dados paginados
            setAgendamentos(data.results || []);
            setAgrupamentoPorTipo(data.agrupamento_por_tipo || []);
            setPaginationInfo({
                count: data.count || 0,
                total_pages: data.total_pages || 0,
                current_page: data.current_page || page,
                page_size: data.page_size || pageSize,
                next: data.next,
                previous: data.previous
            });
            
        } catch (error) {
            if (toast.current) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível carregar os dados.'
                });
            }
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDados();
    }, []);

    const handleSave = async (formData) => {
        setSavingAgendamento(true);

        try {
            if (editingAgendamento) {
                // Editar existente
                const response = await http.put(`/schedule_n8n/${editingAgendamento.id}/`, formData);
                setAgendamentos(prev => prev.map(item => 
                    item.id === editingAgendamento.id ? response : item
                ));
                if (toast.current) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Agendamento atualizado com sucesso!'
                    });
                }
            } else {
                // Criar novo
                const response = await http.post('/schedule_n8n/', formData);
                setAgendamentos(prev => [...prev, response]);
                if (toast.current) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Agendamento criado com sucesso!'
                    });
                }
            }

            setModalVisible(false);
            setEditingAgendamento(null);
        } catch (error) {
            if (toast.current) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível salvar o agendamento.'
                });
            }
            console.error('Erro ao salvar agendamento:', error);
        } finally {
            setSavingAgendamento(false);
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setEditingAgendamento(null);
    };

    const handleEdit = (agendamento) => {
        setEditingAgendamento(agendamento);
        setModalVisible(true);
    };

    const handleDelete = (agendamento) => {
        confirmDialog({
            message: `Tem certeza que deseja excluir o agendamento "${agendamento.nome}"?`,
            header: 'Confirmar Exclusão',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await http.delete(`/schedule_n8n/${agendamento.id}/`);
                    setAgendamentos(prev => prev.filter(item => item.id !== agendamento.id));
                    if (toast.current) {
                        toast.current.show({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Agendamento excluído com sucesso!'
                        });
                    }
                } catch (error) {
                    if (toast.current) {
                        toast.current.show({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Não foi possível excluir o agendamento.'
                        });
                    }
                    console.error('Erro ao excluir agendamento:', error);
                }
            }
        });
    };

    const toggleStatus = async (agendamento) => {
        try {
            const endpoint = agendamento.ativo ? 'deactivate' : 'activate';
            const response = await http.post(`/schedule_n8n/${agendamento.id}/${endpoint}/`);
            
            setAgendamentos(prev => prev.map(item => 
                item.id === agendamento.id 
                    ? { ...item, ativo: !item.ativo }
                    : item
            ));
            
            if (toast.current) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: `Agendamento ${agendamento.ativo ? 'desativado' : 'ativado'} com sucesso!`
                });
            }
        } catch (error) {
            if (toast.current) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível alterar o status do agendamento.'
                });
            }
            console.error('Erro ao alterar status:', error);
        }
    };



    // Funções para contar agendamentos por tipo baseado no agrupamento
    const contarAgendamentosPorTipo = (tipo) => {
        if (!agrupamentoPorTipo || agrupamentoPorTipo.length === 0) return 0;
        
        if (tipo === 'total') {
            return agrupamentoPorTipo.reduce((sum, item) => sum + item.total, 0);
        }
        
        // Mapear tipos do card para tipos da API
        const tipoMap = {
            'atestados': 'Atestados',
            'funcionarios': 'Funcionários',  
            'estrutura': 'Estrutura'
        };
        
        const tipoAPI = tipoMap[tipo];
        const item = agrupamentoPorTipo.find(item => 
            item.entidade_tipo && item.entidade_tipo.includes(tipoAPI)
        );
        
        return item ? item.total : 0;
    };

    const contarAgendamentosAtivosPorTipo = (tipo) => {
        if (!agrupamentoPorTipo || agrupamentoPorTipo.length === 0) return 0;
        
        if (tipo === 'total') {
            return agrupamentoPorTipo.reduce((sum, item) => sum + (item.total_abertos || 0), 0);
        }
        
        // Mapear tipos do card para tipos da API
        const tipoMap = {
            'atestados': 'Atestados',
            'funcionarios': 'Funcionários',
            'estrutura': 'Estrutura'
        };
        
        const tipoAPI = tipoMap[tipo];
        const item = agrupamentoPorTipo.find(item => 
            item.entidade_tipo && item.entidade_tipo.includes(tipoAPI)
        );
        
        return item ? (item.total_abertos || 0) : 0;
    };

    const cardConfig = {
        total: {
            icon: <FaClock />,
            titulo: 'Total',
            tipo: 'total'
        },
        atestados: {
            icon: <FaPen fill="#1a73e8" />,
            titulo: 'Atestados',
            tipo: 'atestados'
        },
        funcionarios: {
            icon: <FaPlus fill="#dc3545" />,
            titulo: 'Funcionários',
            tipo: 'funcionarios'
        },
        estrutura: {
            icon: <FaSync fill="#28a745" />,
            titulo: 'Estrutura',
            tipo: 'estrutura'
        }
    };

    const handleFiltroChange = (tipo) => {
        if (filtroAtivo === tipo) {
            setFiltroAtivo('total');
        } else {
            setFiltroAtivo(tipo);
        }
    };

    const handlePageChange = (event) => {
        const newPage = event.page + 1; // PrimeReact usa base 0, API usa base 1
        fetchDados(newPage, event.rows);
    };

    const recarregarDados = async () => {
        await fetchDados(paginationInfo.current_page, paginationInfo.page_size);
        if (toast.current) {
            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Dados recarregados com sucesso!'
            });
        }
    };

    // Filtrar agendamentos baseado no filtro ativo
    const agendamentosFiltrados = agendamentos !== null ? 
        (filtroAtivo === 'total' ? agendamentos : agendamentos.filter(a => a.entidade_tipo === filtroAtivo)) 
        : [];

    return (
        <>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <ConfirmDialog />
            
            {
                agendamentos !== null && agrupamentoPorTipo !== null ?
                <ConteudoFrame>
                    <Frame gap="12px">
                        <Container gap="12px">
                            <CardContainer>
                                {Object.entries(cardConfig).map(([tipo, config]) => {
                                    const total = contarAgendamentosPorTipo(tipo);
                                    const ativos = contarAgendamentosAtivosPorTipo(tipo);
                                    
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
                                            <div className="quantidade">{ativos}</div>
                                            <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>
                                                {tipo === 'total' ? 
                                                    `${ativos} abertos de ${total} total` :
                                                    `${ativos} abertos de ${total} total`
                                                }
                                            </div>
                                        </Card>
                                    );
                                })}
                            </CardContainer>
                            
                         
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                gap: '12px',
                                width: '100%',
                                marginBottom: '16px',
                                overflowX: 'hidden'
                                }}>
                                    <div></div>
                                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                        <Botao
                                            size="small"
                                            aoClicar={() => setModalVisible(true)}
                                        >
                                            <FaPlus /> Novo Agendamento
                                        </Botao>
                                        <RefreshButton 
                                            onClick={recarregarDados}
                                            title="Recarregar dados"
                                        >
                                            <FaSync />
                                        </RefreshButton>
                                    </div>
                            </div>
                            
                            <DataTableAgendamentosN8N
                                data={agendamentosFiltrados}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onToggleStatus={toggleStatus}
                                loading={loading}
                                paginator={true}
                                rows={paginationInfo.page_size}
                                totalRecords={paginationInfo.count}
                                onPageChange={handlePageChange}
                                first={(paginationInfo.current_page - 1) * paginationInfo.page_size}
                            />
                        </Container>
                    </Frame>
                </ConteudoFrame>
                :
                <ContainerSemRegistro>
                    <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <FaClock size={64} color="#6c757d" />
                        <h6>Carregando dados...</h6>
                        <p>Aguarde enquanto carregamos os agendamentos e estatísticas.</p>
                    </section>
                </ContainerSemRegistro>
            }

            <ModalAgendamentoN8N
                visible={modalVisible}
                onHide={handleCloseModal}
                onSave={handleSave}
                editingData={editingAgendamento}
                saving={savingAgendamento}
            />
        </>
    );
}

export default Agendamentos;
