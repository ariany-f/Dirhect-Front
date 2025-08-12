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
import { useNavigate } from 'react-router-dom';
import styles from './Registro.module.css'
import { useState, useEffect } from 'react';
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
    FaEye
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
        border: none !important;
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
    
    .p-picklist .p-picklist-buttons .p-button {
        background-color: var(--primaria) !important;
        border-color: var(--primaria) !important;
        color: white !important;
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
        submeterOperador
    } = useOperadorContext()

    const navegar = useNavigate()
    const [selectedRoles, setSelectedRoles] = useState([])
    const [grupos, setGrupos] = useState([]);
    const [gruposComPermissoes, setGruposComPermissoes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sourceGroups, setSourceGroups] = useState([]);
    const [targetGroups, setTargetGroups] = useState([]);

    // Função para buscar permissões de um grupo específico
    const buscarPermissoesGrupo = async (nomeGrupo) => {
        try {
            const response = await http.get(`permissao_grupo/?format=json&name=${nomeGrupo}`);
            // A resposta vem como array, pegamos o primeiro item que contém as permissões
            if (response && response.length > 0) {
                return response[0].permissions;
            }
            return [];
        } catch (error) {
            console.log('Erro ao buscar permissões do grupo:', error);
            return [];
        }
    }

    // Função para buscar permissões de todos os grupos
    const buscarPermissoesTodosGrupos = async (grupos) => {
        setLoading(true);
        const gruposComPermissoes = [];
        
        for (const grupo of grupos) {
            const permissoes = await buscarPermissoesGrupo(grupo);
            gruposComPermissoes.push({
                name: grupo,
                permissions: permissoes
            });
        }
        
        setGruposComPermissoes(gruposComPermissoes);
        setLoading(false);
    }

    // Função para obter informações dos grupos selecionados
    const getGruposSelecionadosInfo = () => {
        if (!selectedRoles.length) return [];
        return gruposComPermissoes.filter(g => selectedRoles.includes(g.name));
    }

    const gruposSelecionadosInfo = getGruposSelecionadosInfo();

    const adicionarOperador = () => {
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
        
        submeterOperador().then(response => {
            if(response) {
                navegar('/operador/registro/sucesso')
            }
        })
    } 

    // Função para lidar com mudanças no PickList
    const handlePickListChange = (event) => {
        setSourceGroups(event.source);
        setTargetGroups(event.target);
        setSelectedRoles(event.target.map(item => item.name));
    }

    useEffect(() => {
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
    }, []);

    return (
        <div style={{ width: '100%'}}>
        <Frame gap="6px">
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
                    Defina as permissões de uso da conta para seu operador:
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
                                <div style={{ marginBottom: '12px' }}>
                                    <SubTitulo>
                                        Selecione os grupos que deseja atribuir ao operador
                                    </SubTitulo>
                                </div>
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
                            
                            {gruposSelecionadosInfo.map((grupoInfo, index) => (
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
                                            {/* Agrupar permissões por app_label */}
                                            {(() => {
                                                const permissoesPorApp = {};
                                                grupoInfo.permissions.forEach(permissao => {
                                                    const app = permissao.app_label;
                                                    if (!permissoesPorApp[app]) {
                                                        permissoesPorApp[app] = [];
                                                    }
                                                    permissoesPorApp[app].push(permissao);
                                                });

                                                const appsPrincipais = Object.keys(permissoesPorApp).slice(0, 3);
                                                
                                                return (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
                                                                    border: '1px solid var(--neutro-200)'
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
                                                );
                                            })()}
                                        </div>
                                    )}
                                </div>
                            ))}
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
        </Frame>

            <BotaoGrupo align="space-between">
                <Botao aoClicar={() => navegar(-1)} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
                <Botao estilo="vermilion" size="medium" filled disabled={loading || selectedRoles.length === 0} onClick={adicionarOperador}>
                    Adicionar operador
                </Botao>
            </BotaoGrupo>
    </div>
    )
}
export default OperadorRegistroPermissoes