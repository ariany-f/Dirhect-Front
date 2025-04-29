import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import { RiCloseFill } from 'react-icons/ri'
import { useEffect, useState } from "react"
import styles from './ModalAlterar.module.css'
import { Overlay, DialogEstilizado } from '@components/Modal/styles'

function ModalAlterarInscricaoMunicipal({ opened = false, aoClicar, aoFechar, dadoAntigo }) {
    const [inscricao_municipal, setInscricaoMunicipal] = useState(dadoAntigo)
    const [classError, setClassError] = useState([])
    
    useEffect(() => {
        /** Preenche o input com o dado atual */
        setInscricaoMunicipal(dadoAntigo)
        
    }, [dadoAntigo])

    const salvarDados = () => {
        aoClicar(inscricao_municipal)
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
                            valor={inscricao_municipal} 
                            type="text" 
                            setValor={setInscricaoMunicipal} 
                            label={'Inscrição Municipal'}
                        />
                    </Frame>
                    <form method="dialog">
                        <div className={styles.containerBottom}>
                            <Botao aoClicar={fecharModal} estilo="neutro" formMethod="dialog" size="medium" filled>Voltar</Botao>
                            <Botao aoClicar={salvarDados} estilo="vermilion" size="medium" filled>Salvar</Botao>
                        </div>
                    </form>
                </DialogEstilizado>
            </Overlay>}
        </>
    )
}

export default ModalAlterarInscricaoMunicipal