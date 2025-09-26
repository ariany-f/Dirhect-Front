import React, { useState, useEffect, useRef } from 'react';
import CampoTexto from '@components/CampoTexto';
import Botao from '@components/Botao';
import Frame from '@components/Frame';
import http from '@http';
import styled from 'styled-components';
import { OverlayRight, DialogEstilizadoRight } from '@components/Modal/styles';
import { RiCloseFill } from 'react-icons/ri';
import Titulo from '@components/Titulo';
import DropdownItens from '@components/DropdownItens';
import CustomImage from '@components/CustomImage';
import axios from 'axios';
import { ArmazenadorToken } from '@utils';
import { ProgressSpinner } from 'primereact/progressspinner';
import { FaBuilding } from 'react-icons/fa';
import { Toast } from 'primereact/toast';

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 8px;
    margin-bottom: 8px;
`

const Col6 = styled.div`
    padding: 4px 0px;
    flex: 1 1 calc(50% - 8px);
`

const ModalContent = styled.div`
    display: flex;
    gap: 24px;
    height: calc(100vh - 300px);
    overflow-y: auto;
    padding: 16px 24px;
    
    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 3px;
    }
`

const Column = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    background: var(--surface-card);
    border-radius: 8px;

    h6 {
        margin: 0 0 8px 0;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--surface-border);
        font-size: 16px;
        font-weight: 600;
    }
`

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 12px 24px;
    border-top: 1px solid var(--surface-border);
`

const ClienteSection = styled.div`
    padding: 12px 24px;
    border-bottom: 1px solid var(--surface-border);
    background: var(--surface-ground);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-left: 24px;
    
    & .empresa-container {
        display: flex;
        align-items: center;
        gap: 16px;
    }
    
    & .p-dropdown {
        width: 300px;
        min-width: 250px;
    }
    
    & label {
        font-weight: 600;
        color: var(--text-color);
        white-space: nowrap;
    }
    
    & .estrutura-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-color);
    }
