import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Titulo from "@components/Titulo"
import Texto from "@components/Texto"
import { RiCloseFill } from 'react-icons/ri'
import styled from "styled-components"
import styles from './ModalSolicitarSegundaViaCartao.module.css'
import { Overlay, DialogEstilizado } from '@components/Modal/styles'

function ModalSolicitarSegundaViaCartao({ opened = false, aoClicar, aoFechar }) {       

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
                            <h6>Solicitar 2ª via</h6>
                        </Titulo>
                    </Frame>
                    <Frame padding="24px 0px">
                        <Texto>
                            
                        </Texto>
                    </Frame>
                    <form method="dialog">
                        <div className={styles.containerBottom}>
                            <Botao aoClicar={fecharModal} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
                            <Botao aoClicar={salvar} estilo="vermilion" size="medium" filled>Confirmar</Botao>
                        </div>
                    </form>
                </DialogEstilizado>
            </Overlay>}
        </>
    )
}

export default ModalSolicitarSegundaViaCartao