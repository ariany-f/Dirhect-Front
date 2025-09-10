import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Calendar } from 'primereact/calendar';
import { InputSwitch } from 'primereact/inputswitch';
import { FaSave, FaTimes } from 'react-icons/fa';
import Botao from '@components/Botao';
import CampoTexto from '@components/CampoTexto';
import DropdownItens from '@components/DropdownItens';
import { OverlayRight, DialogEstilizadoRight } from '@components/Modal/styles';

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

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e9ecef;
`;

const ModalTitle = styled.h2`
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #495057;
`;

const ModalContent = styled.div`
    flex: 1;
    overflow-y: auto;
    padding-right: 4px;
`;

const ModalFooter = styled.div`
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 12px;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #e9ecef;
`;

const ModalAgendamentoN8N = ({
    visible,
    onHide,
    onSave,
    editingData = null,
    saving = false
}) => {
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        tipo_agendamento: '',
        data_inicio: null,
        data_fim: null,
        intervalo_recorrencia: 1,
        unidade_recorrencia: '',
        horario_execucao: '',
        ativo: true,
        max_tentativas: 3,
        n8n_workflow_id: ''
    });

    const tiposAgendamento = [
        { label: 'Backup', value: 'backup' },
        { label: 'Relatório', value: 'relatorio' },
        { label: 'Limpeza', value: 'limpeza' }
    ];

    const unidadesRecorrencia = [
        { label: 'Minutos', value: 'minutes' },
        { label: 'Horas', value: 'hours' },
        { label: 'Dias', value: 'days' },
        { label: 'Semanas', value: 'weeks' },
        { label: 'Meses', value: 'months' }
    ];

    // Resetar formulário quando modal abre/fecha
    useEffect(() => {
        if (visible) {
            if (editingData) {
                // Modo edição - preencher com dados existentes
                setFormData({
                    nome: editingData.nome || '',
                    descricao: editingData.descricao || '',
                    tipo_agendamento: editingData.tipo_agendamento || '',
                    data_inicio: editingData.data_inicio ? new Date(editingData.data_inicio) : null,
                    data_fim: editingData.data_fim ? new Date(editingData.data_fim) : null,
                    intervalo_recorrencia: editingData.intervalo_recorrencia || 1,
                    unidade_recorrencia: editingData.unidade_recorrencia || '',
                    horario_execucao: editingData.horario_execucao || '',
                    ativo: editingData.ativo !== undefined ? editingData.ativo : true,
                    max_tentativas: editingData.max_tentativas || 3,
                    n8n_workflow_id: editingData.n8n_workflow_id || ''
                });
            } else {
                // Modo criação - resetar formulário
                resetFormData();
            }
        }
    }, [visible, editingData]);

    const resetFormData = () => {
        setFormData({
            nome: '',
            descricao: '',
            tipo_agendamento: '',
            data_inicio: null,
            data_fim: null,
            intervalo_recorrencia: 1,
            unidade_recorrencia: '',
            horario_execucao: '',
            ativo: true,
            max_tentativas: 3,
            n8n_workflow_id: ''
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSave) {
            onSave(formData);
        }
    };

    const handleClose = () => {
        resetFormData();
        if (onHide) {
            onHide();
        }
    };

    const handleOverlayClick = (e) => {
        // Só fecha o modal se o clique for diretamente no overlay (não nos elementos filhos)
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    return (
        <OverlayRight $opened={visible} onClick={handleOverlayClick}>
            <DialogEstilizadoRight $opened={visible} $width="600px" onClick={e => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>
                        {editingData ? 'Editar Agendamento' : 'Novo Agendamento'}
                    </ModalTitle>
                    <button className="close" onClick={handleClose}>
                        <FaTimes className="fechar" />
                    </button>
                </ModalHeader>

                <ModalContent>
                                <div style={{ padding: '0' }}>
                        <form onSubmit={handleSubmit}>
                            <FormRow>
                                <div>
                                    <CampoTexto
                                        label="Nome do Agendamento"
                                        valor={formData.nome}
                                        setValor={(valor) => setFormData({...formData, nome: valor})}
                                        name="nome"
                                        placeholder="Ex: Backup Diário"
                                        required={true}
                                        width="100%"
                                    />
                                </div>
                                <div>
                                    <DropdownItens
                                        label="Tipo"
                                        valor={formData.tipo_agendamento}
                                        setValor={(valor) => setFormData({...formData, tipo_agendamento: valor})}
                                        options={tiposAgendamento}
                                        name="tipo_agendamento"
                                        placeholder="Selecione o tipo"
                                        required={true}
                                        $width="100%"
                                        optionLabel="label"
                                    />
                                </div>
                            </FormRow>

                            <FormRow>
                                <div>
                                    <CampoTexto
                                        label="Intervalo de Recorrência"
                                        valor={formData.intervalo_recorrencia}
                                        setValor={(valor) => setFormData({...formData, intervalo_recorrencia: parseInt(valor) || 1})}
                                        name="intervalo_recorrencia"
                                        type="number"
                                        placeholder="1"
                                        min="1"
                                        required={true}
                                        width="100%"
                                    />
                                </div>
                                <div>
                                    <DropdownItens
                                        label="Unidade de Recorrência"
                                        valor={formData.unidade_recorrencia}
                                        setValor={(valor) => setFormData({...formData, unidade_recorrencia: valor})}
                                        options={unidadesRecorrencia}
                                        name="unidade_recorrencia"
                                        placeholder="Selecione a unidade"
                                        required={true}
                                        $width="100%"
                                        optionLabel="label"
                                    />
                                </div>
                            </FormRow>

                            <FormRow>
                                <div>
                                    <CampoTexto
                                        label="Horário de Execução"
                                        valor={formData.horario_execucao}
                                        setValor={(valor) => setFormData({...formData, horario_execucao: valor})}
                                        name="horario_execucao"
                                        type="time"
                                        placeholder="08:00"
                                        width="100%"
                                    />
                                </div>
                                <div>
                                    <CampoTexto
                                        label="Máximo de Tentativas"
                                        valor={formData.max_tentativas}
                                        setValor={(valor) => setFormData({...formData, max_tentativas: parseInt(valor) || 3})}
                                        name="max_tentativas"
                                        type="number"
                                        placeholder="3"
                                        min="1"
                                        max="10"
                                        required={true}
                                        width="100%"
                                    />
                                </div>
                            </FormRow>

                            <FormRow>
                                <div>
                                    <FormLabel>Data de Início</FormLabel>
                                    <Calendar
                                        value={formData.data_inicio}
                                        onChange={(e) => setFormData({...formData, data_inicio: e.value})}
                                        showTime
                                        hourFormat="24"
                                        className="w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <FormLabel>Data de Fim (Opcional)</FormLabel>
                                    <Calendar
                                        value={formData.data_fim}
                                        onChange={(e) => setFormData({...formData, data_fim: e.value})}
                                        showTime
                                        hourFormat="24"
                                        className="w-full"
                                    />
                                </div>
                            </FormRow>

                            <FormRow>
                                <div>
                                    <CampoTexto
                                        label="N8N Workflow ID"
                                        valor={formData.n8n_workflow_id}
                                        setValor={(valor) => setFormData({...formData, n8n_workflow_id: valor})}
                                        name="n8n_workflow_id"
                                        placeholder="ID do workflow no N8N"
                                        width="100%"
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
                </ModalContent>

                <ModalFooter>
                    <Botao
                        size="medium"
                        aoClicar={handleClose}
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
                        loading={saving}
                        style={{
                            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                            border: 'none',
                            color: 'white'
                        }}
                    >
                        <FaSave /> {editingData ? 'Atualizar' : 'Salvar'}
                    </Botao>
                </ModalFooter>
            </DialogEstilizadoRight>
        </OverlayRight>
    );
};

export default ModalAgendamentoN8N;
