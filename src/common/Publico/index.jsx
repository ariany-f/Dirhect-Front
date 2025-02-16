import MainSectionPublico from "@components/MainSectionPublico"
import EstilosGlobais from '@components/GlobalStyles'
import BannerMini from "@components/BannerMini"
import MainContainer from "@components/MainContainer"
import RightContainer from "@components/RightContainer"
import PrecisoDeAjuda from "@components/PrecisoDeAjuda"
import { Outlet } from "react-router-dom"
import RodapePublico from "@components/RodapePublico"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"


function Publico() {

    return (
        <>
            <EstilosGlobais />
            <MainSectionPublico>
                <RightContainer>
                <MainContainer>
                        <Outlet />
                    <RodapePublico />
                </MainContainer>
                </RightContainer>
                <BannerMini />
                
                <Analytics />
                <SpeedInsights />
            </MainSectionPublico>
        </>
    )
}

export default Publico