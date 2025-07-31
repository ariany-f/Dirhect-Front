import Botao from "@components/Botao"
import Frame from "@components/Frame"
import SubTitulo from "@components/SubTitulo"
import Titulo from "@components/Titulo"
import BotaoVoltar from "@components/BotaoVoltar"
import CamposVerificacao from "@components/CamposVerificacao"
import { Link, useNavigate } from "react-router-dom"
import { useSessaoUsuarioContext } from "@contexts/SessaoUsuario"
import { Toast } from 'primereact/toast'
import { useRef } from "react"
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

function Seguranca() {

    const { t } = useTranslation('common')
    
    // const {
    //     usuario,
    //     setCode,
    //     submeterRecuperacaoSenha
    // } = useSessaoUsuarioContext()
    
    const navegar = useNavigate()
    // const toast = useRef(null)

    return (
        <>
            <Frame gap="16px">
                <BotaoVoltar />
                <Titulo>
                    <h2>{t('security')}</h2>
                    <SubTitulo>
                        Enviamos um link para o e-mail cadastrado
                    </SubTitulo>
                </Titulo>
            </Frame>
            <Botao aoClicar={() => navegar('/login')} estilo="vermilion" size="medium" filled>Voltar para o Login</Botao>
        </>
    )
}

export default Seguranca