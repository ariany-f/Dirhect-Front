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
import Cards from 'react-credit-cards-2'
import 'react-credit-cards-2/dist/es/styles-compiled.css'
import { Overlay, DialogEstilizado } from '@components/Modal/styles'
import { Real } from '@utils/formats'

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
`

const Col6 = styled.div`
    padding: 10px;
    flex: 1 1 50%;
`

function ModalAdicionarSaldoCartao({ opened = false, aoClicar, aoFechar }) {   

    const [valor, setValor] = useState(Real.format(0))
    
    const [state, setState] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: '',
        focus: '',
    });

    function removeMask(valor)
    {
        return currency.unmask({locale: 'pt-BR', currency: 'BRL', value: valor})
    }
 
    const handleInputChange = (value, name) => {
        setState((prev) => ({ ...prev, [name]: value }));
    }
    
    const handleInputFocus = (evt) => {
        setState((prev) => ({ ...prev, focus: evt.target.name }));
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
                            <h6>Cartão de crédito</h6>
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
                                label="Valor"
                            />
                              <>
                                <Col12>
                                    <Col6>
                                        <CampoTexto label="Número do Cartão" name="number" valor={state.number} patternMask={['9999 999999 99999', '9999 9999 9999 9999']} setValor={handleInputChange} setFocus={handleInputFocus}/>
                                        <CampoTexto label="Nome no Cartão" name="name" setFocus={handleInputFocus} setValor={handleInputChange}/>
                                    </Col6>
                                    
                                    <Col6>
                                        <Cards
                                            cvc={state.cvc}
                                            expiry={state.expiry}
                                            focused={state.focus}
                                            name={state.name}
                                            number={state.number}
                                            />
                                    </Col6>
                                    <Col6>
                                        <CampoTexto label="Código do Cartão" name="cvc" setFocus={handleInputFocus} setValor={handleInputChange}/>
                                    </Col6>
                                    <Col6>
                                        <CampoTexto label="Validade do Cartão" name="expiry" patternMask={['99/99']} valor={state.expiry} setFocus={handleInputFocus} setValor={handleInputChange}/>
                                    </Col6>
                                </Col12>
                            </>
                    </Frame>
                    <form method="dialog">
                        <div className={styles.containerBottom}>
                            <Botao aoClicar={aoFechar} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
                            <Botao aoClicar={() => aoClicar(removeMask(valor), state)} estilo="vermilion" size="medium" filled>Confirmar</Botao>
                        </div>
                    </form>
                </DialogEstilizado>
            </Overlay>}
        </>
    )
}

export default ModalAdicionarSaldoCartao