import MainSection from "@components/MainSection"
import BarraLateral from "@components/BarraLateral"
import Cabecalho from "@components/Cabecalho"
import MainContainer from "@components/MainContainer"

function Dashboard() {
    return (
        <MainSection>
            <BarraLateral />
            <MainContainer align="flex-start">
                <Cabecalho titulo="Plataforma RH" nomeEmpresa="Soluções Industriais Ltda" />
            </MainContainer>
        </MainSection>
    )
}

export default Dashboard