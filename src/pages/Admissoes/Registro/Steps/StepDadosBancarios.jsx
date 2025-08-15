import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

// Função para debounce
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const StepDadosBancarios = ({ modoLeitura = false, classError = [], setClassError }) => {
    const { candidato, setCampo } = useCandidatoContext();
    const [bancos, setBancos] = useState([]);
    const [loadingBancos, setLoadingBancos] = useState(false);
    const [agencias, setAgencias] = useState([]);
    const [loadingAgencias, setLoadingAgencias] = useState(false);
    const [filtroAgencia, setFiltroAgencia] = useState('');
    const [adicionandoAgencia, setAdicionandoAgencia] = useState(false);
    
    // Estados para busca otimizada de bancos
    const [bancosCarregados, setBancosCarregados] = useState([]);
    const [buscaBanco, setBuscaBanco] = useState('');
    const [carregandoBuscaBanco, setCarregandoBuscaBanco] = useState(false);
    
    // Estados para busca otimizada de agências
    const [agenciasCarregadas, setAgenciasCarregadas] = useState([]);
    const [buscaAgencia, setBuscaAgencia] = useState('');
    const [carregandoBusca, setCarregandoBusca] = useState(false);
    const [mostrarTodas, setMostrarTodas] = useState(false);
    
    // Debounce para as buscas
    const buscaBancoDebounced = useDebounce(buscaBanco, 15);
    const buscaDebounced = useDebounce(buscaAgencia, 15);

    // Função para verificar se um campo está em erro
    const isCampoEmErro = useMemo(() => {
        return (campo) => {
            return classError.includes(campo);
        };
    }, [classError]);

    // Função para remover erro de um campo quando ele é preenchido
    const removerErroCampo = (campo, valor) => {
        if (!setClassError) return;
        
        // Para strings, verifica se não está vazio após trim
        // Para objetos (dropdowns), verifica se tem valor
        // Para outros tipos, verifica se tem valor
        const campoPreenchido = valor && (
            typeof valor === 'string' ? valor.trim() !== '' : 
            typeof valor === 'object' ? (valor.id || valor.code) : 
            valor
        );
        
        if (campoPreenchido) {
            setClassError(prev => prev.filter(erro => erro !== campo));
        }
    };

    // Função otimizada para carregar bancos iniciais (apenas os mais comuns)
    const carregarBancosIniciais = useCallback(async () => {
        setLoadingBancos(true);
        try {
            // Carrega apenas os 15 bancos mais comuns (sem ordering=uso)
            const response = await http.get('banco/?page_size=15');
            const bancosArray = response.results || response;
            const formattedBancos = bancosArray.map(b => ({
                code: b.id,
                name: `${b.id} - ${b.nome_completo || b.nome}`
            }));
            setBancosCarregados(formattedBancos);
            setBancos(formattedBancos);
        } catch (error) {
            console.error("Erro ao carregar bancos iniciais:", error);
            setBancosCarregados([]);
            setBancos([]);
        } finally {
            setLoadingBancos(false);
        }
    }, []);

    // Função para busca inteligente de bancos
    const buscarBancos = useCallback(async (termo) => {
        if (!termo || termo.length < 2) {
            // Se não há termo de busca, mostra os bancos iniciais
            setBancos(bancosCarregados);
            return;
        }
        
        setCarregandoBuscaBanco(true);
        try {
            const response = await http.get(`banco/?search=${termo}&page_size=100`);
            const bancosArray = response.results || response;
            const formattedBancos = bancosArray.map(b => ({
                code: b.id,
                name: `${b.id} - ${b.nome_completo || b.nome}`
            }));
            setBancos(formattedBancos);
        } catch (error) {
            console.error("Erro na busca de bancos:", error);
            setBancos([]);
        } finally {
            setCarregandoBuscaBanco(false);
        }
    }, [bancosCarregados]);

    // Função otimizada para carregar agências iniciais (apenas as mais comuns)
    const carregarAgenciasIniciais = useCallback(async () => {
        if (!candidato?.banco) return;
        
        setLoadingAgencias(true);
        try {
            // Carrega apenas as 15 agências mais comuns (sem ordering=uso)
            const response = await http.get(`agencia/?banco_id=${candidato.banco}&page_size=15`);
            const agenciasArray = response.results || response;
            const formattedAgencias = agenciasArray.map(ag => ({
                code: ag.id,
                name: `${ag.num_agencia} - ${ag.nome || 'Agência'}`
            }));
            setAgenciasCarregadas(formattedAgencias);
            setAgencias(formattedAgencias);
        } catch (error) {
            console.error("Erro ao carregar agências iniciais:", error);
            setAgenciasCarregadas([]);
            setAgencias([]);
        } finally {
            setLoadingAgencias(false);
        }
    }, [candidato?.banco]);

    // Função para busca inteligente de agências
    const buscarAgencias = useCallback(async (termo) => {
        if (!candidato?.banco) return;
        
        if (!termo || termo.length < 2) {
            // Se não há termo de busca, mostra as agências iniciais
            setAgencias(agenciasCarregadas);
            return;
        }
        
        setCarregandoBusca(true);
        try {
            const response = await http.get(`agencia/?banco_id=${candidato.banco}&search=${termo}&page_size=100`);
            const agenciasArray = response.results || response;
            const formattedAgencias = agenciasArray.map(ag => ({
                code: ag.id,
                name: `${ag.num_agencia} - ${ag.nome || 'Agência'}`
            }));
            setAgencias(formattedAgencias);
        } catch (error) {
            console.error("Erro na busca de agências:", error);
            setAgencias([]);
        } finally {
            setCarregandoBusca(false);
        }
    }, [candidato?.banco, agenciasCarregadas]);

    // Efeito para carregar bancos iniciais
    useEffect(() => {
        carregarBancosIniciais();
    }, [carregarBancosIniciais]);

    // Efeito para carregar agências iniciais quando o banco muda
    useEffect(() => {
        if (candidato?.banco && !adicionandoAgencia) {
            carregarAgenciasIniciais();
        } else {
            setAgencias([]);
            setAgenciasCarregadas([]);
        }
    }, [candidato?.banco, adicionandoAgencia, carregarAgenciasIniciais]);

    // Efeito para busca de bancos com debounce
    useEffect(() => {
        if (buscaBancoDebounced !== buscaBanco) {
            buscarBancos(buscaBancoDebounced);
        }
    }, [buscaBancoDebounced, buscarBancos]);

    // Efeito para busca de agências com debounce
    useEffect(() => {
        if (buscaDebounced !== buscaAgencia) {
            buscarAgencias(buscaDebounced);
        }
    }, [buscaDebounced, buscarAgencias]);

    useEffect(() => {
        // Se o candidato já tem uma agencia_nova, entra no modo de adição
        if (candidato?.agencia_nova) {
            setAdicionandoAgencia(true);
        }
    }, [candidato?.agencia_nova]);

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

    // Handler para filtro de bancos
    const handleFilterBancos = (e) => {
        setBuscaBanco(e.filter);
    };

    // Handler para filtro de agências
    const handleFilterAgencias = (e) => {
        setBuscaAgencia(e.filter);
        setFiltroAgencia(e.filter);
    };

    return (
        <GridContainer data-tour="panel-step-2">
            <InfoBox>
                <strong>Informações importantes:</strong><br />
                • Os dados bancários são utilizados para crédito de salário e benefícios<br />
                • Certifique-se de que os dados estão corretos para evitar problemas no pagamento<br />
                • A conta preferencialmente deve estar no nome do colaborador<br />
                • <strong>Performance:</strong> Carregamos 15 bancos/agências mais comuns. Digite para buscar mais registros.
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
                    setBuscaAgencia('');
                    setFiltroAgencia('');
                    removerErroCampo('banco', valor);
                }}
                options={bancos}
                name="banco"
                label="Banco"
                placeholder={
                    carregandoBuscaBanco ? "Buscando..." 
                    : loadingBancos ? "Carregando..." 
                    : "Selecione o banco"
                }
                disabled={modoLeitura || loadingBancos || carregandoBuscaBanco}
                search
                filter
                onFilter={handleFilterBancos}
                emptyFilterMessage="Nenhum banco encontrado. Tente outro termo."
                emptyMessage="Digite para buscar bancos..."
            />
            


            {adicionandoAgencia ? (
                <div style={{ display: 'flex', width: '100%', alignItems: 'start', gap: '16px', justifyContent: 'start' }}>
                    <div style={{ flex: 1 }}>
                        <CampoTexto
                            name="agencia_nova"
                            valor={candidato?.agencia_nova || filtroAgencia}
                            setValor={valor => {
                            setCampo('agencia_nova', valor);
                            removerErroCampo('agencia_nova', valor);
                        }}
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
                        setValor={valor => {
                            setCampo('agencia', valor.code);
                            removerErroCampo('agencia', valor);
                        }}
                        options={agencias}
                        name="agencia"
                        label="Agência"
                        placeholder={
                            carregandoBusca ? "Buscando..." 
                            : loadingAgencias ? "Carregando..." 
                            : !candidato?.banco ? "Selecione um banco"
                            : agencias.length === 0 ? "Nenhuma agência para este banco"
                            : "Selecione a agência"
                        }
                        disabled={modoLeitura || !candidato?.banco || loadingAgencias || carregandoBusca}
                        search
                        filter
                        onFilter={handleFilterAgencias}
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
                setValor={valor => {
                    setCampo('conta_corrente', valor);
                    removerErroCampo('conta_corrente', valor);
                }}
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