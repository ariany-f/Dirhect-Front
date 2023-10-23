import Banner from "@components/Banner"
import Botao from "@components/Botao"
import CampoTexto from "@components/CampoTexto"
import MainSection from "@components/MainSection"
import Frame from "@components/Frame"
import MainContainer from "@components/MainContainer"
import SubTitulo from "@components/SubTitulo"
import Titulo from "@components/Titulo"
import RegrasCriacaoSenha from "@components/RegrasCriacaoSenha"
import PrecisoDeAjuda from "@components/PrecisoDeAjuda"
import BotaoVoltar from "@components/BotaoVoltar"
import { useState } from "react"
import { Link } from "react-router-dom"

function RedefinirSenha() {
    
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')

    return (
        <MainSection>
            <Banner />
            <MainContainer>
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
                <Link to="/esqueci-a-senha/seguranca">
                    <Botao estilo="vermilion" size="medium" filled>Confirmar</Botao>
                </Link>
                <PrecisoDeAjuda/>
            </MainContainer>
        </MainSection>
    )
}

export default RedefinirSenha