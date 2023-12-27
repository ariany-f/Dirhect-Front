import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Texto from "@components/Texto"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import CamposVerificacao from "@components/CamposVerificacao"
import { AiOutlineMail } from 'react-icons/ai'
import { RiCloseFill } from 'react-icons/ri'
import styled from "styled-components"
import { useState, useEffect } from "react"

const Overlay = styled.div`
    background-color: rgba(0,0,0,0.80);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`

const ReenviarCodigoBotao = styled.div`
    font-size: 14px;
    font-weight: 300;
    color: var(--neutro-300);
    &.active {
        cursor: pointer;
        font-weight: 500;
        color: var(--primaria);
    }
`

const DialogEstilizado = styled.dialog`
    display: flex;
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

function ModalToken({ opened = false, usuario, setCode, aoClicar, aoFechar, aoReenviar }) {

    let [timer, setTimer] = useState(60)

    useEffect(() => {

        if (!timer){
            document.getElementById('reenviar').classList.add("active")
            return
        }; 

        if(!opened) {
            setTimer(60)
        }
    
        const intervalId = setInterval(() => {
            setTimer(timer - 1)
        }, 1000);
        
        return () => clearInterval(intervalId);
    
      }, [timer]);

      function reenviarCodigo()
      {
            if(timer === 0)
            {
                document.getElementById('reenviar').classList.remove("active")
                setTimer(60)
                aoReenviar()
            }
      }

      function confirmarCodigo()
      {
            setCode([])
            aoClicar()
      }

    return(
        <>
            {opened &&
            <>
                <Overlay>
                    <DialogEstilizado id="modal-token" open={opened}>
                        <Frame>
                            <Titulo>
                                <form method="dialog">
                                    <button className="close" onClick={aoFechar} formMethod="dialog">
                                        <RiCloseFill size={20} className="fechar" />  
                                    </button>
                                </form>
                                <h6>Código de segurança</h6>               
                                <SubTitulo>
                                    Digite o código de 6 dígitos, enviado para seu celular e e-mail:
                                </SubTitulo>
                            </Titulo>
                            <Texto weight="800" color="var(--primaria)">
                                <AiOutlineMail className="icon" size={18} />
                                &nbsp;{usuario.email}
                            </Texto>
                            <CamposVerificacao valor={usuario.code} setValor={setCode} label="Código de autenticação" />
                            <Frame alinhamento="center">
                                <ReenviarCodigoBotao onClick={reenviarCodigo} id="reenviar">Reenviar Código</ReenviarCodigoBotao>
                                {timer > 0 ?
                                    <Texto weight="300" color="var(--neutro-300)">
                                        <b>{timer}s</b>
                                    </Texto>
                                : '' }
                            </Frame>
                        </Frame>
                        <Botao aoClicar={confirmarCodigo} estilo="vermilion" size="medium" filled>Confirmar</Botao>
                    </DialogEstilizado>
                </Overlay>
            </>
            }
        </>
    )
}

export default ModalToken