import { useOperadorContext } from '../../../contexts/Operador';
import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Texto from "@components/Texto"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import DottedLine from '@components/DottedLine';
import Loading from '@components/Loading';
import styled from 'styled-components';
import BotaoGrupo from '@components/BotaoGrupo';
import BotaoVoltar from '@components/BotaoVoltar';
import { useNavigate } from 'react-router-dom';
import styles from './Registro.module.css'
import { useState, useEffect, useMemo, useCallback } from 'react';
import http from '@http';
import CampoTexto from '@components/CampoTexto';
import { ArmazenadorToken } from '@utils';
import { PickList } from 'primereact/picklist';
import { 
    FaLock, 
    FaUsers, 
    FaPlus,
    FaEdit,
    FaTrash,
    FaEye,
    FaBuilding
} from 'react-icons/fa';

const ContainerButton = styled.div`
    display: flex;
    width: 100%;
    padding: 20px;
    justify-content: space-between;
    & button {
        width: initial;
    }
`

const CardLine = styled.div`
    padding: 12px 16px;
    border-bottom: 1px solid var(--neutro-200);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 10;
    background: white;
    border-radius: 6px;
    margin-bottom: 6px;
    box-sizing: border-box;
    cursor: pointer;
    transition: background-color 0.2s ease;
    
    &:nth-child(1) {
        margin-top: 0;
    }
    &:last-of-type {
        border-bottom: none;
        margin-bottom: 0;
    }
    
    &:hover:not(.disabled) {
        background: var(--neutro-50);
    }
    
    &:active:not(.disabled) {
        background: var(--neutro-100);
    }
    
    &.disabled {
        cursor: default;
        opacity: 0.6;
    }
`

const CardContainer = styled.div`
    border: 1px solid var(--neutro-200);
    border-radius: 12px;
    padding: 16px;
    background: white;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 6px;
`

const LayoutContainer = styled.div`
    display: grid;
    grid-template-columns: 70% 30%;
    gap: 20px;
    margin-top: 12px;
    width: 100%;
    
    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
        gap: 12px;
    }
`

const LeftColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    overflow: hidden;
    position: relative;
    z-index: 20;
    
    @media (max-width: 1024px) {
        overflow: visible;
    }
`

const RightColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-height: 600px;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    z-index: 1;
    
    @media (max-width: 1024px) {
        max-height: none;
        overflow: visible;
    }
`

const PickListContainer = styled.div`
    .p-picklist {
        border: none !important;
    }
    
    .p-picklist .p-picklist-list {
        border: 1px solid var(--neutro-200) !important;
        border-radius: 4px !important;
    }
    
    .p-picklist .p-picklist-list .p-picklist-item {
        border: none !important;
        border-radius: 4px !important;
        margin-bottom: 2px !important;
        transition: all 0.2s ease !important;
    }
    
    .p-picklist .p-picklist-list .p-picklist-item:hover {
        background-color: var(--neutro-100) !important;
    }
    
    .p-picklist .p-picklist-list .p-picklist-item.p-highlight {
        background-color: var(--primaria) !important;
        color: white !important;
    }
    
    .p-picklist .p-picklist-list .p-picklist-item.p-highlight:hover {
        background-color: var(--vermilion-600) !important;
    }
    
    /* Remover botões de reordenação (setas para cima/baixo) */
    .p-picklist .p-picklist-list .p-picklist-list-header .p-picklist-list-header-actions {
        display: none !important;
    }
    
    /* Mostrar apenas botões de transferência */
    .p-picklist .p-picklist-buttons {
        display: flex !important;
        flex-direction: column !important;
        gap: 4px !important;
    }
    
    .p-picklist .p-picklist-buttons .p-button {
        background-color: var(--primaria) !important;
        border-color: var(--primaria) !important;
        color: white !important;
        width: 32px !important;
        height: 32px !important;
        padding: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    }
    
    .p-picklist .p-picklist-buttons .p-button:hover {
        background-color: var(--vermilion-600) !important;
        border-color: var(--vermilion-600) !important;
    }
    
    .p-picklist .p-picklist-buttons .p-button:focus {
        box-shadow: 0 0 0 2px var(--primaria) !important;
    }
    
    .p-picklist .p-picklist-buttons .p-button:disabled {
        background-color: var(--neutro-300) !important;
        border-color: var(--neutro-300) !important;
        color: var(--neutro-500) !important;
    }
`

