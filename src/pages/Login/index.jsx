import Banner from "../../components/Banner"
import Botao from "../../components/Botao"
import CampoTexto from "../../components/CampoTexto"
import ContainerPrincipal from "../../components/ContainerPrincipal"
import Frame from "../../components/Frame"
import Main from "../../components/Main"
import PrecisoDeAjuda from "../../components/PrecisoDeAjuda"
import SubTitulo from "../../components/SubTitulo"
import Titulo from "../../components/Titulo"

function Login() {
    return (
        <ContainerPrincipal>
            <Banner />
            <Main>
                <Titulo>
                    <h2>Bem-vindo</h2>
                    <SubTitulo>
                    Acesse a área da sua empresa
                    </SubTitulo>
                </Titulo>
                <Frame>
                    <CampoTexto type="email" label="E-mail corporativo" placeholder="Digite seu e-mail corporativo" />
                    <CampoTexto type="password" label="Senha" placeholder="Digite sua senha" />
                </Frame>
                <Botao estilo="vermilion" size="medium" filled>Confirmar</Botao>
                <PrecisoDeAjuda/>
            </Main>
        </ContainerPrincipal>
    )
}

export default Login