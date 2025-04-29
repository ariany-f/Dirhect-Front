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
import { Toast } from "primereact/toast"
import { OverlayRight, DialogEstilizadoRight } from '@components/Modal/styles'

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
                     {grupo.opcoes.map((opcao, i) => {
                        const textoLimitado = opcao.length > 50 
                            ? `${opcao.substring(0, 47)}...` 
                            : opcao;
                       
                        return (
                            <span 
                                key={i} 
                                style={{
                                    backgroundColor: '#f5f5f5',
                                    padding: '4px 12px',
                                    borderRadius: '16px',
                                    fontSize: '13px',
                                    color: '#424242',
                                    maxWidth: '200px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                                title={opcao} // Mostra o texto completo no hover
                            >
                                {textoLimitado}
                            </span>
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

function ModalAdicionarElegibilidadeItemContrato({ opened = false, aoFechar, aoSalvar, item }) {

    const { usuario } = useSessaoUsuarioContext();
    
    const [tipoSelecionado, setTipoSelecionado] = useState(null);
    const [opcoesDisponiveis, setOpcoesDisponiveis] = useState([]);
    const [opcoesSelecionadas, setOpcoesSelecionadas] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [gruposAdicionados, setGruposAdicionados] = useState([]);
    const toast = useRef(null);
    
    const tipos = [
        {code: 'filial', name: 'Filial'},
        {code: 'departamento', name: 'Departamento'},
        {code: 'secao', name: 'Seção'},
        {code: 'centro_custo', name: 'Centro de Custo'},
        {code: 'cargo', name: 'Cargo'},
        {code: 'funcao', name: 'Função'},
        {code: 'sindicato', name: 'Sindicato'},
        {code: 'horario', name: 'Horário'}
    ];

    // Adicione este useEffect no componente ModalAdicionarElegibilidadeItemContrato
    useEffect(() => {
        if (opened && item?.regra_elegibilidade) {
            carregarGruposExistentes(item.regra_elegibilidade);
        } else if (!opened) {
            // Limpa os grupos quando o modal fecha
            setGruposAdicionados([]);
        }
    }, [opened, item]);

    // Função para carregar os grupos existentes
    const carregarGruposExistentes = async (regras) => {
        if (!regras || regras.length === 0) return;
    
        const novosGrupos = [];
        
        // Mapeamento entre chaves do objeto e tipos
        const tiposMapeados = {
            filial: 'Filial',
            departamento: 'Departamento',
            secao: 'Seção',
            centro_custo: 'Centro de Custo',
            cargo: 'Cargo',
            funcao: 'Função',
            sindicato: 'Sindicato',
            horario: 'Horário'
        };
    
        // Para cada regra no array regra_elegibilidade
        for (const regra of regras) {
            // Para cada tipo possível no objeto regra
            for (const [tipoNoObjeto, tipoNome] of Object.entries(tiposMapeados)) {
                if (regra[tipoNoObjeto] && Array.isArray(regra[tipoNoObjeto].id)) {
                    try {
                        // Determina o endpoint da API (singular)
                        const endpoint = tipoNoObjeto.endsWith('s') ? 
                            tipoNoObjeto.substring(0, tipoNoObjeto.length - 1) : 
                            tipoNoObjeto;
                        
                        // Busca os dados completos
                        const response = await http.get(`${endpoint}/?format=json`);
                        
                        // Filtra apenas os itens que estão na regra
                        const itensFiltrados = response.filter(item => 
                            regra[tipoNoObjeto].id.includes(item.id)
                        );
    
                        if (itensFiltrados.length > 0) {
                            // Formata os dados
                            const opcoesFormatadas = itensFiltrados.map(item => {
                                const textoCompleto = item.nome || item.descricao || item.name;
                                return {
                                    id: item.id,
                                    name: textoCompleto.length > 50 
                                        ? `${textoCompleto.substring(0, 47)}...` 
                                        : textoCompleto,
                                    textoCompleto: textoCompleto
                                };
                            });
    
                            // Adiciona o grupo
                            novosGrupos.push({
                                id: `${tipoNome}-${Date.now()}`,
                                data: opcoesFormatadas,
                                tipo: tipoNome,
                                opcoes: opcoesFormatadas.map(o => o.textoCompleto),
                                indexOriginal: regra[tipoNoObjeto].index || 0
                            });
                        }
                    } catch (erro) {
                        console.error(`Erro ao carregar ${tipoNoObjeto}:`, erro);
                    }
                }
            }
        }
    
        // Ordena mantendo a ordem original
        novosGrupos.sort((a, b) => a.indexOriginal - b.indexOriginal);
        setGruposAdicionados(novosGrupos);
    };

    const buscarOpcoes = async (tipo) => {
        setCarregando(true);
        try {
            const response = await http.get(`${tipo.toLowerCase()}/?format=json`);
            const opcoesFormatadas = response.map(item => {
                const textoCompleto = item.nome || item.descricao || item.name;
                const textoLimitado = textoCompleto.length > 50 
                    ? `${textoCompleto.substring(0, 47)}...` 
                    : textoCompleto;
                
                return {
                    id: item.id,
                    name: textoLimitado,
                    textoCompleto: textoCompleto,
                };
            });
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
                id: `${tipoSelecionado.name}-${Date.now()}`,
                data: opcoesSelecionadas,
                tipo: tipoSelecionado.name,
                opcoes: opcoesSelecionadas.map(o => o.textoCompleto)
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
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Adicione pelo menos um grupo antes de salvar',
                life: 3000
            });
            return;
        }
        
        aoSalvar(gruposAdicionados);
    };

    const handleTipoChange = async (tipo) => {
        setTipoSelecionado(tipo);
        setOpcoesSelecionadas([]);
        await buscarOpcoes(tipo.code);
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
        <OverlayRight $opened={opened}>
            <Toast ref={toast} />
            <DialogEstilizadoRight id="modal-cnpj" open={opened} $opened={opened}>
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
                                        <label className={styles.label}>{tipoSelecionado.name}</label>
                                        <StyledMultiSelect
                                            value={opcoesSelecionadas}
                                            onChange={handleMultiSelectChange}
                                            options={opcoesDisponiveis}
                                            optionLabel="name"
                                            filter
                                            display="chip"
                                            placeholder={carregando ? "Carregando..." : `Selecione ${tipoSelecionado.name}`}
                                            disabled={carregando}
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
                                        disabled={!tipoSelecionado || opcoesSelecionadas.length === 0}
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
            </DialogEstilizadoRight>
        </OverlayRight>
    );
}

export default ModalAdicionarElegibilidadeItemContrato;