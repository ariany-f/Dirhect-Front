import http from '@http'
import { useEffect, useState, useRef, useMemo } from 'react'
import Loading from '@components/Loading'
import { useSessaoUsuarioContext } from '@contexts/SessaoUsuario'
import { Chart } from 'primereact/chart'
import { FaUserPlus, FaUmbrellaBeach, FaArrowRight, FaUserTimes, FaCheckCircle, FaRegClock, FaSyncAlt, FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '@pages/Dashboard/DashboardAtividades.css'
import { ArmazenadorToken } from '@utils'

function Estatisticas() {
    const {
        usuarioEstaLogado,
        usuario
    } = useSessaoUsuarioContext()

    const [loadingOpened, setLoadingOpened] = useState(true)
    const [indicadoresTarefas, setIndicadoresTarefas] = useState(null)
    const [refreshing, setRefreshing] = useState(false)
    const isMounted = useRef(true)

    // Cores padronizadas para cada tipo de processo
    const coresProcessos = {
        'admissao': '#5472d4', // Azul
        'demissao': '#e53935', // Vermelho
        'ferias': '#66BB6A'    // Verde
    };

    // Cores de fundo suaves para cada tipo de processo
    const coresFundoProcessos = {
        'admissao': '#e3f2fd', // Azul claro
        'demissao': '#ffebee', // Vermelho claro
        'ferias': '#fff8e1'    // Amarelo claro
    };

    // Função para buscar todos os dados das estatísticas
    const carregarEstatisticas = async () => {
        console.log('Carregando estatísticas');
        setRefreshing(true);
        try {
            if(usuarioEstaLogado) {
                console.log('Usuario esta logado');
                
                // Buscar indicadores sem tenant (visão global)
                if(ArmazenadorToken.hasPermission('view_tarefa')) {
                    await http.get('tarefas/indicadores/')
                        .then(response => {
                            console.log('Response do endpoint /tarefas/indicadores/:', response);
                            setIndicadoresTarefas(response);
                        })
                        .catch(error => {
                            console.error('Erro ao carregar indicadores de tarefas:', error);
                            setIndicadoresTarefas(null);
                        });
                } else {
                    setIndicadoresTarefas(null);
                }
            }
        } finally {
            if (isMounted.current) setRefreshing(false);
        }
    };

    useEffect(() => {
        console.log('useEffect');
        isMounted.current = true;
        
        // Adicionar delay de 1 segundo antes de carregar as estatísticas
        const timer = setTimeout(() => {
            console.log('Carregando estatísticas');
            carregarEstatisticas();
            console.log('Carregou estatísticas');
        }, 1000);
        
        return () => { 
            isMounted.current = false;
            clearTimeout(timer); // Limpar o timer se o componente for desmontado
        };
    }, [usuarioEstaLogado]); // Removido usuario?.company_public_id das dependências

    // Dados dos indicadores de tarefas para visão global
    const dadosIndicadores = indicadoresTarefas || {
        atividades_tipo: {},
        atividades_status: {},
        atividades_sla: {},
        status_por_tipo: {},
        sla_por_tipo: {}
    };

    // CORREÇÃO: Mudar a condição de loading para verificar se os dados foram carregados
    if (indicadoresTarefas === null) {
        return <Loading opened={loadingOpened} />
    }

    const chartOptions = {
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: '#222',
                    font: { size: 14, weight: 400 }
                }
            },
            tooltip: {
                backgroundColor: '#fff',
                titleColor: '#222',
                bodyColor: '#222',
                borderColor: 'var(--primaria)',
                borderWidth: 1,
                padding: 12,
                caretSize: 8,
                cornerRadius: 8,
            }
        },
        layout: {
            padding: 16
        },
        elements: {
            arc: { borderRadius: 12 },
            bar: { borderRadius: 8 }
        }
    };

    const chartOptionsNoLegend = {
        ...chartOptions,
        plugins: {
            ...chartOptions.plugins,
            legend: { display: false }
        }
    };

    return (
        <>
            <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginBottom: 12}}>
                <button onClick={carregarEstatisticas} style={{background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 8, transition: 'background 0.2s'}} title="Recarregar estatísticas" disabled={refreshing}>
                    <FaSyncAlt size={22} color="#888" className={refreshing ? 'spin-refresh' : ''} />
                </button>
            </div>
            
            <div
                style={{
                    marginBottom: 32,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: 32,
                    alignItems: 'stretch',
                    width: '100%',
                }}
            >
                {/* Card Principal de Atividades */}
                <div className="card-atividade" style={{position: 'relative', overflow: 'hidden', width: '100%', boxSizing: 'border-box'}}>
                    <div className="card-header">
                        <span className="card-title">Visão Geral Global</span>
                        <Link to="/atividades" style={{fontWeight: 500, color: 'var(--neutro-500)', fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4}}>
                            Ver todas <FaArrowRight size={15} />
                        </Link>
                    </div>
                    
                    {/* Métricas principais */}
                    <div style={{display: 'flex', width: '100%', gap: 10, alignItems: 'flex-end', marginBottom: 16, marginTop: 16, justifyContent: 'space-between'}}>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start', minWidth: 50}}>
                            <span style={{fontSize: 24, fontWeight: 900, color: '#222', display: 'flex', alignItems: 'center', gap: 2}}>
                                {Object.values(dadosIndicadores.atividades_tipo || {}).reduce((sum, val) => sum + val, 0)}
                            </span>
                            <span style={{fontWeight: 400, fontSize: 10, marginTop: 2}}>Total</span>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start', minWidth: 70}}>
                            <span style={{fontSize: 24, fontWeight: 900, color: '#e53935', display: 'flex', alignItems: 'center', gap: 2}}>
                                <FaExclamationTriangle fill="#e53935" size={22} style={{marginRight: 2, verticalAlign: 'middle'}} /> 
                                {dadosIndicadores.atividades_sla?.atrasado || 0}
                            </span>
                            <span style={{fontWeight: 400, fontSize: 10, marginTop: 2}}>Atrasadas</span>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start', minWidth: 80}}>
                            <span style={{fontSize: 20, fontWeight: 900, color: '#5472d4', display: 'flex', alignItems: 'center', gap: 2}}>
                                <FaRegClock fill="#5472d4" size={20} style={{marginRight: 2, verticalAlign: 'middle'}} /> 
                                {(dadosIndicadores.atividades_status?.em_andamento || 0) + (dadosIndicadores.atividades_status?.pendente || 0)}
                            </span>
                            <span style={{fontWeight: 400, fontSize: 10, marginTop: 2}}>Em Andamento</span>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start', minWidth: 70}}>
                            <span style={{fontSize: 20, fontWeight: 900, color: '#66BB6A', display: 'flex', alignItems: 'center', gap: 2}}>
                                <FaCheckCircle fill="#66BB6A" size={20} style={{marginRight: 2, verticalAlign: 'middle'}} /> 
                                {dadosIndicadores.atividades_status?.concluida || 0}
                            </span>
                            <span style={{fontWeight: 400, fontSize: 10, marginTop: 2}}>Concluídas</span>
                        </div>
                    </div>

                    {/* Alertas críticos */}
                    <div style={{display: 'flex', gap: 8, flexWrap: 'wrap', margin: '16px 0'}}>
                        {dadosIndicadores.atividades_sla?.atrasado > 0 && (
                            <span style={{
                                background: '#ffeaea',
                                color: '#b71c1c',
                                fontWeight: 400,
                                borderRadius: 8,
                                padding: '8px 16px',
                                fontSize: 13,
                                minWidth: 0,
                                textAlign: 'center'
                            }}>
                                <b style={{color: '#b71c1c', fontSize: 14}}>{dadosIndicadores.atividades_sla.atrasado}</b> atividades atrasadas
                            </span>
                        )}
                        {dadosIndicadores.atividades_status?.erro > 0 && (
                            <span style={{
                                background: '#fff4e5',
                                color: '#b26a00',
                                fontWeight: 400,
                                borderRadius: 8,
                                padding: '6px 16px',
                                fontSize: 13,
                                minWidth: 0,
                                textAlign: 'center'
                            }}>
                                <b style={{color: '#b26a00', fontSize: 14}}>{dadosIndicadores.atividades_status.erro}</b> com erro
                            </span>
                        )}
                        {(dadosIndicadores.atividades_sla?.atrasado === 0 && dadosIndicadores.atividades_status?.erro === 0) && (
                            <span style={{
                                color: '#2e7d32',
                                fontWeight: 500,
                                fontSize: 14,
                                background: '#e8f5e8',
                                borderRadius: 16,
                                padding: '8px 16px',
                                minWidth: 0,
                                textAlign: 'center'
                            }}>
                                Todas as atividades em dia
                            </span>
                        )}
                    </div>

                    {/* Distribuição por tipo */}
                    <hr style={{width: '100%', border: 'none', borderTop: '1px solid #f0f0f0', margin: '16px 0'}} />
                    <div style={{marginBottom: 12}}>
                        <div style={{fontWeight: 600, fontSize: 14, marginBottom: 8, color: '#222'}}>Nossos Principais Processos</div>
                        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                            {Object.entries(dadosIndicadores.atividades_tipo || {}).map(([tipo, quantidade]) => (
                                <span key={tipo}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        background: coresFundoProcessos[tipo],
                                        color: '#222',
                                        borderRadius: 10,
                                        padding: '8px 12px',
                                        fontWeight: 500,
                                        fontSize: 12
                                    }}>
                                    {tipo === 'admissao' ? 'Admissões' : 
                                     tipo === 'demissao' ? 'Demissões' : 
                                     tipo === 'ferias' ? 'Férias' : tipo}
                                    <span style={{
                                        background: coresProcessos[tipo],
                                        color: '#fff',
                                        borderRadius: 8,
                                        padding: '2px 8px',
                                        fontWeight: 700,
                                        fontSize: 12,
                                        marginLeft: 4
                                    }}>{quantidade}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Gráfico de Status das Atividades */}
                <div style={{
                    background: '#fff',
                    border: '1px solid var(--neutro-200)',
                    borderRadius: 20,
                    boxShadow: '0 2px 8px 0 rgba(60,60,60,0.06)',
                    padding: 28,
                    minHeight: 180,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    gap: 16,
                }}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 8}}>
                        <span style={{fontWeight: 700, fontSize: 18}}>Status das Atividades</span>
                        <Link to="/atividades" style={{fontWeight: 500, color: 'var(--neutro-500)', fontSize: 15, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4}}>
                            Ver mais&nbsp;<FaArrowRight size={16} />
                        </Link>
                    </div>
                    
                    {/* Métricas rápidas */}
                    <div style={{display: 'flex', gap: 12, marginBottom: 16, marginTop: 16, flexWrap: 'wrap'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#e3f2fd', borderRadius: 8}}>
                            <span style={{width: 12, height: 12, borderRadius: '50%', background: '#5472d4'}} />
                            <span style={{fontSize: 13, fontWeight: 600}}>Pendente: {dadosIndicadores.atividades_status?.pendente || 0}</span>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#fff3e0', borderRadius: 8}}>
                            <span style={{width: 12, height: 12, borderRadius: '50%', background: '#FFA726'}} />
                            <span style={{fontSize: 13, fontWeight: 600}}>Em Andamento: {dadosIndicadores.atividades_status?.em_andamento || 0}</span>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#e8f5e8', borderRadius: 8}}>
                            <span style={{width: 12, height: 12, borderRadius: '50%', background: '#66BB6A'}} />
                            <span style={{fontSize: 13, fontWeight: 600}}>Concluída: {dadosIndicadores.atividades_status?.concluida || 0}</span>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#ffebee', borderRadius: 8}}>
                            <span style={{width: 12, height: 12, borderRadius: '50%', background: '#e53935'}} />
                            <span style={{fontSize: 13, fontWeight: 600}}>Erro: {dadosIndicadores.atividades_status?.erro || 0}</span>
                        </div>
                    </div>
                    
                    <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                        <Chart 
                            type="doughnut" 
                            data={{
                                labels: ['Pendente', 'Em Andamento', 'Concluída', 'Erro'],
                                datasets: [{
                                    data: [
                                        dadosIndicadores.atividades_status?.pendente || 0,
                                        dadosIndicadores.atividades_status?.em_andamento || 0,
                                        dadosIndicadores.atividades_status?.concluida || 0,
                                        dadosIndicadores.atividades_status?.erro || 0
                                    ],
                                    backgroundColor: ['#5472d4', '#FFA726', '#66BB6A', '#e53935']
                                }]
                            }} 
                            options={chartOptionsNoLegend} 
                            style={{maxWidth: 260, margin: '0 auto'}} 
                        />
                    </div>
                </div>
                
                {/* Gráfico de SLA das Atividades */}
                <div style={{
                    background: '#fff',
                    border: '1px solid var(--neutro-200)',
                    borderRadius: 20,
                    boxShadow: '0 2px 8px 0 rgba(60,60,60,0.06)',
                    padding: 28,
                    minHeight: 180,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    gap: 16,
                }}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 8}}>
                        <span style={{fontWeight: 700, fontSize: 18}}>SLA das Atividades</span>
                        <Link to="/atividades" style={{fontWeight: 500, color: 'var(--neutro-500)', fontSize: 15, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4}}>
                            Ver mais&nbsp;<FaArrowRight size={16} />
                        </Link>
                    </div>
                    
                    {/* Alertas de SLA */}
                    <div style={{display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#ffebee', borderRadius: 8}}>
                            <span style={{width: 12, height: 12, borderRadius: '50%', background: '#e53935'}} />
                            <span style={{fontSize: 13, fontWeight: 600}}>Atrasadas: {dadosIndicadores.atividades_sla?.atrasado || 0}</span>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#e8f5e8', borderRadius: 8}}>
                            <span style={{width: 12, height: 12, borderRadius: '50%', background: '#66BB6A'}} />
                            <span style={{fontSize: 13, fontWeight: 600}}>Dentro do Prazo: {dadosIndicadores.atividades_sla?.dentro_prazo || 0}</span>
                        </div>
                    </div>
                    
                    <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                        <Chart 
                            type="pie" 
                            data={{
                                labels: ['Atrasadas', 'Dentro do Prazo'],
                                datasets: [{
                                    data: [
                                        dadosIndicadores.atividades_sla?.atrasado || 0,
                                        dadosIndicadores.atividades_sla?.dentro_prazo || 0
                                    ],
                                    backgroundColor: ['#e53935', '#66BB6A']
                                }]
                            }} 
                            options={chartOptionsNoLegend} 
                            style={{maxWidth: 260, margin: '0 auto'}} 
                        />
                    </div>
                    
                    {/* Análise de SLA por tipo */}
                    <div style={{marginTop: 16, width: '100%'}}>
                        <div style={{fontWeight: 600, fontSize: 14, marginBottom: 8, color: '#222'}}>SLA por Tipo de Atividade</div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                            {Object.entries(dadosIndicadores.sla_por_tipo || {}).map(([tipo, slaData]) => (
                                <div key={tipo} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '8px 12px',
                                    background: coresFundoProcessos[tipo],
                                    borderRadius: 8,
                                    border: `1px solid ${coresProcessos[tipo]}22`
                                }}>
                                    <span style={{fontSize: 13, fontWeight: 500}}>
                                        {tipo === 'admissao' ? 'Admissões' : 
                                         tipo === 'demissao' ? 'Demissões' : 
                                         tipo === 'ferias' ? 'Férias' : tipo}
                                    </span>
                                    <div style={{display: 'flex', gap: 8}}>
                                        <span style={{
                                            padding: '2px 8px',
                                            borderRadius: 4,
                                            fontSize: 12,
                                            fontWeight: 500,
                                            background: '#ffebee',
                                            color: '#e53935'
                                        }}>
                                            {slaData.atrasado || 0} atrasadas
                                        </span>
                                        <span style={{
                                            padding: '2px 8px',
                                            borderRadius: 4,
                                            fontSize: 12,
                                            fontWeight: 500,
                                            background: '#e8f5e8',
                                            color: '#2e7d32'
                                        }}>
                                            {slaData.dentro_prazo || 0} no prazo
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Card de Status Detalhado por Tipo */}
                <div style={{
                    background: '#fff',
                    border: '1px solid var(--neutro-200)',
                    borderRadius: 20,
                    boxShadow: '0 2px 8px 0 rgba(60,60,60,0.06)',
                    padding: 28,
                    minHeight: 180,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    gap: 16,
                }}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 8}}>
                        <span style={{fontWeight: 700, fontSize: 18}}>Status por Tipo</span>
                        <Link to="/atividades" style={{fontWeight: 500, color: 'var(--neutro-500)', fontSize: 15, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4}}>
                            Ver mais&nbsp;<FaArrowRight size={16} />
                        </Link>
                    </div>
                    
                    <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: 12}}>
                        {Object.entries(dadosIndicadores.status_por_tipo || {}).map(([tipo, statusData]) => {
                            const total = Object.values(statusData).reduce((sum, val) => sum + val, 0);
                            const taxaConclusao = total > 0 ? Math.round((statusData.concluida || 0) / total * 100) : 0;
                            
                            return (
                                <div key={tipo} style={{
                                    border: `1px solid ${coresProcessos[tipo]}22`,
                                    borderRadius: 12,
                                    padding: 16,
                                    background: coresFundoProcessos[tipo]
                                }}>
                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12}}>
                                        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                                            <span style={{fontWeight: 700, fontSize: 16, color: '#222'}}>
                                                {tipo === 'admissao' ? 'Admissões' : 
                                                 tipo === 'demissao' ? 'Demissões' : 
                                                 tipo === 'ferias' ? 'Férias' : tipo}
                                            </span>
                                            <span style={{
                                                padding: '8px 8px',
                                                borderRadius: 10,
                                                fontSize: 12,
                                                fontWeight: 600,
                                                background: 'var(--neutro-100)',
                                                color: 'var(--neutro-600)'
                                            }}>
                                                {total}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Progress Bar */}
                                    <div style={{marginBottom: 24, marginTop: 24}}>
                                        <div style={{
                                            width: '100%',
                                            height: '8px',
                                            backgroundColor: '#f0f0f0',
                                            borderRadius: '4px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                width: `${taxaConclusao}%`,
                                                height: '100%',
                                                backgroundColor: coresProcessos[tipo],
                                                borderRadius: '4px',
                                                transition: 'width 0.3s ease'
                                            }} />
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: '11px',
                                            color: '#666',
                                            marginTop: '4px'
                                        }}>
                                            <span>0%</span>
                                            <span>{taxaConclusao}% concluído</span>
                                            <span>100%</span>
                                        </div>
                                    </div>
                                    
                                    <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: 6,
                                            fontSize: 11,
                                            background: '#fff',
                                            fontWeight: 500,
                                            color: '#1976d2'
                                        }}>
                                            {statusData.pendente || 0} aguardando
                                        </span>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: 6,
                                            fontSize: 11,
                                            background: '#fff',
                                            fontWeight: 500,
                                            color: '#f57c00'
                                        }}>
                                            {statusData.em_andamento || 0} executando
                                        </span>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: 6,
                                            fontSize: 11,
                                            background: '#fff',
                                            fontWeight: 500,
                                            color: '#2e7d32'
                                        }}>
                                            {statusData.concluida || 0} finalizados
                                        </span>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: 6,
                                            fontSize: 11,
                                            background: '#fff',
                                            fontWeight: 500,
                                            color: '#c62828'
                                        }}>
                                            {statusData.erro || 0} problemas
                                        </span>
                                        {statusData.aprovada > 0 && (
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: 6,
                                                fontSize: 11,
                                                background: '#fff',
                                                fontWeight: 500,
                                                color: '#7b1fa2'
                                            }}>
                                                {statusData.aprovada} aprovados
                                            </span>
                                        )}
                                        {statusData.cancelada > 0 && (
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: 6,
                                                fontSize: 11,
                                                background: '#fff',
                                                fontWeight: 500,
                                                color: '#616161'
                                            }}>
                                                {statusData.cancelada} cancelados
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Estatisticas