`

function ModalTransferirVaga({ opened = false, aoFechar, vaga, aoSalvar }) {
    const [classError, setClassError] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [filiais, setFiliais] = useState([]);
    const [centros_custo, setCentrosCusto] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [secoes, setSecoes] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [funcoes, setFuncoes] = useState([]);
    const [sindicatos, setSindicatos] = useState([]);
    const [loadingDados, setLoadingDados] = useState(false);
    const toast = useRef(null);

    const [filial, setFilial] = useState(null);
    const [centroCusto, setCentroCusto] = useState(null);
    const [departamento, setDepartamento] = useState(null);
    const [secao, setSecao] = useState(null);
    const [cargo, setCargo] = useState(null);
    const [horario, setHorario] = useState(null);
    const [funcao, setFuncao] = useState(null);
    const [sindicato, setSindicato] = useState(null);

    // Função para formatar CNPJ
    const formataCNPJ = (cnpj) => {
        if (!cnpj) return '';
        cnpj = cnpj.replace(/[^\d]/g, "");
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    };

    // Template para o dropdown de clientes
    const clienteTemplate = (option, props) => {
        if (!option) {
            if (props && props.placeholder) {
                return <span style={{ color: '#bdbdbd' }}>{props.placeholder}</span>;
            }
            return <span>{option?.name || ''}</span>;
        }
        
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0' }}>
                {option.tenant?.simbolo && option.tenant.simbolo !== null && option.tenant.simbolo !== 'null' ? (
                    <CustomImage 
                        src={option.tenant.simbolo} 
                        width={24} 
                        height={24} 
                        borderRadius="4px"
                        title={option.name}
                    />
                ) : option.tenant?.logo && option.tenant.logo !== null && option.tenant.logo !== 'null' ? (
                    <CustomImage 
                        src={option.tenant.logo} 
                        width={32} 
                        height={24} 
                        borderRadius="4px"
                        title={option.name}
                    />
                ) : (
                    <div style={{ 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '4px', 
                        backgroundColor: 'var(--neutro-100)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                    }}>
                        <FaBuilding size={12} color="var(--neutro-500)" />
                    </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{option.name}</span>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                        {formataCNPJ(option.pessoaJuridica?.cnpj)}
                    </span>
                </div>
            </div>
        );
    };

    useEffect(() => {
        if (opened) {
            // Carregar clientes
            http.get('cliente/?format=json')
                .then(async (response) => {
                    const clientesCompletos = await Promise.all(response.map(async (cliente) => {
                        try {
                            const tenantResponse = await http.get(`client_tenant/${cliente.id_tenant.id}/?format=json`);

                            const pessoaJuridica = cliente.pessoaJuridica || cliente.pessoa_juridica;
                            
                            return {
                                ...cliente,
                                name: cliente.id_tenant.nome,
                                code: cliente.id_tenant.id,
                                tenant: cliente.id_tenant,
                                domain_url: cliente.domain_url,
                                pessoaJuridica: pessoaJuridica
                            };
                        } catch (erro) {
                            console.error("Erro ao buscar dados do cliente:", erro);
                            return { 
                                ...cliente, 
                                name: `Cliente ${cliente.id}`,
                                code: cliente.id_tenant.id,
                                tenant: {}, 
                                pessoaJuridica: {} 
                            };
                        }
                    }));

                    // Filtrar para não mostrar a empresa atual
                    const clientesFiltrados = clientesCompletos.filter(cliente => 
                        cliente.id_tenant.id != ArmazenadorToken.UserCompanyPublicId
                    );

                    setClientes(clientesFiltrados);
                })
                .catch(error => {
                    console.error('Erro ao carregar clientes:', error);
                });

            // Inicializar arrays vazios - só carrega quando selecionar empresa
            setFiliais([]);
            setDepartamentos([]);
            setSecoes([]);
            setCargos([]);
            setCentrosCusto([]);
            setSindicatos([]);
            setHorarios([]);
            setFuncoes([]);
        }
    }, [opened]);

    useEffect(() => {
        if (vaga && opened) {
            // Não preencher campos organizacionais - só quando selecionar empresa de destino
            setFilial(null);
            setCentroCusto(null);
            setDepartamento(null);
            setSecao(null);
            setCargo(null);
            setHorario(null);
            setFuncao(null);
            setSindicato(null);
        }
    }, [vaga, opened]);

    useEffect(() => {
        if (!opened) {
            // Limpar todos os dados quando o modal for fechado
            setClienteSelecionado(null);
            setFiliais([]);
            setDepartamentos([]);
            setSecoes([]);
            setCargos([]);
            setCentrosCusto([]);
            setSindicatos([]);
            setHorarios([]);
            setFuncoes([]);
            setFilial(null);
            setCentroCusto(null);
            setDepartamento(null);
            setSecao(null);
            setCargo(null);
            setHorario(null);
            setFuncao(null);
            setSindicato(null);
            setLoadingDados(false);
        }
    }, [opened]);

    useEffect(() => {
        if (clienteSelecionado && clienteSelecionado.domain_url) {
        // if (clienteSelecionado && clienteSelecionado.tenant?.client_domain) {
            console.log(clienteSelecionado)
            const clientDomain = clienteSelecionado.domain_url;
            
            setLoadingDados(true);
            
            // Recarregar todos os dropdowns com o client_domain do cliente selecionado
            Promise.all([
                axios.get(`https://${clientDomain}/api/filial/?format=json`, 
                    {
                        headers: {
                            'Authorization': `Bearer ${ArmazenadorToken.AccessToken}`
                        }
                    }
                ),
                axios.get(`https://${clientDomain}/api/departamento/?format=json`, 
                    {
                        headers: {
                            'Authorization': `Bearer ${ArmazenadorToken.AccessToken}`
                        }
                    }
                ),
                axios.get(`https://${clientDomain}/api/secao/?format=json`, 
                    {
                        headers: {
                            'Authorization': `Bearer ${ArmazenadorToken.AccessToken}`
                        }
                    }
                ),
                axios.get(`https://${clientDomain}/api/cargo/?format=json`, 
                    {
                        headers: {
                            'Authorization': `Bearer ${ArmazenadorToken.AccessToken}`
                        }
                    }
                ),
                axios.get(`https://${clientDomain}/api/centro_custo/?format=json`, 
                    {
                        headers: {
                            'Authorization': `Bearer ${ArmazenadorToken.AccessToken}`
                        }
                    }
                ),
                axios.get(`https://${clientDomain}/api/sindicato/?format=json`,
                    {
                        headers: {
                            'Authorization': `Bearer ${ArmazenadorToken.AccessToken}`
                        }
                    }
                ),
                axios.get(`https://${clientDomain}/api/horario/?format=json`,
                    {
                        headers: {
                            'Authorization': `Bearer ${ArmazenadorToken.AccessToken}`
                        }
                    }
                ),
                axios.get(`https://${clientDomain}/api/funcao/?format=json`,
                    {
                        headers: {
                            'Authorization': `Bearer ${ArmazenadorToken.AccessToken}`
                        }
                    }
                )
            ]).then(([
                filiaisResp,
                departamentosResp,
                secoesResp,
                cargosResp,
                centrosCustoResp,
                sindicatosResp,
                horariosResp,
                funcoesResp
            ]) => {
                setFiliais(Array.isArray(filiaisResp.data) ? filiaisResp.data : []);
                setDepartamentos(Array.isArray(departamentosResp.data) ? departamentosResp.data : []);
                setSecoes(Array.isArray(secoesResp.data) ? secoesResp.data : []);
                setCargos(Array.isArray(cargosResp.data) ? cargosResp.data : []);
                setCentrosCusto(Array.isArray(centrosCustoResp.data) ? centrosCustoResp.data : []);
                setSindicatos(Array.isArray(sindicatosResp.data) ? sindicatosResp.data : []);
                setHorarios(Array.isArray(horariosResp.data) ? horariosResp.data : []);
                setFuncoes(Array.isArray(funcoesResp.data) ? funcoesResp.data : []);
                
                // Limpar as seleções atuais pois os dados mudaram
                setFilial(null);
                setCentroCusto(null);
                setDepartamento(null);
                setSecao(null);
                setCargo(null);
                setHorario(null);
                setFuncao(null);
                setSindicato(null);
                
                setLoadingDados(false);
            }).catch(error => {
                console.error('Erro ao carregar dados do cliente selecionado:', error);
                // Em caso de erro, garantir que os arrays sejam vazios
                setFiliais([]);
                setDepartamentos([]);
                setSecoes([]);
                setCargos([]);
                setCentrosCusto([]);
                setSindicatos([]);
                setHorarios([]);
                setFuncoes([]);
                setLoadingDados(false);
            });
        }
    }, [clienteSelecionado]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!clienteSelecionado) {
            toast.current.show({
                severity: 'error',
                summary: 'Selecione um cliente',
                detail: 'É necessário selecionar um cliente para transferir a vaga',
                life: 3000
            });
            return;
        }

        if (!filial) {
            toast.current.show({
                severity: 'error',
                summary: 'Selecione uma filial',
                detail: 'É obrigatório selecionar uma filial para transferir a vaga',
                life: 3000
            });
            return;
        }

        const dadosTransferencia = {
            id: vaga.id,
            filial: filial?.code || null,
            centro_custo: centroCusto?.code || null,
            departamento: departamento?.code || null,
            secao: secao?.code || null,
            cargo: cargo?.code || null,
            horario: horario?.code || null,
            funcao: funcao?.code || null,
            sindicato: sindicato?.code || null
        };

        // Usar o schema_name diretamente do tenant
        const tenantDestino = clienteSelecionado.tenant?.schema_name || clienteSelecionado.code;

        aoSalvar(dadosTransferencia, tenantDestino);
    };

    return (
        opened &&
        <OverlayRight $opened={opened}>
            <Toast ref={toast} />
            <DialogEstilizadoRight $opened={opened} $align="flex-start" $width="65vw" $minWidth="80vw" open={opened}>
                <Frame>
                    <Titulo>
                        <button className="close" onClick={aoFechar}>
                            <RiCloseFill size={20} className="fechar" />  
                        </button>
                        <h6>Transferir Vaga</h6>
                    </Titulo>
                </Frame>
                
                <ClienteSection>
                    <div className="empresa-container">
                        <label>Empresa de Destino:</label>
                        <DropdownItens 
                            camposVazios={classError}
                            name="cliente" 
                            valor={clienteSelecionado}
                            setValor={setClienteSelecionado} 
                            options={clientes} 
                            placeholder="Selecione a empresa para transferir a vaga"
                            optionTemplate={clienteTemplate}
                            valueTemplate={clienteTemplate}
                            showLabel={false}
                        />
                    </div>
                </ClienteSection>

                <form onSubmit={handleSubmit}>
                    <ModalContent>
                        <Column>
                            {loadingDados && (
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    padding: '20px',
                                    flexDirection: 'column',
                                    gap: '12px'
                                }}>
                                    <ProgressSpinner style={{ width: '32px', height: '32px' }} />
                                    <span style={{ color: '#666', fontSize: '13px' }}>Carregando dados da empresa...</span>
                                </div>
                            )}
                            {!loadingDados && (
                                <>
                                    <Col12>
                                        <Col6>
                                            <DropdownItens 
                                                camposVazios={classError}
                                                name="filial" 
                                                valor={filial}
                                                setValor={setFilial} 
                                                options={(filiais || []).map(filial => ({
                                                    name: filial.nome,
                                                    code: filial.id
                                                }))} 
                                                placeholder="Filial" />
                                        </Col6>
                                        <Col6>
                                            <DropdownItens 
                                                camposVazios={classError}
                                                name="centro_custo" 
                                                valor={centroCusto}
                                                setValor={setCentroCusto} 
                                                options={(centros_custo || []).map(cc => ({
                                                    name: cc.nome,
                                                    code: cc.id
                                                }))} 
                                                placeholder="Centro de Custo" />
                                        </Col6>
                                    </Col12>

                                    <Col12>
                                        <Col6>
                                            <DropdownItens 
                                                camposVazios={classError}
                                                name="departamento" 
                                                valor={departamento}
                                                setValor={setDepartamento} 
                                                options={(departamentos || []).map(dep => ({
                                                    name: dep.nome,
                                                    code: dep.id
                                                }))} 
                                                placeholder="Departamento" />
                                        </Col6>
                                        <Col6>
                                            <DropdownItens 
                                                camposVazios={classError}
                                                name="secao" 
                                                valor={secao}
                                                setValor={setSecao} 
                                                options={(secoes || []).map(sec => ({
                                                    name: sec.nome,
                                                    code: sec.id
                                                }))} 
                                                placeholder="Seção" />
                                        </Col6>
                                    </Col12>

                                    <Col12>
                                        <Col6>
                                            <DropdownItens 
                                                camposVazios={classError}
                                                name="cargo" 
                                                valor={cargo}
                                                setValor={setCargo} 
                                                options={(cargos || []).map(cargo => ({
                                                    name: cargo.nome,
                                                    code: cargo.id
                                                }))} 
                                                placeholder="Cargo" />
                                        </Col6>
                                        <Col6>
                                            <DropdownItens 
                                                camposVazios={classError}
                                                name="horario" 
                                                valor={horario}
                                                setValor={setHorario} 
                                                options={(horarios || []).map(horario => ({
                                                    name: horario.id_origem 
                                                    ? `${horario.id_origem} - ${horario.descricao || horario.nome}` 
                                                    : (horario.descricao || horario.nome),
                                                    code: horario.id
                                                }))} 
                                                placeholder="Horário" />
                                        </Col6>
                                    </Col12>

                                    <Col12>
                                        <Col6>
                                            <DropdownItens 
                                                camposVazios={classError}
                                                name="funcao" 
                                                valor={funcao}
                                                setValor={setFuncao} 
                                                options={(funcoes || []).map(funcao => ({
                                                    name: funcao.nome,
                                                    code: funcao.id
                                                }))} 
                                                placeholder="Função" />
                                        </Col6>
                                        <Col6>
                                            <DropdownItens 
                                                camposVazios={classError}
                                                name="sindicato" 
                                                valor={sindicato}
                                                setValor={setSindicato} 
                                                options={(sindicatos || []).map(sindicato => ({
                                                    name: `${sindicato.codigo} - ${sindicato.descricao}`,
                                                    code: sindicato.id
                                                }))} 
                                                placeholder="Sindicato" />
                                        </Col6>
                                    </Col12>
                                </>
                            )}
                        </Column>
                    </ModalContent>
                    <ButtonContainer>
                        <Botao type="submit" disabled={!clienteSelecionado}>Transferir Vaga</Botao>
                    </ButtonContainer>
                </form>
            </DialogEstilizadoRight>
        </OverlayRight>
    );
}

export default ModalTransferirVaga; 