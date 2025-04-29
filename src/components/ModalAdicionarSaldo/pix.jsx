import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Texto from "@components/Texto"
import Titulo from "@components/Titulo"
import CampoTexto from "@components/CampoTexto"
import { RiCloseFill } from 'react-icons/ri'
import styled from "styled-components"
import { useState } from "react"
import styles from './ModalAdicionarSaldo.module.css'
import { currency, mask as masker, unMask } from "remask"
import { Overlay, DialogEstilizado } from '@components/Modal/styles'
import { Real } from '@utils/formats'

function ModalAdicionarSaldoPix({ opened = false, aoClicar, aoFechar }) {

    const [valor, setValor] = useState(Real.format(0))

    function removeMask(valor)
    {
        return currency.unmask({locale: 'pt-BR', currency: 'BRL', value: valor})
    }

    return(
        <>
            {opened &&
            <Overlay>
                <DialogEstilizado id="modal-add-departamento" open={opened}>
                    <Frame>
                        <Titulo>
                             <form method="dialog">
                                <button className="close" onClick={aoFechar} formMethod="dialog">
                                    <RiCloseFill size={20} className="fechar" />  
                                </button>
                            </form>
                            <h6>Pix</h6>
                        </Titulo>
                    </Frame>
                    <Frame padding="24px 0px">
                        <Texto>Adicionar crédito</Texto>
                        <CampoTexto 
                                valor={valor}
                                patternMask={'BRL'}
                                type="text" 
                                setValor={setValor} 
                                placeholder="R$ 0,00"
                                label="Valor do Pix"
                            />
                    </Frame>
                    <form method="dialog">
                        <div className={styles.containerBottom}>
                            <Botao aoClicar={aoFechar} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
                            <Botao aoClicar={() => aoClicar(removeMask(valor))} estilo="vermilion" size="medium" filled>Confirmar</Botao>
                        </div>
                    </form>
                </DialogEstilizado>
            </Overlay>}
        </>
    )
}

export default ModalAdicionarSaldoPix