import React, { useState, useEffect, useMemo } from 'react';
import { useCandidatoContext } from '@contexts/Candidato';
import CampoTexto from '@components/CampoTexto';
import DropdownItens from '@components/DropdownItens';
import styled from 'styled-components';
import http from '@http';
import Botao from '@components/Botao';
import BotaoSemBorda from '@components/BotaoSemBorda';

const GridContainer = styled.div`
    padding: 0 10px 10px 10px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 16px;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 0;
    }
`;

const SectionTitle = styled.div`
    grid-column: 1 / -1;
    font-size: 18px;
    font-weight: 600;
    color: #374151;
    margin: 20px 0 10px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid #e2e8f0;
`;

const InfoBox = styled.div`
    grid-column: 1 / -1;
    background: linear-gradient(45deg, #f8fafc, #f1f5f9);
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
    color: #64748b;
    font-size: 14px;
    line-height: 1.5;
    
    .icon {
        color: #3b82f6;
        margin-right: 8px;
    }
`;

const StepDadosBancarios = ({ modoLeitura = false, classError = [] }) => {
    const { candidato, setCampo } = useCandidatoContext();
    const [bancos, setBancos] = useState([]);
    const [loadingBancos, setLoadingBancos] = useState(false);
    const [agencias, setAgencias] = useState([]);
    const [loadingAgencias, setLoadingAgencias] = useState(false);
    const [filtroAgencia, setFiltroAgencia] = useState('');
    const [adicionandoAgencia, setAdicionandoAgencia] = useState(false);

    // Função para verificar se um campo está em erro
    const isCampoEmErro = useMemo(() => {
        return (campo) => {
            return classError.includes(campo);
        };
    }, [classError]);

    useEffect(() => {
        // Se o candidato já tem uma agencia_nova, entra no modo de adição
        if (candidato?.agencia_nova) {
            setAdicionandoAgencia(true);
        }
    }, [candidato?.agencia_nova]);

    useEffect(() => {
        setLoadingBancos(true);
        http.get('banco/')
            .then(response => {
                const formattedBancos = response.map(b => ({
                    code: b.id,
                    name: `${b.id} - ${b.nome_completo || b.nome}`
                }));
                setBancos(formattedBancos);
            })
            .catch(error => {
                console.error("Erro ao buscar bancos:", error);
                setBancos([]);
            })
            .finally(() => {
                setLoadingBancos(false);
            });
    }, []);

    useEffect(() => {
        if (candidato?.banco && !adicionandoAgencia) {
            setLoadingAgencias(true);
            setAgencias([]);
            http.get(`agencia/?banco_id=${candidato.banco}`)
                .then(response => {
                    const formattedAgencias = response.map(ag => ({
                        code: ag.id,
                        name: `${ag.num_agencia} - ${ag.nome || 'Agência'}`
                    }));
                    setAgencias(formattedAgencias);
                })
                .catch(error => {
                    console.error("Erro ao buscar agências:", error);
                    setAgencias([]);
                })
                .finally(() => {
                    setLoadingAgencias(false);
                });
        } else {
            setAgencias([]);
        }
    }, [candidato?.banco, adicionandoAgencia]);

    // Tipos de conta
    const tiposConta = [
        { code: 'C', name: 'Conta Corrente' },
        { code: 'P', name: 'Conta Poupança' },
        { code: 'S', name: 'Conta Salário' }
    ];

    // Tipos de PIX
    const tiposPix = [
        { code: 'cpf', name: 'CPF' },
        { code: 'telefone', name: 'Telefone' },
        { code: 'email', name: 'E-mail' },
        { code: 'chave_aleatoria', name: 'Chave Aleatória' }
    ];

    return (
        <GridContainer data-tour="panel-step-2">
            <InfoBox>
                <strong>Informações importantes:</strong><br />
                • Os dados bancários são utilizados para crédito de salário e benefícios<br />
                • Certifique-se de que os dados estão corretos para evitar problemas no pagamento<br />
                • A conta preferencialmente deve estar no nome do colaborador
            </InfoBox>

            <DropdownItens
                camposVazios={isCampoEmErro('banco') ? ['banco'] : []}
                $margin={'28px'}
                required={true}
                valor={candidato?.banco ? (bancos.find(b => b.code === candidato.banco) || null) : null}
                setValor={valor => {
                    setCampo('banco', valor.code);
                    setCampo('banco_codigo', valor.code);
                    setCampo('agencia', '');
                    setCampo('agencia_nova', '');
                    setAdicionandoAgencia(false);
                }}
                options={bancos}
                name="banco"
                label="Banco"
                placeholder={loadingBancos ? "Carregando..." : "Selecione o banco"}
                disabled={modoLeitura || loadingBancos}
                search
                filter
            />

            {adicionandoAgencia ? (
                <div style={{ display: 'flex', width: '100%', alignItems: 'start', gap: '16px', justifyContent: 'start' }}>
                    <div style={{ flex: 1 }}>
                        <CampoTexto
                            name="agencia_nova"
                            valor={candidato?.agencia_nova || filtroAgencia}
                            setValor={valor => setCampo('agencia_nova', valor)}
                            label="Nova Agência"
                            placeholder="Digite o número da agência"
                        />
                    </div>
                    <div style={{ height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BotaoSemBorda aoClicar={() => {
                            setAdicionandoAgencia(false);
                            setCampo('agencia_nova', '');
                        }}>
                            Cancelar
                        </BotaoSemBorda>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <DropdownItens
                        $margin={'10px'}
                        valor={candidato?.agencia ? (agencias.find(a => a.code === candidato.agencia) || null) : null}
                        setValor={valor => setCampo('agencia', valor.code)}
                        options={agencias}
                        name="agencia"
                        label="Agência"
                        placeholder={
                            loadingAgencias ? "Carregando..." 
                            : !candidato?.banco ? "Selecione um banco"
                            : agencias.length === 0 ? "Nenhuma agência para este banco"
                            : "Selecione a agência"
                        }
                        disabled={modoLeitura || !candidato?.banco || loadingAgencias}
                        search
                        filter
                        onFilter={(e) => setFiltroAgencia(e.filter)}
                        emptyFilterMessage={
                            <div style={{ padding: '10px', textAlign: 'center' }}>
                                <span>Nenhuma agência encontrada.</span>
                                <Botao 
                                    estilo="vermilion" 
                                    size="small" 
                                    filled 
                                    aoClicar={() => {
                                        setAdicionandoAgencia(true);
                                        setCampo('agencia', ''); // Limpa a seleção da agência existente
                                    }}
                                    style={{ marginTop: '10px', width: '100%' }}
                                >
                                    Adicionar Nova Agência
                                </Botao>
                            </div>
                        }
                        emptyMessage={
                            <div 
                                style={{ padding: '10px', textAlign: 'center', cursor: 'pointer' }}
                                onClick={() => {
                                    setAdicionandoAgencia(true);
                                    setCampo('agencia', '');
                                }}
                            >
                                <span style={{ marginRight: '8px', fontWeight: 'bold' }}>+</span>
                                Adicionar Nova Agência
                            </div>
                        }
                    />
                </div>
            )}

            <CampoTexto
                camposVazios={isCampoEmErro('conta_corrente') ? ['conta_corrente'] : []}
                name="conta_corrente"
                required={true}
                valor={candidato?.conta_corrente ?? ''}
                numeroCaracteres={10}
                maxCaracteres={10}
                setValor={valor => setCampo('conta_corrente', valor)}
                label="Número da Conta"
                placeholder="Digite o número da conta (com dígito)"
                disabled={modoLeitura}
            />

            <CampoTexto
                name="operacao"
                valor={candidato?.operacao ?? ''}
                setValor={valor => setCampo('operacao', valor)}
                label="Operação (se houver)"
                placeholder="Digite a operação"
                disabled={modoLeitura}
            />

            <DropdownItens
                $margin={'10px'}
                valor={candidato?.tipo_conta ? (tiposConta.find(t => t.code === candidato.tipo_conta) || null) : null}
                setValor={valor => setCampo('tipo_conta', valor.code)}
                options={tiposConta}
                name="tipo_conta"
                label="Tipo de Conta"
                placeholder="Selecione o tipo de conta"
                disabled={modoLeitura}
            />

            <SectionTitle>PIX (Opcional)</SectionTitle>

            <CampoTexto
                name="pix"
                valor={candidato?.pix ?? ''}
                setValor={valor => setCampo('pix', valor)}
                label="Chave PIX"
                placeholder="Digite a chave PIX"
                disabled={modoLeitura}
            />

            <InfoBox>
                <strong>Sobre o PIX:</strong><br />
                • O PIX é opcional, mas facilita transferências e antecipações<br />
                • Certifique-se de que a chave PIX está vinculada à conta informada acima<br />
                • CPF: utilizar apenas números (sem pontos ou traços)<br />
                • Telefone: incluir DDD (exemplo: 11999999999)
            </InfoBox>
        </GridContainer>
    );
};

export default StepDadosBancarios; 