import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Titulo from "@components/Titulo"
import DropdownItens from "@components/DropdownItens"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import http from "@http"
import { MultiSelect } from 'primereact/multiselect'
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"
import styles from './ModalAdicionarElegibilidadeItemContrato.module.css'
import { ArmazenadorToken } from "@utils"

const Overlay = styled.div`
    background-color: rgba(0,0,0,0.50);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: ${props => props.$opened ? 1 : 0};
    pointer-events: ${props => props.$opened ? 'all' : 'none'};
`

const DialogEstilizado = styled.dialog`
    display: flex;
    width: 40vw;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
    border: none;
    top: 2vh;
    left: ${props => props.$opened ? '59vw' : '100vw'};
    height: 96vh;
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
    align-items: flex-start;
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
        background: var(--primaria);
        color: white;
        border-radius: 12px;
        padding: 2px 8px;
        margin-right: 4px;
    }

    & .p-multiselect-token-icon {
        margin-left: 4px;
    }
`;


function ModalAdicionarElegibilidadeItemContrato({ opened = false, aoFechar, aoSalvar }) {
    const { usuario } = useSessaoUsuarioContext();
    
    // Estados para o fluxo de dropdowns
    const [tipoSelecionado, setTipoSelecionado] = useState(null);
    const [opcoesDisponiveis, setOpcoesDisponiveis] = useState([]);
    const [opcoesSelecionadas, setOpcoesSelecionadas] = useState([]);
    const [carregando, setCarregando] = useState(false);
    
    // Opções para o primeiro dropdown
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

    // Função para buscar opções
    const buscarOpcoes = async (tipo) => {
        setCarregando(true);
        try {
            const response = await http.get(`${tipo.toLowerCase()}/?format=json`);
            
            // Transforma a resposta da API no formato esperado pelo MultiSelect
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

    const handleTipoChange = async (tipo) => {
        setTipoSelecionado(tipo);
        setOpcoesSelecionadas([]);
        await buscarOpcoes(tipo);
    };

    const handleMultiSelectChange = (e) => {
        // Se o usuário selecionou "Marcar todos" no cabeçalho
        if (e.value.length === opcoesDisponiveis.length) {
            setOpcoesSelecionadas(opcoesDisponiveis);
        } 
        // Se o usuário desmarcou um item (não está mais com todos selecionados)
        else if (opcoesSelecionadas.length === opcoesDisponiveis.length) {
            setOpcoesSelecionadas(e.value);
        }
        // Seleção normal
        else {
            setOpcoesSelecionadas(e.value);
        }
    };

    const handleSalvar = () => {
        if (!tipoSelecionado) {
            alert('Selecione um tipo primeiro');
            return;
        }
        
        // Verifica se todos os itens estão selecionados
        const todosSelecionados = opcoesSelecionadas.length === opcoesDisponiveis.length;
        
        aoSalvar({
            tipo: tipoSelecionado,
            opcoes: todosSelecionados 
                ? opcoesDisponiveis.map(op => op.name) // Envia todos os nomes
                : opcoesSelecionadas.map(op => op.name)
        });
    };

    return (
        <Overlay $opened={opened}>
            <DialogEstilizado id="modal-cnpj" open={opened} $opened={opened}>
                <Frame>
                    <Titulo>
                        <h6>Grupos de Elegibilidade</h6>
                    </Titulo>
                    
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
                            <div style={{ width: '100%' }} className={styles.noSearch}>
                                <label className={styles.label}>{tipoSelecionado}</label>
                                <StyledMultiSelect
                                    value={opcoesSelecionadas}
                                    onChange={handleMultiSelectChange}
                                    options={opcoesDisponiveis}
                                    optionLabel="name"
                                    filter
                                    placeholder={carregando ? "Carregando..." : `Selecione ${tipoSelecionado}`}
                                    disabled={carregando}
                                    showSelectAll={true} // Mostra opção "Selecionar todos" no cabeçalho
                                    panelClassName={styles.dropdownPanel}
                                    filterPlaceholder="Buscar..."
                                    selectedItemsLabel={`${opcoesSelecionadas.length} ${opcoesSelecionadas.length === 1 ? 'item' : 'itens'} selecionados`}
                                    maxSelectedLabels={3}
                                />
                            </div>
                        )}
                    </Wrapper>
                </Frame>
                
                <form method="dialog">
                    <div className={styles.containerBottom}>
                        <Botao aoClicar={aoFechar} estilo="neutro" size="medium" filled>
                            Cancelar
                        </Botao>
                        <Botao aoClicar={handleSalvar} estilo="vermilion" size="medium" filled>
                            Adicionar
                        </Botao>
                    </div>
                </form>
            </DialogEstilizado>
        </Overlay>
    );
}

export default ModalAdicionarElegibilidadeItemContrato;