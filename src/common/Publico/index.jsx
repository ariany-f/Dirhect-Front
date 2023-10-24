import MainSection from "@components/MainSection"
import EstilosGlobais from '@components/GlobalStyles';
import Banner from "@components/Banner"
import MainContainer from "@components/MainContainer"
import PrecisoDeAjuda from "@components/PrecisoDeAjuda"
import { Outlet } from "react-router-dom";

function Publico() {
    return (
        <>
            <EstilosGlobais />
            <MainSection>
                <Banner />
                <MainContainer>
                    <Outlet/>
                    <PrecisoDeAjuda/>
                </MainContainer>
            </MainSection>
        </>
    )
}

export default Publico