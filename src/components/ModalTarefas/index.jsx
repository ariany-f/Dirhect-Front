import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import CheckboxContainer from '@components/CheckboxContainer'
import DropdownItens from "@components/DropdownItens"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import { RiCloseFill } from 'react-icons/ri'
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import styles from './ModalTarefas.module.css'
import { Overlay, DialogEstilizado } from '@components/Modal/styles'

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    gap: 16px;
    padding: 16px 0;
`

const Col8 = styled.div`
    flex: 0 0 65.66%; /* Corrigido para ocupar exatamente 8/12 do espaço */
    max-width: 65.66%;
`

const Col6 = styled.div`
    flex: 0 0 49%;
    max-width: 49%;
`

const Col6Centered = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 0 0 49%;
    max-width: 49%;
`

const Col4 = styled.div`
    flex: 0 0 32.33%; /* Corrigido para ocupar exatamente 4/12 do espaço */
    max-width: 32.33%;
`

const Col4Centered = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 0 0 32.33%;
    max-width: 32.33%;
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;
`;

const Item = styled.div`
    cursor: pointer;
    border-width: 1px;
    border-style: solid;
    border-radius: 16px;
    display: flex;
    padding: 20px;
    justify-content: space-between;
    align-items: center;
    width: 94%;
    border-color: ${ props => props.$active ? 'var(--primaria)' : 'var(--neutro-200)' };
`;

const tiposRecorrencia = [
    {
        nome: 'Diário',
        valor: 'diario'
    },
    {
        nome: 'Semanal',
        valor: 'semanal'
    },
    {
        nome: 'Mensal',
        valor: 'mensal'
    },
    {
        nome: 'Anual',
        valor: 'anual'
    }
]    

function ModalTarefas({ opened = false, aoClicar, aoFechar, aoSucesso, aoSalvar, colaborador = null }) {
    const [classError, setClassError] = useState([])
    const [nome, setNome] = useState('');
    const [recorrente, setRecorrente] = useState(false);
    const [tipoRecorrencia, setTipoRecorrencia] = useState('');
    const [tiposDisponiveis, setDisponiveis] = useState([]);

    const navegar = useNavigate()
    
    useEffect(() =>{
        setDisponiveis((estadoAnterior) => {
            const novosTipos = tiposRecorrencia.map((item) => ({
                name: item.nome,
                code: item.valor
            }));
            return [...estadoAnterior, ...novosTipos];
        });
    }, [tiposRecorrencia])

    return(
        <>
            {opened &&
            <>
                <Overlay>
                    <DialogEstilizado open={opened}>
                        <Frame>
                            <Titulo>
                                <button className="close" onClick={aoFechar}>
                                    <RiCloseFill size={20} className="fechar" />  
                                </button>
                                <h6>Criação de Tarefa</h6>
                            </Titulo>
                        </Frame>
                        
                        <Frame padding="12px 0px">
                            <Col12>
                                <Col8>
                                    <CampoTexto
                                        camposVazios={classError}
                                        name="nome"
                                        valor={nome}
                                        setValor={setNome}
                                        type="text"
                                        label="Nome da Tarefa"
                                        placeholder="Nome da Tarefa"
                                    />
                                </Col8>
                                <Col4Centered>
                                    <CheckboxContainer fontSize="16px" name="recorrente" valor={recorrente} setValor={() => setRecorrente(!recorrente)} label="Recorrente"/>
                                </Col4Centered>
                            </Col12>
                            <Col12>
                                {recorrente &&
                                <Col6>
                                    <DropdownItens camposVazios={classError} valor={tipoRecorrencia} setValor={setTipoRecorrencia} options={tiposDisponiveis} label="Tipo de Recorrência" name="recorrente_tipo" placeholder="Tipo de Recorrência" />
                                </Col6>
                                }
                            </Col12>
                        </Frame>
                        <div className={styles.containerBottom}>
                            <Botao
                                aoClicar={aoFechar} 
                                estilo="neutro" 
                                size="medium" 
                                filled
                            >
                                Cancelar
                            </Botao>
                            <Botao
                                aoClicar={() => aoSalvar()} 
                                estilo="vermilion" 
                                size="medium" 
                                filled
                            >
                                Confirmar
                            </Botao>
                        </div>
                    </DialogEstilizado>
                </Overlay>
            </>
            }
        </>
    )
}

export default ModalTarefas