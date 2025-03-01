import MainSectionPublico from "@components/MainSectionPublico"
import EstilosGlobais from '@components/GlobalStyles'
import Banner from "@components/Banner"
import MainContainer from "@components/MainContainer"
import RightContainer from "@components/RightContainer"
import PrecisoDeAjuda from "@components/PrecisoDeAjuda"
import { Outlet } from "react-router-dom"
import RodapePublico from "@components/RodapePublico"
import { PrimeiroAcessoProvider } from "@contexts/PrimeiroAcesso"

function PrimeiroAcessoCommon() {
    return (
        <>
            <EstilosGlobais />
            <MainSectionPublico>
                <Banner />
                <RightContainer>
                    <PrimeiroAcessoProvider>
                        <MainContainer>
                            <Outlet/>
                            {/* <PrecisoDeAjuda/> */}
                        </MainContainer>
                    </PrimeiroAcessoProvider>
                    <RodapePublico />
                </RightContainer>
            </MainSectionPublico>
        </>
    )
}

export default PrimeiroAcessoCommon