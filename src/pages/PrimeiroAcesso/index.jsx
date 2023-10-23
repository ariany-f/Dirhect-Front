import Banner from "../../components/Banner"
import Botao from "../../components/Botao"
import CampoTexto from "../../components/CampoTexto"
import ContainerPrincipal from "../../components/ContainerPrincipal"
import Frame from "../../components/Frame"
import Main from "../../components/Main"
import SubTitulo from "../../components/SubTitulo"
import Texto from "../../components/Texto"
import Titulo from "../../components/Titulo"
import PrecisoDeAjuda from "../../components/PrecisoDeAjuda"

function PrimeiroAcesso() {
    return (
        <ContainerPrincipal>
            <Banner />
            <Main>
                <Titulo>
                    <h2>Bem-vindo, RH!</h2>
                    <SubTitulo>
                        Estamos muito felizes em recebê-lo aqui. Este é o seu primeiro passo, para começar informe seu e-mail corporativo:
                    </SubTitulo>
                </Titulo>
                <Frame>
                    <CampoTexto type="email" label="E-mail corporativo" placeholder="Digite seu e-mail corporativo" />
                    <CampoTexto label="Código de acesso" placeholder="Digite o código de acesso" />
                    <Frame estilo="vermilion" padding="16px">
                        <Texto>O código de acesso foi enviado parao e-mail corporativo cadastrado!</Texto>
                    </Frame>
                </Frame>
                <Botao estilo="vermilion" size="medium" filled>Confirmar</Botao>
                <PrecisoDeAjuda/>
            </Main>
        </ContainerPrincipal>
    )
}

export default PrimeiroAcesso