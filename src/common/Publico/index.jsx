import MainSection from "@components/MainSection"
import EstilosGlobais from '@components/GlobalStyles'
import Banner from "@components/Banner"
import MainContainer from "@components/MainContainer"
import Container from "@components/Container"
import PrecisoDeAjuda from "@components/PrecisoDeAjuda"
import { Outlet, useLocation } from "react-router-dom"
import RodapePublico from "@components/RodapePublico"
import { useSessaoUsuarioContext } from "../../contexts/SessaoUsuario"

function Publico() {

    return (
        <>
            <EstilosGlobais />
            <MainSection>
                <Banner />
                <Container>
                    <MainContainer>
                        <Outlet />
                        <PrecisoDeAjuda/>
                    </MainContainer>
                    <RodapePublico />
                </Container>
            </MainSection>
        </>
    )
}

export default Publico