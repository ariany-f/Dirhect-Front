import Banner from "@components/Banner"
import Botao from "@components/Botao"
import CampoTexto from "@components/CampoTexto"
import MainSection from "@components/MainSection"
import Frame from "@components/Frame"
import MainContainer from "@components/MainContainer"
import PrecisoDeAjuda from "@components/PrecisoDeAjuda"
import SubTitulo from "@components/SubTitulo"
import Titulo from "@components/Titulo"
import { useState } from "react"

function Login() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    return (
        <MainSection>
            <Banner />
            <MainContainer>
                <Titulo>
                    <h2>Bem-vindo</h2>
                    <SubTitulo>
                    Acesse a área da sua empresa
                    </SubTitulo>
                </Titulo>
                <Frame>
                    <CampoTexto valor={email} setValor={setEmail} type="email" label="E-mail corporativo" placeholder="Digite seu e-mail corporativo" />
                    <CampoTexto valor={senha} setValor={setSenha} type="password" label="Senha" placeholder="Digite sua senha" />
                </Frame>
                <Botao estilo="vermilion" size="medium" filled>Confirmar</Botao>
                <PrecisoDeAjuda/>
            </MainContainer>
        </MainSection>
    )
}

export default Login