import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import Texto from '@components/Texto';
import CampoTexto from '@components/CampoTexto';
import http from '@http';
import './ModalListaColaboradoresPorEstrutura.css';
import { useTranslation } from 'react-i18next';
import { Tag } from 'primereact/tag';

const ModalListaColaboradoresPorEstrutura = ({ 
    visible, 
    onHide, 
    tipoEstrutura, // 'filial', 'departamento', 'secao'
    estruturaId, 
    estruturaNome,
    estruturaTipo // Para mostrar o tipo na interface
}) => {
    const [colaboradores, setColaboradores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filtro, setFiltro] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [registrosPorPagina] = useState(20);
    const toast = useRef(null);
    const { t } = useTranslation('common');

    useEffect(() => {
        if (visible && estruturaId) {
            carregarColaboradores();
        }
    }, [visible, estruturaId, paginaAtual, filtro]);

    const carregarColaboradores = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: paginaAtual,
                page_size: registrosPorPagina
            });

            // Adicionar filtro baseado no tipo de estrutura
            if (tipoEstrutura === 'filial') {
                params.append('filial__id', estruturaId);
            } else if (tipoEstrutura === 'departamento') {
                params.append('departamento__id', estruturaId);
            } else if (tipoEstrutura === 'secao') {
                params.append('id_secao__id', estruturaId);
            } else if (tipoEstrutura === 'cargo') {
                params.append('id_funcao__id_cargo', estruturaId);
            } else if (tipoEstrutura === 'funcao') {
                params.append('id_funcao__id', estruturaId);
            } else if (tipoEstrutura === 'sindicato') {
                params.append('sindicato', estruturaId);
            } else if (tipoEstrutura === 'horario') {
                params.append('horario', estruturaId);
            } else if (tipoEstrutura === 'centro_custo') {
                params.append('centro_custo__id', estruturaId);
            }

            if (filtro.trim()) {
                params.append('search', filtro.trim());
            }

            const response = await http.get(`funcionario/?${params.toString()}`);
            
            if (response.results) {
                setColaboradores(response.results);
                setTotalRegistros(response.count || 0);
            } else {
                setColaboradores(response);
                setTotalRegistros(response.length || 0);
            }
        } catch (error) {
            console.error('Erro ao carregar colaboradores:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Não foi possível carregar os colaboradores',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const onPageChange = (event) => {
        setPaginaAtual(event.page + 1);
    };

    const handleFiltroChange = (valor) => {
        setFiltro(valor);
        setPaginaAtual(1); // Reset para primeira página ao filtrar
    };

    const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);

    // Template para nome do colaborador
    const nomeTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {rowData.imagem && (
                    <img 
                        src={rowData.imagem} 
                        alt="Foto" 
                        style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '50%',
                            objectFit: 'cover'
                        }} 
                    />
                )}
                <div>
                    <div style={{ fontWeight: '600', color: '#495057' }}>
                        {rowData.funcionario_pessoa_fisica?.nome || '---'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6c757d' }}>
                        Chapa: {rowData.chapa || '---'}
                    </div>
                </div>
            </div>
        );
    };

    // Template para cargo e função
    const cargoTemplate = (rowData) => {
        return (
            <div>
                <div style={{ fontWeight: '500', color: '#495057' }}>
                    {rowData.funcao_nome || '---'}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>
                    {rowData.tipo_funcionario_descricao || '---'}
                </div>
            </div>
        );
    };

    // Template para informações de contato
    const contatoTemplate = (rowData) => {
        const pessoa = rowData.funcionario_pessoa_fisica;
        return (
            <div>
                <div style={{ color: '#495057' }}>
                    {pessoa?.email || '---'}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>
                    {pessoa?.telefone1 || '---'}
                </div>
            </div>
        );
    };

    // Template para situação e admissão
    const situacaoTemplate = (rowData) => {
        return (
            <div>
                <div style={{ 
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '500',
                    backgroundColor: rowData.tipo_situacao_cor_tag || '#6c757d',
                    color: 'white'
                }}>
                    {rowData.tipo_situacao_descricao || '---'}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
                    Adm: {rowData.dt_admissao ? new Date(rowData.dt_admissao).toLocaleDateString('pt-BR') : '---'}
                </div>
            </div>
        );
    };

    // Template para filial e departamento
    const estruturaTemplate = (rowData) => {
        return (
            <div>
                <div style={{ fontWeight: '500', color: '#495057' }}>
                    {rowData.filial_nome || '---'}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>
                    {rowData.secao_nome || '---'}
                </div>
            </div>
        );
    };

    const getTituloModal = () => {
        const tipo = estruturaTipo || tipoEstrutura;
        return (
            <div style={{ display: 'flex', paddingBottom: '14px', alignItems: 'center', gap: '8px' }}>
                <Texto size="16px" weight="600">Colaboradores ({tipo.charAt(0).toUpperCase() + tipo.slice(1)})</Texto>
                <div
                    style={{
                        backgroundColor: 'rgba(150, 164, 95, 0.1)', // Azul com 10% de transparência
                        color: 'var(--neutro-700)',
                        padding: '2px 12px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: '500', // Azul com 20% de transparência
                        display: 'inline-block'
                    }}
                >
                    {estruturaNome}
                </div>
            </div>
        );
    };

    const headerTemplate = (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            width: '100%'
        }}>
            <h3 style={{ margin: 0 }}>{getTituloModal()}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CampoTexto
                    width="300px"
                    valor={filtro}
                    setValor={handleFiltroChange}
                    placeholder={t('search_colaborators')}
                    type="search"
                />
            </div>
        </div>
    );

    const footerTemplate = (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            width: '100%'
        }}>
            <span>
                Total: {totalRegistros} colaborador{totalRegistros !== 1 ? 'es' : ''}
            </span>
            <span>
                Página {paginaAtual} de {totalPaginas}
            </span>
        </div>
    );

    return (
        <>
            <Toast ref={toast} />
            <Dialog
                visible={visible}
                onHide={onHide}
                header={headerTemplate}
                footer={footerTemplate}
                style={{ width: '95vw', maxWidth: '1400px' }}
                modal
                className="modal-colaboradores"
                closeOnEscape
                closable
            >
                <div style={{ minHeight: '500px' }}>
                    <DataTable
                        value={colaboradores}
                        loading={loading}
                        emptyMessage="Nenhum colaborador encontrado"
                        paginator
                        rows={registrosPorPagina}
                        totalRecords={totalRegistros}
                        first={(paginaAtual - 1) * registrosPorPagina}
                        onPage={onPageChange}
                        lazy
                        dataKey="id"
                        tableStyle={{ minWidth: '100%' }}
                        rowHover
                        stripedRows
                    >
                        <Column 
                            body={nomeTemplate}
                            header="Colaborador" 
                            style={{ width: '25%' }}
                        />
                        <Column 
                            body={cargoTemplate}
                            header="Função/Tipo" 
                            style={{ width: '25%' }}
                        />
                        <Column 
                            body={situacaoTemplate}
                            header="Situação" 
                            style={{ width: '25%' }}
                        />
                        <Column 
                            body={estruturaTemplate}
                            header="Estrutura" 
                            style={{ width: '25%' }}
                        />
                    </DataTable>
                </div>
            </Dialog>
        </>
    );
};

export default ModalListaColaboradoresPorEstrutura;
