import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Titulo from "@components/Titulo"
import DropdownItens from "@components/DropdownItens"
import BotaoGrupo from "@components/BotaoGrupo"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import http from "@http"
import { MultiSelect } from 'primereact/multiselect'
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"
import styles from './ModalAdicionarElegibilidadeItemContrato.module.css'
import { ArmazenadorToken } from "@utils"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { RiCloseFill, RiDraggable, RiOrganizationChart } from "react-icons/ri"
import { TfiSave } from "react-icons/tfi";
import { GrAddCircle } from "react-icons/gr"
import { MdArrowRight } from "react-icons/md"
import { FaArrowRight, FaUser, FaUsers } from "react-icons/fa"
import { Toast } from "primereact/toast"
import { OverlayRight, DialogEstilizadoRight } from '@components/Modal/styles'
import SwitchInput from '@components/SwitchInput'
import { TbTableOptions  } from "react-icons/tb"
import { MdInfo } from "react-icons/md"
import Texto from '@components/Texto';

// Componente de Item Arrastável com novos estilos
const DraggableItem = ({ grupo, index, moveItem, removerGrupo, toggleNegarGrupo }) => {
    const ref = useRef(null);
    
    const [{ isDragging }, drag] = useDrag({
        type: 'GRUPO',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
  
    const [, drop] = useDrop({
        accept: 'GRUPO',
        hover(item, monitor) {
            if (!ref.current) return;
            const dragIndex = item.index;
            const hoverIndex = index;
    
            if (dragIndex === hoverIndex) return;
    
            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
    
            moveItem(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });
  
    drag(drop(ref));
  
    return (
        <div
            ref={ref}
            style={{
                opacity: isDragging ? 0.6 : 1,
                transform: isDragging ? 'scale(1.02)' : 'scale(1)',
                cursor: 'grab',
                marginBottom: '12px',
                transition: 'all 0.3s ease',
            }}
        >
            <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #eaeaea'
            }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '8px'
                }}>
                    <span style={{ 
                        fontWeight: '500', 
                        color: 'black',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                    <RiDraggable />
                    <span style={{marginRight: 6, color: '#888'}}>{index + 1}.</span> {grupo.tipo}
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: 16 }}>
                        <SwitchInput
                            checked={!!grupo.negar}
                            onChange={() => toggleNegarGrupo(grupo.id)}
                            color="var(--error)"
                        />
                        <span style={{ marginLeft: 8, fontSize: 13 }}>Desconsiderar</span>
                    </div>
                    </span>
                    <button 
                        onClick={() => removerGrupo(grupo.id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#757575',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            padding: '0 8px',
                            transition: 'color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#f44336'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#757575'}
                    >
                        ×
                    </button>
                </div>
                <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '8px'
                }}>
                    {grupo.data.map((opcao, i) => {
                        const textoLimitado = opcao.textoCompleto.length > 50 
                            ? `${opcao.textoCompleto.substring(0, 47)}...` 
                            : opcao.textoCompleto;
                       
                        return (
                            <div 
                                key={opcao.id} 
                                style={{
                                    display: 'flex', 
                                    alignItems: 'center',
                                    backgroundColor: '#f5f5f5',
                                    padding: '4px 12px',
                                    borderRadius: '16px',
                                    fontSize: '13px',
                                    color: '#424242',
                                    maxWidth: '200px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    marginRight: 8,
                                    marginBottom: 8
                                }}
                            >
                                <span title={opcao.textoCompleto}>{textoLimitado}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-self: stretch;
    width: 100%;
    min-width: 0;
    max-width: 100%;
    margin-top: 16px;
    box-sizing: border-box;
`;

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    width: 100%;
`;

const Col6 = styled.div`
    flex: 1 1 calc(50% - 8px);
    flex-basis: calc(50% - 8px);
    width: calc(50% - 8px);
    max-width: calc(50% - 8px);
    min-width: calc(50% - 8px);
    max-height: 75vh;
    overflow-y: auto;
`;

const ContainerGrupos = styled.div`
    width: 100%;
    max-width: 100%;
    margin-bottom: 24px;
    overflow-y: auto;
    padding: 24px 12px;
    border-radius: 8px;
    box-sizing: border-box;
    min-width: 0;
`;

const StyledMultiSelect = styled(MultiSelect)`
    width: 100%;
    border-radius: 4px;
    outline: 0.4px solid var(--neutro-400);
    background: var(--background-label);
    padding: 12px 16px;
    border: none;
    font-weight: 700;
    height: 60px;
    margin-top: 2px;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;

    &:focus {
        outline-color: var(--primaria);
    }

    & .p-multiselect-label {
        padding: 0;
    }

    & .p-multiselect-token {
        background: var(--neutro-200);
        color: var(--black);
        border-radius: 12px;
        padding: 2px 8px;
        margin-right: 4px;
        font-size: 12px;
        font-weight: 500;
    }

    & .p-multiselect-token-icon {
        margin-left: 4px;
    }
`;

const TabPanel = styled.div`
    display: flex;
    align-items: center;
    gap: 0;
`;

const TabButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    background: ${({ active }) => active ? 'linear-gradient(to left, var(--black), var(--gradient-secundaria))' : '#f5f5f5'};
    color: ${({ active }) => active ? '#fff' : '#333'};
    border: none;
    border-radius: 8px 8px 0 0;
    font-size: 16px;
    font-weight: 500;
    padding: 10px 22px;
    cursor: pointer;
    margin-right: 2px;
    box-shadow: ${({ active }) => active ? '0 2px 8px var(--gradient-secundaria)40' : 'none'};
    transition: background 0.2s, color 0.2s;
    outline: none;
    border-bottom: ${({ active }) => active ? '2px solid var(--gradient-secundaria)' : '2px solid transparent'};
    &:hover {
        background: ${({ active }) => active ? 'linear-gradient(to left, var(--black), var(--gradient-secundaria))' : '#ececec'};
    }
`;

function ModalAdicionarElegibilidadeBeneficioContrato({ opened = false, aoFechar, aoSalvar, item, heranca }) {

    const { usuario } = useSessaoUsuarioContext();
    
    // Estados para controle das abas
    const [activeIndex, setActiveIndex] = useState(0);
    
    // Estados para colaborador (já existentes)
    const [tipoSelecionado, setTipoSelecionado] = useState(null);
    const [opcoesDisponiveis, setOpcoesDisponiveis] = useState([]);
    const [opcoesSelecionadas, setOpcoesSelecionadas] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [gruposAdicionados, setGruposAdicionados] = useState([]);
    const [modelosValidos, setModelosValidos] = useState({});
    const toast = useRef(null);
    const [herdar, setHerdar] = useState(false);
    
    // Estados para dependentes (novos)
    const [tipoSelecionadoDependente, setTipoSelecionadoDependente] = useState(null);
    const [opcoesDisponiveisDependente, setOpcoesDisponiveisDependente] = useState([]);
    const [opcoesSelecionadasDependente, setOpcoesSelecionadasDependente] = useState([]);
    const [carregandoDependente, setCarregandoDependente] = useState(false);
    const [gruposAdicionadosDependente, setGruposAdicionadosDependente] = useState([]);
    const [extensivelDependente, setExtensivelDependente] = useState(false);
    const [exclusivoDependente, setExclusivoDependente] = useState(false);
    
    useEffect(() => {
        const carregarModelosValidos = async () => {
            try {
                const response = await http.get('modelos_validos/?format=json');
                setModelosValidos(response);
            } catch (error) {
                console.error('Erro ao carregar modelos válidos:', error);
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar modelos válidos',
                    life: 3000
                });
            }
        };
        carregarModelosValidos();
    }, []);

    // Converter modelos válidos para o formato do dropdown
    const tipos = Object.entries(modelosValidos).map(([code, data]) => ({
        code,
        name: code.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        model: data.model
    }));

    // Tipos específicos para dependentes
    const tiposDependentes = [
        {
            code: 'genero_dependente',
            name: 'Gênero do Dependente',
            model: 'custom',
            options: [
                { id: 'M', name: 'Masculino', textoCompleto: 'Masculino' },
                { id: 'F', name: 'Feminino', textoCompleto: 'Feminino' }
            ]
        },
        {
            code: 'grau_parentesco',
            name: 'Grau de Parentesco',
            model: 'custom',
            options: [
                { id: 'conjuge', name: 'Cônjuge', textoCompleto: 'Cônjuge' },
                { id: 'filho', name: 'Filho(a)', textoCompleto: 'Filho(a)' },
                { id: 'pai', name: 'Pai', textoCompleto: 'Pai' },
                { id: 'mae', name: 'Mãe', textoCompleto: 'Mãe' },
                { id: 'irmao', name: 'Irmão(ã)', textoCompleto: 'Irmão(ã)' },
                { id: 'neto', name: 'Neto(a)', textoCompleto: 'Neto(a)' },
                { id: 'sogro', name: 'Sogro(a)', textoCompleto: 'Sogro(a)' },
                { id: 'genro_nora', name: 'Genro/Nora', textoCompleto: 'Genro/Nora' }
            ]
        }
    ];

    // Combinar tipos para colaborador e dependentes
    const tiposCombinados = [...tipos, ...tiposDependentes];

    // Template para o dropdown
    const tipoTemplate = (option, props) => {
        // Se for o valor selecionado e não houver valor, mostra o placeholder
        if (!option || !option.model) {
            if (props && props.placeholder) {
                return <span style={{ color: '#bdbdbd' }}>{props.placeholder}</span>;
            }
            return <span>{option?.name || ''}</span>;
        }
        const icon = option.model.startsWith('specific.') || option.model.startsWith('shared.')
            ? <RiOrganizationChart size={18} style={{ marginRight: '8px' }} />
            : <TbTableOptions size={18} style={{ marginRight: '8px' }} />;
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {icon}
                {option.name}
            </div>
        );
    };

    // Adicione este useEffect no componente ModalAdicionarElegibilidadeBeneficioContrato
    useEffect(() => {
        if (opened && item?.regra_elegibilidade) {
            setGruposAdicionados([]);
            // Para cada regra, monta o grupo
            if(item?.regra_elegibilidade && item?.regra_elegibilidade.length > 0) {
                item?.regra_elegibilidade?.forEach(async (regra) => {
                const [tipoChave, dados] = Object.entries(regra)[0];
                // Busca as opções na API correspondente
                const modelInfo = modelosValidos[tipoChave];
                let endpoint = tipoChave;
                
                if (modelInfo?.model?.startsWith('integracao.')) {
                    endpoint = `tabela_dominio/${tipoChave.replace(/_/g, '_')}`;
                }
                
                const response = await http.get(`${endpoint}/?format=json`);
                // Junta id_delegar e id_negar para buscar todos os itens
                const todosIds = [...(dados.id_delegar || []), ...(dados.id_negar || [])];
                const fieldDesc = modelInfo?.field_desc || 'nome';
                
                // Trata a resposta da tabela_dominio
                const registros = response.registros || response;
                
                const opcoes = registros.filter(opt => todosIds.includes(opt.id)).map(opt => ({
                    id: opt.id,
                    name: opt[fieldDesc] || opt.nome || opt.descricao || opt.name,
                    textoCompleto: opt[fieldDesc] || opt.nome || opt.descricao || opt.name
                }));
                // Define negar true se todos os ids estão em id_negar
                const negar = (dados.id_negar && dados.id_negar.length > 0 && (!dados.id_delegar || dados.id_delegar.length === 0 || (dados.id_delegar.length === 1 && dados.id_delegar[0] === 0)));
                setGruposAdicionados(grupos => [
                    ...grupos,
                    {
                        id: `${tipoChave}-${Date.now()}`,
                        data: opcoes,
                        tipo: tipos.find(t => t.code === tipoChave)?.name || tipoChave,
                        opcoes: opcoes.map(o => o.textoCompleto),
                        negar
                    }
                ]);
                });
            }
        } else if (!opened) {
            setGruposAdicionados([]);
        }
    }, [opened, item, modelosValidos]);

    // Resetar herdar ao abrir/fechar
    useEffect(() => {
        if (opened) {
            setHerdar(item.herdado);
            setExtensivelDependente(item.extensivel_dependente || false);
            setExclusivoDependente(item.exclusivo_dependente || false);
        } else {
            // Limpar dados quando o modal for fechado
            setActiveIndex(0);
            setGruposAdicionadosDependente([]);
            setTipoSelecionadoDependente(null);
            setOpcoesSelecionadasDependente([]);
            setOpcoesDisponiveisDependente([]);
            setCarregandoDependente(false);
            setExtensivelDependente(false);
            setExclusivoDependente(false);
        }
    }, [opened, item]);

    const adicionarGrupo = () => {
        if (!tipoSelecionado || (!tipoSelecionado.name) || opcoesSelecionadas.length === 0) {
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Selecione um tipo e pelo menos uma opção',
                life: 3000
            });
            return;
        }
        
        // Verifica se já existe um grupo deste tipo
        const grupoExistenteIndex = gruposAdicionados.findIndex(g => g.tipo === tipoSelecionado.name);
        const opcoesComNegar = opcoesSelecionadas.map(o => ({ ...o }));
        
        if (grupoExistenteIndex >= 0) {
            // Atualiza grupo existente
            const novosGrupos = [...gruposAdicionados];
            novosGrupos[grupoExistenteIndex] = {
                ...novosGrupos[grupoExistenteIndex],
                data: opcoesComNegar,
                opcoes: opcoesComNegar.map(o => o.textoCompleto),
                negar: false
            };
            
            setGruposAdicionados(novosGrupos);
        } else {
            // Cria novo grupo
            const novoGrupo = {
                id: `${tipoSelecionado.name}-${Date.now()}`,
                data: opcoesComNegar,
                tipo: tipoSelecionado.name,
                opcoes: opcoesComNegar.map(o => o.textoCompleto),
                negar: false
            };
            
            setGruposAdicionados([...gruposAdicionados, novoGrupo]);
        }
        
        // Não limpa mais as seleções aqui
        setTipoSelecionado(null);
    };

    const buscarOpcoes = async (tipoCode, tipoObj) => {
        setCarregando(true);
        try {
            const modelInfo = modelosValidos[tipoCode];
            let endpoint = tipoCode;
            
            if (modelInfo?.model?.startsWith('integracao.')) {
                endpoint = `tabela_dominio/${tipoCode.replace(/_/g, '_')}`;
            }
            
            const response = await http.get(`${endpoint}/?format=json`);
            const fieldDesc = modelInfo?.field_desc || 'nome';
            
            // Trata a resposta da tabela_dominio
            const registros = response.registros || response;
            
            const opcoesFormatadas = registros.map(item => ({
                id: item.id,
                name: item[fieldDesc] || item.nome || item.descricao || item.name,
                textoCompleto: item[fieldDesc] || item.nome || item.descricao || item.name
            }));
            setOpcoesDisponiveis(opcoesFormatadas);

            // Encontra o grupo existente do tipo selecionado usando o nome do tipo passado
            const grupoExistente = gruposAdicionados.find(g => g.tipo === tipoObj.name);
            if (grupoExistente && grupoExistente.data) {
                // Seleciona os itens baseado nos IDs do grupo existente
                const itensSelecionados = opcoesFormatadas.filter(opcao => 
                    grupoExistente.data.some(itemGrupo => itemGrupo.id === opcao.id)
                );
                setOpcoesSelecionadas(itensSelecionados);
            } else {
                setOpcoesSelecionadas([]); // Limpa seleções apenas se não houver grupo existente
            }
        } catch (erro) {
            console.error(`Erro ao buscar ${tipoCode}:`, erro);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: `Erro ao carregar opções de ${getTipoNome(tipoCode)}`,
                life: 3000
            });
        } finally {
            setCarregando(false);
        }
    };

    const getTipoNome = (code) => {
        return code.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const handleTipoChange = async (tipo) => {
        if (tipo && tipo.code) {
            setTipoSelecionado(tipo);
            await buscarOpcoes(tipo.code, tipo);
        }
    };

    const handleMultiSelectChange = (e) => {
        if (e.value.length === opcoesDisponiveis.length) {
            setOpcoesSelecionadas(opcoesDisponiveis);
        } else if (opcoesSelecionadas.length === opcoesDisponiveis.length) {
            setOpcoesSelecionadas(e.value);
        } else {
            setOpcoesSelecionadas(e.value);
        }
    };

    const moveItem = (dragIndex, hoverIndex) => {
        const draggedItem = gruposAdicionados[dragIndex];
        const newItems = [...gruposAdicionados];
        newItems.splice(dragIndex, 1);
        newItems.splice(hoverIndex, 0, draggedItem);
        setGruposAdicionados(newItems);
    };
      
    const removerGrupo = (id) => {
        setGruposAdicionados(gruposAdicionados.filter(grupo => grupo.id !== id));
    };
      
    const toggleNegarGrupo = (grupoId) => {
        setGruposAdicionados(grupos =>
            grupos.map(grupo =>
                grupo.id === grupoId
                    ? { ...grupo, negar: !grupo.negar }
                    : grupo
            )
        );
    };

    const salvarGrupos = () => {

        const regra_elegibilidade = gruposAdicionados.map(grupo => {
            const id_delegar = grupo.negar ? [] : grupo.data.map(o => o.id);
            const id_negar = grupo.negar ? grupo.data.map(o => o.id) : [];
            return {
                tipo: grupo.tipo,
                id_delegar: (id_negar.length > 0 && id_delegar.length === 0) ? [0] : id_delegar,
                id_negar
            };
        });
        aoSalvar({regra_elegibilidade, herdado: herdar});
    };

    // Funções para dependentes (duplicadas e adaptadas)
    const adicionarGrupoDependente = () => {
        if (!tipoSelecionadoDependente || (!tipoSelecionadoDependente.name) || opcoesSelecionadasDependente.length === 0) {
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Selecione um tipo e pelo menos uma opção',
                life: 3000
            });
            return;
        }
        
        // Verifica se já existe um grupo deste tipo
        const grupoExistenteIndex = gruposAdicionadosDependente.findIndex(g => g.tipo === tipoSelecionadoDependente.name);
        const opcoesComNegar = opcoesSelecionadasDependente.map(o => ({ ...o }));
        
        if (grupoExistenteIndex >= 0) {
            // Atualiza grupo existente
            const novosGrupos = [...gruposAdicionadosDependente];
            novosGrupos[grupoExistenteIndex] = {
                ...novosGrupos[grupoExistenteIndex],
                data: opcoesComNegar,
                opcoes: opcoesComNegar.map(o => o.textoCompleto),
                negar: false
            };
            
            setGruposAdicionadosDependente(novosGrupos);
        } else {
            // Cria novo grupo
            const novoGrupo = {
                id: `${tipoSelecionadoDependente.name}-${Date.now()}`,
                data: opcoesComNegar,
                tipo: tipoSelecionadoDependente.name,
                opcoes: opcoesComNegar.map(o => o.textoCompleto),
                negar: false
            };
            
            setGruposAdicionadosDependente([...gruposAdicionadosDependente, novoGrupo]);
        }
        
        // Não limpa mais as seleções aqui
        setTipoSelecionadoDependente(null);
    };

    const buscarOpcoesDependente = async (tipoCode, tipoObj) => {
        setCarregandoDependente(true);
        try {
            // Verificar se é um tipo customizado para dependentes
            const tipoCustomizado = tiposDependentes.find(t => t.code === tipoCode);
            
            if (tipoCustomizado) {
                // Usar opções customizadas
                setOpcoesDisponiveisDependente(tipoCustomizado.options);
                
                // Encontra o grupo existente do tipo selecionado
                const grupoExistente = gruposAdicionadosDependente.find(g => g.tipo === tipoObj.name);
                if (grupoExistente && grupoExistente.data) {
                    const itensSelecionados = tipoCustomizado.options.filter(opcao => 
                        grupoExistente.data.some(itemGrupo => itemGrupo.id === opcao.id)
                    );
                    setOpcoesSelecionadasDependente(itensSelecionados);
                } else {
                    setOpcoesSelecionadasDependente([]);
                }
            } else {
                // Usar API para tipos do sistema
                const modelInfo = modelosValidos[tipoCode];
                let endpoint = tipoCode;
                
                if (modelInfo?.model?.startsWith('integracao.')) {
                    endpoint = `tabela_dominio/${tipoCode.replace(/_/g, '_')}`;
                }
                
                const response = await http.get(`${endpoint}/?format=json`);
                const fieldDesc = modelInfo?.field_desc || 'nome';
                
                // Trata a resposta da tabela_dominio
                const registros = response.registros || response;
                
                const opcoesFormatadas = registros.map(item => ({
                    id: item.id,
                    name: item[fieldDesc] || item.nome || item.descricao || item.name,
                    textoCompleto: item[fieldDesc] || item.nome || item.descricao || item.name
                }));
                setOpcoesDisponiveisDependente(opcoesFormatadas);

                // Encontra o grupo existente do tipo selecionado
                const grupoExistente = gruposAdicionadosDependente.find(g => g.tipo === tipoObj.name);
                if (grupoExistente && grupoExistente.data) {
                    const itensSelecionados = opcoesFormatadas.filter(opcao => 
                        grupoExistente.data.some(itemGrupo => itemGrupo.id === opcao.id)
                    );
                    setOpcoesSelecionadasDependente(itensSelecionados);
                } else {
                    setOpcoesSelecionadasDependente([]);
                }
            }
        } catch (erro) {
            console.error(`Erro ao buscar ${tipoCode}:`, erro);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: `Erro ao carregar opções de ${getTipoNome(tipoCode)}`,
                life: 3000
            });
        } finally {
            setCarregandoDependente(false);
        }
    };

    const handleTipoChangeDependente = async (tipo) => {
        if (tipo && tipo.code) {
            setTipoSelecionadoDependente(tipo);
            await buscarOpcoesDependente(tipo.code, tipo);
        }
    };

    const handleMultiSelectChangeDependente = (e) => {
        if (e.value.length === opcoesDisponiveisDependente.length) {
            setOpcoesSelecionadasDependente(opcoesDisponiveisDependente);
        } else if (opcoesSelecionadasDependente.length === opcoesDisponiveisDependente.length) {
            setOpcoesSelecionadasDependente(e.value);
        } else {
            setOpcoesSelecionadasDependente(e.value);
        }
    };

    const moveItemDependente = (dragIndex, hoverIndex) => {
        const draggedItem = gruposAdicionadosDependente[dragIndex];
        const newItems = [...gruposAdicionadosDependente];
        newItems.splice(dragIndex, 1);
        newItems.splice(hoverIndex, 0, draggedItem);
        setGruposAdicionadosDependente(newItems);
    };
      
    const removerGrupoDependente = (id) => {
        setGruposAdicionadosDependente(gruposAdicionadosDependente.filter(grupo => grupo.id !== id));
    };
      
    const toggleNegarGrupoDependente = (grupoId) => {
        setGruposAdicionadosDependente(grupos =>
            grupos.map(grupo =>
                grupo.id === grupoId
                    ? { ...grupo, negar: !grupo.negar }
                    : grupo
            )
        );
    };

    const salvarGruposDependente = () => {
        // Por enquanto não salva nada, apenas mostra mensagem
        toast.current.show({
            severity: 'info',
            summary: 'Info',
            detail: 'Regras de dependentes salvas localmente (não enviadas ao servidor ainda)',
            life: 3000
        });
    };

    const limparRegras = () => {
        setGruposAdicionados([]);
        setTipoSelecionado(null);
        setOpcoesSelecionadas([]);
    };

    const limparRegrasDependente = () => {
        setGruposAdicionadosDependente([]);
        setTipoSelecionadoDependente(null);
        setOpcoesSelecionadasDependente([]);
    };

    // Atualizar os handlers dos switches:
    const handleExtensivelDependenteChange = (novoValor) => {
        setExtensivelDependente(novoValor);
        if (novoValor) {
            setExclusivoDependente(false);
            setActiveIndex(1); // Vai para aba Dependentes
        } else if (!novoValor && !exclusivoDependente) {
            setActiveIndex(0); // Se ambos desmarcados, volta para Colaborador
        }
    };

    const handleExclusivoDependenteChange = (novoValor) => {
        setExclusivoDependente(novoValor);
        if (novoValor) {
            setExtensivelDependente(false);
            setActiveIndex(1); // Vai para aba Dependentes
        } else if (!novoValor && !extensivelDependente) {
            setActiveIndex(0); // Se ambos desmarcados, volta para Colaborador
        }
    };

    return (
        <OverlayRight $opened={opened}>
            <Toast ref={toast} />
            <DialogEstilizadoRight $width="80vw" id="modal-cnpj" open={opened} $opened={opened}>
                <Frame>
                    <Titulo>
                        <BotaoGrupo align="space-between">
                            <h6>Grupos Elegíveis a {item?.descricao ? item?.descricao : 'este item de Contrato'} <small style={{fontSize: 12, color: 'var(--neutro-800)', fontWeight: 400}}>{item?.versao ? `V. ${item?.versao}` : ''}</small></h6>
                        </BotaoGrupo>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <button className="close" onClick={aoFechar} formMethod="dialog">
                                <RiCloseFill size={20} className="fechar" />  
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                                {/* {heranca && heranca.length > 0 && ( */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ fontSize: 14, color: '#666', whiteSpace: 'nowrap' }}>Herdar do Benefício</span>
                                        <SwitchInput checked={herdar} onChange={() => setHerdar(!herdar)} color="var(--primaria)" />
                                    </div>
                                {/* )} */}
                            </div>
                        </div>
                    </Titulo>
                    
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', width: '100%' }}>
                        <div style={{ minWidth: 260, maxWidth: 320, marginRight: 32 }}>
                            <div style={{
                                border: '1px solid #e5e7eb',
                                borderRadius: 8,
                                padding: '16px 20px',
                                background: '#fafbfc',
                                marginBottom: 16,
                                marginTop: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 12,
                            }}>
                                <span style={{ color: '#888', fontWeight: 500, fontSize: 14, marginBottom: 4, letterSpacing: 0.2 }}>Dependentes:</span>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <SwitchInput
                                            checked={extensivelDependente}
                                            onChange={() => handleExtensivelDependenteChange(!extensivelDependente)}
                                            color="var(--primaria)"
                                        />
                                        <span style={{ fontSize: 14, color: '#444' }}>Extensível a dependentes</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <SwitchInput
                                            checked={exclusivoDependente}
                                            onChange={() => handleExclusivoDependenteChange(!exclusivoDependente)}
                                            color="var(--primaria)"
                                        />
                                        <span style={{ fontSize: 14, color: '#444' }}>Exclusivo dependentes</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', borderBottom: '2px solid #e9ecef', marginBottom: 0 }}>
                                <TabButton active={activeIndex === 0} onClick={() => setActiveIndex(0)}>
                                    <Texto color={activeIndex === 0 ? 'white' : '#000'}>Colaborador</Texto>
                                </TabButton>
                                {(extensivelDependente || exclusivoDependente) && (
                                    <TabButton active={activeIndex === 1} onClick={() => setActiveIndex(1)}>
                                        <Texto color={activeIndex === 1 ? 'white' : '#000'}>Dependentes</Texto>
                                    </TabButton>
                                )}
                            </div>
                            {activeIndex === 0 && (
                                <Col12>
                                    <Col6>
                                        <Wrapper style={herdar ? { opacity: 0.5, pointerEvents: 'none', filter: 'grayscale(1)' } : {}}>
                                            <DropdownItens 
                                                valor={tipoSelecionado} 
                                                setValor={handleTipoChange} 
                                                options={tipos} 
                                                label="Tipo de Grupo" 
                                                name="tipo"
                                                placeholder="Selecione o grupo"
                                                optionTemplate={tipoTemplate}
                                                disabled={herdar}
                                            />
                                            
                                            {tipoSelecionado && (
                                                <div style={{ width: '100%' }}>
                                                    <label className={styles.label}>{tipoSelecionado.name}</label>
                                                    <StyledMultiSelect
                                                        value={opcoesSelecionadas}
                                                        onChange={handleMultiSelectChange}
                                                        options={opcoesDisponiveis}
                                                        optionLabel="name"
                                                        filter
                                                        display="chip"
                                                        placeholder={carregando ? "Carregando..." : `Selecione ${tipoSelecionado.name}`}
                                                        disabled={carregando || herdar}
                                                        showSelectAll={true}
                                                        panelClassName={styles.dropdownPanel}
                                                        filterPlaceholder="Buscar..."
                                                        selectedItemsLabel={`${opcoesSelecionadas.length} ${opcoesSelecionadas.length === 1 ? 'item' : 'itens'} selecionados`}
                                                        maxSelectedLabels={3}
                                                    />
                                                </div>
                                            )}
                                            {tipoSelecionado && tipoSelecionado?.name &&
                                            <BotaoGrupo align="end">
                                                <Botao 
                                                    aoClicar={adicionarGrupo}
                                                    estilo="vermillion"
                                                    size="small"
                                                    filled
                                                    disabled={!tipoSelecionado || opcoesSelecionadas.length === 0 || herdar}
                                                >
                                                    {tipoSelecionado && tipoSelecionado?.name &&
                                                        <>
                                                        {gruposAdicionados.some(g => g.tipo === tipoSelecionado.name) 
                                                            ? `Adicionar a ${tipoSelecionado.name.toLowerCase()}` 
                                                            : `Adicionar grupo ${tipoSelecionado.name.toLowerCase()}`}
                                                        <FaArrowRight size={12} />
                                                        </> 
                                                    }
                                                </Botao>
                                            </BotaoGrupo>}
                                            <div style={{
                                                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                                border: '1px solid #cbd5e1',
                                                borderRadius: '8px',
                                                textAlign: 'left',
                                                padding: '16px',
                                                marginTop: '24px',
                                                color: '#475569',
                                                fontSize: '14px',
                                                lineHeight: '1.6',
                                                width: '100%',
                                                boxSizing: 'border-box',
                                                wordWrap: 'break-word',
                                                overflowWrap: 'break-word'
                                            }}>
                                                <strong style={{ color: '#1e293b', fontSize: '15px', display: 'block', marginBottom: '8px' }}>
                                                    Como funciona o botão "Desconsiderar"
                                                </strong>
                                                • <strong>DESATIVADO (padrão):</strong> O grupo <strong>TEM ACESSO</strong> ao item<br />
                                                • <strong>ATIVADO:</strong> O grupo <strong>PERDE O ACESSO</strong> ao item<br /><br />
                                                
                                                <strong>Exemplo prático:</strong><br />
                                                1. Adicione "Filial SP" → todos da filial SP terão acesso<br />
                                                2. Adicione "Estagiários" e ative "Desconsiderar" → estagiários perdem o acesso<br />
                                                3. <strong>Resultado:</strong> todos da Filial SP têm acesso, <u>exceto os estagiários</u>
                                            </div>
                                        </Wrapper>
                                    </Col6>
                                    <Col6>
                                        <div style={herdar ? { opacity: 0.5, pointerEvents: 'none', filter: 'grayscale(1)' } : {}}>
                                            <DndProvider backend={HTML5Backend}>
                                                <ContainerGrupos>
                                                    {gruposAdicionados.length > 0 ? (
                                                        <>
                                                            {gruposAdicionados.map((grupo, index) => (
                                                                <DraggableItem
                                                                    key={grupo.id}
                                                                    grupo={grupo}
                                                                    index={index}
                                                                    moveItem={moveItem}
                                                                    removerGrupo={removerGrupo}
                                                                    toggleNegarGrupo={toggleNegarGrupo}
                                                                />
                                                            ))}
                                                        </>
                                                    ) : (
                                                        <div style={{
                                                            textAlign: 'center',
                                                            padding: '20px',
                                                            color: '#9e9e9e',
                                                            fontStyle: 'italic'
                                                        }}>
                                                            Nenhum grupo adicionado ainda
                                                        </div>
                                                    )}
                                                </ContainerGrupos>
                                            </DndProvider>
                                        </div>
                                    </Col6>
                                </Col12>
                            )}
                            {activeIndex === 1 && (extensivelDependente || exclusivoDependente) && (
                                <Col12>
                                    <Col6>
                                        <Wrapper>
                                            <DropdownItens 
                                                valor={tipoSelecionadoDependente} 
                                                setValor={handleTipoChangeDependente} 
                                                options={tiposDependentes} 
                                                label="Tipo de Grupo" 
                                                name="tipo_dependente"
                                                placeholder="Selecione o grupo"
                                                optionTemplate={tipoTemplate}
                                            />
                                            
                                            {tipoSelecionadoDependente && (
                                                <div style={{ width: '100%' }}>
                                                    <label className={styles.label}>{tipoSelecionadoDependente.name}</label>
                                                    <StyledMultiSelect
                                                        value={opcoesSelecionadasDependente}
                                                        onChange={handleMultiSelectChangeDependente}
                                                        options={opcoesDisponiveisDependente}
                                                        optionLabel="name"
                                                        filter
                                                        display="chip"
                                                        placeholder={carregandoDependente ? "Carregando..." : `Selecione ${tipoSelecionadoDependente.name}`}
                                                        disabled={carregandoDependente}
                                                        showSelectAll={true}
                                                        panelClassName={styles.dropdownPanel}
                                                        filterPlaceholder="Buscar..."
                                                        selectedItemsLabel={`${opcoesSelecionadasDependente.length} ${opcoesSelecionadasDependente.length === 1 ? 'item' : 'itens'} selecionados`}
                                                        maxSelectedLabels={3}
                                                    />
                                                </div>
                                            )}
                                            {tipoSelecionadoDependente && tipoSelecionadoDependente?.name &&
                                            <BotaoGrupo align="end">
                                                <Botao 
                                                    aoClicar={adicionarGrupoDependente}
                                                    estilo="vermillion"
                                                    size="small"
                                                    filled
                                                    disabled={!tipoSelecionadoDependente || opcoesSelecionadasDependente.length === 0}
                                                >
                                                    {tipoSelecionadoDependente && tipoSelecionadoDependente?.name &&
                                                        <>
                                                        {gruposAdicionadosDependente.some(g => g.tipo === tipoSelecionadoDependente.name) 
                                                            ? `Adicionar a ${tipoSelecionadoDependente.name.toLowerCase()}` 
                                                            : `Adicionar grupo ${tipoSelecionadoDependente.name.toLowerCase()}`}
                                                        <FaArrowRight size={12} />
                                                        </> 
                                                    }
                                                </Botao>
                                            </BotaoGrupo>}
                                            <div style={{
                                                background: 'linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%)',
                                                border: '1px solid #93c5fd',
                                                borderRadius: '8px',
                                                textAlign: 'left',
                                                padding: '16px',
                                                marginTop: '24px',
                                                color: '#1e40af',
                                                fontSize: '14px',
                                                lineHeight: '1.6',
                                                width: '100%',
                                                boxSizing: 'border-box',
                                                wordWrap: 'break-word',
                                                overflowWrap: 'break-word'
                                            }}>
                                                <strong>Exemplo:</strong><br />
                                                1. Adicione "Cônjuge" → todos os cônjuges terão acesso<br />
                                                2. Adicione "Filho(a)" → todos os filhos terão acesso<br />
                                                3. Use "Desconsiderar" para excluir grupos específicos
                                            </div>
                                        </Wrapper>
                                    </Col6>
                                    <Col6>
                                        <DndProvider backend={HTML5Backend}>
                                            <ContainerGrupos>
                                                {gruposAdicionadosDependente.length > 0 ? (
                                                    <>
                                                        {gruposAdicionadosDependente.map((grupo, index) => (
                                                            <DraggableItem
                                                                key={grupo.id}
                                                                grupo={grupo}
                                                                index={index}
                                                                moveItem={moveItemDependente}
                                                                removerGrupo={removerGrupoDependente}
                                                                toggleNegarGrupo={toggleNegarGrupoDependente}
                                                            />
                                                        ))}
                                                    </>
                                                ) : (
                                                    <div style={{
                                                        textAlign: 'center',
                                                        padding: '20px',
                                                        color: '#9e9e9e',
                                                        fontStyle: 'italic'
                                                    }}>
                                                        Nenhum grupo de dependentes adicionado ainda
                                                    </div>
                                                )}
                                            </ContainerGrupos>
                                        </DndProvider>
                                    </Col6>
                                </Col12>
                            )}
                        </div>
                    </div>
                </Frame>
                <div style={{width: '100%'}}>
                    <BotaoGrupo align="end" gap="12px">
                        <Botao 
                            size="small" 
                            estilo="neutro"
                            aoClicar={aoFechar}
                            disabled={activeIndex === 0 && herdar}
                        >
                            Descartar Alterações
                        </Botao>
                        {activeIndex === 0 && !herdar &&
                            <Botao 
                                aoClicar={limparRegras}
                                estilo="neutro"
                                size="small"
                                disabled={herdar}
                            >
                                Limpar Regras
                            </Botao>
                        }
                        {activeIndex === 1 &&
                            <Botao 
                                aoClicar={limparRegrasDependente}
                                estilo="neutro"
                                size="small"
                            >
                                Limpar Regras
                            </Botao>
                        }
                        <Botao 
                            size="small" 
                            aoClicar={activeIndex === 0 ? salvarGrupos : salvarGruposDependente}
                        >
                            Salvar
                        </Botao>
                    </BotaoGrupo>
                </div>
            </DialogEstilizadoRight>
        </OverlayRight>
    );
}

export default ModalAdicionarElegibilidadeBeneficioContrato;