function OperadorRegistroPermissoes () {
    const { 
        operador,
        setGroups,
        setEmail,
        setTenants,
        submeterOperador
    } = useOperadorContext()

    const navegar = useNavigate()
    const [selectedRoles, setSelectedRoles] = useState([])
    const [grupos, setGrupos] = useState([]);
    const [gruposComPermissoes, setGruposComPermissoes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sourceGroups, setSourceGroups] = useState([]);
    const [targetGroups, setTargetGroups] = useState([]);
    const [tenants, setTenantsState] = useState([]);
    const [sourceTenants, setSourceTenants] = useState([]);
    const [targetTenants, setTargetTenants] = useState([]);
    const [selectedTenants, setSelectedTenants] = useState([]);
    const [loadingTenants, setLoadingTenants] = useState(false);

    // Função para buscar permissões de todos os grupos
    const buscarPermissoesTodosGrupos = useCallback(async (grupos) => {
        setLoading(true);
        try {
            // Buscar todas as permissões em paralelo
            const promises = grupos.map(async (grupo) => {
                try {
                    const response = await http.get(`permissao_grupo/?format=json&name=${grupo}`);
                    return {
                        name: grupo,
                        permissions: response && response.length > 0 ? response[0].permissions : []
                    };
                } catch (error) {
                    console.log('Erro ao buscar permissões do grupo:', grupo, error);
                    return {
                        name: grupo,
                        permissions: []
                    };
                }
            });
            
            const resultados = await Promise.all(promises);
            setGruposComPermissoes(resultados);
        } catch (error) {
            console.log('Erro ao buscar permissões:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Função para obter informações dos grupos selecionados
    const getGruposSelecionadosInfo = useCallback(() => {
        if (!selectedRoles.length) return [];
        return gruposComPermissoes.filter(g => selectedRoles.includes(g.name));
    }, [selectedRoles, gruposComPermissoes]);

    const gruposSelecionadosInfo = useMemo(() => getGruposSelecionadosInfo(), [getGruposSelecionadosInfo]);

    // Template otimizado para renderização dos grupos
    const gruposTemplate = useMemo(() => {
        return gruposSelecionadosInfo.map((grupoInfo, index) => {
            const permissoesPorApp = {};
            if (grupoInfo.permissions && grupoInfo.permissions.length > 0) {
                grupoInfo.permissions.forEach(permissao => {
                    const app = permissao.app_label;
                    if (!permissoesPorApp[app]) {
                        permissoesPorApp[app] = [];
                    }
                    permissoesPorApp[app].push(permissao);
                });
            }

            const appsPrincipais = Object.keys(permissoesPorApp).slice(0, 3);
            
            return (
                <div key={grupoInfo.name} style={{ 
                    padding: '12px', 
                    backgroundColor: 'var(--neutro-50)', 
                    borderRadius: '6px', 
                    marginTop: index > 0 ? '8px' : '6px',
                    border: '1px solid var(--neutro-200)'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: '8px' 
                    }}>
                        <Texto size="12px" weight={600} style={{ color: 'var(--primaria)' }}>
                            {grupoInfo.name}
                        </Texto>
                    </div>
                    
                    {grupoInfo.permissions && grupoInfo.permissions.length > 0 && (
                        <div>
                            {appsPrincipais.map(app => {
                                const permissoesApp = permissoesPorApp[app];
                                const temAdd = permissoesApp.some(p => p.codename.startsWith('add_'));
                                const temEdit = permissoesApp.some(p => p.codename.startsWith('change_'));
                                const temDelete = permissoesApp.some(p => p.codename.startsWith('delete_'));
                                const temView = permissoesApp.some(p => p.codename.startsWith('view_'));

                                return (
                                    <div key={app} style={{ 
                                        backgroundColor: 'white', 
                                        padding: '8px', 
                                        borderRadius: '4px',
                                        border: '1px solid var(--neutro-200)',
                                        marginBottom: '6px'
                                    }}>
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center', 
                                            marginBottom: '4px' 
                                        }}>
                                            <Texto size="11px" weight={600} style={{ textTransform: 'capitalize' }}>
                                                {app === 'admissao' ? 'Admissões' : 
                                                 app === 'gestao' ? 'Gestão' :
                                                 app === 'specific' ? 'Funcionários' :
                                                 app === 'shared' ? 'Compartilhado' :
                                                 app === 'integracao' ? 'Integração' :
                                                 app === 'auth' ? 'Autenticação' :
                                                 app === 'core' ? 'Usuários' :
                                                 app}
                                            </Texto>
                                        </div>
                                        
                                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                            {temAdd && (
                                                <span style={{
                                                    backgroundColor: 'var(--neutro-100)',
                                                    color: 'var(--neutro-700)',
                                                    padding: '2px 4px',
                                                    borderRadius: '3px',
                                                    fontSize: '9px',
                                                    fontWeight: '500',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '2px'
                                                }}>
                                                    <FaPlus size={8} /> Criar
                                                </span>
                                            )}
                                            {temEdit && (
                                                <span style={{
                                                    backgroundColor: 'var(--neutro-100)',
                                                    color: 'var(--neutro-700)',
                                                    padding: '2px 4px',
                                                    borderRadius: '3px',
                                                    fontSize: '9px',
                                                    fontWeight: '500',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '2px'
                                                }}>
                                                    <FaEdit size={8} /> Editar
                                                </span>
                                            )}
                                            {temDelete && (
                                                <span style={{
                                                    backgroundColor: 'var(--neutro-100)',
                                                    color: 'var(--neutro-700)',
                                                    padding: '2px 4px',
                                                    borderRadius: '3px',
                                                    fontSize: '9px',
                                                    fontWeight: '500',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '2px'
                                                }}>
                                                    <FaTrash size={8} /> Excluir
                                                </span>
                                            )}
                                            {temView && (
                                                <span style={{
                                                    backgroundColor: 'var(--neutro-100)',
                                                    color: 'var(--neutro-700)',
                                                    padding: '2px 4px',
                                                    borderRadius: '3px',
                                                    fontSize: '9px',
                                                    fontWeight: '500',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '2px'
                                                }}>
                                                    <FaEye size={8} /> Visualizar
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {Object.keys(permissoesPorApp).length > 3 && (
                                <div style={{ 
                                    textAlign: 'center', 
                                    padding: '4px',
                                    backgroundColor: 'var(--neutro-100)',
                                    borderRadius: '4px',
                                    border: '1px dashed var(--neutro-300)'
                                }}>
                                    <Texto size="10px" color="var(--neutro-600)">
                                        +{Object.keys(permissoesPorApp).length - 3} módulos adicionais
                                    </Texto>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        });
    }, [gruposSelecionadosInfo]);

    const adicionarOperador = useCallback(() => {
        // Encontrar as permissões de todos os grupos selecionados
        const permissoes = [];
        selectedRoles.forEach(role => {
            const grupoSelecionado = gruposComPermissoes.find(g => g.name === role);
            if (grupoSelecionado && grupoSelecionado.permissions) {
                permissoes.push(...grupoSelecionado.permissions);
            }
        });
        
        setGroups(selectedRoles)
        operador.groups = selectedRoles
        operador.global_user = false
        operador.permissions = permissoes
        
        // Adicionar tenants selecionados
        setTenants(selectedTenants)
        operador.tenants = selectedTenants
        
        submeterOperador().then(response => {
            if(response) {
                navegar('/operador/registro/sucesso')
            }
        })
    }, [selectedRoles, selectedTenants, gruposComPermissoes, setGroups, setTenants, submeterOperador, navegar, operador]);

    // Função para lidar com mudanças no PickList
    const handlePickListChange = useCallback((event) => {
        setSourceGroups(event.source);
        setTargetGroups(event.target);
        setSelectedRoles(event.target.map(item => item.name));
    }, []);

    // Função para lidar com mudanças no PickList de tenants
    const handleTenantsPickListChange = useCallback((event) => {
        setSourceTenants(event.source);
        setTargetTenants(event.target);
        setSelectedTenants(event.target.map(item => item.id));
    }, []);

    // Função para buscar tenants
    const buscarTenants = useCallback(async () => {
        setLoadingTenants(true);
        try {
            const response = await http.get('cliente/?format=json');
            
            // Buscar dados completos em paralelo
            const promises = response.map(async (cliente) => {
                try {
                    const [tenantResponse, pessoaJuridicaResponse] = await Promise.all([
                        http.get(`client_tenant/${cliente.id_tenant}/?format=json`),
                        http.get(`pessoa_juridica/${cliente.pessoa_juridica}/?format=json`)
                    ]);

                    return {
                        ...cliente,
                        tenant: tenantResponse || {},
                        pessoaJuridica: pessoaJuridicaResponse || {}
                    };
                } catch (erro) {
                    console.error("Erro ao buscar dados do tenant:", erro);
                    return { ...cliente, tenant: {}, pessoaJuridica: {} };
                }
            });

            const tenantsCompletos = await Promise.all(promises);
            setTenantsState(tenantsCompletos);
            setSourceTenants(tenantsCompletos.map(tenant => ({ 
                id: tenant.id_tenant, 
                label: tenant.tenant?.nome || 'Empresa',
                data: tenant 
            })));
        } catch (error) {
            console.error('Erro ao buscar tenants:', error);
        } finally {
            setLoadingTenants(false);
        }
    }, []);

    useEffect(() => {
        // Verificar se há nome e email do operador
        if (!operador.first_name) {
            navegar('/operador/registro');
            return;
        }

        // Buscar grupos apenas uma vez
        if (grupos.length === 0) {
            if(ArmazenadorToken.UserGroups) {
                const gruposDisponiveis = ArmazenadorToken.UserGroups;
                setGrupos(gruposDisponiveis);
                setSourceGroups(gruposDisponiveis.map(grupo => ({ name: grupo, label: grupo })));
                buscarPermissoesTodosGrupos(gruposDisponiveis);
            }
            else {
                http.get('permissao_grupo/')
                    .then(response => {
                        setGrupos(response);
                        setSourceGroups(response.map(grupo => ({ name: grupo, label: grupo })));
                        buscarPermissoesTodosGrupos(response);
                    })
                    .catch(error => console.log('Erro ao buscar grupos:', error));
            }
        }
        
        // Buscar tenants apenas uma vez
        if (tenants.length === 0) {
            buscarTenants();
        }
    }, [operador.first_name, navegar, buscarPermissoesTodosGrupos, buscarTenants, grupos.length, tenants.length]);

    return (
        <div style={{ width: '100%'}}>
        <Frame gap="6px">
            <BotaoVoltar />
            <Loading opened={loading} />
            <Texto weight={500} size="12px">Nome do operador</Texto>
            <Titulo>
                <h3>{operador.first_name} {operador.last_name}</h3>
            </Titulo>
            <DottedLine />
            
            {!operador.email && (
                <div style={{ marginBottom: 16 }}>
                    <CampoTexto
                        type="email"
                        name="email"
                        label="E-mail do operador"
                        valor={operador.email || ''}
                        setValor={(valor) => setEmail(valor)}
                        placeholder="Digite o e-mail do operador"
                        required={true}
                    />
                </div>
            )}
            <Titulo>
                <h6>Permissões</h6>
                <SubTitulo>
                    Selecione os grupos que deseja atribuir ao operador:
                </SubTitulo>
            </Titulo>
            
            <LayoutContainer>
                <LeftColumn>
                    <CardContainer>
                        {loading ? (
                            <div style={{ padding: '16px', textAlign: 'center' }}>
                                <Texto>Carregando permissões dos grupos...</Texto>
                            </div>
                        ) : (
                            <div style={{ padding: '12px' }}>
                                <PickListContainer>
                                    <PickList
                                        source={sourceGroups}
                                        target={targetGroups}
                                        onChange={handlePickListChange}
                                        sourceHeader="Grupos Disponíveis"
                                        targetHeader="Grupos Selecionados"
                                        itemTemplate={(item) => (
                                            <div style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '8px',
                                                padding: '8px 0'
                                            }}>
                                                <FaUsers size={14} style={{ color: 'var(--neutro-600)' }} />
                                                <span>{item.label}</span>
                                            </div>
                                        )}
                                        style={{ 
                                            height: '400px'
                                        }}
                                    />
                                </PickListContainer>
                            </div>
                        )}
                    </CardContainer>
                </LeftColumn>
                <RightColumn>
                    {/* Informações dos grupos selecionados */}
                    {selectedRoles.length > 0 && (
                        <CardContainer>
                            <CardLine>
                                <Titulo>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FaLock size={18} />
                                        <div>
                                            <SubTitulo>
                                                {selectedRoles.length} grupo{selectedRoles.length > 1 ? 's' : ''} selecionado{selectedRoles.length > 1 ? 's' : ''}
                                            </SubTitulo>
                                        </div>
                                    </div>
                                </Titulo>
                            </CardLine>
                            
                            {gruposTemplate}
                        </CardContainer>
                    )}
                    
                    {/* Placeholder quando nenhum grupo está selecionado */}
                    {selectedRoles.length === 0 && (
                        <CardContainer style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            minHeight: '250px',
                            textAlign: 'center'
                        }}>
                            <FaLock size={40} style={{ color: 'var(--neutro-400)', marginBottom: '12px' }} />
                            <Titulo>
                                <b>Selecione grupos</b>
                                <SubTitulo>
                                    Escolha um ou mais grupos na coluna esquerda para visualizar as permissões detalhadas
                                </SubTitulo>
                            </Titulo>
                        </CardContainer>
                    )}
                </RightColumn>
            </LayoutContainer>

            {/* Seção de Seleção de Tenants */}
            <Titulo>
                <h6>Empresas</h6>
                <SubTitulo>
                    Selecione as empresas onde o operador terá acesso:
                </SubTitulo>
            </Titulo>
            
            <CardContainer>
                {loadingTenants ? (
                    <div style={{ padding: '16px', textAlign: 'center' }}>
                        <Texto>Carregando empresas...</Texto>
                    </div>
                ) : (
                    <div style={{ padding: '12px' }}>
                        <PickListContainer>
                            <PickList
                                source={sourceTenants}
                                target={targetTenants}
                                onChange={handleTenantsPickListChange}
                                sourceHeader="Empresas Disponíveis"
                                targetHeader="Empresas Selecionadas"
                                itemTemplate={(item) => (
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px',
                                        padding: '8px 0'
                                    }}>
                                        <FaBuilding size={14} style={{ color: 'var(--neutro-600)' }} />
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: '600', fontSize: '12px' }}>
                                                {item.label}
                                            </span>
                                            <span style={{ fontSize: '10px', color: 'var(--neutro-500)' }}>
                                                {item.data?.pessoaJuridica?.cnpj || item.data?.pessoa_juridica?.cnpj || ''}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                style={{ 
                                    height: '300px'
                                }}
                            />
                        </PickListContainer>
                    </div>
                )}
            </CardContainer>
        </Frame>

            <BotaoGrupo align="space-between">
                <Botao aoClicar={() => navegar(-1)} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
                <Botao estilo="vermilion" size="medium" filled disabled={loading || loadingTenants || selectedRoles.length === 0 || selectedTenants.length === 0} onClick={adicionarOperador}>
                    Adicionar operador
                </Botao>
            </BotaoGrupo>
    </div>
    )
}
export default OperadorRegistroPermissoes