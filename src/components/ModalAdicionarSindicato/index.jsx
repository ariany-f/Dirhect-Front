import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import { RiCloseFill } from 'react-icons/ri'
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import styles from './ModalAdicionarSindicato.module.css'
import { useDepartamentoContext } from "@contexts/Departamento"
import { Overlay, DialogEstilizado } from '@components/Modal/styles';

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

function ModalAdicionarSindicato({ opened = false, aoClicar, aoFechar, aoSucesso, aoSalvar }) {

    const [classError, setClassError] = useState([])
    const [cnpj, setCnpj] = useState('')
    const [descricao, setDescricao] = useState('')
    const [codigo, setCodigo] = useState('')

    const navegar = useNavigate()

    return(
        <>
            {opened &&
            <>
                <Overlay>
                    <DialogEstilizado id="modal-add-departamento" open={opened}>
                        <Frame>
                            <Titulo>
                                <form method="dialog">
                                    <button className="close" onClick={aoFechar} formMethod="dialog">
                                        <RiCloseFill size={20} className="fechar" />  
                                    </button>
                                </form>
                                <h6>Criar sindicato</h6>
                            </Titulo>
                        </Frame>
                        
                        <Frame padding="24px 0px">
                            <CampoTexto 
                                numeroCaracteres={4}
                                camposVazios={classError} 
                                valor={codigo} 
                                type="text" 
                                setValor={setCodigo} 
                                placeholder=""
                                label="Código do Sindicato" 
                                />
                            <CampoTexto 
                                numeroCaracteres={18}
                                camposVazios={classError} 
                                patternMask={['99.999.999/9999-99']} 
                                valor={cnpj} 
                                type="text" 
                                setValor={setCnpj} 
                                placeholder=""
                                label="CNPJ do Sindicato" 
                            />
                            <CampoTexto 
                                camposVazios={classError} 
                                valor={descricao} 
                                type="text" 
                                setValor={setDescricao} 
                                placeholder=""
                                label="Descrição do sindicato" 
                                />
                        </Frame>
                        <form method="dialog">
                            <div className={styles.containerBottom}>
                                <Botao aoClicar={aoFechar} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
                                <Botao aoClicar={() => aoSalvar(cnpj, codigo, descricao)} estilo="vermilion" size="medium" filled>Confirmar</Botao>
                            </div>
                        </form>
                    </DialogEstilizado>
                </Overlay>
            </>
            }
        </>
    )
}

export default ModalAdicionarSindicato