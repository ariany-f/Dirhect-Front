import React, { useMemo } from 'react'
import { Chart } from 'primereact/chart'
import styled from 'styled-components'

const GraficosContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
`

const ChartCard = styled.div`
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const ChartTitle = styled.h3`
    margin: 0 0 20px 0;
    color: #333;
    font-size: 18px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
`

const ChartsRow = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 24px;
    width: 100%;
`

function GraficosTransporte({ colaboradores }) {
    // Agrupa dados por filial
    const dadosPorFilial = useMemo(() => {
        const grupos = {}
        
        colaboradores.forEach(col => {
            if (!grupos[col.filial]) {
                grupos[col.filial] = {
                    nome: col.filial,
                    custoTotal: 0,
                    distanciaMedia: 0,
                    colaboradores: [],
                    count: 0
                }
            }
            
            grupos[col.filial].custoTotal += col.valor_transporte
            grupos[col.filial].colaboradores.push(col.distancia_km)
            grupos[col.filial].count += 1
        })
        
        // Calcula médias
        Object.keys(grupos).forEach(filial => {
            const total = grupos[filial].colaboradores.reduce((acc, dist) => acc + dist, 0)
            grupos[filial].distanciaMedia = total / grupos[filial].count
        })
        
        return Object.values(grupos)
    }, [colaboradores])

    // Dados para gráfico de custos por filial
    const chartCustosPorFilial = useMemo(() => {
        const labels = dadosPorFilial.map(f => f.nome)
        const data = dadosPorFilial.map(f => f.custoTotal.toFixed(2))
        
        return {
            labels,
            datasets: [
                {
                    label: 'Custo Total de Transporte (R$)',
                    data,
                    backgroundColor: [
                        'rgba(30, 64, 175, 0.8)',
                        'rgba(5, 150, 105, 0.8)',
                        'rgba(124, 58, 237, 0.8)',
                        'rgba(220, 38, 38, 0.8)',
                    ],
                    borderColor: [
                        'rgb(30, 64, 175)',
                        'rgb(5, 150, 105)',
                        'rgb(124, 58, 237)',
                        'rgb(220, 38, 38)',
                    ],
                    borderWidth: 2
                }
            ]
        }
    }, [dadosPorFilial])

    // Dados para gráfico de distância média por filial
    const chartDistanciaMedia = useMemo(() => {
        const labels = dadosPorFilial.map(f => f.nome)
        const data = dadosPorFilial.map(f => f.distanciaMedia.toFixed(1))
        
        return {
            labels,
            datasets: [
                {
                    label: 'Distância Média (km)',
                    data,
                    backgroundColor: 'rgba(5, 150, 105, 0.6)',
                    borderColor: 'rgb(5, 150, 105)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }
            ]
        }
    }, [dadosPorFilial])

    // Distribuição de colaboradores por faixa de distância
    const chartDistribuicaoDistancia = useMemo(() => {
        const faixas = {
            '0-10 km': 0,
            '10-15 km': 0,
            '15-20 km': 0,
            '20-25 km': 0,
            '25+ km': 0
        }
        
        colaboradores.forEach(col => {
            if (col.distancia_km <= 10) faixas['0-10 km']++
            else if (col.distancia_km <= 15) faixas['10-15 km']++
            else if (col.distancia_km <= 20) faixas['15-20 km']++
            else if (col.distancia_km <= 25) faixas['20-25 km']++
            else faixas['25+ km']++
        })
        
        return {
            labels: Object.keys(faixas),
            datasets: [
                {
                    label: 'Número de Colaboradores',
                    data: Object.values(faixas),
                    backgroundColor: [
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(251, 146, 60, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(220, 38, 38, 0.8)',
                    ],
                    borderColor: [
                        'rgb(34, 197, 94)',
                        'rgb(59, 130, 246)',
                        'rgb(251, 146, 60)',
                        'rgb(239, 68, 68)',
                        'rgb(220, 38, 38)',
                    ],
                    borderWidth: 2
                }
            ]
        }
    }, [colaboradores])

    // Distribuição de colaboradores por faixa de custo
    const chartDistribuicaoCusto = useMemo(() => {
        const faixas = {
            'Até R$ 200': 0,
            'R$ 200-250': 0,
            'R$ 250-300': 0,
            'R$ 300-350': 0,
            'R$ 350+': 0
        }
        
        colaboradores.forEach(col => {
            if (col.valor_transporte <= 200) faixas['Até R$ 200']++
            else if (col.valor_transporte <= 250) faixas['R$ 200-250']++
            else if (col.valor_transporte <= 300) faixas['R$ 250-300']++
            else if (col.valor_transporte <= 350) faixas['R$ 300-350']++
            else faixas['R$ 350+']++
        })
        
        return {
            labels: Object.keys(faixas),
            datasets: [
                {
                    data: Object.values(faixas),
                    backgroundColor: [
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(251, 146, 60, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(220, 38, 38, 0.8)',
                    ],
                    borderColor: [
                        'rgb(34, 197, 94)',
                        'rgb(59, 130, 246)',
                        'rgb(251, 146, 60)',
                        'rgb(239, 68, 68)',
                        'rgb(220, 38, 38)',
                    ],
                    borderWidth: 2
                }
            ]
        }
    }, [colaboradores])

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 15,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14
                },
                bodyFont: {
                    size: 13
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    }

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    padding: 15,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14
                },
                bodyFont: {
                    size: 13
                }
            }
        }
    }

    return (
        <GraficosContainer>
            <ChartsRow>
                <ChartCard>
                    <ChartTitle>
                        <i className="pi pi-dollar" style={{ color: '#dc2626' }} />
                        Custo de Transporte por Filial
                    </ChartTitle>
                    <div style={{ height: '350px' }}>
                        <Chart type="bar" data={chartCustosPorFilial} options={chartOptions} />
                    </div>
                </ChartCard>

                <ChartCard>
                    <ChartTitle>
                        <i className="pi pi-map-marker" style={{ color: '#059669' }} />
                        Distância Média por Filial
                    </ChartTitle>
                    <div style={{ height: '350px' }}>
                        <Chart type="line" data={chartDistanciaMedia} options={chartOptions} />
                    </div>
                </ChartCard>
            </ChartsRow>

            <ChartsRow>
                <ChartCard>
                    <ChartTitle>
                        <i className="pi pi-chart-pie" style={{ color: '#1e40af' }} />
                        Distribuição por Faixa de Distância
                    </ChartTitle>
                    <div style={{ height: '350px' }}>
                        <Chart type="pie" data={chartDistribuicaoDistancia} options={pieOptions} />
                    </div>
                </ChartCard>

                <ChartCard>
                    <ChartTitle>
                        <i className="pi pi-chart-pie" style={{ color: '#7c3aed' }} />
                        Distribuição por Faixa de Custo
                    </ChartTitle>
                    <div style={{ height: '350px' }}>
                        <Chart type="doughnut" data={chartDistribuicaoCusto} options={pieOptions} />
                    </div>
                </ChartCard>
            </ChartsRow>
        </GraficosContainer>
    )
}

export default GraficosTransporte

