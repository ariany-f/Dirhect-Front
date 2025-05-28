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
import { FaArrowRight } from "react-icons/fa"
import { Toast } from "primereact/toast"
import { OverlayRight, DialogEstilizadoRight } from '@components/Modal/styles'
import SwitchInput from '@components/SwitchInput'
import { TbTableOptions  } from "react-icons/tb"

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
    margin-top: 16px;
`;

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 16px;
    width: 100%;
`;

const Col6 = styled.div`
    flex: 1 1 calc(50% - 8px);
    max-width: calc(50% - 8px);
    max-height: 75vh;
    overflow-y: auto;
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
        color: black;
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

const ContainerGrupos = styled.div`
    width: 100%;
    margin-bottom: 24px;
    overflow-y: auto;
    padding: 24px 12px;
    border-radius: 8px;
`;

function ModalAdicionarElegibilidadeBeneficioContrato({ opened = false, aoFechar, aoSalvar, item }) {

    const { usuario } = useSessaoUsuarioContext();
    
    const [tipoSelecionado, setTipoSelecionado] = useState(null);
    const [opcoesDisponiveis, setOpcoesDisponiveis] = useState([]);
    const [opcoesSelecionadas, setOpcoesSelecionadas] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [gruposAdicionados, setGruposAdicionados] = useState([]);
    const [modelosValidos, setModelosValidos] = useState({});
    const toast = useRef(null);
    const [herdar, setHerdar] = useState(false);
    
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
            console.log(item?.regra_elegibilidade);
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
        }
    }, [opened]);

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

    const limparRegras = () => {
        setGruposAdicionados([]);
        setTipoSelecionado(null);
        setOpcoesSelecionadas([]);
    };

    return (
        <OverlayRight $opened={opened}>
            <Toast ref={toast} />
            <DialogEstilizadoRight id="modal-cnpj" open={opened} $opened={opened}>
                <Frame>
                    <Titulo>
                        <BotaoGrupo align="space-between">
                            <h6>Grupos Elegíveis a {item?.descricao ? item?.descricao : 'este item de Contrato'}</h6>
                        </BotaoGrupo>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <button className="close" onClick={aoFechar} formMethod="dialog">
                                <RiCloseFill size={20} className="fechar" />  
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <span style={{ fontSize: 14, color: '#888' }}>Herdar do Benefício</span>
                                <SwitchInput checked={herdar} onChange={() => setHerdar(!herdar)} color="var(--primaria)" />
                            </div>
                        </div>
                    </Titulo>
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
                </Frame>
                <div style={{width: '100%'}}>
                    <BotaoGrupo align="end" gap="12px">
                        <Botao 
                            size="small" 
                            estilo="neutro"
                            aoClicar={aoFechar}
                            disabled={herdar}
                        >
                            Descartar Alterações
                        </Botao>
                        {!herdar &&
                            <Botao 
                                aoClicar={limparRegras}
                                estilo="neutro"
                                size="small"
                                disabled={herdar}
                            >
                                Limpar Regras
                            </Botao>
                        }
                        <Botao 
                            size="small" 
                            aoClicar={salvarGrupos}
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