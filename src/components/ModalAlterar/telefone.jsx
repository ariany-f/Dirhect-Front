import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import BotaoGrupo from "@components/BotaoGrupo"
import Titulo from "@components/Titulo"
import { RiCloseFill } from 'react-icons/ri'
import { useEffect, useState } from "react"
import styled from "styled-components"
import styles from './ModalAlterar.module.css'
import { Overlay, DialogEstilizado } from '@components/Modal/styles';

function ModalAlterarTelefone({ opened = false, aoClicar, aoFechar, dadoAntigo }) {
    const [telefone, setTelefone] = useState('')
    const [classError, setClassError] = useState([])
    
    useEffect(() => {
        /** Preenche o input com o dado atual */
        setTelefone(dadoAntigo)
        
    }, [dadoAntigo])

    const salvarDados = () => {
        aoClicar(telefone)
    }

    const fecharModal = () => {
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
                            <h6>Alterar Dados</h6>
                        </Titulo>
                    </Frame>
                    <Frame padding="24px 0px">
                        <CampoTexto 
                            camposVazios={classError} 
                            patternMask={['99 9999-9999', '99 99999-9999']} 
                            valor={telefone} 
                            type="text" 
                            setValor={setTelefone} 
                            label={'Telefone/Celular'}
                        />
                    </Frame>
                    <form method="dialog">
                        <BotaoGrupo align="end">
                            <Botao aoClicar={fecharModal} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
                            <Botao aoClicar={salvarDados} estilo="vermilion" size="medium" filled>Salvar</Botao>
                        </BotaoGrupo>
                    </form>
                </DialogEstilizado>
            </Overlay>}
        </>
    )
}

export default ModalAlterarTelefone