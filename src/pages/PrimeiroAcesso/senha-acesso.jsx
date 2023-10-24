import Botao from "@components/Botao"
import CampoTexto from "@components/CampoTexto"
import Frame from "@components/Frame"
import SubTitulo from "@components/SubTitulo"
import Titulo from "@components/Titulo"
import RegrasCriacaoSenha from "@components/RegrasCriacaoSenha"
import BotaoVoltar from "@components/BotaoVoltar"
import { useState } from "react"
import { Link } from "react-router-dom"

function SenhaDeAcesso() {
    
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')

    return (
       <>
        <Frame>
            <BotaoVoltar />
            <Titulo>
                <h2>Senha de acesso</h2>
                <SubTitulo>
                    Sua senha é de uso individual e intransferível. Essa informação é importante para o acesso restrito na sua conta. Seus dados pessoais são confidenciais e de sua responsabilidade.
                </SubTitulo>
            </Titulo>
        </Frame>
        <Frame>
            <CampoTexto name="senha" valor={senha} setValor={setSenha} type="password" label="Senha" placeholder="Digite sua senha" />
            <CampoTexto name="confirmar-senha" valor={confirmarSenha} setValor={setConfirmarSenha} type="password" label="Confirmar Senha" placeholder="Digite sua senha" />
            <RegrasCriacaoSenha />
        </Frame>
        <Link to="/dashboard">
            <Botao estilo="vermilion" size="medium" filled>Confirmar</Botao>
        </Link>
    </>
    )
}

export default SenhaDeAcesso