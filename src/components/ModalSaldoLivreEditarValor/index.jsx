import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Titulo from "@components/Titulo"
import Texto from "@components/Texto"
import CampoTexto from "@components/CampoTexto"
import SubTitulo from "@components/SubTitulo"
import { RiCloseFill } from 'react-icons/ri'
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import styles from '@pages/Beneficios/Beneficios.module.css'
import { useEffect } from "react"
import { MdLocalAtm } from "react-icons/md"
import { currency, mask as masker, unMask } from "remask"
import { useRecargaSaldoLivreContext } from "@contexts/RecargaSaldoLivre"
import DottedLine from "@components/DottedLine"

const Overlay = styled.div`
    background-color: rgba(0,0,0,0.80);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    overflow-y: scroll;
    left: 0;
    display: flex;
    align-items: center;
`

const DialogEstilizado = styled.dialog`
    display: flex;
    width: 45vw;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    border: none;
    margin: 0 auto;
    margin-top: 1%;
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

const CardBeneficio = styled.div`
    display: flex;
    flex-wrap: wrap;
    display: flex;
    align-items: center;
    gap: 24px;
    align-self: stretch;
`

const Beneficio = styled.div`
   display: flex;
    width: 100%;
    padding: 16px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 24px;
    align-self: stretch;
    border-radius: 16px;
    border: 1px solid var(--neutro-200);
`

const Col12 = styled.div`
    display: flex;
    width: 100%;
    gap: 8px;
    justify-content: space-between;
`

const Col6Input = styled.div`
    flex: 1;
    width: 50%;
`

const Col6 = styled.div`
    flex: 1 1 50%;
    display: inline-flex;
    align-items: center;
    gap: 8px;
`

const LadoALado = styled.div`
    display: flex;
    gap: 24px;
    & span {
        display: flex;
        align-items: center;
    }
`

let Real = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

function ModalSaldoLivreEditarValor({ opened = false, aoClicar, aoFechar, selecionados = [], type="Filiais" }) {

    const {
        recarga,
        setBalance
    } = useRecargaSaldoLivreContext()

    const [valor, setValor] = useState(Real.format(0))
    const [total, setTotal] = useState(0)

    const navegar = useNavigate()

    function removeMask(valor)
    {
        return currency.unmask({locale: 'pt-BR', currency: 'BRL', value: valor})
    }
    
    useEffect(() => {
               
        setTotal((removeMask(valor)) * selecionados.length)

    }, [valor])

    function salvar() {
        selecionados.map(item => {
            const obj = item
            obj['amount'] = removeMask(valor)
            setBalance(obj)
        })
        setValor(Real.format(0))
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
                                <button className="close" onClick={aoFechar} formMethod="dialog">
                                    <RiCloseFill size={20} className="fechar" />  
                                </button>
                            </form>
                            <h5>Valor da recarga</h5>
                            <SubTitulo>Informe o valor da recarga para os filiais selecionadas:</SubTitulo>
                        </Titulo>
                        <Texto weight={700}>{type} selecionados(as)&nbsp;<span style={{fontWeight: '600', color: 'var(--primaria)'}}>{selecionados.length}</span></Texto>
                        <Titulo>
                            <h6 style={{ fontSize: '16px' }}>Saldo Livre</h6>
                            <SubTitulo>Digite o valor que permanecerá livre para o colaborador utilizar da melhor forma.</SubTitulo>
                        </Titulo>
                        <CardBeneficio>
                            <Beneficio>
                                <Col12>
                                   <Col6>
                                        <MdLocalAtm size={20} /><Texto weight={700}>Saldo Livre</Texto>
                                    </Col6>
                                </Col12>
                                <Col12>
                                    <Col6Input>
                                        <CampoTexto valor={valor} setValor={setValor} patternMask={'BRL'} label="Valor livre" placeholder="R$ 0,00"/>
                                    </Col6Input>
                                </Col12>
                            </Beneficio>
                        </CardBeneficio>
                        <DottedLine margin="2px"/>
                    </Frame>
                    
                    <form method="dialog">
                        <div className={styles.containerBottom}>
                            <Botao aoClicar={aoFechar} estilo="neutro" formMethod="dialog" size="medium" filled>Cancelar</Botao>
                            <LadoALado>
                                <span>Total&nbsp;<b>{Real.format(total)}</b><Texto color='var(--primaria)' weight={700}></Texto></span>
                                <Botao aoClicar={salvar} estilo="vermilion" size="medium" filled>Confirmar</Botao>
                            </LadoALado>
                        </div>
                    </form>
                </DialogEstilizado>
            </Overlay>}
        </>
    )
}

export default ModalSaldoLivreEditarValor