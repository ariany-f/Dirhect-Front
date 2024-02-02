import MainSectionPublico from "@components/MainSectionPublico"
import EstilosGlobais from '@components/GlobalStyles'
import Banner from "@components/Banner"
import MainContainer from "@components/MainContainer"
import RightContainer from "@components/RightContainer"
import PrecisoDeAjuda from "@components/PrecisoDeAjuda"
import { Outlet } from "react-router-dom"
import RodapePublico from "@components/RodapePublico"

function Publico() {

    return (
        <>
            <EstilosGlobais />
            <MainSectionPublico>
                <Banner />
                <RightContainer>
                    <MainContainer>
                        <Outlet />
                        <PrecisoDeAjuda/>
                    </MainContainer>
                    <RodapePublico />
                </RightContainer>
            </MainSectionPublico>
        </>
    )
}

export default Publico