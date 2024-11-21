import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Titulo from "@components/Titulo"
import Texto from "@components/Texto"
import { RiCloseFill } from 'react-icons/ri'
import styled from "styled-components"
import styles from './ModalBloquearCartao.module.css'

const Overlay = styled.div`
    background-color: rgba(0,0,0,0.80);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`

const DialogEstilizado = styled.dialog`
    display: flex;
    width: 40vw;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    border: none;
    margin: 0 auto;
    top: 22vh;
    padding: 24px;
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
    & .frame:nth-of-type(1) {
        gap: 24px;
        & .frame {
            margin-bottom: 24px;
            & p{
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            & b {
                font-weight: 800;
                font-size: 14px;
            }
        }
    }
`

function ModalBloquearCartao({ opened = false, aoClicar, aoFechar }) {       

    const fecharModal = () => {
        aoFechar()
    }

    const salvar = () => {
        aoClicar()
        aoFechar()
    }

    return(
        <>
            {opened &&
            <Overlay>
                <DialogEstilizado id="modal-add-departamento" open={opened}>
                    <Frame>
                        <Titulo>
                             <form method="dialog">
                                <button className="close" onClick={fecharModal} formMethod="dialog">
                                    <RiCloseFill size={20} className="fechar" />  
                                </button>
                            </form>
                            <h6>Bloquear cartão</h6>
                        </Titulo>
                    </Frame>
                    <Frame padding="24px 0px">
                        <Texto>
                            Ao bloquear temporariamente o cartão, o colaborador não poderá fazer transações utilizando o cartão físico.
                        </Texto>
                    </Frame>
                    <form method="dialog">
                        <div className={styles.containerBottom}>
                            <Botao aoClicar={fecharModal} estilo="neutro" formMethod="dialog" size="small" filled>Manter desbloqueado</Botao>
                            <Botao aoClicar={salvar} estilo="vermilion" size="small" filled>Bloquear cartão</Botao>
                        </div>
                    </form>
                </DialogEstilizado>
            </Overlay>}
        </>
    )
}

export default ModalBloquearCartao