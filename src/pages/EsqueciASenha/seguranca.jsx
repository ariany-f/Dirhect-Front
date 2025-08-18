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
import styled from "styled-components"


const WrapperOut = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    align-self: stretch;
    width: 100%;
    @media (max-width: 768px) {
        margin-left: 0px;
        margin-right: 0px;
        height: 100vh;
        overflow-y: auto;
        padding: 0 4vw;
    }
`;
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
        <WrapperOut>
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
        </WrapperOut>
    )
}

export default Seguranca