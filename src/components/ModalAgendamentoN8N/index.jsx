import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Calendar } from 'primereact/calendar';
import { FaSave, FaTimes } from 'react-icons/fa';
import Botao from '@components/Botao';
import CampoTexto from '@components/CampoTexto';
import DropdownItens from '@components/DropdownItens';
import SwitchInput from '@components/SwitchInput';
import { OverlayRight, DialogEstilizadoRight } from '@components/Modal/styles';

const FormRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 16px;
    
    /* Cada campo ocupa metade da largura menos o gap */
    & > div {
        flex: 1;
        min-width: calc(50% - 8px);
    }
    
    /* Para campos que devem ocupar a largura total */
    &.full-width > div {
        flex: 1;
        min-width: 100%;
    }
    
    /* Para casos especiais onde queremos apenas um campo por linha */
    &.single-field > div {
        flex: 1;
        min-width: 100%;
    }
    
    /* Responsivo - em telas menores, cada campo ocupa toda a largura */
    @media (max-width: 768px) {
        & > div {
            min-width: 100%;
        }
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

// Função para formatar horário para o formato esperado pela API
const formatTimeForAPI = (timeString) => {
    if (!timeString) return '';
    
    // Se já está no formato correto (HH:MM:SS), retorna como está
    if (timeString.match(/^\d{2}:\d{2}:\d{2}$/)) {
        return timeString;
    }
    
    // Se está no formato HH:MM, adiciona :00
    if (timeString.match(/^\d{2}:\d{2}$/)) {
        return `${timeString}:00`;
    }
    
    // Se está no formato H:MM, adiciona zero à esquerda e :00
    if (timeString.match(/^\d{1}:\d{2}$/)) {
        return `0${timeString}:00`;
    }
    
    // Se está no formato H:M, formata completamente
    if (timeString.match(/^\d{1}:\d{1}$/)) {
        const [hour, minute] = timeString.split(':');
        return `0${hour}:0${minute}:00`;
    }
    
    // Fallback: retorna vazio se não conseguir formatar
    console.warn('Formato de horário não reconhecido:', timeString);
    return '';
};

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
        tipo: '',
        entidade: '',
        data_inicio: null,
        data_fim: null,
        intervalo_recorrencia: 1,
        unidade_recorrencia: '',
        horario_execucao: '',
        ativo: true,
        max_tentativas: 3,
        webhook_url: ''
    });

    const tiposExecucao = [
        { label: 'Recorrente', value: 'recorrente' },
        { label: 'Única Execução', value: 'unico' }
    ];

    const entidades = [
        { label: 'Funcionário', value: 'funcionario' },
        { label: 'Atestado', value: 'atestado' },
        { label: 'Estrutura Organizacional', value: 'estrutura_organizacional' }
    ];

    const unidadesRecorrencia = [
        { label: 'Minutos', value: 'minutos' },
        { label: 'Horas', value: 'horas' },
        { label: 'Dias', value: 'dias' },
        { label: 'Semanas', value: 'semanas' },
        { label: 'Meses', value: 'meses' }
    ];

    // Resetar formulário quando modal abre/fecha
    useEffect(() => {
        if (visible) {
            if (editingData) {
                // Modo edição - preencher com dados existentes
                setFormData({
                    nome: editingData.nome || '',
                    descricao: editingData.descricao || '',
                    tipo: editingData.tipo || '',
                    entidade: editingData.entidade || '',
                    data_inicio: editingData.data_inicio ? new Date(editingData.data_inicio) : null,
                    data_fim: editingData.data_fim ? new Date(editingData.data_fim) : null,
                    intervalo_recorrencia: editingData.intervalo_recorrencia || 1,
                    unidade_recorrencia: editingData.unidade_recorrencia || '',
                    horario_execucao: editingData.horario_execucao || '',
                    ativo: editingData.ativo !== undefined ? editingData.ativo : true,
                    max_tentativas: editingData.max_tentativas || 3,
                    webhook_url: editingData.webhook_url || ''
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
            tipo: '',
            entidade: '',
            data_inicio: null,
            data_fim: null,
            intervalo_recorrencia: 1,
            unidade_recorrencia: '',
            horario_execucao: '',
            ativo: true,
            max_tentativas: 3,
            webhook_url: ''
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSave) {
            // Formatação do horário para envio
            const dataToSend = {
                ...formData,
                // Garante que horário_execucao esteja no formato correto (HH:MM:SS ou null/vazio)
                horario_execucao: formData.horario_execucao 
                    ? formatTimeForAPI(formData.horario_execucao)
                    : (formData.tipo === 'unico' ? null : '')
            };
            onSave(dataToSend);
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
            <DialogEstilizadoRight $opened={visible} $width="40vw" onClick={e => e.stopPropagation()}>
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
                                        label="Tipo de Execução"
                                        valor={formData.tipo}
                                        setValor={(valor) => setFormData({...formData, tipo: valor})}
                                        options={tiposExecucao}
                                        name="tipo"
                                        placeholder="Recorrente ou única"
                                        required={true}
                                        $width="100%"
                                        optionLabel="label"
                                    />
                                </div>
                            </FormRow>

                            <FormRow>
                                <div>
                                    <DropdownItens
                                        label="Entidade"
                                        valor={formData.entidade}
                                        setValor={(valor) => setFormData({...formData, entidade: valor})}
                                        options={entidades}
                                        name="entidade"
                                        placeholder="Selecione a entidade"
                                        required={true}
                                        $width="100%"
                                        optionLabel="label"
                                    />
                                </div>
                                <div>
                                    <CampoTexto
                                        label="Webhook URL"
                                        valor={formData.webhook_url}
                                        setValor={(valor) => setFormData({...formData, webhook_url: valor})}
                                        name="webhook_url"
                                        placeholder="https://n8n.exemplo.com/webhook/..."
                                        required={true}
                                        width="100%"
                                    />
                                </div>
                            </FormRow>

                            {formData.tipo === 'recorrente' && (
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
                            )}

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
                                    <FormLabel>Data da Execução</FormLabel>
                                    <Calendar
                                        value={formData.data_inicio}
                                        onChange={(e) => setFormData({...formData, data_inicio: e.value})}
                                        showTime
                                        hourFormat="24"
                                        className="w-full"
                                        required
                                    />
                                </div>
                                {formData.tipo === 'recorrente' && (
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
                                )}
                            </FormRow>

                            <FormRow className="single-field">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px' }}>
                                    <SwitchInput
                                        checked={formData.ativo}
                                        onChange={(value) => setFormData({...formData, ativo: value})}
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
