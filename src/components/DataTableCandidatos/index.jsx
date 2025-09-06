import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { MdOutlineKeyboardArrowRight, MdWarning } from 'react-icons/md'
import './DataTable.css'
import CampoTexto from '@components/CampoTexto';
import Texto from '@components/Texto';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Real } from '@utils/formats'
import { Tag } from 'primereact/tag';
import { FaCheck, FaTimes, FaTrash, FaPen } from 'react-icons/fa';
import { Tooltip } from 'primereact/tooltip';
import http from '@http';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { confirmDialog } from 'primereact/confirmdialog';
import ModalEncaminharVaga from '@components/ModalEncaminharVaga';
import { Toast } from 'primereact/toast';

function DataTableCandidatos({ candidatos, vagaId = null, documentos = [], onCandidatosUpdate, onEditarCandidato }) {
    const[selectedCandidato, setSelectedCandidato] = useState(0)
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })
    const navegar = useNavigate()
    const [listaCandidatos, setListaCandidatos] = useState(candidatos || []);
    const [modalEncaminharAberto, setModalEncaminharAberto] = useState(false);
    const [candidatoParaAprovar, setCandidatoParaAprovar] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        if (candidatos?.length > 0 && vagaId) {
            const buscarDadosVagas = async () => {
                try {
                    const response = await http.get(`vagas_candidatos/?vaga=${vagaId}`);
                    
                    // Mapeia os candidatos com suas respectivas vagas configuradas
                    const candidatosAtualizados = candidatos.map(candidato => {
                        const vagaConfigurada = response.find(vc => vc.candidato_id === candidato.id);
                        if (vagaConfigurada) {
                            return {
                                ...candidato,
                                vagas_configuradas: [vagaConfigurada],
                                vaga_candidato_id: vagaConfigurada.id
                            };
                        }
                        return candidato;
                    });

                    setListaCandidatos(candidatosAtualizados);
                } catch (error) {
                    console.error('Erro ao buscar vagas configuradas:', error);
                    setListaCandidatos(candidatos);
                }
            };

            buscarDadosVagas();
        } else {
            setListaCandidatos(candidatos);
        }
    }, [candidatos, vagaId]);

    const onGlobalFilterChange = (value) => {
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    
    const representativeDatasTemplate = (rowData) => {
        return (
            <div>
                <b>Exame Médico:</b> <p>{new Date(rowData.dt_exame_medico).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                <b>Início:</b> <p>{new Date(rowData.dt_inicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
            </div>
        )
    }

    const representativeDataNascimentoTemplate = (rowData) => {
        return new Date(rowData.dt_nascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
    }

    const representativeDataInicioTemplate = (rowData) => {
        if (rowData.dt_inicio) {
            return new Date(rowData.dt_inicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
        } else {
            return '-----'
        }
    }

    const representativeDataExameMedicoTemplate = (rowData) => {
        if (rowData.dt_exame_medico) {
            return new Date(rowData.dt_exame_medico).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
        } else {
            return '-----'
        }
    }

    const representativeStatusPreenchimentoTemplate = (rowData) => {
        const vagaConfigurada = rowData?.vagas_configuradas?.[0];
        const status = vagaConfigurada?.status || '-----';
        let color = 'var(--neutro-400)';
        let labelStatus = '-----';
        
        switch (status) {
            case 'A':
                color = 'var(--green-500)';
                labelStatus = 'Aprovado';
                break;
            case 'R':
                color = 'var(--error)';
                labelStatus = 'Rejeitado';
                break;
            case 'S':
                color = 'var(--primaria)';
                labelStatus = 'Processo de Seleção';
                break;
            case 'C':
                color = 'var(--neutro-500)';
                labelStatus = 'Cancelado';
                break;
            default:
                color = 'var(--neutro-400)';
        }

        return (
            <Tag
                value={labelStatus}
                style={{
                    backgroundColor: color,
                    color: 'white',
                    fontWeight: 600,
                    fontSize: 13,
                    borderRadius: 8,
                    padding: '4px 12px',
                    textTransform: 'capitalize'
                }}
            />
        );
    };

    const representativeStatusCandidatoTemplate = (rowData) => {
        const status = rowData.statusDeCandidato;
        let color = 'var(--neutro-400)';
        if (status?.toLowerCase() === 'aprovado') color = 'var(--green-500)';
        else if (status?.toLowerCase() === 'rejeitado') color = 'var(--error)';
        return (
            <Tag
                value={status}
                style={{
                    backgroundColor: color,
                    color: 'white',
                    fontWeight: 600,
                    fontSize: 13,
                    borderRadius: 8,
                    padding: '4px 12px',
                    textTransform: 'capitalize'
                }}
            />
        );
    };
    
    const handleExcluir = (rowData) => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir esta candidatura?',
            header: 'Confirmação',
            icon: 'pi pi-info-circle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => {
                http.delete(`/candidato/${rowData.id}/candidatura/${vagaId}/`)
                .then(response => {
                    setListaCandidatos(listaCandidatos.filter(c => c.id !== rowData.id));
                })
            }
        });
    }

    const handleAprovar = async (rowData) => {
        // Verifica se deve abrir o modal baseado na variável de ambiente
        const deveAbrirModal = import.meta.env.VITE_OPTIONS_ACESSO_CANDIDATO === 'true';
        
        // Verifica se há documentos configurados para a vaga (sempre verifica)
        if (!documentos || documentos.length === 0) {
            confirmDialog({
                message: 'Não há documentos configurados para esta vaga. Deseja continuar mesmo assim?',
                header: 'Confirmação',
                icon: 'pi pi-info-circle',
                acceptLabel: 'Sim, continuar',
                rejectLabel: 'Não, cancelar',
                accept: () => {
                    // Se não deve abrir modal, executa diretamente
                    if (!deveAbrirModal) {
                        executarAprovacao(rowData);
                    } else {
                        // Se deve abrir modal, abre normalmente
                        setCandidatoParaAprovar(rowData);
                        setModalEncaminharAberto(true);
                    }
                },
                reject: () => {
                    // Não faz nada se o usuário cancelar
                }
            });
            return;
        }

        // Se há documentos configurados
        if (!deveAbrirModal) {
            // Se não deve abrir modal, mostra confirmação antes de enviar
            confirmDialog({
                message: 'Tem certeza que deseja aprovar este candidato?',
                header: 'Confirmação',
                icon: 'pi pi-info-circle',
                acceptLabel: 'Sim, aprovar',
                rejectLabel: 'Não, cancelar',
                accept: () => {
                    executarAprovacao(rowData);
                },
                reject: () => {
                    // Não faz nada se o usuário cancelar
                }
            });
        } else {
            // Se deve abrir modal, abre normalmente
            setCandidatoParaAprovar(rowData);
            setModalEncaminharAberto(true);
        }
    };

    // Função auxiliar para executar a aprovação
    const executarAprovacao = async (rowData) => {
        try {
            const vagaConfigurada = rowData?.vagas_configuradas?.[0];
            if (!vagaConfigurada) return;
            
            const payload = {
                html: '',
                assunto: "",
                dt_inscricao: new Date().toISOString().slice(0, 10),
                status: "S",
                vaga_candidato_id: vagaConfigurada.id,
                candidato: rowData.id,
                vaga: vagaId
            };
            
            await http.post(`vagas_candidatos/${payload.vaga_candidato_id}/seguir/`, payload);
            
            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Candidato encaminhado com sucesso!',
                life: 3000
            });

            // Atualiza a lista local
            setListaCandidatos(listaCandidatos.map(c =>
                c === rowData ? { 
                    ...c, 
                    vagas_configuradas: [{ ...c.vagas_configuradas?.[0], status: 'S' }]
                } : c
            ));

            // Notifica o componente pai para atualizar os dados
            if (onCandidatosUpdate) {
                onCandidatosUpdate();
            }
        } catch (error) {
            console.error('Erro ao encaminhar candidato:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao encaminhar candidato',
                life: 3000
            });
        }
    };

    const handleModalSalvar = async (payload) => {
        console.log(payload)
        try {
            await http.post(`vagas_candidatos/${payload.vaga_candidato_id}/seguir/`, payload);
            
            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Candidato encaminhado com sucesso!',
                life: 3000
            });

            // Atualiza a lista local
            setListaCandidatos(listaCandidatos.map(c =>
                c === candidatoParaAprovar ? { 
                    ...c, 
                    vagas_configuradas: [{ ...c.vagas_configuradas?.[0], status: 'S' }]
                } : c
            ));

            // Notifica o componente pai para atualizar os dados
            if (onCandidatosUpdate) {
                onCandidatosUpdate();
            }

            setModalEncaminharAberto(false);
        } catch (error) {
            console.error('Erro ao encaminhar candidato:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao encaminhar candidato',
                life: 3000
            });
        }
    };

    const handleRejeitar = async (rowData) => {
        try {
            const vagaConfigurada = rowData?.vagas_configuradas?.[0];
            if (!vagaConfigurada) return;
            
            await http.post(`vagas_candidatos/${vagaConfigurada.id}/reprovar/`);
            
            setListaCandidatos(listaCandidatos.map(c =>
                c === rowData ? { 
                    ...c, 
                    vagas_configuradas: [{ ...c.vagas_configuradas[0], status: 'R' }]
                } : c
            ));
        } catch (error) {
            console.error('Erro ao rejeitar candidato:', error);
        }
    };
      
    const representativeCandidatoTemplate = (rowData) => {
        const nascimento = rowData?.dt_nascimento ?
        new Date(rowData.dt_nascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
        : '---';
        return <div key={rowData.id}>
            <Texto weight={700} width={'100%'}>
                {rowData?.nome}
            </Texto>
            <div style={{marginTop: '10px', width: '100%', fontWeight: '500', fontSize:'13px', display: 'flex', color: 'var(--neutro-500)'}}>
                Nascimento:&nbsp;<p style={{fontWeight: '600', color: 'var(--neutro-500)'}}>{nascimento}</p>
            </div>
        </div>
    }

    const deficienciaTemplate = (rowData) => (
        <Tag
            value={rowData.deficiencia ? 'Sim' : 'Não'}
            style={{
                backgroundColor: rowData.deficiencia ? 'var(--info)' : 'var(--neutro-400)',
                color: 'white',
                fontWeight: 600,
                fontSize: 13,
                borderRadius: 8,
                padding: '4px 12px',
            }}
        />
    );

    const emailTemplate = (rowData) => (
        <span style={{ fontSize: 14 }}>{rowData.email || '-----'}</span>
    );

    const telefoneTemplate = (rowData) => (
        <span style={{ fontSize: 13 }}>{rowData.telefone || '-----'}</span>
    );

    const actionTemplate = (rowData) => {
        const hoje = new Date();
        const encerramento = new Date(rowData?.vaga?.dt_encerramento);
        const vagaEncerrada = rowData?.vaga?.status === 'F' || hoje > encerramento;
        const vagaTransferida = rowData?.vaga?.status === 'T';
        
        const vagaConfigurada = rowData?.vagas_configuradas?.[0];
        const vagaAprovada = vagaConfigurada?.status === 'A';
        const vagaRejeitada = vagaConfigurada?.status === 'R';

        // Conta quantos candidatos já foram aprovados
        const candidatosAprovados = listaCandidatos.filter(c => 
            c.vagas_configuradas?.[0]?.status === 'A'
        ).length;

        // Verifica se já atingiu o limite de vagas
        const vagasPreenchidas = candidatosAprovados >= rowData?.vaga?.qtd_vaga;
        
        return (
            <div style={{ display: 'flex', gap: '12px' }}>
               {vagaEncerrada ? (
                <Tag
                    value="Vaga encerrada"
                    style={{
                        backgroundColor: 'var(--neutro-400)',
                        color: 'white',
                    }}
                />
               ) : (
                    vagasPreenchidas && (
                        <Tag
                            value={ <>
                                <MdWarning fill='var(--secundaria)' /> {`Quantidade máx de candidatos`}
                            </>}
                            style={{
                                backgroundColor: 'var(--neutro-400)',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: 10,
                                borderRadius: 8,
                                padding: '4px 8px'
                            }}
                        />
                )
               )}
                {/* Ícone de edição - só aparece para candidatos não aprovados e não rejeitados */}
                {!vagaEncerrada && !vagasPreenchidas && !vagaTransferida && !vagaAprovada && !vagaRejeitada && (
                    <>
                        <Tooltip target=".editar" mouseTrack mouseTrackLeft={10} />
                        <FaPen 
                            title="Editar" 
                            data-pr-tooltip="Editar candidato"
                            className="editar"
                            onClick={() => onEditarCandidato && onEditarCandidato(rowData)}
                            style={{
                                cursor: 'pointer',
                                color: 'var(--primaria)',
                            }}
                        />
                    </>
                )}
                
                {!vagaEncerrada && !vagaTransferida && !vagaAprovada && vagaConfigurada?.status !== 'R' && !vagasPreenchidas && (
                    <>
                        <Tooltip target=".aprovar" mouseTrack mouseTrackLeft={10} />
                        <FaCheck 
                            title="Aprovar" 
                            data-pr-tooltip={vagaTransferida ? "Vaga transferida - Ação indisponível" : "Aprovar candidato"}
                            className="aprovar"
                            onClick={() => handleAprovar(rowData)}
                            style={{
                                cursor: 'pointer',
                                color: 'var(--primaria)',
                            }}
                        />
                    </>
                )}
                {!vagaEncerrada && !vagasPreenchidas && !vagaTransferida && vagaConfigurada?.status !== 'R' && vagaConfigurada?.status !== 'A' && (
                    <>
                        <Tooltip target=".rejeitar" mouseTrack mouseTrackLeft={10} />
                        <FaTimes 
                            title="Rejeitar" 
                            data-pr-tooltip={vagaTransferida ? "Vaga transferida - Ação indisponível" : "Rejeitar candidato"}
                            className="rejeitar"
                            onClick={() => handleRejeitar(rowData)}
                            style={{
                                cursor: 'pointer',
                                color: 'var(--primaria)',
                            }}
                        />
                    </>
                )}
            </div>
        );
    };

    return (
        <>
            <Toast ref={toast} />
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <span className="p-input-icon-left">
                    <CampoTexto  width={'320px'} valor={globalFilterValue} setValor={onGlobalFilterChange} type="search" label="" placeholder="Buscar candidato" />
                </span>
            </div>
            <DataTable value={listaCandidatos} filters={filters} globalFilterFields={['nome', 'email']}  emptyMessage="Não foram encontrados candidatos" selection={selectedCandidato} selectionMode="single" paginator rows={10}  tableStyle={{ minWidth: '68vw' }}>
                <Column body={representativeCandidatoTemplate} field="nome" header="Nome" style={{ width: '15%' }}></Column>
                <Column body={emailTemplate} field="email" header="E-mail" style={{ width: '25%' }}></Column>
                <Column body={telefoneTemplate} field="telefone" header="Telefone" style={{ width: '13%' }}></Column>
                {/* <Column body={deficienciaTemplate} field="deficiencia" header="PCD" style={{ width: '10%' }} /> */}
                {/* <Column field="cpf" header="CPF" style={{ width: '15%' }}></Column> */}
                <Column body={representativeDatasTemplate} field="dt_exame_medico" header="Datas" style={{ width: '15%' }}></Column>
                {/* <Column body={representativeDataExameMedicoTemplate} field="dt_exame_medico" header="Exame Médico" style={{ width: '10%' }}></Column>
                <Column body={representativeDataInicioTemplate} field="dt_inicio" header="Data Início" style={{ width: '10%' }}></Column> */}
                <Column body={representativeStatusPreenchimentoTemplate} field="statusDePreenchimento" header="Status" style={{ width: '12%' }} />
                {/* <Column body={representativeStatusCandidatoTemplate} field="statusDeCandidato" header="Status Candidato" style={{ width: '12%' }} /> */}
                <Column body={actionTemplate} style={{ width: '15%' }} />
                {/* <Column field="statusDeCandidato" header="Status Candidato" style={{ width: '10%' }}></Column> */}
            </DataTable>
            <ModalEncaminharVaga
                opened={modalEncaminharAberto}
                aoFechar={() => setModalEncaminharAberto(false)}
                aoSalvar={handleModalSalvar}
                candidato={candidatoParaAprovar}
                vagaId={vagaId}
            />
        </>
    )
}

export default DataTableCandidatos