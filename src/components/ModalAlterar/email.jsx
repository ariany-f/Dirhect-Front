import Botao from "@components/Botao"
import Frame from "@components/Frame"
import BotaoGrupo from "@components/BotaoGrupo"
import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import { RiCloseFill } from 'react-icons/ri'
import { useEffect, useState } from "react"
import styled from "styled-components"
import styles from './ModalAlterar.module.css'
import { Overlay, DialogEstilizado } from '@components/Modal/styles';
import { useTranslation } from "react-i18next"

function ModalAlterarEmail({ opened = false, aoClicar, aoFechar, dadoAntigo }) {
    const [email, setEmail] = useState(dadoAntigo)
    const [classError, setClassError] = useState([])
    const { t } = useTranslation('common');
    
    useEffect(() => {
        /** Preenche o input com o dado atual */
        setEmail(dadoAntigo)
        
    }, [dadoAntigo])

    const salvarDados = () => {
        aoClicar(email)
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
                            valor={email} 
                            type="text" 
                            setValor={setEmail} 
                            label={'E-mail'}
                        />
                    </Frame>
                    <form method="dialog">
                        <BotaoGrupo align="end">
                            <Botao aoClicar={fecharModal} estilo="neutro" formMethod="dialog" size="medium" filled>{t('back')}</Botao>
                            <Botao aoClicar={salvarDados} estilo="vermilion" size="medium" filled>Salvar</Botao>
                        </BotaoGrupo>
                    </form>
                </DialogEstilizado>
            </Overlay>}
        </>
    )
}

export default ModalAlterarEmail