import styles from './Tarefas.module.css'
import styled from "styled-components"
import { Link, Outlet, useLocation, useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import Texto from '@components/Texto'
import Frame from '@components/Frame'
import Titulo from '@components/Titulo'
import Botao from '@components/Botao'
import { Skeleton } from 'primereact/skeleton'
import Container from "@components/Container"
import BotaoVoltar from "@components/BotaoVoltar"
import Loading from '@components/Loading'
import BotaoGrupo from "@components/BotaoGrupo"
import BotaoSemBorda from "@components/BotaoSemBorda"
import { Toast } from 'primereact/toast'
import DataTableTarefasDetalhes from '@components/DataTableTarefasDetalhes'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { addLocale } from 'primereact/api'
import FrameVertical from '@components/FrameVertical'
import { Tag } from 'primereact/tag'
import { Real } from '@utils/formats'
import { PrimeIcons } from 'primereact/api'
import { FaExternalLinkAlt } from 'react-icons/fa'
import http from '@http'

const ConteudoFrame = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`

function DetalhesTarefas() {

    let { id } = useParams()
    const location = useLocation();
    const [tarefa, setTarefa] = useState(null)
    const [cliente, setCliente] = useState(null)
    const toast = useRef(null)
    const [loading, setLoading] = useState(true)
   
    useEffect(() => {
        setLoading(true);
        http.get(`processos/${id}/`)
            .then(response => {
                setTarefa(response);
                // Busca dados do cliente se houver tenant
                if (response.tenant) {
                    http.get(`/client_tenant/${response.tenant}/`)
                        .then(clienteResponse => {
                            setCliente(clienteResponse);
                        })
                        .catch(error => {
                            console.error('Erro ao buscar dados do cliente:', error);
                        });
                }
            })
            .catch(error => {
                console.error('Erro ao carregar processo:', error);
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar processo',
                    life: 3000
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    function representativSituacaoTemplate() {
        let status = '';
        let severity = '';

        switch(tarefa?.status_display)
        {
            case 'Concluída':
                status = 'Concluído';
                severity = 'success';
                break;
            case 'Em andamento':
                status = 'Em Andamento';
                severity = 'warning';
                break;
            case 'Aguardando':
                status = 'Aguardando Início';
                severity = 'danger';
                break;
            case 'Cancelada':
                status = 'Cancelada';
                severity = 'danger';
                break;
            case 'Pendente':
                status = 'Pendente';
                severity = 'warning';
                break;
            default:
                // Se não tiver status_display, usa a lógica do percentual
                if (tarefa?.percentual_conclusao === 0) {
                    status = 'Não iniciado';
                    severity = 'danger';
                } else if (tarefa?.percentual_conclusao === 100) {
                    status = 'Concluído';
                    severity = 'success';
                } else if (tarefa?.percentual_conclusao < 30) {
                    status = 'Aguardando';
                    severity = 'danger';
                } else {
                    status = 'Em Andamento';
                    severity = 'warning';
                }
        }

        return <Tag severity={severity} value={status} />;
    }
    
    // Função para retornar a tag do tipo de tarefa
    function tipoTarefaTag(tarefa) {
        let color = 'var(--neutro-400)';
        let label = '';
        let link = null;
        let id = null;
        let url = null;
        switch(tarefa.processo_codigo) {
            case 'admissao':
                color = 'var(--info)';
                label = 'Admissão';
                id = tarefa?.objeto?.id;
                url = id ? `/admissao/registro/${id}` : null;
                break;
            case 'demissao':
                color = 'var(--error)';
                label = 'Demissão';
                id = tarefa?.objeto?.funcionario_detalhe?.id;
                url = id ? `/colaborador/detalhes/${id}` : null;
                break;
            case 'ferias':
                color = 'var(--green-500)';
                label = 'Férias';
                id = tarefa?.objeto?.funcionario_detalhe?.id;
                url = id ? `/colaborador/detalhes/${id}` : null;
                break;
            case 'envio_variaveis':
                color = 'var(--primaria)';
                label = 'Envio de Variáveis';
                break;
            case 'adiantamento':
                color = 'var(--astra-500)';
                label = 'Adiantamento';
                break;
            case 'encargos':
                color = 'var(--green-400)';
                label = 'Encargos';
                break;
            case 'folha':
                color = 'var(--secundaria)';
                label = 'Folha Mensal';
                break;
            default:
                label = tarefa.processo_nome;
        }
        return (
            <span style={{display: 'flex', alignItems: 'center', gap: 6}}>
                <Tag value={label} style={{ backgroundColor: color, color: 'white', fontWeight: 600, fontSize: 14, borderRadius: 8, padding: '6px 18px' }} />
                {url && (
                    <a href={url} rel="noopener noreferrer" style={{marginLeft: 2, color: color, display: 'flex', alignItems: 'center'}}>
                        <FaExternalLinkAlt size={14} />
                    </a>
                )}
            </span>
        );
    }

    // Função para pegar o nome da referência com prefixo
    function referenciaDetalhada(tarefa) {
        let label = '';
        let cpf = '';
        
        if (tarefa?.objeto?.dados_candidato) {
            label = tarefa.objeto.dados_candidato.nome;
            cpf = tarefa.objeto.dados_candidato.cpf;
        } else if (tarefa?.objeto?.funcionario_detalhe) {
            label = tarefa.objeto.funcionario_detalhe.nome;
            cpf = tarefa.objeto.funcionario_detalhe.cpf;
        } else {
            label = tarefa?.processo_nome || '-';
            cpf = '';
        }
        
        return { label, cpf };
    }

    // Função para calcular status do prazo
    function statusPrazo(tarefa) {
        const dataEntrega = tarefa.data_entrega ? new Date(tarefa.data_entrega) : null;
        const dataInicio = tarefa.data_inicio ? new Date(tarefa.data_inicio) : null;
        if (!dataEntrega || !dataInicio) return null;
        const hoje = new Date();
        const totalDias = Math.ceil((dataEntrega - dataInicio) / (1000 * 60 * 60 * 24));
        const diasPassados = Math.ceil((hoje - dataInicio) / (1000 * 60 * 60 * 24));
        const porcentagem = totalDias > 0 ? (diasPassados / totalDias) : 1;
        let statusPrazo = '';
        let cor = '';
        if (tarefa.status === 'Concluída') {
            if (tarefa.data_conclusao) {
                const dataConclusao = new Date(tarefa.data_conclusao);
                if (dataConclusao <= dataEntrega) {
                    statusPrazo = 'Concluída dentro do prazo';
                    cor = 'var(--green-500)';
                } else {
                    statusPrazo = 'Concluída fora do prazo';
                    cor = 'var(--error)';
                }
            } else {
                statusPrazo = 'Concluída';
                cor = 'var(--green-500)';
            }
        } else {
            if (hoje > dataEntrega) {
                statusPrazo = 'Em atraso';
                cor = 'var(--error-600)';
            } else if (porcentagem < 0.6) {
                statusPrazo = 'Dentro do prazo';
                cor = 'var(--green-500)';
            } else if (porcentagem < 0.9) {
                statusPrazo = 'Próxima do vencimento';
                cor = 'var(--warning)';
            } else {
                statusPrazo = 'Próxima do vencimento';
                cor = 'var(--warning)';
            }
        }
        return <span style={{fontSize: 14, fontWeight: 500}}>{statusPrazo}</span>;
    }

    // Função para obter cor do status do prazo
    function corStatusPrazo(tarefa) {
        const dataEntrega = tarefa.data_entrega ? new Date(tarefa.data_entrega) : null;
        const dataInicio = tarefa.data_inicio ? new Date(tarefa.data_inicio) : null;
        if (!dataEntrega || !dataInicio) return '#888';
        const hoje = new Date();
        const totalDias = Math.ceil((dataEntrega - dataInicio) / (1000 * 60 * 60 * 24));
        const diasPassados = Math.ceil((hoje - dataInicio) / (1000 * 60 * 60 * 24));
        const porcentagem = totalDias > 0 ? (diasPassados / totalDias) : 1;
        let cor = '#888';
        if (tarefa.status === 'Concluída') {
            if (tarefa.data_conclusao) {
                const dataConclusao = new Date(tarefa.data_conclusao);
                if (dataConclusao <= dataEntrega) {
                    cor = 'var(--green-500)';
                } else {
                    cor = 'var(--error)';
                }
            } else {
                cor = 'var(--green-500)';
            }
        } else {
            if (hoje > dataEntrega) {
                cor = 'var(--error-600)';
            } else if (porcentagem < 0.6) {
                cor = 'var(--green-500)';
            } else if (porcentagem < 0.9) {
                cor = 'var(--warning)';
            } else {
                cor = 'var(--warning)';
            }
        }
        return cor;
    }

    const dataInicioTemplate = () => {
        return <p style={{fontWeight: '400'}}>{tarefa?.created_at ? new Date(tarefa.created_at).toLocaleDateString('pt-BR') : '-'}</p>
    }

    const dataEntregaTemplate = () => {
        const sla = tarefa?.sla || (tarefa?.percentual_conclusao < 100 ? 2 : 0);
        const dataInicio = tarefa?.created_at ? new Date(tarefa.created_at) : new Date();
        // Calcula a data de entrega com base no SLA
        const dataEntrega = new Date(dataInicio);
        dataEntrega.setDate(dataEntrega.getDate() + sla);
        
        if (!dataEntrega || !dataInicio) {
            return <p style={{fontWeight: '400'}}>{dataEntrega ? dataEntrega.toLocaleDateString('pt-BR') : '-'}</p>;
        }

        const hoje = new Date();
        const totalDias = Math.ceil((dataEntrega - dataInicio) / (1000 * 60 * 60 * 24));
        const diasPassados = Math.ceil((hoje - dataInicio) / (1000 * 60 * 60 * 24));
        const porcentagem = totalDias > 0 ? (diasPassados / totalDias) : 1;
        
        let statusPrazo = '';
        let cor = '';
        
        if (tarefa?.status === 'Concluída') {
            statusPrazo = 'Concluída';
            cor = 'var(--green-500)';
        } else {
            if (hoje > dataEntrega) {
                statusPrazo = 'Em atraso';
                cor = 'var(--error-600)';
            } else if (porcentagem < 0.6) {
                statusPrazo = 'Dentro do prazo';
                cor = 'var(--green-500)';
            } else if (porcentagem < 0.9) {
                statusPrazo = 'Próxima do vencimento';
                cor = 'var(--warning)';
            } else {
                statusPrazo = 'Próxima do vencimento';
                cor = 'var(--warning)';
            }
        }

        return (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
                <p style={{fontWeight: '600', margin: 0, color: cor}}>{dataEntrega.toLocaleDateString('pt-BR')}</p>
                <span style={{fontSize: 12, fontWeight: 400, marginTop: 2}}>{statusPrazo}</span>
            </div>
        );
    }

    function formatarCPF(cpf) {
        if (!cpf) return '-';
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    return (
        <>
        <Frame>
            <Toast ref={toast} />
            <Loading opened={loading} />
            <ConfirmDialog />
            <Container gap="18px">
                <BotaoVoltar linkFixo="/tarefas" />
                {tarefa ?
                    <>
                    {/* Topo: tipo de tarefa, status do prazo, referência (esquerda) e cliente (direita) */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      marginBottom: 32,
                      gap: 24
                    }}>
                      {/* Esquerda: tipo de tarefa, status do prazo, referência */}
                      <div style={{display: 'flex', flexDirection: 'column', gap: 8, minWidth: 220}}>
                        {/* Referência em destaque, grande */}
                        <div style={{marginTop: 4, display: 'flex', alignItems: 'start', gap: 8, flexDirection: 'column'}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                            <span style={{fontWeight: 900, fontSize: 24, color: '#222'}}>{referenciaDetalhada(tarefa).label}</span>
                            {tipoTarefaTag(tarefa)}
                          </div>
                          {referenciaDetalhada(tarefa).cpf && (
                            <div style={{fontSize: 15, color: '#888', fontWeight: 500, marginTop: 2}}>
                              CPF: {formatarCPF(referenciaDetalhada(tarefa).cpf)}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Direita: cliente */}
                      <div style={{display: 'flex', alignItems: 'center', gap: 14, minWidth: 220, justifyContent: 'flex-end'}}>
                        {cliente ? (
                          <>
                            <img src={cliente.simbolo} alt={cliente.nome} width={38} height={38} style={{borderRadius: '50%', border: '2px solid #eee'}} />
                            <div>
                              <Texto weight={700} size={14} style={{textAlign: 'right'}}>{cliente.nome}</Texto>
                            </div>
                          </>
                        ) : (
                          <Skeleton shape="circle" size="38px" />
                        )}
                      </div>
                    </div>
                    {/* Card de detalhes: status geral e outros dados */}
                    <div
                      style={{
                        background: '#fff',
                        borderRadius: 16,
                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                        padding: 8,
                        marginBottom: 24,
                        maxWidth: 900,
                        width: '100%',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 5,
                          alignItems: 'stretch',
                          justifyContent: 'space-between',
                        }}
                      >
                        {/* Data Início */}
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 96}}>
                          <span style={{color: '#222', fontWeight: 700, fontSize: 11, marginBottom: 3}}>
                            <i className="pi pi-calendar" style={{marginRight: 6, fontSize: 13}}/>Data Início
                          </span>
                          {dataInicioTemplate()}
                        </div>
                        {/* Data Entrega + Status do Prazo */}
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 96}}>
                          <span style={{color: '#222', fontWeight: 700, fontSize: 11, marginBottom: 3}}>
                            <i className="pi pi-calendar" style={{marginRight: 6, fontSize: 13}}/>Data Entrega
                          </span>
                          {dataEntregaTemplate()}
                        </div>
                        {/* Status da Tarefa (tag) */}
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 96}}>
                          <span style={{color: '#222', fontWeight: 700, fontSize: 11, marginBottom: 3}}>
                            <i className="pi pi-flag" style={{marginRight: 6, fontSize: 13}}/>Status
                          </span>
                          <span style={{marginTop: 2, paddingLeft: '16px'}}>{representativSituacaoTemplate()}</span>
                        </div>
                        {/* Itens */}
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 96}}>
                          <span style={{color: '#222', fontWeight: 700, fontSize: 11, marginBottom: 3}}>
                            <i className="pi pi-list" style={{marginRight: 6, fontSize: 13}}/>Itens Concluídos
                          </span>
                          <span style={{fontWeight: 500, fontSize: 14, color: '#444', paddingLeft: '16px'}}>
                            {tarefa?.concluidas_atividades}/{tarefa?.total_atividades}
                          </span>
                        </div>
                      </div>
                    </div>
                    </>
                    : <></>
                }
                <Titulo>
                    <Texto size={20} weight={700}>Atividades</Texto>
                </Titulo>
                <DataTableTarefasDetalhes tarefas={tarefa?.tarefas} />
            </Container>
        </Frame>
        </>
    )
}

export default DetalhesTarefas