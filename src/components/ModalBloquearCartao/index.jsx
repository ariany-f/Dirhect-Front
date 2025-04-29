import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Titulo from "@components/Titulo"
import Texto from "@components/Texto"
import { RiCloseFill } from 'react-icons/ri'
import styled from "styled-components"
import styles from './ModalBloquearCartao.module.css'
import { Overlay, DialogEstilizado } from '@components/Modal/styles'

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