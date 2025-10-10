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

    // 1. TEMPO MÉDIO DE DESLOCAMENTO - Risco de turnover/produtividade
    const analiseTempoDeslocamento = useMemo(() => {
        const faixasTempo = {
            '0-30 min': { count: 0, color: 'rgba(34, 197, 94, 0.8)', risco: 'Baixo' },
            '30-45 min': { count: 0, color: 'rgba(59, 130, 246, 0.8)', risco: 'Médio' },
            '45-60 min': { count: 0, color: 'rgba(251, 146, 60, 0.8)', risco: 'Alto' },
            '60-90 min': { count: 0, color: 'rgba(239, 68, 68, 0.8)', risco: 'Muito Alto' },
            '90+ min': { count: 0, color: 'rgba(220, 38, 38, 0.8)', risco: 'Crítico' }
        }
        
        let tempoTotal = 0
        let colaboradoresRisco = 0 // > 60 min
        
        colaboradores.forEach(col => {
            tempoTotal += col.tempo_deslocamento
            if (col.tempo_deslocamento > 60) colaboradoresRisco++
            
            if (col.tempo_deslocamento <= 30) faixasTempo['0-30 min'].count++
            else if (col.tempo_deslocamento <= 45) faixasTempo['30-45 min'].count++
            else if (col.tempo_deslocamento <= 60) faixasTempo['45-60 min'].count++
            else if (col.tempo_deslocamento <= 90) faixasTempo['60-90 min'].count++
            else faixasTempo['90+ min'].count++
        })
        
        const tempoMedio = colaboradores.length > 0 ? tempoTotal / colaboradores.length : 0
        const horasPerdidas = (tempoTotal * 2 * 22) / 60 // ida e volta, 22 dias úteis
        const percentualRisco = colaboradores.length > 0 ? (colaboradoresRisco / colaboradores.length * 100) : 0
        
        return {
            faixas: faixasTempo,
            tempoMedio: tempoMedio.toFixed(0),
            horasPerdidas: horasPerdidas.toFixed(0),
            colaboradoresRisco,
            percentualRisco: percentualRisco.toFixed(1)
        }
    }, [colaboradores])

    const chartTempoDeslocamento = {
        labels: Object.keys(analiseTempoDeslocamento.faixas),
        datasets: [{
            data: Object.values(analiseTempoDeslocamento.faixas).map(f => f.count),
            backgroundColor: Object.values(analiseTempoDeslocamento.faixas).map(f => f.color),
            borderColor: Object.values(analiseTempoDeslocamento.faixas).map(f => f.color.replace('0.8', '1')),
            borderWidth: 2
        }]
    }

    // 2. POTENCIAL DE ECONOMIA - ROI de fretado vs. vale transporte vs. home office
    const analiseEconomia = useMemo(() => {
        const custoValeTransporte = colaboradores.reduce((acc, col) => acc + col.valor_transporte, 0)
        const custoAnualVale = custoValeTransporte * 12
        
        // Estimativa: Fretado custa ~R$ 800/colaborador/mês
        const custoFretadoPorPessoa = 800
        const custoMensalFretado = colaboradores.length * custoFretadoPorPessoa
        const custoAnualFretado = custoMensalFretado * 12
        
        // Home Office: economia de 100% do vale + ~30% de ganho de produtividade
        const colaboradoresElegiveis = colaboradores.filter(col => col.distancia_km > 15).length
        const economiaHomeOffice = colaboradoresElegiveis * (colaboradores.length > 0 ? (custoValeTransporte / colaboradores.length) : 0) * 12
        
        // Economia potencial
        const economiaTrocandoParaFretado = custoAnualVale - custoAnualFretado
        const percentualEconomiaFretado = custoAnualVale > 0 ? ((economiaTrocandoParaFretado / custoAnualVale) * 100) : 0
        
        return {
            custoAnualVale,
            custoAnualFretado,
            economiaTrocandoParaFretado,
            percentualEconomiaFretado: Math.abs(percentualEconomiaFretado).toFixed(1),
            colaboradoresElegiveis,
            economiaHomeOffice: economiaHomeOffice.toFixed(2),
            recomendacao: economiaTrocandoParaFretado > 0 ? 'Considerar Fretado' : 
                         colaboradoresElegiveis > colaboradores.length * 0.3 ? 'Considerar Home Office' : 'Manter Vale Transporte'
        }
    }, [colaboradores])

    const chartComparacaoModelos = {
        labels: ['Vale Transporte', 'Fretado', 'Home Office (Economia)'],
        datasets: [{
            label: 'Custo Anual (R$)',
            data: [
                analiseEconomia.custoAnualVale,
                analiseEconomia.custoAnualFretado,
                analiseEconomia.custoAnualVale - analiseEconomia.economiaHomeOffice
            ],
            backgroundColor: [
                'rgba(239, 68, 68, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(34, 197, 94, 0.8)'
            ],
            borderColor: [
                'rgb(239, 68, 68)',
                'rgb(59, 130, 246)',
                'rgb(34, 197, 94)'
            ],
            borderWidth: 2
        }]
    }

    // 3. PEGADA DE CARBONO - ESG/Sustentabilidade
    const analiseCarbono = useMemo(() => {
        // Fator de emissão médio: 0.12 kg CO2 por km (transporte público urbano)
        const fatorEmissao = 0.12
        const diasUteisMes = 22
        
        let emissaoMensalTotal = 0
        let emissaoPorFilial = {}
        
        colaboradores.forEach(col => {
            // Ida e volta
            const emissaoMensal = col.distancia_km * 2 * diasUteisMes * fatorEmissao
            emissaoMensalTotal += emissaoMensal
            
            if (!emissaoPorFilial[col.filial]) {
                emissaoPorFilial[col.filial] = 0
            }
            emissaoPorFilial[col.filial] += emissaoMensal
        })
        
        const emissaoAnual = emissaoMensalTotal * 12
        const emissaoAnualToneladas = emissaoAnual / 1000
        
        // Equivalente em árvores (1 árvore absorve ~21.77 kg CO2/ano)
        const arvoresEquivalentes = Math.ceil(emissaoAnual / 21.77)
        
        // Classificação de sustentabilidade
        const emissaoPorColaborador = colaboradores.length > 0 ? emissaoMensalTotal / colaboradores.length : 0
        let classificacao = 'Baixa'
        let corClassificacao = '#22c55e'
        
        if (emissaoPorColaborador > 100) {
            classificacao = 'Alta'
            corClassificacao = '#ef4444'
        } else if (emissaoPorColaborador > 60) {
            classificacao = 'Média'
            corClassificacao = '#f59e0b'
        }
        
        return {
            emissaoMensalTotal: emissaoMensalTotal.toFixed(0),
            emissaoAnualToneladas: emissaoAnualToneladas.toFixed(2),
            arvoresEquivalentes,
            emissaoPorFilial,
            classificacao,
            corClassificacao,
            emissaoPorColaborador: emissaoPorColaborador.toFixed(1)
        }
    }, [colaboradores])

    const chartEmissaoPorFilial = {
        labels: Object.keys(analiseCarbono.emissaoPorFilial),
        datasets: [{
            label: 'Emissão de CO₂ Mensal (kg)',
            data: Object.values(analiseCarbono.emissaoPorFilial).map(v => v.toFixed(0)),
            backgroundColor: 'rgba(34, 197, 94, 0.6)',
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
        }]
    }

    // 4. MAPA DE CONCENTRAÇÃO - Planejamento estratégico de filiais
    const analiseConcentracao = useMemo(() => {
        // Agrupa por região/distância da filial
        const regioes = {}
        
        colaboradores.forEach(col => {
            // Extrai bairro do endereço (simplificado)
            const partes = col.endereco_residencial.split('-')
            const regiao = partes[partes.length - 1]?.trim() || 'Não informado'
            
            if (!regioes[regiao]) {
                regioes[regiao] = {
                    colaboradores: 0,
                    distanciaMedia: 0,
                    distancias: [],
                    filial: col.filial
                }
            }
            
            regioes[regiao].colaboradores++
            regioes[regiao].distancias.push(col.distancia_km)
        })
        
        // Calcula distância média por região
        Object.keys(regioes).forEach(regiao => {
            const total = regioes[regiao].distancias.reduce((acc, d) => acc + d, 0)
            regioes[regiao].distanciaMedia = total / regioes[regiao].colaboradores
        })
        
        // Identifica regiões com potencial para nova filial
        // (muitos colaboradores + distância média alta)
        const regioesOrdenadas = Object.entries(regioes)
            .map(([nome, dados]) => ({
                nome,
                ...dados,
                score: dados.colaboradores * dados.distanciaMedia // Score de prioridade
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5) // Top 5
        
        return {
            totalRegioes: Object.keys(regioes).length,
            regioesTop: regioesOrdenadas,
            recomendacao: regioesOrdenadas[0]?.colaboradores > 5 && regioesOrdenadas[0]?.distanciaMedia > 20 
                ? regioesOrdenadas[0].nome 
                : 'Nenhuma região prioritária identificada'
        }
    }, [colaboradores])

    const chartConcentracaoRegioes = {
        labels: analiseConcentracao.regioesTop.map(r => r.nome.length > 20 ? r.nome.substring(0, 20) + '...' : r.nome),
        datasets: [
            {
                label: 'Colaboradores',
                data: analiseConcentracao.regioesTop.map(r => r.colaboradores),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 2,
                yAxisID: 'y'
            },
            {
                label: 'Distância Média (km)',
                data: analiseConcentracao.regioesTop.map(r => r.distanciaMedia.toFixed(1)),
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
                borderColor: 'rgb(239, 68, 68)',
                borderWidth: 2,
                yAxisID: 'y1'
            }
        ]
    }

    const chartConcentracaoOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 15,
                    font: { size: 12 }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: { size: 14 },
                bodyFont: { size: 13 }
            }
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Colaboradores'
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Distância (km)'
                },
                grid: {
                    drawOnChartArea: false
                }
            },
            x: {
                grid: {
                    display: false
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

            {/* NOVOS GRÁFICOS DE ANÁLISE AVANÇADA */}
            
            {/* 1. Tempo Médio de Deslocamento - Risco de Turnover */}
            <ChartsRow>
                <ChartCard>
                    <ChartTitle>
                        <i className="pi pi-clock" style={{ color: '#f59e0b' }} />
                        Tempo de Deslocamento - Análise de Risco
                    </ChartTitle>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '2fr 1fr', 
                        gap: '20px',
                        marginBottom: '15px'
                    }}>
                        <div style={{ 
                            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                            padding: '20px',
                            borderRadius: '8px',
                            border: '2px solid #f59e0b'
                        }}>
                            <div style={{ fontSize: '14px', color: '#92400e', marginBottom: '8px' }}>
                                ⏱️ Tempo Médio de Deslocamento
                            </div>
                            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#92400e' }}>
                                {analiseTempoDeslocamento.tempoMedio} min
                            </div>
                            <div style={{ fontSize: '12px', color: '#92400e', marginTop: '8px' }}>
                                {analiseTempoDeslocamento.horasPerdidas}h/mês em deslocamentos
                            </div>
                        </div>
                        <div style={{ 
                            background: analiseTempoDeslocamento.percentualRisco > 30 ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)' : 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                            padding: '20px',
                            borderRadius: '8px',
                            border: `2px solid ${analiseTempoDeslocamento.percentualRisco > 30 ? '#ef4444' : '#22c55e'}`,
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '12px', color: analiseTempoDeslocamento.percentualRisco > 30 ? '#991b1b' : '#166534', marginBottom: '4px' }}>
                                Risco de Turnover
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 'bold', color: analiseTempoDeslocamento.percentualRisco > 30 ? '#991b1b' : '#166534' }}>
                                {analiseTempoDeslocamento.percentualRisco}%
                            </div>
                            <div style={{ fontSize: '11px', color: analiseTempoDeslocamento.percentualRisco > 30 ? '#991b1b' : '#166534' }}>
                                ({analiseTempoDeslocamento.colaboradoresRisco} colaboradores)
                            </div>
                        </div>
                    </div>
                    <div style={{ height: '300px' }}>
                        <Chart type="pie" data={chartTempoDeslocamento} options={pieOptions} />
                    </div>
                </ChartCard>
            </ChartsRow>

            {/* 2. Potencial de Economia - Comparação de Modelos */}
            <ChartsRow>
                <ChartCard>
                    <ChartTitle>
                        <i className="pi pi-dollar" style={{ color: '#22c55e' }} />
                        Análise de ROI - Modelos de Transporte
                    </ChartTitle>
                    <div style={{ 
                        display: 'flex', 
                        gap: '15px',
                        marginBottom: '15px',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{ 
                            flex: 1,
                            minWidth: '200px',
                            background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                            padding: '15px',
                            borderRadius: '8px',
                            border: '2px solid #ef4444'
                        }}>
                            <div style={{ fontSize: '12px', color: '#991b1b', marginBottom: '4px' }}>
                                💳 Custo Atual (Vale)
                            </div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#991b1b' }}>
                                R$ {analiseEconomia.custoAnualVale.toLocaleString('pt-BR')}
                            </div>
                            <div style={{ fontSize: '11px', color: '#991b1b' }}>
                                /ano
                            </div>
                        </div>
                        <div style={{ 
                            flex: 1,
                            minWidth: '200px',
                            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                            padding: '15px',
                            borderRadius: '8px',
                            border: '2px solid #3b82f6'
                        }}>
                            <div style={{ fontSize: '12px', color: '#1e40af', marginBottom: '4px' }}>
                                🚌 Custo Fretado
                            </div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>
                                R$ {analiseEconomia.custoAnualFretado.toLocaleString('pt-BR')}
                            </div>
                            <div style={{ fontSize: '11px', color: '#1e40af' }}>
                                {analiseEconomia.economiaTrocandoParaFretado > 0 ? 
                                    `Economia: ${analiseEconomia.percentualEconomiaFretado}%` : 
                                    `Custo Adicional: ${analiseEconomia.percentualEconomiaFretado}%`
                                }
                            </div>
                        </div>
                        <div style={{ 
                            flex: 1,
                            minWidth: '200px',
                            background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                            padding: '15px',
                            borderRadius: '8px',
                            border: '2px solid #22c55e'
                        }}>
                            <div style={{ fontSize: '12px', color: '#166534', marginBottom: '4px' }}>
                                🏠 Home Office
                            </div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#166534' }}>
                                R$ {parseFloat(analiseEconomia.economiaHomeOffice).toLocaleString('pt-BR')}
                            </div>
                            <div style={{ fontSize: '11px', color: '#166534' }}>
                                {analiseEconomia.colaboradoresElegiveis} elegíveis
                            </div>
                        </div>
                    </div>
                    <div style={{
                        background: '#fef3c7',
                        padding: '12px',
                        borderRadius: '6px',
                        marginBottom: '15px',
                        border: '1px solid #f59e0b'
                    }}>
                        <strong style={{ color: '#92400e' }}>💡 Recomendação:</strong>
                        <span style={{ color: '#92400e', marginLeft: '8px' }}>
                            {analiseEconomia.recomendacao}
                        </span>
                    </div>
                    <div style={{ height: '300px' }}>
                        <Chart type="bar" data={chartComparacaoModelos} options={chartOptions} />
                    </div>
                </ChartCard>
            </ChartsRow>

            {/* 3. Pegada de Carbono - ESG */}
            <ChartsRow>
                <ChartCard>
                    <ChartTitle>
                        <i className="pi pi-globe" style={{ color: '#22c55e' }} />
                        Pegada de Carbono - Análise ESG
                    </ChartTitle>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '15px',
                        marginBottom: '15px'
                    }}>
                        <div style={{ 
                            background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                            padding: '20px',
                            borderRadius: '8px',
                            border: '2px solid #22c55e',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '12px', color: '#166534', marginBottom: '4px' }}>
                                🌍 Emissão Mensal
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#166534' }}>
                                {analiseCarbono.emissaoMensalTotal}
                            </div>
                            <div style={{ fontSize: '11px', color: '#166534' }}>
                                kg CO₂
                            </div>
                        </div>
                        <div style={{ 
                            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                            padding: '20px',
                            borderRadius: '8px',
                            border: '2px solid #f59e0b',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '12px', color: '#92400e', marginBottom: '4px' }}>
                                📊 Emissão Anual
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#92400e' }}>
                                {analiseCarbono.emissaoAnualToneladas}
                            </div>
                            <div style={{ fontSize: '11px', color: '#92400e' }}>
                                toneladas CO₂/ano
                            </div>
                        </div>
                        <div style={{ 
                            background: `linear-gradient(135deg, ${analiseCarbono.corClassificacao}20 0%, ${analiseCarbono.corClassificacao}40 100%)`,
                            padding: '20px',
                            borderRadius: '8px',
                            border: `2px solid ${analiseCarbono.corClassificacao}`,
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '12px', color: analiseCarbono.corClassificacao, marginBottom: '4px' }}>
                                🌱 Impacto Ambiental
                            </div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: analiseCarbono.corClassificacao }}>
                                {analiseCarbono.classificacao}
                            </div>
                            <div style={{ fontSize: '11px', color: analiseCarbono.corClassificacao }}>
                                {analiseCarbono.emissaoPorColaborador} kg/colaborador
                            </div>
                        </div>
                        <div style={{ 
                            background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                            padding: '20px',
                            borderRadius: '8px',
                            border: '2px solid #10b981',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '12px', color: '#065f46', marginBottom: '4px' }}>
                                🌳 Compensação
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#065f46' }}>
                                {analiseCarbono.arvoresEquivalentes}
                            </div>
                            <div style={{ fontSize: '11px', color: '#065f46' }}>
                                árvores necessárias
                            </div>
                        </div>
                    </div>
                    <div style={{ height: '300px' }}>
                        <Chart type="line" data={chartEmissaoPorFilial} options={chartOptions} />
                    </div>
                </ChartCard>
            </ChartsRow>

            {/* 4. Mapa de Concentração - Planejamento Estratégico */}
            <ChartsRow>
                <ChartCard>
                    <ChartTitle>
                        <i className="pi pi-map-marker" style={{ color: '#3b82f6' }} />
                        Concentração Geográfica - Planejamento de Filiais
                    </ChartTitle>
                    <div style={{
                        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '15px',
                        border: '2px solid #3b82f6'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '12px', color: '#1e40af', marginBottom: '4px' }}>
                                    📍 Total de Regiões Mapeadas
                                </div>
                                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e40af' }}>
                                    {analiseConcentracao.totalRegioes}
                                </div>
                            </div>
                            <div style={{ 
                                background: '#fef3c7',
                                padding: '12px 20px',
                                borderRadius: '6px',
                                border: '2px solid #f59e0b'
                            }}>
                                <div style={{ fontSize: '11px', color: '#92400e', marginBottom: '4px' }}>
                                    💡 Região Prioritária
                                </div>
                                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#92400e', textAlign: 'center' }}>
                                    {analiseConcentracao.recomendacao}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ height: '350px' }}>
                        <Chart type="bar" data={chartConcentracaoRegioes} options={chartConcentracaoOptions} />
                    </div>
                    <div style={{
                        marginTop: '15px',
                        padding: '12px',
                        background: '#f3f4f6',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#6b7280'
                    }}>
                        <strong>Interpretação:</strong> Regiões com mais colaboradores e maior distância média são candidatas para abertura de nova filial ou implementação de home office.
                    </div>
                </ChartCard>
            </ChartsRow>
        </GraficosContainer>
    )
}

export default GraficosTransporte

