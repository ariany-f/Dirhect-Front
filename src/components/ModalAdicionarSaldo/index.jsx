import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Texto from "@components/Texto"
import Titulo from "@components/Titulo"
import CampoTexto from "@components/CampoTexto"
import { RiCloseFill } from 'react-icons/ri'
import styled from "styled-components"
import styles from './ModalAdicionarSaldo.module.css'
import { useState } from "react"
import { currency, mask as masker, unMask } from "remask"
import { Overlay, DialogEstilizado } from '@components/Modal/styles'
import { Real } from '@utils/formats'
import { useTranslation } from "react-i18next"

function ModalAdicionarSaldoBoletoBancario({ opened = false, aoClicar, aoFechar }) {   

    const [valor, setValor] = useState(Real.format(0))
    const { t } = useTranslation('common');

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
                            <h6>Boleto bancário</h6>
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
                                label="Valor do Boleto"
                            />
                    </Frame>
                    <form method="dialog">
                        <div className={styles.containerBottom}>
                            <Botao aoClicar={aoFechar} estilo="neutro" formMethod="dialog" size="medium" filled>{t('back')}</Botao>
                            <Botao aoClicar={() => aoClicar(removeMask(valor))} estilo="vermilion" size="medium" filled>{t('confirm')}</Botao>
                        </div>
                    </form>
                </DialogEstilizado>
            </Overlay>}
        </>
    )
}

export default ModalAdicionarSaldoBoletoBancario