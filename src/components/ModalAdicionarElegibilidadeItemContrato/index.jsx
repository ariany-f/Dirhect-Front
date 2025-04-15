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
import { RiCloseFill, RiDraggable } from "react-icons/ri"
import { TfiSave } from "react-icons/tfi";
import { GrAddCircle } from "react-icons/gr"
import { MdArrowRight } from "react-icons/md"
import { FaArrowRight } from "react-icons/fa"

// Componente de Item Arrastável com novos estilos
const DraggableItem = ({ grupo, index, moveItem, removerGrupo }) => {
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
                    {grupo.tipo}
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
                    {grupo.opcoes.map((opcao, i) => (
                        <span 
                            key={i} 
                            style={{
                                backgroundColor: '#f5f5f5',
                                padding: '4px 12px',
                                borderRadius: '16px',
                                fontSize: '13px',
                                color: '#424242'
                            }}
                        >
                            {opcao}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Estilos originais mantidos
const Overlay = styled.div`
    background-color: rgba(0,0,0,0.50);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: ${props => props.$opened ? 1 : 0};
    transition: visibility 0.5s ease-in-out;
    visibility: ${props => props.$opened ? 'visible' : 'hidden'};
    pointer-events: ${props => props.$opened ? 'all' : 'none'};
`

const DialogEstilizado = styled.dialog`
    display: flex;
    width: 70vw;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
    border: none;
    top: 3vh;
    left: ${props => props.$opened ? '29vw' : '100vw'};
    height: 94vh;
    padding: 24px;
    transition: left 0.3s ease-in-out;
    background: white;
    & button.close {
        & .fechar {
            box-sizing: initial;
            fill: var(--primaria);
            stroke: var(--primaria);
            color: var(--primaria);
        }
        position: absolute;
        right: 20px;
        top: 20px;
        cursor: pointer;
        border: none;
        background-color: initial;
    }
    
    & .icon {
        margin-right: 5px;
        box-sizing: initial;
        fill: var(--primaria);
        stroke: var(--primaria);
        color: var(--primaria);
    }
`

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

function ModalAdicionarElegibilidadeItemContrato({ opened = false, aoFechar, aoSalvar }) {
    const { usuario } = useSessaoUsuarioContext();
    
    const [tipoSelecionado, setTipoSelecionado] = useState(null);
    const [opcoesDisponiveis, setOpcoesDisponiveis] = useState([]);
    const [opcoesSelecionadas, setOpcoesSelecionadas] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [gruposAdicionados, setGruposAdicionados] = useState([]);
    
    const tipos = [
        'Filial',
        'Departamento',
        'Seção',
        'Centro de Custo',
        'Cargo',
        'Função',
        'Sindicato',
        'Horário'
    ];

    const buscarOpcoes = async (tipo) => {
        setCarregando(true);
        try {
            const response = await http.get(`${tipo.toLowerCase()}/?format=json`);
            const opcoesFormatadas = response.map(item => ({
                id: item.id,
                name: item.nome || item.descricao || item.name
            }));
            setOpcoesDisponiveis(opcoesFormatadas);
        } catch (erro) {
            console.error(`Erro ao buscar ${tipo}:`, erro);
        } finally {
            setCarregando(false);
        }
    };

    const moveItem = (dragIndex, hoverIndex) => {
        const draggedItem = gruposAdicionados[dragIndex];
        const newItems = [...gruposAdicionados];
        newItems.splice(dragIndex, 1);
        newItems.splice(hoverIndex, 0, draggedItem);
        setGruposAdicionados(newItems);
    };
      
    const adicionarGrupo = () => {
        if (!tipoSelecionado || opcoesSelecionadas.length === 0) {
            alert('Selecione um tipo e pelo menos uma opção');
            return;
        }
        
        // Verifica se já existe um grupo deste tipo
        const grupoExistenteIndex = gruposAdicionados.findIndex(g => g.tipo === tipoSelecionado);
        
        if (grupoExistenteIndex >= 0) {
            // Atualiza grupo existente
            const novosGrupos = [...gruposAdicionados];
            const novasOpcoes = [...new Set([
                ...novosGrupos[grupoExistenteIndex].opcoes,
                ...opcoesSelecionadas.map(o => o.name)
            ])];
            
            novosGrupos[grupoExistenteIndex] = {
                ...novosGrupos[grupoExistenteIndex],
                opcoes: novasOpcoes
            };
            
            setGruposAdicionados(novosGrupos);
        } else {
            // Cria novo grupo
            const novoGrupo = {
                id: `${tipoSelecionado}-${Date.now()}`,
                tipo: tipoSelecionado,
                opcoes: opcoesSelecionadas.map(o => o.name)
            };
            
            setGruposAdicionados([...gruposAdicionados, novoGrupo]);
        }
        
        setOpcoesSelecionadas([]);
    };
      
    const removerGrupo = (id) => {
        setGruposAdicionados(gruposAdicionados.filter(grupo => grupo.id !== id));
    };
      
    const salvarGrupos = () => {
        if (gruposAdicionados.length === 0) {
            alert('Adicione pelo menos um grupo antes de salvar');
            return;
        }
        
        aoSalvar(gruposAdicionados);
    };

    const handleTipoChange = async (tipo) => {
        setTipoSelecionado(tipo);
        setOpcoesSelecionadas([]);
        await buscarOpcoes(tipo);
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

    return (
        <Overlay $opened={opened}>
            <DialogEstilizado id="modal-cnpj" open={opened} $opened={opened}>
                <Frame>
                    <Titulo>
                        <button className="close" onClick={aoFechar} formMethod="dialog">
                            <RiCloseFill size={20} className="fechar" />  
                        </button>
                        <BotaoGrupo align="space-between">
                            <h6>Grupos Elegíveis a este item de Contrato</h6>
                        </BotaoGrupo>
                    </Titulo>
                    <Col12>
                        <Col6>
                            <Wrapper>
                                <DropdownItens 
                                    valor={tipoSelecionado} 
                                    setValor={handleTipoChange} 
                                    options={tipos} 
                                    label="Tipo de Grupo" 
                                    name="tipo"
                                    placeholder="Selecione o grupo"
                                />
                                
                                {tipoSelecionado && (
                                    <div style={{ width: '100%' }}>
                                        <label className={styles.label}>{tipoSelecionado}</label>
                                        <StyledMultiSelect
                                            value={opcoesSelecionadas}
                                            onChange={handleMultiSelectChange}
                                            options={opcoesDisponiveis}
                                            optionLabel="name"
                                            filter
                                            display="chip"
                                            placeholder={carregando ? "Carregando..." : `Selecione ${tipoSelecionado}`}
                                            disabled={carregando}
                                            showSelectAll={true}
                                            panelClassName={styles.dropdownPanel}
                                            filterPlaceholder="Buscar..."
                                            selectedItemsLabel={`${opcoesSelecionadas.length} ${opcoesSelecionadas.length === 1 ? 'item' : 'itens'} selecionados`}
                                            maxSelectedLabels={3}
                                        />
                                    </div>
                                )}
                                <BotaoGrupo align="end">
                                    <Botao 
                                        aoClicar={adicionarGrupo}
                                        estilo="vermillion"
                                        size="small"
                                        filled
                                        disabled={!tipoSelecionado || opcoesSelecionadas.length === 0}
                                    >
                                        {tipoSelecionado &&
                                            <>
                                            {gruposAdicionados.some(g => g.tipo === tipoSelecionado) 
                                                ? `Adicionar a ${tipoSelecionado.toLowerCase()}` 
                                                : `Adicionar grupo ${tipoSelecionado.toLowerCase()}`}
                                            <FaArrowRight size={12} />
                                            </> 
                                        }
                                    </Botao>
                                </BotaoGrupo>
                            </Wrapper>
                        </Col6>
                        <Col6>
                            <DndProvider backend={HTML5Backend}>
                                <ContainerGrupos>
                                    {gruposAdicionados.length > 0 ? (
                                        gruposAdicionados.map((grupo, index) => (
                                            <DraggableItem
                                                key={grupo.id}
                                                grupo={grupo}
                                                index={index}
                                                moveItem={moveItem}
                                                removerGrupo={removerGrupo}
                                            />
                                        ))
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
                        </Col6>
                    </Col12>
                </Frame>
                <div style={{width: '100%'}}>
                    <BotaoGrupo align="end">
                        <Botao size="medium" aoClicar={salvarGrupos}>Salvar</Botao>
                    </BotaoGrupo>
                </div>
            </DialogEstilizado>
        </Overlay>
    );
}

export default ModalAdicionarElegibilidadeItemContrato;