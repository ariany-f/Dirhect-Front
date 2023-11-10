import Botao from "@components/Botao"
import CampoTexto from "@components/CampoTexto"
import Frame from "@components/Frame"
import SubTitulo from "@components/SubTitulo"
import Titulo from "@components/Titulo"
import RegrasCriacaoSenha from "@components/RegrasCriacaoSenha"
import BotaoVoltar from "@components/BotaoVoltar"
import { useState } from "react"
import { Link } from "react-router-dom"
import * as Yup from 'yup'

function RedefinirSenha() {
    
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')

    const validationSchema = Yup.object().shape({
        password: Yup.string().required('Necessário digitar senha'),
        passwordConfirmation: 
        Yup.string()
        .required('Necessário digitar confirmação de senha')
        .oneOf([Yup.ref('password')], 'As senhas devem coincidir'),
    });

    return (
        <>
            <Frame>
                <BotaoVoltar />
                <Titulo>
                    <h2>Redefinir senha</h2>
                    <SubTitulo>
                        Informe sua nova senha:
                    </SubTitulo>
                </Titulo>
            </Frame>
            <Frame>
                <CampoTexto name="senha" valor={senha} setValor={setSenha} type="password" label="Senha" placeholder="Digite sua senha" />
                <CampoTexto name="confirmar-senha" valor={confirmarSenha} setValor={setConfirmarSenha} type="password" label="Confirmar Senha" placeholder="Digite sua senha" />
                <RegrasCriacaoSenha />
            </Frame>
            <Link to="/login">
                <Botao estilo="vermilion" size="medium" filled>Confirmar</Botao>
            </Link>
        </>
    )
}

export default RedefinirSenha