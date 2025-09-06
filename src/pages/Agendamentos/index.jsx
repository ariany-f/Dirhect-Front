import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useRef } from 'react';
import { FaPlus, FaPen, FaTrash, FaPlay, FaPause, FaClock, FaSave, FaSync } from 'react-icons/fa';
import Botao from '@components/Botao';
import CampoTexto from '@components/CampoTexto';
import DropdownItens from '@components/DropdownItens';
import Loading from '@components/Loading';
import Frame from '@components/Frame';
import Container from '@components/Container';

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
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
`;

const Card = styled.div`
    background: ${props => {
        if (props.tipo === 'atestados') return '#F8FAFF';
        if (props.tipo === 'funcionarios') return '#FFF5F5';
        if (props.tipo === 'backup') return '#FFFDF5';
        if (props.tipo === 'relatorio') return '#F5FFF8';
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
        if (props.tipo === 'atestados') return '#1a73e8';
        if (props.tipo === 'funcionarios') return '#dc3545';
        if (props.tipo === 'backup') return '#ffa000';
        if (props.tipo === 'relatorio') return '#28a745';
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
            if (props.tipo === 'backup') return '#ffa000';
            if (props.tipo === 'relatorio') return '#28a745';
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
            if (props.tipo === 'backup') return '#ffa000';
            if (props.tipo === 'relatorio') return '#28a745';
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
            if (props.tipo === 'backup') return '#ffa000';
            if (props.tipo === 'relatorio') return '#28a745';
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

const StatusBadge = styled.span`
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    
    &.ativo {
        background: #d4edda;
        color: #155724;
    }
    
    &.inativo {
        background: #f8d7da;
        color: #721c24;
    }
    
    &.pausado {
        background: #fff3cd;
        color: #856404;
    }
`;

const FrequencyBadge = styled.span`
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
    background: #e3f2fd;
    color: #1976d2;
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
`;

const FormRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
    
    &.full-width {
        grid-template-columns: 1fr;
    }
`;

const FormLabel = styled.label`
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #495057;
`;

function Agendamentos() {
    const [agendamentos, setAgendamentos] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingAgendamento, setEditingAgendamento] = useState(null);
    const [loading, setLoading] = useState(false);
    const [savingAgendamento, setSavingAgendamento] = useState(false);
    const [filtroAtivo, setFiltroAtivo] = useState('total');
    const toast = useRef(null);

    // Estados do formulário
    const [formData, setFormData] = useState({
        nome: '',
        tipo: '',
        frequencia: '',
        horario: '',
        ativo: true,
        proximaExecucao: null,
        descricao: ''
    });

    const tiposAgendamento = [
        { label: 'Validação de Atestados', value: 'atestados' },
        { label: 'Validação de Funcionários', value: 'funcionarios' },
        { label: 'Limpeza de Logs', value: 'limpeza' }
    ];

    const frequencias = [
        { label: 'Diário', value: 'diario' },
        { label: 'Semanal', value: 'semanal' },
        { label: 'Mensal', value: 'mensal' },
        { label: 'Trimestral', value: 'trimestral' },
        { label: 'Anual', value: 'anual' }
    ];

    // Dados mockados para demonstração
    useEffect(() => {
        const mockData = [
            {
                id: 1,
                nome: 'Validação de Atestados - Manhã',
                tipo: 'atestados',
                frequencia: 'diario',
                horario: '08:00',
                ativo: true,
                proximaExecucao: new Date('2024-01-15T08:00:00'),
                ultimaExecucao: new Date('2024-01-14T08:00:00'),
                descricao: 'Validação automática de atestados médicos todos os dias às 8h'
            },
            {
                id: 2,
                nome: 'Validação de Funcionários - Semanal',
                tipo: 'funcionarios',
                frequencia: 'semanal',
                horario: '09:00',
                ativo: true,
                proximaExecucao: new Date('2024-01-16T09:00:00'),
                ultimaExecucao: new Date('2024-01-09T09:00:00'),
                descricao: 'Verificação semanal de dados dos funcionários'
            }
        ];
        setAgendamentos(mockData);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSavingAgendamento(true);

        // Simular salvamento
        setTimeout(() => {
            if (editingAgendamento) {
                // Editar existente
                setAgendamentos(prev => prev.map(item => 
                    item.id === editingAgendamento.id 
                        ? { ...formData, id: editingAgendamento.id, ultimaExecucao: item.ultimaExecucao }
                        : item
                ));
                toast.current.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Agendamento atualizado com sucesso!'
                });
            } else {
                // Criar novo
                const novoAgendamento = {
                    ...formData,
                    id: Date.now(),
                    ultimaExecucao: null
                };
                setAgendamentos(prev => [...prev, novoAgendamento]);
                toast.current.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Agendamento criado com sucesso!'
                });
            }

            setModalVisible(false);
            setEditingAgendamento(null);
            setFormData({
                nome: '',
                tipo: '',
                frequencia: '',
                horario: '',
                ativo: true,
                proximaExecucao: null,
                descricao: ''
            });
            setSavingAgendamento(false);
        }, 1000);
    };

    const handleEdit = (agendamento) => {
        setEditingAgendamento(agendamento);
        setFormData({
            nome: agendamento.nome,
            tipo: agendamento.tipo,
            frequencia: agendamento.frequencia,
            horario: agendamento.horario,
            ativo: agendamento.ativo,
            proximaExecucao: agendamento.proximaExecucao,
            descricao: agendamento.descricao
        });
        setModalVisible(true);
    };

    const handleDelete = (agendamento) => {
        confirmDialog({
            message: `Tem certeza que deseja excluir o agendamento "${agendamento.nome}"?`,
            header: 'Confirmar Exclusão',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                setAgendamentos(prev => prev.filter(item => item.id !== agendamento.id));
                toast.current.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Agendamento excluído com sucesso!'
                });
            }
        });
    };

    const toggleStatus = (agendamento) => {
        setAgendamentos(prev => prev.map(item => 
            item.id === agendamento.id 
                ? { ...item, ativo: !item.ativo }
                : item
        ));
        
        toast.current.show({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Agendamento ${agendamento.ativo ? 'pausado' : 'ativado'} com sucesso!`
        });
    };

    const statusTemplate = (rowData) => {
        const status = rowData.ativo ? 'ativo' : 'inativo';
        return <StatusBadge className={status}>{rowData.ativo ? 'Ativo' : 'Inativo'}</StatusBadge>;
    };

    const frequenciaTemplate = (rowData) => {
        const freq = frequencias.find(f => f.value === rowData.frequencia);
        return <FrequencyBadge>{freq ? freq.label : rowData.frequencia}</FrequencyBadge>;
    };

    const proximaExecucaoTemplate = (rowData) => {
        if (!rowData.proximaExecucao) return '-';
        return new Date(rowData.proximaExecucao).toLocaleString('pt-BR');
    };

    const ultimaExecucaoTemplate = (rowData) => {
        if (!rowData.ultimaExecucao) return 'Nunca';
        return new Date(rowData.ultimaExecucao).toLocaleString('pt-BR');
    };

    const actionsTemplate = (rowData) => {
        return (
            <ActionButtons>
                <Button
                    icon={rowData.ativo ? <FaPause /> : <FaPlay />}
                    className="p-button-rounded p-button-text p-button-sm"
                    onClick={() => toggleStatus(rowData)}
                    tooltip={rowData.ativo ? 'Pausar' : 'Ativar'}
                />
                <Button
                    icon={<FaPen />}
                    className="p-button-rounded p-button-text p-button-sm"
                    onClick={() => handleEdit(rowData)}
                    tooltip="Editar"
                />
                <Button
                    icon={<FaTrash />}
                    className="p-button-rounded p-button-text p-button-sm p-button-danger"
                    onClick={() => handleDelete(rowData)}
                    tooltip="Excluir"
                />
            </ActionButtons>
        );
    };

    // Funções para contar agendamentos por tipo
    const contarAgendamentosPorTipo = (tipo) => {
        if (!agendamentos) return 0;
        if (tipo === 'total') return agendamentos.length;
        return agendamentos.filter(a => a.tipo === tipo).length;
    };

    const contarAgendamentosAtivosPorTipo = (tipo) => {
        if (!agendamentos) return 0;
        if (tipo === 'total') return agendamentos.filter(a => a.ativo).length;
        return agendamentos.filter(a => a.tipo === tipo && a.ativo).length;
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
            icon: <FaPlay fill="#dc3545" />,
            titulo: 'Funcionários',
            tipo: 'funcionarios'
        }
    };

    const handleFiltroChange = (tipo) => {
        if (filtroAtivo === tipo) {
            setFiltroAtivo('total');
        } else {
            setFiltroAtivo(tipo);
        }
    };

    const recarregarDados = () => {
        setLoading(true);
        // Simular recarregamento
        setTimeout(() => {
            setLoading(false);
            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Dados recarregados com sucesso!'
            });
        }, 1000);
    };

    // Filtrar agendamentos baseado no filtro ativo
    const agendamentosFiltrados = agendamentos ? 
        (filtroAtivo === 'total' ? agendamentos : agendamentos.filter(a => a.tipo === filtroAtivo)) 
        : [];

    return (
        <>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <ConfirmDialog />
            
            {
                agendamentos ?
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
                                                {ativos} de {total} ativo{ativos !== 1 ? 's' : ''}
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
                                marginBottom: '16px' 
                                }}>
                                    <div></div>
                                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
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
                            
                            <DataTable
                                value={agendamentosFiltrados}
                                paginator
                                rows={10}
                                emptyMessage="Nenhum agendamento encontrado"
                                className="p-datatable-sm"
                            >
                                <Column field="nome" header="Nome" sortable style={{ width: '25%' }} />
                                <Column field="tipo" header="Tipo" sortable style={{ width: '15%' }} />
                                <Column body={frequenciaTemplate} header="Frequência" style={{ width: '12%' }} />
                                <Column field="horario" header="Horário" style={{ width: '10%' }} />
                                <Column body={statusTemplate} header="Status" style={{ width: '10%' }} />
                                <Column body={proximaExecucaoTemplate} header="Próxima Execução" style={{ width: '15%' }} />
                                <Column body={ultimaExecucaoTemplate} header="Última Execução" style={{ width: '15%' }} />
                                <Column body={actionsTemplate} header="Ações" style={{ width: '13%' }} />
                            </DataTable>
                        </Container>
                    </Frame>
                </ConteudoFrame>
                :
                <ContainerSemRegistro>
                    <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <FaClock size={64} color="#6c757d" />
                        <h6>Não há agendamentos registrados</h6>
                        <p>Aqui você verá todos os agendamentos de tarefas automáticas registrados.</p>
                    </section>
                </ContainerSemRegistro>
            }

            <Dialog
                header={
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#495057'
                    }}>
                        {editingAgendamento ? 'Editar Agendamento' : 'Novo Agendamento'}
                    </div>
                }
                visible={modalVisible}
                onHide={() => {
                    setModalVisible(false);
                    setEditingAgendamento(null);
                    setFormData({
                        nome: '',
                        tipo: '',
                        frequencia: '',
                        horario: '',
                        ativo: true,
                        proximaExecucao: null,
                        descricao: ''
                    });
                }}
                style={{ width: '600px' }}
                modal
                closeOnEscape
                closable
                footer={
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'end', 
                        alignItems: 'center',
                        padding: '16px 0'
                    }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Botao
                                size="medium"
                                aoClicar={() => {
                                    setModalVisible(false);
                                    setEditingAgendamento(null);
                                    setFormData({
                                        nome: '',
                                        tipo: '',
                                        frequencia: '',
                                        horario: '',
                                        ativo: true,
                                        proximaExecucao: null,
                                        descricao: ''
                                    });
                                }}
                                style={{
                                    background: 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)',
                                    border: 'none',
                                    color: 'white'
                                }}
                            >
                                Cancelar
                            </Botao>
                            <Botao
                                size="medium"
                                aoClicar={handleSubmit}
                                loading={savingAgendamento}
                                style={{
                                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                    border: 'none',
                                    color: 'white'
                                }}
                            >
                                <FaSave /> {editingAgendamento ? 'Atualizar' : 'Salvar'}
                            </Botao>
                        </div>
                    </div>
                }
            >
                <div style={{ padding: '0' }}>
                    <form onSubmit={handleSubmit}>
                        <FormRow>
                            <div>
                                <CampoTexto
                                    label="Nome do Agendamento"
                                    valor={formData.nome}
                                    setValor={(valor) => setFormData({...formData, nome: valor})}
                                    name="nome"
                                    placeholder="Ex: Validação de Atestados"
                                    required={true}
                                    width="100%"
                                />
                            </div>
                            <div>
                                <DropdownItens
                                    label="Tipo"
                                    valor={formData.tipo}
                                    setValor={(valor) => setFormData({...formData, tipo: valor})}
                                    options={tiposAgendamento}
                                    name="tipo"
                                    placeholder="Selecione o tipo"
                                    required={true}
                                    $width="100%"
                                    optionLabel="label"
                                />
                            </div>
                        </FormRow>

                        <FormRow>
                            <div>
                                <DropdownItens
                                    label="Frequência"
                                    valor={formData.frequencia}
                                    setValor={(valor) => setFormData({...formData, frequencia: valor})}
                                    options={frequencias}
                                    name="frequencia"
                                    placeholder="Selecione a frequência"
                                    required={true}
                                    $width="100%"
                                    optionLabel="label"
                                />
                            </div>
                            <div>
                                <CampoTexto
                                    label="Horário"
                                    valor={formData.horario}
                                    setValor={(valor) => setFormData({...formData, horario: valor})}
                                    name="horario"
                                    type="time"
                                    required={true}
                                    width="100%"
                                />
                            </div>
                        </FormRow>

                        <FormRow>
                            <div>
                                <FormLabel>Próxima Execução</FormLabel>
                                <Calendar
                                    value={formData.proximaExecucao}
                                    onChange={(e) => setFormData({...formData, proximaExecucao: e.value})}
                                    showTime
                                    hourFormat="24"
                                    className="w-full"
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px' }}>
                                <InputSwitch
                                    checked={formData.ativo}
                                    onChange={(e) => setFormData({...formData, ativo: e.value})}
                                />
                                <FormLabel style={{ margin: 0 }}>Ativo</FormLabel>
                            </div>
                        </FormRow>

                        <FormRow className="full-width">
                            <div>
                                <CampoTexto
                                    label="Descrição"
                                    valor={formData.descricao}
                                    setValor={(valor) => setFormData({...formData, descricao: valor})}
                                    name="descricao"
                                    placeholder="Descreva o que este agendamento faz..."
                                    rows={3}
                                    width="100%"
                                />
                            </div>
                        </FormRow>
                    </form>
                </div>
            </Dialog>
        </>
    );
}

export default Agendamentos;
