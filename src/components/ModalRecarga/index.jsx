import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import { RiCloseFill } from 'react-icons/ri'
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import styles from './ModalRecarga.module.css'
import http from '@http';
import { Overlay, DialogEstilizado } from '@components/Modal/styles'

const AdicionarCnpjBotao = styled.div`
    font-size: 14px;
    font-weight: 700;
    color: var(--primaria);
    padding: 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
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

function ModalRecarga({ opened = false, aoClicar, aoFechar }) {
    const [nome, setNome] = useState('')
    const [classError, setClassError] = useState([])

    const navegar = useNavigate()
  
    function abrirSelecaoBeneficio() {
        aoClicar(nome)
    }

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
                                <h6>Detalhes da transferência</h6>
                                <SubTitulo>
                                    Dê um nome para essa transferência:
                                </SubTitulo>
                            </Titulo>
                        </Frame>
                        
                        <Frame padding="24px 0px">
                            <CampoTexto 
                                numeroCaracteres={50}
                                camposVazios={classError} 
                                valor={nome} 
                                type="text" 
                                setValor={setNome} 
                                placeholder="ex. Pagamento de Janeiro"
                                label="Nome da transferência" 
                            />
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
                                aoClicar={abrirSelecaoBeneficio} 
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

export default ModalRecarga